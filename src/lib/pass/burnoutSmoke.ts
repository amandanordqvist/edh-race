import type { Application, Entity, StandardMaterial } from 'playcanvas'

import { createMaterial, createPrimitive, type PlayCanvasNamespace } from './scenePrimitives'
import type { PassPhase } from './types'

type SmokePuff = {
  entity: Entity
  material: StandardMaterial
  age: number
  life: number
  baseScale: number
  drift: [number, number, number]
  kind: 'tire' | 'dust'
}

type BurnoutSmokeOptions = {
  app: Application
  pc: PlayCanvasNamespace
  parent: Entity
  camaro: Entity
  reducedMotion: boolean
  getRearAnchors?: () => [number, number, number][]
}

const POOL_SIZE = 36

export function createBurnoutSmoke(opts: BurnoutSmokeOptions) {
  const { app, pc, parent, camaro, reducedMotion, getRearAnchors } = opts

  const pool: SmokePuff[] = []
  let phase: PassPhase = 'idle'
  let spawnTimer = 0
  let poolIndex = 0
  let raceProgress = 0
  let raceSpeed = 0
  let launchBurst = 0
  let updateHandler: ((dt: number) => void) | null = null

  for (let i = 0; i < POOL_SIZE; i += 1) {
    const material = createMaterial(pc, {
      diffuse: [0.72, 0.74, 0.76],
      emissive: [0.28, 0.3, 0.32],
      emissiveIntensity: 0.05,
      metalness: 0,
      gloss: 0.02,
    })
    material.opacity = 0
    material.blendType = pc.BLEND_NORMAL
    material.depthWrite = false
    material.update()

    const entity = createPrimitive(pc, {
      name: `burnout-smoke-${i}`,
      type: 'sphere',
      position: [0, -20, 0],
      scale: [0.01, 0.01, 0.01],
      material,
      castShadows: false,
      receiveShadows: false,
    })
    parent.addChild(entity)

    pool.push({
      entity,
      material,
      age: 999,
      life: 1,
      baseScale: 1,
      drift: [0, 0, 0],
      kind: 'tire',
    })
  }

  const spawnPuff = (side: -1 | 1, intensity: number, kind: 'tire' | 'dust' = 'tire') => {
    const puff = pool[poolIndex % POOL_SIZE]
    poolIndex += 1

    const anchors = getRearAnchors?.() ?? []
    const anchor =
      side < 0 ? (anchors[0] ?? null) : (anchors[1] ?? anchors[0] ?? null)

    puff.age = 0
    puff.kind = kind
    puff.life = kind === 'dust' ? 0.55 + Math.random() * 0.35 : 1.0 + Math.random() * 0.55
    puff.baseScale =
      kind === 'dust'
        ? 0.18 + intensity * 0.12 + Math.random() * 0.08
        : 0.34 + intensity * 0.22 + Math.random() * 0.12
    puff.drift =
      kind === 'dust'
        ? [
            -0.4 - Math.random() * 0.8,
            0.15 + Math.random() * 0.25,
            side * (0.05 + Math.random() * 0.15),
          ]
        : [
            0.15 + Math.random() * 0.4,
            0.55 + Math.random() * 0.7,
            side * (0.08 + Math.random() * 0.2),
          ]

    if (anchor) {
      puff.entity.setLocalPosition(
        anchor[0] + (Math.random() - 0.5) * 0.08,
        kind === 'dust' ? 0.06 + Math.random() * 0.04 : anchor[1] + 0.04 + Math.random() * 0.05,
        anchor[2] + side * (kind === 'dust' ? 0.12 : 0.08),
      )
    } else {
      const camPos = camaro.getLocalPosition()
      puff.entity.setLocalPosition(
        camPos.x - 1.35,
        kind === 'dust' ? 0.08 : 0.18 + Math.random() * 0.08,
        side * (0.88 + Math.random() * 0.1),
      )
    }

    const scale = puff.baseScale
    puff.entity.setLocalScale(scale, scale * (kind === 'dust' ? 0.35 : 0.7), scale)
    puff.material.diffuse.set(
      kind === 'dust' ? 0.22 : 0.72,
      kind === 'dust' ? 0.2 : 0.74,
      kind === 'dust' ? 0.18 : 0.76,
    )
    puff.material.opacity = kind === 'dust' ? 0.18 + intensity * 0.1 : 0.2 + intensity * 0.1
    puff.material.update()
  }

  const update = (dt: number) => {
    if (reducedMotion) return

    launchBurst = Math.max(0, launchBurst - dt * 1.6)

    const burnoutActive = phase === 'staging' || phase === 'amber'
    const launchActive = launchBurst > 0.05
    // Thin tire smoke through the first ~60' so launch still feels dirty.
    const earlyRace = phase === 'racing' && raceProgress < 0.18 && raceSpeed > 0.05

    let spawnRate = 0
    if (burnoutActive) {
      spawnRate = phase === 'staging' ? 0.055 : 0.08
    } else if (launchActive) {
      spawnRate = 0.028
    } else if (earlyRace) {
      spawnRate = 0.07 + raceSpeed * 0.04
    }

    if (spawnRate > 0) {
      spawnTimer += dt
      while (spawnTimer >= spawnRate) {
        spawnTimer -= spawnRate
        const intensity = launchActive
          ? 0.85 + launchBurst * 0.4
          : earlyRace
            ? 0.45 + raceSpeed * 0.35
            : phase === 'amber'
              ? 1
              : 0.75
        spawnPuff(-1, intensity, 'tire')
        spawnPuff(1, intensity, 'tire')
        if (launchActive || (earlyRace && Math.random() > 0.45)) {
          spawnPuff(-1, intensity * 0.85, 'dust')
          spawnPuff(1, intensity * 0.85, 'dust')
        }
      }
    } else {
      spawnTimer = 0
    }

    pool.forEach((puff) => {
      if (puff.age >= puff.life) {
        if (puff.material.opacity > 0) {
          puff.material.opacity = 0
          puff.material.update()
          puff.entity.setLocalPosition(0, -20, 0)
        }
        return
      }

      puff.age += dt
      const t = puff.age / puff.life
      const pos = puff.entity.getLocalPosition()
      puff.entity.setLocalPosition(
        pos.x + puff.drift[0] * dt,
        pos.y + puff.drift[1] * dt,
        pos.z + puff.drift[2] * dt,
      )

      const grow =
        puff.kind === 'dust'
          ? puff.baseScale * (1 + t * 1.1)
          : puff.baseScale * (1 + t * 1.8)
      puff.entity.setLocalScale(
        grow,
        grow * (puff.kind === 'dust' ? 0.32 : 0.68),
        grow * (puff.kind === 'dust' ? 1.15 : 1.02),
      )

      const fadeIn = Math.min(1, puff.age / 0.12)
      const fadeOut = 1 - Math.pow(t, 1.4)
      const peak = puff.kind === 'dust' ? 0.22 : 0.28
      puff.material.opacity = peak * fadeIn * fadeOut
      puff.material.update()
    })
  }

  const onPhase = (next: PassPhase) => {
    phase = next
    if (next === 'green') {
      launchBurst = 1
      // Immediate burst so the launch reads before the first update ticks.
      for (let i = 0; i < 6; i += 1) {
        spawnPuff(-1, 1.1, i % 2 === 0 ? 'tire' : 'dust')
        spawnPuff(1, 1.1, i % 2 === 0 ? 'tire' : 'dust')
      }
    }
    if (next === 'idle' || next === 'finished') {
      spawnTimer = 0
      launchBurst = 0
    }
  }

  const onRaceFrame = (progress01: number, speed01: number) => {
    raceProgress = progress01
    raceSpeed = speed01
  }

  const reset = () => {
    phase = 'idle'
    spawnTimer = 0
    raceProgress = 0
    raceSpeed = 0
    launchBurst = 0
    pool.forEach((puff) => {
      puff.age = 999
      puff.material.opacity = 0
      puff.material.update()
      puff.entity.setLocalPosition(0, -20, 0)
    })
  }

  const start = () => {
    if (updateHandler) return
    updateHandler = (dt) => update(dt)
    app.on('update', updateHandler)
  }

  const destroy = () => {
    if (updateHandler) {
      app.off('update', updateHandler)
      updateHandler = null
    }
    pool.forEach((puff) => {
      puff.entity.destroy()
    })
    pool.length = 0
  }

  start()

  return { onPhase, onRaceFrame, reset, destroy }
}
