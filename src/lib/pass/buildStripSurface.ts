import type { Entity, Texture } from 'playcanvas'

import {
  CHANNEL_WIDTH,
  LANE_FAR_Z,
  LANE_NEAR_Z,
  STAGING_LENGTH,
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
  const stripStart = -STAGING_LENGTH
  const stripLen = TRACK_LENGTH + STAGING_LENGTH
  const stripMid = stripStart + stripLen / 2

  // Prepped strip: dark but not pure black — room for the car to read on top.
  const asphalt = createMaterial(pc, {
    diffuse: [0.028, 0.029, 0.032],
    metalness: 0.14,
    gloss: 0.28,
  })
  if (asphaltRough) {
    asphaltRough.addressU = pc.ADDRESS_REPEAT
    asphaltRough.addressV = pc.ADDRESS_REPEAT
    asphalt.diffuseMap = asphaltRough
    asphalt.diffuseMapTiling.set(22, 3.2)
    asphalt.diffuse.set(0.22, 0.22, 0.24)
    asphalt.glossMap = asphaltRough
    asphalt.glossInvert = true
    asphalt.glossMapTiling.set(22, 3.2)
    asphalt.update()
  }
  const rubber = createMaterial(pc, {
    diffuse: [0.022, 0.022, 0.024],
    metalness: 0.03,
    gloss: 0.06,
  })
  const rubberWet = createMaterial(pc, {
    diffuse: [0.04, 0.04, 0.045],
    metalness: 0.32,
    gloss: 0.62,
  })
  const shoulder = createMaterial(pc, {
    diffuse: [0.07, 0.07, 0.068],
    metalness: 0.04,
    gloss: 0.06,
  })
  const concrete = createMaterial(pc, {
    diffuse: [0.11, 0.11, 0.105],
    metalness: 0.06,
    gloss: 0.1,
  })
  const concreteStain = createMaterial(pc, {
    diffuse: [0.08, 0.078, 0.072],
    metalness: 0.05,
    gloss: 0.08,
  })
  const paintWhite = createMaterial(pc, {
    diffuse: [0.82, 0.83, 0.84],
    metalness: 0.04,
    gloss: 0.28,
  })
  // EDH accent blue — muted, worn safety paint, never self-lit.
  const paintBlue = createMaterial(pc, {
    diffuse: [0.06, 0.14, 0.28],
    metalness: 0.05,
    gloss: 0.18,
  })
  const paintBlueWorn = createMaterial(pc, {
    diffuse: [0.045, 0.1, 0.2],
    metalness: 0.04,
    gloss: 0.12,
  })
  const dirt = createMaterial(pc, {
    diffuse: [0.08, 0.07, 0.06],
    metalness: 0.02,
    gloss: 0.05,
  })
  const waterBox = createMaterial(pc, {
    diffuse: [0.045, 0.05, 0.055],
    metalness: 0.4,
    gloss: 0.68,
  })
  const beamMat = createMaterial(pc, {
    diffuse: [0.14, 0.15, 0.17],
    metalness: 0.55,
    gloss: 0.48,
  })
  const eyeMat = createMaterial(pc, {
    diffuse: [0.55, 0.14, 0.1],
    emissive: [0.55, 0.12, 0.08],
    emissiveIntensity: 0.35,
    metalness: 0.1,
    gloss: 0.55,
  })

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'ground-apron',
      type: 'box',
      position: [stripMid, -0.55, 0],
      scale: [stripLen + 38, 0.3, TRACK_WIDTH + 36],
      material: shoulder,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'track-shoulder',
      type: 'box',
      position: [stripMid, -0.38, 0],
      scale: [stripLen + 8, 0.22, TRACK_WIDTH + 10],
      material: concrete,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'track-surface',
      type: 'box',
      position: [stripMid, -0.22, 0],
      scale: [stripLen, 0.18, TRACK_WIDTH],
      material: asphalt,
    }),
  )

  // Narrow center divider — accent, not a glowing runway.
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'center-blue',
      type: 'box',
      position: [stripMid, -0.105, 0],
      scale: [stripLen - 1, 0.016, 0.95],
      material: paintBlueWorn,
    }),
  )

  const channelZ = TRACK_WIDTH / 2 + CHANNEL_WIDTH / 2
  ;([-channelZ, channelZ] as number[]).forEach((z, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `safety-channel-${index}`,
        type: 'box',
        position: [stripMid, -0.19, z],
        scale: [stripLen + 6, 0.02, CHANNEL_WIDTH],
        material: paintBlue,
      }),
    )
    // Worn patches so the blue reads painted, not digital.
    if (high) {
      for (let p = 0; p < 5; p += 1) {
        sceneRoot.addChild(
          createPrimitive(pc, {
            name: `channel-wear-${index}-${p}`,
            type: 'box',
            position: [stripStart + 8 + p * (stripLen / 5), -0.175, z + (p % 2 === 0 ? 0.35 : -0.3)],
            scale: [3.2 + (p % 3) * 0.8, 0.012, 0.55],
            material: paintBlueWorn,
            castShadows: false,
          }),
        )
      }
    }
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `channel-edge-inner-${index}`,
        type: 'box',
        position: [stripMid, -0.18, z + (z < 0 ? CHANNEL_WIDTH / 2 : -CHANNEL_WIDTH / 2)],
        scale: [stripLen + 6, 0.014, 0.1],
        material: paintWhite,
        castShadows: false,
      }),
    )
  })

  // Concrete stains near the wall foot.
  ;([-1, 1] as number[]).forEach((side, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `concrete-stain-${index}`,
        type: 'box',
        position: [2.5, -0.36, side * (TRACK_WIDTH / 2 + 1.2)],
        scale: [14, 0.04, 1.8],
        material: concreteStain,
        castShadows: false,
      }),
    )
  })

  // Dual slick tracks per lane — narrow, broken rubber instead of long polygons.
  ;([LANE_NEAR_Z, LANE_FAR_Z] as number[]).forEach((laneZ, lane) => {
    ;([-0.34, 0.34] as number[]).forEach((offset, slick) => {
      const segments = high ? 18 : 11
      for (let s = 0; s < segments; s += 1) {
        const len = 4.2 + (s % 4) * 1.1 + (s % 3) * 0.4
        const gap = 0.35 + (s % 5) * 0.12
        const x =
          stripStart + 4 + s * ((stripLen * 0.78) / segments) + (s % 2) * 0.4
        sceneRoot.addChild(
          createPrimitive(pc, {
            name: `lane-rubber-${lane}-${slick}-${s}`,
            type: 'box',
            position: [x, -0.108, laneZ + offset + ((s % 3) - 1) * 0.04],
            scale: [len, 0.011, 0.22 + (s % 3) * 0.06],
            material: rubber,
            castShadows: false,
          }),
        )
        void gap
      }
    })

    // Wet sheen patches along the prep line.
    if (high) {
      for (let w = 0; w < 6; w += 1) {
        sceneRoot.addChild(
          createPrimitive(pc, {
            name: `prep-sheen-${lane}-${w}`,
            type: 'box',
            position: [8 + w * 18, -0.102, laneZ + ((w % 2) * 0.5 - 0.25)],
            scale: [5.5, 0.008, 0.85],
            material: rubberWet,
            castShadows: false,
          }),
        )
      }
    }

    const burnoutCount = high ? 14 : 8
    for (let i = 0; i < burnoutCount; i += 1) {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `burnout-${lane}-${i}`,
          type: 'box',
          position: [-1.1 - i * 0.38, -0.1, laneZ + ((i % 2) * 0.28 - 0.14)],
          scale: [0.7 + (i % 3) * 0.15, 0.013, 0.45 + (i % 2) * 0.2],
          material: rubber,
          castShadows: false,
        }),
      )
    }

    // Tire crumb / dirt / cracks near the start line.
    for (let d = 0; d < (high ? 7 : 3); d += 1) {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `start-dirt-${lane}-${d}`,
          type: 'box',
          position: [0.6 + d * 0.48, -0.095, laneZ + (d % 2 === 0 ? -0.75 : 0.7)],
          scale: [0.55 + (d % 3) * 0.2, 0.009, 0.22 + (d % 2) * 0.12],
          material: dirt,
          castShadows: false,
        }),
      )
    }

    if (high) {
      for (let c = 0; c < 4; c += 1) {
        sceneRoot.addChild(
          createPrimitive(pc, {
            name: `asphalt-seam-${lane}-${c}`,
            type: 'box',
            position: [12 + c * 28, -0.107, laneZ * 0.15],
            scale: [0.08, 0.01, TRACK_WIDTH * 0.55],
            material: dirt,
            castShadows: false,
          }),
        )
      }
    }
  })

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'water-box',
      type: 'box',
      position: [-3.4, -0.11, 0],
      scale: [4.6, 0.04, TRACK_WIDTH - 1.6],
      material: waterBox,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'water-sheen',
      type: 'box',
      position: [-3.4, -0.09, 0],
      scale: [4.2, 0.01, TRACK_WIDTH - 2.2],
      material: rubberWet,
      castShadows: false,
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
