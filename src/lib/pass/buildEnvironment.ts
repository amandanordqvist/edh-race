import type { Entity, Texture } from 'playcanvas'

import { buildBarrierBoards, type SponsorTextureEntry } from './buildBarrierBoards'
import { buildChristmasTree, type TreeMode } from './buildChristmasTree'
import { buildGrandstandsAndSky } from './buildGrandstands'
import { buildShutdown } from './buildShutdown'
import { buildStripSurface } from './buildStripSurface'
import { buildTrackMarkers } from './buildTrackMarkers'
import { BARRIER_Z, SHUTDOWN_LENGTH, TRACK_LENGTH, TRACK_WIDTH } from './passLayout'
import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'

export type { TreeMode }
export type { SponsorTextureEntry }

export type PassEnvironment = {
  trackLength: number
  treeBulbs: {
    stage: Entity[]
    amber: Entity[]
    green: Entity[]
  }
  stripLightMaterials: import('playcanvas').StandardMaterial[]
  setTreeLights: (mode: TreeMode) => void
}

export function buildPassEnvironment(
  pc: PlayCanvasNamespace,
  sceneRoot: Entity,
  quality: PassQuality,
  sponsorTextures: SponsorTextureEntry[] = [],
  extras: {
    asphaltRough?: Texture | null
    christmasTreeMesh?: Entity | null
    hideSkyPlanes?: boolean
  } = {},
): PassEnvironment {
  const high = quality === 'high'
  const halfTrack = (TRACK_LENGTH + SHUTDOWN_LENGTH) / 2

  const wallWhite = createMaterial(pc, {
    diffuse: [0.9, 0.9, 0.88],
    metalness: 0.06,
    gloss: 0.22,
  })
  const wallShadow = createMaterial(pc, {
    diffuse: [0.78, 0.78, 0.76],
    metalness: 0.06,
    gloss: 0.16,
  })
  const metal = createMaterial(pc, {
    diffuse: [0.2, 0.21, 0.24],
    metalness: 0.48,
    gloss: 0.4,
  })
  const stripLight = createMaterial(pc, {
    diffuse: [0.85, 0.88, 0.92],
    emissive: [0.75, 0.82, 0.95],
    emissiveIntensity: 0.04,
    metalness: 0.1,
    gloss: 0.35,
  })
  const stripLightMaterials: import('playcanvas').StandardMaterial[] = [stripLight]

  buildStripSurface({ pc, sceneRoot, quality, asphaltRough: extras.asphaltRough })
  buildShutdown({ pc, sceneRoot, quality })

  const barrierLen = TRACK_LENGTH + SHUTDOWN_LENGTH + 6
  ;([-BARRIER_Z, BARRIER_Z] as number[]).forEach((z, index) => {
    const facing = z < 0 ? 1 : -1
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `wall-foot-${index}`,
        type: 'box',
        position: [halfTrack, 0.22, z + facing * 0.04],
        scale: [barrierLen, 0.44, 0.72],
        material: wallWhite,
        castShadows: high,
      }),
    )
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `wall-top-${index}`,
        type: 'box',
        position: [halfTrack, 0.72, z + facing * -0.04],
        scale: [barrierLen, 0.58, 0.42],
        material: wallShadow,
        castShadows: high,
      }),
    )
  })

  const tower = new pc.Entity('timing-tower')
  tower.setLocalPosition(TRACK_LENGTH + 4.5, 0, -8.4)
  tower.addChild(
    createPrimitive(pc, {
      name: 'tower-shaft',
      type: 'box',
      position: [0, 3.2, 0],
      scale: [1.4, 6.4, 1.8],
      material: metal,
      castShadows: high,
    }),
  )
  tower.addChild(
    createPrimitive(pc, {
      name: 'tower-cabin',
      type: 'box',
      position: [0.35, 6.2, 0.4],
      scale: [3.2, 1.6, 3.2],
      material: metal,
      castShadows: high,
    }),
  )
  const towerGlass = createMaterial(pc, {
    diffuse: [0.22, 0.32, 0.48],
    emissive: [0.18, 0.28, 0.42],
    emissiveIntensity: 0.22,
    metalness: 0.12,
    gloss: 0.45,
  })
  tower.addChild(
    createPrimitive(pc, {
      name: 'tower-window',
      type: 'box',
      position: [0.38, 6.25, 2.02],
      scale: [2.4, 0.95, 0.06],
      material: towerGlass,
      castShadows: false,
      receiveShadows: false,
    }),
  )
  sceneRoot.addChild(tower)

  buildGrandstandsAndSky({
    pc,
    sceneRoot,
    trackLength: TRACK_LENGTH,
    trackWidth: TRACK_WIDTH,
    quality,
    hideSkyPlanes: extras.hideSkyPlanes,
  })

  buildBarrierBoards({
    pc,
    sceneRoot,
    trackLength: TRACK_LENGTH,
    quality,
    sponsorTextures,
  })

  buildTrackMarkers({
    pc,
    sceneRoot,
    trackLength: TRACK_LENGTH,
    trackWidth: TRACK_WIDTH,
    quality,
  })

  const tree = buildChristmasTree({
    pc,
    sceneRoot,
    quality,
    mesh: extras.christmasTreeMesh,
  })

  const lightSpacing = high ? 24 : 36
  const lightCount = Math.floor(TRACK_LENGTH / lightSpacing)
  for (let i = 0; i <= lightCount; i += 1) {
    const x = i * lightSpacing + 8
    ;([-TRACK_WIDTH / 2 - 2.4, TRACK_WIDTH / 2 + 2.4] as number[]).forEach((z, side) => {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `strip-pole-${i}-${side}`,
          type: 'cylinder',
          position: [x, 2.6, z],
          scale: [0.1, 5.2, 0.1],
          material: metal,
          castShadows: false,
        }),
      )
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `strip-fixture-${i}-${side}`,
          type: 'box',
          position: [x, 5.05, z + (side === 0 ? 0.3 : -0.3)],
          scale: [0.5, 0.16, 0.32],
          material: stripLight,
          castShadows: false,
          receiveShadows: false,
        }),
      )
    })
  }

  return {
    trackLength: TRACK_LENGTH,
    treeBulbs: tree.treeBulbs,
    stripLightMaterials,
    setTreeLights: tree.setTreeLights,
  }
}
