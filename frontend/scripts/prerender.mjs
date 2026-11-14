#!/usr/bin/env node
/**
 * Post-build prerenderer for The Fitness Lab.
 *
 * The site is a client-rendered SPA, so the raw HTML Vercel serves contains
 * nothing but <div id="root"></div>. Crawlers (and every social preview bot)
 * therefore see no headings, no address, no pricing. This script loads each
 * public route in a real headless Chromium after `vite build`, waits for React
 * to render, and writes the resulting DOM back out as a static HTML file.
 *
 * Vercel checks the filesystem BEFORE applying the rewrites in vercel.json, so
 * dist/classes/index.html is served for /classes automatically. vercel.json
 * needs no changes.
 *
 * FAIL-SAFE BY DESIGN: prerendering is an enhancement, never a build gate.
 * Any failure here - Chromium missing, a route throwing, the backend being
 * asleep - logs a warning and exits 0, leaving the normal SPA build in place.
 * A broken prerender must never break a deploy.
 */
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '..', 'dist')

/** Public routes that should exist as real, crawlable HTML. */
const PUBLIC_ROUTES = ['/', '/classes', '/gallery', '/pricing', '/contact']

/** Admin routes: never snapshotted, and emitted as noindex stubs instead. */
const ADMIN_ROUTES = ['/owner-login', '/dashboard']

/** How long to let the (possibly cold-starting) Render backend respond. */
const API_WAIT_MS = Number(process.env.PRERENDER_API_WAIT ?? 20000)
const NAV_TIMEOUT_MS = Number(process.env.PRERENDER_NAV_TIMEOUT ?? 30000)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

const log = (msg) => console.log(`[prerender] ${msg}`)

function bail(reason, err) {
  console.warn('')
  console.warn(`[prerender] WARNING: ${reason}`)
  if (err) console.warn(`[prerender] ${err.stack || err.message || err}`)
  console.warn('[prerender] Skipping prerendering and shipping the standard SPA build.')
  console.warn('[prerender] The site will still work; its raw HTML just stays empty.')
  console.warn('')
  process.exit(0)
}

/** Serve dist/ over http, with the SPA fallback the browser needs for deep links. */
function startStaticServer(shellHtml) {
  return new Promise((resolvePort, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
        const candidate = join(DIST, urlPath)
        if (urlPath !== '/' && existsSync(candidate) && extname(candidate)) {
          const body = await readFile(candidate)
          res.writeHead(200, { 'Content-Type': MIME[extname(candidate).toLowerCase()] || 'application/octet-stream' })
          return res.end(body)
        }
        // Any route (known or not) gets the untouched SPA shell, so React routes it.
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(shellHtml)
      } catch (err) {
        res.writeHead(500)
        res.end(String(err))
      }
    })
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => resolvePort({ server, port: server.address().port }))
  })
}

/**
 * Vercel's build image is missing libnspr4/libnss3 and friends, and you cannot
 * apt-get them from inside a build (no root). Playwright's and Puppeteer's own
 * downloaded Chromium therefore will not launch there. @sparticuz/chromium
 * bundles those libraries with the binary, which is exactly why it exists.
 * Locally we reuse whatever Chrome is already installed, so neither
 * environment needs a 150MB browser download.
 */
async function launchBrowser() {
  const { default: puppeteer } = await import('puppeteer-core')

  if (process.env.VERCEL) {
    log('Vercel build detected - using bundled serverless Chromium.')
    const { default: chromium } = await import('@sparticuz/chromium')
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 900 },
      executablePath: await chromium.executablePath(),
      // Deliberately no `headless` flag: chromium.args already passes
      // --headless='shell' and setting both conflicts.
    })
  }

  const localPaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ]
  const opts = { headless: true, defaultViewport: { width: 1280, height: 900 }, args: ['--no-sandbox'] }

  try {
    return await puppeteer.launch({ ...opts, channel: 'chrome' })
  } catch {
    const found = localPaths.find((p) => existsSync(p))
    if (!found) throw new Error('No local Chrome or Chromium found. Install Chrome, or set PRERENDER_CHROME to its path.')
    log(`Using local browser at ${found}`)
    return puppeteer.launch({ ...opts, executablePath: process.env.PRERENDER_CHROME || found })
  }
}

