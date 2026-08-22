import type { Entity } from 'playcanvas'

export type ModelBounds = {
  min: [number, number, number]
  max: [number, number, number]
}

export function forEachEntity(root: Entity, fn: (entity: Entity) => void): void {
  fn(root)
  root.children.forEach((child) => {
    forEachEntity(child as Entity, fn)
  })
}

export function collectModelBounds(root: Entity): ModelBounds | null {
  let minX = Infinity
  let minY = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let maxZ = -Infinity
  let found = false

  forEachEntity(root, (entity) => {
    const render = entity.render
    if (!render) return

    render.meshInstances.forEach((instance) => {
      if (instance.visible === false) return

      const aabb = instance.aabb
      const cx = aabb.center.x
      const cy = aabb.center.y
      const cz = aabb.center.z
      const hx = aabb.halfExtents.x
      const hy = aabb.halfExtents.y
      const hz = aabb.halfExtents.z

      minX = Math.min(minX, cx - hx)
      minY = Math.min(minY, cy - hy)
      minZ = Math.min(minZ, cz - hz)
      maxX = Math.max(maxX, cx + hx)
      maxY = Math.max(maxY, cy + hy)
      maxZ = Math.max(maxZ, cz + hz)
      found = true
    })
  })

  if (!found) return null
  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
  }
}

/** Hide Sketchfab studio cages / exploded leftovers before fitting. */
export function hideOversizedMeshInstances(root: Entity, maxExtent: number): number {
  let hidden = 0
  forEachEntity(root, (entity) => {
    const render = entity.render
    if (!render) return
    render.meshInstances.forEach((instance) => {
      const he = instance.aabb.halfExtents
      const extent = Math.max(he.x, he.y, he.z) * 2
      if (extent > maxExtent) {
        instance.visible = false
        hidden += 1
      }
    })
  })
  return hidden
}

/**
 * Hide Sketchfab studio orbs / HDRI preview spheres. A mesh counts as a
 * sphere when its AABB is nearly cubic and at least `minExtent` metres.
 */
export function hideSphericalMeshes(root: Entity, minExtent: number): number {
  let hidden = 0
  forEachEntity(root, (entity) => {
    const render = entity.render
    if (!render) return
    render.meshInstances.forEach((instance) => {
      const he = instance.aabb.halfExtents
      const max = Math.max(he.x, he.y, he.z)
      const min = Math.min(he.x, he.y, he.z)
      if (max < 0.001) return
      const spherical = min / max > 0.72
      const extent = max * 2
      if (spherical && extent >= minExtent) {
        instance.visible = false
        hidden += 1
      }
    })
  })
  return hidden
}

/** Keep the densest vertical cluster so exploded Sketchfab parts drop out. */
export function hideMeshesFarFromMedianY(root: Entity, maxDelta: number): number {
  const samples: Array<{ instance: { visible: boolean }; y: number }> = []
  forEachEntity(root, (entity) => {
    const render = entity.render
    if (!render) return
    render.meshInstances.forEach((instance) => {
      if (instance.visible === false) return
      samples.push({ instance, y: instance.aabb.center.y })
    })
  })
  if (samples.length < 2) return 0

  const sorted = samples.map((s) => s.y).sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  let hidden = 0
  samples.forEach((sample) => {
    if (Math.abs(sample.y - median) > maxDelta) {
      sample.instance.visible = false
      hidden += 1
    }
  })
  return hidden
}

export function collectCamaroWheels(camaro: Entity): Entity[] {
  const wheels: Entity[] = []

  forEachEntity(camaro, (entity) => {
    if (entity.name.toLowerCase().includes('wheel')) {
      wheels.push(entity)
    }
  })

  return wheels
}

export function collectExhaustMaterials(camaro: Entity): import('playcanvas').StandardMaterial[] {
  const materials: import('playcanvas').StandardMaterial[] = []
  const seen = new Set<import('playcanvas').StandardMaterial>()

  forEachEntity(camaro, (entity) => {
    const lower = entity.name.toLowerCase()
    if (!lower.includes('exhaust')) return

    const render = entity.render
    if (!render) return

    render.meshInstances.forEach((instance) => {
      const material = instance.material as import('playcanvas').StandardMaterial
      if (seen.has(material)) return
      seen.add(material)
      materials.push(material)
    })
  })

  return materials
}
