/**
 * Single source of truth for The Fitness Lab's business details.
 *
 * Everything the site says about the gym — phone numbers, address, hours,
 * social links — lives here so it can be changed in one place and stays
 * identical across the footer, the contact page and the JSON-LD structured
 * data. Search engines treat mismatched NAP (name/address/phone) details as a
 * trust signal, so these must not drift apart.
 */

// ---------------------------------------------------------------------------
// TODO (before merging): replace with the real Google Form link.
// This placeholder is live on every "Fill the Form" button on the site; the
// buttons will 404 until it is swapped. Nothing else blocks the deploy.
// ---------------------------------------------------------------------------
export const GOOGLE_FORM_URL = 'https://forms.gle/REPLACE_ME'

export const SITE_URL = 'https://thefitnesslab.co.in'

export const BUSINESS = {
  name: 'The Fitness Lab',
  legalName: 'The Fitness Lab',
  tagline: 'Where science meets sweat',

  // Primary number: used for schema telephone and as the WhatsApp contact.
  phonePrimary: '+919912223125',
  phonePrimaryDisplay: '+91 99122 23125',
  phoneSecondary: '+918125034011',
  phoneSecondaryDisplay: '+91 81250 34011',

  // TODO: no email address was supplied; omitted from the footer and the
  // JSON-LD rather than invented. Add it here and to the schema when known.
  email: null,

  address: {
    street: 'PVSR Palace, 3rd & 4th Floor, Sri Ram Nagar Colony, Golden Temple Rd',
    locality: 'Manikonda',
    region: 'Telangana',
    city: 'Hyderabad',
    country: 'IN',
    // TODO: postcode not supplied; left out of the JSON-LD PostalAddress.
    postalCode: null,
  },

  // TODO: coordinates not supplied; the "geo" block is omitted from the
  // JSON-LD. Local pack ranking benefits from these when available.
  geo: null,

  mapUrl: 'https://share.google/HdkgsfHTe9xOIv1ze',

  // Matches the Contact page timings table exactly.
  hours: {
    weekdays: { days: 'Mon – Sat', morning: '5:30 AM – 12:00 PM', evening: '5:00 PM – 10:00 PM' },
    sunday: { days: 'Sunday', morning: '6:00 AM – 10:00 AM', evening: '5:00 PM – 9:00 PM' },
  },

  priceRange: '₹₹',
}

export const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0'

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D',
  facebook: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F',
  whatsapp: WHATSAPP_URL,
  maps: 'https://share.google/HdkgsfHTe9xOIv1ze',
}

/** Formatted single-line address, used in the footer and contact page. */
export const ADDRESS_SHORT = `${BUSINESS.address.street}, ${BUSINESS.address.locality}`
export const ADDRESS_FULL = [
  BUSINESS.address.street,
  BUSINESS.address.locality,
  BUSINESS.address.city,
  BUSINESS.address.region,
  BUSINESS.address.postalCode,
  'India',
].filter(Boolean).join(', ')
