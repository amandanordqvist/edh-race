import type { Application, Entity, Texture, Vec3 } from 'playcanvas'

import { buildPassEnvironment, type TreeMode } from './buildEnvironment'
import { attachCamaroDecals } from './attachCamaroDecals'
import { attachPassBloom, attachPassSunLights } from './buildLighting'
import { buildPassVehicles, type VehicleId } from './buildVehicles'
import { buildStreetCar } from './buildStreetCar'
import {
  PASS_INSPECT_LOOK_Y,
  PASS_INSPECT_PITCH_DEG,
  PASS_INSPECT_RADIUS,
  PASS_INSPECT_YAW_DEG,
} from './cameraDirector'
import { applyPassEnvLighting } from './loadEnvLighting'
import { loadCamaroGlb } from './loadCamaroGlb'
import { loadFittedGlb } from './loadFittedGlb'
import { createScoreboard, type PassScoreboard } from './createScoreboard'
import { loadTextureAsset } from './loadTextureAsset'
import {
  JET_ALTITUDE,
  JET_Z,
  LANE_FAR_Z,
  LANE_NEAR_Z,
  STREET_CAR_START_X,
  STREET_CAR_Y,
  STREET_CAR_Z,
  VEHICLE_GROUND_Y,
} from './passLayout'
import { applyGhostLook } from './ghostRivals'
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
  streetCar: Entity
  trackLength: number
  stripLightMaterials: import('playcanvas').StandardMaterial[]
  camaroBodyMaterial: import('playcanvas').StandardMaterial
  camaroUsesGlb: boolean
  camaroHasTextures: boolean
  getOpponent: () => PassOpponentId
  setOpponent: (opponent: PassOpponentId) => void
  setRivalsLive: (live: boolean) => void
  setTreeLights: (mode: TreeMode) => void
  resetRacers: () => void
  scoreboard: PassScoreboard
  setSpeedFeel: (speed01: number) => void
}

