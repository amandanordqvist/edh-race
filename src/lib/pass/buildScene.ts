import type { Application, Entity, Texture, Vec3 } from 'playcanvas'

import { buildPassEnvironment, type TreeMode } from './buildEnvironment'
import { attachCamaroDecals } from './attachCamaroDecals'
import { buildPassVehicles, type VehicleId } from './buildVehicles'
import { loadCamaroGlb } from './loadCamaroGlb'
import { loadFittedGlb } from './loadFittedGlb'
import { createScoreboard, type PassScoreboard } from './createScoreboard'
import { loadTextureAsset } from './loadTextureAsset'
import { LANE_FAR_Z, LANE_NEAR_Z } from './passLayout'
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
  scoreboard: PassScoreboard
}

export async function buildPassScene(
  app: Application,
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): Promise<PassScene> {
  const sceneRoot = new pc.Entity('pass-scene')
  app.root.addChild(sceneRoot)

  // Clear daytime strip: blue sky fill, haze that stays sky-coloured.
  app.scene.ambientLight = new pc.Color(0.38, 0.46, 0.58)
  app.scene.fog.type = pc.FOG_LINEAR
  app.scene.fog.color = new pc.Color(0.62, 0.76, 0.92)
  app.scene.fog.start = quality === 'high' ? 72 : 48
  app.scene.fog.end = quality === 'high' ? 210 : 160

  // Barrier boards stay tone-only — skip logo fetches until body-mapped decals exist.
  const sponsorTextures: import('./buildBarrierBoards').SponsorTextureEntry[] = []

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
      target: { kind: 'height', meters: 4.6 },
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
  // Opponent slightly ahead and further left — full silhouette, lower visual priority.
  placeOnLane(racers.f1, 1.85, LANE_FAR_Z - 0.55)
  placeOnLane(racers.jet, 1.6, LANE_FAR_Z - 0.55)

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

  const skyClear = new pc.Color(0.52, 0.7, 0.92)
  const camera = new pc.Entity('pass-camera')
  camera.addComponent('camera', {
    clearColor: skyClear,
    fov: quality === 'high' ? 44 : 50,
    nearClip: 0.2,
    farClip: environment.trackLength * 3,
  })
  const inspectYaw = (14 * Math.PI) / 180
  const inspectPitch = (6 * Math.PI) / 180
  const inspectRadius = 7.6
  const heroX = startPositions.camaro.x
  const heroZ = startPositions.camaro.z
  const cosPitch = Math.cos(inspectPitch)
  camera.setLocalPosition(
    heroX + Math.sin(inspectYaw) * cosPitch * inspectRadius,
    0.72 + Math.sin(inspectPitch) * inspectRadius,
    heroZ + Math.cos(inspectYaw) * cosPitch * inspectRadius,
  )
  camera.lookAt(heroX + 1.2, 0.72, heroZ)
  sceneRoot.addChild(camera)

  const high = quality === 'high'

  // High daytime sun from the left, sky fill from the right.
  const keyLight = new pc.Entity('key-light')
  keyLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(1.0, 0.94, 0.82),
    intensity: high ? 2.45 : 2.05,
    castShadows: true,
    shadowDistance: high ? 90 : 70,
    shadowResolution: high ? 2048 : 1024,
    shadowBias: 0.06,
    normalOffsetBias: 0.055,
    shadowType: pc.SHADOW_PCF3_32F,
  })
  keyLight.setEulerAngles(46, 52, 0)
  sceneRoot.addChild(keyLight)

  const fillLight = new pc.Entity('fill-light')
  fillLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.55, 0.7, 0.92),
    intensity: high ? 0.72 : 0.55,
    castShadows: false,
  })
  fillLight.setEulerAngles(38, -155, 0)
  sceneRoot.addChild(fillLight)

  const groundBounce = new pc.Entity('ground-bounce')
  groundBounce.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.18, 0.17, 0.15),
    intensity: high ? 0.12 : 0.09,
    castShadows: false,
  })
  groundBounce.setEulerAngles(-58, 18, 0)
  sceneRoot.addChild(groundBounce)

  const rimLight = new pc.Entity('rim-light')
  rimLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.7, 0.84, 1.0),
    intensity: high ? 0.85 : 0.58,
    castShadows: false,
  })
  rimLight.setEulerAngles(8, -48, 0)
  sceneRoot.addChild(rimLight)

  const contactFill = new pc.Entity('contact-fill')
  contactFill.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.42, 0.48, 0.58),
    intensity: high ? 0.22 : 0.16,
    castShadows: false,
  })
  contactFill.setEulerAngles(78, 0, 0)
  sceneRoot.addChild(contactFill)

  const scoreboard = createScoreboard(app, pc, sceneRoot)

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
    scoreboard.setOpponent(next)
  }

  const getOpponent = () => opponent

  const resetRacers = () => {
    ;(Object.keys(racers) as VehicleId[]).forEach((id) => {
      racers[id].setLocalPosition(startPositions[id])
      racers[id].setLocalEulerAngles(startRotations[id])
    })
    applyOpponentVisibility()
    scoreboard.reset()
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
    scoreboard,
  }
}
