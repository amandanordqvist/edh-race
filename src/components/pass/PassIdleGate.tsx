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
      <div className="pass-idle-gate__copy">
        <h2 className="pass-idle-gate__headline">{t.pass.promptHeadline}</h2>
        <p className="pass-idle-gate__sub">{t.pass.promptSub}</p>
      </div>

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

      <div className="pass-idle-gate__compare" role="group" aria-label={t.pass.compareWith}>
        <span className="pass-idle-gate__compare-label">{t.pass.compareWith}</span>
        <div className="pass-idle-gate__compare-btns">
          {(['none', 'f1', 'jet'] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={`pass-idle-gate__choice pass-idle-gate__choice--sm${opponent === id ? ' is-on' : ''}`}
              aria-pressed={opponent === id}
              onClick={() => onOpponent(id)}
            >
              {t.pass.compare[id]}
            </button>
          ))}
        </div>
      </div>

      <Button className="pass-idle-gate__start" onClick={onStart}>
        {t.pass.startPass}
      </Button>
    </div>
  )
}
