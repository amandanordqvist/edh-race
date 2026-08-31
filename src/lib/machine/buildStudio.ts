import type { Application, Entity, StandardMaterial } from 'playcanvas'

import { collectModelBounds, forEachEntity } from '../pass/camaroRig'
import { loadCamaroGlb } from '../pass/loadCamaroGlb'
import { VEHICLE_GROUND_Y } from '../pass/passLayout'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from '../pass/scenePrimitives'
import type { PassQuality } from '../pass/types'

export type StudioScene = {
  camera: Entity
  look: [number, number, number]
}

const CLEAR: [number, number, number] = [8 / 255, 10 / 255, 16 / 255]

function disableSkyboxOn(root: Entity): void {
  forEachEntity(root, (entity) => {
    entity.render?.meshInstances.forEach((instance) => {
      const material = instance.material as StandardMaterial
      material.useSkybox = false
      material.update()
    })
  })
}

function attachStudioLights(
  pc: PlayCanvasNamespace,
  root: Entity,
  quality: PassQuality,
  look: [number, number, number],
): void {
  const high = quality === 'high'

  const key = new pc.Entity('studio-key')
  key.addComponent('light', {
    type: 'directional',
    color: new pc.Color(1, 0.97, 0.92),
    intensity: high ? 3.1 : 2.4,
    castShadows: true,
    shadowDistance: 18,
    shadowResolution: high ? 2048 : 1024,
    shadowBias: 0.02,
    normalOffsetBias: 0.03,
    shadowType: pc.SHADOW_PCF3_32F,
  })
  key.setEulerAngles(38, 42, 0)
  root.addChild(key)

  const fill = new pc.Entity('studio-fill')
  fill.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.55, 0.66, 0.95),
    intensity: high ? 1.05 : 0.8,
    castShadows: false,
  })
  fill.setEulerAngles(18, -128, 0)
  root.addChild(fill)

  const rim = new pc.Entity('studio-rim')
  rim.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.62, 0.76, 1),
    intensity: high ? 1.35 : 0.95,
    castShadows: false,
  })
  rim.setEulerAngles(6, -52, 0)
  root.addChild(rim)

  const bulb = new pc.Entity('studio-bulb')
  bulb.addComponent('light', {
    type: 'omni',
    color: new pc.Color(0.85, 0.9, 1),
    intensity: high ? 1.4 : 1.05,
    range: 16,
    castShadows: false,
  })
  bulb.setLocalPosition(look[0], look[1] + 4.2, look[2])
  root.addChild(bulb)
}

export async function buildStudioScene(
  app: Application,
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): Promise<StudioScene> {
  const root = new pc.Entity('studio-root')
  app.root.addChild(root)

  app.scene.ambientLight = new pc.Color(0.28, 0.32, 0.4)
  app.scene.fog.type = pc.FOG_NONE

  const camera = new pc.Entity('studio-camera')
  camera.addComponent('camera', {
    clearColor: new pc.Color(...CLEAR),
    fov: 34,
    nearClip: 0.12,
    farClip: 80,
  })
  root.addChild(camera)

  const loaded = await loadCamaroGlb({ app, pc, quality })
  root.addChild(loaded.entity)
  loaded.entity.syncHierarchy()
  disableSkyboxOn(loaded.entity)

  const bounds = collectModelBounds(loaded.entity)
  const look: [number, number, number] = bounds
    ? [
        (bounds.min[0] + bounds.max[0]) * 0.5,
        bounds.min[1] + (bounds.max[1] - bounds.min[1]) * 0.38,
        (bounds.min[2] + bounds.max[2]) * 0.5,
      ]
    : [0.4, 0.55, 0]

  attachStudioLights(pc, root, quality, look)

  const cycMat = createMaterial(pc, {
    diffuse: [0.05, 0.07, 0.12],
    emissive: [0.05, 0.08, 0.16],
    emissiveIntensity: 0.85,
    metalness: 0,
    gloss: 0,
    useSkybox: false,
  })
  cycMat.cull = pc.CULLFACE_FRONT
  cycMat.update()

  const cyc = createPrimitive(pc, {
    name: 'studio-cyc',
    type: 'sphere',
    position: look,
    scale: [36, 36, 36],
    material: cycMat,
    castShadows: false,
    receiveShadows: false,
  })
  root.addChild(cyc)

  const floor = createPrimitive(pc, {
    name: 'studio-floor',
    type: 'cylinder',
    position: [look[0], VEHICLE_GROUND_Y - 0.01, look[2]],
    scale: [8.5, 0.02, 8.5],
    material: createMaterial(pc, {
      diffuse: [0.1, 0.11, 0.14],
      metalness: 0.12,
      gloss: 0.42,
      useSkybox: false,
    }),
    castShadows: false,
    receiveShadows: true,
  })
  root.addChild(floor)

  return { camera, look }
}