export async function buildPassScene(
  app: Application,
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): Promise<PassScene> {
  const sceneRoot = new pc.Entity('pass-scene')
  app.root.addChild(sceneRoot)

  app.scene.ambientLight = new pc.Color(0.22, 0.24, 0.26)
  app.scene.fog.type = pc.FOG_LINEAR
  app.scene.fog.color = new pc.Color(0.42, 0.48, 0.55)
  app.scene.fog.start = quality === 'high' ? 160 : 110
  app.scene.fog.end = quality === 'high' ? 420 : 280

  const ibl = await applyPassEnvLighting(app, pc, quality)
  if (ibl) {
    app.scene.fog.start = quality === 'high' ? 180 : 120
    app.scene.fog.end = quality === 'high' ? 480 : 300
    app.scene.fog.color = new pc.Color(0.22, 0.24, 0.26)
  }

  // Barrier boards stay tone-only — skip logo fetches until body-mapped decals exist.
  const sponsorTextures: import('./buildBarrierBoards').SponsorTextureEntry[] = []

  let asphaltRough: Texture | null = null
  let asphaltDiffuse: Texture | null = null
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
  try {
    const diffAsset = await loadTextureAsset(
      app,
      pc,
      '/models/pass/asphalt_track_diff_1k.jpg',
      'asphalt-diff',
    )
    asphaltDiffuse = (diffAsset.resource as Texture | undefined) ?? null
  } catch (error) {
    console.warn('[pass] Asphalt diffuse unavailable', error)
  }

  let christmasTreeMesh: Entity | null = null
  try {
    christmasTreeMesh = await loadFittedGlb({
      app,
      pc,
      quality,
      url: '/models/dragster_race_christmas_tree.glb',
      name: 'christmas-tree-glb',
      target: { kind: 'height', meters: 4.6 },
      groundClearance: VEHICLE_GROUND_Y,
      stripLargerThan: 2.8,
      stripYSpread: 2.6,
      stripSpheresLargerThan: 0.22,
      maxFittedExtent: 8,
    })
  } catch (error) {
    console.warn('[pass] Christmas tree GLB unavailable — using primitive tree', error)
  }

  const environment = buildPassEnvironment(pc, sceneRoot, quality, sponsorTextures, {
    asphaltRough,
    asphaltDiffuse,
    christmasTreeMesh,
    hideSkyPlanes: ibl,
    app,
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

    // Always brand the car — scan textures alone read as a generic prototype.
    await attachCamaroDecals({ app, pc, camaro, quality })
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
      groundClearance: VEHICLE_GROUND_Y,
      stripLargerThan: 7,
      stripYSpread: 2.4,
      stripSpheresLargerThan: 0.95,
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
      stripSpheresLargerThan: 2.2,
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
  placeOnLane(racers.f1, 1.85, LANE_FAR_Z - 0.55)
  racers.jet.setLocalPosition(1.6, JET_ALTITUDE, JET_Z)
  applyGhostLook(pc, racers.f1, [0.58, 0.66, 0.8])
  applyGhostLook(pc, racers.jet, [0.64, 0.66, 0.72])

  const streetCar = buildStreetCar(pc, quality)
  streetCar.setLocalPosition(STREET_CAR_START_X, STREET_CAR_Y, STREET_CAR_Z)
  applyGhostLook(pc, streetCar, [0.55, 0.56, 0.58])
  const streetStart = streetCar.getLocalPosition().clone()
  const streetStartRot = streetCar.getLocalEulerAngles().clone()

  let opponent: PassOpponentId = 'none'
  let rivalsLive = false
  racers.f1.enabled = false
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
  sceneRoot.addChild(streetCar)
  streetCar.enabled = false

  const skyClear = new pc.Color(0.42, 0.64, 0.92)
  const camera = new pc.Entity('pass-camera')
  camera.addComponent('camera', {
    clearColor: skyClear,
    fov: quality === 'high' ? 44 : 50,
    nearClip: 0.2,
    farClip: environment.trackLength * 4,
  })
  const inspectYaw = (PASS_INSPECT_YAW_DEG * Math.PI) / 180
  const inspectPitch = (PASS_INSPECT_PITCH_DEG * Math.PI) / 180
  const inspectRadius = PASS_INSPECT_RADIUS
  const heroX = startPositions.camaro.x
  const heroZ = startPositions.camaro.z
  const cosPitch = Math.cos(inspectPitch)
  camera.setLocalPosition(
    heroX + Math.sin(inspectYaw) * cosPitch * inspectRadius,
    PASS_INSPECT_LOOK_Y + Math.sin(inspectPitch) * inspectRadius,
    heroZ + Math.cos(inspectYaw) * cosPitch * inspectRadius,
  )
  camera.lookAt(heroX + 1.8, PASS_INSPECT_LOOK_Y + 0.08, heroZ)
  sceneRoot.addChild(camera)

  attachPassSunLights({
    pc,
    sceneRoot,
    quality,
    kind: ibl ? 'ibl' : 'procedural',
  })
  const speedFeel = attachPassBloom({ app, pc, camera, quality })

  const scoreboard = createScoreboard(app, pc, sceneRoot)

  const applyOpponentVisibility = () => {
    racers.f1.enabled = rivalsLive && opponent === 'f1'
    racers.jet.enabled = rivalsLive && opponent === 'jet'
  }

  const setRivalsLive = (live: boolean) => {
    rivalsLive = live
    applyOpponentVisibility()
  }

  const setOpponent = (next: PassOpponentId) => {
    opponent = next
    racers.f1.setLocalPosition(startPositions.f1)
    racers.f1.setLocalEulerAngles(startRotations.f1)
    racers.jet.setLocalPosition(startPositions.jet)
    racers.jet.setLocalEulerAngles(startRotations.jet)
    applyOpponentVisibility()
    scoreboard.setOpponent(next)
  }

  const getOpponent = () => opponent

  const resetRacers = () => {
    rivalsLive = false
    ;(Object.keys(racers) as VehicleId[]).forEach((id) => {
      racers[id].setLocalPosition(startPositions[id])
      racers[id].setLocalEulerAngles(startRotations[id])
    })
    streetCar.setLocalPosition(streetStart)
    streetCar.setLocalEulerAngles(streetStartRot)
    streetCar.enabled = false
    applyOpponentVisibility()
    scoreboard.reset()
  }

  resetRacers()

  return {
    sceneRoot,
    camera,
    treeBulbs: environment.treeBulbs,
    racers,
    streetCar,
    trackLength: environment.trackLength,
    stripLightMaterials: environment.stripLightMaterials,
    camaroBodyMaterial,
    camaroUsesGlb,
    camaroHasTextures,
    getOpponent,
    setOpponent,
    setRivalsLive,
    setTreeLights: environment.setTreeLights,
    resetRacers,
    scoreboard,
    setSpeedFeel: speedFeel.setSpeed01,
  }
}
