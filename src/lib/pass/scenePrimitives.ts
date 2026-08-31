import type { Entity, StandardMaterial } from 'playcanvas'

import { STRIP_TOP_Y } from './passLayout'
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
  /** False on ground so PureSky IBL cannot paint the sky into the strip. */
  useSkybox?: boolean
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
  if (typeof tone.useSkybox === 'boolean') {
    material.useSkybox = tone.useSkybox
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

/** Grounding blob in world metres — counters parent GLB fit-scale. */
export function attachContactShadow(
  pc: PlayCanvasNamespace,
  parent: Entity,
  scale: [number, number, number] = [1.55, 0.008, 0.72],
): Entity {
  const material = createMaterial(pc, {
    diffuse: [0.02, 0.02, 0.02],
    opacity: 0.38,
    metalness: 0,
    gloss: 0.02,
    useSkybox: false,
  })
  const shadow = createPrimitive(pc, {
    name: 'contact-shadow',
    type: 'cylinder',
    position: [0.04, 0.014, 0],
    scale: [1, 1, 1],
    material,
    castShadows: false,
    receiveShadows: false,
  })
  parent.addChild(shadow)
  parent.syncHierarchy()
  const parentScale = parent.getLocalScale()
  const parentY = parent.getLocalPosition().y
  const ax = Math.max(Math.abs(parentScale.x), 0.0001)
  const ay = Math.max(Math.abs(parentScale.y), 0.0001)
  const az = Math.max(Math.abs(parentScale.z), 0.0001)
  shadow.setLocalPosition(0.04 / ax, (STRIP_TOP_Y + 0.005 - parentY) / ay, 0)
  shadow.setLocalScale(scale[0] / ax, scale[1] / ay, scale[2] / az)
  return shadow
}
