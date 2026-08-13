import type { Entity } from 'playcanvas'

import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'

export type TreeMode = 'off' | 'stage' | 'amber' | 'green'

type TreeBulb = {
  entity: Entity
  material: import('playcanvas').StandardMaterial
  activeIntensity: number
  idleIntensity: number
}

export type ChristmasTree = {
  treeBulbs: {
    stage: Entity[]
    amber: Entity[]
    green: Entity[]
  }
  setTreeLights: (mode: TreeMode) => void
}

type ChristmasTreeOptions = {
  pc: PlayCanvasNamespace
  sceneRoot: Entity
  quality: PassQuality
  /** Fitted Sketchfab tree; when present we skip the primitive pole/boards. */
  mesh?: Entity | null
}

function createTreeBulb(
  pc: PlayCanvasNamespace,
  name: string,
  position: [number, number, number],
  color: [number, number, number],
  scale: number,
): TreeBulb {
  const material = createMaterial(pc, {
    diffuse: color,
    emissive: color,
    emissiveIntensity: 0.08,
    metalness: 0,
    gloss: 0.62,
  })

  return {
    entity: createPrimitive(pc, {
      name,
      type: 'sphere',
      position,
      scale: [scale, scale, scale],
      material,
      castShadows: false,
      receiveShadows: false,
    }),
    material,
    activeIntensity: 4.2,
    idleIntensity: 0.08,
  }
}

function setBulbState(bulb: TreeBulb, enabled: boolean): void {
  bulb.material.emissiveIntensity = enabled ? bulb.activeIntensity : bulb.idleIntensity
  bulb.material.update()
}

/**
 * Dual-column Pro tree sitting between the lanes, slightly past the stage
 * beams — the NHRA silhouette the chase camera should read down-track.
 */
export function buildChristmasTree(opts: ChristmasTreeOptions): ChristmasTree {
  const { pc, sceneRoot, quality, mesh } = opts
  const high = quality === 'high'
  const useMesh = Boolean(mesh)

  const metal = createMaterial(pc, {
    diffuse: [0.18, 0.19, 0.22],
    metalness: 0.62,
    gloss: 0.48,
  })
  const housing = createMaterial(pc, {
    diffuse: [0.06, 0.07, 0.08],
    metalness: 0.4,
    gloss: 0.32,
  })
  const concrete = createMaterial(pc, {
    diffuse: [0.72, 0.72, 0.7],
    metalness: 0.08,
    gloss: 0.16,
  })

  const tree = new pc.Entity('christmas-tree')
  // Ahead of the stage beams, dead-center between lanes.
  tree.setLocalPosition(5.4, 0, 0)

  if (mesh) {
    tree.addChild(mesh)
  } else {
    tree.addChild(
      createPrimitive(pc, {
        name: 'tree-base',
        type: 'cylinder',
        position: [0, 0.1, 0],
        scale: [0.7, 0.2, 0.7],
        material: concrete,
        castShadows: high,
      }),
    )
    tree.addChild(
      createPrimitive(pc, {
        name: 'tree-pole',
        type: 'cylinder',
        position: [0, 2.6, 0],
        scale: [0.16, 5.2, 0.16],
        material: metal,
        castShadows: high,
      }),
    )
    tree.addChild(
      createPrimitive(pc, {
        name: 'tree-crossbar',
        type: 'box',
        position: [0, 4.95, 0],
        scale: [0.16, 0.14, 3.4],
        material: metal,
        castShadows: high,
      }),
    )
  }

  const stageBulbs: TreeBulb[] = []
  const amberBulbs: TreeBulb[] = []
  const greenBulbs: TreeBulb[] = []

  // Two columns, one per lane. Lights face the drivers (−X).
  ;([-1.05, 1.05] as number[]).forEach((laneZ, column) => {
    if (!useMesh) {
      tree.addChild(
        createPrimitive(pc, {
          name: `tree-board-${column}`,
          type: 'box',
          position: [-0.18, 2.7, laneZ],
          scale: [0.18, 4.4, 0.72],
          material: housing,
          castShadows: high,
        }),
      )
    }

    const faceX = -0.32
    stageBulbs.push(
      createTreeBulb(pc, `pre-stage-${column}`, [faceX, 4.55, laneZ], [0.95, 0.92, 0.35], 0.22),
      createTreeBulb(pc, `stage-${column}`, [faceX, 4.12, laneZ], [0.95, 0.92, 0.35], 0.26),
    )
    amberBulbs.push(
      createTreeBulb(pc, `amber-1-${column}`, [faceX, 3.45, laneZ], [0.95, 0.52, 0.08], 0.32),
      createTreeBulb(pc, `amber-2-${column}`, [faceX, 2.85, laneZ], [0.95, 0.52, 0.08], 0.32),
      createTreeBulb(pc, `amber-3-${column}`, [faceX, 2.25, laneZ], [0.95, 0.52, 0.08], 0.32),
    )
    greenBulbs.push(
      createTreeBulb(pc, `green-${column}`, [faceX, 1.55, laneZ], [0.22, 0.88, 0.36], 0.38),
    )
    tree.addChild(
      createTreeBulb(pc, `red-${column}`, [faceX, 0.95, laneZ], [0.9, 0.16, 0.14], 0.3).entity,
    )
  })

  ;[...stageBulbs, ...amberBulbs, ...greenBulbs].forEach((bulb) => {
    tree.addChild(bulb.entity)
  })
  sceneRoot.addChild(tree)

  const setTreeLights = (mode: TreeMode) => {
    switch (mode) {
      case 'off':
        stageBulbs.forEach((bulb) => setBulbState(bulb, false))
        amberBulbs.forEach((bulb) => setBulbState(bulb, false))
        greenBulbs.forEach((bulb) => setBulbState(bulb, false))
        return
      case 'stage':
        stageBulbs.forEach((bulb) => setBulbState(bulb, true))
        amberBulbs.forEach((bulb) => setBulbState(bulb, false))
        greenBulbs.forEach((bulb) => setBulbState(bulb, false))
        return
      case 'amber':
        stageBulbs.forEach((bulb) => setBulbState(bulb, true))
        amberBulbs.forEach((bulb) => setBulbState(bulb, true))
        greenBulbs.forEach((bulb) => setBulbState(bulb, false))
        return
      case 'green':
        stageBulbs.forEach((bulb) => setBulbState(bulb, true))
        amberBulbs.forEach((bulb) => setBulbState(bulb, false))
        greenBulbs.forEach((bulb) => setBulbState(bulb, true))
        return
      default: {
        const exhaustive: never = mode
        return exhaustive
      }
    }
  }

  setTreeLights('off')

  return {
    treeBulbs: {
      stage: stageBulbs.map((bulb) => bulb.entity),
      amber: amberBulbs.map((bulb) => bulb.entity),
      green: greenBulbs.map((bulb) => bulb.entity),
    },
    setTreeLights,
  }
}
