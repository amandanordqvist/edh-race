import {
  timeline,
  timelineChapters,
  type TimelineChapter,
  type TimelineEntry,
  type TimelineWeight,
} from '../../data/timeline'
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

function entriesFor(chapter: TimelineChapter): TimelineEntry[] {
  return timeline.filter((entry) => entry.chapter === chapter)
}

function TimelineItem({
  entry,
  delay,
}: {
  entry: TimelineEntry
  delay: number
}) {
  const t = useT()

  return (
    <Reveal
      as="li"
      className={`timeline__item ${weightClass(entry.weight)}`}
      delay={delay}
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
  )
}

export function Timeline() {
  const t = useT()

  return (
    <Section wide className="timeline">
      <Reveal>
        <h2 className="timeline__heading">{t.journey.timelineTitle}</h2>
      </Reveal>

      <div className="timeline__chapters">
        {timelineChapters.map((chapter) => {
          const entries = entriesFor(chapter)
          const openByDefault = chapter === 'elite' || chapter === 'record'

          return (
            <details
              key={chapter}
              className="timeline__chapter"
              open={openByDefault}
            >
              <summary className="timeline__chapter-summary">
                <span className="timeline__chapter-name">
                  {t.journey.chapters[chapter]}
                </span>
                <span className="timeline__chapter-count">
                  {entries[0]?.year}–{entries[entries.length - 1]?.year}
                </span>
              </summary>
              <ol className="timeline__list">
                {entries.map((entry, i) => (
                  <TimelineItem
                    key={entry.id}
                    entry={entry}
                    delay={Math.min(0.03 * i, 0.18)}
                  />
                ))}
              </ol>
            </details>
          )
        })}
      </div>
    </Section>
  )
}
