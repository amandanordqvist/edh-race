import { standings } from '../../data/results'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './Standings.css'

export function Standings() {
  const t = useT()
  const years = [...standings].sort((a, b) => b.year - a.year)

  return (
    <Section wide className="standings">
      <Reveal>
        <h2 className="results-section__heading">{t.results.standingsTitle}</h2>
        <p className="results-section__lead">{t.results.standingsLead}</p>
      </Reveal>

      <Reveal y={20}>
        <ol className="standings__years">
          {years.map((row) => (
            <li key={row.year} className="standings__year">
              <span className="standings__year-label">{row.year}</span>
              <span className="standings__place">{row.place}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  )
}
