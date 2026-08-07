import { Link, useLocation } from 'react-router-dom'
import { useLocale, useT } from '../../i18n'
import {
  pageFromSlug,
  switchLocalePath,
  type PageId,
} from '../../lib/paths'
import './LanguageSwitcher.css'

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useT()
  const location = useLocation()
  const parts = location.pathname.split('/').filter(Boolean)
  const slug = parts[1]
  const page: PageId = pageFromSlug(slug)

  return (
    <div className="lang-switch" role="group" aria-label={t.lang.switchTo}>
      {(['sv', 'en'] as const).map((lang) => (
        <Link
          key={lang}
          to={switchLocalePath(lang, page)}
          className={`lang-switch__btn ${locale === lang ? 'is-active' : ''}`}
          aria-current={locale === lang ? 'true' : undefined}
        >
          {lang === 'sv' ? t.lang.sv : t.lang.en}
        </Link>
      ))}
    </div>
  )
}
