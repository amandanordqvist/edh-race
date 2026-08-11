import type { Application, Entity, StandardMaterial, Vec3 } from 'playcanvas'

import type { PassQuality } from './types'

type PlayCanvasNamespace = typeof import('playcanvas')

type VehicleId = 'camaro' | 'f1' | 'jet'
type TreeMode = 'off' | 'stage' | 'amber' | 'green'

type MaterialTone = {
  diffuse: [number, number, number]
  emissive?: [number, number, number]
  emissiveIntensity?: number
  metalness?: number
  gloss?: number
}

type PrimitiveOptions = {
  name: string
  type: 'box' | 'plane' | 'sphere' | 'cylinder'
  position: [number, number, number]
  scale: [number, number, number]
  material: StandardMaterial
  castShadows?: boolean
  receiveShadows?: boolean
}

type TreeBulb = {
  entity: Entity
  material: StandardMaterial
  activeIntensity: number
  idleIntensity: number
}

export type PassScene = {
  camera: Entity
  treeBulbs: {
    stage: Entity[]
    amber: Entity[]
    green: Entity[]
  }
  racers: Record<VehicleId, Entity>
  trackLength: number
  setTreeLights: (mode: TreeMode) => void
  resetRacers: () => void
}

function createMaterial(pc: PlayCanvasNamespace, tone: MaterialTone): StandardMaterial {
  const material = new pc.StandardMaterial()

  material.diffuse.set(...tone.diffuse)
  material.emissive.set(...(tone.emissive ?? [0, 0, 0]))
  material.emissiveIntensity = tone.emissiveIntensity ?? 0
  material.useMetalness = true
  material.metalness = tone.metalness ?? 0.1
  material.gloss = tone.gloss ?? 0.25
  material.update()

  return material
}

function createPrimitive(
  pc: PlayCanvasNamespace,
  options: PrimitiveOptions,
): Entity {
  const entity = new pc.Entity(options.name)

  entity.addComponent('render', {
    type: options.type,
    castShadows: options.castShadows ?? false,
    receiveShadows: options.receiveShadows ?? true,
  })

  entity.setLocalPosition(...options.position)
  entity.setLocalScale(...options.scale)

  if (entity.render) {
    entity.render.material = options.material
  }

  return entity
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
      scale: [0.26, 0.26, 0.26],
      material,
      castShadows: false,
      receiveShadows: false,
    }),
    material,
    activeIntensity: 2.8,
    idleIntensity: 0.06,
  }
}

function setBulbState(bulb: TreeBulb, enabled: boolean): void {
  bulb.material.emissiveIntensity = enabled ? bulb.activeIntensity : bulb.idleIntensity
  bulb.material.update()
}

