export type SimulatorRacerId = 'camaro' | 'f1' | 'jet'

export type SimulatorRacer = {
  id: SimulatorRacerId
  /** Elapsed time over 402 m (quarter mile), seconds */
  et: number
  /** Display top speed for finish board */
  speedLabel: string
}

/** Educational standing-start comparison over 402 m. The Beast is the hero. */
export const simulatorRacers: SimulatorRacer[] = [
  { id: 'camaro', et: 5.74, speedLabel: '415 km/h' },
  { id: 'f1', et: 9.4, speedLabel: '~330 km/h' },
  { id: 'jet', et: 16.8, speedLabel: '~290 km/h' },
]

export const TREE_STAGE_MS = 700
export const TREE_AMBER_MS = 500
export const QUARTER_METERS = 402
