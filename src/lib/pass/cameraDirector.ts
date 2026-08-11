import type { Entity } from 'playcanvas'

import type { PassPhase } from './types'

const IDLE_YAW_CLAMP_DEG = 10
const IDLE_YAW_SENSITIVITY_DEG = 28
const IDLE_RETURN_LERP = 0.06

/** Elevated 3/4 overview — full strip in frame. */
function overviewPose(trackLength: number): {
  position: [number, number, number]
  look: [number, number, number]
} {
  return {
    position: [trackLength * 0.28, 38, 52],
    look: [trackLength * 0.48, 0.4, 0],
  }
}

function stagingPose(trackLength: number): {
  position: [number, number, number]
  look: [number, number, number]
} {
  return {
    position: [-6, 22, 34],
    look: [trackLength * 0.22, 1.2, 0],
  }
}

function racePose(
  trackLength: number,
  progress01: number,
): {
  position: [number, number, number]
  look: [number, number, number]
} {
  // Keep the whole strip readable; ease camera slightly along the pass.
  const x = trackLength * (0.22 + progress01 * 0.28)
  return {
    position: [x, 34, 48],
    look: [trackLength * (0.42 + progress01 * 0.28), 0.6, 0],
  }
}

function finishedPose(trackLength: number): {
  position: [number, number, number]
  look: [number, number, number]
} {
  return {
    position: [trackLength * 0.55, 32, 46],
    look: [trackLength * 0.78, 1.2, 0],
  }
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

type CameraDirectorOptions = {
  camera: Entity
  camaro: Entity
  trackLength: number
  reducedMotion: boolean
}

export function createCameraDirector(opts: CameraDirectorOptions) {
  const { camera, trackLength, reducedMotion } = opts

  const idle = overviewPose(trackLength)
  camera.setLocalPosition(...idle.position)
  camera.lookAt(...idle.look)

  const basePosition = camera.getLocalPosition().clone()
  const baseEulers = camera.getLocalEulerAngles().clone()

  let currentPhase: PassPhase = 'idle'
  let idleYaw = 0

  const applyIdleFrame = () => {
    camera.setLocalPosition(basePosition)
    camera.setLocalEulerAngles(baseEulers.x, baseEulers.y + idleYaw, baseEulers.z)
  }

  const applyPose = (pose: { position: [number, number, number]; look: [number, number, number] }) => {
    camera.setLocalPosition(...pose.position)
    camera.lookAt(...pose.look)
  }

  const onIdleLook = (dx: number, dy: number) => {
    if (reducedMotion || currentPhase !== 'idle') return

    idleYaw = Math.max(
      -IDLE_YAW_CLAMP_DEG,
      Math.min(IDLE_YAW_CLAMP_DEG, idleYaw - dx * IDLE_YAW_SENSITIVITY_DEG),
    )
    void dy
    applyIdleFrame()
  }

  const onPhase = (phase: PassPhase) => {
    currentPhase = phase

    if (reducedMotion) {
      applyPose(overviewPose(trackLength))
      return
    }

    switch (phase) {
      case 'idle':
        idleYaw = lerp(idleYaw, 0, IDLE_RETURN_LERP)
        applyIdleFrame()
        break
      case 'staging':
      case 'amber':
      case 'green':
        applyPose(stagingPose(trackLength))
        break
      case 'racing':
        applyPose(racePose(trackLength, 0))
        break
      case 'finished':
        applyPose(finishedPose(trackLength))
        break
      default: {
        const exhaustiveCheck: never = phase
        void exhaustiveCheck
      }
    }
  }

  const onRaceProgress = (t01: number) => {
    if (reducedMotion || currentPhase !== 'racing') return
    applyPose(racePose(trackLength, Math.min(1, Math.max(0, t01))))
  }

  const reset = () => {
    currentPhase = 'idle'
    idleYaw = 0
    applyPose(overviewPose(trackLength))
    basePosition.copy(camera.getLocalPosition())
    baseEulers.copy(camera.getLocalEulerAngles())
  }

  const destroy = () => {
    // No external listeners.
  }

  return { onIdleLook, onPhase, onRaceProgress, reset, destroy }
}
