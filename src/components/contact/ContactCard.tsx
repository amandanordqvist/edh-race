import { SITE } from '../../data/site'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './ContactCard.css'

export function ContactCard() {
  const t = useT()

  return (
    <Section className="contact-card-section">
      <Reveal>
        <div className="contact-card">
          <ul>
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
        </div>
      </Reveal>
    </Section>
  )
}
