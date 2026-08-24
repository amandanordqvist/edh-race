import type { Application } from 'playcanvas'

import {
  QUARTER_METERS,
  simulatorRacers,
  TREE_AMBER_MS,
  TREE_STAGE_MS,
  nextHudSplit,
} from '../../data/simulator'
import type { PassScene } from './buildScene'
import {
  camaroCoastSpeed01,
  camaroCoastSpeedKmh,
  camaroStripProgress,
  comparisonStripProgress,
  SHUTDOWN_COAST_S,
  shutdownCoast01,
} from './ease'
import { SHUTDOWN_LENGTH, STREET_CAR_ET, STREET_CAR_START_X } from './passLayout'
import type { PassBridgeHandlers, PassPhase, PassRaceFrame } from './types'

const GREEN_HOLD_MS = 180
const REDUCED_MOTION_FLASH_MS = 200
const FINISH_HOLD_MS = 80
const HERO_ET = simulatorRacers.find((racer) => racer.id === 'camaro')?.et ?? 5.7451
const HERO_TOP_SPEED = 415
/** How long we wait for the user to tap after green before auto-launching. */
const AUTO_LAUNCH_TIMEOUT_MS = 2500
/** Hold the Camaro in shutdown until chutes are out and speed has dumped. */
const HERO_SETTLE_S = SHUTDOWN_COAST_S

/** Slow-mo window around the hero finish line (in sim seconds). */
const SLOW_MO_START = HERO_ET - 0.22
const SLOW_MO_MID = HERO_ET + 0.06
const SLOW_MO_END = HERO_ET + 0.42
const SLOW_MO_MIN = 0.32

function computeTimeScale(t: number): number {
  if (t < SLOW_MO_START || t > SLOW_MO_END) return 1
  if (t < SLOW_MO_MID) {
    const u = (t - SLOW_MO_START) / (SLOW_MO_MID - SLOW_MO_START)
    return 1 - (1 - SLOW_MO_MIN) * u
  }
  const u = (t - SLOW_MO_MID) / (SLOW_MO_END - SLOW_MO_MID)
  return SLOW_MO_MIN + (1 - SLOW_MO_MIN) * u
}

