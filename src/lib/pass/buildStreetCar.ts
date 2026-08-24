import type { Entity } from 'playcanvas'

import type { PassQuality } from './types'
import {
  attachContactShadow,
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'

/**
 * Ordinary family wagon — the scale reference that gets left behind
 * in the first half-second. Not a selectable opponent; not on the board.
 */
export function buildStreetCar(
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): Entity {
  const paint = createMaterial(pc, {
    diffuse: [0.42, 0.44, 0.46],
    metalness: 0.18,
    gloss: 0.38,
  })
  const dark = createMaterial(pc, {
    diffuse: [0.08, 0.08, 0.09],
    metalness: 0.22,
    gloss: 0.2,
  })
  const glass = createMaterial(pc, {
    diffuse: [0.18, 0.22, 0.26],
    metalness: 0.04,
    gloss: 0.55,
    opacity: 0.45,
  })
  const rubber = createMaterial(pc, {
    diffuse: [0.06, 0.06, 0.065],
    metalness: 0.02,
    gloss: 0.1,
  })

  const car = new pc.Entity('street-car')
  car.addChild(
    createPrimitive(pc, {
      name: 'body',
      type: 'box',
      position: [0.05, 0.52, 0],
      scale: [4.15, 0.72, 1.68],
      material: paint,
      castShadows: quality === 'high',
    }),
  )
  car.addChild(
    createPrimitive(pc, {
      name: 'cabin',
      type: 'box',
      position: [-0.15, 1.08, 0],
      scale: [1.85, 0.55, 1.52],
      material: paint,
      castShadows: false,
    }),
  )
  car.addChild(
    createPrimitive(pc, {
      name: 'glass',
      type: 'box',
      position: [-0.12, 1.1, 0],
      scale: [1.55, 0.42, 1.56],
      material: glass,
      castShadows: false,
      receiveShadows: false,
    }),
  )
  car.addChild(
    createPrimitive(pc, {
      name: 'grille',
      type: 'box',
      position: [2.05, 0.48, 0],
      scale: [0.08, 0.28, 1.1],
      material: dark,
      castShadows: false,
    }),
  )

  ;([-1.28, 1.22] as number[]).forEach((x, i) => {
    ;([-0.72, 0.72] as number[]).forEach((z, side) => {
      const wheel = createPrimitive(pc, {
        name: `wheel-${i}-${side}`,
        type: 'cylinder',
        position: [x, 0.28, z],
        scale: [0.52, 0.22, 0.52],
        material: rubber,
        castShadows: false,
      })
      wheel.setLocalEulerAngles(0, 0, 90)
      car.addChild(wheel)
    })
  })

  attachContactShadow(pc, car, [1.7, 0.012, 0.78])
  return car
}
