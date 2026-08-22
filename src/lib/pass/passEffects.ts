import type { Application, Entity, StandardMaterial } from 'playcanvas'

import { collectCamaroWheels, collectExhaustMaterials } from './camaroRig'
import { createCamaroWheelSpin } from './camaroWheelSpin'
import { createChuteVfx } from './chuteVfx'
import { createSpeedStreaks } from './speedStreaks'
import type { PassPhase, PassQuality } from './types'
import type { PlayCanvasNamespace } from './scenePrimitives'

type PassEffectsOptions = {
  app: Application
  pc: PlayCanvasNamespace
  sceneRoot: Entity
  trackLength: number
  quality: PassQuality
  stripLightMaterials: StandardMaterial[]
  camaro: Entity
  camaroBodyMaterial: StandardMaterial
  /** When true, skip body emissive wash that ruins textured Tripo paint. */
  camaroHasTextures: boolean
  reducedMotion: boolean
  isWideView?: () => boolean
  setSpeedFeel?: (speed01: number) => void
}

export function createPassEffects(opts: PassEffectsOptions) {
  const {
    app,
    pc,
    sceneRoot,
    trackLength,
    quality,
    stripLightMaterials,
    camaro,
    camaroBodyMaterial,
    camaroHasTextures,
    reducedMotion,
    setSpeedFeel,
  } = opts

  const wheels = collectCamaroWheels(camaro)
  const wheelSpin = createCamaroWheelSpin({
    app,
    wheels,
    reducedMotion,
  })

  const exhaustMaterials = collectExhaustMaterials(camaro)
  const baseExhaustIntensity = exhaustMaterials.map((material) => material.emissiveIntensity)

  // Smoke / heat-haze / rubber particles temporarily disabled — they read as
  // large brown spheres and muddy the start-line composition.
  const chuteVfx = createChuteVfx({
    pc,
    parent: sceneRoot,
    camaro,
  })
  const speedStreaks = createSpeedStreaks({
    pc,
    parent: sceneRoot,
    trackLength,
    quality,
  })

  let phase: PassPhase = 'idle'
  let raceProgress = 0
  let raceSpeed = 0
  let chuteDeploy01 = 0
  let launchPulse = 0
  let updateHandler: ((dt: number) => void) | null = null

  const baseCamaroRotation = camaro.getLocalEulerAngles().clone()
  const baseCamaroY = camaro.getLocalPosition().y
  const baseEmissive = camaroBodyMaterial.emissiveIntensity

  const onPhase = (next: PassPhase) => {
    phase = next
    wheelSpin.onPhase(next)
    if (next === 'green') {
      launchPulse = 1
    }
    if (next === 'idle' || next === 'staging') {
      chuteDeploy01 = 0
      chuteVfx.reset()
      speedStreaks.reset()
      setSpeedFeel?.(0)
    }
    if (next === 'idle') {
      const pos = camaro.getLocalPosition()
      camaro.setLocalPosition(pos.x, baseCamaroY, pos.z)
      camaro.setLocalEulerAngles(baseCamaroRotation)
      if (!camaroHasTextures) {
        camaroBodyMaterial.emissiveIntensity = baseEmissive
        camaroBodyMaterial.update()
      }
    }
    if (next === 'finished') {
      raceSpeed = 0
      chuteDeploy01 = 1
      setSpeedFeel?.(0)
      if (!camaroHasTextures) {
        camaroBodyMaterial.emissiveIntensity = baseEmissive
        camaroBodyMaterial.update()
      }
    }
  }

  const onRaceFrame = (
    progress01: number,
    speed01: number,
    nextHeroX: number,
    nextChuteDeploy01 = 0,
  ) => {
    void nextHeroX
    raceProgress = progress01
    raceSpeed = speed01
    chuteDeploy01 = nextChuteDeploy01
    wheelSpin.onRaceFrame(progress01, speed01)
    if (!reducedMotion) setSpeedFeel?.(speed01)
  }

  const setStripIntensity = (intensity: number) => {
    stripLightMaterials.forEach((material) => {
      material.emissiveIntensity = intensity
      material.update()
    })
  }

  const update = (dt: number) => {
    if (reducedMotion) return

    launchPulse = Math.max(0, launchPulse - dt * 2.4)

    const time = performance.now() * 0.001
    let stripIntensity = 0.04

    switch (phase) {
      case 'staging':
        stripIntensity = 0.08 + Math.sin(time * 4) * 0.03
        break
      case 'amber':
        stripIntensity = 0.18 + Math.sin(time * 8) * 0.05
        break
      case 'green':
        stripIntensity = 0.45
        break
      case 'racing':
        stripIntensity = 0.12 + raceSpeed * 0.18
        break
      case 'finished':
        stripIntensity = 0.1
        break
      case 'idle':
        stripIntensity = 0.04 + Math.sin(time * 0.8) * 0.015
        break
      default: {
        const exhaustiveCheck: never = phase
        void exhaustiveCheck
      }
    }

    setStripIntensity(stripIntensity)

    if (phase === 'staging' || phase === 'amber') {
      const exhaustPulse = phase === 'amber' ? 0.95 : 0.55
      exhaustMaterials.forEach((material, index) => {
        material.emissiveIntensity =
          baseExhaustIntensity[index] + exhaustPulse + Math.sin(time * 14) * 0.12
        material.update()
      })
    } else if (phase === 'racing' && raceSpeed > 0.2) {
      exhaustMaterials.forEach((material, index) => {
        material.emissiveIntensity = baseExhaustIntensity[index] + 0.25 + raceSpeed * 0.55
        material.update()
      })
    } else if (phase === 'idle' || phase === 'finished') {
      exhaustMaterials.forEach((material, index) => {
        material.emissiveIntensity = baseExhaustIntensity[index]
        material.update()
      })
    }

    if (phase === 'racing' || phase === 'finished' || launchPulse > 0) {
      const squat = launchPulse * 0.06
      const wheelieRise = Math.min(1, raceProgress / 0.04)
      const wheelieDecay = Math.max(0, 1 - Math.pow(Math.max(0, raceProgress - 0.04) / 0.32, 1.15))
      const wheelieAmount =
        phase === 'racing' || phase === 'finished' || launchPulse > 0.2
          ? Math.max(launchPulse * 0.55, wheelieRise * wheelieDecay)
          : 0
      const wheeliePitch = wheelieAmount * 13.5
      const launchPitch = launchPulse > 0 ? launchPulse * 8.5 : 0
      const speedPitch = phase === 'racing' ? -raceSpeed * 0.7 : 0
      const chuteSquat = -chuteDeploy01 * 4.2
      const vibe =
        phase === 'racing'
          ? Math.sin(time * (38 + raceSpeed * 24)) * raceSpeed * 0.25
          : 0

      const pos = camaro.getLocalPosition()
      camaro.setLocalPosition(pos.x, baseCamaroY - squat - wheelieAmount * 0.03, pos.z)
      camaro.setLocalEulerAngles(
        baseCamaroRotation.x,
        baseCamaroRotation.y,
        baseCamaroRotation.z + wheeliePitch + launchPitch + speedPitch + chuteSquat + vibe,
      )

      if (!camaroHasTextures && (phase === 'racing' || phase === 'finished')) {
        const glow = baseEmissive + 0.12 + raceSpeed * 0.75 + raceProgress * 0.2
        camaroBodyMaterial.emissiveIntensity = glow
        camaroBodyMaterial.update()
      }
    }

    chuteVfx.update(chuteDeploy01)
    speedStreaks.update(dt, raceSpeed, camaro.getLocalPosition().x)
  }

  const start = () => {
    if (updateHandler) return
    updateHandler = (dt: number) => update(dt)
    app.on('update', updateHandler)
  }

  const reset = () => {
    phase = 'idle'
    raceProgress = 0
    raceSpeed = 0
    launchPulse = 0
    chuteDeploy01 = 0
    wheelSpin.reset()
    chuteVfx.reset()
    speedStreaks.reset()
    setSpeedFeel?.(0)
    setStripIntensity(0.04)
    const pos = camaro.getLocalPosition()
    camaro.setLocalPosition(pos.x, baseCamaroY, pos.z)
    camaro.setLocalEulerAngles(baseCamaroRotation)
    if (!camaroHasTextures) {
      camaroBodyMaterial.emissiveIntensity = baseEmissive
      camaroBodyMaterial.update()
    }
  }

  const destroy = () => {
    if (updateHandler) {
      app.off('update', updateHandler)
      updateHandler = null
    }
    wheelSpin.destroy()
    chuteVfx.destroy()
    speedStreaks.destroy()
  }

  start()

  return { onPhase, onRaceFrame, reset, destroy }
}
