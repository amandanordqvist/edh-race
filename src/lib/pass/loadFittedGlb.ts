import type { Application, ContainerResource, Entity } from 'playcanvas'

import { collectModelBounds, forEachEntity, hideMeshesFarFromMedianY, hideOversizedMeshInstances } from './camaroRig'
import { loadContainerAsset } from './loadGlbAsset'
import { shadowsEnabled, type PlayCanvasNamespace } from './scenePrimitives'
import type { PassQuality } from './types'

export type FittedGlbTarget =
  | { kind: 'length'; meters: number }
  | { kind: 'height'; meters: number }

type LoadFittedGlbOptions = {
  app: Application
  pc: PlayCanvasNamespace
  quality: PassQuality
  url: string
  name: string
  target: FittedGlbTarget
  groundClearance?: number
  /** Extra yaw after aligning the longest horizontal axis to +X. */
  yawFlipDeg?: 0 | 90 | 180 | 270
  /** Override the length-fit height cap (planes are taller than cars). */
  maxFittedHeight?: number
  maxFittedExtent?: number
  minFitScale?: number
  /** Hide meshes larger than this (Sketchfab studio spheres) before fitting. */
  stripLargerThan?: number
  /** Hide leftover parts farther than this from the median Y. */
  stripYSpread?: number
}

const MIN_FIT_SCALE = 0.05
const MAX_FIT_SCALE = 20
const MAX_LENGTH_FIT_HEIGHT = 4.2
const MAX_HEIGHT_FIT_LENGTH = 14
const MAX_FITTED_EXTENT = 16

/**
 * Load a GLB, scale it to a real-world size, yaw longest axis down the strip,
 * and sit it on the asphalt. Throws if the asset has studio cages, exploded
 * origins, or degenerate bounds — callers should fall back to primitives.
 */
export async function loadFittedGlb(opts: LoadFittedGlbOptions): Promise<Entity> {
  const {
    app,
    pc,
    quality,
    url,
    name,
    target,
    groundClearance = 0.02,
    yawFlipDeg = 0,
    maxFittedHeight = MAX_LENGTH_FIT_HEIGHT,
    maxFittedExtent = MAX_FITTED_EXTENT,
    minFitScale = MIN_FIT_SCALE,
    stripLargerThan,
    stripYSpread,
  } = opts

  const asset = await loadContainerAsset(app, pc, url, name)
  const resource = asset.resource as ContainerResource
  const modelRoot = resource.instantiateRenderEntity()
  modelRoot.name = `${name}-mesh`

  const entity = new pc.Entity(name)
  entity.addChild(modelRoot)
  modelRoot.syncHierarchy()

  if (typeof stripLargerThan === 'number') {
    hideOversizedMeshInstances(modelRoot, stripLargerThan)
  }
  if (typeof stripYSpread === 'number') {
    hideMeshesFarFromMedianY(modelRoot, stripYSpread)
  }

  const abort = (reason: string): never => {
    modelRoot.destroy()
    entity.destroy()
    throw new Error(`[pass] ${name}: ${reason}`)
  }

  const bounds = collectModelBounds(modelRoot)
  if (!bounds) return abort('no mesh bounds')

  const sizeX = bounds.max[0] - bounds.min[0]
  const sizeY = bounds.max[1] - bounds.min[1]
  const sizeZ = bounds.max[2] - bounds.min[2]
  const lengthAlongX = sizeX >= sizeZ
  const modelLength = Math.max(sizeX, sizeZ)
  const modelHeight = sizeY

  if (modelLength < 0.05 || modelHeight < 0.05) {
    abort(`degenerate bounds ${sizeX.toFixed(2)}×${sizeY.toFixed(2)}×${sizeZ.toFixed(2)}`)
  }

  const scale =
    target.kind === 'length' ? target.meters / modelLength : target.meters / modelHeight

  if (!Number.isFinite(scale) || scale < minFitScale || scale > MAX_FIT_SCALE) {
    abort(`unusable scale ${scale.toFixed(2)} from ${sizeX.toFixed(2)}×${sizeY.toFixed(2)}×${sizeZ.toFixed(2)}`)
  }

  const fittedHeight = modelHeight * scale
  const fittedLength = modelLength * scale
  if (target.kind === 'length' && fittedHeight > maxFittedHeight) {
    abort(`studio/exploded mesh is ${fittedHeight.toFixed(1)} m tall after length fit`)
  }
  if (target.kind === 'height' && fittedLength > MAX_HEIGHT_FIT_LENGTH) {
    abort(`studio/exploded mesh is ${fittedLength.toFixed(1)} m long after height fit`)
  }

  const alignYaw = lengthAlongX ? 0 : 90
  const yawDeg = alignYaw + yawFlipDeg
  const centerX = (bounds.min[0] + bounds.max[0]) * 0.5
  const centerZ = (bounds.min[2] + bounds.max[2]) * 0.5

  entity.setLocalEulerAngles(0, yawDeg, 0)
  entity.setLocalScale(scale, scale, scale)

  if (alignYaw === 0) {
    entity.setLocalPosition(-centerX * scale, 0, -centerZ * scale)
  } else {
    entity.setLocalPosition(-centerZ * scale, 0, centerX * scale)
  }

  if (yawFlipDeg === 180) {
    const pos = entity.getLocalPosition()
    entity.setLocalPosition(-pos.x, pos.y, -pos.z)
  }

  const grounded = collectModelBounds(modelRoot)
  if (grounded) {
    const pos = entity.getLocalPosition()
    entity.setLocalPosition(pos.x, groundClearance - grounded.min[1], pos.z)

    const extentX = grounded.max[0] - grounded.min[0]
    const extentY = grounded.max[1] - grounded.min[1]
    const extentZ = grounded.max[2] - grounded.min[2]
    if (Math.max(extentX, extentY, extentZ) > maxFittedExtent) {
      abort(`fitted extent still ${extentX.toFixed(1)}×${extentY.toFixed(1)}×${extentZ.toFixed(1)} m`)
    }
  }

  const cast = shadowsEnabled(quality)
  forEachEntity(modelRoot, (node) => {
    const render = node.render
    if (!render) return
    render.meshInstances.forEach((instance) => {
      instance.castShadow = cast
      instance.receiveShadow = true
    })
  })

  return entity
}
