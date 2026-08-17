import type { Entity } from 'playcanvas'

import {
  BARRIER_Z,
  CHANNEL_WIDTH,
  LANE_FAR_Z,
  LANE_NEAR_Z,
  SHUTDOWN_LENGTH,
  TRACK_LENGTH,
  TRACK_WIDTH,
} from './passLayout'
import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'

type ShutdownOptions = {
  pc: PlayCanvasNamespace
  sceneRoot: Entity
  quality: PassQuality
}

/**
 * Shutdown past the 1320' gantry: same asphalt, fading rubber, then sand.
 * This is the chute beat — not a white slab.
 */
export function buildShutdown(opts: ShutdownOptions): void {
  const { pc, sceneRoot, quality } = opts
  const high = quality === 'high'
  const start = TRACK_LENGTH
  const mid = start + SHUTDOWN_LENGTH * 0.5
  const sandStart = start + SHUTDOWN_LENGTH * 0.62
  const sandLen = SHUTDOWN_LENGTH * 0.38

  const asphalt = createMaterial(pc, {
    diffuse: [0.026, 0.027, 0.03],
    metalness: 0.14,
    gloss: 0.22,
  })
  const rubber = createMaterial(pc, {
    diffuse: [0.028, 0.028, 0.03],
    metalness: 0.04,
    gloss: 0.1,
  })
  const paintBlue = createMaterial(pc, {
    diffuse: [0.08, 0.36, 0.74],
    metalness: 0.04,
    gloss: 0.28,
  })
  const sand = createMaterial(pc, {
    diffuse: [0.08, 0.07, 0.055],
    metalness: 0.02,
    gloss: 0.05,
  })
  const sandDark = createMaterial(pc, {
    diffuse: [0.055, 0.05, 0.042],
    metalness: 0.02,
    gloss: 0.04,
  })
  const net = createMaterial(pc, {
    diffuse: [0.18, 0.19, 0.21],
    metalness: 0.35,
    gloss: 0.28,
  })
  const netMesh = createMaterial(pc, {
    diffuse: [0.14, 0.15, 0.16],
    metalness: 0.08,
    gloss: 0.1,
  })
  netMesh.opacity = 0.32
  netMesh.blendType = pc.BLEND_NORMAL
  netMesh.depthWrite = false
  netMesh.update()

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'shutdown-asphalt',
      type: 'box',
      position: [mid, -0.22, 0],
      scale: [SHUTDOWN_LENGTH, 0.18, TRACK_WIDTH],
      material: asphalt,
    }),
  )

  const channelZ = TRACK_WIDTH / 2 + CHANNEL_WIDTH / 2
  ;([-channelZ, channelZ] as number[]).forEach((z, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `shutdown-channel-${index}`,
        type: 'box',
        position: [mid, -0.19, z],
        scale: [SHUTDOWN_LENGTH, 0.02, CHANNEL_WIDTH],
        material: paintBlue,
        receiveShadows: false,
      }),
    )
  })

  ;([LANE_NEAR_Z, LANE_FAR_Z] as number[]).forEach((laneZ, lane) => {
    ;([-0.38, 0.38] as number[]).forEach((offset, slick) => {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `shutdown-rubber-${lane}-${slick}`,
          type: 'box',
          position: [start + SHUTDOWN_LENGTH * 0.28, -0.108, laneZ + offset],
          scale: [SHUTDOWN_LENGTH * 0.52, 0.01, 0.42],
          material: rubber,
          receiveShadows: false,
        }),
      )
    })
  })

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'sand-trap',
      type: 'box',
      position: [sandStart + sandLen * 0.5, -0.16, 0],
      scale: [sandLen, 0.28, TRACK_WIDTH + 3.2],
      material: sand,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'sand-trap-lip',
      type: 'box',
      position: [sandStart, -0.05, 0],
      scale: [0.7, 0.12, TRACK_WIDTH + 2.4],
      material: sandDark,
      receiveShadows: false,
    }),
  )

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'sand-trap-ridge',
      type: 'box',
      position: [sandStart + sandLen * 0.38, -0.02, 0],
      scale: [sandLen * 0.22, 0.18, TRACK_WIDTH + 1.6],
      material: sandDark,
      receiveShadows: false,
    }),
  )
  ;([-TRACK_WIDTH * 0.28, TRACK_WIDTH * 0.22] as number[]).forEach((z, mound) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `sand-mound-${mound}`,
        type: 'box',
        position: [sandStart + sandLen * (0.55 + mound * 0.12), 0.06, z],
        scale: [sandLen * 0.16, 0.22 + mound * 0.06, 2.4],
        material: mound === 0 ? sand : sandDark,
        receiveShadows: false,
      }),
    )
  })
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'end-berm',
      type: 'box',
      position: [start + SHUTDOWN_LENGTH + 1.4, 0.35, 0],
      scale: [2.8, 1.4, TRACK_WIDTH + 8],
      material: sandDark,
      castShadows: high,
    }),
  )

  const fenceX = start + SHUTDOWN_LENGTH - 1.2
  ;([-BARRIER_Z, BARRIER_Z] as number[]).forEach((z, side) => {
    const posts = high ? 5 : 3
    for (let i = 0; i < posts; i += 1) {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `catch-post-${side}-${i}`,
          type: 'cylinder',
          position: [fenceX - i * 2.4, 1.6, z],
          scale: [0.08, 3.2, 0.08],
          material: net,
          castShadows: false,
        }),
      )
      if (i < posts - 1) {
        sceneRoot.addChild(
          createPrimitive(pc, {
            name: `catch-net-${side}-${i}`,
            type: 'box',
            position: [fenceX - i * 2.4 - 1.2, 1.55, z],
            scale: [2.2, 2.6, 0.04],
            material: netMesh,
            castShadows: false,
            receiveShadows: false,
          }),
        )
      }
    }
  })

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'catch-net-rear',
      type: 'box',
      position: [start + SHUTDOWN_LENGTH - 0.35, 1.45, 0],
      scale: [0.05, 2.5, TRACK_WIDTH + 1.4],
      material: netMesh,
      castShadows: false,
      receiveShadows: false,
    }),
  )
}
