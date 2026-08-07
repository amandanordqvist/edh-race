import { standings } from '../../data/results'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './Standings.css'

function placeClass(medal?: 'gold' | 'silver' | 'bronze') {
  switch (medal) {
    case 'gold':
      return 'standings__place standings__place--gold'
    case 'silver':
      return 'standings__place standings__place--silver'
    case 'bronze':
      return 'standings__place standings__place--bronze'
    case undefined:
      return 'standings__place'
    default: {
      const _exhaustive: never = medal
      return _exhaustive
    }
  }
}

export function Standings() {
  const t = useT()
  const podium = standings.filter((row) => row.medal)
  const rest = standings.filter((row) => !row.medal)

  return (
    <Section wide className="standings">
      <Reveal>
        <h2 className="results-section__heading">{t.results.standingsTitle}</h2>
      </Reveal>

      <ul className="standings__podium">
        {podium.map((row, i) => (
          <Reveal
            as="li"
            key={row.year}
            className={`standings__podium-item standings__podium-item--${row.medal}`}
            delay={0.05 * i}
            y={28}
          >
            <p className="standings__podium-year">{row.year}</p>
            <p className={placeClass(row.medal)}>{row.place}</p>
            <p className="standings__podium-label">{t.results.colPlace}</p>
          </Reveal>
        ))}
      </ul>

      {rest.length > 0 ? (
        <Reveal className="data-table-shell" delay={0.1} y={28}>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.results.colYear}</th>
                  <th>{t.results.colPlace}</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>
                      <span className={placeClass(row.medal)}>{row.place}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      ) : null}
    </Section>
  )
}
