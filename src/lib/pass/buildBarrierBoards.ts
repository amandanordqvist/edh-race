import type { Asset, Entity } from 'playcanvas'

import { BARRIER_Z } from './passLayout'
import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'

type BarrierBoardsOptions = {
  pc: PlayCanvasNamespace
  sceneRoot: Entity
  trackLength: number
  quality: PassQuality
  /** Kept for API compatibility — logos are not applied on the strip. */
  sponsorTextures: SponsorTextureEntry[]
}

export type SponsorTextureEntry = {
  sponsorId: string
  asset: Asset | null
}

const PANEL_TONES: [number, number, number][] = [
  [0.14, 0.18, 0.24],
  [0.78, 0.79, 0.8],
  [0.18, 0.2, 0.24],
  [0.55, 0.56, 0.58],
]

/**
 * Wall boards as solid panels only. No sponsor/logo textures until they can
 * be mapped onto explicitly named car body panels.
 */
export function buildBarrierBoards(opts: BarrierBoardsOptions): void {
  const { pc, sceneRoot, trackLength, quality, sponsorTextures } = opts
  void sponsorTextures
  const high = quality === 'high'

  const frameMat = createMaterial(pc, {
    diffuse: [0.55, 0.55, 0.52],
    metalness: 0.12,
    gloss: 0.22,
  })

  const boardsPerSide = high ? 12 : 7
  const spacing = (trackLength - 10) / boardsPerSide

  ;([-BARRIER_Z, BARRIER_Z] as number[]).forEach((z, side) => {
    const facing = z < 0 ? 1 : -1
    for (let i = 0; i < boardsPerSide; i += 1) {
      const x = 6 + i * spacing
      const tone = PANEL_TONES[(i + side) % PANEL_TONES.length] ?? PANEL_TONES[0]
      const panelMat = createMaterial(pc, {
        diffuse: tone,
        metalness: 0.04,
        gloss: 0.22,
      })

      const board = new pc.Entity(`barrier-board-${side}-${i}`)
      board.setLocalPosition(x, 0, z + facing * -0.28)

      board.addChild(
        createPrimitive(pc, {
          name: 'frame',
          type: 'box',
          position: [0, 1.05, 0],
          scale: [3.55, 0.95, 0.08],
          material: frameMat,
          castShadows: high,
        }),
      )
      board.addChild(
        createPrimitive(pc, {
          name: 'panel',
          type: 'box',
          position: [0, 1.05, facing * -0.05],
          scale: [3.35, 0.78, 0.04],
          material: panelMat,
          castShadows: false,
        }),
      )

      sceneRoot.addChild(board)
    }
  })
}
