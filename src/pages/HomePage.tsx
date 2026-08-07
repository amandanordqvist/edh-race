import { Hero } from '../components/home/Hero'
import { PerformanceStrip } from '../components/home/PerformanceStrip'
import { DragstripSimulator } from '../components/home/DragstripSimulator'
import { SponsorStrip } from '../components/home/SponsorStrip'
import { SkewDivider } from '../components/ui/SkewDivider'

export function HomePage() {
  return (
    <>
      <Hero />
      <PerformanceStrip />
      <SkewDivider />
      <SponsorStrip />
      <SkewDivider />
      <DragstripSimulator />
    </>
  )
}
