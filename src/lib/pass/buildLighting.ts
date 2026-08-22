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
    color: new pc.Color(1.0, 0.94, 0.82),
    intensity: ibl ? (high ? 1.35 : 1.15) : high ? 2.45 : 2.05,
    castShadows: true,
    shadowDistance: high ? 90 : 70,
    shadowResolution: high ? 2048 : 1024,
    shadowBias: 0.022,
    normalOffsetBias: 0.028,
    shadowType: pc.SHADOW_PCF3_32F,
  })
  keyLight.setEulerAngles(52, 48, 0)
  sceneRoot.addChild(keyLight)

  if (ibl) {
    const fillLight = new pc.Entity('sky-fill')
    fillLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.55, 0.68, 0.9),
      intensity: high ? 0.22 : 0.16,
      castShadows: false,
    })
    fillLight.setEulerAngles(28, -150, 0)
    sceneRoot.addChild(fillLight)
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

type BloomFrame = {
  bloom: { intensity: number; blurLevel: number; enabled?: boolean }
  motionBlur?: { intensity?: number; enabled?: boolean }
  rendering: { samples: number; toneMapping?: number }
  update: () => void
}

export type PassSpeedFeel = {
  setSpeed01: (speed01: number) => void
}

/**
 * Restrained bloom so tree lenses read as lights. Motion blur ramps with
 * speed so the strip streaks while the chase car stays relatively sharp.
 */
export function attachPassBloom(opts: BloomOptions): PassSpeedFeel {
  const { app, pc, camera, quality } = opts
  const cameraComponent = camera.camera
  if (!cameraComponent || quality !== 'high') {
    return { setSpeed01: () => undefined }
  }

  const CameraFrame = (
    pc as unknown as { CameraFrame?: new (application: Application, cam: typeof cameraComponent) => BloomFrame }
  ).CameraFrame
  if (!CameraFrame) {
    return { setSpeed01: () => undefined }
  }

  try {
    const frame = new CameraFrame(app, cameraComponent)
    frame.rendering.samples = 4
    frame.bloom.intensity = 0.055
    frame.bloom.blurLevel = 4
    if (frame.motionBlur) {
      frame.motionBlur.enabled = false
      frame.motionBlur.intensity = 0
    }
    if ('TONEMAP_ACES2' in pc) {
      frame.rendering.toneMapping = (pc as unknown as { TONEMAP_ACES2: number }).TONEMAP_ACES2
    }
    frame.update()

    return {
      setSpeed01: (speed01: number) => {
        if (!frame.motionBlur) return
        const feel = Math.max(0, (speed01 - 0.18) / 0.82)
        frame.motionBlur.enabled = feel > 0.04
        frame.motionBlur.intensity = feel * 0.28
        frame.update()
      },
    }
  } catch (error) {
    console.warn('[pass] CameraFrame bloom unavailable', error)
    return { setSpeed01: () => undefined }
  }
}
