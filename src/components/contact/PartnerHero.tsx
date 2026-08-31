import { useT } from '../../i18n'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PartnerHero.css'

export function PartnerHero() {
  const t = useT()

  return (
    <Section wide className="partner-hero page-intro">
      <div className="partner-hero__layout">
        <Reveal className="partner-hero__copy" pace="launch">
          <p className="partner-hero__proof">{t.contact.proof}</p>
          <h1 className="partner-hero__title">
            <span className="sr-only">{t.contact.headline}</span>
            <span aria-hidden="true">
              {t.contact.headlineBefore}{' '}
              <span className="partner-hero__inline" />{' '}
              {t.contact.headlineAfter}
            </span>
          </h1>
          <p className="partner-hero__lead">{t.contact.pitchLead}</p>
          <p className="partner-hero__body">{t.contact.pitch}</p>
          <div className="partner-hero__actions">
            <Button href="#invite" icon>
              {t.contact.ctaPrimary}
            </Button>
            <Button href="#roster" variant="ghost">
              {t.contact.ctaSecondary}
            </Button>
          </div>
        </Reveal>

        <Reveal className="partner-hero__media" delay={0.08} y={28} variant="media" as="figure">
          <img
            src="/images/camaro_1.jpg"
            alt={t.contact.pitchAlt}
            width={2048}
            height={1366}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </Reveal>
      </div>
    </Section>
  )
}
