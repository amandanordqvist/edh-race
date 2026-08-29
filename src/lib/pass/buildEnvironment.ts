import type { Application, Entity, Texture } from 'playcanvas'

import { buildBarrierBoards, type SponsorTextureEntry } from './buildBarrierBoards'
import { buildChristmasTree, type TreeMode } from './buildChristmasTree'
import { buildEdgeRail } from './buildEdgeRail'
import { buildGrandstandsAndSky } from './buildGrandstands'
import { buildHorizon } from './buildHorizon'
import { buildShutdown } from './buildShutdown'
import { buildStripMarkings } from './buildStripMarkings'
import { buildStripSurface } from './buildStripSurface'
import { buildTrackMarkers } from './buildTrackMarkers'
import { BARRIER_Z, SHUTDOWN_LENGTH, STAGING_LENGTH, TRACK_LENGTH, TRACK_WIDTH } from './passLayout'
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
    asphaltDiffuse?: Texture | null
    christmasTreeMesh?: Entity | null
    hideSkyPlanes?: boolean
    app?: Application
  } = {},
): PassEnvironment {
  const high = quality === 'high'
  const wallStart = -STAGING_LENGTH
  const wallEnd = TRACK_LENGTH + SHUTDOWN_LENGTH + 3
  const barrierLen = wallEnd - wallStart
  const wallMid = wallStart + barrierLen / 2

  const wallWhite = createMaterial(pc, {
    diffuse: [0.62, 0.62, 0.58],
    metalness: 0.06,
    gloss: 0.18,
  })
  const wallBlue = createMaterial(pc, {
    diffuse: [0.08, 0.22, 0.48],
    metalness: 0.06,
    gloss: 0.16,
  })
  const metal = createMaterial(pc, {
    diffuse: [0.16, 0.17, 0.2],
    metalness: 0.48,
    gloss: 0.4,
  })
  const stripLight = createMaterial(pc, {
    diffuse: [0.55, 0.52, 0.45],
    emissive: [0.45, 0.38, 0.28],
    emissiveIntensity: 0.06,
    metalness: 0.1,
    gloss: 0.3,
  })
  const stripLightMaterials: import('playcanvas').StandardMaterial[] = [stripLight]

  buildStripSurface({
    pc,
    sceneRoot,
    quality,
    asphaltRough: extras.asphaltRough,
    asphaltDiffuse: extras.asphaltDiffuse,
  })
  buildShutdown({ pc, sceneRoot, quality })

  ;([-BARRIER_Z, BARRIER_Z] as number[]).forEach((z, index) => {
    const facing = z < 0 ? 1 : -1
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `wall-foot-${index}`,
        type: 'box',
        position: [wallMid, 0.22, z + facing * 0.04],
        scale: [barrierLen, 0.44, 0.72],
        material: wallWhite,
        castShadows: high,
      }),
    )
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `wall-top-${index}`,
        type: 'box',
        position: [wallMid, 0.72, z + facing * -0.04],
        scale: [barrierLen, 0.58, 0.42],
        material: wallBlue,
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
    app: extras.app,
  })

  buildHorizon({
    pc,
    app: extras.app,
    sceneRoot,
    quality,
  })

  buildBarrierBoards({
    pc,
    sceneRoot,
    trackLength: TRACK_LENGTH,
    quality,
    sponsorTextures,
  })

  if (extras.app) {
    buildEdgeRail({ pc, app: extras.app, sceneRoot, quality })
  } else {
    console.warn('[pass] Edge rail skipped — no PlayCanvas application')
  }

  buildTrackMarkers({
    pc,
    sceneRoot,
    trackLength: TRACK_LENGTH,
    trackWidth: TRACK_WIDTH,
    quality,
  })

  buildStripMarkings({
    pc,
    app: extras.app,
    sceneRoot,
    quality,
  })

  const tree = buildChristmasTree({
    pc,
    sceneRoot,
    quality,
    mesh: extras.christmasTreeMesh,
  })

  const lightSpacing = high ? 12 : 20
  const lightCount = Math.floor((TRACK_LENGTH + STAGING_LENGTH) / lightSpacing)
  for (let i = 0; i <= lightCount; i += 1) {
    const x = i * lightSpacing - 8
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
