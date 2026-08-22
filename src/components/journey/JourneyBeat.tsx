import type { CSSProperties } from 'react'
import type { JourneyBeatEntry, TimelineWeight } from '../../data/timeline'
import { useT } from '../../i18n'
import { beatDomId } from './domIds'
import './JourneyBeat.css'

function mediaSizes(weight: TimelineWeight): string {
  switch (weight) {
    case 'regular':
      return '(min-width: 900px) 320px, 92vw'
    case 'record':
      return '(min-width: 900px) 640px, 96vw'
    default: {
      const _exhaustive: never = weight
      return _exhaustive
    }
  }
}

/**
 * A single beat in the career story. Layout weight is regular or record.
 * Year typography follows outcome. Optional quote is Anders in his own words.
 */
export function JourneyBeat({
  entry,
  as: Tag = 'li',
}: {
  entry: JourneyBeatEntry
  as?: 'li' | 'div'
}) {
  const t = useT()
  const mark = t.journey.marks[entry.id]
  const quote = t.journey.quotes[entry.id]

  return (
    <Tag
      id={beatDomId(entry.id)}
      className={`journey-beat journey-beat--${entry.weight}`}
      data-beat=""
      data-weight={entry.weight}
      data-outcome={entry.outcome}
      data-hold={entry.hold ? 'true' : undefined}
    >
      <span className="journey-beat__rule" aria-hidden="true" />

      <div className="journey-beat__copy">
        <h3 className="journey-beat__year">{entry.year}</h3>
        {mark ? <p className="journey-beat__mark">{mark}</p> : null}
        <p className="journey-beat__text">{t.journey.timeline[entry.id]}</p>
        {quote ? (
          <blockquote className="journey-beat__quote">
            <p>“{quote}”</p>
          </blockquote>
        ) : null}
      </div>

      {entry.media ? (
        <figure
          className="journey-beat__media"
          style={
            {
              '--beat-media-ratio': `${entry.media.width} / ${entry.media.height}`,
            } as CSSProperties
          }
        >
          <img
            src={entry.media.src}
            srcSet={entry.media.srcSet}
            sizes={mediaSizes(entry.weight)}
            width={entry.media.width}
            height={entry.media.height}
            loading={entry.media.priority ? 'eager' : 'lazy'}
            decoding="async"
            alt=""
          />
        </figure>
      ) : null}
    </Tag>
  )
}
