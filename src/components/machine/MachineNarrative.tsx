import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './MachineNarrative.css'

const CAMARO_SPEED = 415
const JET_SPEED = 290
const BAR_MAX = 415

export function MachineNarrative() {
  const t = useT()

  return (
    <Section wide className="machine-narrative">
      <Reveal>
        <h2 className="machine-narrative__heading">{t.machine.narrativeTitle}</h2>
      </Reveal>

      <div className="machine-narrative__stack">
        <Reveal as="article" className="machine-narrative__chapter" y={28}>
          <h3>{t.machine.extremeForcesTitle}</h3>
          <p>{t.machine.extremeForces}</p>
        </Reveal>

        <Reveal
          as="article"
          className="machine-narrative__chapter machine-narrative__chapter--speed"
          delay={0.06}
          y={28}
        >
          <div className="machine-narrative__speed-copy">
            <h3>{t.machine.speedCompareTitle}</h3>
            <p>{t.machine.speedCompare}</p>
          </div>

          <div className="speed-compare" aria-hidden="true">
            <div className="speed-compare__row">
              <span className="speed-compare__label">{t.machine.compareCamaro}</span>
              <span className="speed-compare__value">{CAMARO_SPEED} km/h</span>
            </div>
            <div className="speed-compare__track">
              <div
                className="speed-compare__bar speed-compare__bar--camaro"
                style={{ width: `${(CAMARO_SPEED / BAR_MAX) * 100}%` }}
              />
            </div>
            <div className="speed-compare__row">
              <span className="speed-compare__label">{t.machine.compareJet}</span>
              <span className="speed-compare__value">{JET_SPEED} km/h</span>
            </div>
            <div className="speed-compare__track">
              <div
                className="speed-compare__bar speed-compare__bar--jet"
                style={{ width: `${(JET_SPEED / BAR_MAX) * 100}%` }}
              />
            </div>
          </div>
        </Reveal>

        <Reveal
          as="article"
          className="machine-narrative__chapter"
          delay={0.1}
          y={28}
        >
          <h3>{t.machine.logisticsTitle}</h3>
          <p>{t.machine.logistics}</p>
        </Reveal>
      </div>
    </Section>
  )
}
