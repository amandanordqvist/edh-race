import { BestTimes } from '../components/results/BestTimes'
import { Calendar } from '../components/results/Calendar'
import { ResultsHero } from '../components/results/ResultsHero'
import { Standings } from '../components/results/Standings'
import { SkewDivider } from '../components/ui/SkewDivider'
import './ResultsPage.css'

export function ResultsPage() {
  return (
    <div className="results-page">
      <ResultsHero />
      <Standings />
      <SkewDivider />
      <BestTimes />
      <SkewDivider />
      <Calendar />
    </div>
  )
}
