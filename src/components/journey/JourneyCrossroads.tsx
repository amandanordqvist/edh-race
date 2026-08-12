import { CROSSROADS_ID, entryById } from '../../data/timeline'
import { useT } from '../../i18n'
import { JourneyBeat } from './JourneyBeat'
import './JourneyCrossroads.css'

/**
 * 2016: the fastest year so far and the moment he considered selling
 * everything. Its own set piece because it is the one place the page stops
 * moving — there is nothing else here to look at.
 */
export function JourneyCrossroads() {
  const t = useT()
  const entry = entryById(CROSSROADS_ID)

  return (
    <section
      className="journey-crossroads"
      aria-labelledby="journey-crossroads-title"
    >
      <h2 id="journey-crossroads-title" className="journey-crossroads__label">
        {t.journey.crossroadsLabel}
      </h2>
      <JourneyBeat entry={entry} as="div" />
    </section>
  )
}
