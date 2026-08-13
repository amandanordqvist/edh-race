import { entryById } from '../../data/timeline'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './JourneyNow.css'

/**
 * Chutes. The final row of the running timeslip — 3.87 s in Hudiksvall — is
 * echoed here as one last figure, followed by the philosophy quote. The
 * cursor upstream is at rest.
 */
export function JourneyNow() {
  const t = useT()
  const final = entryById('2026-season')

  return (
    <Section className="journey-now">
      <Reveal>
        <article className="journey-now__row" aria-label={final.year}>
          <div className="journey-now__row-head">
            <p className="journey-now__row-year">{final.year}</p>
            <p className="journey-now__row-distance">{final.distance}</p>
          </div>
          <p className="journey-now__row-et">
            <span>{final.et}</span>
            <span className="journey-now__row-unit">s</span>
          </p>
          <p className="journey-now__row-caption">{t.journey.finalRowCaption}</p>
        </article>

        <h2 className="journey-now__label">{t.journey.beatPhilosophy}</h2>
        <p className="journey-now__body">{t.journey.philosophy}</p>

        <figure className="journey-now__quote">
          <blockquote>
            <p>“{t.journey.quote2}”</p>
          </blockquote>
          <figcaption>— {t.journey.quote2Attr}</figcaption>
        </figure>
      </Reveal>
    </Section>
  )
}
