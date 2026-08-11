import { sponsors } from '../../data/sponsors'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './SponsorStrip.css'

export function SponsorStrip() {
  const t = useT()
  const locale = useLocale()

  return (
    <Section className="sponsor-strip" wide>
      <Reveal className="sponsor-strip__intro">
        <h2 className="section__title">{t.home.sponsorsTitle}</h2>
        <p className="section__lead">{t.home.sponsorsBody}</p>
        <ul className="sponsor-strip__benefits">
          {t.home.sponsorsBenefits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Button to={localePath(locale, 'contact')} icon>
          {t.home.sponsorsCta}
        </Button>
      </Reveal>

      <Reveal className="sponsor-strip__grid" delay={0.08} stagger={0.1} y={28}>
        {sponsors.map((sponsor) => (
          <div className="sponsor-strip__logo" key={sponsor.id}>
            <img src={sponsor.logo} alt={sponsor.name} loading="lazy" decoding="async" />
          </div>
        ))}
      </Reveal>
    </Section>
  )
}
