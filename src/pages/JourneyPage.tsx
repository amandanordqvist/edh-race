import { Story } from '../components/journey/Story'
import { StoryVisuals } from '../components/journey/StoryVisuals'
import { Timeline } from '../components/journey/Timeline'
import { SkewDivider } from '../components/ui/SkewDivider'

export function JourneyPage() {
  return (
    <div className="journey-page">
      <Story />
      <StoryVisuals />
      <SkewDivider />
      <Timeline />
    </div>
  )
}
