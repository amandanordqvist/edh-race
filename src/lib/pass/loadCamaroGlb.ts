import type { Application, ContainerResource, Entity, StandardMaterial } from 'playcanvas'

import type { PassQuality } from './types'
import { forEachEntity } from './camaroRig'
import { loadContainerAsset } from './loadGlbAsset'
import {
  createMaterial,
  shadowsEnabled,
  type PlayCanvasNamespace,
} from './scenePrimitives'

const CAMARO_GLB_URL = '/models/pass/camaro.glb'

/** Target length along the strip (meters). */
const CAMARO_TARGET_LENGTH = 4.2
const CAMARO_GROUND_CLEARANCE = 0.04

/**
 * Extra yaw after auto-aligning longest axis to +X.
 * Flip to 180 if the nose points toward the water box instead of the traps.
 */
const CAMARO_YAW_FLIP_DEG: 0 | 180 = 0

type LoadCamaroOptions = {
  app: Application
  pc: PlayCanvasNamespace
  quality: PassQuality
}

export type LoadedCamaro = {
  entity: Entity
  bodyMaterial: StandardMaterial
  hasTextures: boolean
}

type ModelBounds = {
  min: [number, number, number]
  max: [number, number, number]
}

function collectModelBounds(root: Entity): ModelBounds | null {
  let minX = Infinity
  let minY = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let maxZ = -Infinity
  let found = false

  forEachEntity(root, (entity) => {
    const render = entity.render
    if (!render) return

    render.meshInstances.forEach((instance) => {
      const aabb = instance.aabb
      const cx = aabb.center.x
      const cy = aabb.center.y
      const cz = aabb.center.z
      const hx = aabb.halfExtents.x
      const hy = aabb.halfExtents.y
      const hz = aabb.halfExtents.z

      minX = Math.min(minX, cx - hx)
      minY = Math.min(minY, cy - hy)
      minZ = Math.min(minZ, cz - hz)
      maxX = Math.max(maxX, cx + hx)
      maxY = Math.max(maxY, cy + hy)
      maxZ = Math.max(maxZ, cz + hz)
      found = true
    })
  })

  if (!found) return null

  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
  }
}

function prepareCamaroMaterials(
  root: Entity,
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): { bodyMaterial: StandardMaterial; hasTextures: boolean } {
  const cast = shadowsEnabled(quality)
  let bodyMaterial: StandardMaterial | null = null
  let hasTextures = false

  forEachEntity(root, (entity) => {
    const render = entity.render
    if (!render) return

    render.meshInstances.forEach((instance) => {
      const source = instance.material as StandardMaterial
      const materialName = (source.name ?? '').toLowerCase()
      const textured = Boolean(source.diffuseMap)
      const isGlass = materialName.includes('glass') || materialName.includes('window')
      const isChrome = materialName.includes('chrome') || materialName.includes('metal')
      const isTire = materialName.includes('tire') || materialName.includes('tyre') || materialName.includes('rubber')

      if (textured) {
        hasTextures = true
        // Gloss/metal lift so the paint reads as clearcoated in daylight.
        source.useMetalness = true
        if (source.metalness < 0.35) source.metalness = 0.55
        if (source.gloss < 0.55) source.gloss = 0.72
        source.update()
        if (!bodyMaterial) bodyMaterial = source
      } else if (materialName.includes('bodywork') || !bodyMaterial) {
        if (materialName.includes('bodywork')) {
          const tinted = source.clone()
          tinted.name = 'edh-bodywork'
          tinted.diffuse.set(28 / 255, 58 / 255, 128 / 255)
          tinted.emissive.set(0.02, 0.04, 0.08)
          tinted.emissiveIntensity = quality === 'high' ? 0.18 : 0.1
          tinted.useMetalness = true
          tinted.metalness = 0.62
          tinted.gloss = 0.78
          tinted.update()
          instance.material = tinted
          bodyMaterial = tinted
        } else if (!bodyMaterial) {
          bodyMaterial = source
        }
      }

      if (isGlass) {
        const glass = source.clone()
        glass.opacity = 0.35
        glass.diffuse.set(0.08, 0.1, 0.14)
        glass.emissive.set(0.02, 0.03, 0.05)
        glass.emissiveIntensity = 0.1
        glass.useMetalness = true
        glass.metalness = 0.45
        glass.gloss = 0.92
        glass.blendType = pc.BLEND_NORMAL
        glass.depthWrite = false
        glass.cull = pc.CULLFACE_NONE
        glass.update()
        instance.material = glass
      }

      if (isChrome && !textured) {
        const chrome = source.clone()
        chrome.diffuse.set(0.72, 0.74, 0.78)
        chrome.useMetalness = true
        chrome.metalness = 0.95
        chrome.gloss = 0.88
        chrome.update()
        instance.material = chrome
      }

      if (isTire && !textured) {
        const tire = source.clone()
        tire.diffuse.set(0.04, 0.04, 0.045)
        tire.useMetalness = true
        tire.metalness = 0.05
        tire.gloss = 0.18
        tire.update()
        instance.material = tire
      }

      instance.castShadow = cast
      instance.receiveShadow = cast
    })
  })

  if (bodyMaterial) {
    return { bodyMaterial, hasTextures }
  }

  return {
    bodyMaterial: createMaterial(pc, {
      diffuse: [28 / 255, 58 / 255, 128 / 255],
      emissive: [0.02, 0.04, 0.08],
      emissiveIntensity: quality === 'high' ? 0.18 : 0.1,
      metalness: 0.62,
      gloss: 0.78,
    }),
    hasTextures,
  }
}

