import type { Entity } from 'playcanvas'

import {
  cockpitPose,
  directedRacePose,
  finishSettlePose,
  heroFinishPose,
  inspectPose,
  launchPose,
  lerp,
  mixPose,
  overviewPose,
  treeInsertPose,
  type CameraPose,
} from './cameraPoses'
import type { PassCameraView, PassPhase } from './types'

const CAMERA_LERP = 8.5
const ZOOM_LERP = 5.5
const SLOW_MO_MIN_SCALE = 0.32

/** Idle: rear 3/4 so the Camaro is the hero — tree stays beside, not through the nose. */
export const PASS_INSPECT_YAW_DEG = -40
export const PASS_INSPECT_PITCH_DEG = 9
export const PASS_INSPECT_RADIUS = 5.6
export const PASS_INSPECT_LOOK_Y = 0.58

const INSPECT_RADIUS_DEFAULT = PASS_INSPECT_RADIUS
const INSPECT_RADIUS_MIN = 3.6
const INSPECT_RADIUS_MAX = 8.5
const INSPECT_PITCH_MIN = 4
const INSPECT_PITCH_MAX = 22
const INSPECT_YAW_SENS = 95
const INSPECT_PITCH_SENS = 55
const INSPECT_START_YAW = PASS_INSPECT_YAW_DEG
const INSPECT_START_PITCH = PASS_INSPECT_PITCH_DEG

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function idleInspect(
  heroX: number,
  heroZ: number,
  yaw: number,
  pitch: number,
  radius: number,
): CameraPose {
  return inspectPose(heroX, heroZ, yaw, pitch, radius, PASS_INSPECT_LOOK_Y)
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
  let prevRaceSpeed = 0
  let accelAmount = 0
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
  let raceProgress = 0

  /** 0 = follow car, 1 = zoomed out to full strip */
  let zoomTarget = 0
  let zoomCurrent = 0
  let view: PassCameraView = 'follow'
  let launchShake = 0
  let shakePhase = 0
  /** Cockpit-mode shake follows raceSpeed and never fully fades until race ends. */
  let cockpitShakePhase = 0

  const initialInspect = idleInspect(heroX, heroZ, inspectYaw, inspectPitch, inspectRadius)
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

  const applyPoseImmediate = (pose: CameraPose) => {
    currentPos = [...pose.position]
    currentLook = [...pose.look]
    currentFov = pose.fov
    camera.setLocalPosition(...currentPos)
    camera.lookAt(...currentLook)
    cameraComponent.fov = currentFov
  }

  applyPoseImmediate(initialInspect)

  const resolveTargetPose = (): CameraPose => {
    switch (currentPhase) {
      case 'idle':
        return idleInspect(heroX, heroZ, inspectYaw, inspectPitch, inspectRadius)

      case 'staging':
      case 'amber':
        return treeInsertPose(heroX, heroZ)

      case 'green':
        return mixPose(treeInsertPose(heroX, heroZ), launchPose(heroX, heroZ, 0.7), 0.35)

      case 'racing':
      case 'finished': {
        if (currentPhase === 'finished') {
          return finishSettlePose(heroX, heroZ)
        }
        if (view === 'cockpit') {
          const pov = cockpitPose(heroX, heroZ, raceSpeed, accelAmount)
          if (slowMoAmount > 0) {
            return mixPose(pov, heroFinishPose(heroX, heroZ), slowMoAmount)
          }
          if (chuteAmount > 0.2) {
            return mixPose(pov, finishSettlePose(heroX, heroZ), chuteAmount)
          }
          return pov
        }
        return directedRacePose(
          heroX,
          heroZ,
          raceProgress,
          raceSpeed,
          accelAmount,
          chuteAmount,
        )
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

    // Acceleration punch — peaks during launch, settles once speed plateaus.
    const rawAccel = Math.max(0, raceSpeed - prevRaceSpeed) / Math.max(dt, 0.001)
    prevRaceSpeed = raceSpeed
    const accelTarget = clamp(rawAccel * 0.085, 0, 1)
    accelAmount = lerp(accelAmount, accelTarget, 1 - Math.exp(-6 * dt))
    if (currentPhase === 'green') {
      accelAmount = Math.max(accelAmount, 0.7)
    }

    const blend =
      currentPhase === 'idle'
        ? 1 - Math.exp(-10.5 * dt)
        : currentPhase === 'finished' || chuteAmount > 0.2
          ? 1 - Math.exp(-11.5 * dt)
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
      launchShake = Math.max(0, launchShake - dt * 3.2)
      shakePhase += dt * 42
      const amp = launchShake * 0.22
      const sx = Math.sin(shakePhase * 1.7) * amp
      const sy = Math.sin(shakePhase * 2.3 + 1.1) * amp * 0.4
      const sz = Math.cos(shakePhase * 1.9) * amp * 0.5
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

    inspectYaw -= dx * INSPECT_YAW_SENS
    inspectPitch = clamp(inspectPitch + dy * INSPECT_PITCH_SENS, INSPECT_PITCH_MIN, INSPECT_PITCH_MAX)
  }

  const onIdleLookEnd = () => {
    // Inspect is position-driven; releasing a drag has no inertia to clear.
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
      if (view !== 'cockpit') {
        view = 'follow'
        onViewChange?.(view)
      }
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
      raceSpeed = 0
      raceProgress = 0
      prevRaceSpeed = 0
      accelAmount = 0
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
          idleInspect(heroX, heroZ, INSPECT_START_YAW, INSPECT_START_PITCH, INSPECT_RADIUS_DEFAULT),
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
    raceProgress = Math.min(1, Math.max(0, progress01))
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
    raceProgress = 0
    prevRaceSpeed = 0
    accelAmount = 0
    heroX = camaro.getLocalPosition().x
    heroZ = camaro.getLocalPosition().z
    inspectYaw = INSPECT_START_YAW
    inspectPitch = INSPECT_START_PITCH
    inspectRadius = INSPECT_RADIUS_DEFAULT
    zoomTarget = 0
    zoomCurrent = 0
    view = 'follow'
    launchShake = 0
    shakePhase = 0
    slowMoAmount = 0
    chuteAmount = 0
    onViewChange?.(view)
    applyPoseImmediate(idleInspect(heroX, heroZ, inspectYaw, inspectPitch, inspectRadius))
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
