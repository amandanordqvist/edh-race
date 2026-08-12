import type { StandardMaterial } from 'playcanvas'

import type { PassQuality } from './types'

export type PlayCanvasNamespace = typeof import('playcanvas')

export type MaterialTone = {
  diffuse: [number, number, number]
  emissive?: [number, number, number]
  emissiveIntensity?: number
  metalness?: number
  gloss?: number
}

export type PrimitiveOptions = {
  name: string
  type: 'box' | 'plane' | 'sphere' | 'cylinder'
  position: [number, number, number]
  scale: [number, number, number]
  material: StandardMaterial
  castShadows?: boolean
  receiveShadows?: boolean
}

export function createMaterial(pc: PlayCanvasNamespace, tone: MaterialTone): StandardMaterial {
  const material = new pc.StandardMaterial()

  material.diffuse.set(...tone.diffuse)
  material.emissive.set(...(tone.emissive ?? [0, 0, 0]))
  material.emissiveIntensity = tone.emissiveIntensity ?? 0
  material.useMetalness = true
  material.metalness = tone.metalness ?? 0.1
  material.gloss = tone.gloss ?? 0.25
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
