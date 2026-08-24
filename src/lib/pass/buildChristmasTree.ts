import type { Entity } from 'playcanvas'

import { collectModelBounds } from './camaroRig'
import { CHRISTMAS_TREE_X } from './passLayout'
import type { PassQuality } from './types'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'

export type TreeMode = 'off' | 'prestage' | 'stage' | 'amber' | 'green'

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
  mesh?: Entity | null
}

type BulbLayout = {
  faceX: number
  laneSpan: number
  scale: number
  preY: number
  stageY: number
  amberY: [number, number, number]
  greenY: number
}

function createTreeBulb(
  pc: PlayCanvasNamespace,
  name: string,
  position: [number, number, number],
  color: [number, number, number],
  scale: number,
  cupMaterial: import('playcanvas').StandardMaterial,
): TreeBulb {
  const idleDiffuse: [number, number, number] = [
    color[0] * 0.04,
    color[1] * 0.04,
    color[2] * 0.04,
  ]
  const material = createMaterial(pc, {
    diffuse: idleDiffuse,
    emissive: color,
    emissiveIntensity: 0,
    metalness: 0.08,
    gloss: 0.7,
  })

  const fixture = new pc.Entity(name)
  fixture.setLocalPosition(...position)
  fixture.addChild(
    createPrimitive(pc, {
      name: `${name}-cup`,
      type: 'cylinder',
      position: [0.02, 0, 0],
      scale: [scale * 1.55, scale * 0.55, scale * 1.55],
      material: cupMaterial,
      castShadows: false,
      receiveShadows: false,
    }),
  )
  fixture.addChild(
    createPrimitive(pc, {
      name: `${name}-lens`,
      type: 'sphere',
      position: [-0.015, 0, 0],
      scale: [scale, scale, scale],
      material,
      castShadows: false,
      receiveShadows: false,
    }),
  )

  return {
    entity: fixture,
    material,
    activeIntensity: 4.4,
    idleIntensity: 0.04,
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

function resolveLayout(tree: Entity, mesh: Entity | null): BulbLayout {
  const fallback: BulbLayout = {
    faceX: -0.28,
    laneSpan: 0.95,
    scale: 0.13,
    preY: 4.15,
    stageY: 3.78,
    amberY: [3.2, 2.72, 2.24],
    greenY: 1.7,
  }
  if (!mesh) return fallback

  const bounds = collectModelBounds(mesh)
  if (!bounds) return { ...fallback, faceX: -0.22, laneSpan: 0.85, scale: 0.1 }

  const origin = tree.getPosition()
  const minX = bounds.min[0] - origin.x
  const minY = bounds.min[1] - origin.y
  const maxY = bounds.max[1] - origin.y
  const minZ = bounds.min[2] - origin.z
  const maxZ = bounds.max[2] - origin.z
  const height = Math.max(2.4, maxY - minY)
  const top = maxY - height * 0.08
  const span = height * 0.52

  return {
    faceX: minX - 0.05,
    laneSpan: Math.max(0.38, (maxZ - minZ) * 0.22),
    scale: 0.09,
    preY: top,
    stageY: top - span * 0.12,
    amberY: [top - span * 0.32, top - span * 0.48, top - span * 0.64],
    greenY: top - span * 0.82,
  }
}

/**
 * Dual-column Pro tree. Overlay lenses sit in metal cups so idle lamps never
 * read as floating orbs. A point light sells the glow without neon bloom.
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
  tree.setLocalPosition(CHRISTMAS_TREE_X, 0, 0)

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

  sceneRoot.addChild(tree)
  tree.syncHierarchy()

  const layout = resolveLayout(tree, mesh ?? null)
  const preStageBulbs: TreeBulb[] = []
  const stageBulbs: TreeBulb[] = []
  const amberBulbs: TreeBulb[] = []
  const greenBulbs: TreeBulb[] = []

  ;([-layout.laneSpan, layout.laneSpan] as number[]).forEach((laneZ, column) => {
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

    preStageBulbs.push(
      createTreeBulb(pc, `pre-stage-${column}`, [layout.faceX, layout.preY, laneZ], [0.95, 0.9, 0.35], layout.scale, housing),
    )
    stageBulbs.push(
      createTreeBulb(pc, `stage-${column}`, [layout.faceX, layout.stageY, laneZ], [0.95, 0.9, 0.35], layout.scale * 1.08, housing),
    )
    amberBulbs.push(
      createTreeBulb(pc, `amber-1-${column}`, [layout.faceX, layout.amberY[0], laneZ], [0.95, 0.5, 0.08], layout.scale * 1.12, housing),
      createTreeBulb(pc, `amber-2-${column}`, [layout.faceX, layout.amberY[1], laneZ], [0.95, 0.5, 0.08], layout.scale * 1.12, housing),
      createTreeBulb(pc, `amber-3-${column}`, [layout.faceX, layout.amberY[2], laneZ], [0.95, 0.5, 0.08], layout.scale * 1.12, housing),
    )
    greenBulbs.push(
      createTreeBulb(pc, `green-${column}`, [layout.faceX, layout.greenY, laneZ], [0.2, 0.85, 0.32], layout.scale * 1.2, housing),
    )
  })

  ;[...preStageBulbs, ...stageBulbs, ...amberBulbs, ...greenBulbs].forEach((bulb) => {
    tree.addChild(bulb.entity)
  })

  const glow = new pc.Entity('tree-glow')
  glow.setLocalPosition(0, 2.6, 0)
  glow.addComponent('light', {
    type: 'point',
    color: new pc.Color(0.95, 0.82, 0.35),
    intensity: 0,
    range: 9,
    castShadows: false,
  })
  tree.addChild(glow)

  const setGlow = (color: [number, number, number], intensity: number) => {
    const light = glow.light
    if (!light) return
    light.color.set(...color)
    light.intensity = intensity
  }

  const setTreeLights = (mode: TreeMode) => {
    switch (mode) {
      case 'off':
        preStageBulbs.forEach((bulb) => setBulbState(bulb, false))
        stageBulbs.forEach((bulb) => setBulbState(bulb, false))
        amberBulbs.forEach((bulb) => setBulbState(bulb, false))
        greenBulbs.forEach((bulb) => setBulbState(bulb, false))
        setGlow([0.95, 0.82, 0.35], 0)
        return
      case 'prestage':
        preStageBulbs.forEach((bulb) => setBulbState(bulb, true))
        stageBulbs.forEach((bulb) => setBulbState(bulb, false))
        amberBulbs.forEach((bulb) => setBulbState(bulb, false))
        greenBulbs.forEach((bulb) => setBulbState(bulb, false))
        setGlow([0.95, 0.88, 0.4], 1.1)
        return
      case 'stage':
        preStageBulbs.forEach((bulb) => setBulbState(bulb, true))
        stageBulbs.forEach((bulb) => setBulbState(bulb, true))
        amberBulbs.forEach((bulb) => setBulbState(bulb, false))
        greenBulbs.forEach((bulb) => setBulbState(bulb, false))
        setGlow([0.95, 0.88, 0.4], 1.6)
        return
      case 'amber':
        preStageBulbs.forEach((bulb) => setBulbState(bulb, true))
        stageBulbs.forEach((bulb) => setBulbState(bulb, true))
        amberBulbs.forEach((bulb) => setBulbState(bulb, true))
        greenBulbs.forEach((bulb) => setBulbState(bulb, false))
        setGlow([0.95, 0.55, 0.12], 2.2)
        return
      case 'green':
        preStageBulbs.forEach((bulb) => setBulbState(bulb, true))
        stageBulbs.forEach((bulb) => setBulbState(bulb, true))
        amberBulbs.forEach((bulb) => setBulbState(bulb, false))
        greenBulbs.forEach((bulb) => setBulbState(bulb, true))
        setGlow([0.25, 0.9, 0.4], 2.6)
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
      stage: [...preStageBulbs, ...stageBulbs].map((bulb) => bulb.entity),
      amber: amberBulbs.map((bulb) => bulb.entity),
      green: greenBulbs.map((bulb) => bulb.entity),
    },
    setTreeLights,
  }
}
