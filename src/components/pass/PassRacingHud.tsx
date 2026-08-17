import { useEffect, useRef, useState } from 'react'

import { useT } from '../../i18n'
import type { PassPhase } from '../../lib/pass/types'

type PassRacingHudProps = {
  phase: PassPhase
  speedKmh: number
  remainingM: number
  chuteDeploy01: number
}

const SPEED_MILESTONES = [100, 200, 300, 400] as const

/**
 * Live speed + meters remaining. Off-center so the car keeps the middle.
 */
export function PassRacingHud({
  phase,
  speedKmh,
  remainingM,
  chuteDeploy01,
}: PassRacingHudProps) {
  const t = useT()
  const [pulse, setPulse] = useState(false)
  const hitRef = useRef<Set<number>>(new Set())

  const speedDisplay = phase === 'racing' ? Math.round(speedKmh) : 0
  const showRemaining = phase === 'racing' && chuteDeploy01 < 0.25 && remainingM > 0
  const showChutes = phase === 'racing' && chuteDeploy01 > 0.15

  useEffect(() => {
    if (phase !== 'racing') {
      hitRef.current.clear()
      return
    }
    SPEED_MILESTONES.forEach((mark) => {
      if (speedKmh >= mark && !hitRef.current.has(mark)) {
        hitRef.current.add(mark)
        setPulse(true)
        window.setTimeout(() => setPulse(false), 320)
      }
    })
  }, [speedKmh, phase])

  return (
    <div
      className={`pass-racing-hud${pulse ? ' pass-racing-hud--pulse' : ''}`}
      aria-hidden="true"
    >
      <div className="pass-racing-hud__rail">
        <div className="pass-racing-hud__chip pass-racing-hud__chip--speed">
          <span className="pass-racing-hud__chip-value pass-racing-hud__chip-value--speed">
            {speedDisplay || '0'}
          </span>
          <span className="pass-racing-hud__chip-label">{t.pass.racingHud.speedUnit}</span>
        </div>

        {showRemaining ? (
          <div className="pass-racing-hud__chip pass-racing-hud__chip--remain">
            <span className="pass-racing-hud__chip-value pass-racing-hud__chip-value--sm">
              {Math.round(remainingM)}
            </span>
            <span className="pass-racing-hud__chip-label">
              m {t.pass.metersLeft}
            </span>
          </div>
        ) : null}

        {showChutes ? (
          <div className="pass-racing-hud__chip pass-racing-hud__chip--chutes">
            <span className="pass-racing-hud__chip-label">{t.pass.racingHud.chutes}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