export function buildPassScene(
  app: Application,
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): PassScene {
  const sceneRoot = new pc.Entity('pass-scene')
  const trackLength = 132
  const trackWidth = 11.5
  const halfTrack = trackLength / 2

  const asphaltMaterial = createMaterial(pc, {
    diffuse: [0.11, 0.12, 0.14],
    metalness: 0.22,
    gloss: 0.18,
  })
  const shoulderMaterial = createMaterial(pc, {
    diffuse: [0.08, 0.09, 0.1],
    metalness: 0.16,
    gloss: 0.12,
  })
  const markerMaterial = createMaterial(pc, {
    diffuse: [0.72, 0.74, 0.78],
    metalness: 0.03,
    gloss: 0.28,
  })
  const finishBlackMaterial = createMaterial(pc, {
    diffuse: [0.07, 0.08, 0.1],
    metalness: 0.08,
    gloss: 0.2,
  })
  const finishWhiteMaterial = createMaterial(pc, {
    diffuse: [0.9, 0.91, 0.93],
    metalness: 0.04,
    gloss: 0.3,
  })
  const treePoleMaterial = createMaterial(pc, {
    diffuse: [0.24, 0.25, 0.28],
    metalness: 0.38,
    gloss: 0.34,
  })
  const camaroMaterial = createMaterial(pc, {
    diffuse: [42 / 255, 79 / 255, 154 / 255],
    emissive: [0.05, 0.08, 0.18],
    emissiveIntensity: quality === 'high' ? 0.28 : 0.18,
    metalness: 0.32,
    gloss: 0.42,
  })
  const f1Material = createMaterial(pc, {
    diffuse: [0.72, 0.74, 0.77],
    metalness: 0.42,
    gloss: 0.46,
  })
  const jetMaterial = createMaterial(pc, {
    diffuse: [0.5, 0.52, 0.56],
    metalness: 0.28,
    gloss: 0.26,
  })

  app.root.addChild(sceneRoot)
  app.scene.ambientLight = new pc.Color(0.16, 0.17, 0.2)

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'track-shoulder',
      type: 'box',
      position: [halfTrack, -0.35, 0],
      scale: [trackLength + 24, 0.2, trackWidth + 8],
      material: shoulderMaterial,
      receiveShadows: true,
    }),
  )

  sceneRoot.addChild(
    createPrimitive(pc, {
      name: 'track-surface',
      type: 'box',
      position: [halfTrack, -0.2, 0],
      scale: [trackLength, 0.16, trackWidth],
      material: asphaltMaterial,
      receiveShadows: true,
    }),
  )

  const laneMarkerZ = [-2.75, 0, 2.75]

  laneMarkerZ.forEach((z, index) => {
    sceneRoot.addChild(
      createPrimitive(pc, {
        name: `lane-marker-${index}`,
        type: 'box',
        position: [halfTrack, -0.1, z],
        scale: [trackLength, 0.02, index === 1 ? 0.08 : 0.04],
        material: markerMaterial,
        receiveShadows: false,
      }),
    )
  })

  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const useLightTile = (row + col) % 2 === 0
      const tile = createPrimitive(pc, {
        name: `finish-tile-${row}-${col}`,
        type: 'box',
        position: [trackLength, -0.08, -3.75 + col * 1.5],
        scale: [0.12, 0.03, 1.45],
        material: useLightTile ? finishWhiteMaterial : finishBlackMaterial,
        receiveShadows: false,
      })

      tile.translateLocal(row * 0.14, 0, 0)
      sceneRoot.addChild(tile)
    }
  }

  const treeBase = new pc.Entity('tree')

  treeBase.setLocalPosition(4, 0, -5.2)
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-pole',
      type: 'cylinder',
      position: [0, 1.9, 0],
      scale: [0.14, 3.6, 0.14],
      material: treePoleMaterial,
    }),
  )
  treeBase.addChild(
    createPrimitive(pc, {
      name: 'tree-arm',
      type: 'box',
      position: [0.55, 2.45, 0],
      scale: [1.1, 0.08, 0.22],
      material: treePoleMaterial,
    }),
  )

  const stageBulbs = [
    createTreeBulb(pc, 'stage-left', [0.5, 2.9, -0.14], [0.84, 0.87, 0.95]),
    createTreeBulb(pc, 'stage-right', [0.5, 2.48, 0.14], [0.84, 0.87, 0.95]),
  ]
  const amberBulbs = [
    createTreeBulb(pc, 'amber-top', [0.5, 1.94, 0], [0.95, 0.58, 0.12]),
    createTreeBulb(pc, 'amber-mid', [0.5, 1.46, 0], [0.95, 0.58, 0.12]),
    createTreeBulb(pc, 'amber-low', [0.5, 0.98, 0], [0.95, 0.58, 0.12]),
  ]
  const greenBulbs = [
    createTreeBulb(pc, 'green-main', [0.5, 0.38, 0], [0.32, 0.88, 0.4]),
  ]

  ;[...stageBulbs, ...amberBulbs, ...greenBulbs].forEach((bulb) => {
    treeBase.addChild(bulb.entity)
  })
  sceneRoot.addChild(treeBase)

  const racers: Record<VehicleId, Entity> = {
    camaro: createPrimitive(pc, {
      name: 'camaro',
      type: 'box',
      position: [0, 0.45, 0],
      scale: [3.2, 0.9, 1.55],
      material: camaroMaterial,
      castShadows: quality === 'high',
    }),
    f1: createPrimitive(pc, {
      name: 'f1',
      type: 'box',
      position: [0, 0.28, -2.2],
      scale: [2.5, 0.42, 1.12],
      material: f1Material,
      castShadows: quality === 'high',
    }),
    jet: createPrimitive(pc, {
      name: 'jet',
      type: 'box',
      position: [0, 0.6, 2.2],
      scale: [4.7, 0.52, 0.88],
      material: jetMaterial,
      castShadows: quality === 'high',
    }),
  }

  const startPositions: Record<VehicleId, Vec3> = {
    camaro: racers.camaro.getLocalPosition().clone(),
    f1: racers.f1.getLocalPosition().clone(),
    jet: racers.jet.getLocalPosition().clone(),
  }

  Object.values(racers).forEach((racer) => {
    sceneRoot.addChild(racer)
  })

  const camera = new pc.Entity('pass-camera')

  camera.addComponent('camera', {
    clearColor: new pc.Color(0.04, 0.05, 0.07),
    fov: quality === 'high' ? 44 : 50,
    nearClip: 0.1,
    farClip: trackLength * 2,
  })
  camera.setLocalPosition(-17, 8.5, 13.5)
  camera.lookAt(trackLength * 0.68, 1.4, 0)
  sceneRoot.addChild(camera)

  const keyLight = new pc.Entity('key-light')

  keyLight.addComponent('light', {
    type: 'directional',
    color: new pc.Color(0.88, 0.9, 0.98),
    intensity: quality === 'high' ? 1.6 : 1.25,
    castShadows: quality === 'high',
    shadowDistance: 50,
    shadowBias: 0.2,
    normalOffsetBias: 0.06,
  })
  keyLight.setEulerAngles(38, -35, 0)
  sceneRoot.addChild(keyLight)

  if (quality === 'high') {
    const fillLight = new pc.Entity('fill-light')

    fillLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.18, 0.29, 0.52),
      intensity: 0.55,
      castShadows: false,
    })
    fillLight.setEulerAngles(20, 135, 0)
    sceneRoot.addChild(fillLight)
  }

  const setTreeLights = (mode: TreeMode) => {
    const stageOn = mode === 'stage' || mode === 'amber' || mode === 'green'
    const amberOn = mode === 'amber'
    const greenOn = mode === 'green'

    stageBulbs.forEach((bulb) => setBulbState(bulb, stageOn))
    amberBulbs.forEach((bulb) => setBulbState(bulb, amberOn))
    greenBulbs.forEach((bulb) => setBulbState(bulb, greenOn))
  }

  const resetRacers = () => {
    ;(Object.keys(racers) as VehicleId[]).forEach((id) => {
      racers[id].setLocalPosition(startPositions[id])
      racers[id].setLocalEulerAngles(0, 0, 0)
    })
  }

  setTreeLights('off')
  resetRacers()

  return {
    camera,
    treeBulbs: {
      stage: stageBulbs.map((bulb) => bulb.entity),
      amber: amberBulbs.map((bulb) => bulb.entity),
      green: greenBulbs.map((bulb) => bulb.entity),
    },
    racers,
    trackLength,
    setTreeLights,
    resetRacers,
  }
}
