import { HeroScrollReveal } from '../components/home/HeroScrollReveal'
import { HomeDispatch } from '../components/home/HomeDispatch'
import { HomeDriver } from '../components/home/HomeDriver'
import { HomeMachine } from '../components/home/HomeMachine'
import { HomeNextRace } from '../components/home/HomeNextRace'
import { HomeStory } from '../components/home/HomeStory'
import { HomeTeam } from '../components/home/HomeTeam'
import { PassTeaser } from '../components/home/PassTeaser'
import { PerformanceStrip } from '../components/home/PerformanceStrip'
import { SponsorStrip } from '../components/home/SponsorStrip'
import { SkewDivider } from '../components/ui/SkewDivider'

/** Isolated homepage preview: same sections, scroll-pin video hero. */
export function HomeScrollPreviewPage() {
  return (
    <>
      <HeroScrollReveal />
      <PerformanceStrip />
      <PassTeaser />
      <HomeMachine />
      <HomeDriver />
      <HomeTeam />
      <HomeStory />
      <HomeNextRace />
      <HomeDispatch />
      <SkewDivider />
      <SponsorStrip />
    </>
  )
}
