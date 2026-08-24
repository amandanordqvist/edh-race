import type { Application, Entity } from 'playcanvas'

import {
  CHRISTMAS_TREE_X,
  RAIL_Z,
  SHUTDOWN_LENGTH,
  STAGING_LENGTH,
  TRACK_LENGTH,
} from './passLayout'
import {
  createMaterial,
  type PlayCanvasNamespace,
} from './scenePrimitives'
import type { PassQuality } from './types'

type EdgeRailOptions = {
  pc: PlayCanvasNamespace
  app: Application
  sceneRoot: Entity
  quality: PassQuality
}

type MeshBuffers = {
  positions: number[]
  normals: number[]
  indices: number[]
}

const POST_CLEAR_M = 1.2
const RAIL_HEIGHT = 0.55
const BEAM_HEIGHT = 0.11
const POST_WIDTH = 0.09
const POST_DEPTH = 0.13

function appendBox(
  buffers: MeshBuffers,
  cx: number,
  cy: number,
  cz: number,
  sx: number,
  sy: number,
  sz: number,
): void {
  const hx = sx / 2
  const hy = sy / 2
  const hz = sz / 2
  const base = buffers.positions.length / 3
  const faces: Array<{ n: [number, number, number]; corners: [number, number, number][] }> = [
    { n: [1, 0, 0], corners: [[hx, -hy, -hz], [hx, -hy, hz], [hx, hy, hz], [hx, hy, -hz]] },
    { n: [-1, 0, 0], corners: [[-hx, -hy, hz], [-hx, -hy, -hz], [-hx, hy, -hz], [-hx, hy, hz]] },
    { n: [0, 1, 0], corners: [[-hx, hy, -hz], [hx, hy, -hz], [hx, hy, hz], [-hx, hy, hz]] },
    { n: [0, -1, 0], corners: [[-hx, -hy, hz], [hx, -hy, hz], [hx, -hy, -hz], [-hx, -hy, -hz]] },
    { n: [0, 0, 1], corners: [[hx, -hy, hz], [-hx, -hy, hz], [-hx, hy, hz], [hx, hy, hz]] },
    { n: [0, 0, -1], corners: [[-hx, -hy, -hz], [hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz]] },
  ]

  faces.forEach((face) => {
    face.corners.forEach(([x, y, z]) => {
      buffers.positions.push(cx + x, cy + y, cz + z)
      buffers.normals.push(...face.n)
    })
  })

  for (let f = 0; f < 6; f += 1) {
    const i = base + f * 4
    buffers.indices.push(i, i + 1, i + 2, i, i + 2, i + 3)
  }
}

function skipPost(x: number): boolean {
  return Math.abs(x - CHRISTMAS_TREE_X) < POST_CLEAR_M || Math.abs(x - TRACK_LENGTH) < POST_CLEAR_M
}

function buildSideMesh(
  pc: PlayCanvasNamespace,
  app: Application,
  z: number,
  spacing: number,
): Entity | null {
  const start = -STAGING_LENGTH
  const end = TRACK_LENGTH + SHUTDOWN_LENGTH + 3
  const length = end - start
  const mid = start + length / 2
  const buffers: MeshBuffers = { positions: [], normals: [], indices: [] }

  appendBox(buffers, mid, RAIL_HEIGHT - BEAM_HEIGHT / 2, z, length, BEAM_HEIGHT, 0.16)

  for (let x = start + 0.8; x <= end - 0.4; x += spacing) {
    if (skipPost(x)) continue
    appendBox(buffers, x, RAIL_HEIGHT / 2, z, POST_WIDTH, RAIL_HEIGHT, POST_DEPTH)
  }

  if (buffers.positions.length === 0) return null

  const mesh = new pc.Mesh(app.graphicsDevice)
  mesh.setPositions(buffers.positions)
  mesh.setNormals(buffers.normals)
  mesh.setIndices(buffers.indices)
  mesh.update()

  const material = createMaterial(pc, {
    diffuse: [0.34, 0.35, 0.33],
    metalness: 0.28,
    gloss: 0.22,
  })

  const entity = new pc.Entity(`edge-rail-${z > 0 ? 'near' : 'far'}`)
  entity.addComponent('render', {
    meshInstances: [new pc.MeshInstance(mesh, material)],
    castShadows: false,
    receiveShadows: true,
  })
  return entity
}

/**
 * Low rail on the asphalt edge — one mesh per side so posts strobe without
 * hundreds of entities.
 */
export function buildEdgeRail(opts: EdgeRailOptions): void {
  const { pc, app, sceneRoot, quality } = opts
  const spacing = quality === 'high' ? 1.6 : 2.8

  try {
    ;([-RAIL_Z, RAIL_Z] as number[]).forEach((z) => {
      const rail = buildSideMesh(pc, app, z, spacing)
      if (rail) sceneRoot.addChild(rail)
    })
  } catch (error) {
    console.warn('[pass] Edge rail unavailable', error)
  }
}
