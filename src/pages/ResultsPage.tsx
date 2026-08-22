import { BestTimes } from '../components/results/BestTimes'
import { Calendar } from '../components/results/Calendar'
import { Standings } from '../components/results/Standings'
import './ResultsPage.css'

export function ResultsPage() {
  return (
    <div className="results-page">
      <Calendar />
      <BestTimes />
      <Standings />
    </div>
  )
}
