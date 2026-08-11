import type { Locale } from '../i18n/types'

export type PageId =
  | 'home'
  | 'journey'
  | 'machine'
  | 'pass'
  | 'results'
  | 'team'
  | 'media'
  | 'contact'

const SLUGS: Record<Locale, Record<PageId, string>> = {
  sv: {
    home: '',
    journey: 'resa',
    machine: 'maskinen',
    pass: 'passet',
    results: 'resultat',
    team: 'teamet',
    media: 'media',
    contact: 'sponsorer',
  },
  en: {
    home: '',
    journey: 'journey',
    machine: 'machine',
    pass: 'pass',
    results: 'results',
    team: 'team',
    media: 'media',
    contact: 'sponsors',
  },
}

const SLUG_TO_PAGE: Record<string, PageId> = {
  '': 'home',
  resa: 'journey',
  journey: 'journey',
  maskinen: 'machine',
  machine: 'machine',
  passet: 'pass',
  pass: 'pass',
  resultat: 'results',
  results: 'results',
  teamet: 'team',
  team: 'team',
  media: 'media',
  sponsorer: 'contact',
  sponsors: 'contact',
}

export function isLocale(value: string): value is Locale {
  return value === 'sv' || value === 'en'
}

export function localePath(lang: Locale, page: PageId): string {
  const slug = SLUGS[lang][page]
  return slug ? `/${lang}/${slug}` : `/${lang}`
}

export function pageFromSlug(slug: string | undefined): PageId {
  if (!slug) return 'home'
  return SLUG_TO_PAGE[slug] ?? 'home'
}

export function switchLocalePath(targetLang: Locale, page: PageId): string {
  return localePath(targetLang, page)
}

export function getPageIds(): PageId[] {
  return ['home', 'journey', 'machine', 'pass', 'results', 'team', 'media', 'contact']
}
