import type { Entity } from 'playcanvas'

export function forEachEntity(root: Entity, fn: (entity: Entity) => void): void {
  fn(root)
  root.children.forEach((child) => {
    forEachEntity(child as Entity, fn)
  })
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
