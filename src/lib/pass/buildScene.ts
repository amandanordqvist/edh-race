import type { Application, Entity, Vec3 } from 'playcanvas'

import { buildPassEnvironment } from './buildEnvironment'
import { attachCamaroDecals } from './attachCamaroDecals'
import { buildPassVehicles, type VehicleId } from './buildVehicles'
import { loadCamaroGlb } from './loadCamaroGlb'
import type { PassOpponentId, PassQuality } from './types'

type PlayCanvasNamespace = typeof import('playcanvas')
type TreeMode = 'off' | 'stage' | 'amber' | 'green'

/** Near lane (+Z) faces the chase cam; far lane is the rival. */
const LANE_NEAR_Z = 2.2
const LANE_FAR_Z = -2.2

export type PassScene = {
  sceneRoot: Entity
  camera: Entity
  treeBulbs: {
    stage: Entity[]
    amber: Entity[]
    green: Entity[]
  }
  racers: Record<VehicleId, Entity>
  trackLength: number
  stripLightMaterials: import('playcanvas').StandardMaterial[]
  camaroBodyMaterial: import('playcanvas').StandardMaterial
  camaroUsesGlb: boolean
  camaroHasTextures: boolean
  getOpponent: () => PassOpponentId
  setOpponent: (opponent: PassOpponentId) => void
  setTreeLights: (mode: TreeMode) => void
  resetRacers: () => void
}

export async function buildPassScene(
  app: Application,
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): Promise<PassScene> {
  const sceneRoot = new pc.Entity('pass-scene')
  app.root.addChild(sceneRoot)

  app.scene.ambientLight = new pc.Color(0.28, 0.32, 0.38)
  app.scene.fog.type = pc.FOG_LINEAR
  app.scene.fog.color = new pc.Color(0.55, 0.66, 0.78)
  app.scene.fog.start = quality === 'high' ? 42 : 28
  app.scene.fog.end = quality === 'high' ? 155 : 120

  const environment = buildPassEnvironment(pc, sceneRoot, quality)
  const vehicles = buildPassVehicles(pc, quality)

  let camaro = vehicles.racers.camaro
  let camaroBodyMaterial = vehicles.camaroBodyMaterial

  let camaroUsesGlb = false
  let camaroHasTextures = false

  try {
    const loaded = await loadCamaroGlb({ app, pc, quality })
    camaro.destroy()
    camaro = loaded.entity
    camaroBodyMaterial = loaded.bodyMaterial
    camaroUsesGlb = true
    camaroHasTextures = loaded.hasTextures

    if (!loaded.hasTextures) {
      await attachCamaroDecals({ app, pc, camaro, quality })
    }
  } catch (error) {
    console.warn('[pass] Camaro GLB unavailable — using primitive fallback', error)
  }

  const racers: Record<VehicleId, Entity> = {
    camaro,
    f1: vehicles.racers.f1,
    jet: vehicles.racers.jet,
  }

  const placeOnLane = (entity: Entity, x: number, z: number) => {
    const pos = entity.getLocalPosition()
    entity.setLocalPosition(x, pos.y, z)
  }

  placeOnLane(racers.camaro, racers.camaro.getLocalPosition().x || 0.4, LANE_NEAR_Z)
  placeOnLane(racers.f1, 0.2, LANE_FAR_Z)
  placeOnLane(racers.jet, 0.15, LANE_FAR_Z)

  let opponent: PassOpponentId = 'f1'
  racers.f1.enabled = true
  racers.jet.enabled = false

  const startPositions: Record<VehicleId, Vec3> = {
    camaro: racers.camaro.getLocalPosition().clone(),
    f1: racers.f1.getLocalPosition().clone(),
    jet: racers.jet.getLocalPosition().clone(),
  }
  const startRotations: Record<VehicleId, Vec3> = {
    camaro: racers.camaro.getLocalEulerAngles().clone(),
    f1: racers.f1.getLocalEulerAngles().clone(),
    jet: racers.jet.getLocalEulerAngles().clone(),
  }

  Object.values(racers).forEach((racer) => {
    sceneRoot.addChild(racer)
  })

  const skyClear = new pc.Color(0.48, 0.6, 0.74)
  const camera = new pc.Entity('pass-camera')
  camera.addComponent('camera', {
    clearColor: skyClear,
    fov: quality === 'high' ? 46 : 52,
    nearClip: 0.35,
    farClip: environment.trackLength * 3,
  })
  const inspectYaw = (38 * Math.PI) / 180
  const inspectPitch = (18 * Math.PI) / 180
  const inspectRadius = 7.2
  const heroX = startPositions.camaro.x
  const heroZ = startPositions.camaro.z
  const cosPitch = Math.cos(inspectPitch)
  camera.setLocalPosition(
    heroX + Math.sin(inspectYaw) * cosPitch * inspectRadius,
    0.72 + Math.sin(inspectPitch) * inspectRadius,
    heroZ + Math.cos(inspectYaw) * cosPitch * inspectRadius,
  )
  camera.lookAt(heroX, 0.72, heroZ)
  sceneRoot.addChild(camera)

  const high = quality === 'high'

  const keyLight = new pc.Entity('key-light')
  keyLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(1, 0.96, 0.88),
    intensity: high ? 1.55 : 1.35,
    castShadows: true,
    shadowDistance: high ? 140 : 95,
    shadowResolution: high ? 2048 : 1024,
    shadowBias: 0.12,
    normalOffsetBias: 0.04,
    shadowType: pc.SHADOW_PCF3_32F,
  })
  keyLight.setEulerAngles(48, 38, 0)
  sceneRoot.addChild(keyLight)

  const fillLight = new pc.Entity('fill-light')
  fillLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.62, 0.74, 0.92),
    intensity: high ? 0.62 : 0.5,
    castShadows: false,
  })
  fillLight.setEulerAngles(28, -145, 0)
  sceneRoot.addChild(fillLight)

  if (high) {
    const rimLight = new pc.Entity('rim-light')
    rimLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.45, 0.55, 0.75),
      intensity: 0.35,
      castShadows: false,
    })
    rimLight.setEulerAngles(12, -95, 0)
    sceneRoot.addChild(rimLight)
  }

  const applyOpponentVisibility = () => {
    racers.f1.enabled = opponent === 'f1'
    racers.jet.enabled = opponent === 'jet'
  }

  const setOpponent = (next: PassOpponentId) => {
    opponent = next
    racers.f1.setLocalPosition(startPositions.f1)
    racers.f1.setLocalEulerAngles(startRotations.f1)
    racers.jet.setLocalPosition(startPositions.jet)
    racers.jet.setLocalEulerAngles(startRotations.jet)
    applyOpponentVisibility()
  }

  const getOpponent = () => opponent

  const resetRacers = () => {
    ;(Object.keys(racers) as VehicleId[]).forEach((id) => {
      racers[id].setLocalPosition(startPositions[id])
      racers[id].setLocalEulerAngles(startRotations[id])
    })
    applyOpponentVisibility()
  }

  resetRacers()

  return {
    sceneRoot,
    camera,
    treeBulbs: environment.treeBulbs,
    racers,
    trackLength: environment.trackLength,
    stripLightMaterials: environment.stripLightMaterials,
    camaroBodyMaterial,
    camaroUsesGlb,
    camaroHasTextures,
    getOpponent,
    setOpponent,
    setTreeLights: environment.setTreeLights,
    resetRacers,
  }
}
