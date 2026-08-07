import { useLocale, useT } from '../../i18n'
import { getPageIds, localePath, type PageId } from '../../lib/paths'

export function useNavItems(): { id: PageId; label: string; to: string }[] {
  const locale = useLocale()
  const t = useT()
  return getPageIds().map((id) => ({
    id,
    label: t.nav[id],
    to: localePath(locale, id),
  }))
}
