import { SITE } from '../../data/site'
import { useT } from '../../i18n'
import './ContactCard.css'

export function ContactCard() {
  const t = useT()

  return (
    <ul className="contact-card">
      <li>
        <span>{t.common.email}</span>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </li>
      <li>
        <span>{t.common.phone}</span>
        <a href={SITE.phoneHref}>{SITE.phone}</a>
      </li>
      <li>
        <span>{t.common.location}</span>
        <strong>{t.common.locationValue}</strong>
      </li>
    </ul>
  )
}
