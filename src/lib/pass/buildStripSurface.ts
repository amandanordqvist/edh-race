import type { Entity, Texture } from 'playcanvas'

import {
  CHANNEL_WIDTH,
  LANE_FAR_Z,
  LANE_NEAR_Z,
  TRACK_LENGTH,
  TRACK_WIDTH,
} from './passLayout'
import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'

type StripSurfaceOptions = {
  pc: PlayCanvasNamespace
  sceneRoot: Entity
  quality: PassQuality
  asphaltRough?: Texture | null
}

/**
 * NHRA-style strip: dark prepped asphalt, heavy rubber, blue safety paint,
 * water box, and staging beams. Matches the start-line camera in the
 * reference (Pomona / Auto Club Raceway setup).
 */
export function buildStripSurface(opts: StripSurfaceOptions): void {
  const { pc, sceneRoot, quality, asphaltRough } = opts
  const high = quality === 'high'
  const halfTrack = TRACK_LENGTH / 2

  const asphalt = createMaterial(pc, {
    diffuse: [0.035, 0.036, 0.04],
    metalness: 0.22,
    gloss: 0.38,
  })
  if (asphaltRough) {
    asphaltRough.addressU = pc.ADDRESS_REPEAT
    asphaltRough.addressV = pc.ADDRESS_REPEAT
    asphalt.glossMap = asphaltRough
    asphalt.glossInvert = true
    asphalt.glossMapTiling.set(18, 2.4)
    asphalt.update()
  }
  const rubber = createMaterial(pc, {
    diffuse: [0.018, 0.018, 0.02],
    metalness: 0.04,
    gloss: 0.08,
  })
  const rubberWet = createMaterial(pc, {
    diffuse: [0.03, 0.03, 0.035],
    metalness: 0.28,
    gloss: 0.55,
  })
  const shoulder = createMaterial(pc, {
    diffuse: [0.18, 0.17, 0.15],
    metalness: 0.05,
    gloss: 0.08,
  })
  const concrete = createMaterial(pc, {
    diffuse: [0.78, 0.78, 0.76],
    metalness: 0.08,
    gloss: 0.18,
  })
  const paintWhite = createMaterial(pc, {
    diffuse: [0.94, 0.95, 0.96],
    metalness: 0.04,
    gloss: 0.32,
  })
  const paintBlue = createMaterial(pc, {
    diffuse: [0.08, 0.38, 0.78],
    emissive: [0.03, 0.14, 0.32],
    emissiveIntensity: 0.08,
    metalness: 0.04,
    gloss: 0.3,
  })
  const waterBox = createMaterial(pc, {
    diffuse: [0.04, 0.05, 0.06],
    emissive: [0.02, 0.03, 0.04],
    emissiveIntensity: 0.2,
    metalness: 0.45,
    gloss: 0.7,
  })
  const beamMat = createMaterial(pc, {
    diffuse: [0.16, 0.17, 0.2],
    metalness: 0.55,
    gloss: 0.48,
  })
  const eyeMat = createMaterial(pc, {
    diffuse: [0.95, 0.22, 0.16],
    emissive: [0.9, 0.2, 0.12],
    emissiveIntensity: 0.7,
    metalness: 0.1,
    gloss: 0.7,
  })

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'ground-apron',
      type: 'box',
      position: [halfTrack, -0.55, 0],
      scale: [TRACK_LENGTH + 60, 0.3, TRACK_WIDTH + 36],
      material: shoulder,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'track-shoulder',
      type: 'box',
      position: [halfTrack, -0.38, 0],
      scale: [TRACK_LENGTH + 28, 0.22, TRACK_WIDTH + 10],
      material: concrete,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'track-surface',
      type: 'box',
      position: [halfTrack, -0.22, 0],
      scale: [TRACK_LENGTH, 0.18, TRACK_WIDTH],
      material: asphalt,
    }),
  )

  // Blue safety paint: center divider + outer channels (NHRA / Pomona read).
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'center-blue',
      type: 'box',
      position: [halfTrack, -0.105, 0],
      scale: [TRACK_LENGTH - 1, 0.018, 1.55],
      material: paintBlue,
      receiveShadows: false,
    }),
  )

  const channelZ = TRACK_WIDTH / 2 + CHANNEL_WIDTH / 2
  ;([-channelZ, channelZ] as number[]).forEach((z, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `safety-channel-${index}`,
        type: 'box',
        position: [halfTrack, -0.19, z],
        scale: [TRACK_LENGTH + 6, 0.02, CHANNEL_WIDTH],
        material: paintBlue,
        receiveShadows: false,
      }),
    )
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `channel-edge-inner-${index}`,
        type: 'box',
        position: [halfTrack, -0.18, z + (z < 0 ? CHANNEL_WIDTH / 2 : -CHANNEL_WIDTH / 2)],
        scale: [TRACK_LENGTH + 6, 0.015, 0.14],
        material: paintWhite,
        receiveShadows: false,
      }),
    )
  })

  // Dual slick tracks per lane — the black rubber that sells a prepped strip.
  ;([LANE_NEAR_Z, LANE_FAR_Z] as number[]).forEach((laneZ, lane) => {
    ;([-0.38, 0.38] as number[]).forEach((offset, slick) => {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `lane-rubber-${lane}-${slick}`,
          type: 'box',
          position: [halfTrack + 4, -0.108, laneZ + offset],
          scale: [TRACK_LENGTH * 0.86, 0.012, 0.52],
          material: rubber,
          castShadows: false,
          receiveShadows: false,
        }),
      )
    })

    const burnoutCount = high ? 8 : 5
    for (let i = 0; i < burnoutCount; i += 1) {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `burnout-${lane}-${i}`,
          type: 'box',
          position: [-1.1 - i * 0.38, -0.1, laneZ + ((i % 2) * 0.22 - 0.11)],
          scale: [0.85, 0.014, 0.7],
          material: rubber,
          receiveShadows: false,
        }),
      )
    }
  })

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'water-box',
      type: 'box',
      position: [-3.4, -0.11, 0],
      scale: [4.6, 0.04, TRACK_WIDTH - 1.6],
      material: waterBox,
      receiveShadows: false,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'water-sheen',
      type: 'box',
      position: [-3.4, -0.09, 0],
      scale: [4.2, 0.01, TRACK_WIDTH - 2.2],
      material: rubberWet,
      receiveShadows: false,
    }),
  )

  // Pre-stage + stage lines (white), then a thin trap stripe at the beams.
  ;[0.05, 0.55].forEach((x, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `stage-line-${index}`,
        type: 'box',
        position: [x, -0.1, 0],
        scale: [0.12, 0.025, TRACK_WIDTH - 1.8],
        material: paintWhite,
        receiveShadows: false,
      }),
    )
  })

  // Photocell eyes at bumper height on each side of the lane — not a bar
  // through the car path.
  ;([LANE_NEAR_Z, LANE_FAR_Z] as number[]).forEach((laneZ, lane) => {
    ;([-1.15, 1.15] as number[]).forEach((offset, side) => {
      const cluster = new pc.Entity(`stage-eye-${lane}-${side}`)
      cluster.setLocalPosition(0.3, 0, laneZ + offset)
      cluster.addChild(
        createPrimitive(pc, {
          name: 'post',
          type: 'cylinder',
          position: [0, 0.2, 0],
          scale: [0.07, 0.4, 0.07],
          material: beamMat,
          castShadows: high,
        }),
      )
      cluster.addChild(
        createPrimitive(pc, {
          name: 'eye',
          type: 'sphere',
          position: [0, 0.28, offset < 0 ? 0.08 : -0.08],
          scale: [0.09, 0.09, 0.09],
          material: eyeMat,
          castShadows: false,
        }),
      )
      sceneRoot.addChild(cluster)
    })
  })
}
