import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PartnerPitch.css'

export function PartnerPitch() {
  const t = useT()
  const values = [
    t.contact.values.exposure,
    t.contact.values.beast,
    t.contact.values.precision,
  ]

  return (
    <Section wide className="partner-pitch page-intro">
      <div className="partner-pitch__layout">
        <Reveal className="partner-pitch__copy">
          <p className="partner-pitch__proof">{t.contact.proof}</p>
          <h1 className="partner-pitch__title">{t.contact.title}</h1>
          <p className="partner-pitch__lead">{t.contact.pitchLead}</p>
          <p className="partner-pitch__body">{t.contact.pitch}</p>
        </Reveal>

        <Reveal className="partner-pitch__media" delay={0.1} y={32} variant="media">
          <div className="partner-pitch__shell">
            <img
              src="/images/pricing.JPG"
              alt={t.contact.pitchAlt}
              width={1200}
              height={1600}
              loading="eager"
              decoding="async"
            />
          </div>
        </Reveal>
      </div>

      <Reveal className="partner-pitch__values" delay={0.08}>
        <h2 className="partner-pitch__values-title">{t.contact.valuesTitle}</h2>
        <ul className="partner-pitch__list">
          {values.map((value) => (
            <li key={value.title} className="partner-pitch__item">
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
