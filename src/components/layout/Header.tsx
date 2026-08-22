import { useEffect, useState, type CSSProperties } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { LanguageSwitcher } from './LanguageSwitcher'
import { usePrimaryNavItems, useSecondaryNavItems } from './useNavItems'
import './Header.css'

export function Header() {
  const t = useT()
  const locale = useLocale()
  const primary = usePrimaryNavItems()
  const secondary = useSecondaryNavItems()
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
          <img
            src="/logo/logo-grey-png.png"
            alt={t.meta.siteName}
            width={56}
            height={56}
          />
        </Link>

        <nav className="site-header__desktop" aria-label="Primary">
          <ul>
            {primary.map((item) => (
              <li key={item.id}>
                <NavLink to={item.to}>{item.label}</NavLink>
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
          <span className="sr-only">{open ? t.common.closeMenu : t.common.openMenu}</span>
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
            {primary.map((item, i) => (
              <li key={item.id} style={{ '--i': i } as CSSProperties}>
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <p className="site-header__overlay-more-label">{t.footer.more}</p>
          <ul className="site-header__overlay-secondary">
            {secondary.map((item, i) => (
              <li
                key={item.id}
                style={{ '--i': primary.length + i } as CSSProperties}
              >
                <NavLink
                  to={item.to}
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
