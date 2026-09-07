import type { Application, Entity } from 'playcanvas'

import type { PlayCanvasNamespace } from './scenePrimitives'
import type { PassQuality } from './types'

type LightingKind = 'ibl' | 'procedural'

type SunLightsOptions = {
  pc: PlayCanvasNamespace
  sceneRoot: Entity
  quality: PassQuality
  kind: LightingKind
}

type BloomOptions = {
  app: Application
  pc: PlayCanvasNamespace
  camera: Entity
  quality: PassQuality
}

/**
 * One hard sun for contact shadows. IBL scenes skip the extra fills that
 * flattened the Camaro into the asphalt.
 */
export function attachPassSunLights(opts: SunLightsOptions): void {
  const { pc, sceneRoot, quality, kind } = opts
  const high = quality === 'high'
  const ibl = kind === 'ibl'

  const keyLight = new pc.Entity('key-light')
  keyLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(1.0, 0.96, 0.90),
    intensity: ibl ? (high ? 1.4 : 1.2) : high ? 2.45 : 2.05,
    castShadows: true,
    shadowDistance: high ? 90 : 70,
    shadowResolution: high ? 2048 : 1024,
    shadowBias: 0.02,
    normalOffsetBias: 0.02,
    shadowType: pc.SHADOW_PCF5_32F,
  })
  keyLight.setEulerAngles(40, -35, 0)
  sceneRoot.addChild(keyLight)

  if (ibl) {
    const fillLight = new pc.Entity('sky-fill')
    fillLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.68, 0.79, 1.0),
      intensity: high ? 0.7 : 0.45,
      castShadows: false,
    })
    fillLight.setEulerAngles(55, 145, 0)
    sceneRoot.addChild(fillLight)

    const frontFill = new pc.Entity('front-fill')
    frontFill.addComponent('light', {
      type: 'directional',
      color: new pc.Color(1.0, 1.0, 1.0),
      intensity: high ? 0.45 : 0.3,
      castShadows: false,
    })
    frontFill.setEulerAngles(-20, 60, 0)
    sceneRoot.addChild(frontFill)
    return
  }

  const fillLight = new pc.Entity('fill-light')
  fillLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.55, 0.7, 0.92),
    intensity: high ? 0.72 : 0.55,
    castShadows: false,
  })
  fillLight.setEulerAngles(38, -155, 0)
  sceneRoot.addChild(fillLight)

  const rimLight = new pc.Entity('rim-light')
  rimLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.7, 0.84, 1.0),
    intensity: high ? 0.85 : 0.58,
    castShadows: false,
  })
  rimLight.setEulerAngles(8, -48, 0)
  sceneRoot.addChild(rimLight)
}

export type PassSpeedFeel = {
  setSpeed01: (speed01: number) => void
}

/**
 * CameraFrame HDR crushed the PureSky skybox to black on some GPUs and
 * flattened the Camaro paint. Skip it — the key light and IBL already
 * carry the strip.
 */
export function attachPassBloom(opts: BloomOptions): PassSpeedFeel {
  void opts
  return { setSpeed01: () => undefined }
}
