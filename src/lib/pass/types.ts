export type PassPhase =
  | 'idle'
  | 'staging'
  | 'amber'
  | 'green'
  | 'racing'
  | 'finished'

/** Race camera: chase the car, or pull back to see the full strip. */
export type PassCameraView = 'follow' | 'wide'

/** Educational rival in the other lane (classic two-car drag). */
export type PassOpponentId = 'f1' | 'jet'

export type PassQuality = 'high' | 'low'

export type PassBridgeHandlers = {
  onPhase: (phase: PassPhase) => void
  onClock: (seconds: number) => void
  onFinished: () => void
  onWebglUnavailable: () => void
}

export type PassSceneMeta = {
  camaroUsesGlb: boolean
  camaroHasTextures: boolean
}

export type PassCommands = {
  stage: () => void
  reset: () => void
  setMuted: (muted: boolean) => void
  setCameraView: (view: PassCameraView) => void
  setOpponent: (opponent: PassOpponentId) => void
  destroy: () => void
}

export type PassRaceFrame = {
  progress01: number
  clock: number
  speed01: number
  speedKmh: number
  heroX: number
  splitHit?: import('../../data/simulator').HudSplitId | null
}
