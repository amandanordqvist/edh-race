import { useRef } from 'react'
import { timeslipRows } from '../data/timeline'
import { JourneyBeat } from '../components/journey/JourneyBeat'
import { JourneyBookend } from '../components/journey/JourneyBookend'
import { JourneyHero } from '../components/journey/JourneyHero'
import { JourneyNow } from '../components/journey/JourneyNow'
import { JourneyTimeslip } from '../components/journey/JourneyTimeslip'
import { useJourneyScroll } from '../components/journey/useJourneyScroll'
import { Section } from '../components/ui/Section'
import { SkewDivider } from '../components/ui/SkewDivider'
import './JourneyPage.css'

/**
 * Staging (quote + lead), then one continuous story whose rows are the same
 * object as the sticky timeslip. Bookends are quiet winters. Chutes at the end.
 */
export function JourneyPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  useJourneyScroll(rootRef)
  const rows = timeslipRows()

  return (
    <div ref={rootRef} className="journey-page">
      <JourneyHero />

      <Section wide className="journey-reel">
        <div className="journey-reel__grid">
          <JourneyTimeslip rows={rows} />

          <div className="journey-reel__acts">
            {rows.map((row) =>
              row.kind === 'bookend' ? (
                <JourneyBookend key={row.id} id={row.id} />
              ) : (
                <JourneyBeat key={row.id} entry={row.entry} as="div" />
              ),
            )}
          </div>
        </div>
      </Section>

      <SkewDivider />
      <JourneyNow />
    </div>
  )
}
