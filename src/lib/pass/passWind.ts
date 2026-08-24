import type { PassPhase } from './types'

type PassWind = {
  setMuted: (muted: boolean) => void
  setPhase: (phase: PassPhase) => void
  setSpeed01: (speed01: number) => void
  whoosh: () => void
  start: () => void
  destroy: () => void
}

const WIND_MAX_GAIN = 0.16
const WHOOSH_GAIN = 0.22

function emptyWind(): PassWind {
  return {
    setMuted: () => undefined,
    setPhase: () => undefined,
    setSpeed01: () => undefined,
    whoosh: () => undefined,
    start: () => undefined,
    destroy: () => undefined,
  }
}

/**
 * Procedural wind + short whooshes. No sample files — gain ramps with speed
 * so chassis roar reads after ~200 km/h without arcade stereo fly-bys.
 */
export function createPassWind(
  context: AudioContext | null,
  reducedMotion: boolean,
): PassWind {
  if (!context || reducedMotion) return emptyWind()

  const noise = context.createBuffer(1, context.sampleRate * 2, context.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1
  }

  const source = context.createBufferSource()
  source.buffer = noise
  source.loop = true

  const filter = context.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 420
  filter.Q.value = 0.7

  const gain = context.createGain()
  gain.gain.value = 0

  source.connect(filter)
  filter.connect(gain)
  gain.connect(context.destination)

  const whooshFilter = context.createBiquadFilter()
  whooshFilter.type = 'highpass'
  whooshFilter.frequency.value = 900
  const whooshGain = context.createGain()
  whooshGain.gain.value = 0
  const whooshSource = context.createBufferSource()
  whooshSource.buffer = noise
  whooshSource.loop = true
  whooshSource.connect(whooshFilter)
  whooshFilter.connect(whooshGain)
  whooshGain.connect(context.destination)

  let started = false
  let muted = true
  let racing = false
  let speed01 = 0

  const applyWind = () => {
    const now = context.currentTime
    const active = !muted && racing
    const feel = Math.max(0, (speed01 - 0.28) / 0.72)
    const target = active ? feel * WIND_MAX_GAIN : 0
    gain.gain.cancelScheduledValues(now)
    gain.gain.linearRampToValueAtTime(target, now + 0.08)
    filter.frequency.linearRampToValueAtTime(420 + feel * 1600, now + 0.12)
  }

  const start = () => {
    if (started) return
    started = true
    try {
      source.start()
      whooshSource.start()
    } catch {
      started = false
    }
  }

  return {
    start,
    setMuted: (next) => {
      muted = next
      applyWind()
      if (next) {
        const now = context.currentTime
        whooshGain.gain.cancelScheduledValues(now)
        whooshGain.gain.setValueAtTime(0, now)
      }
    },
    setPhase: (phase) => {
      racing = phase === 'racing'
      applyWind()
    },
    setSpeed01: (next) => {
      speed01 = next
      applyWind()
    },
    whoosh: () => {
      if (muted || !racing || !started) return
      const now = context.currentTime
      whooshGain.gain.cancelScheduledValues(now)
      whooshGain.gain.setValueAtTime(WHOOSH_GAIN * (0.45 + speed01 * 0.55), now)
      whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11)
    },
    destroy: () => {
      try {
        source.stop()
        whooshSource.stop()
      } catch {
        // Already stopped.
      }
      source.disconnect()
      whooshSource.disconnect()
    },
  }
}
