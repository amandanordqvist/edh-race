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

export type PassEnvironment = {
  trackLength: number
  treeBulbs: {
    stage: Entity[]
    amber: Entity[]
    green: Entity[]
  }
  setTreeLights: (mode: TreeMode) => void
}

function createTreeBulb(
  pc: PlayCanvasNamespace,
  name: string,
  position: [number, number, number],
  color: [number, number, number],
): TreeBulb {
  const material = createMaterial(pc, {
    diffuse: color,
    emissive: color,
    emissiveIntensity: 0.06,
    metalness: 0,
    gloss: 0.5,
  })

  return {
    entity: createPrimitive(pc, {
      name,
      type: 'sphere',
      position,
      scale: [0.28, 0.28, 0.28],
      material,
      castShadows: false,
      receiveShadows: false,
    }),
    material,
    activeIntensity: 3.1,
    idleIntensity: 0.06,
  }
}

function setBulbState(bulb: TreeBulb, enabled: boolean): void {
  bulb.material.emissiveIntensity = enabled ? bulb.activeIntensity : bulb.idleIntensity
  bulb.material.update()
}

export function buildPassEnvironment(
  pc: PlayCanvasNamespace,
  sceneRoot: Entity,
  quality: PassQuality,
): PassEnvironment {
  const trackLength = 132
  const trackWidth = 11.5
  const halfTrack = trackLength / 2
  const high = quality === 'high'

  const asphalt = createMaterial(pc, {
    diffuse: [0.1, 0.11, 0.13],
    metalness: 0.2,
    gloss: 0.16,
  })
  const shoulder = createMaterial(pc, {
    diffuse: [0.07, 0.08, 0.09],
    metalness: 0.14,
    gloss: 0.1,
  })
  const paint = createMaterial(pc, {
    diffuse: [0.86, 0.88, 0.9],
    metalness: 0.04,
    gloss: 0.3,
  })
  const paintDim = createMaterial(pc, {
    diffuse: [0.55, 0.57, 0.6],
    metalness: 0.04,
    gloss: 0.22,
  })
  const finishBlack = createMaterial(pc, {
    diffuse: [0.06, 0.07, 0.09],
    metalness: 0.08,
    gloss: 0.2,
  })
  const finishWhite = createMaterial(pc, {
    diffuse: [0.92, 0.93, 0.95],
    metalness: 0.04,
    gloss: 0.32,
  })
  const metal = createMaterial(pc, {
    diffuse: [0.22, 0.23, 0.26],
    metalness: 0.45,
    gloss: 0.38,
  })
  const sky = createMaterial(pc, {
    diffuse: [0.035, 0.04, 0.055],
    metalness: 0,
    gloss: 0.05,
  })

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'track-shoulder',
      type: 'box',
      position: [halfTrack, -0.38, 0],
      scale: [trackLength + 28, 0.22, trackWidth + 10],
      material: shoulder,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'track-surface',
      type: 'box',
      position: [halfTrack, -0.22, 0],
      scale: [trackLength, 0.18, trackWidth],
      material: asphalt,
    }),
  )

  // Start line
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'start-line',
      type: 'box',
      position: [0.15, -0.1, 0],
      scale: [0.14, 0.03, trackWidth - 0.6],
      material: paint,
      receiveShadows: false,
    }),
  )

  // Center dashes
  const dashCount = high ? 28 : 16
  for (let i = 0; i < dashCount; i += 1) {
    const x = 4 + (i / dashCount) * (trackLength - 10)
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `center-dash-${i}`,
        type: 'box',
        position: [x, -0.1, 0],
        scale: [1.4, 0.02, 0.1],
        material: paintDim,
        receiveShadows: false,
      }),
    )
  }

  // Lane edges
  ;([-trackWidth / 2 + 0.35, trackWidth / 2 - 0.35] as number[]).forEach((z, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `lane-edge-${index}`,
        type: 'box',
        position: [halfTrack, -0.1, z],
        scale: [trackLength - 2, 0.02, 0.08],
        material: paint,
        receiveShadows: false,
      }),
    )
  })

  // Guardrails
  ;([-trackWidth / 2 - 0.55, trackWidth / 2 + 0.55] as number[]).forEach((z, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `rail-${index}`,
        type: 'box',
        position: [halfTrack, 0.35, z],
        scale: [trackLength + 4, 0.55, 0.12],
        material: metal,
        castShadows: high,
      }),
    )
  })

  // Finish chequer
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const light = (row + col) % 2 === 0
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `finish-tile-${row}-${col}`,
          type: 'box',
          position: [trackLength - 0.2 + row * 0.16, -0.08, -4.2 + col * 1.2],
          scale: [0.14, 0.03, 1.15],
          material: light ? finishWhite : finishBlack,
          receiveShadows: false,
        }),
      )
    }
  }

  if (high) {
    const tower = new pc.Entity('timing-tower')
    tower.setLocalPosition(trackLength - 2, 0, -7.2)
    tower.addChild(
      createPrimitive(pc, {
        name: 'tower-shaft',
        type: 'box',
        position: [0, 2.4, 0],
        scale: [1.1, 4.8, 1.4],
        material: metal,
        castShadows: true,
      }),
    )
    tower.addChild(
      createPrimitive(pc, {
        name: 'tower-cabin',
        type: 'box',
        position: [0.2, 4.6, 0.3],
        scale: [2.2, 1.2, 2.4],
        material: metal,
        castShadows: true,
      }),
    )
    sceneRoot.addChild(tower)
  }

  // Night sky backdrop
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'sky-backdrop',
      type: 'box',
      position: [halfTrack + 20, 12, 0],
      scale: [4, 40, 80],
      material: sky,
      castShadows: false,
      receiveShadows: false,
    }),
  )

  // Christmas tree
  const treeBase = new pc.Entity('tree')
  treeBase.setLocalPosition(3.5, 0, -5.4)
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-pole',
      type: 'cylinder',
      position: [0, 2.1, 0],
      scale: [0.16, 4.2, 0.16],
      material: metal,
    }),
  )
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-arm-l',
      type: 'box',
      position: [0.65, 2.7, -0.35],
      scale: [1.2, 0.1, 0.18],
      material: metal,
    }),
  )
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-arm-r',
      type: 'box',
      position: [0.65, 2.7, 0.35],
      scale: [1.2, 0.1, 0.18],
      material: metal,
    }),
  )

  const stageBulbs = [
    createTreeBulb(pc, 'stage-l', [1.05, 3.15, -0.35], [0.88, 0.9, 0.96]),
    createTreeBulb(pc, 'stage-r', [1.05, 3.15, 0.35], [0.88, 0.9, 0.96]),
    createTreeBulb(pc, 'pre-l', [1.05, 2.7, -0.35], [0.88, 0.9, 0.96]),
    createTreeBulb(pc, 'pre-r', [1.05, 2.7, 0.35], [0.88, 0.9, 0.96]),
  ]
  const amberBulbs = [
    createTreeBulb(pc, 'amber-1', [1.05, 2.15, 0], [0.95, 0.55, 0.1]),
    createTreeBulb(pc, 'amber-2', [1.05, 1.65, 0], [0.95, 0.55, 0.1]),
    createTreeBulb(pc, 'amber-3', [1.05, 1.15, 0], [0.95, 0.55, 0.1]),
  ]
  const greenBulbs = [createTreeBulb(pc, 'green-main', [1.05, 0.55, 0], [0.28, 0.86, 0.42])]

  ;[...stageBulbs, ...amberBulbs, ...greenBulbs].forEach((bulb) => {
    treeBase.addChild(bulb.entity)
  })
  sceneRoot.addChild(treeBase)

  const setTreeLights = (mode: TreeMode) => {
    const stageOn = mode === 'stage' || mode === 'amber' || mode === 'green'
    const amberOn = mode === 'amber'
    const greenOn = mode === 'green'

    stageBulbs.forEach((bulb) => setBulbState(bulb, stageOn))
    amberBulbs.forEach((bulb) => setBulbState(bulb, amberOn))
    greenBulbs.forEach((bulb) => setBulbState(bulb, greenOn))
  }

  setTreeLights('off')

  return {
    trackLength,
    treeBulbs: {
      stage: stageBulbs.map((b) => b.entity),
      amber: amberBulbs.map((b) => b.entity),
      green: greenBulbs.map((b) => b.entity),
    },
    setTreeLights,
  }
}
