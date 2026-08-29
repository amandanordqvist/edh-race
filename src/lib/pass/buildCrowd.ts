import type { Application, Entity, StandardMaterial } from 'playcanvas'

import { createCanvasTexture } from './canvasTexture'
import type { PassQuality } from './types'
import { createMaterial, createPrimitive, type PlayCanvasNamespace } from './scenePrimitives'

export type CrowdPalette = {
  card: StandardMaterial
  spectators: StandardMaterial[]
}

function paintCrowdCard(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#1a1e26'
  ctx.fillRect(0, 0, w, h)

  const jackets = [
    '#1c212c',
    '#2a2e36',
    '#243044',
    '#3a342c',
    '#4a2a2c',
    '#5a5e64',
    '#22302a',
    '#2c3a58',
    '#4a4034',
    '#6a5a48',
    '#8a8e94',
    '#3a4a38',
  ]
  const skins = ['#c49a80', '#9a7a60', '#805c48', '#524028', '#d0c8b4', '#b08870', '#e0c8b0']

  for (let row = 0; row < 16; row += 1) {
    const count = 72 + (row % 8)
    const y = 6 + row * (h / 17)
    for (let i = 0; i < count; i += 1) {
      const seed = Math.sin(row * 19.1 + i * 7.3) * 43758.5
      const t = seed - Math.floor(seed)
      const x = (i + 0.04 + t * 0.35) * (w / count)
      const bodyW = 3 + t * 2.4
      const bodyH = 7 + (1 - t) * 5
      ctx.fillStyle = jackets[Math.floor(t * jackets.length)] ?? '#222'
      ctx.fillRect(x, y, bodyW, bodyH)
      ctx.fillStyle = skins[Math.floor((1 - t) * skins.length)] ?? '#c49a80'
      ctx.beginPath()
      ctx.arc(x + bodyW * 0.5, y - 1.1, 1.4 + t * 0.6, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function paintSpectator(
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

  const jackets = ['#1a2230', '#2c3038', '#3a342c', '#243044', '#4a2c30', '#5a5e64']
  const skins = ['#c49a80', '#9a7a60', '#805c48', '#d0c8b4']
  const jacket = jackets[Math.floor(rand(1) * jackets.length)] ?? '#1a2230'
  const skin = skins[Math.floor(rand(2) * skins.length)] ?? '#c49a80'

  const cx = w / 2
  ctx.fillStyle = '#1c1e24'
  ctx.fillRect(cx - 9, h * 0.62, 7, h * 0.38)
  ctx.fillRect(cx + 2, h * 0.62, 7, h * 0.38)

  ctx.fillStyle = jacket
  ctx.fillRect(cx - 16, h * 0.32, 32, h * 0.34)
  ctx.fillRect(cx - 22, h * 0.34, 8, h * 0.28)
  ctx.fillRect(cx + 14, h * 0.34, 8, h * 0.28)

  ctx.fillStyle = skin
  ctx.beginPath()
  ctx.arc(cx, h * 0.24, 11, 0, Math.PI * 2)
  ctx.fill()

  if (rand(5) > 0.45) {
    ctx.fillStyle = rand(6) > 0.5 ? '#1a1c20' : '#3a342c'
    ctx.beginPath()
    ctx.ellipse(cx, h * 0.2, 12, 7, 0, Math.PI, Math.PI * 2)
    ctx.fill()
  }
}

/**
 * Shared materials so packed stands cost a handful of draw-state changes.
 */
export function createCrowdPalette(pc: PlayCanvasNamespace, app?: Application): CrowdPalette {
  const card = createMaterial(pc, {
    diffuse: [1, 1, 1],
    emissive: [0.04, 0.045, 0.05],
    emissiveIntensity: 0.05,
    metalness: 0.02,
    gloss: 0.08,
  })
  const spectators: StandardMaterial[] = []

  if (app) {
    card.diffuseMap = createCanvasTexture(app, pc, 'pass-crowd-card', 1536, 448, paintCrowdCard, {
      repeatU: true,
    })
    card.diffuseMapTiling.set(4.2, 1.35)
    card.update()

    for (let i = 0; i < 6; i += 1) {
      const texture = createCanvasTexture(
        app,
        pc,
        `pass-spectator-${i}`,
        96,
        192,
        (ctx, w, h) => paintSpectator(ctx, w, h, i + 2.1),
      )
      const material = createMaterial(pc, {
        diffuse: [1, 1, 1],
        metalness: 0.02,
        gloss: 0.1,
      })
      material.diffuseMap = texture
      material.alphaTest = 0.4
      material.cull = pc.CULLFACE_NONE
      material.update()
      spectators.push(material)
    }
  }

  return { card, spectators }
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
 * Crowd cards on the risers. On high, a front row of silhouette billboards
 * facing the strip — no Lego box people.
 */
export function spawnCrowdOnBay(opts: SpawnCrowdOptions): void {
  const { pc, parent, palette, bayLength, facing, quality, seedOffset } = opts
  const high = quality === 'high'
  const rows = [
    { step: 0, y: 1.95 },
    { step: 1, y: 2.8 },
    { step: 2, y: 3.65 },
  ]

  rows.forEach((row) => {
    const z = facing * (-0.42 - row.step * 1.05)
    parent.addChild(
      createPrimitive(pc, {
        name: `crowd-card-${row.step}`,
        type: 'box',
        position: [0, row.y + 0.22, z],
        scale: [bayLength * 0.94, 0.82, 0.08],
        material: palette.card,
        castShadows: false,
      }),
    )
  })

  if (!high || palette.spectators.length === 0) return

  const rand = (n: number): number => {
    const x = Math.sin(n * 12.9898 + seedOffset * 78.233) * 43758.5453
    return x - Math.floor(x)
  }

  const yaw = facing < 0 ? 180 : 0
  const rowsOfPeople = [
    { count: 18, step: 0, y: 1.72 },
    { count: 16, step: 1, y: 2.55 },
    { count: 14, step: 2, y: 3.38 },
  ]

  rowsOfPeople.forEach((row) => {
    const useableLength = bayLength * 0.88
    const spacing = useableLength / (row.count - 1)
    const startX = -useableLength / 2
    const zBase = facing * (-0.28 - row.step * 1.05)

    for (let i = 0; i < row.count; i += 1) {
      const material = palette.spectators[Math.floor(rand(row.step * 50 + i + 1) * palette.spectators.length)]!
      const x = startX + i * spacing + (rand(row.step * 17 + i + 7) - 0.5) * spacing * 0.3
      const z = zBase + (rand(row.step * 11 + i + 13) - 0.5) * 0.12
      const height = 0.82 + rand(row.step * 9 + i + 19) * 0.18
      const person = createPrimitive(pc, {
        name: `crowd-person-${row.step}-${i}`,
        type: 'plane',
        position: [x, row.y + height * 0.22, z],
        scale: [0.28 + rand(i + 3) * 0.08, 1, height],
        material,
        castShadows: false,
        receiveShadows: false,
      })
      person.setLocalEulerAngles(90, yaw, 0)
      parent.addChild(person)
    }
  })
}
