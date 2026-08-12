import type { Application, Entity } from 'playcanvas'

import type { PassPhase } from './types'

type WheelSpinOptions = {
  app: Application
  wheels: Entity[]
  reducedMotion: boolean
}

/**
 * Only primitive Camaro wheels have hub pivots.
 * The GLB wheels share a car-origin pivot with baked mesh offsets — rotating them
 * flings the tires across the strip.
 */
function isSpinnableWheel(name: string): boolean {
  return name.toLowerCase().includes('camaro-wheel-')
}

function isRearPrimitiveWheel(name: string): boolean {
  const lower = name.toLowerCase()
  return lower.includes('camaro-wheel-rl') || lower.includes('camaro-wheel-rr')
}

function resetPrimitiveWheel(wheel: Entity): void {
  wheel.setLocalEulerAngles(0, 0, 90)
}

export function createCamaroWheelSpin(opts: WheelSpinOptions) {
  const { app, wheels, reducedMotion } = opts

  const spinnable = wheels.filter((wheel) => isSpinnableWheel(wheel.name))
  const rearWheels = spinnable.filter((wheel) => isRearPrimitiveWheel(wheel.name))
  const spinTargets = rearWheels.length > 0 ? rearWheels : spinnable

  let phase: PassPhase = 'idle'
  let raceSpeed = 0
  let updateHandler: ((dt: number) => void) | null = null

  const spinWheels = (targets: Entity[], rate: number, dt: number) => {
    targets.forEach((wheel) => {
      const angles = wheel.getLocalEulerAngles()
      // Primitive cylinders are laid on Z with 90° roll; spin around local X.
      wheel.setLocalEulerAngles(angles.x + rate * dt, angles.y, angles.z)
    })
  }

  const update = (dt: number) => {
    if (reducedMotion || spinnable.length === 0) return

    switch (phase) {
      case 'staging':
        spinWheels(spinTargets, 920, dt)
        break
      case 'amber':
        spinWheels(spinTargets, 1280, dt)
        break
      case 'green':
        spinWheels(spinnable, 640, dt)
        break
      case 'racing':
        spinWheels(spinnable, 180 + raceSpeed * 2200, dt)
        break
      case 'idle':
      case 'finished':
        break
      default: {
        const exhaustiveCheck: never = phase
        void exhaustiveCheck
      }
    }
  }

  const onPhase = (next: PassPhase) => {
    phase = next
  }

  const onRaceFrame = (_progress01: number, speed01: number) => {
    raceSpeed = speed01
  }

  const reset = () => {
    phase = 'idle'
    raceSpeed = 0
    spinnable.forEach(resetPrimitiveWheel)
  }

  /** World-space rear tire anchors for burnout smoke (empty when only GLB wheels exist). */
  const getRearAnchors = (): [number, number, number][] => {
    if (spinTargets.length === 0) return []

    return spinTargets.map((wheel) => {
      const pos = wheel.getPosition()
      return [pos.x, pos.y, pos.z]
    })
  }

  const start = () => {
    if (updateHandler) return
    updateHandler = (dt) => update(dt)
    app.on('update', updateHandler)
  }

  const destroy = () => {
    if (updateHandler) {
      app.off('update', updateHandler)
      updateHandler = null
    }
  }

  spinnable.forEach(resetPrimitiveWheel)
  start()

  return { onPhase, onRaceFrame, reset, getRearAnchors, destroy }
}
