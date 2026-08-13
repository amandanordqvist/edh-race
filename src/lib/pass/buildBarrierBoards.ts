import type { Asset, Entity, Texture } from 'playcanvas'

import { sponsors } from '../../data/sponsors'
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
  sponsorTextures: SponsorTextureEntry[]
}

export type SponsorTextureEntry = {
  sponsorId: string
  asset: Asset | null
}

type BoardTone = {
  id: string
  panel: [number, number, number]
  texture: Texture | null
}

function textureFor(
  sponsorId: string,
  entries: SponsorTextureEntry[],
): Texture | null {
  const match = entries.find((entry) => entry.sponsorId === sponsorId)
  const resource = match?.asset?.resource
  return resource ? (resource as Texture) : null
}

function buildBoardPalette(entries: SponsorTextureEntry[]): BoardTone[] {
  const partnerTones: BoardTone[] = sponsors.map((sponsor) => ({
    id: sponsor.id,
    panel: [0.92, 0.93, 0.94],
    texture: textureFor(sponsor.id, entries),
  }))
  const edhBlue: BoardTone = {
    id: 'edh',
    panel: [0.14, 0.32, 0.62],
    texture: null,
  }
  return [edhBlue, ...partnerTones]
}

/**
 * Sponsor boards mounted on the strip-facing wall — the NHRA "wall of logos"
 * look. Uses real AINE / Olle / SITECH textures when they loaded.
 */
export function buildBarrierBoards(opts: BarrierBoardsOptions): void {
  const { pc, sceneRoot, trackLength, quality, sponsorTextures } = opts
  const high = quality === 'high'
  const palette = buildBoardPalette(sponsorTextures)
  if (palette.length === 0) return

  const frameMat = createMaterial(pc, {
    diffuse: [0.88, 0.88, 0.86],
    metalness: 0.12,
    gloss: 0.28,
  })

  const boardsPerSide = high ? 12 : 7
  const spacing = (trackLength - 10) / boardsPerSide

  ;([-BARRIER_Z, BARRIER_Z] as number[]).forEach((z, side) => {
    const facing = z < 0 ? 1 : -1
    for (let i = 0; i < boardsPerSide; i += 1) {
      const x = 6 + i * spacing
      const tone = palette[(i + side) % palette.length]
      const panelMat = createMaterial(pc, {
        diffuse: tone.texture ? [1, 1, 1] : tone.panel,
        metalness: 0.04,
        gloss: 0.3,
      })
      if (tone.texture) {
        panelMat.diffuseMap = tone.texture
        panelMat.update()
      }

      const board = new pc.Entity(`sponsor-board-${side}-${i}`)
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
