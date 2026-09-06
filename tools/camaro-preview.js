import * as pc from 'playcanvas'
import { createCamaroWheelSpin } from '../src/lib/pass/camaroWheelSpin'

const canvas = document.querySelector('canvas')
const app = new pc.Application(canvas, { graphicsDeviceOptions: { antialias: true, alpha: false } })
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW)
app.setCanvasResolution(pc.RESOLUTION_AUTO)
window.addEventListener('resize', () => app.resizeCanvas())
app.scene.ambientLight = new pc.Color(0.15, 0.17, 0.20)
app.scene.toneMapping = pc.TONEMAP_ACES
app.scene.gammaCorrection = pc.GAMMA_SRGB
const camera = new pc.Entity('camera')
camera.addComponent('camera', { clearColor: new pc.Color(0.065, 0.082, 0.11), fov: 35, nearClip: 0.01, farClip: 100 })
app.root.addChild(camera)
for (const [angles, intensity, color] of [[[40, -35, 0], 1.2, [1, .96, .90]], [[55, 145, 0], .7, [.68, .79, 1]], [[-20, 60, 0], .4, [1, 1, 1]]]) {
  const light = new pc.Entity('softbox')
  light.addComponent('light', { type: 'directional', color: new pc.Color(...color), intensity,
    castShadows: intensity > 1, shadowType: pc.SHADOW_PCF5_32F, shadowResolution: 2048,
    shadowDistance: 20, normalOffsetBias: .02, shadowBias: .1 })
  light.setEulerAngles(...angles)
  app.root.addChild(light)
}
const ground = new pc.Entity('ground')
ground.addComponent('render', { type: 'plane' })
ground.setLocalScale(200, 1, 200)
ground.setPosition(0, -.015, 0)
const groundMat = new pc.StandardMaterial()
groundMat.diffuse.set(.085, .10, .13)
groundMat.gloss = .1
groundMat.update()
ground.render.material = groundMat
app.root.addChild(ground)
function asset(url, type) {
  return new Promise((resolve, reject) => {
    const a = new pc.Asset(url, type, { url })
    a.once('load', () => resolve(a))
    a.once('error', reject)
    app.assets.add(a)
    app.assets.load(a)
  })
}
const models = {}
let current = 'new', yaw = .82, elevation = .21, distance = 7.3
let center = new pc.Vec3(0, .57, 0)
async function load(key, url) {
  const a = await asset(url, 'container')
  const root = a.resource.instantiateRenderEntity()
  app.root.addChild(root)
  const instances = root.findComponents('render').flatMap(r => r.meshInstances)
  const bounds = instances[0].aabb.clone()
  instances.slice(1).forEach(m => bounds.add(m.aabb))
  const scale = 5.8 / (bounds.halfExtents.x * 2)
  root.setLocalScale(scale, scale, scale)
  root.setLocalPosition(-bounds.center.x * scale, -(bounds.center.y - bounds.halfExtents.y) * scale, -bounds.center.z * scale)
  root.enabled = key === current
  models[key] = root
  document.querySelector('#status').textContent = 'Fotoreferens: camaros10 / 11 / 13 / 14'
}
const reviewParams = new URLSearchParams(window.location.search)
await load('new', reviewParams.get('candidate') === 'v2' ? '/.tmp-verify/camaro-v2.glb' : '/models/pass/camaro.glb')
const wheelSpin = createCamaroWheelSpin({ app,
  wheels: ['fl', 'fr', 'rl', 'rr'].map(label => models.new.findByName(`edh-wheel-${label}`)).filter(Boolean),
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
})
let spinning = false
document.querySelector('#spin').onclick = () => {
  spinning = !spinning
  wheelSpin.onPhase(spinning ? 'racing' : 'idle')
  wheelSpin.onRaceFrame(0, .035)
  document.querySelector('#spin').setAttribute('aria-pressed', String(spinning))
}
try { await load('old', reviewParams.get('baseline') === 'v1' ? '/.tmp-verify/camaro-v1.glb' : '/.tmp-verify/camaro-original.glb') } catch { document.querySelector('#old').disabled = true }
try {
  const hdr = await asset('/models/kloofendal_48d_partly_cloudy_puresky_2k.hdr', 'texture')
  const lighting = pc.EnvLighting.generateLightingSource(hdr.resource, { size: 128 })
  app.scene.envAtlas = pc.EnvLighting.generateAtlas(lighting, { size: 512 })
  app.scene.skyboxIntensity = .65
  app.scene.layers.getLayerById(pc.LAYERID_SKYBOX).enabled = false
  lighting.destroy()
} catch (error) { console.warn('IBL unavailable', error) }
for (const key of ['new', 'old']) document.querySelector(`#${key}`).onclick = () => {
  current = key
  Object.entries(models).forEach(([k, root]) => { root.enabled = k === key })
  for (const k of ['new', 'old']) document.querySelector(`#${k}`).setAttribute('aria-pressed', String(k === key))
}
document.querySelectorAll('[data-view]').forEach(button => button.onclick = () => {
  const view = button.dataset.view
  yaw = { front: 0, side: Math.PI / 2, rear: Math.PI, three: .82 }[view]
  elevation = view === 'three' ? .21 : .035
})
let drag = null
canvas.onpointerdown = e => { drag = [e.clientX, e.clientY]; canvas.setPointerCapture(e.pointerId) }
canvas.onpointermove = e => {
  if (!drag) return
  yaw -= (e.clientX - drag[0]) * .006
  elevation = Math.max(.02, Math.min(1, elevation + (e.clientY - drag[1]) * .004))
  drag = [e.clientX, e.clientY]
}
canvas.onpointerup = canvas.onpointercancel = () => { drag = null }
canvas.onwheel = e => { e.preventDefault(); distance = Math.max(5, Math.min(14, distance + e.deltaY * .006)) }
app.on('update', () => {
  const fittedDistance = distance * Math.max(1, 1.65 / camera.camera.aspectRatio)
  camera.setPosition(center.x + Math.cos(yaw) * Math.cos(elevation) * fittedDistance, center.y + Math.sin(elevation) * fittedDistance, center.z + Math.sin(yaw) * Math.cos(elevation) * fittedDistance)
  camera.lookAt(center)
})
app.start()
