export type PassPhase =
  | 'idle'
  | 'staging'
  | 'amber'
  | 'green'
  | 'racing'
  | 'finished'

export type PassQuality = 'high' | 'low'

export type PassBridgeHandlers = {
  onPhase: (phase: PassPhase) => void
  onClock: (seconds: number) => void
  onFinished: () => void
  onWebglUnavailable: () => void
}

export type PassCommands = {
  stage: () => void
  reset: () => void
  setMuted: (muted: boolean) => void
  destroy: () => void
}
