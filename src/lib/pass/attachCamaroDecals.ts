import type { Application, Entity, Texture } from 'playcanvas'

import { loadTextureAsset } from './loadTextureAsset'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'
import type { PassQuality } from './types'

const LOGO_URL = '/logo/logo-hero.webp'

type AttachDecalsOptions = {
  app: Application
  pc: PlayCanvasNamespace
  camaro: Entity
  quality: PassQuality
}

function addLogoDecal(
  pc: PlayCanvasNamespace,
  parent: Entity,
  name: string,
  position: [number, number, number],
  euler: [number, number, number],
  texture: Texture,
  quality: PassQuality,
): void {
  const material = createMaterial(pc, {
    diffuse: [1, 1, 1],
    emissive: [0.85, 0.88, 0.95],
    emissiveIntensity: quality === 'high' ? 0.22 : 0.12,
    metalness: 0.05,
    gloss: 0.35,
  })
  material.diffuseMap = texture
  material.emissiveMap = texture
  material.opacity = 0.92
  material.blendType = pc.BLEND_NORMAL
  material.depthWrite = false
  material.update()

  const decal = createPrimitive(pc, {
    name,
    type: 'plane',
    position,
    scale: [0.72, 0.72, 1],
    material,
    castShadows: false,
    receiveShadows: false,
  })
  decal.setLocalEulerAngles(...euler)
  parent.addChild(decal)
}

export async function attachCamaroDecals(opts: AttachDecalsOptions): Promise<void> {
  const { app, pc, camaro, quality } = opts

  try {
    const asset = await loadTextureAsset(app, pc, LOGO_URL, 'edh-pass-logo')
    const texture = asset.resource as Texture

    // Parent camaro yaw is +90° (model +Z → world +X). Local ±Z is left/right of the car.
    addLogoDecal(pc, camaro, 'camaro-decal-l', [-0.15, 0.72, 0.86], [90, 0, 0], texture, quality)
    addLogoDecal(pc, camaro, 'camaro-decal-r', [-0.15, 0.72, -0.86], [90, 180, 0], texture, quality)
  } catch (error) {
    console.warn('[pass] Could not attach Camaro decals', error)
  }
}
