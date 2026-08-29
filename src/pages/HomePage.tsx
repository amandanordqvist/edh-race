import { Hero } from '../components/home/Hero'
import { HomeDriver } from '../components/home/HomeDriver'
import { HomeMachine } from '../components/home/HomeMachine'
import { HomeNextRace } from '../components/home/HomeNextRace'
import { PassTeaser } from '../components/home/PassTeaser'
import { HomeStory } from '../components/home/HomeStory'
import { HomeTeam } from '../components/home/HomeTeam'
import { PerformanceStrip } from '../components/home/PerformanceStrip'
import { SponsorStrip } from '../components/home/SponsorStrip'
import { FacebookFeed } from '../components/media/FacebookFeed'
import { SkewDivider } from '../components/ui/SkewDivider'

export function HomePage() {
  return (
    <>
      <Hero />
      <PerformanceStrip />
      <SkewDivider />
      <PassTeaser />
      <HomeMachine />
      <HomeDriver />
      <HomeTeam />
      <HomeStory />
      <HomeNextRace />
      <FacebookFeed variant="home" />
      <SkewDivider />
      <SponsorStrip />
    </>
  )
}
