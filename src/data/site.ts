export const SITE = {
  email: 'edhracing@gmail.com',
  phone: '+46 70 207 32 55',
  phoneHref: 'tel:+46702073255',
  /** Production origin for canonical, hreflang, sitemap and JSON-LD. Verify before launch. */
  origin: 'https://edh-race.vercel.app',
  logoPath: '/logo/logo.png',
  ogImagePath: '/images/og-edh-racing.webp',
  location: {
    locality: 'Hudiksvall',
    country: 'SE',
  },
  social: {
    facebook: 'https://www.facebook.com/edhracing',
    instagram: 'https://www.instagram.com/',
    youtube: 'https://www.youtube.com/',
  },
  maker: {
    name: 'AINE',
    href: 'https://ai-ne.se',
  },
} as const
