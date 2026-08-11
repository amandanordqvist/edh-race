import type { Application } from 'playcanvas'

import { simulatorRacers, TREE_AMBER_MS, TREE_STAGE_MS } from '../../data/simulator'
import type { PassScene } from './buildScene'
import { power2In } from './ease'
import type { PassBridgeHandlers, PassPhase } from './types'

const GREEN_HOLD_MS = 180
const REDUCED_MOTION_FLASH_MS = 200
const MAX_ET = Math.max(...simulatorRacers.map((racer) => racer.et))
const HERO_ET = simulatorRacers.find((racer) => racer.id === 'camaro')?.et ?? MAX_ET

type RaceControllerOptions = {
  app: Application
  scene: PassScene
  reducedMotion: boolean
  handlers: PassBridgeHandlers
  onRaceFrame?: (progress01: number, clock: number) => void
}

export function createRaceController(opts: RaceControllerOptions) {
  const { app, scene, reducedMotion, handlers, onRaceFrame } = opts

  let phase: PassPhase = 'idle'
  let timers: number[] = []
  let raceStartAt = 0
  let hiddenSince: number | null = null
  let updateHandler: (() => void) | null = null

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

  const snapRacersToFinish = () => {
    simulatorRacers.forEach((racer) => {
      const entity = scene.racers[racer.id]
      if (!entity) return
      const pos = entity.getLocalPosition()
      entity.setLocalPosition(scene.trackLength, pos.y, pos.z)
    })
  }

  const finishRace = (clock: number) => {
    stopUpdate()
    handlers.onClock(clock)
    setPhase('finished')
    handlers.onFinished()
  }

  const runRace = () => {
    if (reducedMotion) {
      snapRacersToFinish()
      onRaceFrame?.(1, MAX_ET)
      finishRace(MAX_ET)
      return
    }

    setPhase('racing')
    raceStartAt = performance.now()

    updateHandler = () => {
      if (document.visibilityState === 'hidden') return

      const elapsedS = (performance.now() - raceStartAt) / 1000

      simulatorRacers.forEach((racer) => {
        const entity = scene.racers[racer.id]
        if (!entity) return
        const u = power2In(Math.min(1, elapsedS / racer.et))
        const pos = entity.getLocalPosition()
        entity.setLocalPosition(u * scene.trackLength, pos.y, pos.z)
      })

      const heroProgress01 = Math.min(1, elapsedS / HERO_ET)
      onRaceFrame?.(heroProgress01, elapsedS)
      handlers.onClock(Math.min(elapsedS, MAX_ET))

      if (elapsedS >= MAX_ET) {
        finishRace(MAX_ET)
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
