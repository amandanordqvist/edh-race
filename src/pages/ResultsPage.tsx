import { BestTimes } from '../components/results/BestTimes'
import { Calendar } from '../components/results/Calendar'
import { Standings } from '../components/results/Standings'
import { TimesSources } from '../components/results/TimesSources'
import './ResultsPage.css'

export function ResultsPage() {
  return (
    <div className="results-page">
      <Calendar />
      <BestTimes />
      <Standings />
      <TimesSources />
    </div>
  )
}
