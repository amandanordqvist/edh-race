import type { Entity } from 'playcanvas'

import { createMaterial, createPrimitive, type PlayCanvasNamespace } from './scenePrimitives'

const TRAIL_LENGTH = 3.4
const CANOPY_LENGTH = 1.55
const CANOPY_WIDTH = 1.15
const LINE_THICKNESS = 0.014
const PAIR_Z = 0.48
/** World offset from Camaro origin: behind the bumper, above the packs. */
const HITCH_OFFSET: [number, number, number] = [-1.85, 0.98, 0]

const RIM_RAYS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0.82, 0.45],
  [0.82, -0.35],
  [0, -0.55],
  [-0.82, -0.35],
  [-0.82, 0.45],
]

type ChuteVfxOptions = {
  pc: PlayCanvasNamespace
  parent: Entity
  camaro: Entity
}

type Canopy = {
  root: Entity
  bag: Entity
  fold: Entity
  lip: Entity
  pack: Entity
  lines: Entity[]
}

function isFiniteVec(x: number, y: number, z: number): boolean {
  return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)
}

function orientLine(
  entity: Entity,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
): void {
  const dx = bx - ax
  const dy = by - ay
  const dz = bz - az
  const length = Math.max(0.1, Math.hypot(dx, dy, dz))
  entity.setLocalPosition((ax + bx) * 0.5, (ay + by) * 0.5, (az + bz) * 0.5)
  entity.setLocalScale(LINE_THICKNESS, length, LINE_THICKNESS)
  const yaw = (Math.atan2(dz, dx) * 180) / Math.PI
  const tilt = (Math.atan2(dy, Math.hypot(dx, dz)) * 180) / Math.PI
  entity.setLocalEulerAngles(0, yaw, 90 - tilt)
}

/**
 * Twin doorslammer chutes as elongated nylon bags — not perfect spheres —
 * so the finish camera can keep the car readable.
 */
