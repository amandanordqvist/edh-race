import { timeline, type TimelineWeight } from '../../data/timeline'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './Timeline.css'

function weightClass(weight?: TimelineWeight) {
  switch (weight) {
    case 'climax':
      return 'timeline__item--climax'
    case 'peak':
      return 'timeline__item--peak'
    case 'valley':
      return 'timeline__item--valley'
    case 'quiet':
    case undefined:
      return 'timeline__item--quiet'
    default: {
      const _exhaustive: never = weight
      return _exhaustive
    }
  }
}

export function Timeline() {
  const t = useT()

  return (
    <Section wide className="timeline">
      <Reveal>
        <h2 className="timeline__heading">{t.journey.timelineTitle}</h2>
      </Reveal>
      <ol className="timeline__list">
        {timeline.map((entry, i) => (
          <Reveal
            as="li"
            key={entry.id}
            className={`timeline__item ${weightClass(entry.weight)}`}
            delay={Math.min(0.03 * i, 0.24)}
            y={24}
          >
            <div className="timeline__marker" aria-hidden="true" />
            <div className="timeline__card">
              <div className="timeline__copy">
                <p className="timeline__year">{entry.year}</p>
                <p className="timeline__text">{t.journey.timeline[entry.id]}</p>
              </div>
              {entry.image ? (
                <div className="timeline__media">
                  <img src={entry.image} alt="" loading="lazy" />
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
