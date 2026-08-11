import type { Entity } from 'playcanvas'

import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  shadowsEnabled,
  type PlayCanvasNamespace,
} from './scenePrimitives'

export type VehicleId = 'camaro' | 'f1' | 'jet'

export function buildPassVehicles(
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): Record<VehicleId, Entity> {
  const cast = shadowsEnabled(quality)

  const camaroBlue = createMaterial(pc, {
    diffuse: [42 / 255, 79 / 255, 154 / 255],
    emissive: [0.06, 0.1, 0.22],
    emissiveIntensity: quality === 'high' ? 0.32 : 0.18,
    metalness: 0.35,
    gloss: 0.48,
  })
  const camaroDark = createMaterial(pc, {
    diffuse: [0.08, 0.1, 0.14],
    metalness: 0.4,
    gloss: 0.35,
  })
  const camaroGlass = createMaterial(pc, {
    diffuse: [0.12, 0.16, 0.22],
    metalness: 0.55,
    gloss: 0.7,
  })
  const rubber = createMaterial(pc, {
    diffuse: [0.06, 0.06, 0.07],
    metalness: 0.05,
    gloss: 0.15,
  })
  const f1Body = createMaterial(pc, {
    diffuse: [0.74, 0.76, 0.79],
    metalness: 0.45,
    gloss: 0.5,
  })
  const f1Accent = createMaterial(pc, {
    diffuse: [0.55, 0.57, 0.6],
    metalness: 0.5,
    gloss: 0.4,
  })
  const jetBody = createMaterial(pc, {
    diffuse: [0.48, 0.5, 0.54],
    metalness: 0.3,
    gloss: 0.28,
  })
  const jetWing = createMaterial(pc, {
    diffuse: [0.4, 0.42, 0.46],
    metalness: 0.28,
    gloss: 0.22,
  })

  const camaro = new pc.Entity('camaro')
  camaro.setLocalPosition(0, 0.42, 0)
  camaro.addChild(
    createPrimitive(pc, {
      name: 'camaro-body',
      type: 'box',
      position: [0.15, 0.28, 0],
      scale: [3.1, 0.55, 1.45],
      material: camaroBlue,
      castShadows: cast,
    }),
  )
  camaro.addChild(
    createPrimitive(pc, {
      name: 'camaro-nose',
      type: 'box',
      position: [1.45, 0.22, 0],
      scale: [0.7, 0.38, 1.2],
      material: camaroBlue,
      castShadows: cast,
    }),
  )
  camaro.addChild(
    createPrimitive(pc, {
      name: 'camaro-cabin',
      type: 'box',
      position: [-0.15, 0.62, 0],
      scale: [1.35, 0.42, 1.15],
      material: camaroGlass,
      castShadows: cast,
    }),
  )
  camaro.addChild(
    createPrimitive(pc, {
      name: 'camaro-spoiler',
      type: 'box',
      position: [-1.45, 0.55, 0],
      scale: [0.18, 0.12, 1.5],
      material: camaroDark,
      castShadows: cast,
    }),
  )
  ;([
    [0.95, 0.12, 0.72],
    [0.95, 0.12, -0.72],
    [-0.95, 0.12, 0.72],
    [-0.95, 0.12, -0.72],
  ] as [number, number, number][]).forEach((pos, i) => {
    camaro.addChild(
      createPrimitive(pc, {
        name: `camaro-wheel-${i}`,
        type: 'cylinder',
        position: pos,
        scale: [0.38, 0.22, 0.38],
        material: rubber,
        castShadows: cast,
      }),
    )
  })

  const f1 = new pc.Entity('f1')
  f1.setLocalPosition(0, 0.22, -2.35)
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-body',
      type: 'box',
      position: [0.1, 0.18, 0],
      scale: [2.6, 0.28, 0.72],
      material: f1Body,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-nose',
      type: 'box',
      position: [1.35, 0.16, 0],
      scale: [0.7, 0.18, 0.32],
      material: f1Body,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-cockpit',
      type: 'box',
      position: [-0.1, 0.38, 0],
      scale: [0.55, 0.28, 0.45],
      material: f1Accent,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-pod-l',
      type: 'box',
      position: [0.05, 0.2, 0.55],
      scale: [1.1, 0.22, 0.35],
      material: f1Accent,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-pod-r',
      type: 'box',
      position: [0.05, 0.2, -0.55],
      scale: [1.1, 0.22, 0.35],
      material: f1Accent,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-wing',
      type: 'box',
      position: [-1.25, 0.42, 0],
      scale: [0.12, 0.08, 1.35],
      material: f1Body,
      castShadows: cast,
    }),
  )

  const jet = new pc.Entity('jet')
  jet.setLocalPosition(0, 0.55, 2.35)
  jet.addChild(
    createPrimitive(pc, {
      name: 'jet-fuse',
      type: 'box',
      position: [0.2, 0.2, 0],
      scale: [4.4, 0.45, 0.55],
      material: jetBody,
      castShadows: cast,
    }),
  )
  jet.addChild(
    createPrimitive(pc, {
      name: 'jet-wing-l',
      type: 'box',
      position: [-0.2, 0.18, 0.95],
      scale: [1.6, 0.08, 1.1],
      material: jetWing,
      castShadows: cast,
    }),
  )
  jet.addChild(
    createPrimitive(pc, {
      name: 'jet-wing-r',
      type: 'box',
      position: [-0.2, 0.18, -0.95],
      scale: [1.6, 0.08, 1.1],
      material: jetWing,
      castShadows: cast,
    }),
  )
  jet.addChild(
    createPrimitive(pc, {
      name: 'jet-tail',
      type: 'box',
      position: [-2.0, 0.55, 0],
      scale: [0.35, 0.7, 0.12],
      material: jetWing,
      castShadows: cast,
    }),
  )

  // Rotate wheel cylinders to sit like discs (PlayCanvas cylinder is Y-up).
  camaro.findByName('camaro-wheel-0')?.setLocalEulerAngles(0, 0, 90)
  camaro.findByName('camaro-wheel-1')?.setLocalEulerAngles(0, 0, 90)
  camaro.findByName('camaro-wheel-2')?.setLocalEulerAngles(0, 0, 90)
  camaro.findByName('camaro-wheel-3')?.setLocalEulerAngles(0, 0, 90)

  return { camaro, f1, jet }
}
