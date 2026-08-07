import { useContext } from 'react'
import type { Dictionary, Locale } from './types'
import { LocaleContext } from './context'

export function useLocale(): Locale {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx.locale
}

export function useT(): Dictionary {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useT must be used within LocaleProvider')
  return ctx.t
}
