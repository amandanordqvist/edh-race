import type { Entity } from 'playcanvas'

const START_YAW = 42
const PITCH = 10
const RADIUS = 6.35
const IDLE_DEG_PER_S = 8
const YAW_SENS = 180
const RESUME_MS = 3200

function clampYaw(value: number): number {
  const wrapped = value % 360
  return wrapped < 0 ? wrapped + 360 : wrapped
}

type StudioOrbitOptions = {
  camera: Entity
  look: [number, number, number]
  reducedMotion: boolean
}

export function createStudioOrbit(opts: StudioOrbitOptions) {
  const { camera, look, reducedMotion } = opts
  let yaw = START_YAW
  let paused = reducedMotion
  let resumeAt = 0

  const apply = () => {
    const yawRad = (yaw * Math.PI) / 180
    const pitchRad = (PITCH * Math.PI) / 180
    const cosPitch = Math.cos(pitchRad)
    camera.setLocalPosition(
      look[0] + Math.sin(yawRad) * cosPitch * RADIUS,
      look[1] + Math.sin(pitchRad) * RADIUS,
      look[2] + Math.cos(yawRad) * cosPitch * RADIUS,
    )
    camera.lookAt(look[0], look[1], look[2])
  }

  apply()

  return {
    onUpdate(dt: number) {
      if (reducedMotion) return
      if (paused) {
        if (resumeAt > 0 && performance.now() >= resumeAt) {
          paused = false
          resumeAt = 0
        }
        return
      }
      yaw = clampYaw(yaw + IDLE_DEG_PER_S * dt)
      apply()
    },
    onDrag(ndx: number) {
      if (reducedMotion) return
      paused = true
      resumeAt = 0
      yaw = clampYaw(yaw - ndx * YAW_SENS)
      apply()
    },
    onDragEnd() {
      if (reducedMotion) return
      resumeAt = performance.now() + RESUME_MS
    },
    nudgeYaw(deltaDeg: number) {
      if (reducedMotion) return
      paused = true
      resumeAt = performance.now() + RESUME_MS
      yaw = clampYaw(yaw + deltaDeg)
      apply()
    },
  }
}

export type StudioOrbit = ReturnType<typeof createStudioOrbit>
