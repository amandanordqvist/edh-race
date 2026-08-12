import type { Entity, StandardMaterial } from 'playcanvas'

import type { PassQuality } from './types'
import { createMaterial, createPrimitive, type PlayCanvasNamespace } from './scenePrimitives'

export type CrowdPalette = {
  bodies: StandardMaterial[]
  heads: StandardMaterial[]
}

/**
 * Shared palette so 300+ spectator primitives cost just a handful of materials.
 * Muted, Scandinavian jacket colours + a couple of highlights for life.
 */
export function createCrowdPalette(pc: PlayCanvasNamespace): CrowdPalette {
  const body = (rgb: [number, number, number]): StandardMaterial =>
    createMaterial(pc, { diffuse: rgb, metalness: 0.02, gloss: 0.08 })

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
 * Populate a single grandstand bay with spectators arranged on 3 rows,
 * matching the stepped seating height.
 */
export function spawnCrowdOnBay(opts: SpawnCrowdOptions): void {
  const { pc, parent, palette, bayLength, facing, quality, seedOffset } = opts
  const high = quality === 'high'
  const perRow = high ? 18 : 12
  const rows = [
    { step: 0, y: 1.95, headY: 2.28 },
    { step: 1, y: 2.8, headY: 3.13 },
    { step: 2, y: 3.65, headY: 3.98 },
  ]

  const useableLength = bayLength * 0.86
  const spacing = useableLength / (perRow - 1)
  const startX = -useableLength / 2

  const rand = (n: number): number => {
    const x = Math.sin(n * 12.9898 + seedOffset * 78.233) * 43758.5453
    return x - Math.floor(x)
  }

  let idx = 0
  rows.forEach((row) => {
    const zBase = facing * (-0.42 - row.step * 1.05)
    for (let i = 0; i < perRow; i += 1) {
      idx += 1
      const bodyMat = palette.bodies[Math.floor(rand(idx) * palette.bodies.length)]!
      const headMat = palette.heads[Math.floor(rand(idx + 101) * palette.heads.length)]!
      const jitterX = (rand(idx + 7) - 0.5) * spacing * 0.4
      const jitterZ = (rand(idx + 13) - 0.5) * 0.18
      const heightWiggle = (rand(idx + 19) - 0.5) * 0.08

      const x = startX + i * spacing + jitterX
      const z = zBase + jitterZ

      parent.addChild(
        createPrimitive(pc, {
          name: `crowd-body-${row.step}-${i}`,
          type: 'box',
          position: [x, row.y + heightWiggle, z],
          scale: [0.32, 0.62, 0.28],
          material: bodyMat,
          castShadows: false,
        }),
      )

      if (high || i % 2 === 0) {
        parent.addChild(
          createPrimitive(pc, {
            name: `crowd-head-${row.step}-${i}`,
            type: 'box',
            position: [x, row.headY + heightWiggle, z],
            scale: [0.19, 0.19, 0.19],
            material: headMat,
            castShadows: false,
          }),
        )
      }
    }
  })
}
