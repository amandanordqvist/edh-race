import { useRef } from 'react'
import { timeslipRows } from '../data/timeline'
import { JourneyBookend } from '../components/journey/JourneyBookend'
import { JourneyChapters } from '../components/journey/JourneyChapters'
import { JourneyCrossroads } from '../components/journey/JourneyCrossroads'
import { JourneyHero } from '../components/journey/JourneyHero'
import { JourneyNow } from '../components/journey/JourneyNow'
import { JourneyTimeslip } from '../components/journey/JourneyTimeslip'
import { useJourneyScroll } from '../components/journey/useJourneyScroll'
import { Section } from '../components/ui/Section'
import { SkewDivider } from '../components/ui/SkewDivider'
import './JourneyPage.css'

/**
 * Staging (blank timeslip hero), the running rows (chapters + bookends +
 * crossroads set piece), and the chutes (final row + philosophy). The
 * timeslip on the left column is the same object read top-to-bottom; the
 * cursor moves as the reader scrolls.
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
            <JourneyChapters chapters={['roots']} />
            <JourneyBookend id="bookend-2011" />
            <JourneyChapters chapters={['build']} />
            <JourneyCrossroads />
            <JourneyChapters chapters={['elite']} />
            <JourneyBookend id="bookend-2022" />
            <JourneyChapters chapters={['record']} />
          </div>
        </div>
      </Section>

      <SkewDivider />
      <JourneyNow />
    </div>
  )
}
