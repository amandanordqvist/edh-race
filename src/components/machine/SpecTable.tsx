import { machineSpecs, specHighlightKeys } from '../../data/machine'
import { homeHeadlineBests } from '../../data/results'
import { useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './SpecTable.css'

export function SpecTable() {
  const t = useT()
  const locale = useLocale()

  const et = `${formatLocaleNumber(homeHeadlineBests.quarterEt, locale, 2)} / ${formatLocaleNumber(homeHeadlineBests.eighthEt, locale, 2)}`
  const speed = `${formatLocaleNumber(homeHeadlineBests.quarterSpeedKmh, locale, 0)} / ${formatLocaleNumber(homeHeadlineBests.eighthSpeedKmh, locale, 0)}`

  const byKey = Object.fromEntries(machineSpecs.map((row) => [row.key, row.value]))
  const highlightValues: Record<(typeof specHighlightKeys)[number], string> = {
    bestEt: et,
    bestSpeed: speed,
    class: byKey.class,
  }

  const rest = machineSpecs.filter((row) => row.key !== 'class')

  return (
    <Section wide className="spec-table">
      <Reveal>
        <h2 className="spec-table__heading">{t.machine.specsTitle}</h2>
      </Reveal>

      <ul className="spec-table__highlights">
        {specHighlightKeys.map((key, i) => (
          <Reveal
            as="li"
            key={key}
            className={`spec-table__stat ${i === 0 ? 'spec-table__stat--lead' : ''}`}
            delay={0.05 * i}
            y={28}
          >
            <p className="spec-table__stat-label">{t.machine.specLabels[key]}</p>
            <p className="spec-table__stat-value">{highlightValues[key]}</p>
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
