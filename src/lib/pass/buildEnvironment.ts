import type { Entity } from 'playcanvas'

import { buildGrandstandsAndSky } from './buildGrandstands'
import { buildTrackMarkers } from './buildTrackMarkers'
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
  stripLightMaterials: import('playcanvas').StandardMaterial[]
  setTreeLights: (mode: TreeMode) => void
}

function createTreeBulb(
  pc: PlayCanvasNamespace,
  name: string,
  position: [number, number, number],
  color: [number, number, number],
  scale = 0.34,
): TreeBulb {
  const material = createMaterial(pc, {
    diffuse: color,
    emissive: color,
    emissiveIntensity: 0.08,
    metalness: 0,
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
    activeIntensity: 3.6,
    idleIntensity: 0.08,
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
    diffuse: [0.06, 0.065, 0.075],
    metalness: 0.12,
    gloss: 0.1,
  })
  const asphaltWear = createMaterial(pc, {
    diffuse: [0.045, 0.048, 0.055],
    metalness: 0.08,
    gloss: 0.08,
  })
  const shoulder = createMaterial(pc, {
    diffuse: [0.14, 0.13, 0.12],
    metalness: 0.06,
    gloss: 0.08,
  })
  const concrete = createMaterial(pc, {
    diffuse: [0.22, 0.22, 0.24],
    metalness: 0.1,
    gloss: 0.16,
  })
  const barrierDark = createMaterial(pc, {
    diffuse: [0.18, 0.19, 0.21],
    metalness: 0.18,
    gloss: 0.22,
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
  const stripLight = createMaterial(pc, {
    diffuse: [0.85, 0.88, 0.92],
    emissive: [0.75, 0.82, 0.95],
    emissiveIntensity: 0.04,
    metalness: 0.1,
    gloss: 0.35,
  })
  const stripLightMaterials: import('playcanvas').StandardMaterial[] = [stripLight]
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

  // Mid-lane rubber — helps the strip read as raced asphalt, not flat plastic.
  ;([-2.55, 2.55] as number[]).forEach((z, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `lane-rubber-${index}`,
        type: 'box',
        position: [halfTrack + 8, -0.11, z],
        scale: [trackLength * 0.78, 0.015, 0.95],
        material: asphaltWear,
        castShadows: false,
        receiveShadows: false,
      }),
    )
  })

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

  const rubberMark = createMaterial(pc, {
    diffuse: [0.04, 0.04, 0.045],
    metalness: 0.02,
    gloss: 0.06,
  })
  for (let i = 0; i < (high ? 18 : 10); i += 1) {
    const row = i % 3
    const col = Math.floor(i / 3)
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `burnout-mark-${i}`,
        // Under fitted Camaro rear (~local −1.35 on +X-facing car at start ~0.4).
        type: 'box',
        position: [-0.95 - col * 0.45, -0.095, -0.95 + row * 0.95],
        scale: [0.95, 0.012, 0.38],
        material: rubberMark,
        receiveShadows: false,
      }),
    )
  }

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
        position: [halfTrack, 0.48, z],
        scale: [trackLength + 8, 0.95, 0.4],
        material: barrierDark,
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

  buildGrandstandsAndSky({
    pc,
    sceneRoot,
    trackLength,
    trackWidth,
    quality,
  })

  buildTrackMarkers({
    pc,
    sceneRoot,
    trackLength,
    trackWidth,
    quality,
  })

  const lightSpacing = high ? 24 : 36
  const lightCount = Math.floor(trackLength / lightSpacing)
  for (let i = 0; i <= lightCount; i += 1) {
    const x = i * lightSpacing + 8
    ;([-trackWidth / 2 - 2.4, trackWidth / 2 + 2.4] as number[]).forEach((z, side) => {
      const pole = createPrimitive(pc, {
        name: `strip-pole-${i}-${side}`,
        type: 'cylinder',
        position: [x, 2.6, z],
        scale: [0.1, 5.2, 0.1],
        material: metal,
        castShadows: false,
      })
      sceneRoot.addChild(pole)
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

  const treeBase = new pc.Entity('tree')
  // Beside the strip — readable from chase / tree-insert camera.
  treeBase.setLocalPosition(2.2, 0, -6.4)

  const treeHousing = createMaterial(pc, {
    diffuse: [0.08, 0.09, 0.11],
    metalness: 0.45,
    gloss: 0.35,
  })

  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-pole',
      type: 'cylinder',
      position: [0, 2.7, 0],
      scale: [0.22, 5.4, 0.22],
      material: metal,
    }),
  )
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-base-plate',
      type: 'cylinder',
      position: [0, 0.12, 0],
      scale: [0.85, 0.24, 0.85],
      material: concrete,
    }),
  )
  // Vertical light board facing the lane (+Z toward strip center-ish)
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-board',
      type: 'box',
      position: [0.95, 2.85, 0.95],
      scale: [0.22, 4.6, 1.55],
      material: treeHousing,
    }),
  )
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-arm',
      type: 'box',
      position: [0.55, 4.85, 0.95],
      scale: [1.1, 0.14, 0.2],
      material: metal,
    }),
  )

  // Pre-stage / stage pair rows, then descending amber, then green — classic tree read.
  const stageBulbs = [
    createTreeBulb(pc, 'stage-l-a', [1.12, 4.55, 0.55], [0.92, 0.94, 0.98], 0.28),
    createTreeBulb(pc, 'stage-r-a', [1.12, 4.55, 1.35], [0.92, 0.94, 0.98], 0.28),
    createTreeBulb(pc, 'stage-l-b', [1.12, 3.95, 0.55], [0.92, 0.94, 0.98], 0.32),
    createTreeBulb(pc, 'stage-r-b', [1.12, 3.95, 1.35], [0.92, 0.94, 0.98], 0.32),
  ]
  const amberBulbs = [
    createTreeBulb(pc, 'amber-1', [1.12, 3.15, 0.95], [0.95, 0.55, 0.1], 0.38),
    createTreeBulb(pc, 'amber-2', [1.12, 2.45, 0.95], [0.95, 0.55, 0.1], 0.38),
    createTreeBulb(pc, 'amber-3', [1.12, 1.75, 0.95], [0.95, 0.55, 0.1], 0.38),
  ]
  const greenBulbs = [
    createTreeBulb(pc, 'green-main', [1.12, 0.85, 0.95], [0.28, 0.86, 0.42], 0.48),
  ]

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
    stripLightMaterials,
    setTreeLights,
  }
}
