/**
 * Per-page titles and meta descriptions.
 *
 * Titles stay under 60 characters and descriptions within 140-160, so Google
 * shows them whole rather than truncating. Each one names Manikonda or
 * Hyderabad (what local searches actually contain) and ends with a call to
 * action.
 */
export const PAGE_SEO = {
  home: {
    path: '/',
    title: 'The Fitness Lab | Best Gym in Manikonda, Hyderabad',
    description:
      'Premium gym in Manikonda, Hyderabad. Strength, cardio, HIIT, personal training and Hyrox with certified trainers. Visit us or book your session today.',
  },
  classes: {
    path: '/classes',
    title: 'Gym Classes & Programs in Manikonda | The Fitness Lab',
    description:
      'Personal training, HIIT, strength, kick boxing and Hyrox classes at The Fitness Lab, Manikonda, Hyderabad. Certified trainers, flexible timings. Join today.',
  },
  gallery: {
    path: '/gallery',
    title: 'Gallery | The Fitness Lab Gym, Manikonda Hyderabad',
    description:
      'Look inside The Fitness Lab in Manikonda: our cardio zone, strength floor, functional training area and reception. Premium gym in Hyderabad. Visit us today.',
  },
  pricing: {
    path: '/pricing',
    title: 'Gym Membership Prices in Manikonda | The Fitness Lab',
    description:
      'Gym membership plans in Manikonda, Hyderabad from ₹2,500 a month. Individual, couple and personal training packages. See all prices and join The Fitness Lab.',
  },
  contact: {
    path: '/contact',
    title: 'Contact | The Fitness Lab Gym, Manikonda Hyderabad',
    description:
      'Visit The Fitness Lab gym in Manikonda, Hyderabad. Open Mon–Sat, 5:30 AM to 10 PM. Call +91 99122 23125 or message us on WhatsApp to book your session.',
  },
}

// Guard rails: these limits are easy to break when someone edits the copy.
for (const [key, v] of Object.entries(PAGE_SEO)) {
  if (v.title.length > 60) console.warn(`[seo] ${key} title is ${v.title.length} chars (max 60)`)
  if (v.description.length < 140 || v.description.length > 160) {
    console.warn(`[seo] ${key} description is ${v.description.length} chars (want 140-160)`)
  }
}
