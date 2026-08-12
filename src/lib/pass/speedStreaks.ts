import type { Entity } from 'playcanvas'

import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'

type SpeedStreak = {
  entity: Entity
  laneZ: number
}

type SpeedStreaksOptions = {
  pc: PlayCanvasNamespace
  parent: Entity
  trackLength: number
  quality: PassQuality
}

export function createSpeedStreaks(opts: SpeedStreaksOptions) {
  const { pc, parent, trackLength, quality } = opts
  // Restrained: fewer streaks, softer emissive — skip entirely on low quality.
  if (quality === 'low') {
    return {
      update: () => undefined,
      reset: () => undefined,
      destroy: () => undefined,
    }
  }

  const count = 8
  const laneZs = [-4.4, -2.55, 2.55, 4.4]

  const streakMaterial = createMaterial(pc, {
    diffuse: [0.55, 0.62, 0.78],
    emissive: [0.35, 0.45, 0.7],
    emissiveIntensity: 0,
    metalness: 0,
    gloss: 0.06,
  })

  const streaks: SpeedStreak[] = []

  for (let i = 0; i < count; i += 1) {
    const laneZ = laneZs[i % laneZs.length] ?? 0
    const entity = createPrimitive(pc, {
      name: `speed-streak-${i}`,
      type: 'box',
      position: [6 + (i / count) * trackLength * 0.82, 0.16 + (i % 3) * 0.08, laneZ],
      scale: [2.2 + (i % 4) * 0.6, 0.012, 0.028],
      material: streakMaterial,
      castShadows: false,
      receiveShadows: false,
    })
    entity.enabled = false
    parent.addChild(entity)
    streaks.push({ entity, laneZ })
  }

  const update = (dt: number, speed01: number, heroX: number) => {
    const active = speed01 > 0.12
    streakMaterial.emissiveIntensity = active ? 0.06 + speed01 * 0.22 : 0
    streakMaterial.update()

    if (!active) {
      streaks.forEach(({ entity }) => {
        entity.enabled = false
      })
      return
    }

    const scrollRate = 80 + speed01 * 200

    streaks.forEach(({ entity, laneZ }, index) => {
      entity.enabled = true
      const pos = entity.getLocalPosition()
      let x = pos.x - scrollRate * dt

      if (x < heroX - 18) {
        x = heroX + 22 + (index % 5) * 7
      }

      entity.setLocalPosition(x, pos.y, laneZ)
    })
  }

  const reset = () => {
    streaks.forEach(({ entity, laneZ }, index) => {
      entity.enabled = false
      entity.setLocalPosition(8 + (index / streaks.length) * trackLength * 0.78, 0.18, laneZ)
    })
    streakMaterial.emissiveIntensity = 0
    streakMaterial.update()
  }

  const destroy = () => {
    streaks.forEach(({ entity }) => {
      entity.destroy()
    })
    streaks.length = 0
  }

  return { update, reset, destroy }
}
