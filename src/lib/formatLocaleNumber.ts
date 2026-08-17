import type { Locale } from '../i18n/types'

export function formatLocaleNumber(
  value: number,
  locale: Locale,
  fractionDigits: number,
): string {
  return value.toLocaleString(locale === 'sv' ? 'sv-SE' : 'en-GB', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}
