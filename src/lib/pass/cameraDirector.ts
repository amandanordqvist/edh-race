import type { Entity } from 'playcanvas'

import type { PassCameraView, PassPhase } from './types'

const CAMERA_LERP = 7.5
const ZOOM_LERP = 5.5
/** Deepest slow-mo timeScale from raceController — kept in sync so the hero
 * shot commits fully at peak slow-mo. */
const SLOW_MO_MIN_SCALE = 0.32

/** Idle inspect orbit — full car readable before stage. */
const INSPECT_RADIUS_DEFAULT = 10.2
const INSPECT_RADIUS_MIN = 6.5
const INSPECT_RADIUS_MAX = 14
const INSPECT_PITCH_MIN = 6
const INSPECT_PITCH_MAX = 38
const INSPECT_YAW_SENS = 95
const INSPECT_PITCH_SENS = 55
const INSPECT_AUTO_YAW_DEG = 10
const INSPECT_IDLE_RESUME_S = 2.6
const INSPECT_START_YAW = 42
const INSPECT_START_PITCH = 12

type Pose = {
  position: [number, number, number]
  look: [number, number, number]
  fov: number
}

/** Closer idle establishing shot — soft jump into tree insert. */
function overviewPose(trackLength: number): Pose {
  return {
    position: [trackLength * 0.1, 14, 18],
    look: [1.6, 0.7, 0],
    fov: 46,
  }
}

/**
 * Orbit around the Camaro so the whole body reads.
 * Yaw 0 ≈ rear 3/4; increases orbit counterclockwise around the car.
 */
function inspectPose(
  heroX: number,
  heroZ: number,
  yawDeg: number,
  pitchDeg: number,
  radius: number,
): Pose {
  const lookY = 0.95
  const yaw = (yawDeg * Math.PI) / 180
  const pitch = (pitchDeg * Math.PI) / 180
  const cosPitch = Math.cos(pitch)

  return {
    position: [
      heroX + Math.sin(yaw) * cosPitch * radius,
      lookY + Math.sin(pitch) * radius,
      heroZ + Math.cos(yaw) * cosPitch * radius,
    ],
    look: [heroX, lookY, heroZ],
    fov: 42,
  }
}

/** Tree insert — low, almost dead-behind, so the tree sits between the lanes. */
function treeInsertPose(heroX: number, heroZ: number): Pose {
  return {
    position: [heroX - 6.6, 1.18, heroZ + 0.85],
    look: [heroX + 9, 0.68, heroZ * 0.35],
    fov: 36,
  }
}

/** Chase camera — low and dead-behind, looking straight down the strip. */
function followPose(heroX: number, heroZ: number, speed01: number): Pose {
  return {
    position: [
      heroX - 8.2 - speed01 * 1.2,
      1.28 + speed01 * 0.15,
      heroZ,
    ],
    look: [heroX + 18 + speed01 * 4, 0.72, heroZ],
    fov: 36 + speed01 * 6,
  }
}

/** Chute beat — pulled back and up so both canopies read over the shutdown. */
function chutePose(heroX: number, heroZ: number, settle01: number): Pose {
  const settle = Math.min(1, Math.max(0, settle01))
  return {
    position: [
      heroX - 12.2 - settle * 1.6,
      2.55 + settle * 1.15,
      heroZ + 0.12 + settle * 1.55,
    ],
    look: [heroX + 5.5 - settle * 5.4, 1.15, heroZ],
    fov: 40 + settle * 3,
  }
}

/** Elevated side-rail looking across both lanes. */
function sideRailPose(heroX: number, trackLength: number): Pose {
  const x = Math.min(trackLength * 0.72, Math.max(18, heroX + 10))
  return {
    position: [x, 11, 22],
    look: [x - 6, 0.4, 0],
    fov: 44,
  }
}

function finishWidePose(trackLength: number): Pose {
  return {
    position: [trackLength + 6, 14, 26],
    look: [trackLength + 24, 0.5, 0],
    fov: 46,
  }
}

/**
 * First-person cockpit shot — driver's eyeline just above the windshield,
 * looking straight down the strip. Wide FOV plus continuous chassis shake
 * gives visceral speed even though the geometry itself hasn't changed.
 */
