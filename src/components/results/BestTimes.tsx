import { bestTimes } from '../../data/results'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './BestTimes.css'

export function BestTimes() {
  const t = useT()
  const featured = bestTimes
    .filter((row) => row.highlight)
    .sort((a, b) => Number(b.highlight === 'best') - Number(a.highlight === 'best'))
  const rest = bestTimes.filter((row) => !row.highlight)

  return (
    <Section wide className="best-times">
      <Reveal>
        <h2 className="results-section__heading">{t.results.bestTimesTitle}</h2>
        <p className="results-section__lead">{t.results.bestTimesLead}</p>
      </Reveal>

      <ul className="best-times__featured">
        {featured.map((row, i) => (
          <Reveal
            as="li"
            key={`${row.year}-${row.event}`}
            className="best-times__feat"
            delay={0.05 * i}
            y={24}
          >
            <p className="best-times__feat-tag">
              {row.highlight === 'best'
                ? t.results.highlightBest
                : t.results.highlightLatest}
            </p>
            <p className="best-times__feat-et">{row.et}</p>
            <p className="best-times__feat-speed">{row.speed}</p>
            <p className="best-times__feat-meta">
              {row.year} · {row.event}
            </p>
          </Reveal>
        ))}
      </ul>

      <Reveal className="best-times__archive" delay={0.08} y={20}>
        <ul className="best-times__rows">
          {rest.map((row) => (
            <li key={`${row.year}-${row.event}`} className="best-times__row">
              <span className="best-times__year">{row.year}</span>
              <span className="best-times__event">{row.event}</span>
              <span className="best-times__et">{row.et}</span>
              <span className="best-times__spd">{row.speed}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="best-times__landmark" delay={0.1} y={16}>
        <p className="best-times__landmark-label">{t.results.landmarkTitle}</p>
        <p className="best-times__landmark-body">{t.results.landmarkBody}</p>
      </Reveal>
    </Section>
  )
}
