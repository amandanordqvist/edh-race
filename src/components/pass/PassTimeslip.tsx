import {
  edhTimeslipMeta,
  edhTimeslipRows,
  type TimeslipSplit,
  type TimeslipSplitId,
} from '../../data/simulator'
import { type Dictionary, type Locale, useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import { PassTimeslipStrip } from './PassTimeslipStrip'
import { useTimeslipReplay } from './useTimeslipReplay'
import './PassTimeslip.css'

const etRows = edhTimeslipRows.filter((row) => row.id !== 'reaction')

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
    default: {
      const exhaustiveCheck: never = id
      return exhaustiveCheck
    }
  }
}

function formatEt(et: number, locale: Locale) {
  return `${formatLocaleNumber(et, locale, 4)} s`
}

function formatSpeed(row: TimeslipSplit, locale: Locale) {
  if (row.kmh === null) return ''
  return `${formatLocaleNumber(row.kmh, locale, 0)} km/h`
}

function SplitInfo({ label, meaning }: { label: string; meaning: string }) {
  return (
    <button type="button" className="pass-timeslip__info" aria-label={`${label}: ${meaning}`}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="7" cy="4.2" r="0.7" fill="currentColor" />
        <path d="M7 6.1v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="pass-timeslip__info-tip" role="tooltip" aria-hidden="true">
        {meaning}
      </span>
    </button>
  )
}

type Props = {
  active?: boolean
}

export function PassTimeslip({ active = true }: Props) {
  const t = useT()
  const locale = useLocale()
  const { lit, running, fillRef, travellerRef } = useTimeslipReplay(active)
  const reaction = getSplitCopy(t, 'reaction')

  return (
    <article className="pass-timeslip" aria-label={t.pass.timeslipTitle}>
      <header className="pass-timeslip__header">
        <p className="pass-timeslip__eyebrow">{t.pass.timeslipTitle}</p>
        <p className="pass-timeslip__event">
          {t.pass.timeslipVenue} · {t.pass.timeslipDate}
        </p>
      </header>

      <div className="pass-timeslip__hero">
        <p className="pass-timeslip__hero-et">
          {formatLocaleNumber(edhTimeslipMeta.et, locale, 4)}
          <span className="pass-timeslip__hero-unit"> s</span>
        </p>
        <p className="pass-timeslip__hero-speed">
          {formatLocaleNumber(edhTimeslipMeta.trapKmh, locale, 0)}
          <span> km/h</span>
        </p>
        <p className="pass-timeslip__hero-sub">
          {t.pass.timeslipMeters} · {formatLocaleNumber(edhTimeslipMeta.trapMph, locale, 2)} mph
        </p>
        <p className="pass-timeslip__hero-driver">
          {edhTimeslipMeta.driver} · {t.pass.timeslipTeam} · {t.pass.timeslipClass}
        </p>
      </div>

      <p className="pass-timeslip__guide">{t.pass.timeslipGuide}</p>

      <PassTimeslipStrip
        lit={lit}
        running={running}
        fillRef={fillRef}
        travellerRef={travellerRef}
      />

      <div className="pass-timeslip__reaction">
        <div className="pass-timeslip__reaction-top">
          <span className="pass-timeslip__split-label">{reaction.label}</span>
          <span className="pass-timeslip__split-value">
            {formatLocaleNumber(edhTimeslipMeta.reaction, locale, 4)} s
          </span>
        </div>
        <p className="pass-timeslip__reaction-meaning">{reaction.meaning}</p>
      </div>

      <div className="pass-timeslip__table">
        <div className="pass-timeslip__cols" aria-hidden="true">
          <span />
          <span>{t.pass.timeslipColTime}</span>
          <span>{t.pass.timeslipColSpeed}</span>
        </div>
        <ul className="pass-timeslip__splits">
          {etRows.map((row) => {
            const copy = getSplitCopy(t, row.id)
            const reached = lit.has(row.id)
            const classes = [
              'pass-timeslip__split',
              reached ? 'is-lit' : '',
              row.id === 'eighth' ? 'pass-timeslip__split--eighth' : '',
              row.id === 'quarter' ? 'pass-timeslip__split--quarter' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <li key={row.id} className={classes}>
                <div className="pass-timeslip__split-main">
                  <span className="pass-timeslip__split-label">
                    {copy.label}
                    <SplitInfo label={copy.label} meaning={copy.meaning} />
                  </span>
                  <span className="pass-timeslip__split-value">{formatEt(row.et ?? 0, locale)}</span>
                  <span className="pass-timeslip__split-speed">{formatSpeed(row, locale)}</span>
                </div>
                {copy.meters ? (
                  <p className="pass-timeslip__split-meters">{copy.meters}</p>
                ) : null}
                {reached && copy.note ? (
                  <p className="pass-timeslip__split-note">{copy.note}</p>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>

      <p className="pass-timeslip__closer">{t.pass.timeslipCloser}</p>
    </article>
  )
}
