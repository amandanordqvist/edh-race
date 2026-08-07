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
      <Reveal>
        <h1 className="partner-pitch__title">{t.contact.title}</h1>
        <p className="partner-pitch__lead">{t.contact.pitchLead}</p>
        <p className="partner-pitch__body">{t.contact.pitch}</p>
      </Reveal>

      <Reveal className="partner-pitch__values" delay={0.08}>
        <h2 className="partner-pitch__values-title">{t.contact.valuesTitle}</h2>
        <ul className="partner-pitch__list">
          {values.map((value, i) => (
            <li
              key={value.title}
              className={`partner-pitch__item ${i === 0 ? 'partner-pitch__item--lead' : ''}`}
            >
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
