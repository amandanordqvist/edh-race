import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PerformanceStrip.css'

export function PerformanceStrip() {
  const t = useT()
  const stats = [
    { ...t.home.stats.quarter, lead: true },
    { ...t.home.stats.topSpeed, lead: true },
    { ...t.home.stats.eighth, lead: false },
    { ...t.home.stats.hp, lead: false },
  ]

  return (
    <Section className="perf-strip">
      <Reveal className="perf-strip__intro">
        <h2 className="section__title">{t.home.statsTitle}</h2>
        <p className="section__lead">{t.home.statsLead}</p>
      </Reveal>

      <ul className="perf-strip__grid">
        {stats.map((stat, i) => (
          <Reveal
            as="li"
            key={stat.label}
            className={`perf-strip__item ${stat.lead ? 'perf-strip__item--lead' : ''}`}
            delay={0.055 * i}
            y={28}
          >
            <p className="perf-strip__value">{stat.value}</p>
            <p className="perf-strip__label">{stat.label}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