async function snapshot(browser, origin, route) {
  const page = await browser.newPage()
  try {
    // Images and fonts change nothing about the HTML we capture, so skip them.
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      if (['image', 'font', 'media'].includes(req.resourceType())) req.abort().catch(() => {})
      else req.continue().catch(() => {})
    })

    await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS })
    // React has rendered once the page's single <h1> exists.
    await page.waitForSelector('h1', { timeout: NAV_TIMEOUT_MS })

    // Give the backend a chance to answer; fall through to the bundled
    // fallback data if it is cold-starting or unreachable.
    try {
      await page.waitForNetworkIdle({ idleTime: 600, timeout: API_WAIT_MS })
    } catch {
      log(`${route}: backend did not settle within ${API_WAIT_MS}ms - captured with fallback data.`)
    }

    // The page reveals content with IntersectionObserver, so anything below the
    // fold keeps the opacity:0 ".animate-on-scroll" state. Captured as-is, the
    // home page ships 20+ invisible content blocks. Scrolling fires the
    // observers the way a real visitor would (and starts the stat counters),
    // then we force anything still unrevealed as a safety net.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 120))
      }
      window.scrollTo(0, document.body.scrollHeight)
      await new Promise((r) => setTimeout(r, 300))
      window.scrollTo(0, 0)
    })
    // The stat counters animate from 0 over 2s; let them land on real figures.
    await new Promise((r) => setTimeout(r, 2200))
    await page.evaluate(() => {
      document
        .querySelectorAll(".animate-on-scroll, .animate-from-left")
        .forEach((el) => el.classList.add("visible"))
    })

    const html = await page.content()
    if (!html.includes('<h1') || html.length < 2000) {
      throw new Error(`captured HTML looks empty (${html.length} bytes)`)
    }
    return html
  } finally {
    await page.close().catch(() => {})
  }
}

async function writeRoute(route, html) {
  const target = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, html, 'utf8')
  return target
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    bail('dist/index.html not found - run `vite build` first.')
  }

  // Capture the pristine shell before we overwrite dist/index.html.
  const shellHtml = await readFile(join(DIST, 'index.html'), 'utf8')

  let browser
  let server
  try {
    const started = await startStaticServer(shellHtml)
    server = started.server
    const origin = `http://127.0.0.1:${started.port}`

    browser = await launchBrowser()

    const results = []
    for (const route of PUBLIC_ROUTES) {
      const html = await snapshot(browser, origin, route)
      const target = await writeRoute(route, html)
      const kb = (Buffer.byteLength(html) / 1024).toFixed(0)
      results.push({ route, kb })
      log(`${route.padEnd(12)} -> ${target.replace(DIST, 'dist')} (${kb} KB)`)
    }

    // The untouched Vite shell, plus noindex. Used for anything that must boot
    // the app without shipping indexable content.
    const noindexShell = shellHtml.replace(
      /<\/head>/,
      '  <meta name="robots" content="noindex, nofollow" />\n  </head>'
    )

    // Admin routes get that shell rather than a snapshot. Without this they
    // would fall through vercel.json's rewrite and serve prerendered content.
    for (const route of ADMIN_ROUTES) {
      const target = await writeRoute(route, noindexShell)
      log(`${route.padEnd(12)} -> ${target.replace(DIST, 'dist')} (noindex stub, not prerendered)`)
    }

    // The catch-all target for unknown URLs. vercel.json points its rewrite
    // here instead of at index.html: index.html is now the prerendered home
    // page, so using it would serve the whole homepage under any wrong URL
    // with a 200 - a soft 404 that Google indexes as a duplicate. React finds
    // no matching route in this shell and renders the NotFound view.
    await writeFile(join(DIST, 'spa.html'), noindexShell, 'utf8')
    log(`${'(catch-all)'.padEnd(12)} -> dist/spa.html (noindex shell for unknown URLs)`)

    log(`Done. Prerendered ${results.length} public routes, stubbed ${ADMIN_ROUTES.length} admin routes.`)
  } catch (err) {
    bail('prerendering failed.', err)
  } finally {
    await browser?.close().catch(() => {})
    server?.close()
  }
}

main().catch((err) => bail('unexpected prerender error.', err))
