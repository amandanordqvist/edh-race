import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { Entity } from 'playcanvas'
import { createCamaroWheelSpin } from '../src/lib/pass/camaroWheelSpin.ts'

// Asset contract: finite geometry, valid indices, normalized normals and four
// actual hub pivots. No browser or GPU is required for these checks.
const file = readFileSync(new URL('../public/models/pass/camaro.glb', import.meta.url))
assert.equal(file.readUInt32LE(0), 0x46546c67)
assert.equal(file.readUInt32LE(8), file.length)
const jsonSize = file.readUInt32LE(12)
const doc = JSON.parse(file.subarray(20, 20 + jsonSize))
const binary = file.subarray(28 + jsonSize)
function values(index) {
  const a = doc.accessors[index]
  const v = doc.bufferViews[a.bufferView]
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3 }[a.type]
  const offset = (v.byteOffset ?? 0) + (a.byteOffset ?? 0)
  assert(offset + a.count * components * 4 <= binary.length)
  return Array.from({ length: a.count * components }, (_, i) =>
    a.componentType === 5126 ? binary.readFloatLE(offset + i * 4) : binary.readUInt32LE(offset + i * 4))
}
let triangleCount = 0
for (const mesh of doc.meshes) {
  for (const p of mesh.primitives) {
    const position = values(p.attributes.POSITION)
    const normal = values(p.attributes.NORMAL)
    const indices = values(p.indices)
    assert(position.every(Number.isFinite), `${mesh.name}: nonfinite position`)
    assert(normal.every(Number.isFinite), `${mesh.name}: nonfinite normal`)
    assert(indices.every(i => i < position.length / 3), `${mesh.name}: invalid index`)
    for (let i = 0; i < normal.length; i += 3) {
      const length = Math.hypot(...normal.slice(i, i + 3))
      // Unreferenced pole vertices may have zero normals after degenerate removal.
      assert(length < 1e-6 || Math.abs(length - 1) < 1e-5, `${mesh.name}: invalid normal`)
    }
    triangleCount += indices.length / 3
  }
}
assert(triangleCount < 100_000, 'Geometry budget exceeded')
assert(file.length < 3 * 1024 * 1024, 'Asset budget exceeded')
const wheelNodes = doc.nodes.filter(n => n.name.startsWith('edh-wheel-'))
assert.deepEqual(wheelNodes.map(n => n.name).sort(), ['edh-wheel-fl', 'edh-wheel-fr', 'edh-wheel-rl', 'edh-wheel-rr'])
assert(wheelNodes.every(n => n.translation.some(Math.abs)), 'Missing hub translation')

function spinTest(reducedMotion) {
  const callbacks = new Set()
  const app = { on: (_event, callback) => callbacks.add(callback), off: (_event, callback) => callbacks.delete(callback) }
  const root = new Entity('camaro-test')
  root.setLocalPosition(8, .4, 2.2)
  root.setLocalScale(4.2, 4.2, 4.2)
  root.setLocalEulerAngles(0, 23, 0)
  const wheels = wheelNodes.map(n => {
    const wheel = new Entity(n.name)
    wheel.setLocalPosition(...n.translation)
    root.addChild(wheel)
    return wheel
  })
  const hubs = wheels.map(w => w.getPosition().clone())
  const spin = createCamaroWheelSpin({ app, wheels, reducedMotion })
  const tick = () => callbacks.forEach(callback => callback(1 / 60))
  spin.onPhase('staging')
  tick()
  for (const w of wheels) {
    const angle = Math.abs(w.getLocalEulerAngles().z)
    assert.equal(angle > .01, !reducedMotion && w.name.includes('wheel-r'))
  }
  spin.onPhase('racing')
  spin.onRaceFrame(.5, .6)
  for (let i = 0; i < 120; i++) tick()
  wheels.forEach((wheel, i) => assert(wheel.getPosition().distance(hubs[i]) < 1e-6, 'Wheel left its hub'))
  assert.equal(spin.getRearAnchors().length, 2)
  spin.reset()
  wheels.forEach(w => assert(w.getLocalEulerAngles().length() < 1e-5))
  spin.destroy()
  assert.equal(callbacks.size, 0)
  root.destroy()
}
spinTest(false)
spinTest(true)
console.log(`Camaro OK: ${triangleCount.toLocaleString()} triangles; ${(file.length / 1024 / 1024).toFixed(2)} MiB; four stable wheel pivots; reset and reduced motion pass.`)
