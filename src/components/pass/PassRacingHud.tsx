import { edhTimeslipMeta } from '../../data/simulator'
import { useT } from '../../i18n'
import type { PassPhase } from '../../lib/pass/types'

type PassRacingHudProps = {
  phase: PassPhase
  clock: number
  speedKmh: number
}

/**
 * Secondary telemetry only — keep the strip + Camaro readable.
 * Timeslip pedagogy lives in the split banner / finish panel, not here.
 */
export function PassRacingHud({ phase, clock, speedKmh }: PassRacingHudProps) {
  const t = useT()

  const showReaction = phase === 'green' || phase === 'racing' || phase === 'finished'
  const reaction = showReaction ? edhTimeslipMeta.reaction : null
  const elapsed = phase === 'racing' || phase === 'finished' ? clock : 0
  const speedDisplay = phase === 'racing' ? Math.round(speedKmh) : 0

  return (
    <div className="pass-racing-hud" aria-hidden="true">
      <div className="pass-racing-hud__rail">
        <div className="pass-racing-hud__chip">
          <span className="pass-racing-hud__chip-label">{t.pass.racingHud.elapsed}</span>
          <span className="pass-racing-hud__chip-value">
            {elapsed > 0 ? elapsed.toFixed(3) : '0.000'}
          </span>
        </div>

        {reaction !== null ? (
          <div className="pass-racing-hud__chip">
            <span className="pass-racing-hud__chip-label">{t.pass.racingHud.reaction}</span>
            <span className="pass-racing-hud__chip-value pass-racing-hud__chip-value--sm">
              {reaction.toFixed(3)}
            </span>
          </div>
        ) : null}

        <div className="pass-racing-hud__chip pass-racing-hud__chip--speed">
          <span className="pass-racing-hud__chip-value pass-racing-hud__chip-value--speed">
            {speedDisplay || '0'}
          </span>
          <span className="pass-racing-hud__chip-label">{t.pass.racingHud.speedUnit}</span>
        </div>
      </div>
    </div>
  )
}
