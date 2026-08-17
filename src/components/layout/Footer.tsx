import { Link, useLocation } from 'react-router-dom'
import { useLocale, useT } from '../../i18n'
import { SITE } from '../../data/site'
import { localePath, pageFromSlug } from '../../lib/paths'
import { Button } from '../ui/Button'
import {
  usePrimaryNavItems,
  useSecondaryNavItems,
} from './useNavItems'
import './Footer.css'

const SOCIAL = [
  { id: 'facebook', label: 'Facebook', href: SITE.social.facebook },
  { id: 'instagram', label: 'Instagram', href: SITE.social.instagram },
  { id: 'youtube', label: 'YouTube', href: SITE.social.youtube },
] as const

export function Footer() {
  const t = useT()
  const locale = useLocale()
  const { pathname } = useLocation()
  const slug = pathname.split('/').filter(Boolean)[1]
  const hideCta = pageFromSlug(slug) === 'pass'
  const primary = usePrimaryNavItems()
  const secondary = useSecondaryNavItems()

  return (
    <footer className="site-footer">
      {hideCta ? null : (
      <div className="site-footer__cta">
        <h2 className="site-footer__cta-title">{t.footer.ctaTitle}</h2>
        <p className="site-footer__cta-body">{t.footer.ctaBody}</p>
        <Button to={localePath(locale, 'contact')} icon>
          {t.nav.contact}
        </Button>
      </div>
      )}

      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link
            to={localePath(locale, 'home')}
            className="site-footer__brand-link"
          >
            <img
              src="/logo/logo-grey-png.png"
              alt=""
              width={56}
              height={56}
              aria-hidden="true"
            />
            <span className="site-footer__brand-copy">
              <span className="site-footer__brand-name">{t.meta.siteName}</span>
              <span className="site-footer__brand-tag">{t.meta.tagline}</span>
            </span>
          </Link>
        </div>

        <nav className="site-footer__nav" aria-label={t.footer.quickLinks}>
          <div className="site-footer__col">
            <h3>{t.footer.quickLinks}</h3>
            <ul>
              <li>
                <Link to={localePath(locale, 'home')}>{t.nav.home}</Link>
              </li>
              {primary.map((item) => (
                <li key={item.id}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h3>{t.footer.more}</h3>
            <ul>
              {secondary.map((item) => (
                <li key={item.id}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h3>{t.footer.contact}</h3>
            <ul className="site-footer__contact">
              <li>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <a href={SITE.phoneHref}>{SITE.phone}</a>
              </li>
              <li>{t.common.locationValue}</li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="site-footer__bar">
        <p className="site-footer__rights">{t.footer.rights}</p>
        <ul className="site-footer__social" aria-label={t.footer.social}>
          {SOCIAL.map((item) => (
            <li key={item.id}>
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
