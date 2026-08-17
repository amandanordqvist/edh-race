import type { Application, ContainerResource, Entity, StandardMaterial } from 'playcanvas'

import type { PassQuality } from './types'
import { collectModelBounds, forEachEntity } from './camaroRig'
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

const EDH_BLUE: [number, number, number] = [48 / 255, 82 / 255, 168 / 255]

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

function isBodyPaintName(name: string): boolean {
  const n = name.toLowerCase()
  return (
    n.includes('bodywork') ||
    n.includes('paint') ||
    n.includes('carpaint') ||
    (n.includes('body') && !n.includes('nobody'))
  )
}

function isGlassName(name: string): boolean {
  const n = name.toLowerCase()
  return (
    n.includes('glass') ||
    n.includes('window') ||
    n.includes('windscreen') ||
    n.includes('windshield') ||
    n.includes('canopy')
  )
}

function isTireName(name: string): boolean {
  const n = name.toLowerCase()
  return n.includes('tire') || n.includes('tyre') || n.includes('rubber') || n.includes('wheel')
}

function isChromeName(name: string): boolean {
  const n = name.toLowerCase()
  return (
    n.includes('chrome') ||
    n.includes('exhaust') ||
    n.includes('chassis') ||
    (n.includes('metal') && !n.includes('body'))
  )
}

function applyEdhBodyPaint(material: StandardMaterial, quality: PassQuality): void {
  material.name = 'edh-bodywork'
  material.diffuse.set(...EDH_BLUE)
  material.emissive.set(0.05, 0.08, 0.15)
  material.emissiveIntensity = quality === 'high' ? 0.14 : 0.09
  material.useMetalness = true
  material.metalness = 0.5
  material.gloss = 0.92
  // Never keep albedo maps that could paint other shared instances blue.
  material.diffuseMap = null
  material.emissiveMap = null
  material.update()
}

function applyNeutralGlass(material: StandardMaterial, pc: PlayCanvasNamespace): void {
  material.name = 'edh-glass'
  material.diffuse.set(0.12, 0.12, 0.13)
  material.emissive.set(0, 0, 0)
  material.emissiveIntensity = 0
  material.useMetalness = true
  material.metalness = 0
  material.gloss = 0.85
  material.opacity = 0.28
  material.blendType = pc.BLEND_NORMAL
  material.depthWrite = false
  material.cull = pc.CULLFACE_NONE
  material.diffuseMap = null
  material.emissiveMap = null
  material.update()
}

/**
 * Clone every mesh material so body / glass / tires never share instances
 * with each other or with the strip. Blue paint only on explicitly named
 * body/paint meshes.
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

    const entityName = entity.name ?? ''

    render.meshInstances.forEach((instance) => {
      const source = instance.material as StandardMaterial
      const materialName = source.name ?? ''
      const label = `${entityName} ${materialName}`
      const textured = Boolean(source.diffuseMap)
      if (textured) hasTextures = true

      // Always clone — mutating shared GLB materials bleeds paint onto glass/track.
      const material = source.clone()
      instance.material = material

      if (isGlassName(label)) {
        applyNeutralGlass(material, pc)
      } else if (isBodyPaintName(label)) {
        applyEdhBodyPaint(material, quality)
        bodyMaterial = material
      } else if (isTireName(label)) {
        material.name = 'edh-tire'
        material.diffuse.set(0.045, 0.045, 0.05)
        material.emissive.set(0, 0, 0)
        material.emissiveIntensity = 0
        material.useMetalness = true
        material.metalness = 0.02
        material.gloss = 0.1
        material.update()
      } else if (isChromeName(label) && !isBodyPaintName(label)) {
        material.name = 'edh-chrome'
        material.diffuse.set(0.72, 0.74, 0.78)
        material.useMetalness = true
        material.metalness = 0.94
        material.gloss = 0.9
        material.emissiveIntensity = 0
        material.update()
      } else if (textured) {
        // Keep scan albedo on non-body parts — do not force blue.
        material.useMetalness = true
        material.update()
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
      diffuse: EDH_BLUE,
      emissive: [0.05, 0.08, 0.15],
      emissiveIntensity: quality === 'high' ? 0.14 : 0.09,
      metalness: 0.5,
      gloss: 0.92,
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

  const alignYaw = lengthAlongX ? 0 : 90
  const yawDeg = alignYaw + CAMARO_YAW_FLIP_DEG

  const centerX = (bounds.min[0] + bounds.max[0]) * 0.5
  const centerZ = (bounds.min[2] + bounds.max[2]) * 0.5

  camaro.setLocalEulerAngles(0, yawDeg, 0)
  camaro.setLocalScale(scale, scale, scale)

  if (alignYaw === 0) {
    camaro.setLocalPosition(0.4 - centerX * scale, 0, -centerZ * scale)
  } else {
    camaro.setLocalPosition(0.4 - centerZ * scale, 0, centerX * scale)
  }

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
