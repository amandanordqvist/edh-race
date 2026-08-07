import { useEffect, useMemo, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { LocaleContext } from './context'
import { en } from './en'
import { sv } from './sv'
import type { Dictionary, Locale } from './types'
import { isLocale } from '../lib/paths'

const dictionaries: Record<Locale, Dictionary> = { sv, en }

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { lang } = useParams()
  const locale: Locale = lang && isLocale(lang) ? lang : 'sv'
  const t = dictionaries[locale]

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = `${t.meta.siteName} — ${t.meta.tagline}`
  }, [locale, t.meta.siteName, t.meta.tagline])

  const value = useMemo(() => ({ locale, t }), [locale, t])

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}
