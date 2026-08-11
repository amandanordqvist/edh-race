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
      scale: [0.3, 0.3, 0.3],
      material,
      castShadows: false,
      receiveShadows: false,
    }),
    material,
    activeIntensity: 3.2,
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
    diffuse: [0.09, 0.095, 0.11],
    metalness: 0.18,
    gloss: 0.14,
  })
  const shoulder = createMaterial(pc, {
    diffuse: [0.12, 0.11, 0.1],
    metalness: 0.08,
    gloss: 0.08,
  })
  const concrete = createMaterial(pc, {
    diffuse: [0.28, 0.28, 0.3],
    metalness: 0.12,
    gloss: 0.18,
  })
  const waterBox = createMaterial(pc, {
    diffuse: [0.05, 0.06, 0.07],
    emissive: [0.02, 0.03, 0.04],
    emissiveIntensity: 0.15,
    metalness: 0.35,
    gloss: 0.55,
  })
  const paint = createMaterial(pc, {
    diffuse: [0.9, 0.91, 0.93],
    metalness: 0.04,
    gloss: 0.3,
  })
  const paintDim = createMaterial(pc, {
    diffuse: [0.62, 0.64, 0.67],
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
    diffuse: [0.2, 0.21, 0.24],
    metalness: 0.48,
    gloss: 0.4,
  })
  const sky = createMaterial(pc, {
    diffuse: [0.03, 0.035, 0.05],
    metalness: 0,
    gloss: 0.05,
  })
  const markerPost = createMaterial(pc, {
    diffuse: [0.75, 0.78, 0.82],
    metalness: 0.2,
    gloss: 0.25,
  })

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'ground-apron',
      type: 'box',
      position: [halfTrack, -0.55, 0],
      scale: [trackLength + 60, 0.3, trackWidth + 36],
      material: shoulder,
    }),
  )
  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'track-shoulder',
      type: 'box',
      position: [halfTrack, -0.38, 0],
      scale: [trackLength + 28, 0.22, trackWidth + 10],
      material: concrete,
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

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'water-box',
      type: 'box',
      position: [-3.2, -0.12, 0],
      scale: [4.2, 0.04, trackWidth - 1.2],
      material: waterBox,
      receiveShadows: false,
    }),
  )

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'start-line',
      type: 'box',
      position: [0.15, -0.1, 0],
      scale: [0.18, 0.03, trackWidth - 0.6],
      material: paint,
      receiveShadows: false,
    }),
  )

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

  ;([-trackWidth / 2 - 0.7, trackWidth / 2 + 0.7] as number[]).forEach((z, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `barrier-${index}`,
        type: 'box',
        position: [halfTrack, 0.55, z],
        scale: [trackLength + 8, 1.1, 0.45],
        material: concrete,
        castShadows: high,
      }),
    )
  })

  const markerFractions = [0.045, 0.25, 0.5, 0.76, 1]
  markerFractions.forEach((fraction, index) => {
    const x = fraction * trackLength
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `marker-${index}`,
        type: 'box',
        position: [x, 1.1, trackWidth / 2 + 1.4],
        scale: [0.18, 2.2, 0.18],
        material: markerPost,
        castShadows: false,
      }),
    )
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `marker-flag-${index}`,
        type: 'box',
        position: [x, 2.15, trackWidth / 2 + 1.55],
        scale: [0.55, 0.35, 0.08],
        material: index === markerFractions.length - 1 ? paint : paintDim,
        castShadows: false,
      }),
    )
  })

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      const light = (row + col) % 2 === 0
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `finish-tile-${row}-${col}`,
          type: 'box',
          position: [trackLength - 0.35 + row * 0.18, -0.08, -5.2 + col * 1.15],
          scale: [0.16, 0.03, 1.1],
          material: light ? finishWhite : finishBlack,
          receiveShadows: false,
        }),
      )
    }
  }

  const tower = new pc.Entity('timing-tower')
  tower.setLocalPosition(trackLength - 1.5, 0, -8.4)
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
  sceneRoot.addChild(tower)

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'sky-backdrop',
      type: 'box',
      position: [halfTrack, 18, -42],
      scale: [trackLength + 90, 55, 4],
      material: sky,
      castShadows: false,
      receiveShadows: false,
    }),
  )

  const treeBase = new pc.Entity('tree')
  // Beside the strip so the center Camaro lane stays clear; still readable from overview.
  treeBase.setLocalPosition(2.2, 0, -6.4)
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-pole',
      type: 'cylinder',
      position: [0, 2.4, 0],
      scale: [0.18, 4.8, 0.18],
      material: metal,
    }),
  )
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-arm',
      type: 'box',
      position: [0.9, 2.9, 0.9],
      scale: [1.6, 0.12, 0.16],
      material: metal,
    }),
  )

  const stageBulbs = [
    createTreeBulb(pc, 'stage-l-a', [1.45, 3.45, 0.55], [0.88, 0.9, 0.96]),
    createTreeBulb(pc, 'stage-r-a', [1.45, 3.45, 1.25], [0.88, 0.9, 0.96]),
    createTreeBulb(pc, 'stage-l-b', [1.45, 2.95, 0.55], [0.88, 0.9, 0.96]),
    createTreeBulb(pc, 'stage-r-b', [1.45, 2.95, 1.25], [0.88, 0.9, 0.96]),
  ]
  const amberBulbs = [
    createTreeBulb(pc, 'amber-1', [1.45, 2.35, 0.9], [0.95, 0.55, 0.1]),
    createTreeBulb(pc, 'amber-2', [1.45, 1.8, 0.9], [0.95, 0.55, 0.1]),
    createTreeBulb(pc, 'amber-3', [1.45, 1.25, 0.9], [0.95, 0.55, 0.1]),
  ]
  const greenBulbs = [createTreeBulb(pc, 'green-main', [1.45, 0.6, 0.9], [0.28, 0.86, 0.42])]

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
