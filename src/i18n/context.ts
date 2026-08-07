import { createContext } from 'react'
import type { Dictionary, Locale } from './types'

export type LocaleContextValue = {
  locale: Locale
  t: Dictionary
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
