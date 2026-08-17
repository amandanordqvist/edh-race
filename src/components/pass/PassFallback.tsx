import {
  edhTimeslipMeta,
  edhTimeslipRows,
  simulatorRacers,
  type HudSplitId,
  type SimulatorRacerId,
  type TimeslipSplit,
  type TimeslipSplitId,
} from '../../data/simulator'
import { type Dictionary, type Locale, useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
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

function getCompareMeaning(t: Dictionary, racerId: SimulatorRacerId) {
  switch (racerId) {
    case 'camaro':
      return t.pass.compareMeaning.camaro
    case 'f1':
      return t.pass.compareMeaning.f1
    case 'jet':
      return t.pass.compareMeaning.jet
    default: {
      const exhaustiveCheck: never = racerId
      throw new Error(`Unknown simulator racer: ${exhaustiveCheck}`)
    }
  }
}

function getSplitCopy(t: Dictionary, id: TimeslipSplitId) {
  switch (id) {
    case 'reaction':
      return t.pass.timeslipSplits.reaction
    case 'sixty':
      return t.pass.timeslipSplits.sixty
    case 'threeThirty':
      return t.pass.timeslipSplits.threeThirty
    case 'eighth':
      return t.pass.timeslipSplits.eighth
    case 'thousand':
      return t.pass.timeslipSplits.thousand
    case 'quarter':
      return t.pass.timeslipSplits.quarter
    case 'trapMph':
      return t.pass.timeslipSplits.trapMph
    default: {
      const exhaustiveCheck: never = id
      return exhaustiveCheck
    }
  }
}

export function getSplitCalloutText(t: Dictionary, id: HudSplitId) {
  switch (id) {
    case 'sixty':
      return t.pass.splitCallouts.sixty
    case 'threeThirty':
      return t.pass.splitCallouts.threeThirty
    case 'eighth':
      return t.pass.splitCallouts.eighth
    case 'thousand':
      return t.pass.splitCallouts.thousand
    case 'quarter':
      return t.pass.splitCallouts.quarter
    default: {
      const exhaustiveCheck: never = id
      return exhaustiveCheck
    }
  }
}

function formatSplitValue(row: TimeslipSplit, locale: Locale): string {
  switch (row.id) {
    case 'reaction':
      return `${formatLocaleNumber(edhTimeslipMeta.reaction, locale, 4)} s`
    case 'sixty':
    case 'threeThirty':
    case 'quarter':
      return `${formatLocaleNumber(row.et ?? 0, locale, 4)} s`
    case 'eighth':
      return `${formatLocaleNumber(row.et ?? 0, locale, 4)} s · 202 mph`
    case 'thousand':
      return `${formatLocaleNumber(row.et ?? 0, locale, 4)} s · 235 mph`
    case 'trapMph':
      return `${formatLocaleNumber(edhTimeslipMeta.trapMph, locale, 2)} mph`
    default: {
      const exhaustiveCheck: never = row.id
      return exhaustiveCheck
    }
  }
}

export function PassTimeslip() {
  const t = useT()
  const locale = useLocale()

  return (
    <article className="pass-timeslip" aria-label={t.pass.timeslipTitle}>
      <header className="pass-timeslip__header">
        <div>
          <p className="pass-timeslip__eyebrow">{t.pass.timeslipTitle}</p>
          <p className="pass-timeslip__event">{t.pass.timeslipEvent}</p>
        </div>
        <p className="pass-timeslip__distance">{t.pass.timeslipDistance}</p>
      </header>

      <div className="pass-timeslip__hero">
        <p className="pass-timeslip__hero-et">
          {formatLocaleNumber(edhTimeslipMeta.et, locale, 4)}
        </p>
        <p className="pass-timeslip__hero-unit">s</p>
        <p className="pass-timeslip__hero-meta">
          <span>{edhTimeslipMeta.driver}</span>
          <span>
            {formatLocaleNumber(edhTimeslipMeta.trapMph, locale, 2)} mph · {edhTimeslipMeta.trapKmh} km/h
          </span>
        </p>
      </div>

      <p className="pass-timeslip__guide">{t.pass.timeslipGuide}</p>

      <ul className="pass-timeslip__splits">
        {edhTimeslipRows.map((row) => {
          const copy = getSplitCopy(t, row.id)
          const highlight = row.id === 'eighth' || row.id === 'quarter'

          return (
            <li
              key={row.id}
              className={`pass-timeslip__split ${highlight ? 'pass-timeslip__split--hero' : ''}`.trim()}
            >
              <div className="pass-timeslip__split-top">
                <span className="pass-timeslip__split-label">{copy.label}</span>
                <span className="pass-timeslip__split-value">
                  {formatSplitValue(row, locale)}
                  {row.valueAlt ? (
                    <span className="pass-timeslip__split-alt"> · {row.valueAlt}</span>
                  ) : null}
                </span>
              </div>
              <p className="pass-timeslip__split-meaning">{copy.meaning}</p>
            </li>
          )
        })}
      </ul>

      <div className="pass-timeslip__compare">
        <p className="pass-timeslip__compare-title">{t.pass.timeslipCompareTitle}</p>
        <p className="pass-timeslip__compare-lead">{t.pass.timeslipCompareLead}</p>
        <ol className="pass-timeslip__rows">
          {orderedRacers.map((racer, index) => {
            const isHero = racer.id === 'camaro'
            const etDigits = racer.id === 'camaro' ? 4 : 2

            return (
              <li
                key={racer.id}
                className={`pass-timeslip__row ${isHero ? 'pass-timeslip__row--hero' : ''}`.trim()}
              >
                <div className="pass-timeslip__row-main">
                  <span className="pass-timeslip__place" aria-label={t.pass.timeslipPlace}>
                    {index + 1}
                  </span>
                  <span className="pass-timeslip__name">{getCompareLabel(t, racer.id)}</span>
                  <span className="pass-timeslip__et">
                    {formatLocaleNumber(racer.et, locale, etDigits)}s
                  </span>
                  <span className="pass-timeslip__speed">{racer.speedLabel}</span>
                </div>
                <p className="pass-timeslip__row-meaning">{getCompareMeaning(t, racer.id)}</p>
              </li>
            )
          })}
        </ol>
      </div>
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
