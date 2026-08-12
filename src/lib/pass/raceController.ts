import type { Application } from 'playcanvas'

import { simulatorRacers, TREE_AMBER_MS, TREE_STAGE_MS, nextHudSplit } from '../../data/simulator'
import type { PassScene } from './buildScene'
import {
  camaroDisplaySpeedKmh,
  camaroSpeed01,
  camaroStripProgress,
  comparisonStripProgress,
} from './ease'
import type { PassBridgeHandlers, PassPhase, PassRaceFrame } from './types'

const GREEN_HOLD_MS = 180
const REDUCED_MOTION_FLASH_MS = 200
const FINISH_HOLD_MS = 420
const HERO_ET = simulatorRacers.find((racer) => racer.id === 'camaro')?.et ?? 5.7451
const HERO_TOP_SPEED = 415

type RaceControllerOptions = {
  app: Application
  scene: PassScene
  reducedMotion: boolean
  handlers: PassBridgeHandlers
  onRaceFrame?: (frame: PassRaceFrame) => void
}

export function createRaceController(opts: RaceControllerOptions) {
  const { app, scene, reducedMotion, handlers, onRaceFrame } = opts

  let phase: PassPhase = 'idle'
  let timers: number[] = []
  let raceStartAt = 0
  let hiddenSince: number | null = null
  let updateHandler: ((dt: number) => void) | null = null
  let finishing = false
  let lastSplitIndex = -1

  const clearTimers = () => {
    timers.forEach((id) => window.clearTimeout(id))
    timers = []
  }

  const setPhase = (next: PassPhase) => {
    phase = next
    handlers.onPhase(next)
  }

  const stopUpdate = () => {
    if (updateHandler) {
      app.off('update', updateHandler)
      updateHandler = null
    }
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      hiddenSince = performance.now()
      return
    }

    if (hiddenSince != null) {
      raceStartAt += performance.now() - hiddenSince
      hiddenSince = null
    }
  }

  document.addEventListener('visibilitychange', onVisibilityChange)

  const snapHeroToFinish = () => {
    const camaro = scene.racers.camaro
    if (!camaro) return
    const pos = camaro.getLocalPosition()
    camaro.setLocalPosition(scene.trackLength, pos.y, pos.z)
  }

  const finishRace = (clock: number) => {
    finishing = false
    stopUpdate()
    snapHeroToFinish()
    handlers.onClock(clock)
    setPhase('finished')
    handlers.onFinished()
  }

  const applyRacerMotion = (elapsedS: number) => {
    const opponentId = scene.getOpponent()

    simulatorRacers.forEach((racer) => {
      if (racer.id !== 'camaro' && racer.id !== opponentId) return

      const entity = scene.racers[racer.id]
      if (!entity || !entity.enabled) return

      const pos = entity.getLocalPosition()

      if (racer.id === 'camaro') {
        const u = camaroStripProgress(elapsedS)
        entity.setLocalPosition(u * scene.trackLength, pos.y, pos.z)
        return
      }

      const t = Math.min(1, elapsedS / racer.et)
      const u = comparisonStripProgress(t)
      entity.setLocalPosition(u * scene.trackLength, pos.y, pos.z)
    })
  }

  const runRace = () => {
    if (reducedMotion) {
      snapHeroToFinish()
      onRaceFrame?.({
        progress01: 1,
        clock: HERO_ET,
        speed01: 0,
        speedKmh: HERO_TOP_SPEED,
        heroX: scene.trackLength,
      })
      finishRace(HERO_ET)
      return
    }

    finishing = false
    lastSplitIndex = -1
    setPhase('racing')
    raceStartAt = performance.now()

    const opponentId = scene.getOpponent()
    const opponentEt = simulatorRacers.find((r) => r.id === opponentId)?.et ?? HERO_ET
    const raceEndS = Math.max(HERO_ET, opponentEt)

    updateHandler = () => {
      if (document.visibilityState === 'hidden') return

      const elapsedS = (performance.now() - raceStartAt) / 1000
      applyRacerMotion(elapsedS)

      const heroX = camaroStripProgress(elapsedS) * scene.trackLength
      const heroClock = Math.min(elapsedS, HERO_ET)
      const speed01 = camaroSpeed01(heroClock, HERO_TOP_SPEED)
      const speedKmh = camaroDisplaySpeedKmh(heroClock, HERO_TOP_SPEED)
      const progress01 = Math.min(1, elapsedS / HERO_ET)
      const split = nextHudSplit(elapsedS, lastSplitIndex)
      if (split) {
        lastSplitIndex = split.index
      }

      onRaceFrame?.({
        progress01,
        clock: heroClock,
        speed01,
        speedKmh,
        heroX,
        splitHit: split?.id ?? null,
      })
      handlers.onClock(heroClock)

      if (elapsedS >= HERO_ET) {
        snapHeroToFinish()
      }

      if (!finishing && elapsedS >= raceEndS) {
        finishing = true
        timers.push(window.setTimeout(() => finishRace(HERO_ET), FINISH_HOLD_MS))
      }
    }

    app.on('update', updateHandler)
  }

  const stage = () => {
    if (phase === 'staging' || phase === 'amber' || phase === 'green' || phase === 'racing') {
      return
    }

    clearTimers()
    stopUpdate()
    finishing = false
    lastSplitIndex = -1
    scene.resetRacers()
    handlers.onClock(0)
    setPhase('staging')
    scene.setTreeLights('stage')

    if (reducedMotion) {
      timers.push(window.setTimeout(runRace, REDUCED_MOTION_FLASH_MS))
      return
    }

    timers.push(
      window.setTimeout(() => {
        setPhase('amber')
        scene.setTreeLights('amber')

        timers.push(
          window.setTimeout(() => {
            setPhase('green')
            scene.setTreeLights('green')

            timers.push(window.setTimeout(runRace, GREEN_HOLD_MS))
          }, TREE_AMBER_MS),
        )
      }, TREE_STAGE_MS),
    )
  }

  const reset = () => {
    clearTimers()
    stopUpdate()
    finishing = false
    lastSplitIndex = -1
    scene.resetRacers()
    scene.setTreeLights('off')
    handlers.onClock(0)
    setPhase('idle')
  }

  const destroy = () => {
    clearTimers()
    stopUpdate()
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }

  return { stage, reset, destroy }
}