export function createChuteVfx(opts: ChuteVfxOptions) {
  const { pc, parent, camaro } = opts

  const nylon = createMaterial(pc, {
    diffuse: [0.62, 0.12, 0.1],
    metalness: 0.02,
    gloss: 0.16,
  })
  const nylonFold = createMaterial(pc, {
    diffuse: [0.48, 0.08, 0.08],
    metalness: 0.02,
    gloss: 0.12,
  })
  const skirt = createMaterial(pc, {
    diffuse: [0.88, 0.88, 0.9],
    metalness: 0.03,
    gloss: 0.2,
  })
  const cord = createMaterial(pc, {
    diffuse: [0.68, 0.68, 0.7],
    metalness: 0.08,
    gloss: 0.14,
  })
  const packMat = createMaterial(pc, {
    diffuse: [0.14, 0.14, 0.15],
    metalness: 0.2,
    gloss: 0.28,
  })

  const makeCanopy = (name: string): Canopy => {
    const root = new pc.Entity(name)
    root.enabled = false
    parent.addChild(root)

    const bag = createPrimitive(pc, {
      name: `${name}-bag`,
      type: 'sphere',
      position: [0, 0, 0],
      scale: [0.01, 0.01, 0.01],
      material: nylon,
      castShadows: false,
      receiveShadows: true,
    })
    const fold = createPrimitive(pc, {
      name: `${name}-fold`,
      type: 'sphere',
      position: [0, 0, 0],
      scale: [0.01, 0.01, 0.01],
      material: nylonFold,
      castShadows: false,
      receiveShadows: true,
    })
    const lip = createPrimitive(pc, {
      name: `${name}-lip`,
      type: 'cylinder',
      position: [0, 0, 0],
      scale: [0.01, 0.01, 0.01],
      material: skirt,
      castShadows: false,
      receiveShadows: true,
    })
    lip.setLocalEulerAngles(0, 0, 90)
    const pack = createPrimitive(pc, {
      name: `${name}-pack`,
      type: 'box',
      position: [0, 0, 0],
      scale: [0.01, 0.01, 0.01],
      material: packMat,
      castShadows: false,
    })
    root.addChild(bag)
    root.addChild(fold)
    root.addChild(lip)
    root.addChild(pack)

    const lines = RIM_RAYS.map((_, i) => {
      const line = createPrimitive(pc, {
        name: `${name}-line-${i}`,
        type: 'cylinder',
        position: [0, 0, 0],
        scale: [LINE_THICKNESS, 0.01, LINE_THICKNESS],
        material: cord,
        castShadows: false,
        receiveShadows: false,
      })
      root.addChild(line)
      return line
    })

    return { root, bag, fold, lip, pack, lines }
  }

  const left = makeCanopy('chute-l')
  const right = makeCanopy('chute-r')

  const placeCanopy = (
    canopy: Canopy,
    rearX: number,
    rearY: number,
    rearZ: number,
    offsetZ: number,
    value: number,
    time: number,
  ) => {
    const trail = TRAIL_LENGTH * (0.28 + value * 0.72)
    const sag = value * value * 0.45
    const billowY = Math.sin(time * 2.2 + offsetZ * 5) * 0.05 * value
    const billowZ = Math.cos(time * 1.8 + offsetZ * 4) * 0.03 * value
    const canopyX = rearX - trail
    const canopyY = rearY + 0.28 + value * 0.16 - sag + billowY
    const canopyZ = rearZ + offsetZ + billowZ
    if (!isFiniteVec(canopyX, canopyY, canopyZ)) {
      canopy.root.enabled = false
      return
    }

    canopy.root.enabled = true
    canopy.root.setPosition(canopyX, canopyY, canopyZ)
    canopy.root.setLocalEulerAngles(0, 0, -8 - value * 6)

    const length = 0.55 + value * (CANOPY_LENGTH - 0.55)
    const width = 0.48 + value * (CANOPY_WIDTH - 0.48)
    const height = width * 0.72
    canopy.bag.setLocalPosition(-length * 0.05, 0, 0)
    canopy.bag.setLocalScale(length, height, width)

    canopy.fold.setLocalPosition(-length * 0.18, height * 0.12, width * 0.08)
    canopy.fold.setLocalScale(length * 0.55, height * 0.55, width * 0.42)

    const mouthX = length * 0.32
    const rimR = width * 0.32
    canopy.lip.setLocalPosition(mouthX, 0, 0)
    canopy.lip.setLocalScale(rimR * 2, 0.04, rimR * 2)

    const packX = rearX - canopyX
    const packY = rearY - canopyY
    const packZ = rearZ - canopyZ
    canopy.pack.setLocalPosition(packX * 0.15, packY * 0.1, packZ * 0.1)
    canopy.pack.setLocalScale(0.22 + value * 0.08, 0.16, 0.28)

    canopy.lines.forEach((line, i) => {
      const ray = RIM_RAYS[i]
      if (!ray) return
      orientLine(line, packX, packY, packZ, mouthX, ray[0] * rimR, ray[1] * rimR)
    })
  }

  const hitch = (): [number, number, number] | null => {
    const pos = camaro.getPosition()
    if (!isFiniteVec(pos.x, pos.y, pos.z)) return null
    return [pos.x + HITCH_OFFSET[0], pos.y + HITCH_OFFSET[1], pos.z + HITCH_OFFSET[2]]
  }

  const update = (deploy01: number) => {
    const value = Math.min(1, Math.max(0, deploy01))
    if (value <= 0.02) {
      left.root.enabled = false
      right.root.enabled = false
      return
    }

    const rear = hitch()
    if (!rear) {
      left.root.enabled = false
      right.root.enabled = false
      return
    }

    const time = performance.now() * 0.001
    placeCanopy(left, rear[0], rear[1], rear[2], PAIR_Z, value, time)
    placeCanopy(right, rear[0], rear[1], rear[2], -PAIR_Z, value, time)
  }

  const reset = () => {
    left.root.enabled = false
    right.root.enabled = false
  }

  const destroy = () => {
    left.root.destroy()
    right.root.destroy()
  }

  return { update, reset, destroy }
}
