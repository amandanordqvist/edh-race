import { simulatorRacers, type SimulatorRacerId } from '../../data/simulator'
import { type Dictionary, useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import './PassArena.css'

const orderedRacers = [...simulatorRacers].sort((left, right) => left.et - right.et)

function getCompareLabel(t: Dictionary, racerId: SimulatorRacerId) {
  switch (racerId) {
    case 'camaro':
      return t.pass.compare.camaro
    case 'f1':
      return t.pass.compare.f1
    case 'jet':
      return t.pass.compare.jet
    default: {
      const exhaustiveCheck: never = racerId
      throw new Error(`Unknown simulator racer: ${exhaustiveCheck}`)
    }
  }
}

export function PassResultsList() {
  const t = useT()

  return (
    <ol className="pass-results">
      {orderedRacers.map((racer, index) => {
        const isHero = racer.id === 'camaro'

        return (
          <li
            key={racer.id}
            className={`pass-results__item ${isHero ? 'pass-results__item--hero' : ''}`.trim()}
          >
            <span className="pass-results__place">{index + 1}</span>
            <span className="pass-results__name">{getCompareLabel(t, racer.id)}</span>
            <span className="pass-results__et">{racer.et.toFixed(2)}s</span>
            <span className="pass-results__speed">{racer.speedLabel}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function PassFallback() {
  const locale = useLocale()
  const t = useT()

  return (
    <div className="pass-fallback">
      <p className="pass-fallback__message" role="status">
        {t.pass.webglFallback}
      </p>
      <PassResultsList />
      <div className="pass-fallback__actions">
        <Button to={localePath(locale, 'journey')} variant="ghost" icon>
          {t.pass.continueJourney}
        </Button>
      </div>
    </div>
  )
}
