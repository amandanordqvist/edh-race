import type { PassPhase } from './types'

const AUDIO_PATHS = {
  treeTick: '/audio/pass/tree-tick.wav',
  green: '/audio/pass/green.wav',
  launch: '/audio/pass/launch.wav',
  passLoop: '/audio/pass/pass-loop.wav',
  finish: '/audio/pass/finish.wav',
} as const

const AUDIO_VOLUMES = {
  treeTick: 0.4,
  green: 0.5,
  launch: 0.45,
  passLoop: 0.22,
  finish: 0.4,
} as const

type CueName = keyof typeof AUDIO_PATHS
type CueMap = Record<CueName, HTMLAudioElement>
type BrowserWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

function createAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  const audioContextCtor =
    window.AudioContext ?? (window as BrowserWindow).webkitAudioContext ?? null

  if (!audioContextCtor) return null

  try {
    return new audioContextCtor()
  } catch {
    return null
  }
}

function createCue(src: string, volume: number, loop = false) {
  const cue = new Audio(src)
  cue.preload = 'auto'
  cue.loop = loop
  cue.volume = volume
  cue.muted = true
  return cue
}

function safePause(cue: HTMLAudioElement) {
  try {
    cue.pause()
  } catch {
    // Fail soft if the browser rejects a media operation.
  }
}

function safeReset(cue: HTMLAudioElement) {
  try {
    cue.currentTime = 0
  } catch {
    // Some browsers can reject seeks before metadata is ready.
  }
}

type PassAudioOptions = {
  reducedMotion?: boolean
}

export function createPassAudio(options: PassAudioOptions = {}) {
  const { reducedMotion = false } = options
  const context = createAudioContext()
  const cues: CueMap = {
    treeTick: createCue(AUDIO_PATHS.treeTick, AUDIO_VOLUMES.treeTick),
    green: createCue(AUDIO_PATHS.green, AUDIO_VOLUMES.green),
    launch: createCue(AUDIO_PATHS.launch, AUDIO_VOLUMES.launch),
    passLoop: createCue(AUDIO_PATHS.passLoop, AUDIO_VOLUMES.passLoop, true),
    finish: createCue(AUDIO_PATHS.finish, AUDIO_VOLUMES.finish),
  }

  let muted = true
  let destroyed = false
  let phase: PassPhase = 'idle'
  let unlockPromise: Promise<void> | null = null
  let loopRate = 1

  const syncMuted = () => {
    Object.values(cues).forEach((cue) => {
      cue.muted = muted
    })
  }

  const playCue = (cueName: CueName) => {
    if (destroyed || muted || reducedMotion) return

    const cue = cues[cueName]

    safePause(cue)
    safeReset(cue)
    void cue.play().catch(() => {
      // Missing files or autoplay rejections should keep the race silent.
    })
  }

  const stopLoop = () => {
    const cue = cues.passLoop
    safePause(cue)
    safeReset(cue)
  }

  const startLoop = () => {
    if (destroyed || muted || reducedMotion) return

    const cue = cues.passLoop
    cue.muted = muted
    cue.playbackRate = loopRate
    safeReset(cue)
    void cue.play().catch(() => {
      // Missing files or autoplay rejections should keep the race silent.
    })
  }

  const primeCue = async (cue: HTMLAudioElement) => {
    const previousMuted = cue.muted

    cue.muted = true
    safePause(cue)
    safeReset(cue)

    try {
      await cue.play()
    } catch {
      // Ignore missing files and gesture restrictions; future gestures can retry.
    }

    safePause(cue)
    safeReset(cue)
    cue.muted = previousMuted
  }

  syncMuted()

  const unlock = () => {
    if (destroyed) {
      return Promise.resolve()
    }

    if (unlockPromise) {
      return unlockPromise
    }

    unlockPromise = (async () => {
      if (context?.state === 'suspended') {
        try {
          await context.resume()
        } catch {
          // Continue and let HTMLAudioElement playback fail soft if needed.
        }
      }

      await Promise.all(Object.values(cues).map((cue) => primeCue(cue)))
    })().finally(() => {
      unlockPromise = null
    })

    return unlockPromise
  }

  const setMuted = (nextMuted: boolean) => {
    muted = nextMuted
    syncMuted()

    if (muted) {
      stopLoop()
      return
    }

    void unlock().then(() => {
      if (phase === 'racing' && !muted) {
        startLoop()
      }
    })
  }

  const onPhase = (nextPhase: PassPhase) => {
    phase = nextPhase

    if (reducedMotion) {
      stopLoop()
      return
    }

    switch (nextPhase) {
      case 'idle':
        stopLoop()
        loopRate = 1
        return

      case 'staging':
        stopLoop()
        playCue('treeTick')
        return

      case 'amber':
        playCue('treeTick')
        return

      case 'green':
        stopLoop()
        loopRate = 0.95
        playCue('green')
        playCue('launch')
        return

      case 'racing':
        startLoop()
        return

      case 'finished':
        stopLoop()
        loopRate = 1
        cues.passLoop.playbackRate = 1
        playCue('finish')
        return

      default: {
        const exhaustivePhase: never = nextPhase
        return exhaustivePhase
      }
    }
  }

  const onRaceSpeed = (speed01: number) => {
    if (destroyed || muted || reducedMotion || phase !== 'racing') return

    loopRate = 0.88 + speed01 * 0.82
    cues.passLoop.playbackRate = loopRate
  }

  const destroy = () => {
    if (destroyed) return
    destroyed = true
    stopLoop()
    Object.values(cues).forEach((cue) => {
      safePause(cue)
      cue.removeAttribute('src')
      cue.load()
    })
    void context?.close().catch(() => {
      // Closing an already-closed context is harmless.
    })
  }

  return { setMuted, unlock, onPhase, onRaceSpeed, destroy }
}
