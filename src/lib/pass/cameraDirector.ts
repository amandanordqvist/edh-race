import type { Entity } from 'playcanvas'

import type { PassPhase } from './types'

const IDLE_YAW_CLAMP_DEG = 12
const IDLE_YAW_SENSITIVITY_DEG = 40
const IDLE_RETURN_LERP = 0.06

const STAGE_POSITION: [number, number, number] = [-9.5, 5.8, 9.2]
const STAGE_LOOK: [number, number, number] = [3.2, 2.2, -0.4]

const RACE_HEIGHT = 4.4
const RACE_SIDE_OFFSET = 9
const RACE_LAG = 5
const RACE_LOOKAHEAD = 16
const RACE_FOLLOW_LERP = 0.12

const FINISHED_PULLBACK: [number, number, number] = [0, 1.1, 4.5]

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
  const { camera, camaro, trackLength, reducedMotion } = opts

  const basePosition = camera.getLocalPosition().clone()
  const baseEulers = camera.getLocalEulerAngles().clone()

  let currentPhase: PassPhase = 'idle'
  let idleYaw = 0
  let followX = basePosition.x
  let followY = basePosition.y
  let followZ = basePosition.z

  const applyIdleFrame = () => {
    camera.setLocalPosition(basePosition)
    camera.setLocalEulerAngles(baseEulers.x, baseEulers.y + idleYaw, baseEulers.z)
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

    if (reducedMotion) return

    switch (phase) {
      case 'idle':
        idleYaw = lerp(idleYaw, 0, IDLE_RETURN_LERP)
        applyIdleFrame()
        break
      case 'staging':
        camera.setLocalPosition(...STAGE_POSITION)
        camera.lookAt(...STAGE_LOOK)
        break
      case 'amber':
      case 'green':
        break
      case 'racing':
        followX = camaro.getLocalPosition().x - RACE_LAG
        followY = RACE_HEIGHT
        followZ = RACE_SIDE_OFFSET
        camera.setLocalPosition(followX, followY, followZ)
        camera.lookAt(camaro.getLocalPosition().x + RACE_LOOKAHEAD, 1.2, 0)
        break
      case 'finished':
        camera.translateLocal(...FINISHED_PULLBACK)
        break
      default: {
        const exhaustiveCheck: never = phase
        void exhaustiveCheck
      }
    }
  }

  const onRaceProgress = (t01: number) => {
    void t01
    if (reducedMotion || currentPhase !== 'racing') return

    const camaroPos = camaro.getLocalPosition()
    const targetX = camaroPos.x - RACE_LAG

    followX = lerp(followX, targetX, RACE_FOLLOW_LERP)
    camera.setLocalPosition(followX, followY, followZ)

    const lookX = Math.min(trackLength, camaroPos.x + RACE_LOOKAHEAD)
    camera.lookAt(lookX, 1.2, 0)
  }

  const reset = () => {
    currentPhase = 'idle'
    idleYaw = 0
    followX = basePosition.x
    followY = basePosition.y
    followZ = basePosition.z
    camera.setLocalPosition(basePosition)
    camera.setLocalEulerAngles(baseEulers)
  }

  const destroy = () => {
    // No external listeners owned by the camera director yet; kept for interface symmetry.
  }

  return { onIdleLook, onPhase, onRaceProgress, reset, destroy }
}
