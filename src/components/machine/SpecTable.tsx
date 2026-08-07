import { machineSpecs } from '../../data/machine'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './SpecTable.css'

const HIGHLIGHT_KEYS = new Set(['power', 'engine', 'weight'])

export function SpecTable() {
  const t = useT()
  const highlights = machineSpecs.filter((row) => HIGHLIGHT_KEYS.has(row.key))
  const rest = machineSpecs.filter((row) => !HIGHLIGHT_KEYS.has(row.key))

  return (
    <Section wide className="spec-table">
      <Reveal>
        <h2 className="spec-table__heading">{t.machine.specsTitle}</h2>
      </Reveal>

      <ul className="spec-table__highlights">
        {highlights.map((row, i) => (
          <Reveal
            as="li"
            key={row.key}
            className={`spec-table__stat ${i === 0 ? 'spec-table__stat--lead' : ''}`}
            delay={0.05 * i}
            y={28}
          >
            <p className="spec-table__stat-label">{t.machine.specLabels[row.key]}</p>
            <p className="spec-table__stat-value">{row.value}</p>
          </Reveal>
        ))}
      </ul>

      <Reveal className="spec-table__shell" delay={0.1} y={28}>
        <div className="spec-table__wrap">
          <table>
            <tbody>
              {rest.map((row) => (
                <tr key={row.key}>
                  <th scope="row">{t.machine.specLabels[row.key]}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  )
}
