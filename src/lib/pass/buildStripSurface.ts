import type { Application, Entity, Texture } from 'playcanvas'

import { createCanvasTexture } from './canvasTexture'
import {
  CHANNEL_WIDTH,
  LANE_FAR_Z,
  LANE_NEAR_Z,
  STAGING_LENGTH,
  TRACK_LENGTH,
  TRACK_SURFACE_CENTER_Y,
  TRACK_SURFACE_HEIGHT,
  TRACK_WIDTH,
} from './passLayout'
import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  type MaterialTone,
  type PlayCanvasNamespace,
} from './scenePrimitives'

type StripSurfaceOptions = {
  pc: PlayCanvasNamespace
  app?: Application
  sceneRoot: Entity
  quality: PassQuality
  asphaltRough?: Texture | null
  asphaltDiffuse?: Texture | null
}

/**
 * NHRA-style strip: dark prepped asphalt, heavy rubber, blue safety paint,
 * water box, and staging beams. Matches the start-line camera in the
 * reference (Pomona / Auto Club Raceway setup).
 */
export function buildStripSurface(opts: StripSurfaceOptions): void {
  const { pc, app, sceneRoot, quality, asphaltRough, asphaltDiffuse } = opts
  const high = quality === 'high'
  const stripStart = -STAGING_LENGTH
  const stripLen = TRACK_LENGTH + STAGING_LENGTH
  const stripMid = stripStart + stripLen / 2
  const ground = (tone: MaterialTone) => createMaterial(pc, { ...tone, useSkybox: false })

  // Prepped strip: dielectric, no IBL — PureSky would otherwise lie in the asphalt.
  const asphalt = ground({
    diffuse: [0.028, 0.029, 0.032],
    metalness: 0,
    gloss: 0.1,
  })
  const tileU = 48
  const tileV = 4.4
  if (asphaltDiffuse) {
    asphaltDiffuse.addressU = pc.ADDRESS_REPEAT
    asphaltDiffuse.addressV = pc.ADDRESS_REPEAT
    asphalt.diffuseMap = asphaltDiffuse
    asphalt.diffuseMapTiling.set(tileU, tileV)
    asphalt.diffuse.set(0.72, 0.7, 0.68)
  }
  if (asphaltRough) {
    asphaltRough.addressU = pc.ADDRESS_REPEAT
    asphaltRough.addressV = pc.ADDRESS_REPEAT
    if (!asphaltDiffuse) {
      asphalt.diffuseMap = asphaltRough
      asphalt.diffuseMapTiling.set(tileU, tileV)
      asphalt.diffuse.set(0.42, 0.41, 0.39)
    }
  }
  asphalt.useSkybox = false
  asphalt.update()
  const rubber = ground({
    diffuse: [0.014, 0.014, 0.016],
    metalness: 0.04,
    gloss: 0.08,
  })
  if (app) {
    const groove = createCanvasTexture(
      app,
      pc,
      'pass-rubber-groove',
      256,
      64,
      (ctx, w, h) => {
        ctx.fillStyle = '#0a0a0c'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
        ctx.fillRect(0, h * 0.18, w, h * 0.16)
        ctx.fillRect(0, h * 0.66, w, h * 0.16)
        for (let i = 0; i < 80; i += 1) {
          const px = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1 * w
          const py = Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1 * h
          ctx.fillStyle = `rgba(18, 18, 20, ${0.15 + (i % 5) * 0.04})`
          ctx.fillRect(px, py, 3 + (i % 4), 1)
        }
      },
      { repeatU: true, repeatV: true, srgb: true },
    )
    rubber.diffuseMap = groove
    rubber.diffuseMapTiling.set(28, 1.2)
    rubber.diffuse.set(0.55, 0.55, 0.56)
    rubber.update()
  }
  const shoulder = ground({
    diffuse: [0.07, 0.07, 0.068],
    metalness: 0.02,
    gloss: 0.05,
  })
  const concrete = ground({
    diffuse: [0.11, 0.11, 0.105],
    metalness: 0.03,
    gloss: 0.08,
  })
  const concreteStain = ground({
    diffuse: [0.08, 0.078, 0.072],
    metalness: 0.03,
    gloss: 0.06,
  })
  const paintWhite = ground({
    diffuse: [0.82, 0.83, 0.84],
    metalness: 0.02,
    gloss: 0.16,
  })
  // EDH accent blue — muted, worn safety paint, never self-lit.
  const paintBlue = ground({
    diffuse: [0.1, 0.14, 0.2],
    metalness: 0.02,
    gloss: 0.1,
  })
  const paintBlueWorn = ground({
    diffuse: [0.045, 0.1, 0.2],
    metalness: 0.02,
    gloss: 0.08,
  })
  const dirt = ground({
    diffuse: [0.08, 0.07, 0.06],
    metalness: 0.02,
    gloss: 0.04,
  })
  const waterBox = ground({
    diffuse: [0.032, 0.033, 0.036],
    metalness: 0.02,
    gloss: 0.08,
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
      position: [stripMid, TRACK_SURFACE_CENTER_Y, 0],
      scale: [stripLen, TRACK_SURFACE_HEIGHT, TRACK_WIDTH],
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

  // Dual slick tracks — long broken streaks so the grain smears at speed.
  ;([LANE_NEAR_Z, LANE_FAR_Z] as number[]).forEach((laneZ, lane) => {
    ;([-0.34, 0.34] as number[]).forEach((offset, slick) => {
      const segments = high ? 8 : 5
      const span = stripLen - 8
      const step = span / segments
      for (let s = 0; s < segments; s += 1) {
        const len = step * (0.78 + (s % 3) * 0.05)
        const x = stripStart + 4 + s * step + len / 2 + (s % 2) * 0.25
        sceneRoot.addChild(
          createPrimitive(pc, {
            name: `lane-rubber-${lane}-${slick}-${s}`,
            type: 'box',
            position: [x, -0.108, laneZ + offset + ((s % 3) - 1) * 0.03],
            scale: [len, 0.011, 0.24 + (s % 3) * 0.05],
            material: rubber,
            castShadows: false,
          }),
        )
      }
    })

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

    const seamCount = high ? 10 : 5
    for (let c = 0; c < seamCount; c += 1) {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `asphalt-seam-${lane}-${c}`,
          type: 'box',
          position: [stripStart + 10 + c * (stripLen / (seamCount + 1)), -0.107, laneZ * 0.12],
          scale: [0.07, 0.01, TRACK_WIDTH * 0.52],
          material: dirt,
          castShadows: false,
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
