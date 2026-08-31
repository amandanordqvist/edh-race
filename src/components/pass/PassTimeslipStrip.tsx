import { type RefObject } from 'react'

import { QUARTER_FEET } from '../../data/simulator'
import { type Dictionary, useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import type { LitMark } from './useTimeslipReplay'

const STRIP_MARKS = [
  { id: 'sixty' as const, feet: 60, et: 0.9459, kmh: null },
  { id: 'eighth' as const, feet: 660, et: 3.8268, kmh: 326 },
  { id: 'quarter' as const, feet: 1320, et: 5.7451, kmh: 415 },
]

type Props = {
  lit: ReadonlySet<LitMark>
  running: boolean
  fillRef: RefObject<HTMLSpanElement | null>
  travellerRef: RefObject<HTMLSpanElement | null>
}

function markLabel(t: Dictionary, id: (typeof STRIP_MARKS)[number]['id']) {
  switch (id) {
    case 'sixty':
      return t.pass.timeslipSplits.sixty.label
    case 'eighth':
      return '1/8'
    case 'quarter':
      return ''
    default: {
      const exhaustiveCheck: never = id
      return exhaustiveCheck
    }
  }
}

/** Keep the 60 FT copy readable — the tick itself stays at true distance. */
function labelLeft(feet: number) {
  const raw = (feet / QUARTER_FEET) * 100
  if (feet === 60) return Math.max(raw, 22)
  return raw
}

export function PassTimeslipStrip({ lit, running, fillRef, travellerRef }: Props) {
  const t = useT()
  const locale = useLocale()

  return (
    <div
      className={`pass-timeslip__strip${running ? ' is-running' : ''}`.trim()}
      aria-hidden="true"
    >
      <div className="pass-timeslip__strip-ends">
        <span>{t.pass.timeslipTrackStart}</span>
        <span>{t.pass.timeslipTrackFinish}</span>
      </div>
      <div className="pass-timeslip__rail">
        <span className="pass-timeslip__fill" ref={fillRef} />
        <span className="pass-timeslip__traveller" ref={travellerRef}>
          <span className="pass-timeslip__dot" />
        </span>
        {STRIP_MARKS.map((mark) => (
          <span
            key={mark.id}
            className={`pass-timeslip__tick${lit.has(mark.id) ? ' is-lit' : ''}`.trim()}
            style={{ left: `${(mark.feet / QUARTER_FEET) * 100}%` }}
          />
        ))}
      </div>
      <div className="pass-timeslip__strip-times">
        <span className="pass-timeslip__strip-time is-lit pass-timeslip__strip-time--start">
          {formatLocaleNumber(0, locale, 0)} s
        </span>
        {STRIP_MARKS.map((mark) => {
          const name = markLabel(t, mark.id)
          return (
            <span
              key={mark.id}
              className={`pass-timeslip__strip-time${lit.has(mark.id) ? ' is-lit' : ''}${
                mark.id === 'quarter' ? ' pass-timeslip__strip-time--finish' : ''
              }`.trim()}
              style={{ left: `${labelLeft(mark.feet)}%` }}
            >
              {name ? <span className="pass-timeslip__strip-mark">{name}</span> : null}
              <span>
                {formatLocaleNumber(mark.et, locale, 3)} s
                {mark.kmh !== null
                  ? ` · ${formatLocaleNumber(mark.kmh, locale, 0)} km/h`
                  : ''}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
