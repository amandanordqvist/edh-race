import { Hero } from '../components/home/Hero'
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

export function HomePage() {
  return (
    <>
      <Hero />
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
