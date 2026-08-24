import type { Entity, StandardMaterial } from 'playcanvas'

import type { PassQuality } from './types'

export type PlayCanvasNamespace = typeof import('playcanvas')

export type MaterialTone = {
  diffuse: [number, number, number]
  emissive?: [number, number, number]
  emissiveIntensity?: number
  metalness?: number
  gloss?: number
  opacity?: number
  clearCoat?: number
  clearCoatGloss?: number
}

export type PrimitiveOptions = {
  name: string
  type: 'box' | 'plane' | 'sphere' | 'cylinder' | 'cone'
  position: [number, number, number]
  scale: [number, number, number]
  material: StandardMaterial
  castShadows?: boolean
  receiveShadows?: boolean
}

type ClearCoatMaterial = StandardMaterial & {
  clearCoat?: number
  clearCoatGloss?: number
}

export function createMaterial(pc: PlayCanvasNamespace, tone: MaterialTone): StandardMaterial {
  const material = new pc.StandardMaterial()

  material.diffuse.set(...tone.diffuse)
  material.emissive.set(...(tone.emissive ?? [0, 0, 0]))
  material.emissiveIntensity = tone.emissiveIntensity ?? 0
  material.useMetalness = true
  material.metalness = tone.metalness ?? 0.1
  material.gloss = tone.gloss ?? 0.25
  if (typeof tone.opacity === 'number') {
    material.opacity = tone.opacity
    material.blendType = pc.BLEND_NORMAL
    material.depthWrite = false
  }
  const coat = material as ClearCoatMaterial
  if (typeof tone.clearCoat === 'number') {
    coat.clearCoat = tone.clearCoat
    coat.clearCoatGloss = tone.clearCoatGloss ?? 0.9
  }
  material.update()

  return material
}

export function createPrimitive(pc: PlayCanvasNamespace, options: PrimitiveOptions) {
  const entity = new pc.Entity(options.name)

  entity.addComponent('render', {
    type: options.type,
    castShadows: options.castShadows ?? false,
    receiveShadows: options.receiveShadows ?? true,
  })

  entity.setLocalPosition(...options.position)
  entity.setLocalScale(...options.scale)

  if (entity.render) {
    entity.render.material = options.material
  }

  return entity
}

export function shadowsEnabled(_quality: PassQuality): boolean {
  // Always cast on hero Camaro — key light shadows are on for both quality tiers.
  return true
}

/** Cheap blob under a racer so GLBs without a shadow caster still sit on the strip. */
export function attachContactShadow(
  pc: PlayCanvasNamespace,
  parent: Entity,
  scale: [number, number, number] = [1.55, 0.012, 0.72],
): Entity {
  const material = createMaterial(pc, {
    diffuse: [0.02, 0.02, 0.02],
    opacity: 0.42,
    metalness: 0,
    gloss: 0.02,
  })
  const shadow = createPrimitive(pc, {
    name: 'contact-shadow',
    type: 'cylinder',
    position: [0.04, 0.014, 0],
    scale,
    material,
    castShadows: false,
    receiveShadows: false,
  })
  parent.addChild(shadow)
  return shadow
}
