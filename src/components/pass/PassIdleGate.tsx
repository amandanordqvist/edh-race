import { Button } from '../ui/Button'
import { useT } from '../../i18n'
import type { PassCameraView, PassOpponentId } from '../../lib/pass/types'

type Props = {
  cameraView: PassCameraView
  opponent: PassOpponentId
  onView: (view: 'follow' | 'cockpit') => void
  onOpponent: (opponent: PassOpponentId) => void
  onStart: () => void
}

export function PassIdleGate({ cameraView, opponent, onView, onOpponent, onStart }: Props) {
  const t = useT()
  const trackActive = cameraView !== 'cockpit'

  return (
    <div className="pass-idle-gate">
      <h2 className="sr-only">{t.pass.status.idle}</h2>
      <div className="pass-idle-gate__dock">
        <div className="pass-idle-gate__views" role="group" aria-label={t.pass.cameraViews}>
          <button
            type="button"
            className={`pass-idle-gate__choice${cameraView === 'cockpit' ? ' is-on' : ''}`}
            aria-pressed={cameraView === 'cockpit'}
            onClick={() => onView('cockpit')}
          >
            {t.pass.viewDriver}
          </button>
          <button
            type="button"
            className={`pass-idle-gate__choice${trackActive ? ' is-on' : ''}`}
            aria-pressed={trackActive}
            onClick={() => onView('follow')}
          >
            {t.pass.viewTrack}
          </button>
        </div>
        <Button className="pass-idle-gate__start" onClick={onStart}>
          {t.pass.startPass}
        </Button>
        <div className="pass-idle-gate__compare" role="group" aria-label={t.pass.compareWith}>
          {(['none', 'f1', 'jet'] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={`pass-idle-gate__choice${opponent === id ? ' is-on' : ''}`}
              aria-pressed={opponent === id}
              onClick={() => onOpponent(id)}
            >
              {t.pass.compare[id]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
