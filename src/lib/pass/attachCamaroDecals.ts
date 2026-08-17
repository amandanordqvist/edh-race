import type { Entity } from 'playcanvas'

import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'
import type { PassQuality } from './types'

type AttachDecalsOptions = {
  app: import('playcanvas').Application
  pc: PlayCanvasNamespace
  camaro: Entity
  quality: PassQuality
}

/**
 * No logo textures in the 3D scene until they can target explicitly named
 * body panels. Only adds a quiet rear-wing silhouette when missing.
 */
export async function attachCamaroDecals(opts: AttachDecalsOptions): Promise<void> {
  const { pc, camaro } = opts
  void opts.app
  void opts.quality

  if (camaro.findByName('camaro-wing')) return

  const wingMat = createMaterial(pc, {
    diffuse: [0.08, 0.09, 0.11],
    metalness: 0.35,
    gloss: 0.42,
  })
  const uprightMat = createMaterial(pc, {
    diffuse: [0.12, 0.13, 0.15],
    metalness: 0.4,
    gloss: 0.38,
  })
  const wing = new pc.Entity('camaro-wing')
  wing.setLocalPosition(-1.55, 1.05, 0)
  wing.addChild(
    createPrimitive(pc, {
      name: 'wing-blade',
      type: 'box',
      position: [0, 0.28, 0],
      scale: [0.32, 0.04, 1.85],
      material: wingMat,
      castShadows: true,
    }),
  )
  ;([-0.72, 0.72] as number[]).forEach((z, i) => {
    wing.addChild(
      createPrimitive(pc, {
        name: `wing-upright-${i}`,
        type: 'box',
        position: [0.05, 0.12, z],
        scale: [0.12, 0.28, 0.06],
        material: uprightMat,
        castShadows: true,
      }),
    )
  })
  camaro.addChild(wing)
}
