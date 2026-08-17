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
  activeDiffuse: [number, number, number]
  idleDiffuse: [number, number, number]
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
  const idleDiffuse: [number, number, number] = [
    color[0] * 0.12,
    color[1] * 0.12,
    color[2] * 0.12,
  ]
  const material = createMaterial(pc, {
    diffuse: idleDiffuse,
    emissive: color,
    emissiveIntensity: 0,
    metalness: 0.15,
    gloss: 0.55,
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
    activeIntensity: 2.4,
    idleIntensity: 0,
    activeDiffuse: color,
    idleDiffuse,
  }
}

function setBulbState(bulb: TreeBulb, enabled: boolean): void {
  const diffuse = enabled ? bulb.activeDiffuse : bulb.idleDiffuse
  bulb.material.diffuse.set(...diffuse)
  bulb.material.emissiveIntensity = enabled ? bulb.activeIntensity : bulb.idleIntensity
  bulb.material.update()
}

/**
 * Dual-column Pro tree between the lanes — slim, dark housing, lenses that
 * only glow when armed. Keeps visual priority on the Camaro.
 */
export function buildChristmasTree(opts: ChristmasTreeOptions): ChristmasTree {
  const { pc, sceneRoot, quality, mesh } = opts
  const high = quality === 'high'
  const useMesh = Boolean(mesh)

  const metal = createMaterial(pc, {
    diffuse: [0.12, 0.13, 0.15],
    metalness: 0.65,
    gloss: 0.42,
  })
  const housing = createMaterial(pc, {
    diffuse: [0.04, 0.045, 0.05],
    metalness: 0.35,
    gloss: 0.28,
  })
  const concrete = createMaterial(pc, {
    diffuse: [0.38, 0.37, 0.35],
    metalness: 0.08,
    gloss: 0.14,
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
        position: [0, 0.08, 0],
        scale: [0.45, 0.16, 0.45],
        material: concrete,
        castShadows: high,
      }),
    )
    tree.addChild(
      createPrimitive(pc, {
        name: 'tree-pole',
        type: 'cylinder',
        position: [0, 2.35, 0],
        scale: [0.1, 4.6, 0.1],
        material: metal,
        castShadows: high,
      }),
    )
    tree.addChild(
      createPrimitive(pc, {
        name: 'tree-crossbar',
        type: 'box',
        position: [0, 4.55, 0],
        scale: [0.12, 0.1, 2.6],
        material: metal,
        castShadows: high,
      }),
    )
  }

  const stageBulbs: TreeBulb[] = []
  const amberBulbs: TreeBulb[] = []
  const greenBulbs: TreeBulb[] = []

  // Compact lens columns — face the drivers (−X). Smaller when mesh is present
  // so they sit as accents on the asset instead of floating orbs.
  const laneSpan = useMesh ? 0.85 : 0.95
  const faceX = useMesh ? -0.22 : -0.28
  const bulbScale = useMesh ? 0.1 : 0.14

  ;([-laneSpan, laneSpan] as number[]).forEach((laneZ, column) => {
    if (!useMesh) {
      tree.addChild(
        createPrimitive(pc, {
          name: `tree-board-${column}`,
          type: 'box',
          position: [-0.14, 2.45, laneZ],
          scale: [0.12, 3.8, 0.48],
          material: housing,
          castShadows: high,
        }),
      )
    }

    stageBulbs.push(
      createTreeBulb(pc, `pre-stage-${column}`, [faceX, 4.15, laneZ], [0.95, 0.9, 0.35], bulbScale),
      createTreeBulb(pc, `stage-${column}`, [faceX, 3.78, laneZ], [0.95, 0.9, 0.35], bulbScale * 1.1),
    )
    amberBulbs.push(
      createTreeBulb(pc, `amber-1-${column}`, [faceX, 3.2, laneZ], [0.95, 0.5, 0.08], bulbScale * 1.15),
      createTreeBulb(pc, `amber-2-${column}`, [faceX, 2.72, laneZ], [0.95, 0.5, 0.08], bulbScale * 1.15),
      createTreeBulb(pc, `amber-3-${column}`, [faceX, 2.24, laneZ], [0.95, 0.5, 0.08], bulbScale * 1.15),
    )
    greenBulbs.push(
      createTreeBulb(pc, `green-${column}`, [faceX, 1.7, laneZ], [0.2, 0.85, 0.32], bulbScale * 1.25),
    )

    const red = createTreeBulb(pc, `red-${column}`, [faceX, 1.2, laneZ], [0.85, 0.14, 0.12], bulbScale * 1.1)
    tree.addChild(red.entity)
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
