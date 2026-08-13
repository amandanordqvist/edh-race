import type { Entity } from 'playcanvas'

import { createMaterial, createPrimitive, type PlayCanvasNamespace } from './scenePrimitives'

const CHUTE_TRAIL_LENGTH = 2.9
const CHUTE_CANOPY_DIAMETER = 1.34
const CHUTE_LINE_THICKNESS = 0.028
const CHUTE_PAIR_Z = 0.4
/** Rear anchor in local Camaro space (car forward is +X). */
const REAR_ANCHOR: [number, number, number] = [-1.62, 1.02, 0]

type ChuteVfxOptions = {
  pc: PlayCanvasNamespace
  parent: Entity
  camaro: Entity
}

type Canopy = {
  disc: Entity
  stripe: Entity
  goreA: Entity
  goreB: Entity
  line: Entity
}

/**
 * Twin doorslammer chutes. World-space so they don't inherit the Camaro scale.
 * Sit above the chase-cam eyeline — follow looks under the canopies, not into them.
 */
export function createChuteVfx(opts: ChuteVfxOptions) {
  const { pc, parent, camaro } = opts

  const canopyMat = createMaterial(pc, {
    diffuse: [0.78, 0.22, 0.14],
    emissive: [0.16, 0.04, 0.02],
    emissiveIntensity: 0.12,
    metalness: 0.02,
    gloss: 0.1,
  })
  canopyMat.opacity = 0
  canopyMat.blendType = pc.BLEND_NORMAL
  canopyMat.depthWrite = false
  canopyMat.update()

  const stripeMat = createMaterial(pc, {
    diffuse: [0.94, 0.94, 0.95],
    emissive: [0.1, 0.1, 0.1],
    emissiveIntensity: 0.08,
    metalness: 0.02,
    gloss: 0.14,
  })
  stripeMat.opacity = 0
  stripeMat.blendType = pc.BLEND_NORMAL
  stripeMat.depthWrite = false
  stripeMat.update()

  const lineMat = createMaterial(pc, {
    diffuse: [0.82, 0.82, 0.84],
    metalness: 0.04,
    gloss: 0.12,
  })

  const makeCanopy = (name: string): Canopy => {
    const disc = createPrimitive(pc, {
      name: `${name}-disc`,
      type: 'sphere',
      position: [0, -30, 0],
      scale: [0.01, 0.01, 0.01],
      material: canopyMat,
      castShadows: false,
      receiveShadows: false,
    })
    const stripe = createPrimitive(pc, {
      name: `${name}-stripe`,
      type: 'sphere',
      position: [0, -30, 0],
      scale: [0.01, 0.01, 0.01],
      material: stripeMat,
      castShadows: false,
      receiveShadows: false,
    })
    const goreA = createPrimitive(pc, {
      name: `${name}-gore-a`,
      type: 'sphere',
      position: [0, -30, 0],
      scale: [0.01, 0.01, 0.01],
      material: stripeMat,
      castShadows: false,
      receiveShadows: false,
    })
    const goreB = createPrimitive(pc, {
      name: `${name}-gore-b`,
      type: 'sphere',
      position: [0, -30, 0],
      scale: [0.01, 0.01, 0.01],
      material: stripeMat,
      castShadows: false,
      receiveShadows: false,
    })
    const line = createPrimitive(pc, {
      name: `${name}-line`,
      type: 'cylinder',
      position: [0, -30, 0],
      scale: [CHUTE_LINE_THICKNESS, 0.01, CHUTE_LINE_THICKNESS],
      material: lineMat,
      castShadows: false,
      receiveShadows: false,
    })
    line.setLocalEulerAngles(0, 0, 90)
    parent.addChild(disc)
    parent.addChild(stripe)
    parent.addChild(goreA)
    parent.addChild(goreB)
    parent.addChild(line)
    return { disc, stripe, goreA, goreB, line }
  }

  const left = makeCanopy('chute-l')
  const right = makeCanopy('chute-r')

  const clamp01 = (v: number): number => Math.min(1, Math.max(0, v))

  const hide = () => {
    ;[left, right].forEach((canopy) => {
      canopy.disc.setLocalPosition(0, -30, 0)
      canopy.stripe.setLocalPosition(0, -30, 0)
      canopy.goreA.setLocalPosition(0, -30, 0)
      canopy.goreB.setLocalPosition(0, -30, 0)
      canopy.line.setLocalPosition(0, -30, 0)
    })
    canopyMat.opacity = 0
    stripeMat.opacity = 0
    canopyMat.update()
    stripeMat.update()
  }

  const placeCanopy = (
    canopy: Canopy,
    rearX: number,
    rearY: number,
    rearZ: number,
    offsetZ: number,
    value: number,
    time: number,
  ) => {
    const trail = CHUTE_TRAIL_LENGTH * value
    const sag = value * value * 0.38
    const billowY = Math.sin(time * 3.1 + offsetZ * 4) * 0.045 * value
    const billowZ = Math.cos(time * 2.4 + offsetZ * 3) * 0.03 * value
    const canopyX = rearX - trail
    const canopyY = rearY + 0.68 + value * 0.2 - sag + billowY
    const canopyZ = rearZ + offsetZ + billowZ
    const grow = 0.12 + value * (CHUTE_CANOPY_DIAMETER - 0.12)

    canopy.disc.setLocalPosition(canopyX, canopyY, canopyZ)
    canopy.disc.setLocalScale(grow, grow * 0.14, grow)
    canopy.stripe.setLocalPosition(canopyX + 0.012, canopyY + 0.018, canopyZ)
    canopy.stripe.setLocalScale(grow * 1.02, grow * 0.055, grow * 0.18)
    canopy.goreA.setLocalPosition(canopyX, canopyY + 0.01, canopyZ)
    canopy.goreA.setLocalScale(grow * 0.22, grow * 0.05, grow * 1.02)
    canopy.goreA.setLocalEulerAngles(0, 28, 0)
    canopy.goreB.setLocalPosition(canopyX, canopyY + 0.01, canopyZ)
    canopy.goreB.setLocalScale(grow * 0.22, grow * 0.05, grow * 1.02)
    canopy.goreB.setLocalEulerAngles(0, -28, 0)

    const dx = canopyX - rearX
    const dy = canopyY - rearY
    const dz = canopyZ - rearZ
    const lineLength = Math.max(0.12, Math.hypot(dx, dy, dz))
    canopy.line.setLocalPosition(rearX + dx * 0.5, rearY + dy * 0.5, rearZ + dz * 0.5)
    canopy.line.setLocalScale(CHUTE_LINE_THICKNESS, lineLength, CHUTE_LINE_THICKNESS)
    const yaw = (Math.atan2(dz, dx) * 180) / Math.PI
    const tilt = (Math.atan2(dy, Math.hypot(dx, dz)) * 180) / Math.PI
    canopy.line.setLocalEulerAngles(0, yaw, 90 - tilt)
  }

  const update = (deploy01: number) => {
    const value = clamp01(deploy01)
    if (value <= 0) {
      hide()
      return
    }

    const camPos = camaro.getWorldTransform().getTranslation()
    const rearX = camPos.x + REAR_ANCHOR[0]
    const rearY = camPos.y + REAR_ANCHOR[1]
    const rearZ = camPos.z + REAR_ANCHOR[2]
    const time = performance.now() * 0.001

    placeCanopy(left, rearX, rearY, rearZ, CHUTE_PAIR_Z, value, time)
    placeCanopy(right, rearX, rearY, rearZ, -CHUTE_PAIR_Z, value, time)

    canopyMat.opacity = 0.88 * value
    stripeMat.opacity = 0.78 * value
    canopyMat.update()
    stripeMat.update()
  }

  const reset = () => {
    hide()
  }

  const destroy = () => {
    ;[left, right].forEach((canopy) => {
      canopy.disc.destroy()
      canopy.stripe.destroy()
      canopy.goreA.destroy()
      canopy.goreB.destroy()
      canopy.line.destroy()
    })
  }

  return { update, reset, destroy }
}
