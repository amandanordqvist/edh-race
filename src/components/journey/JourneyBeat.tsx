import type { CSSProperties } from 'react'
import type { JourneyBeatEntry, TimelineWeight } from '../../data/timeline'
import { useT } from '../../i18n'
import './JourneyBeat.css'

function weightClass(weight: TimelineWeight): string {
  switch (weight) {
    case 'quiet':
      return 'journey-beat--quiet'
    case 'valley':
      return 'journey-beat--valley'
    case 'peak':
      return 'journey-beat--peak'
    case 'climax':
      return 'journey-beat--climax'
    default: {
      const _exhaustive: never = weight
      return _exhaustive
    }
  }
}

/** Display width the media can actually reach, so we never request more. */
function mediaSizes(weight: TimelineWeight): string {
  switch (weight) {
    case 'quiet':
    case 'valley':
      return '(min-width: 900px) 264px, 92vw'
    case 'peak':
      return '(min-width: 900px) 496px, 92vw'
    case 'climax':
      return '(min-width: 900px) 720px, 92vw'
    default: {
      const _exhaustive: never = weight
      return _exhaustive
    }
  }
}

export function beatDomId(id: string): string {
  return `beat-${id}`
}

export function JourneyBeat({
  entry,
  as: Tag = 'li',
}: {
  entry: JourneyBeatEntry
  as?: 'li' | 'div'
}) {
  const t = useT()
  const mark = t.journey.marks[entry.id]

  return (
    <Tag
      id={beatDomId(entry.id)}
      className={`journey-beat ${weightClass(entry.weight)}`}
      data-beat=""
    >
      <span className="journey-beat__rule" aria-hidden="true" />

      <div className="journey-beat__copy">
        <h3 className="journey-beat__year">{entry.year}</h3>
        {mark ? <p className="journey-beat__mark">{mark}</p> : null}
        <p className="journey-beat__text">{t.journey.timeline[entry.id]}</p>
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
