import { bestTimes } from '../../data/results'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './BestTimes.css'
import './Standings.css'

export function BestTimes() {
  const t = useT()
  const featured = bestTimes.filter((row) => row.highlight)
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
            className={`best-times__feat${row.highlight === 'best' ? ' best-times__feat--best' : ''}${row.image ? ' best-times__feat--media' : ''}`}
            delay={0.05 * i}
            y={28}
          >
            {row.image ? (
              <div className="best-times__feat-media" aria-hidden="true">
                <img
                  src={row.image}
                  alt=""
                  width={900}
                  height={600}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
            <div className="best-times__feat-copy">
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
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal className="data-table-shell" delay={0.1} y={28}>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.results.colYear}</th>
                <th>{t.results.colEvent}</th>
                <th>{t.results.colTime}</th>
                <th>{t.results.colSpeed}</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((row) => (
                <tr key={`${row.year}-${row.event}`}>
                  <td>{row.year}</td>
                  <td>{row.event}</td>
                  <td className="data-table__mono">{row.et}</td>
                  <td className="data-table__mono">{row.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  )
}
