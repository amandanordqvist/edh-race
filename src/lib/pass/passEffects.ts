import type { Application, Entity, StandardMaterial } from 'playcanvas'

import { collectCamaroWheels, collectExhaustMaterials } from './camaroRig'
import { createCamaroWheelSpin } from './camaroWheelSpin'
import { createBurnoutSmoke } from './burnoutSmoke'
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
}

/** Fixed local rear tire offsets on the fitted Camaro parent (strip +X forward). */
function attachParentRearAnchors(pc: PlayCanvasNamespace, camaro: Entity): Entity[] {
  const existingLeft = camaro.findByName('camaro-smoke-rl') as Entity | null
  if (existingLeft) {
    const existingRight = camaro.findByName('camaro-smoke-rr') as Entity | null
    return existingRight ? [existingLeft, existingRight] : [existingLeft]
  }

  const left = new pc.Entity('camaro-smoke-rl')
  left.setLocalPosition(-1.35, 0.18, 0.88)
  camaro.addChild(left)

  const right = new pc.Entity('camaro-smoke-rr')
  right.setLocalPosition(-1.35, 0.18, -0.88)
  camaro.addChild(right)

  return [left, right]
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
    isWideView,
  } = opts

  const speedStreaks = createSpeedStreaks({
    pc,
    parent: sceneRoot,
    trackLength,
    quality,
  })

  const wheels = collectCamaroWheels(camaro)
  const wheelSpin = createCamaroWheelSpin({
    app,
    wheels,
    reducedMotion,
  })

  const exhaustMaterials = collectExhaustMaterials(camaro)
  const baseExhaustIntensity = exhaustMaterials.map((material) => material.emissiveIntensity)

  const parentAnchors = attachParentRearAnchors(pc, camaro)

  const burnoutSmoke = createBurnoutSmoke({
    app,
    pc,
    parent: sceneRoot,
    camaro,
    reducedMotion,
    getRearAnchors: () => {
      const fromWheels = wheelSpin.getRearAnchors()
      if (fromWheels.length >= 2) return fromWheels
      return parentAnchors.map((anchor) => {
        const pos = anchor.getPosition()
        return [pos.x, pos.y, pos.z]
      })
    },
  })

  const chuteVfx = createChuteVfx({
    pc,
    parent: sceneRoot,
    camaro,
  })

  let phase: PassPhase = 'idle'
  let raceProgress = 0
  let raceSpeed = 0
  let heroX = 0
  let chuteDeploy01 = 0
  let launchPulse = 0
  let updateHandler: ((dt: number) => void) | null = null

  const baseCamaroRotation = camaro.getLocalEulerAngles().clone()
  const baseEmissive = camaroBodyMaterial.emissiveIntensity

  const onPhase = (next: PassPhase) => {
    phase = next
    burnoutSmoke.onPhase(next)
    wheelSpin.onPhase(next)
    if (next === 'green') {
      launchPulse = 1
    }
    if (next === 'idle' || next === 'staging') {
      chuteDeploy01 = 0
      chuteVfx.reset()
    }
    if (next === 'idle') {
      camaro.setLocalEulerAngles(baseCamaroRotation)
      if (!camaroHasTextures) {
        camaroBodyMaterial.emissiveIntensity = baseEmissive
        camaroBodyMaterial.update()
      }
      speedStreaks.reset()
    }
    if (next === 'finished') {
      if (!camaroHasTextures) {
        camaroBodyMaterial.emissiveIntensity = baseEmissive
        camaroBodyMaterial.update()
      }
      speedStreaks.reset()
    }
  }

  const onRaceFrame = (
    progress01: number,
    speed01: number,
    nextHeroX: number,
    nextChuteDeploy01 = 0,
  ) => {
    raceProgress = progress01
    raceSpeed = speed01
    heroX = nextHeroX
    chuteDeploy01 = nextChuteDeploy01
    wheelSpin.onRaceFrame(progress01, speed01)
  }

  const setStripIntensity = (intensity: number) => {
    stripLightMaterials.forEach((material) => {
      material.emissiveIntensity = intensity
      material.update()
    })
  }

  const update = (dt: number) => {
    if (reducedMotion) return

    launchPulse = Math.max(0, launchPulse - dt * 2.8)

    const time = performance.now() * 0.001
    let stripIntensity = 0.04

    switch (phase) {
      case 'staging':
        stripIntensity = 0.12 + Math.sin(time * 4) * 0.04
        break
      case 'amber':
        stripIntensity = 0.28 + Math.sin(time * 8) * 0.08
        break
      case 'green':
        stripIntensity = 0.85
        break
      case 'racing': {
        const strobe = 18 + raceSpeed * 42
        stripIntensity = 0.28 + raceSpeed * 0.45 + Math.sin(time * strobe) * raceSpeed * 0.08
        const wide = isWideView?.() ?? false
        if (!wide) {
          speedStreaks.update(dt, raceSpeed, heroX)
        } else {
          speedStreaks.reset()
        }
        break
      }
      case 'finished':
        stripIntensity = 0.22
        break
      case 'idle':
        stripIntensity = 0.05 + Math.sin(time * 0.8) * 0.02
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
        material.emissiveIntensity = baseExhaustIntensity[index] + exhaustPulse + Math.sin(time * 14) * 0.12
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

    if (phase === 'racing' || phase === 'finished') {
      // Race-progress wheelie: peaks around 60' (progress ≈ 0.16), settles by ~330'.
      // Reads as a real doorslammer nose-lift rather than a tiny idle rock.
      const wheelieRise = Math.min(1, raceProgress / 0.03)
      const wheelieDecay = Math.max(0, 1 - Math.pow(Math.max(0, raceProgress - 0.03) / 0.2, 1.2))
      const wheelieAmount = wheelieRise * wheelieDecay
      const wheeliePitch = wheelieAmount * 6.5

      const launchPitch = launchPulse > 0 ? launchPulse * 3.5 : 0
      const speedPitch = phase === 'racing' ? -raceSpeed * 1.1 : 0
      const chuteSquat = -chuteDeploy01 * 3.6
      const vibe =
        phase === 'racing'
          ? Math.sin(time * (38 + raceSpeed * 24)) * raceSpeed * 0.25
          : 0

      // Car faces +X: pitch (nose up) is Euler Z, not X (X would roll).
      camaro.setLocalEulerAngles(
        baseCamaroRotation.x,
        baseCamaroRotation.y,
        baseCamaroRotation.z + wheeliePitch + launchPitch + speedPitch + chuteSquat + vibe,
      )

      if (!camaroHasTextures) {
        const glow = baseEmissive + 0.12 + raceSpeed * 0.75 + raceProgress * 0.2
        camaroBodyMaterial.emissiveIntensity = glow
        camaroBodyMaterial.update()
      }
    } else if (launchPulse > 0) {
      camaro.setLocalEulerAngles(
        baseCamaroRotation.x,
        baseCamaroRotation.y,
        baseCamaroRotation.z + launchPulse * 4.5,
      )
    }

    chuteVfx.update(chuteDeploy01)
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
    heroX = 0
    launchPulse = 0
    chuteDeploy01 = 0
    burnoutSmoke.reset()
    wheelSpin.reset()
    chuteVfx.reset()
    setStripIntensity(0.04)
    camaro.setLocalEulerAngles(baseCamaroRotation)
    if (!camaroHasTextures) {
      camaroBodyMaterial.emissiveIntensity = baseEmissive
      camaroBodyMaterial.update()
    }
    speedStreaks.reset()
  }

  const destroy = () => {
    if (updateHandler) {
      app.off('update', updateHandler)
      updateHandler = null
    }
    burnoutSmoke.destroy()
    wheelSpin.destroy()
    chuteVfx.destroy()
    speedStreaks.destroy()
  }

  start()

  return { onPhase, onRaceFrame, reset, destroy }
}
