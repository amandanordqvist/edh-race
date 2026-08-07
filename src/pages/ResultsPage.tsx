import { BestTimes } from '../components/results/BestTimes'
import { Calendar } from '../components/results/Calendar'
import { Standings } from '../components/results/Standings'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { SkewDivider } from '../components/ui/SkewDivider'
import { useT } from '../i18n'
import './ResultsPage.css'

export function ResultsPage() {
  const t = useT()

  return (
    <div className="results-page">
      <Section wide className="page-intro results-page__intro">
        <Reveal>
          <h1 className="results-page__title">{t.results.title}</h1>
        </Reveal>
      </Section>
      <Standings />
      <SkewDivider />
      <BestTimes />
      <SkewDivider />
      <Calendar />
    </div>
  )
}
