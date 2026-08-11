import { useLocale, useT } from '../../i18n'
import { localePath, type PageId } from '../../lib/paths'

const PRIMARY: PageId[] = ['journey', 'machine', 'contact']
const SECONDARY: PageId[] = ['pass', 'results', 'team', 'media']
const ALL: PageId[] = [
  'home',
  'journey',
  'machine',
  'pass',
  'results',
  'team',
  'media',
  'contact',
]

export type NavItem = { id: PageId; label: string; to: string }

/** Primary spine for header: Journey → Machine → Sponsors */
export function usePrimaryNavItems(): NavItem[] {
  const locale = useLocale()
  const t = useT()
  return PRIMARY.map((id) => ({
    id,
    label: t.nav[id],
    to: localePath(locale, id),
  }))
}

/** Secondary destinations for footer / mobile “more” */
export function useSecondaryNavItems(): NavItem[] {
  const locale = useLocale()
  const t = useT()
  return SECONDARY.map((id) => ({
    id,
    label: t.nav[id],
    to: localePath(locale, id),
  }))
}

/** Full sitemap */
export function useNavItems(): NavItem[] {
  const locale = useLocale()
  const t = useT()
  return ALL.map((id) => ({
    id,
    label: t.nav[id],
    to: localePath(locale, id),
  }))
}
