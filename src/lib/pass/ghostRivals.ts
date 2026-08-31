import type { Entity, StandardMaterial } from 'playcanvas'

import { forEachEntity } from './camaroRig'
import type { PlayCanvasNamespace } from './scenePrimitives'

type GhostTint = [number, number, number]

/**
 * Discreet comparison silhouette — translucent, no shadows, never a second
 * hero car on the line.
 */
export function applyGhostLook(
  pc: PlayCanvasNamespace,
  root: Entity,
  tint: GhostTint = [0.62, 0.68, 0.78],
): void {
  forEachEntity(root, (entity) => {
    const render = entity.render
    if (!render) return

    render.castShadows = false
    render.meshInstances.forEach((instance) => {
      const material = (instance.material as StandardMaterial).clone()
      material.opacity = 0.3
      material.blendType = pc.BLEND_NORMAL
      material.depthWrite = true
      material.useMetalness = true
      material.metalness = Math.min(material.metalness, 0.12)
      material.gloss = Math.min(material.gloss, 0.22)
      material.emissive.set(...tint)
      material.emissiveIntensity = 0.18
      material.diffuse.set(tint[0] * 0.45, tint[1] * 0.45, tint[2] * 0.45)
      material.diffuseMap = null
      material.emissiveMap = null
      material.update()
      instance.material = material
      instance.castShadow = false
    })
  })
}
