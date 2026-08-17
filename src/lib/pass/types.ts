export type PassPhase =
  | 'idle'
  | 'staging'
  | 'amber'
  | 'green'
  | 'racing'
  | 'finished'

/** Race camera: chase the car, pull back to see the full strip, or lock POV to the driver. */
export type PassCameraView = 'follow' | 'wide' | 'cockpit'

/** Educational rival in the other lane (classic two-car drag). */
export type PassOpponentId = 'f1' | 'jet'

export type PassQuality = 'high' | 'low'

export type PassBridgeHandlers = {
  onPhase: (phase: PassPhase) => void
  onClock: (seconds: number) => void
  onFinished: () => void
  onWebglUnavailable: () => void
  /**
   * Fires the moment the race actually launches. Reaction time is measured
   * from when the tree turned green; null means auto-fallback (user didn't
   * tap in time / reduced motion).
   */
  onLaunch: (reactionS: number | null) => void
}

export type PassSceneMeta = {
  camaroUsesGlb: boolean
  camaroHasTextures: boolean
}

export type PassCommands = {
  stage: () => void
  /**
   * User-triggered launch — measured against green-light time.
   * Only meaningful once the tree is green; otherwise a no-op or a foul.
   */
  launch: () => void
  /**
   * Post-race scrubber: applies motion at the given elapsed seconds and emits
   * a fresh frame so the scene reflects that moment. Only meaningful after
   * the race has entered the 'finished' phase.
   */
  seek: (elapsedS: number) => void
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
  /** Lead in metres (positive = EDH ahead of opponent, negative = behind). */
  gapM: number
  /** 0-1 slow-motion factor. 1 = real time, 0.32 = deep slow-mo. */
  timeScale: number
  /** 0-1 drag chute opening, from "just past the finish line" onwards. */
  chuteDeploy01: number
  /** Opponent elapsed seconds, clamped to their ET once they finish. */
  opponentClock: number
  splitHit?: import('../../data/simulator').HudSplitId | null
}
