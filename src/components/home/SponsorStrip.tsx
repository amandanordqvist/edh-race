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
    <Section className="sponsor-strip" id="partners" wide>
      <Reveal className="sponsor-strip__intro" pace="settle">
        <p className="sponsor-strip__label">{t.home.sponsorsLabel}</p>
        <h2 className="section__title">{t.home.sponsorsTitle}</h2>
        <p className="section__lead">{t.home.sponsorsBody}</p>
        <div className="sponsor-strip__actions">
          <Button to={localePath(locale, 'contact')} icon>
            {t.home.sponsorsCta}
          </Button>
          <Button to={`${localePath(locale, 'home')}#partner-logos`} variant="ghost">
            {t.home.sponsorsCtaSecondary}
          </Button>
        </div>
      </Reveal>

      <div id="partner-logos">
        <Reveal className="sponsor-strip__grid" pace="settle" delay={0.08} stagger={0.08}>
          {sponsors.map((sponsor) => (
            <div
              className={`sponsor-strip__logo${sponsor.id === 'aine' ? ' sponsor-strip__logo--lead' : ''}`}
              key={sponsor.id}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                width={220}
                height={88}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
