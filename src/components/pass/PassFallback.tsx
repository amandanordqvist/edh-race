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

export function PassTimeslip() {
  const t = useT()
  const hero = orderedRacers[0]

  return (
    <article className="pass-timeslip" aria-label={t.pass.timeslipTitle}>
      <header className="pass-timeslip__header">
        <p className="pass-timeslip__eyebrow">{t.pass.timeslipTitle}</p>
        <p className="pass-timeslip__distance">{t.pass.timeslipDistance}</p>
      </header>

      {hero ? (
        <div className="pass-timeslip__hero">
          <p className="pass-timeslip__hero-et">{hero.et.toFixed(2)}</p>
          <p className="pass-timeslip__hero-unit">s</p>
          <p className="pass-timeslip__hero-meta">
            <span>{getCompareLabel(t, hero.id)}</span>
            <span>{hero.speedLabel}</span>
          </p>
        </div>
      ) : null}

      <ol className="pass-timeslip__rows">
        {orderedRacers.map((racer, index) => {
          const isHero = racer.id === 'camaro'

          return (
            <li
              key={racer.id}
              className={`pass-timeslip__row ${isHero ? 'pass-timeslip__row--hero' : ''}`.trim()}
            >
              <span className="pass-timeslip__place" aria-label={t.pass.timeslipPlace}>
                {index + 1}
              </span>
              <span className="pass-timeslip__name">{getCompareLabel(t, racer.id)}</span>
              <span className="pass-timeslip__et">{racer.et.toFixed(2)}s</span>
              <span className="pass-timeslip__speed">{racer.speedLabel}</span>
            </li>
          )
        })}
      </ol>
    </article>
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
      <PassTimeslip />
      <div className="pass-fallback__actions">
        <Button to={localePath(locale, 'journey')} variant="ghost" icon>
          {t.pass.continueJourney}
        </Button>
      </div>
    </div>
  )
}
