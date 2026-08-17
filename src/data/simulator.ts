export type SimulatorRacerId = 'camaro' | 'f1' | 'jet'

export type SimulatorRacer = {
  id: SimulatorRacerId
  /** Elapsed time over 402 m (quarter mile), seconds */
  et: number
  /** Display top speed for finish board */
  speedLabel: string
  /** Trap speed at 1320' (km/h) for the lane scoreboard. */
  trapKmh: number
}

/** Educational standing-start comparison over 402 m. The Beast is the hero. */
export const simulatorRacers: SimulatorRacer[] = [
  { id: 'camaro', et: 5.7451, speedLabel: '415 km/h', trapKmh: 415 },
  { id: 'f1', et: 9.4, speedLabel: '~330 km/h', trapKmh: 330 },
  { id: 'jet', et: 16.8, speedLabel: '~290 km/h', trapKmh: 290 },
]

export const TREE_STAGE_MS = 700
export const TREE_AMBER_MS = 500
export const QUARTER_METERS = 402
export const QUARTER_FEET = 1320
/** European / EDRS timing distance (660 ft). */
export const EIGHTH_METERS = 201
export const EIGHTH_FEET = 660

export type HudSplitId = 'sixty' | 'threeThirty' | 'eighth' | 'thousand' | 'quarter'

/** HUD callouts fired when Camaro crosses real split times during the pass. */
export const hudSplitCallouts: { id: HudSplitId; et: number }[] = [
  { id: 'sixty', et: 0.9459 },
  { id: 'threeThirty', et: 2.5803 },
  { id: 'eighth', et: 3.8268 },
  { id: 'thousand', et: 4.8724 },
  { id: 'quarter', et: 5.7451 },
]

export function nextHudSplit(
  elapsedS: number,
  afterIndex: number,
): { index: number; id: HudSplitId } | null {
  for (let i = afterIndex + 1; i < hudSplitCallouts.length; i += 1) {
    const split = hudSplitCallouts[i]
    if (split && elapsedS >= split.et) {
      return { index: i, id: split.id }
    }
  }
  return null
}

/**
 * Real Doorslammers timeslip — Anders Edh, 19 May 2024 (PRO DOORSLAMMER E2).
 * Source distances in feet; used for authentic motion + educational timeslip.
 */
export type TimeslipSplitId =
  | 'reaction'
  | 'sixty'
  | 'threeThirty'
  | 'eighth'
  | 'thousand'
  | 'quarter'
  | 'trapMph'

export type TimeslipSplit = {
  id: TimeslipSplitId
  /** Label key in i18n */
  labelKey: TimeslipSplitId
  /** Value shown on the card */
  value: string
  /** Optional secondary value (e.g. km/h next to mph) */
  valueAlt?: string
  /** Feet along the strip; null for reaction / speed-only rows */
  feet: number | null
  /** Elapsed seconds from green when this mark is hit; null for reaction/mph-only */
  et: number | null
}

export const edhTimeslipMeta = {
  event: 'Doorslammers',
  date: '2024-05-19',
  class: 'PRO DOORSLAMMER · E2',
  driver: 'Anders Edh',
  raceNumber: '3944',
  opponent: 'Andreas Sjödin',
  result: 'WIN' as const,
  et: 5.7451,
  trapMph: 258.18,
  trapKmh: 415,
  reaction: 0.2034,
}

/** Motion keyframes: distance fraction of 1320' vs ET from green. */
export const camaroDistanceSplits: { feet: number; et: number }[] = [
  { feet: 0, et: 0 },
  { feet: 60, et: 0.9459 },
  { feet: 330, et: 2.5803 },
  { feet: 594, et: 3.6044 },
  { feet: 660, et: 3.8268 },
  { feet: 934, et: 4.6811 },
  { feet: 1000, et: 4.8724 },
  { feet: 1254, et: 5.5708 },
  { feet: 1320, et: 5.7451 },
]

export const edhTimeslipRows: TimeslipSplit[] = [
  {
    id: 'reaction',
    labelKey: 'reaction',
    value: '0.2034 s',
    feet: null,
    et: null,
  },
  {
    id: 'sixty',
    labelKey: 'sixty',
    value: '0.9459 s',
    feet: 60,
    et: 0.9459,
  },
  {
    id: 'threeThirty',
    labelKey: 'threeThirty',
    value: '2.5803 s',
    feet: 330,
    et: 2.5803,
  },
  {
    id: 'eighth',
    labelKey: 'eighth',
    value: '3.8268 s · 202 mph',
    valueAlt: '326 km/h',
    feet: 660,
    et: 3.8268,
  },
  {
    id: 'thousand',
    labelKey: 'thousand',
    value: '4.8724 s · 235 mph',
    valueAlt: '379 km/h',
    feet: 1000,
    et: 4.8724,
  },
  {
    id: 'quarter',
    labelKey: 'quarter',
    value: '5.7451 s',
    feet: 1320,
    et: 5.7451,
  },
  {
    id: 'trapMph',
    labelKey: 'trapMph',
    value: '258.18 mph',
    valueAlt: '415 km/h',
    feet: 1320,
    et: 5.7451,
  },
]
