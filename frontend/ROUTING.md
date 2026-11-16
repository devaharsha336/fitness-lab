# How routing and prerendering fit together

`npm run build` runs `vite build`, then `scripts/prerender.mjs`.

## What ends up in `dist/`

| Path | File | Indexable |
|---|---|---|
| `/` | `index.html` — prerendered home | yes |
| `/classes`, `/gallery`, `/pricing`, `/contact` | `<route>/index.html` — prerendered | yes |
| `/owner-login`, `/dashboard` | `<route>/index.html` — empty shell + `noindex, nofollow` | no |
| anything else | `spa.html` via the rewrite — empty shell + `noindex, nofollow` | no |

## Why the catch-all points at `spa.html`

Vercel matches the filesystem **before** applying `rewrites`, so every real file
above is served directly and the rewrite only ever catches unknown URLs.

The catch-all must NOT point at `index.html`. Since `index.html` is now the
prerendered home page, doing so would serve the entire homepage — headings,
pricing, address — under any wrong URL with a `200`. That is a soft 404:
Google treats those URLs as real, indexable duplicates of the home page.

`spa.html` is a copy of the untouched Vite shell with `noindex, nofollow`
added. It boots React, which matches no route and renders `NotFound`.

A single-page app on Vercel cannot return a real `404` status for these URLs
without a serverless function; `noindex` on the shell is what keeps them out
of the index.

## Adding a public route

Add it to `PUBLIC_ROUTES` in `scripts/prerender.mjs` and to
`public/sitemap.xml`. Admin-only routes go in `ADMIN_ROUTES` instead.
