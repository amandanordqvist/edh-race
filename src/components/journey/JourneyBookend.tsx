import type { TimelineBookendId } from '../../data/timeline'
import { useT } from '../../i18n'
import { bookendDomId } from './domIds'
import './JourneyBookend.css'

/**
 * A quiet winter in the story: year label and one line. Same scale as the
 * beats around it, so the timeslip does not jump into a monument.
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
