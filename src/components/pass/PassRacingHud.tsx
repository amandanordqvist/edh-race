import { edhTimeslipMeta } from '../../data/simulator'
import { useT } from '../../i18n'
import type { PassPhase } from '../../lib/pass/types'

type PassRacingHudProps = {
  phase: PassPhase
  clock: number
  speedKmh: number
  gapM: number
  chuteDeploy01: number
}

/**
 * Secondary telemetry only — keep the strip + Camaro readable.
 * Timeslip pedagogy lives in the split banner / finish panel, not here.
 */
export function PassRacingHud({ phase, clock, speedKmh, gapM, chuteDeploy01 }: PassRacingHudProps) {
  const t = useT()

  const showReaction = phase === 'green' || phase === 'racing' || phase === 'finished'
  const reaction = showReaction ? edhTimeslipMeta.reaction : null
  const elapsed = phase === 'racing' || phase === 'finished' ? clock : 0
  const speedDisplay = phase === 'racing' ? Math.round(speedKmh) : 0
  const showGap = phase === 'racing' && chuteDeploy01 < 0.2 && Math.abs(gapM) > 1.5
  const gapAbs = Math.round(Math.abs(gapM))
  const gapLead = gapM >= 0
  const showChutes = phase === 'racing' && chuteDeploy01 > 0.15

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

        {showChutes ? (
          <div className="pass-racing-hud__chip pass-racing-hud__chip--chutes">
            <span className="pass-racing-hud__chip-label">{t.pass.racingHud.chutes}</span>
          </div>
        ) : null}
      </div>

      {showGap ? (
        <div
          className={`pass-racing-hud__gap${gapLead ? ' pass-racing-hud__gap--lead' : ' pass-racing-hud__gap--trail'}`}
        >
          <span className="pass-racing-hud__gap-arrow" aria-hidden="true">
            {gapLead ? '↑' : '↓'}
          </span>
          <span className="pass-racing-hud__gap-value">{gapAbs}</span>
          <span className="pass-racing-hud__gap-unit">m</span>
          <span className="pass-racing-hud__gap-vs">
            {gapLead ? t.pass.gapAhead : t.pass.gapBehind}
          </span>
        </div>
      ) : null}
    </div>
  )
}
