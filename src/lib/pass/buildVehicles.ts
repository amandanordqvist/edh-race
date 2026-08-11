import type { Entity } from 'playcanvas'

import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  shadowsEnabled,
  type PlayCanvasNamespace,
} from './scenePrimitives'

export type VehicleId = 'camaro' | 'f1' | 'jet'

function addWheel(
  pc: PlayCanvasNamespace,
  parent: Entity,
  name: string,
  position: [number, number, number],
  scale: [number, number, number],
  material: import('playcanvas').StandardMaterial,
  cast: boolean,
) {
  const wheel = createPrimitive(pc, {
    name,
    type: 'cylinder',
    position,
    scale,
    material,
    castShadows: cast,
  })
  wheel.setLocalEulerAngles(0, 0, 90)
  parent.addChild(wheel)
}

export function buildPassVehicles(
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): Record<VehicleId, Entity> {
  const cast = shadowsEnabled(quality)

  const camaroBlue = createMaterial(pc, {
    diffuse: [42 / 255, 79 / 255, 154 / 255],
    emissive: [0.05, 0.09, 0.2],
    emissiveIntensity: quality === 'high' ? 0.28 : 0.16,
    metalness: 0.38,
    gloss: 0.5,
  })
  const camaroDark = createMaterial(pc, {
    diffuse: [0.07, 0.08, 0.1],
    metalness: 0.42,
    gloss: 0.32,
  })
  const camaroGlass = createMaterial(pc, {
    diffuse: [0.1, 0.14, 0.2],
    metalness: 0.55,
    gloss: 0.72,
  })
  const rubber = createMaterial(pc, {
    diffuse: [0.05, 0.05, 0.055],
    metalness: 0.04,
    gloss: 0.12,
  })
  const chute = createMaterial(pc, {
    diffuse: [0.55, 0.12, 0.12],
    metalness: 0.15,
    gloss: 0.2,
  })
  const f1Body = createMaterial(pc, {
    diffuse: [0.76, 0.78, 0.8],
    metalness: 0.48,
    gloss: 0.52,
  })
  const f1Accent = createMaterial(pc, {
    diffuse: [0.52, 0.54, 0.58],
    metalness: 0.5,
    gloss: 0.4,
  })
  const jetBody = createMaterial(pc, {
    diffuse: [0.5, 0.52, 0.56],
    metalness: 0.32,
    gloss: 0.3,
  })
  const jetWing = createMaterial(pc, {
    diffuse: [0.4, 0.42, 0.46],
    metalness: 0.28,
    gloss: 0.22,
  })

  // Camaro: doorslammer silhouette — long nose, cabin, huge rear slicks, chute pack
  const camaro = new pc.Entity('camaro')
  camaro.setLocalPosition(0.4, 0.48, 0)
  camaro.addChild(
    createPrimitive(pc, {
      name: 'camaro-body',
      type: 'box',
      position: [0.1, 0.32, 0],
      scale: [3.35, 0.52, 1.55],
      material: camaroBlue,
      castShadows: cast,
    }),
  )
  camaro.addChild(
    createPrimitive(pc, {
      name: 'camaro-nose',
      type: 'box',
      position: [1.65, 0.24, 0],
      scale: [0.85, 0.36, 1.28],
      material: camaroBlue,
      castShadows: cast,
    }),
  )
  camaro.addChild(
    createPrimitive(pc, {
      name: 'camaro-cabin',
      type: 'box',
      position: [-0.35, 0.68, 0],
      scale: [1.45, 0.48, 1.22],
      material: camaroGlass,
      castShadows: cast,
    }),
  )
  camaro.addChild(
    createPrimitive(pc, {
      name: 'camaro-wing',
      type: 'box',
      position: [-1.55, 0.62, 0],
      scale: [0.22, 0.14, 1.65],
      material: camaroDark,
      castShadows: cast,
    }),
  )
  camaro.addChild(
    createPrimitive(pc, {
      name: 'camaro-chute',
      type: 'cylinder',
      position: [-1.85, 0.55, 0],
      scale: [0.28, 0.35, 0.28],
      material: chute,
      castShadows: cast,
    }),
  )
  addWheel(pc, camaro, 'camaro-wheel-fl', [1.15, 0.18, 0.78], [0.32, 0.16, 0.32], rubber, cast)
  addWheel(pc, camaro, 'camaro-wheel-fr', [1.15, 0.18, -0.78], [0.32, 0.16, 0.32], rubber, cast)
  addWheel(pc, camaro, 'camaro-wheel-rl', [-1.05, 0.28, 0.88], [0.55, 0.32, 0.55], rubber, cast)
  addWheel(pc, camaro, 'camaro-wheel-rr', [-1.05, 0.28, -0.88], [0.55, 0.32, 0.55], rubber, cast)

  const f1 = new pc.Entity('f1')
  f1.setLocalPosition(0.2, 0.2, -2.55)
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-body',
      type: 'box',
      position: [0.1, 0.16, 0],
      scale: [2.55, 0.26, 0.7],
      material: f1Body,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-nose',
      type: 'box',
      position: [1.35, 0.14, 0],
      scale: [0.75, 0.16, 0.28],
      material: f1Body,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-cockpit',
      type: 'box',
      position: [-0.05, 0.34, 0],
      scale: [0.5, 0.26, 0.42],
      material: f1Accent,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-pod-l',
      type: 'box',
      position: [0.05, 0.18, 0.52],
      scale: [1.05, 0.2, 0.32],
      material: f1Accent,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-pod-r',
      type: 'box',
      position: [0.05, 0.18, -0.52],
      scale: [1.05, 0.2, 0.32],
      material: f1Accent,
      castShadows: cast,
    }),
  )
  f1.addChild(
    createPrimitive(pc, {
      name: 'f1-wing',
      type: 'box',
      position: [-1.2, 0.4, 0],
      scale: [0.12, 0.08, 1.4],
      material: f1Body,
      castShadows: cast,
    }),
  )

  const jet = new pc.Entity('jet')
  jet.setLocalPosition(0, 0.7, 2.55)
  jet.addChild(
    createPrimitive(pc, {
      name: 'jet-fuse',
      type: 'box',
      position: [0.25, 0.22, 0],
      scale: [4.6, 0.48, 0.58],
      material: jetBody,
      castShadows: cast,
    }),
  )
  jet.addChild(
    createPrimitive(pc, {
      name: 'jet-nose',
      type: 'box',
      position: [2.55, 0.2, 0],
      scale: [0.55, 0.32, 0.36],
      material: jetBody,
      castShadows: cast,
    }),
  )
  jet.addChild(
    createPrimitive(pc, {
      name: 'jet-wing-l',
      type: 'box',
      position: [-0.15, 0.18, 1.05],
      scale: [1.7, 0.08, 1.2],
      material: jetWing,
      castShadows: cast,
    }),
  )
  jet.addChild(
    createPrimitive(pc, {
      name: 'jet-wing-r',
      type: 'box',
      position: [-0.15, 0.18, -1.05],
      scale: [1.7, 0.08, 1.2],
      material: jetWing,
      castShadows: cast,
    }),
  )
  jet.addChild(
    createPrimitive(pc, {
      name: 'jet-tail',
      type: 'box',
      position: [-2.05, 0.62, 0],
      scale: [0.38, 0.85, 0.12],
      material: jetWing,
      castShadows: cast,
    }),
  )

  return { camaro, f1, jet }
}
