import type { Application, ContainerResource, Entity, StandardMaterial } from 'playcanvas'

import type { PassQuality } from './types'
import { collectModelBounds, forEachEntity, hideSphericalMeshes } from './camaroRig'
import { loadContainerAsset } from './loadGlbAsset'
import { VEHICLE_GROUND_Y } from './passLayout'
import {
  attachContactShadow,
  createMaterial,
  shadowsEnabled,
  type PlayCanvasNamespace,
} from './scenePrimitives'

const CAMARO_GLB_URL = '/models/pass/camaro.glb'

/** Target length along the strip (meters). */
const CAMARO_TARGET_LENGTH = 4.2

/** Nose sits on the start line; origin is behind so the tree stays clear. */
const CAMARO_STAGING_X = -0.6

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

/**
 * Keep camaro.glb materials as authored. Clone so we never mutate shared
 * GLB instances (that bled paint onto the strip).
 */
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
      const material = source.clone()
      instance.material = material
      instance.castShadow = cast
      instance.receiveShadow = cast

      if (material.diffuseMap) hasTextures = true
      if (!bodyMaterial) bodyMaterial = material
    })
  })

  if (bodyMaterial) {
    return { bodyMaterial, hasTextures }
  }

  return {
    bodyMaterial: createMaterial(pc, {
      diffuse: [48 / 255, 82 / 255, 168 / 255],
      metalness: 0.12,
      gloss: 0.78,
    }),
    hasTextures: false,
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
    camaro.setLocalPosition(CAMARO_STAGING_X, VEHICLE_GROUND_Y, 0)
    return
  }

  const sizeX = bounds.max[0] - bounds.min[0]
  const sizeZ = bounds.max[2] - bounds.min[2]
  const lengthAlongX = sizeX >= sizeZ
  const modelLength = Math.max(sizeX, sizeZ, 0.001)
  const scale = CAMARO_TARGET_LENGTH / modelLength

  const alignYaw = lengthAlongX ? 0 : 90
  const yawDeg = alignYaw + CAMARO_YAW_FLIP_DEG

  const centerX = (bounds.min[0] + bounds.max[0]) * 0.5
  const centerZ = (bounds.min[2] + bounds.max[2]) * 0.5

  camaro.setLocalEulerAngles(0, yawDeg, 0)
  camaro.setLocalScale(scale, scale, scale)

  if (alignYaw === 0) {
    camaro.setLocalPosition(CAMARO_STAGING_X - centerX * scale, 0, -centerZ * scale)
  } else {
    camaro.setLocalPosition(CAMARO_STAGING_X - centerZ * scale, 0, centerX * scale)
  }

  if (CAMARO_YAW_FLIP_DEG === 180) {
    const pos = camaro.getLocalPosition()
    camaro.setLocalPosition(CAMARO_STAGING_X - (pos.x - CAMARO_STAGING_X), pos.y, -pos.z)
  }

  camaro.syncHierarchy()
  const grounded = collectModelBounds(modelRoot)
  if (grounded) {
    const pos = camaro.getLocalPosition()
    camaro.setLocalPosition(pos.x, VEHICLE_GROUND_Y - grounded.min[1], pos.z)
  } else {
    camaro.setLocalPosition(
      camaro.getLocalPosition().x,
      VEHICLE_GROUND_Y - bounds.min[1] * scale,
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
  hideSphericalMeshes(modelRoot, 1.15)

  const camaro = new pc.Entity('camaro')
  camaro.addChild(modelRoot)

  fitCamaroToStrip(camaro, modelRoot)

  const { bodyMaterial, hasTextures } = prepareCamaroMaterials(modelRoot, pc, quality)
  attachContactShadow(pc, camaro)

  return { entity: camaro, bodyMaterial, hasTextures }
}
