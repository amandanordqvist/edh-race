import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './JourneyHero.css'

/**
 * Staging: Anders' own line beside the moped plate, then the timeslip
 * on the left picks up the first year.
 */
export function JourneyHero() {
  const t = useT()

  return (
    <Section wide className="journey-hero page-intro">
      <div className="journey-hero__grid">
        <Reveal className="journey-hero__copy">
          <p className="journey-hero__eyebrow">{t.journey.timeslip.eyebrow}</p>
          <h1 className="journey-hero__title">{t.journey.title}</h1>
          <p className="journey-hero__lead">{t.journey.intro}</p>

          <figure className="journey-hero__quote">
            <p className="journey-hero__quote-label">{t.journey.beatChildhood}</p>
            <blockquote>
              <p>“{t.journey.quote1}”</p>
            </blockquote>
            <figcaption>— {t.journey.quote1Attr}</figcaption>
          </figure>
        </Reveal>

        <Reveal className="journey-hero__media" variant="media" delay={0.08}>
          <img
            src="/images/journey/webp/journey-1973.webp"
            srcSet="/images/journey/webp/journey-1973-960.webp 960w, /images/journey/webp/journey-1973.webp 1312w"
            sizes="(min-width: 900px) 36vw, 92vw"
            width={1312}
            height={736}
            alt={t.journey.heroAlt}
            decoding="async"
            fetchPriority="high"
          />
        </Reveal>
      </div>
    </Section>
  )
}
