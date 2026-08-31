import { edhTimeslipMeta, edhTimeslipRows, type HudSplitId } from '../../data/simulator'
import { useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import type { PassPhase } from '../../lib/pass/types'

type PassRacingHudProps = {
  phase: PassPhase
  clock: number
  speedKmh: number
  splitId: HudSplitId | null
  chuteDeploy01: number
}

function splitLabel(id: HudSplitId, t: ReturnType<typeof useT>): string {
  switch (id) {
    case 'sixty':
      return t.pass.timeslipSplits.sixty.label
    case 'threeThirty':
      return t.pass.timeslipSplits.threeThirty.label
    case 'eighth':
      return t.pass.timeslipSplits.eighth.label
    case 'thousand':
      return t.pass.timeslipSplits.thousand.label
    case 'quarter':
      return t.pass.timeslipSplits.quarter.label
    default: {
      const exhaustiveCheck: never = id
      return exhaustiveCheck
    }
  }
}

function officialEt(id: HudSplitId): number | null {
  const row = edhTimeslipRows.find((entry) => entry.id === id)
  return row?.et ?? null
}

export function PassRacingHud({
  phase,
  clock,
  speedKmh,
  splitId,
  chuteDeploy01,
}: PassRacingHudProps) {
  const t = useT()
  const locale = useLocale()
  const racing = phase === 'racing' || phase === 'green'
  const finished = phase === 'finished'
  const et = splitId ? (officialEt(splitId) ?? clock) : clock
  const label = splitId
    ? splitLabel(splitId, t)
    : chuteDeploy01 > 0.15
      ? t.pass.racingHud.chutes
      : t.pass.racingHud.elapsed
  const trapKmh = Math.round(edhTimeslipMeta.trapKmh)
  const speedDisplay = finished ? trapKmh : racing ? Math.round(speedKmh) : 0

  return (
    <div className="pass-racing-hud" aria-hidden="true">
      <p className="pass-racing-hud__et">
        {formatLocaleNumber(et, locale, 3)}
        <span> s</span>
      </p>
      <p className="pass-racing-hud__split">{label}</p>
      <p className="pass-racing-hud__speed">
        {speedDisplay}
        <span> {t.pass.racingHud.speedUnit}</span>
      </p>
    </div>
  )
}