function chuteDeploy(t: number): number {
  const start = HERO_ET + 0.04
  const full = HERO_ET + 0.85
  if (t <= start) return 0
  if (t >= full) return 1
  return (t - start) / (full - start)
}

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
  let simElapsed = 0
  let updateHandler: ((dt: number) => void) | null = null
  let finishing = false
  let lastSplitIndex = -1
  /** Wall-clock time (ms) when the tree turned green; 0 means "not green". */
  let greenAtMs = 0
  /** Wall-clock time when the user tapped launch (or auto-fallback fired). */
  let launchedAtMs = 0

  const clearTimers = () => {
    timers.forEach((id) => window.clearTimeout(id))
    timers = []
  }

  const setPhase = (next: PassPhase) => {
    phase = next
    handlers.onPhase(next)
  }

  const restoreTimeScale = () => {
    app.timeScale = 1
  }

  const stopUpdate = () => {
    if (updateHandler) {
      app.off('update', updateHandler)
      updateHandler = null
    }
    restoreTimeScale()
  }

  const coastDistance = SHUTDOWN_LENGTH * 0.55

  const racerWorldX = (elapsedS: number, racerId: (typeof simulatorRacers)[number]['id']): number => {
    const racer = simulatorRacers.find((entry) => entry.id === racerId)
    const et = racer?.et ?? HERO_ET
    const raceU =
      racerId === 'camaro'
        ? Math.min(1, camaroStripProgress(elapsedS))
        : comparisonStripProgress(Math.min(1, elapsedS / et))
    return raceU * scene.trackLength + shutdownCoast01(elapsedS, et) * coastDistance
  }

  const pushScoreboard = (elapsedS: number) => {
    const opponentId = scene.getOpponent()
    const opponent = simulatorRacers.find((racer) => racer.id === opponentId)
    const opponentEt = opponent?.et ?? HERO_ET
    const racing = elapsedS > 0.001
    scene.scoreboard.update({
      heroEt: racing ? Math.min(elapsedS, HERO_ET) : null,
      heroTrap: elapsedS >= HERO_ET - 0.0005 ? HERO_TOP_SPEED : null,
      heroWin: elapsedS >= HERO_ET - 0.0005,
      opponentId,
      opponentEt: racing ? Math.min(elapsedS, opponentEt) : null,
      opponentTrap: elapsedS >= opponentEt - 0.0005 ? (opponent?.trapKmh ?? null) : null,
    })
  }

  const parkInShutdown = () => {
    const camaro = scene.racers.camaro
    if (!camaro) return
    const pos = camaro.getLocalPosition()
    camaro.setLocalPosition(scene.trackLength + coastDistance, pos.y, pos.z)
  }

  const finishRace = (clock: number) => {
    finishing = false
    stopUpdate()
    applyRacerMotion(simElapsed)
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
      entity.setLocalPosition(racerWorldX(elapsedS, racer.id), pos.y, pos.z)
    })

    if (scene.streetCar.enabled) {
      const wagon = scene.streetCar
      const pos = wagon.getLocalPosition()
      const u = comparisonStripProgress(Math.min(1, elapsedS / STREET_CAR_ET))
      wagon.setLocalPosition(
        STREET_CAR_START_X + u * (scene.trackLength - STREET_CAR_START_X),
        pos.y,
        pos.z,
      )
    }

    pushScoreboard(elapsedS)
  }

  const runRace = () => {
    if (reducedMotion) {
      parkInShutdown()
      onRaceFrame?.({
        progress01: 1,
        clock: HERO_ET,
        speed01: 0,
        speedKmh: HERO_TOP_SPEED,
        heroX: scene.trackLength + coastDistance,
        gapM: 0,
        timeScale: 1,
        chuteDeploy01: 1,
        opponentClock: simulatorRacers.find((r) => r.id === scene.getOpponent())?.et ?? HERO_ET,
      })
      finishRace(HERO_ET)
      return
    }

    finishing = false
    lastSplitIndex = -1
    simElapsed = 0
    setPhase('racing')
    app.timeScale = 1

    const opponentId = scene.getOpponent()
    const opponentEt = simulatorRacers.find((r) => r.id === opponentId)?.et ?? HERO_ET
    const raceEndS = HERO_ET + HERO_SETTLE_S

    updateHandler = (dt: number) => {
      // dt is already scaled by app.timeScale — accumulator naturally slows
      // when we enter the finish slow-mo window.
      simElapsed += dt
      applyRacerMotion(simElapsed)

      const heroFrac = camaroStripProgress(simElapsed)
      const heroX = racerWorldX(simElapsed, 'camaro')
      const heroClock = Math.min(simElapsed, HERO_ET)
      const speed01 = camaroCoastSpeed01(simElapsed, HERO_ET, HERO_TOP_SPEED)
      const speedKmh = camaroCoastSpeedKmh(simElapsed, HERO_ET, HERO_TOP_SPEED)
      const progress01 = Math.min(1, simElapsed / HERO_ET)

      const oppFrac =
        opponentEt > 0
          ? comparisonStripProgress(Math.min(1, simElapsed / opponentEt))
          : 0
      const gapM = (heroFrac - oppFrac) * QUARTER_METERS

      const split = nextHudSplit(simElapsed, lastSplitIndex)
      if (split) {
        lastSplitIndex = split.index
      }

      const timeScale = computeTimeScale(simElapsed)
      app.timeScale = timeScale
      const chuteDeploy01 = chuteDeploy(simElapsed)

      onRaceFrame?.({
        progress01,
        clock: heroClock,
        speed01,
        speedKmh,
        heroX,
        gapM,
        timeScale,
        chuteDeploy01,
        opponentClock: Math.min(simElapsed, opponentEt),
        splitHit: split?.id ?? null,
      })
      handlers.onClock(heroClock)

      if (!finishing && simElapsed >= raceEndS) {
        finishing = true
        restoreTimeScale()
        timers.push(window.setTimeout(() => finishRace(HERO_ET), FINISH_HOLD_MS))
      }
    }

    app.on('update', updateHandler)
  }

  const fireLaunch = (userReactionS: number | null) => {
    if (phase !== 'green') return
    launchedAtMs = performance.now()
    handlers.onLaunch(userReactionS)
    // Small green-hold delay so the visual "GRÖNT" tick isn't cut off.
    timers.push(window.setTimeout(runRace, GREEN_HOLD_MS))
  }

  const stage = () => {
    if (phase === 'staging' || phase === 'amber' || phase === 'green' || phase === 'racing') {
      return
    }

    clearTimers()
    stopUpdate()
    finishing = false
    lastSplitIndex = -1
    greenAtMs = 0
    launchedAtMs = 0
    scene.resetRacers()
    handlers.onClock(0)
    setPhase('staging')
    scene.setTreeLights('prestage')

    if (reducedMotion) {
      timers.push(window.setTimeout(runRace, REDUCED_MOTION_FLASH_MS))
      return
    }

    timers.push(
      window.setTimeout(() => {
        scene.setTreeLights('stage')
      }, 280),
    )

    timers.push(
      window.setTimeout(() => {
        setPhase('amber')
        scene.setTreeLights('amber')

        timers.push(
          window.setTimeout(() => {
            setPhase('green')
            scene.setTreeLights('green')
            greenAtMs = performance.now()

            // Auto-fallback: if the user doesn't tap, launch anyway using
            // Anders' real reaction so the race still plays out on its own.
            timers.push(
              window.setTimeout(() => {
                if (phase === 'green' && launchedAtMs === 0) {
                  fireLaunch(null)
                }
              }, AUTO_LAUNCH_TIMEOUT_MS),
            )
          }, TREE_AMBER_MS),
        )
      }, TREE_STAGE_MS),
    )
  }

  const launch = () => {
    if (phase !== 'green' || greenAtMs === 0 || launchedAtMs !== 0) return
    const reactionS = (performance.now() - greenAtMs) / 1000
    fireLaunch(reactionS)
  }

  /**
   * Replay-mode seek. Only meaningful after the race has finished — the update
   * loop is stopped and we manually re-apply motion + emit a frame so the HUD,
   * camera, and VFX all reflect the requested moment.
   */
  const seek = (elapsedS: number) => {
    if (phase !== 'finished') return
    const t = Math.max(0, Math.min(HERO_ET + SHUTDOWN_COAST_S, elapsedS))
    applyRacerMotion(t)

    const heroFrac = camaroStripProgress(t)
    const heroX = racerWorldX(t, 'camaro')
    const heroClock = Math.min(t, HERO_ET)
    const speed01 = camaroCoastSpeed01(t, HERO_ET, HERO_TOP_SPEED)
    const speedKmh = camaroCoastSpeedKmh(t, HERO_ET, HERO_TOP_SPEED)
    const progress01 = Math.min(1, t / HERO_ET)

    const opponentId = scene.getOpponent()
    const opponentEt = simulatorRacers.find((r) => r.id === opponentId)?.et ?? HERO_ET
    const oppFrac =
      opponentEt > 0 ? comparisonStripProgress(Math.min(1, t / opponentEt)) : 0
    const gapM = (heroFrac - oppFrac) * QUARTER_METERS
    const chute01 = chuteDeploy(t)

    onRaceFrame?.({
      progress01,
      clock: heroClock,
      speed01,
      speedKmh,
      heroX,
      gapM,
      timeScale: 1,
      chuteDeploy01: chute01,
      opponentClock: Math.min(t, opponentEt),
      splitHit: null,
    })
    handlers.onClock(heroClock)
  }

  const reset = () => {
    clearTimers()
    stopUpdate()
    finishing = false
    lastSplitIndex = -1
    simElapsed = 0
    greenAtMs = 0
    launchedAtMs = 0
    scene.resetRacers()
    scene.setTreeLights('off')
    handlers.onClock(0)
    setPhase('idle')
  }

  const destroy = () => {
    clearTimers()
    stopUpdate()
    restoreTimeScale()
  }

  return { stage, launch, seek, reset, destroy }
}
