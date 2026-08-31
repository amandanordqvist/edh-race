import type { Application, Entity, StandardMaterial } from 'playcanvas'

import type { PassQuality } from './types'
import { createCrowdPalette, spawnCrowdOnBay } from './buildCrowd'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'

type GrandstandOptions = {
  pc: PlayCanvasNamespace
  sceneRoot: Entity
  trackLength: number
  trackWidth: number
  quality: PassQuality
  hideSkyPlanes?: boolean
  app?: Application
}

/**
 * Bay-based grandstands: stepped seating + crowd ribbons + canopy.
 * Avoids one endless Lego slab and unique-material crowd cubes.
 */
export function buildGrandstandsAndSky(opts: GrandstandOptions): void {
  const { pc, sceneRoot, trackLength, trackWidth, quality, hideSkyPlanes, app } = opts
  const high = quality === 'high'
  const halfTrack = trackLength / 2
  const sideOffset = trackWidth / 2 + 8.8

  const field = createMaterial(pc, {
    diffuse: [0.28, 0.34, 0.22],
    metalness: 0.02,
    gloss: 0.06,
    useSkybox: false,
  })
  const structure = createMaterial(pc, {
    diffuse: [0.16, 0.17, 0.19],
    metalness: 0.12,
    gloss: 0.18,
  })
  const seat = createMaterial(pc, {
    diffuse: [0.11, 0.12, 0.14],
    metalness: 0.06,
    gloss: 0.1,
  })
  const seatStep = createMaterial(pc, {
    diffuse: [0.15, 0.16, 0.18],
    metalness: 0.06,
    gloss: 0.12,
  })
  const rail = createMaterial(pc, {
    diffuse: [0.45, 0.47, 0.5],
    metalness: 0.4,
    gloss: 0.38,
  })
  const canopy = createMaterial(pc, {
    diffuse: [0.1, 0.11, 0.13],
    metalness: 0.2,
    gloss: 0.22,
  })
  const fascia = createMaterial(pc, {
    diffuse: [0.14, 0.16, 0.2],
    metalness: 0.08,
    gloss: 0.18,
  })
  const crowdPalette = createCrowdPalette(pc, app)
  const bannerNavy = createMaterial(pc, {
    diffuse: [0.1, 0.16, 0.28],
    metalness: 0.05,
    gloss: 0.22,
  })
  const bannerSlate = createMaterial(pc, {
    diffuse: [0.22, 0.24, 0.28],
    metalness: 0.05,
    gloss: 0.2,
  })
  const bannerBone = createMaterial(pc, {
    diffuse: [0.78, 0.8, 0.82],
    metalness: 0.04,
    gloss: 0.18,
  })
  const bannerAccent = createMaterial(pc, {
    diffuse: [0.2, 0.24, 0.3],
    metalness: 0.05,
    gloss: 0.22,
  })
  const flagPole = createMaterial(pc, {
    diffuse: [0.28, 0.3, 0.32],
    metalness: 0.45,
    gloss: 0.4,
  })

  if (!hideSkyPlanes) {
    const skyZenith = createMaterial(pc, {
      diffuse: [0.28, 0.52, 0.92],
      emissive: [0.42, 0.64, 0.98],
      emissiveIntensity: 0.95,
      metalness: 0,
      gloss: 0.02,
    })
    const skyHorizon = createMaterial(pc, {
      diffuse: [0.78, 0.88, 0.98],
      emissive: [0.72, 0.84, 0.98],
      emissiveIntensity: 0.7,
      metalness: 0,
      gloss: 0.02,
    })
    const skyHorizonCool = createMaterial(pc, {
      diffuse: [0.58, 0.76, 0.96],
      emissive: [0.52, 0.72, 0.96],
      emissiveIntensity: 0.72,
      metalness: 0,
      gloss: 0.02,
    })
    ;[skyZenith, skyHorizon, skyHorizonCool].forEach((material) => {
      material.useLighting = false
      material.update()
    })
    const skyPlanes: Array<{
      name: string
      position: [number, number, number]
      scale: [number, number, number]
      material: StandardMaterial
    }> = [
      {
        name: 'sky-far',
        position: [trackLength + 55, 28, 0],
        scale: [8, 70, trackWidth + 180],
        material: skyHorizon,
      },
      {
        name: 'sky-near',
        position: [-40, 26, 0],
        scale: [8, 65, trackWidth + 160],
        material: skyHorizonCool,
      },
      {
        name: 'sky-left',
        position: [halfTrack, 26, -62],
        scale: [trackLength + 140, 60, 8],
        material: skyHorizonCool,
      },
      {
        name: 'sky-right',
        position: [halfTrack, 26, 62],
        scale: [trackLength + 140, 60, 8],
        material: skyHorizon,
      },
      {
        name: 'sky-cap',
        position: [halfTrack, 58, 0],
        scale: [trackLength + 160, 6, trackWidth + 160],
        material: skyZenith,
      },
    ]
    skyPlanes.forEach((plane) => {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: plane.name,
          type: 'box',
          position: plane.position,
          scale: plane.scale,
          material: plane.material,
          castShadows: false,
          receiveShadows: false,
        }),
      )
    })
  }

  // Soft field beyond barriers — kills the empty blue floor void.
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'field-left',
      type: 'box',
      position: [halfTrack, -0.7, -sideOffset - 18],
      scale: [trackLength + 160, 0.4, 40],
      material: field,
      castShadows: false,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'field-right',
      type: 'box',
      position: [halfTrack, -0.7, sideOffset + 18],
      scale: [trackLength + 160, 0.4, 40],
      material: field,
      castShadows: false,
    }),
  )

  const bayCount = high ? 5 : 3
  const bayGap = 1.6
  const standStart = -4
  const standLength = trackLength - 8
  const bayLength = (standLength - bayGap * (bayCount - 1)) / bayCount

  ;([-sideOffset, sideOffset] as number[]).forEach((z, sideIndex) => {
    const facing = z < 0 ? 1 : -1

    for (let bay = 0; bay < bayCount; bay += 1) {
      const bayX = standStart + bay * (bayLength + bayGap) + bayLength * 0.5
      const bayRoot = new pc.Entity(`stand-${sideIndex}-bay-${bay}`)
      bayRoot.setLocalPosition(bayX, 0, z)

      // Base plinth + muted EDH fascia (not candy blue slab).
      bayRoot.addChild(
        createPrimitive(pc, {
          name: `plinth-${bay}`,
          type: 'box',
          position: [0, 0.7, facing * 0.2],
          scale: [bayLength, 1.4, 4.2],
          material: structure,
          castShadows: high,
        }),
      )
      bayRoot.addChild(
        createPrimitive(pc, {
          name: `fascia-${bay}`,
          type: 'box',
          position: [0, 1.15, facing * 2.15],
          scale: [bayLength * 0.92, 0.55, 0.12],
          material: fascia,
          castShadows: false,
        }),
      )

      // Stepped seating (3 risers) — reads as stands, not one mega-box.
      for (let step = 0; step < 3; step += 1) {
        bayRoot.addChild(
          createPrimitive(pc, {
            name: `step-${bay}-${step}`,
            type: 'box',
            position: [0, 1.55 + step * 0.85, facing * (-0.4 - step * 1.05)],
            scale: [bayLength * 0.96, 0.55, 1.35],
            material: step % 2 === 0 ? seat : seatStep,
            castShadows: high && step === 2,
          }),
        )
      }

      // Real spectators — small bodies + heads with shared palette.
      spawnCrowdOnBay({
        pc,
        parent: bayRoot,
        palette: crowdPalette,
        bayLength,
        facing: facing as 1 | -1,
        quality,
        seedOffset: sideIndex * 100 + bay,
      })

      bayRoot.addChild(
        createPrimitive(pc, {
          name: `rail-${bay}`,
          type: 'box',
          position: [0, 4.15, facing * -3.2],
          scale: [bayLength * 0.98, 0.1, 0.14],
          material: rail,
          castShadows: false,
        }),
      )

      // Canopy roof
      bayRoot.addChild(
        createPrimitive(pc, {
          name: `canopy-${bay}`,
          type: 'box',
          position: [0, 5.1, facing * -1.6],
          scale: [bayLength * 1.02, 0.16, 5.2],
          material: canopy,
          castShadows: high,
        }),
      )

      sceneRoot.addChild(bayRoot)
    }
  })

  // Restrained banners — navy / slate / bone / EDH blue (no candy red/yellow).
  const banners = [bannerNavy, bannerSlate, bannerBone, bannerAccent]
  const bannerCount = high ? 4 : 3
  ;([-trackWidth / 2 - 1.15, trackWidth / 2 + 1.15] as number[]).forEach((z, side) => {
    for (let i = 0; i < bannerCount; i += 1) {
      const x = 4 + i * ((trackLength - 18) / Math.max(1, bannerCount - 1))
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `banner-frame-${side}-${i}`,
          type: 'box',
          position: [x, 1.05, z],
          scale: [10.2, 0.95, 0.12],
          material: structure,
          castShadows: false,
        }),
      )
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `banner-${side}-${i}`,
          type: 'box',
          position: [x, 1.05, z + (z < 0 ? 0.06 : -0.06)],
          scale: [9.6, 0.72, 0.06],
          material: banners[i % banners.length],
          castShadows: false,
        }),
      )
    }
  })

  // Sparse tall flags — not a picket fence of poles.
  const flagSpacing = high ? 28 : 40
  for (let x = 6; x < trackLength - 10; x += flagSpacing) {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `flag-pole-${x}`,
        type: 'cylinder',
        position: [x, 3.4, -trackWidth / 2 - 3.6],
        scale: [0.06, 6.8, 0.06],
        material: flagPole,
        castShadows: false,
      }),
    )
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `flag-cloth-${x}`,
        type: 'box',
        position: [x + 0.7, 6.2, -trackWidth / 2 - 3.6],
        scale: [1.35, 0.7, 0.05],
        material: Math.floor(x / flagSpacing) % 2 === 0 ? bannerAccent : bannerBone,
        castShadows: false,
      }),
    )
  }
}