/**
 * Fit any Camaro GLB to the strip:
 * - scale longest horizontal axis to ~4.2 m
 * - yaw so that axis points +X (strip forward)
 * - re-ground from live AABB after scale
 */
function fitCamaroToStrip(camaro: Entity, modelRoot: Entity): void {
  camaro.setLocalPosition(0, 0, 0)
  camaro.setLocalEulerAngles(0, 0, 0)
  camaro.setLocalScale(1, 1, 1)

  const bounds = collectModelBounds(modelRoot)
  if (!bounds) {
    camaro.setLocalPosition(0.4, CAMARO_GROUND_CLEARANCE, 0)
    return
  }

  const sizeX = bounds.max[0] - bounds.min[0]
  const sizeZ = bounds.max[2] - bounds.min[2]
  const lengthAlongX = sizeX >= sizeZ
  const modelLength = Math.max(sizeX, sizeZ, 0.001)
  const scale = CAMARO_TARGET_LENGTH / modelLength

  // Longest horizontal axis → +X, then optional flip for nose direction.
  const alignYaw = lengthAlongX ? 0 : 90
  const yawDeg = alignYaw + CAMARO_YAW_FLIP_DEG

  const centerX = (bounds.min[0] + bounds.max[0]) * 0.5
  const centerZ = (bounds.min[2] + bounds.max[2]) * 0.5

  camaro.setLocalEulerAngles(0, yawDeg, 0)
  camaro.setLocalScale(scale, scale, scale)

  // Center on lane first (identity-ish X/Z), then re-measure world AABB for ground.
  if (alignYaw === 0) {
    camaro.setLocalPosition(0.4 - centerX * scale, 0, -centerZ * scale)
  } else {
    // +90° yaw: model (x,z) → world (z, -x)
    camaro.setLocalPosition(0.4 - centerZ * scale, 0, centerX * scale)
  }

  // Flip 180 keeps lateral centering; only X flips relative to strip.
  if (CAMARO_YAW_FLIP_DEG === 180) {
    const pos = camaro.getLocalPosition()
    camaro.setLocalPosition(0.4 - (pos.x - 0.4), pos.y, -pos.z)
  }

  const grounded = collectModelBounds(modelRoot)
  if (grounded) {
    const pos = camaro.getLocalPosition()
    camaro.setLocalPosition(pos.x, CAMARO_GROUND_CLEARANCE - grounded.min[1], pos.z)
  } else {
    camaro.setLocalPosition(
      camaro.getLocalPosition().x,
      CAMARO_GROUND_CLEARANCE - bounds.min[1] * scale,
      camaro.getLocalPosition().z,
    )
  }
}

export async function loadCamaroGlb(opts: LoadCamaroOptions): Promise<LoadedCamaro> {
  const { app, pc, quality } = opts

  const asset = await loadContainerAsset(app, pc, CAMARO_GLB_URL, 'camaro-glb')
  const resource = asset.resource as ContainerResource

  const modelRoot = resource.instantiateRenderEntity()
  modelRoot.name = 'camaro-glb'

  const camaro = new pc.Entity('camaro')
  camaro.addChild(modelRoot)

  fitCamaroToStrip(camaro, modelRoot)

  const { bodyMaterial, hasTextures } = prepareCamaroMaterials(modelRoot, pc, quality)

  return { entity: camaro, bodyMaterial, hasTextures }
}
