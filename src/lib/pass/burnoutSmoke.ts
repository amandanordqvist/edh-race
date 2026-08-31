import type { Application, Entity, Texture } from 'playcanvas'

import type { PassPhase, PassQuality } from './types'
import { createCanvasTexture } from './canvasTexture'
import type { PlayCanvasNamespace } from './scenePrimitives'

type BurnoutSmokeOptions = {
  app: Application
  pc: PlayCanvasNamespace
  parent: Entity
  camaro: Entity
  quality: PassQuality
  reducedMotion: boolean
}

const REAR_X = -2.55
const REAR_Y = 0.38
const REAR_Z = 0.88

const IDLE_RATE = 0.018
const STAGING_RATE = 0.014
const AMBER_RATE = 0.012
const LAUNCH_RATE = 0.014

function createSmokeMap(app: Application, pc: PlayCanvasNamespace): Texture {
  return createCanvasTexture(
    app,
    pc,
    'pass-burnout-puff',
    64,
    64,
    (ctx, w, h) => {
      const cx = w / 2
      const cy = h / 2
      const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, w * 0.48)
      gradient.addColorStop(0, 'rgba(188, 190, 196, 0.7)')
      gradient.addColorStop(0.35, 'rgba(168, 170, 176, 0.38)')
      gradient.addColorStop(0.7, 'rgba(150, 152, 158, 0.12)')
      gradient.addColorStop(1, 'rgba(140, 142, 148, 0)')
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)
    },
    { mipmaps: true },
  )
}

function createEmitter(
  pc: PlayCanvasNamespace,
  parent: Entity,
  name: string,
  colorMap: Texture,
  numParticles: number,
  outward: number,
): Entity {
  const entity = new pc.Entity(name)
  parent.addChild(entity)

  entity.addComponent('particlesystem', {
    numParticles,
    lifetime: 1.6,
    rate: IDLE_RATE,
    loop: true,
    autoPlay: true,
    preWarm: true,
    lighting: false,
    depthWrite: false,
    noFog: true,
    intensity: 0.92,
    blendType: pc.BLEND_NORMAL,
    emitterShape: pc.EMITTERSHAPE_BOX,
    emitterExtents: new pc.Vec3(0.2, 0.07, 0.14),
    initialVelocity: 0.48,
    colorMap,
    localSpace: false,
    scaleGraph: new pc.Curve([0, 0.16, 0.28, 0.48, 1, 1.15]),
    alphaGraph: new pc.Curve([0, 0, 0.08, 0.42, 0.42, 0.16, 1, 0]),
    colorGraph: new pc.CurveSet([
      [0, 0.72, 1, 0.52],
      [0, 0.72, 1, 0.53],
      [0, 0.74, 1, 0.55],
    ]),
    localVelocityGraph: new pc.CurveSet([
      [0, -1.15, 1, -0.35],
      [0, 1.05, 1, 0.32],
      [0, outward, 1, outward * 0.28],
    ]),
  })

  return entity
}

/**
 * White tire smoke at the rear wheels during idle/staging/amber and the
 * first ~60' of the pass. Emitters live in the scene and follow the Camaro
 * so particles stay in world space as the car launches.
 */
export function createBurnoutSmoke(opts: BurnoutSmokeOptions) {
  const { app, pc, parent, camaro, quality, reducedMotion } = opts

  if (reducedMotion || quality !== 'high') {
    return {
      onPhase: (_next: PassPhase) => undefined,
      onRaceFrame: (_progress01: number, _speed01: number) => undefined,
      reset: () => undefined,
      destroy: () => undefined,
    }
  }

  const colorMap = createSmokeMap(app, pc)
  const count = 160
  const left = createEmitter(pc, parent, 'burnout-smoke-l', colorMap, count, -0.28)
  const right = createEmitter(pc, parent, 'burnout-smoke-r', colorMap, count, 0.28)
  const emitters = [left, right]
  const localLeft = new pc.Vec3(REAR_X, REAR_Y, -REAR_Z)
  const localRight = new pc.Vec3(REAR_X, REAR_Y, REAR_Z)
  const world = new pc.Vec3()

  const systems = () =>
    emitters
      .map((entity) => entity.particlesystem)
      .filter((system): system is NonNullable<typeof system> => Boolean(system))

  const pinEmitters = () => {
    // Camaro GLB is uniformly scaled — Mat4.transformPoint would shrink
    // meter offsets into the chassis. Rotate in world space, then translate.
    const pos = camaro.getPosition()
    const rot = camaro.getRotation()
    rot.transformVector(localLeft, world)
    world.add(pos)
    left.setPosition(world)
    rot.transformVector(localRight, world)
    world.add(pos)
    right.setPosition(world)
  }

  systems().forEach((system) => {
    system.reset()
    system.play()
    system.rate = IDLE_RATE
  })
  pinEmitters()

  let phase: PassPhase = 'idle'
  let raceProgress = 0
  let updateHandler: ((dt: number) => void) | null = null

  const emit = (active: boolean, rate: number) => {
    systems().forEach((system) => {
      if (active) {
        if (!system.isPlaying()) system.play()
        system.rate = rate
      } else if (system.isPlaying()) {
        system.stop()
      }
    })
  }

  const onPhase = (next: PassPhase) => {
    phase = next
    switch (next) {
      case 'idle':
        emit(true, IDLE_RATE)
        break
      case 'staging':
        emit(true, STAGING_RATE)
        break
      case 'amber':
        emit(true, AMBER_RATE)
        break
      case 'green':
        emit(true, LAUNCH_RATE)
        break
      case 'racing':
        emit(raceProgress < 0.18, LAUNCH_RATE)
        break
      case 'finished':
        emit(false, IDLE_RATE)
        break
      default: {
        const exhaustiveCheck: never = next
        void exhaustiveCheck
      }
    }
  }

  const onRaceFrame = (progress01: number, _speed01: number) => {
    raceProgress = progress01
    if (phase === 'racing') {
      emit(progress01 < 0.18, LAUNCH_RATE)
    }
  }

  const reset = () => {
    phase = 'idle'
    raceProgress = 0
    pinEmitters()
    systems().forEach((system) => {
      system.reset()
      system.play()
      system.rate = IDLE_RATE
    })
  }

  const start = () => {
    if (updateHandler) return
    updateHandler = () => pinEmitters()
    app.on('update', updateHandler)
  }

  const destroy = () => {
    if (updateHandler) {
      app.off('update', updateHandler)
      updateHandler = null
    }
    emitters.forEach((entity) => entity.destroy())
    emitters.length = 0
    colorMap.destroy()
  }

  start()

  return { onPhase, onRaceFrame, reset, destroy }
}
