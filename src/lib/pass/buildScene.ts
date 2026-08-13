import type { Application, Asset, Entity, Texture, Vec3 } from 'playcanvas'

import { buildPassEnvironment, type TreeMode } from './buildEnvironment'
import { attachCamaroDecals } from './attachCamaroDecals'
import { buildPassVehicles, type VehicleId } from './buildVehicles'
import { loadCamaroGlb } from './loadCamaroGlb'
import { loadFittedGlb } from './loadFittedGlb'
import { loadTextureAsset } from './loadTextureAsset'
import { LANE_FAR_Z, LANE_NEAR_Z } from './passLayout'
import { sponsors } from '../../data/sponsors'
import type { PassOpponentId, PassQuality } from './types'

type PlayCanvasNamespace = typeof import('playcanvas')

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

  // Bright daylight: high sun, cool fill, pale horizon haze — NHRA daytime strip.
  app.scene.ambientLight = new pc.Color(0.5, 0.52, 0.56)
  app.scene.fog.type = pc.FOG_LINEAR
  app.scene.fog.color = new pc.Color(0.74, 0.8, 0.88)
  app.scene.fog.start = quality === 'high' ? 62 : 40
  app.scene.fog.end = quality === 'high' ? 190 : 140

  // Pre-fetch sponsor logos for wall boards. Missing textures fall back to tone.
  const sponsorTextures = await Promise.all(
    sponsors.map(async (sponsor) => {
      try {
        const asset = await loadTextureAsset(app, pc, sponsor.logo, `sponsor-${sponsor.id}`)
        return { sponsorId: sponsor.id, asset }
      } catch (error) {
        console.warn(`[pass] Sponsor logo ${sponsor.id} unavailable`, error)
        return { sponsorId: sponsor.id, asset: null as Asset | null }
      }
    }),
  )

  let asphaltRough: Texture | null = null
  try {
    const roughAsset = await loadTextureAsset(
      app,
      pc,
      '/models/pass/asphalt-rough.jpg',
      'asphalt-rough',
    )
    asphaltRough = (roughAsset.resource as Texture | undefined) ?? null
  } catch (error) {
    console.warn('[pass] Asphalt roughness unavailable', error)
  }

  let christmasTreeMesh: Entity | null = null
  try {
    christmasTreeMesh = await loadFittedGlb({
      app,
      pc,
      quality,
      url: '/models/dragster_race_christmas_tree.glb',
      name: 'christmas-tree-glb',
      target: { kind: 'height', meters: 5.8 },
      groundClearance: 0,
    })
  } catch (error) {
    console.warn('[pass] Christmas tree GLB unavailable — using primitive tree', error)
  }

  const environment = buildPassEnvironment(pc, sceneRoot, quality, sponsorTextures, {
    asphaltRough,
    christmasTreeMesh,
  })
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

  // Sketchfab F2004 includes a 22 m studio cage — strip it, then fit the car.
  try {
    const f1Glb = await loadFittedGlb({
      app,
      pc,
      quality,
      url: '/models/2004_ferrari_f2004.glb',
      name: 'f1-glb',
      target: { kind: 'length', meters: 4.55 },
      groundClearance: 0.03,
      stripLargerThan: 7,
      stripYSpread: 3.2,
      maxFittedHeight: 2.4,
      maxFittedExtent: 6.5,
    })
    racers.f1.destroy()
    racers.f1 = f1Glb
  } catch (error) {
    console.warn('[pass] F1 GLB unavailable — using primitive fallback', error)
  }

  try {
    const jetGlb = await loadFittedGlb({
      app,
      pc,
      quality,
      url: '/models/c17_plane_game-ready.glb',
      name: 'jet-glb',
      target: { kind: 'length', meters: 9 },
      groundClearance: 0.06,
      minFitScale: 0.001,
      maxFittedHeight: 10,
      maxFittedExtent: 22,
    })
    racers.jet.destroy()
    racers.jet = jetGlb
  } catch (error) {
    console.warn('[pass] C-17 GLB unavailable — using primitive jet', error)
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

  const skyClear = new pc.Color(0.55, 0.68, 0.82)
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

  // High daylight key from over the far grandstand so rubber and blue paint read.
  // When the PureSky HDRI is active, IBL already lights the cars — keep the key softer.
  const keyLight = new pc.Entity('key-light')
  keyLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(1.0, 0.96, 0.88),
    intensity: high ? 2.15 : 1.8,
    castShadows: true,
    shadowDistance: high ? 140 : 95,
    shadowResolution: high ? 2048 : 1024,
    shadowBias: 0.12,
    normalOffsetBias: 0.04,
    shadowType: pc.SHADOW_PCF3_32F,
  })
  keyLight.setEulerAngles(42, 28, 0)
  sceneRoot.addChild(keyLight)

  const fillLight = new pc.Entity('fill-light')
  fillLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.52, 0.64, 0.86),
    intensity: high ? 0.72 : 0.58,
    castShadows: false,
  })
  fillLight.setEulerAngles(32, -130, 0)
  sceneRoot.addChild(fillLight)

  const groundBounce = new pc.Entity('ground-bounce')
  groundBounce.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.55, 0.54, 0.5),
    intensity: high ? 0.3 : 0.24,
    castShadows: false,
  })
  groundBounce.setEulerAngles(-48, 8, 0)
  sceneRoot.addChild(groundBounce)

  if (high) {
    const rimLight = new pc.Entity('rim-light')
    rimLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.72, 0.82, 1.0),
      intensity: 0.48,
      castShadows: false,
    })
    rimLight.setEulerAngles(8, -40, 0)
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
