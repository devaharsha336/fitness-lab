import { Helmet } from 'react-helmet-async'
import { SITE_URL, BUSINESS } from '../config/site'

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

/**
 * Per-page head tags: title, meta description, canonical, Open Graph and
 * Twitter card.
 *
 * Every public page passes its own title and description; both are written to
 * stay inside the lengths Google will display (roughly 60 and 160 characters)
 * and to name Manikonda or Hyderabad, which is what local searches use.
 *
 * Because the build prerenders each route in a real browser after React has
 * run, whatever this renders ends up baked into that route's static HTML.
 *
 * @param {boolean} noindex  For admin pages, which must never be indexed.
 */
export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
}) {
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}

      {/* Open Graph — used by WhatsApp, Facebook and most link previews. */}
      <meta property="og:site_name" content={BUSINESS.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${BUSINESS.name} — gym in Manikonda, Hyderabad`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
