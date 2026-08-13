import type {
  JourneyBeatEntry,
  TimelineOutcome,
  TimeslipRow,
} from '../../data/timeline'
import { type Dictionary, useT } from '../../i18n'
import { beatDomId, bookendDomId } from './domIds'
import './JourneyTimeslip.css'

/**
 * The page's spine: a real drag-racing timeslip with one row per year, plus
 * two silent bookends where the calendar has gaps. The cursor position is
 * driven by scroll via a CSS variable that useJourneyScroll writes.
 *
 * No local state, no clicks handled here — the rows are plain in-page anchors,
 * so keyboard, back/forward and browser find all keep working for free.
 */
export function JourneyTimeslip({
  rows,
}: {
  rows: readonly TimeslipRow[]
}) {
  const t = useT()

  return (
    <aside
      className="journey-timeslip"
      aria-label={t.journey.spineLabel}
      data-journey-timeslip=""
    >
      <header className="journey-timeslip__header">
        <p className="journey-timeslip__eyebrow">{t.journey.timeslip.eyebrow}</p>
        <p className="journey-timeslip__event">{t.journey.timeslip.event}</p>
        <p className="journey-timeslip__distance">
          {t.journey.timeslip.distance}
        </p>
      </header>

      <div
        className="journey-timeslip__col-headers"
        role="row"
        aria-hidden="true"
      >
        <span>{t.journey.timeslip.colYear}</span>
        <span>{t.journey.timeslip.colDistance}</span>
        <span>{t.journey.timeslip.colEt}</span>
      </div>

      <ol className="journey-timeslip__rows">
        <span
          className="journey-timeslip__cursor"
          data-journey-cursor=""
          aria-hidden="true"
        />
        {rows.map((row, index) => (
          <TimeslipRowEl key={rowKey(row)} row={row} index={index} t={t} />
        ))}
      </ol>
    </aside>
  )
}

function TimeslipRowEl({
  row,
  index,
  t,
}: {
  row: TimeslipRow
  index: number
  t: Dictionary
}) {
  if (row.kind === 'bookend') {
    return (
      <li
        className="journey-timeslip__row journey-timeslip__row--bookend"
        data-row-index={index}
        data-outcome="quiet"
      >
        <a className="journey-timeslip__link" href={`#${bookendDomId(row.id)}`}>
          <span className="journey-timeslip__year">{row.year}</span>
          <span className="journey-timeslip__cell journey-timeslip__cell--empty">
            —
          </span>
          <span className="journey-timeslip__cell journey-timeslip__cell--empty">
            —
          </span>
        </a>
      </li>
    )
  }

  return <BeatRow entry={row.entry} index={index} t={t} />
}

function BeatRow({
  entry,
  index,
  t,
}: {
  entry: JourneyBeatEntry
  index: number
  t: Dictionary
}) {
  const outcomeLabel = getOutcomeLabel(t, entry.outcome)
  const isBlank = entry.outcome === 'setback'
  const distance = entry.distance ?? '—'
  const et = entry.et ?? '—'

  return (
    <li
      className="journey-timeslip__row"
      data-row-index={index}
      data-outcome={entry.outcome}
      data-weight={entry.weight}
    >
      <a
        className="journey-timeslip__link"
        href={`#${beatDomId(entry.id)}`}
        aria-label={`${entry.year} — ${outcomeLabel}`}
      >
        <span className="journey-timeslip__year">{entry.year}</span>
        <span
          className={`journey-timeslip__cell ${
            distance === '—' ? 'journey-timeslip__cell--empty' : ''
          }`}
        >
          {isBlank ? '—' : distance}
        </span>
        <span
          className={`journey-timeslip__cell ${
            et === '—' ? 'journey-timeslip__cell--empty' : ''
          }`}
        >
          {isBlank ? '—' : et}
        </span>
      </a>
    </li>
  )
}

function getOutcomeLabel(t: Dictionary, outcome: TimelineOutcome): string {
  switch (outcome) {
    case 'quiet':
      return t.journey.timeslip.outcomeLabels.quiet
    case 'race':
      return t.journey.timeslip.outcomeLabels.race
    case 'record':
      return t.journey.timeslip.outcomeLabels.record
    case 'championship':
      return t.journey.timeslip.outcomeLabels.championship
    case 'setback':
      return t.journey.timeslip.outcomeLabels.setback
    case 'rebuild':
      return t.journey.timeslip.outcomeLabels.rebuild
    default: {
      const _exhaustive: never = outcome
      return _exhaustive
    }
  }
}

function rowKey(row: TimeslipRow): string {
  return row.kind === 'beat' ? row.id : row.id
}
