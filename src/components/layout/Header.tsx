import { useEffect, useState, type CSSProperties } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useNavItems } from './useNavItems'
import './Header.css'

export function Header() {
  const t = useT()
  const locale = useLocale()
  const items = useNavItems()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={`site-header ${open ? 'is-open' : ''}`}>
      <div className="site-header__island">
        <Link
          to={localePath(locale, 'home')}
          className="site-header__brand"
          onClick={() => setOpen(false)}
        >
          <img src="/logo/logo.png" alt="" width={36} height={36} aria-hidden="true" />
          <span>{t.meta.siteName}</span>
        </Link>

        <nav className="site-header__desktop" aria-label="Primary">
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <NavLink to={item.to} end={item.id === 'home'}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
        </nav>

        <button
          type="button"
          className="site-header__menu-btn"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={`burger ${open ? 'is-open' : ''}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`site-header__overlay ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
      >
        <nav className="site-header__overlay-nav" aria-label="Mobile">
          <ul>
            {items.map((item, i) => (
              <li
                key={item.id}
                style={{ '--i': i } as CSSProperties}
              >
                <NavLink
                  to={item.to}
                  end={item.id === 'home'}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="site-header__overlay-lang">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  )
}
