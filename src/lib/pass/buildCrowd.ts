import type { Application, Entity, StandardMaterial, Texture } from 'playcanvas'

import type { PassQuality } from './types'
import { createMaterial, createPrimitive, type PlayCanvasNamespace } from './scenePrimitives'

export type CrowdPalette = {
  bodies: StandardMaterial[]
  heads: StandardMaterial[]
  card: StandardMaterial
}

function paintCrowdCard(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#16181e'
  ctx.fillRect(0, 0, w, h)

  const jackets = ['#1c212c', '#2a2e36', '#243044', '#3a342c', '#4a2a2c', '#5a5e64', '#22302a', '#2c3a58']
  const skins = ['#c49a80', '#9a7a60', '#805c48', '#524028', '#d0c8b4']

  for (let row = 0; row < 6; row += 1) {
    const count = 28 + (row % 3)
    const y = 18 + row * 24
    for (let i = 0; i < count; i += 1) {
      const seed = Math.sin(row * 19.1 + i * 7.3) * 43758.5
      const t = seed - Math.floor(seed)
      const x = (i + 0.15 + t * 0.5) * (w / count)
      ctx.fillStyle = jackets[Math.floor(t * jackets.length)] ?? '#222'
      ctx.fillRect(x, y, 9, 16)
      ctx.fillStyle = skins[Math.floor((1 - t) * skins.length)] ?? '#c49a80'
      ctx.beginPath()
      ctx.arc(x + 4.5, y - 2, 3.1, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function createCrowdCardTexture(app: Application, pc: PlayCanvasNamespace): Texture {
  const w = 512
  const h = 160
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (ctx) paintCrowdCard(ctx, w, h)

  const texture = new pc.Texture(app.graphicsDevice, {
    name: 'pass-crowd-card',
    width: w,
    height: h,
    format: pc.PIXELFORMAT_RGBA8,
    mipmaps: true,
    minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
    magFilter: pc.FILTER_LINEAR,
  })
  texture.setSource(canvas)
  texture.upload()
  texture.addressU = pc.ADDRESS_REPEAT
  texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE
  return texture
}

/**
 * Shared palette so spectator primitives cost just a handful of materials.
 * Card texture reads as a packed crowd from strip distance.
 */
export function createCrowdPalette(pc: PlayCanvasNamespace, app?: Application): CrowdPalette {
  const body = (rgb: [number, number, number]): StandardMaterial =>
    createMaterial(pc, { diffuse: rgb, metalness: 0.02, gloss: 0.08 })

  const card = createMaterial(pc, {
    diffuse: [0.7, 0.72, 0.74],
    emissive: [0.12, 0.13, 0.15],
    emissiveIntensity: 0.18,
    metalness: 0.02,
    gloss: 0.08,
  })
  if (app) {
    card.diffuseMap = createCrowdCardTexture(app, pc)
    card.diffuseMapTiling.set(1.8, 1)
    card.update()
  }

  return {
    bodies: [
      body([0.11, 0.13, 0.18]),
      body([0.18, 0.2, 0.24]),
      body([0.24, 0.22, 0.19]),
      body([0.09, 0.16, 0.24]),
      body([0.32, 0.28, 0.22]),
      body([0.28, 0.15, 0.16]),
      body([0.4, 0.42, 0.44]),
      body([0.13, 0.18, 0.14]),
    ],
    heads: [
      body([0.72, 0.6, 0.5]),
      body([0.6, 0.48, 0.38]),
      body([0.5, 0.36, 0.28]),
      body([0.32, 0.22, 0.16]),
      body([0.82, 0.78, 0.7]),
    ],
    card,
  }
}

type SpawnCrowdOptions = {
  pc: PlayCanvasNamespace
  parent: Entity
  palette: CrowdPalette
  bayLength: number
  facing: 1 | -1
  quality: PassQuality
  seedOffset: number
}

/**
 * Crowd cards on the three risers, plus a sparse front row of 3D figures
 * so the nearest bay has a little depth without Lego-filling the stands.
 */
export function spawnCrowdOnBay(opts: SpawnCrowdOptions): void {
  const { pc, parent, palette, bayLength, facing, quality, seedOffset } = opts
  const high = quality === 'high'
  const rows = [
    { step: 0, y: 1.95, headY: 2.28 },
    { step: 1, y: 2.8, headY: 3.13 },
    { step: 2, y: 3.65, headY: 3.98 },
  ]

  rows.forEach((row) => {
    const z = facing * (-0.42 - row.step * 1.05)
    parent.addChild(
      createPrimitive(pc, {
        name: `crowd-card-${row.step}`,
        type: 'box',
        position: [0, row.y + 0.18, z],
        scale: [bayLength * 0.9, 0.72, 0.08],
        material: palette.card,
        castShadows: false,
      }),
    )
  })

  const frontCount = high ? 10 : 6
  const useableLength = bayLength * 0.78
  const spacing = useableLength / (frontCount - 1)
  const startX = -useableLength / 2
  const rand = (n: number): number => {
    const x = Math.sin(n * 12.9898 + seedOffset * 78.233) * 43758.5453
    return x - Math.floor(x)
  }

  for (let i = 0; i < frontCount; i += 1) {
    const bodyMat = palette.bodies[Math.floor(rand(i + 1) * palette.bodies.length)]!
    const headMat = palette.heads[Math.floor(rand(i + 101) * palette.heads.length)]!
    const x = startX + i * spacing + (rand(i + 7) - 0.5) * spacing * 0.25
    const z = facing * (-0.42 + (rand(i + 13) - 0.5) * 0.12)
    parent.addChild(
      createPrimitive(pc, {
        name: `crowd-body-0-${i}`,
        type: 'box',
        position: [x, 1.95, z],
        scale: [0.3, 0.58, 0.26],
        material: bodyMat,
        castShadows: false,
      }),
    )
    parent.addChild(
      createPrimitive(pc, {
        name: `crowd-head-0-${i}`,
        type: 'box',
        position: [x, 2.26, z],
        scale: [0.17, 0.17, 0.17],
        material: headMat,
        castShadows: false,
      }),
    )
  }
}
