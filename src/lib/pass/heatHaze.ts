import type { Application, Entity, StandardMaterial } from 'playcanvas'

import { createMaterial, createPrimitive, type PlayCanvasNamespace } from './scenePrimitives'

type HazeRibbon = {
  entity: Entity
  material: StandardMaterial
  offset: [number, number, number]
  phase: number
  baseScale: [number, number, number]
}

type HeatHazeOptions = {
  app: Application
  pc: PlayCanvasNamespace
  parent: Entity
  camaro: Entity
  reducedMotion: boolean
}

/**
 * Subtle heat shimmer behind the rear — not neon, not speed lines.
 * Reads as exhaust/asphalt heat in late-afternoon light.
 */
export function createHeatHaze(opts: HeatHazeOptions) {
  const { app, pc, parent, camaro, reducedMotion } = opts

  const ribbons: HazeRibbon[] = []
  let intensity = 0
  let updateHandler: ((dt: number) => void) | null = null

  for (let i = 0; i < 4; i += 1) {
    const material = createMaterial(pc, {
      diffuse: [0.55, 0.48, 0.4],
      emissive: [0.35, 0.28, 0.2],
      emissiveIntensity: 0.04,
      metalness: 0,
      gloss: 0.02,
    })
    material.opacity = 0
    material.blendType = pc.BLEND_NORMAL
    material.depthWrite = false
    material.cull = pc.CULLFACE_NONE
    material.update()

    const entity = createPrimitive(pc, {
      name: `heat-haze-${i}`,
      type: 'box',
      position: [0, -20, 0],
      scale: [0.01, 0.01, 0.01],
      material,
      castShadows: false,
      receiveShadows: false,
    })
    parent.addChild(entity)

    ribbons.push({
      entity,
      material,
      offset: [-1.7 - i * 0.55, 0.35 + (i % 2) * 0.22, (i % 2 === 0 ? -0.25 : 0.25) * (0.4 + i * 0.1)],
      phase: i * 1.7,
      baseScale: [0.55 + i * 0.12, 0.55 + (i % 3) * 0.1, 0.04],
    })
  }

  const setIntensity = (next: number) => {
    intensity = Math.min(1, Math.max(0, next))
  }

  const update = (dt: number) => {
    if (reducedMotion) return

    const camPos = camaro.getLocalPosition()
    const time = performance.now() * 0.001

    ribbons.forEach((ribbon, index) => {
      if (intensity < 0.02) {
        if (ribbon.material.opacity > 0) {
          ribbon.material.opacity = 0
          ribbon.material.update()
          ribbon.entity.setLocalPosition(0, -20, 0)
        }
        return
      }

      const wave = Math.sin(time * (4.2 + index * 0.7) + ribbon.phase)
      const lift = Math.sin(time * (3.1 + index * 0.5) + ribbon.phase * 0.6) * 0.08
      const sway = Math.cos(time * (2.4 + index * 0.4) + ribbon.phase) * 0.12

      ribbon.entity.setLocalPosition(
        camPos.x + ribbon.offset[0] + wave * 0.08,
        Math.max(0.12, camPos.y + ribbon.offset[1] + lift),
        camPos.z + ribbon.offset[2] + sway,
      )

      const pulse = 1 + wave * 0.12
      ribbon.entity.setLocalScale(
        ribbon.baseScale[0] * pulse * (0.85 + intensity * 0.4),
        ribbon.baseScale[1] * (1 + Math.abs(wave) * 0.2) * (0.7 + intensity * 0.5),
        ribbon.baseScale[2],
      )

      ribbon.material.opacity = (0.04 + intensity * 0.1) * (0.75 + wave * 0.15)
      ribbon.material.emissiveIntensity = 0.03 + intensity * 0.08
      ribbon.material.update()
    })

    void dt
  }

  const reset = () => {
    intensity = 0
    ribbons.forEach((ribbon) => {
      ribbon.material.opacity = 0
      ribbon.material.update()
      ribbon.entity.setLocalPosition(0, -20, 0)
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
    ribbons.forEach((ribbon) => ribbon.entity.destroy())
    ribbons.length = 0
  }

  start()

  return { setIntensity, reset, destroy }
}
