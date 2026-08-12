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
}

type BurnoutSmokeOptions = {
  app: Application
  pc: PlayCanvasNamespace
  parent: Entity
  camaro: Entity
  reducedMotion: boolean
  getRearAnchors?: () => [number, number, number][]
}

const POOL_SIZE = 22

export function createBurnoutSmoke(opts: BurnoutSmokeOptions) {
  const { app, pc, parent, camaro, reducedMotion, getRearAnchors } = opts

  const pool: SmokePuff[] = []
  let phase: PassPhase = 'idle'
  let spawnTimer = 0
  let poolIndex = 0
  let updateHandler: ((dt: number) => void) | null = null

  for (let i = 0; i < POOL_SIZE; i += 1) {
    const material = createMaterial(pc, {
      diffuse: [0.78, 0.8, 0.82],
      emissive: [0.42, 0.44, 0.46],
      emissiveIntensity: 0.08,
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
    })
  }

  const spawnPuff = (side: -1 | 1, intensity: number) => {
    const puff = pool[poolIndex % POOL_SIZE]
    poolIndex += 1

    const anchors = getRearAnchors?.() ?? []
    const anchor =
      side < 0
        ? (anchors[0] ?? null)
        : (anchors[1] ?? anchors[0] ?? null)

    puff.age = 0
    puff.life = 1.1 + Math.random() * 0.55
    puff.baseScale = 0.38 + intensity * 0.22 + Math.random() * 0.12
    puff.drift = [
      0.25 + Math.random() * 0.45,
      0.75 + Math.random() * 0.85,
      side * (0.1 + Math.random() * 0.22),
    ]

    if (anchor) {
      puff.entity.setLocalPosition(
        anchor[0] + (Math.random() - 0.5) * 0.06,
        anchor[1] + 0.04 + Math.random() * 0.06,
        anchor[2] + side * 0.08,
      )
    } else {
      const camPos = camaro.getLocalPosition()
      puff.entity.setLocalPosition(
        camPos.x - 1.35,
        0.18 + Math.random() * 0.08,
        side * (0.88 + Math.random() * 0.1),
      )
    }
    const scale = puff.baseScale
    puff.entity.setLocalScale(scale, scale * 0.7, scale)
    puff.material.opacity = 0.22 + intensity * 0.1
    puff.material.update()
  }

  const update = (dt: number) => {
    if (reducedMotion) return

    const active = phase === 'staging' || phase === 'amber'
    const spawnRate = phase === 'staging' ? 0.055 : phase === 'amber' ? 0.08 : 0

    if (active && spawnRate > 0) {
      spawnTimer += dt
      while (spawnTimer >= spawnRate) {
        spawnTimer -= spawnRate
        spawnPuff(-1, phase === 'amber' ? 1 : 0.75)
        spawnPuff(1, phase === 'amber' ? 1 : 0.75)
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

      const grow = puff.baseScale * (1 + t * 1.8)
      puff.entity.setLocalScale(grow, grow * 0.68, grow * 1.02)

      const fadeIn = Math.min(1, puff.age / 0.14)
      const fadeOut = 1 - Math.pow(t, 1.45)
      puff.material.opacity = 0.28 * fadeIn * fadeOut
      puff.material.update()
    })
  }

  const onPhase = (next: PassPhase) => {
    phase = next
    if (next === 'green' || next === 'idle' || next === 'finished') {
      spawnTimer = 0
    }
  }

  const reset = () => {
    phase = 'idle'
    spawnTimer = 0
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

  return { onPhase, reset, destroy }
}
