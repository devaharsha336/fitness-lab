import { Helmet } from 'react-helmet-async'
import { SITE_URL, BUSINESS, SOCIAL_LINKS } from '../config/site'

/**
 * schema.org JSON-LD for the gym.
 *
 * ExerciseGym (a LocalBusiness subtype) is what Google uses for the local
 * pack and knowledge panel, so the details here must match the footer and
 * contact page exactly — mismatched name/address/phone is a negative trust
 * signal.
 *
 * Fields are omitted rather than guessed. Three are outstanding:
 *   - postalCode: not supplied, so PostalAddress has no postal code.
 *   - email:      none exists anywhere in the project.
 *   - geo:        no coordinates supplied; helps local pack ranking.
 * Add them to src/config/site.js and they flow through automatically.
 */

function buildGymSchema() {
  const address = {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.street,
    addressLocality: `${BUSINESS.address.locality}, ${BUSINESS.address.city}`,
    addressRegion: BUSINESS.address.region,
    addressCountry: BUSINESS.address.country,
  }
  if (BUSINESS.address.postalCode) address.postalCode = BUSINESS.address.postalCode

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    '@id': `${SITE_URL}/#gym`,
    name: BUSINESS.name,
    description:
      'Premium gym in Manikonda, Hyderabad offering strength training, cardio, HIIT, personal training, Hyrox and group fitness classes with certified trainers.',
    url: SITE_URL,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: BUSINESS.phonePrimary,
    address,
    hasMap: BUSINESS.mapUrl,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: 'INR',
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '05:30',
        closes: '12:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '17:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '06:00',
        closes: '10:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '17:00',
        closes: '21:00',
      },
    ],
  }

  if (BUSINESS.email) schema.email = BUSINESS.email
  if (BUSINESS.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    }
  }
  return schema
}

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: BUSINESS.name,
  url: SITE_URL,
  inLanguage: 'en-IN',
  publisher: { '@id': `${SITE_URL}/#gym` },
}

export default function StructuredData() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(buildGymSchema())}</script>
      <script type="application/ld+json">{JSON.stringify(WEBSITE_SCHEMA)}</script>
    </Helmet>
  )
}
