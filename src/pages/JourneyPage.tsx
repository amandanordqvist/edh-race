import { JourneyChapters } from '../components/journey/JourneyChapters'
import { JourneyCrossroads } from '../components/journey/JourneyCrossroads'
import { Section } from '../components/ui/Section'

export function JourneyPage() {
  return (
    <div className="journey-page">
      <Section wide>
        <JourneyChapters chapters={['roots', 'build']} />
        <JourneyCrossroads />
        <JourneyChapters chapters={['elite', 'record']} />
      </Section>
    </div>
  )
}