function cockpitPose(heroX: number, heroZ: number, speed01: number): Pose {
  return {
    position: [heroX + 1.35, 1.25 + speed01 * 0.05, heroZ],
    look: [heroX + 32, 1.05 + speed01 * 0.1, heroZ],
    fov: 66 + speed01 * 6,
  }
}

/**
 * Slow-mo finish: still dead-behind, just closer and lower so the car
 * stays parallel to the strip instead of a side-quarter that reads as yaw.
 */
function heroFinishPose(heroX: number, heroZ: number): Pose {
  return {
    position: [heroX - 5.6, 1.08, heroZ],
    look: [heroX + 14, 0.68, heroZ],
    fov: 34,
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function mixPose(a: Pose, b: Pose, t: number): Pose {
  return {
    position: [
      lerp(a.position[0], b.position[0], t),
      lerp(a.position[1], b.position[1], t),
      lerp(a.position[2], b.position[2], t),
    ],
    look: [
      lerp(a.look[0], b.look[0], t),
      lerp(a.look[1], b.look[1], t),
      lerp(a.look[2], b.look[2], t),
    ],
    fov: lerp(a.fov, b.fov, t),
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

type CameraDirectorOptions = {
  camera: Entity
  camaro: Entity
  trackLength: number
  reducedMotion: boolean
  onViewChange?: (view: PassCameraView) => void
}

export function createCameraDirector(opts: CameraDirectorOptions) {
  const { camera, camaro, trackLength, reducedMotion, onViewChange } = opts
  const cameraComponent = camera.camera

  if (!cameraComponent) {
    throw new Error('Pass camera entity is missing a camera component')
  }

  let currentPhase: PassPhase = 'idle'
  let raceSpeed = 0
  let heroX = camaro.getLocalPosition().x
  let heroZ = camaro.getLocalPosition().z
  /** 0 = normal race camera, 1 = fully committed to the hero finish shot. */
  let slowMoAmount = 0
  /** 0 = chase, 1 = chute-beat camera over the shutdown. */
  let chuteAmount = 0

  /** Idle inspect orbit state */
  let inspectYaw = INSPECT_START_YAW
  let inspectPitch = INSPECT_START_PITCH
  let inspectRadius = INSPECT_RADIUS_DEFAULT
  let inspectIdleTimer = 0
  let inspectDragging = false

  /** 0 = follow car, 1 = zoomed out to full strip */
  let zoomTarget = 0
  let zoomCurrent = 0
  let view: PassCameraView = 'follow'
  let launchShake = 0
  let shakePhase = 0
  /** Cockpit-mode shake follows raceSpeed and never fully fades until race ends. */
  let cockpitShakePhase = 0

  const initialInspect = inspectPose(heroX, heroZ, inspectYaw, inspectPitch, inspectRadius)
  let currentPos: [number, number, number] = [...initialInspect.position]
  let currentLook: [number, number, number] = [...initialInspect.look]
  let currentFov = initialInspect.fov

  const emitView = () => {
    // 'cockpit' is explicitly set — don't overwrite it via scroll zoom.
    const next: PassCameraView =
      view === 'cockpit' ? 'cockpit' : zoomTarget >= 0.5 ? 'wide' : 'follow'
    if (next === view) return
    view = next
    onViewChange?.(view)
  }

  const applyPoseImmediate = (pose: Pose) => {
    currentPos = [...pose.position]
    currentLook = [...pose.look]
    currentFov = pose.fov
    camera.setLocalPosition(...currentPos)
    camera.lookAt(...currentLook)
    cameraComponent.fov = currentFov
  }

  applyPoseImmediate(initialInspect)

  const resolveTargetPose = (): Pose => {
    switch (currentPhase) {
      case 'idle':
        return inspectPose(heroX, heroZ, inspectYaw, inspectPitch, inspectRadius)

      case 'staging':
      case 'amber':
        return treeInsertPose(heroX, heroZ)

      case 'green': {
        const insert = treeInsertPose(heroX, heroZ)
        const follow = followPose(heroX, heroZ, 0.08)
        return mixPose(insert, follow, 0.4)
      }

      case 'racing':
      case 'finished': {
        if (view === 'cockpit') {
          const pov = cockpitPose(heroX, heroZ, raceSpeed)
          if (currentPhase === 'racing' && slowMoAmount > 0) {
            return mixPose(pov, heroFinishPose(heroX, heroZ), slowMoAmount)
          }
          return pov
        }
        const follow = followPose(heroX, heroZ, raceSpeed)
        const wide =
          currentPhase === 'finished' && chuteAmount > 0.45
            ? finishWidePose(trackLength)
            : sideRailPose(heroX, trackLength)
        const race = mixPose(follow, wide, zoomCurrent)
        const withSlow =
          currentPhase === 'racing' && slowMoAmount > 0
            ? mixPose(race, heroFinishPose(heroX, heroZ), slowMoAmount)
            : race
        const settle = chuteAmount * (1 - raceSpeed)
        return mixPose(withSlow, chutePose(heroX, heroZ, settle), chuteAmount)
      }

      default: {
        const exhaustiveCheck: never = currentPhase
        return exhaustiveCheck
      }
    }
  }

  const onUpdate = (dt: number) => {
    if (reducedMotion) return

    const camPos = camaro.getLocalPosition()
    heroX = camPos.x
    heroZ = camPos.z
    zoomCurrent = lerp(zoomCurrent, zoomTarget, 1 - Math.exp(-ZOOM_LERP * dt))

    if (currentPhase === 'idle') {
      if (inspectDragging) {
        inspectIdleTimer = 0
      } else {
        inspectIdleTimer += dt
        if (inspectIdleTimer > INSPECT_IDLE_RESUME_S) {
          inspectYaw += INSPECT_AUTO_YAW_DEG * dt
        }
      }
    }

    const blend =
      currentPhase === 'idle'
        ? 1 - Math.exp(-10.5 * dt)
        : 1 - Math.exp(-CAMERA_LERP * dt)

    const pose = resolveTargetPose()

    currentPos = [
      lerp(currentPos[0], pose.position[0], blend),
      lerp(currentPos[1], pose.position[1], blend),
      lerp(currentPos[2], pose.position[2], blend),
    ]
    currentLook = [
      lerp(currentLook[0], pose.look[0], blend),
      lerp(currentLook[1], pose.look[1], blend),
      lerp(currentLook[2], pose.look[2], blend),
    ]
    currentFov = lerp(currentFov, pose.fov, blend)

    camera.setLocalPosition(...currentPos)
    camera.lookAt(...currentLook)

    if (launchShake > 0) {
      launchShake = Math.max(0, launchShake - dt * 3.8)
      shakePhase += dt * 38
      const amp = launchShake * 0.28
      const sx = Math.sin(shakePhase * 1.7) * amp
      const sy = Math.sin(shakePhase * 2.3 + 1.1) * amp * 0.45
      const sz = Math.cos(shakePhase * 1.9) * amp * 0.55
      camera.setLocalPosition(currentPos[0] + sx, currentPos[1] + sy, currentPos[2] + sz)
    }

    // Cockpit vibration — locked to raceSpeed so the whole cabin trembles
    // through the strip. Skipped in slow-mo so the finish moment reads clean.
    if (view === 'cockpit' && currentPhase === 'racing' && slowMoAmount < 0.15) {
      cockpitShakePhase += dt * (52 + raceSpeed * 34)
      const amp = 0.045 + raceSpeed * 0.18
      const sx = Math.sin(cockpitShakePhase * 2.7) * amp * 0.55
      const sy = Math.sin(cockpitShakePhase * 3.3 + 0.9) * amp
      const sz = Math.cos(cockpitShakePhase * 2.1) * amp * 0.35
      camera.setLocalPosition(currentPos[0] + sx, currentPos[1] + sy, currentPos[2] + sz)
    }

    cameraComponent.fov = currentFov
  }

  const onIdleLook = (dx: number, dy: number) => {
    if (reducedMotion || currentPhase !== 'idle') return

    inspectDragging = true
    inspectIdleTimer = 0
    inspectYaw -= dx * INSPECT_YAW_SENS
    inspectPitch = clamp(inspectPitch + dy * INSPECT_PITCH_SENS, INSPECT_PITCH_MIN, INSPECT_PITCH_MAX)
  }

  const onIdleLookEnd = () => {
    inspectDragging = false
  }

  /** Scroll: idle = orbit zoom; race/finish = follow↔wide. */
  const onZoomDelta = (deltaY: number) => {
    if (reducedMotion) return

    if (currentPhase === 'idle') {
      inspectRadius = clamp(
        inspectRadius + deltaY * 0.008,
        INSPECT_RADIUS_MIN,
        INSPECT_RADIUS_MAX,
      )
      inspectIdleTimer = 0
      return
    }

    if (currentPhase !== 'racing' && currentPhase !== 'finished') return

    zoomTarget = Math.min(1, Math.max(0, zoomTarget + deltaY * 0.0018))
    emitView()
  }

  const setView = (next: PassCameraView) => {
    if (next === 'cockpit') {
      view = 'cockpit'
      zoomTarget = 0
      onViewChange?.(view)
      return
    }
    view = next
    zoomTarget = next === 'wide' ? 1 : 0
    onViewChange?.(view)
  }

  const getView = () => view

  const onPhase = (phase: PassPhase) => {
    currentPhase = phase

    if (phase === 'staging' || phase === 'amber' || phase === 'green') {
      zoomTarget = 0
      zoomCurrent = 0
      view = 'follow'
      onViewChange?.(view)
    }

    if (phase === 'green') {
      launchShake = 1
      shakePhase = 0
    }

    if (phase === 'idle') {
      zoomTarget = 0
      zoomCurrent = 0
      view = 'follow'
      inspectYaw = INSPECT_START_YAW
      inspectPitch = INSPECT_START_PITCH
      inspectRadius = INSPECT_RADIUS_DEFAULT
      inspectIdleTimer = 0
      inspectDragging = false
      onViewChange?.(view)
    }

    if (phase === 'idle' || phase === 'staging' || phase === 'amber' || phase === 'green') {
      slowMoAmount = 0
      chuteAmount = 0
    }

    if (phase === 'racing') {
      // Preserve an explicit cockpit selection made during idle/staging.
      if (view !== 'cockpit' && zoomTarget <= 0.5) {
        zoomTarget = 0
        view = 'follow'
        onViewChange?.(view)
      }
    }

    if (reducedMotion) {
      if (phase === 'idle') {
        applyPoseImmediate(
          inspectPose(heroX, heroZ, INSPECT_START_YAW, INSPECT_START_PITCH, INSPECT_RADIUS_DEFAULT),
        )
      } else {
        applyPoseImmediate(overviewPose(trackLength))
      }
    }
  }

  const onRaceProgress = (
    progress01: number,
    speed01 = 0,
    nextHeroX?: number,
    timeScale = 1,
    chuteDeploy01 = 0,
  ) => {
    void progress01
    raceSpeed = Math.min(1, Math.max(0, speed01))
    if (typeof nextHeroX === 'number') {
      heroX = nextHeroX
    }
    const clamped = Math.min(1, Math.max(SLOW_MO_MIN_SCALE, timeScale))
    slowMoAmount = (1 - clamped) / (1 - SLOW_MO_MIN_SCALE)
    chuteAmount = Math.min(1, Math.max(0, chuteDeploy01))
  }

  const reset = () => {
    currentPhase = 'idle'
    raceSpeed = 0
    heroX = camaro.getLocalPosition().x
    heroZ = camaro.getLocalPosition().z
    inspectYaw = INSPECT_START_YAW
    inspectPitch = INSPECT_START_PITCH
    inspectRadius = INSPECT_RADIUS_DEFAULT
    inspectIdleTimer = 0
    inspectDragging = false
    zoomTarget = 0
    zoomCurrent = 0
    view = 'follow'
    launchShake = 0
    shakePhase = 0
    slowMoAmount = 0
    chuteAmount = 0
    onViewChange?.(view)
    applyPoseImmediate(inspectPose(heroX, heroZ, inspectYaw, inspectPitch, inspectRadius))
  }

  const destroy = () => {
    // No external listeners.
  }

  return {
    onIdleLook,
    onIdleLookEnd,
    onZoomDelta,
    setView,
    getView,
    onPhase,
    onRaceProgress,
    onUpdate,
    reset,
    destroy,
  }
}
