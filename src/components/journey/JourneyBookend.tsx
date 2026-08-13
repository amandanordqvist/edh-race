import type { TimelineBookendId } from '../../data/timeline'
import { useT } from '../../i18n'
import { bookendDomId } from './domIds'
import './JourneyBookend.css'

/**
 * A silent chapter transition: a hairline year label and one line of copy.
 * Nothing is measured, nothing is claimed. The reader gets a beat of rest
 * between chapters, and the running timeslip has a target row for the cursor
 * to hold on.
 */
export function JourneyBookend({ id }: { id: TimelineBookendId }) {
  const t = useT()
  const copy = t.journey.bookends[id]

  return (
    <section
      id={bookendDomId(id)}
      className="journey-bookend"
      data-beat=""
      aria-label={copy.label}
    >
      <p className="journey-bookend__year">{copy.label}</p>
      <p className="journey-bookend__caption">{copy.caption}</p>
    </section>
  )
}
