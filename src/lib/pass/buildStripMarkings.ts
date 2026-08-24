import type { Application, Entity, Texture } from 'playcanvas'

import {
  LANE_NEAR_Z,
  STAGING_LENGTH,
  STRIP_SPLITS,
  TRACK_LENGTH,
  TRACK_WIDTH,
  stripWorldX,
} from './passLayout'
import {
  createMaterial,
  createPrimitive,
  type PlayCanvasNamespace,
} from './scenePrimitives'
import type { PassQuality } from './types'

type StripMarkingsOptions = {
  pc: PlayCanvasNamespace
  app?: Application
  sceneRoot: Entity
  quality: PassQuality
}

const NUMERAL_W = 512
const NUMERAL_H = 256

function paintNumeral(label: string): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas')
  canvas.width = NUMERAL_W
  canvas.height = NUMERAL_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.clearRect(0, 0, NUMERAL_W, NUMERAL_H)
  ctx.fillStyle = 'rgba(228, 224, 214, 0.9)'
  ctx.font = '700 148px "Barlow Condensed", "Oswald", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, NUMERAL_W / 2, NUMERAL_H / 2 + 8)
  return canvas
}

function createNumeralTexture(
  app: Application,
  pc: PlayCanvasNamespace,
  label: string,
): Texture | null {
  const canvas = paintNumeral(label)
  if (!canvas) return null
  const texture = new pc.Texture(app.graphicsDevice, {
    name: `strip-numeral-${label}`,
    width: NUMERAL_W,
    height: NUMERAL_H,
    format: pc.PIXELFORMAT_RGBA8,
    mipmaps: false,
    minFilter: pc.FILTER_LINEAR,
    magFilter: pc.FILTER_LINEAR,
    addressU: pc.ADDRESS_CLAMP_TO_EDGE,
    addressV: pc.ADDRESS_CLAMP_TO_EDGE,
    flipY: true,
  }) as Texture
  texture.setSource(canvas)
  texture.upload()
  return texture
}

function addNumerals(
  pc: PlayCanvasNamespace,
  app: Application,
  sceneRoot: Entity,
): void {
  try {
    STRIP_SPLITS.forEach((split) => {
      const texture = createNumeralTexture(app, pc, split.label)
      if (!texture) return

      const material = createMaterial(pc, {
        diffuse: [0.82, 0.8, 0.74],
        metalness: 0.02,
        gloss: 0.14,
      })
      material.diffuseMap = texture
      material.alphaTest = 0.2
      material.cull = pc.CULLFACE_NONE
      material.update()

      const hx = 1.6
      const hz = 0.8
      const mesh = new pc.Mesh(app.graphicsDevice)
      mesh.setPositions([
        -hx, 0, -hz,
        hx, 0, -hz,
        hx, 0, hz,
        -hx, 0, hz,
      ])
      mesh.setNormals([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0])
      mesh.setUvs(0, [0, 0, 1, 0, 1, 1, 0, 1])
      mesh.setIndices([0, 2, 1, 0, 3, 2])
      mesh.update()

      const entity = new pc.Entity(`split-paint-${split.id}`)
      entity.addComponent('render', {
        meshInstances: [new pc.MeshInstance(mesh, material)],
        castShadows: false,
        receiveShadows: false,
      })
      entity.setLocalPosition(stripWorldX(split.meters), -0.09, LANE_NEAR_Z)
      sceneRoot.addChild(entity)
    })
  } catch (error) {
    console.warn('[pass] Split numerals unavailable', error)
  }
}

function addEdgeTicks(
  pc: PlayCanvasNamespace,
  sceneRoot: Entity,
  quality: PassQuality,
): void {
  const paint = createMaterial(pc, {
    diffuse: [0.78, 0.79, 0.8],
    metalness: 0.03,
    gloss: 0.2,
  })
  const spacing = quality === 'high' ? 2.2 : 4
  const start = -STAGING_LENGTH + 2
  const end = TRACK_LENGTH + 2

  ;([-TRACK_WIDTH / 2, TRACK_WIDTH / 2] as number[]).forEach((z, side) => {
    for (let x = start, i = 0; x < end; x += spacing, i += 1) {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `edge-tick-${side}-${i}`,
          type: 'box',
          position: [x, -0.1, z],
          scale: [0.38, 0.012, 0.09],
          material: paint,
          castShadows: false,
        }),
      )
    }
  })
}

function addStagingCones(
  pc: PlayCanvasNamespace,
  sceneRoot: Entity,
): void {
  const coneMat = createMaterial(pc, {
    diffuse: [0.82, 0.34, 0.1],
    metalness: 0.04,
    gloss: 0.22,
  })
  const xs = [-17.5, -13.2, -8.6, -3.4]
  const z = TRACK_WIDTH / 2 + 0.48

  xs.forEach((x, i) => {
    ;([-z, z] as number[]).forEach((sideZ, side) => {
      sceneRoot.addChild(
        createPrimitive(pc, {
          name: `staging-cone-${side}-${i}`,
          type: 'cone',
          position: [x, 0.32, sideZ],
          scale: [0.3, 0.64, 0.3],
          material: coneMat,
          castShadows: false,
        }),
      )
    })
  })
}

function addFoamBlocks(
  pc: PlayCanvasNamespace,
  sceneRoot: Entity,
): void {
  const foam = createMaterial(pc, {
    diffuse: [0.86, 0.84, 0.78],
    metalness: 0.03,
    gloss: 0.16,
  })
  const orange = createMaterial(pc, {
    diffuse: [0.72, 0.32, 0.1],
    metalness: 0.04,
    gloss: 0.18,
  })
  const z = TRACK_WIDTH / 2 - 0.22

  STRIP_SPLITS.forEach((split) => {
    const x = stripWorldX(split.meters)
    ;([-z, z] as number[]).forEach((sideZ, side) => {
      const inward = sideZ < 0 ? 0.22 : -0.22
      const cluster = new pc.Entity(`timing-block-${split.id}-${side}`)
      cluster.setLocalPosition(x, 0, sideZ)
      cluster.addChild(
        createPrimitive(pc, {
          name: 'foam',
          type: 'box',
          position: [0, 0.2, 0],
          scale: [0.4, 0.4, 0.4],
          material: foam,
          castShadows: false,
        }),
      )
      cluster.addChild(
        createPrimitive(pc, {
          name: 'face',
          type: 'box',
          position: [0, 0.2, inward],
          scale: [0.36, 0.36, 0.03],
          material: orange,
          castShadows: false,
        }),
      )
      sceneRoot.addChild(cluster)
    })
  })
}

/**
 * Ground-speed cues: painted splits in the near lane, edge ticks against the
 * rail, staging cones, and foam blocks at the photocell lines.
 */
export function buildStripMarkings(opts: StripMarkingsOptions): void {
  const { pc, app, sceneRoot, quality } = opts
  if (app) addNumerals(pc, app, sceneRoot)
  addEdgeTicks(pc, sceneRoot, quality)
  if (quality === 'high') addStagingCones(pc, sceneRoot)
  addFoamBlocks(pc, sceneRoot)
}
