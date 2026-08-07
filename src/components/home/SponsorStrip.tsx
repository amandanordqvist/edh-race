import { sponsors } from '../../data/sponsors'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './SponsorStrip.css'

export function SponsorStrip() {
  const t = useT()
  const loop = [...sponsors, ...sponsors]

  return (
    <Section className="sponsor-strip" wide>
      <Reveal>
        <h2 className="section__title">{t.home.sponsorsTitle}</h2>
        <p className="section__lead">{t.home.sponsorsBody}</p>
      </Reveal>

      <div className="sponsor-strip__marquee" aria-label={t.home.sponsorsTitle}>
        <div className="sponsor-strip__track">
          {loop.map((sponsor, i) => (
            <div
              className="sponsor-strip__logo"
              key={`${sponsor.id}-${i}`}
              aria-hidden={i >= sponsors.length}
            >
              <img src={sponsor.logo} alt={i < sponsors.length ? sponsor.name : ''} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
