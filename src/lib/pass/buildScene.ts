import type { Application, Entity, Vec3 } from 'playcanvas'

import { buildPassEnvironment } from './buildEnvironment'
import { buildPassVehicles, type VehicleId } from './buildVehicles'
import type { PassQuality } from './types'

type PlayCanvasNamespace = typeof import('playcanvas')
type TreeMode = 'off' | 'stage' | 'amber' | 'green'

export type PassScene = {
  camera: Entity
  treeBulbs: {
    stage: Entity[]
    amber: Entity[]
    green: Entity[]
  }
  racers: Record<VehicleId, Entity>
  trackLength: number
  setTreeLights: (mode: TreeMode) => void
  resetRacers: () => void
}

export function buildPassScene(
  app: Application,
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): PassScene {
  const sceneRoot = new pc.Entity('pass-scene')
  app.root.addChild(sceneRoot)
  app.scene.ambientLight = new pc.Color(0.12, 0.13, 0.16)

  const environment = buildPassEnvironment(pc, sceneRoot, quality)
  const racers = buildPassVehicles(pc, quality)

  const startPositions: Record<VehicleId, Vec3> = {
    camaro: racers.camaro.getLocalPosition().clone(),
    f1: racers.f1.getLocalPosition().clone(),
    jet: racers.jet.getLocalPosition().clone(),
  }

  Object.values(racers).forEach((racer) => {
    sceneRoot.addChild(racer)
  })

  const camera = new pc.Entity('pass-camera')
  camera.addComponent('camera', {
    clearColor: new pc.Color(0.027, 0.035, 0.05),
    fov: quality === 'high' ? 48 : 54,
    nearClip: 0.5,
    farClip: environment.trackLength * 3,
  })
  // Wide establishing shot — full strip readable at idle
  camera.setLocalPosition(environment.trackLength * 0.28, 38, 52)
  camera.lookAt(environment.trackLength * 0.48, 0.4, 0)
  sceneRoot.addChild(camera)

  const keyLight = new pc.Entity('key-light')
  keyLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.82, 0.86, 0.95),
    intensity: quality === 'high' ? 1.55 : 1.2,
    castShadows: quality === 'high',
    shadowDistance: 55,
    shadowBias: 0.2,
    normalOffsetBias: 0.06,
  })
  keyLight.setEulerAngles(36, -32, 0)
  sceneRoot.addChild(keyLight)

  if (quality === 'high') {
    const fillLight = new pc.Entity('fill-light')
    fillLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.16, 0.28, 0.55),
      intensity: 0.62,
      castShadows: false,
    })
    fillLight.setEulerAngles(18, 140, 0)
    sceneRoot.addChild(fillLight)

    const rimLight = new pc.Entity('rim-light')
    rimLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.25, 0.35, 0.65),
      intensity: 0.35,
      castShadows: false,
    })
    rimLight.setEulerAngles(10, -120, 0)
    sceneRoot.addChild(rimLight)
  }

  const resetRacers = () => {
    ;(Object.keys(racers) as VehicleId[]).forEach((id) => {
      racers[id].setLocalPosition(startPositions[id])
      racers[id].setLocalEulerAngles(0, 0, 0)
    })
  }

  resetRacers()

  return {
    camera,
    treeBulbs: environment.treeBulbs,
    racers,
    trackLength: environment.trackLength,
    setTreeLights: environment.setTreeLights,
    resetRacers,
  }
}
