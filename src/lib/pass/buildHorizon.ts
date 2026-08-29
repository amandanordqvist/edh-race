import type { Application, Entity, StandardMaterial } from 'playcanvas'

import { TRACK_LENGTH, TRACK_WIDTH } from './passLayout'
import { createCanvasTexture } from './canvasTexture'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'
import type { PassQuality } from './types'

type HorizonOptions = {
  pc: PlayCanvasNamespace
  app?: Application
  sceneRoot: Entity
  quality: PassQuality
}

function paintTree(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
): void {
  ctx.clearRect(0, 0, w, h)
  const rand = (n: number): number => {
    const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }

  const trunkW = 10 + rand(1) * 8
  ctx.fillStyle = '#3a3228'
  ctx.fillRect(w / 2 - trunkW / 2, h * 0.58, trunkW, h * 0.42)

  const foliage = ['#2a3a24', '#334828', '#243420', '#3c5030']
  for (let i = 0; i < 7; i += 1) {
    const t = rand(i + 3)
    ctx.fillStyle = foliage[Math.floor(t * foliage.length)] ?? '#2a3a24'
    ctx.beginPath()
    ctx.ellipse(
      w / 2 + (t - 0.5) * 28,
      h * (0.28 + (i % 3) * 0.1),
      38 + t * 22,
      32 + rand(i + 9) * 18,
      0,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }
}

function createTreeMaterials(
  app: Application,
  pc: PlayCanvasNamespace,
): StandardMaterial[] {
  return [0, 1, 2].map((index) => {
    const texture = createCanvasTexture(
      app,
      pc,
      `pass-tree-${index}`,
      128,
      192,
      (ctx, w, h) => paintTree(ctx, w, h, index + 1.7),
    )
    const material = createMaterial(pc, {
      diffuse: [0.55, 0.62, 0.48],
      metalness: 0.02,
      gloss: 0.08,
    })
    material.diffuseMap = texture
    material.alphaTest = 0.35
    material.cull = pc.CULLFACE_NONE
    material.update()
    return material
  })
}

/**
 * Distant hills + tree billboards behind the stands so the skybox
 * meets ground instead of an empty blue floor.
 */
export function buildHorizon(opts: HorizonOptions): void {
  const { pc, app, sceneRoot, quality } = opts
  const high = quality === 'high'
  const halfTrack = TRACK_LENGTH / 2
  const hillZ = TRACK_WIDTH / 2 + 48

  const hillDark = createMaterial(pc, {
    diffuse: [0.18, 0.28, 0.14],
    metalness: 0.02,
    gloss: 0.05,
  })
  const hillMid = createMaterial(pc, {
    diffuse: [0.22, 0.34, 0.16],
    metalness: 0.02,
    gloss: 0.05,
  })
  const hillFar = createMaterial(pc, {
    diffuse: [0.28, 0.4, 0.22],
    metalness: 0.02,
    gloss: 0.04,
  })

  ;([-hillZ, hillZ] as number[]).forEach((z, side) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `hill-near-${side}`,
        type: 'box',
        position: [halfTrack, 1.4, z],
        scale: [TRACK_LENGTH + 80, 4.2, 18],
        material: hillDark,
        castShadows: false,
      }),
    )
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `hill-mid-${side}`,
        type: 'box',
        position: [halfTrack + 8, 3.6, z + (z < 0 ? -14 : 14)],
        scale: [TRACK_LENGTH + 40, 7.2, 16],
        material: hillMid,
        castShadows: false,
      }),
    )
  })

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'hill-finish',
      type: 'box',
      position: [TRACK_LENGTH + 48, 4.8, 0],
      scale: [22, 10, TRACK_WIDTH + 90],
      material: hillFar,
      castShadows: false,
    }),
  )

  if (!app) return

  const trees = createTreeMaterials(app, pc)
  const treeZ = TRACK_WIDTH / 2 + 24
  const spacing = high ? 6.4 : 10
  const startX = -12
  const endX = TRACK_LENGTH + 18

  ;([-treeZ, treeZ] as number[]).forEach((z, side) => {
    let i = 0
    for (let x = startX; x < endX; x += spacing) {
      const jitter = Math.sin(x * 0.37 + side * 4.1) * 1.4
      const scale = 0.85 + ((i + side) % 4) * 0.18
      const material = trees[i % trees.length]!
      const px = x + jitter
      const py = 2.6 * scale
      const pz = z + jitter * 0.4
      const width = 2.8 * scale
      const height = 5.2 * scale
      ;([0, 90] as const).forEach((yaw, cross) => {
        const entity = createPrimitive(pc, {
          name: `tree-${side}-${i}-${cross}`,
          type: 'plane',
          position: [px, py, pz],
          scale: [width, 1, height],
          material,
          castShadows: false,
          receiveShadows: false,
        })
        entity.setLocalEulerAngles(90, yaw, 0)
        sceneRoot.addChild(entity)
      })
      i += 1
    }
  })
}
