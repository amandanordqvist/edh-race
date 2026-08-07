import { Link } from 'react-router-dom'
import { useLocale, useT } from '../../i18n'
import { SITE } from '../../data/site'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { useNavItems } from './useNavItems'
import './Footer.css'

export function Footer() {
  const t = useT()
  const locale = useLocale()
  const items = useNavItems()

  return (
    <footer className="site-footer">
      <div className="site-footer__cta">
        <h2 className="site-footer__cta-title">{t.meta.siteName}</h2>
        <p className="site-footer__cta-body">{t.meta.tagline}</p>
        <Button to={localePath(locale, 'contact')} icon>
          {t.nav.contact}
        </Button>
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__col">
          <h3>{t.footer.quickLinks}</h3>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h3>{t.footer.contact}</h3>
          <ul>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <a href={SITE.phoneHref}>{SITE.phone}</a>
            </li>
            <li>{t.common.locationValue}</li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h3>{t.footer.social}</h3>
          <ul className="site-footer__social">
            <li>
              <a href={SITE.social.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href={SITE.social.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={SITE.social.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="site-footer__rights">{t.footer.rights}</p>
    </footer>
  )
}
