import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './JourneyHero.css'

/**
 * Staging: a blank timeslip form waits at the top of the page, every field
 * empty. The childhood quote sits beside it. Once the reader starts scrolling,
 * the cursor picks up in the running spine and the rows start filling in.
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

        <Reveal className="journey-hero__form" variant="media" delay={0.08}>
          <BlankTimeslipForm />
        </Reveal>
      </div>
    </Section>
  )
}

/**
 * The hero's blank timeslip: no year, no distance, no ET. Same grammar as the
 * running spine on the left of the page (same column widths, same tabular
 * numerals) so the reader recognises it later as the object they were shown.
 */
function BlankTimeslipForm() {
  const t = useT()

  return (
    <article
      className="journey-hero-slip"
      aria-label={t.journey.timeslip.eyebrow}
    >
      <header className="journey-hero-slip__header">
        <div>
          <p className="journey-hero-slip__eyebrow">
            {t.journey.timeslip.eyebrow}
          </p>
          <p className="journey-hero-slip__event">{t.journey.timeslip.event}</p>
        </div>
        <p className="journey-hero-slip__distance">
          {t.journey.timeslip.distance}
        </p>
      </header>

      <dl className="journey-hero-slip__grid">
        <div>
          <dt>{t.journey.timeslip.colYear}</dt>
          <dd>—</dd>
        </div>
        <div>
          <dt>{t.journey.timeslip.colDistance}</dt>
          <dd>—</dd>
        </div>
        <div>
          <dt>{t.journey.timeslip.colEt}</dt>
          <dd>—</dd>
        </div>
        <div>
          <dt>{t.journey.timeslip.colOutcome}</dt>
          <dd>—</dd>
        </div>
      </dl>
    </article>
  )
}
