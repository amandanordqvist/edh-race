import type { Entity } from 'playcanvas'

import { QUARTER_METERS } from '../../data/simulator'
import type { PassQuality } from './types'
import { createMaterial, createPrimitive, type PlayCanvasNamespace } from './scenePrimitives'

type TrackMarkersOptions = {
  pc: PlayCanvasNamespace
  sceneRoot: Entity
  trackLength: number
  trackWidth: number
  quality: PassQuality
}

/**
 * Real dragstrip photocell posts at each timing split — the trackside light-eye
 * brackets that pick up the car as it crosses each distance. Plus a finish
 * gantry arching across both lanes for a proper Santa Pod/Pomona silhouette.
 */
export function buildTrackMarkers(opts: TrackMarkersOptions): void {
  const { pc, sceneRoot, trackLength, trackWidth, quality } = opts
  const high = quality === 'high'
  const halfWidth = trackWidth / 2
  // Scene track is compressed (~132m) vs. real quarter mile (~402m); scale
  // every real-world distance so pylons line up with the actual visible strip.
  const scale = trackLength / QUARTER_METERS
  const worldAt = (meters: number): number => meters * scale

  const postMat = createMaterial(pc, {
    diffuse: [0.62, 0.64, 0.68],
    metalness: 0.55,
    gloss: 0.55,
  })
  const bracketMat = createMaterial(pc, {
    diffuse: [0.14, 0.16, 0.2],
    metalness: 0.35,
    gloss: 0.4,
  })
  const boardMat = createMaterial(pc, {
    diffuse: [0.9, 0.9, 0.92],
    metalness: 0.05,
    gloss: 0.28,
  })
  const boardBandMat = createMaterial(pc, {
    diffuse: [0.12, 0.24, 0.5],
    metalness: 0.08,
    gloss: 0.32,
  })
  const eyeMat = createMaterial(pc, {
    diffuse: [1, 0.28, 0.18],
    emissive: [0.9, 0.25, 0.15],
    emissiveIntensity: 0.85,
    metalness: 0.1,
    gloss: 0.72,
  })
  const gantryMat = createMaterial(pc, {
    diffuse: [0.22, 0.24, 0.28],
    metalness: 0.5,
    gloss: 0.4,
  })

  const splits: Array<{ id: string; meters: number }> = [
    { id: '60ft', meters: 18.29 },
    { id: '330ft', meters: 100.58 },
    { id: '660ft', meters: 201.17 },
    { id: '1000ft', meters: 304.8 },
    { id: '1320ft', meters: 402.34 },
  ]

  splits.forEach((split) => {
    ;([-halfWidth - 1.35, halfWidth + 1.35] as number[]).forEach((z, side) => {
      const cluster = new pc.Entity(`timing-${split.id}-${side}`)
      cluster.setLocalPosition(worldAt(split.meters), 0, z)

      cluster.addChild(
        createPrimitive(pc, {
          name: 'post',
          type: 'cylinder',
          position: [0, 1.7, 0],
          scale: [0.09, 3.4, 0.09],
          material: postMat,
          castShadows: high,
        }),
      )

      const bracketZ = z < 0 ? 0.28 : -0.28
      cluster.addChild(
        createPrimitive(pc, {
          name: 'bracket',
          type: 'box',
          position: [0, 1.05, bracketZ],
          scale: [0.12, 0.22, 0.55],
          material: bracketMat,
          castShadows: false,
        }),
      )

      cluster.addChild(
        createPrimitive(pc, {
          name: 'eye',
          type: 'sphere',
          position: [0, 1.05, bracketZ * 1.7],
          scale: [0.12, 0.12, 0.12],
          material: eyeMat,
          castShadows: false,
        }),
      )

      const boardZ = z < 0 ? 0.32 : -0.32
      cluster.addChild(
        createPrimitive(pc, {
          name: 'board',
          type: 'box',
          position: [0, 2.9, boardZ],
          scale: [0.06, 0.72, 1.35],
          material: boardMat,
          castShadows: high,
        }),
      )
      cluster.addChild(
        createPrimitive(pc, {
          name: 'board-band',
          type: 'box',
          position: [0, 2.55, boardZ + (z < 0 ? 0.01 : -0.01)],
          scale: [0.04, 0.18, 1.28],
          material: boardBandMat,
          castShadows: false,
        }),
      )

      sceneRoot.addChild(cluster)
    })
  })

  // Finish gantry — arches over the strip at the 1320' line so the far end
  // reads as a proper drag strip, not just an open runway.
  const finishX = worldAt(QUARTER_METERS)
  const gantry = new pc.Entity('finish-gantry')
  gantry.setLocalPosition(finishX, 0, 0)

  ;([-halfWidth - 1.6, halfWidth + 1.6] as number[]).forEach((z, side) => {
    gantry.addChild(
      createPrimitive(pc, {
        name: `gantry-leg-${side}`,
        type: 'box',
        position: [0, 4.2, z],
        scale: [0.55, 8.4, 0.55],
        material: gantryMat,
        castShadows: high,
      }),
    )
  })

  gantry.addChild(
    createPrimitive(pc, {
      name: 'gantry-beam',
      type: 'box',
      position: [0, 8.35, 0],
      scale: [0.6, 0.55, trackWidth + 3.6],
      material: gantryMat,
      castShadows: high,
    }),
  )

  gantry.addChild(
    createPrimitive(pc, {
      name: 'gantry-facia',
      type: 'box',
      position: [-0.35, 8.35, 0],
      scale: [0.08, 0.42, trackWidth + 3.2],
      material: boardBandMat,
      castShadows: false,
    }),
  )

  sceneRoot.addChild(gantry)

  // Distance strip painted under the finish gantry (just past 1320') so the
  // last few metres feel like actual dragstrip pavement, not empty tarmac.
  const trapMat = createMaterial(pc, {
    diffuse: [0.86, 0.86, 0.9],
    metalness: 0.02,
    gloss: 0.14,
  })
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'finish-stripe',
      type: 'box',
      position: [finishX, 0.021, 0],
      scale: [0.35, 0.005, trackWidth + 0.6],
      material: trapMat,
      castShadows: false,
      receiveShadows: false,
    }),
  )

  const shutdownStart = finishX + worldAt(20)
  const shutdownLength = Math.max(20, trackLength - finishX)
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'shutdown-stripe',
      type: 'box',
      position: [shutdownStart + shutdownLength / 2, 0.02, 0],
      scale: [shutdownLength, 0.004, trackWidth + 0.2],
      material: trapMat,
      castShadows: false,
      receiveShadows: false,
    }),
  )
}
