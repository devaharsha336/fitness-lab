/**
 * Builds a srcset for the Unsplash programme/class photos.
 *
 * Those URLs carry Unsplash's own ?w= resizing parameter, so the browser can
 * be offered several widths instead of the single 800px file. The cards are
 * roughly half the viewport on desktop and full width on phones, so a phone
 * was downloading an 800px image to display it at ~190 CSS pixels.
 *
 * Non-Unsplash URLs (for example an image_url set from the dashboard) are
 * returned without a srcset rather than having parameters guessed onto them.
 */
const WIDTHS = [400, 600, 800]

export function unsplashSrcSet(url) {
  if (typeof url !== 'string' || !url.includes('images.unsplash.com')) return undefined
  try {
    return WIDTHS.map((w) => {
      const u = new URL(url)
      u.searchParams.set('w', String(w))
      return `${u.toString()} ${w}w`
    }).join(', ')
  } catch {
    return undefined
  }
}

/** Matches the card grids: two columns from the md breakpoint, one below. */
export const CARD_SIZES = '(min-width: 768px) 50vw, 100vw'
