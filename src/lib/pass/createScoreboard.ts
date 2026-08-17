import type { Application, Entity, StandardMaterial, Texture } from 'playcanvas'

import { TRACK_LENGTH } from './passLayout'
import { createMaterial, createPrimitive, type PlayCanvasNamespace } from './scenePrimitives'
import type { PassOpponentId } from './types'

const CANVAS_W = 1280
const CANVAS_H = 320
const BOARD_X = TRACK_LENGTH + 2.4
const BOARD_Y = 4.55
const BOARD_W = 9.6
const BOARD_H = 2.45

const OPPONENT_TAG: Record<PassOpponentId, string> = {
  f1: 'F1',
  jet: 'JET',
}

export type ScoreboardState = {
  heroEt: number | null
  heroTrap: number | null
  heroWin: boolean
  opponentId: PassOpponentId
  opponentEt: number | null
  opponentTrap: number | null
}

export type PassScoreboard = {
  update: (state: ScoreboardState) => void
  setOpponent: (opponent: PassOpponentId) => void
  reset: () => void
}

function formatEt(seconds: number | null): string {
  return seconds === null ? '-.---' : seconds.toFixed(3)
}

function formatTrap(kmh: number | null): string {
  return kmh === null ? '---' : String(Math.round(kmh))
}

function fingerprint(state: ScoreboardState): string {
  return [
    formatEt(state.heroEt),
    formatTrap(state.heroTrap),
    state.heroWin ? '1' : '0',
    state.opponentId,
    formatEt(state.opponentEt),
    formatTrap(state.opponentTrap),
  ].join('|')
}

function idleState(opponentId: PassOpponentId): ScoreboardState {
  return {
    heroEt: null,
    heroTrap: null,
    heroWin: false,
    opponentId,
    opponentEt: null,
    opponentTrap: null,
  }
}

function drawLane(
  ctx: CanvasRenderingContext2D,
  x: number,
  width: number,
  name: string,
  et: string,
  trap: string,
  win: boolean,
): void {
  ctx.fillStyle = 'rgba(232, 236, 244, 0.42)'
  ctx.font = '600 28px "Barlow Condensed", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(name, x + 36, 52)

  if (win) {
    ctx.fillStyle = '#4d7fd6'
    ctx.font = '700 26px "Barlow Condensed", sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('WIN', x + width - 36, 52)
  }

  ctx.fillStyle = 'rgba(232, 184, 106, 0.55)'
  ctx.font = '600 22px "Barlow Condensed", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('ET', x + 36, 148)
  ctx.fillText('TRAP', x + 36, 248)

  ctx.fillStyle = win ? '#f3d39a' : '#e8b86a'
  ctx.font = '700 92px Oswald, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(et, x + width - 36, 162)

  ctx.fillStyle = 'rgba(232, 184, 106, 0.88)'
  ctx.font = '600 56px Oswald, sans-serif'
  ctx.fillText(trap, x + width - 36, 258)
}

function paint(canvas: HTMLCanvasElement, state: ScoreboardState): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

  ctx.fillStyle = '#07090e'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  ctx.fillStyle = 'rgba(42, 79, 154, 0.55)'
  ctx.fillRect(0, 0, CANVAS_W, 6)
  ctx.fillRect(0, CANVAS_H - 6, CANVAS_W, 6)

  const mid = CANVAS_W / 2
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.fillRect(mid - 1, 18, 2, CANVAS_H - 36)

  // Looking +X down the strip: left = −Z far lane (opponent), right = +Z near lane (EDH).
  drawLane(
    ctx,
    0,
    mid,
    OPPONENT_TAG[state.opponentId],
    formatEt(state.opponentEt),
    formatTrap(state.opponentTrap),
    false,
  )
  drawLane(
    ctx,
    mid,
    mid,
    'EDH',
    formatEt(state.heroEt),
    formatTrap(state.heroTrap),
    state.heroWin,
  )
}

/**
 * Dual-lane board just past the 1320' gantry, facing the cars.
 */
export function createScoreboard(
  app: Application,
  pc: PlayCanvasNamespace,
  sceneRoot: Entity,
): PassScoreboard {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H

  const texture = new pc.Texture(app.graphicsDevice, {
    name: 'pass-scoreboard',
    width: CANVAS_W,
    height: CANVAS_H,
    format: pc.PIXELFORMAT_RGBA8,
    mipmaps: false,
    minFilter: pc.FILTER_LINEAR,
    magFilter: pc.FILTER_LINEAR,
    addressU: pc.ADDRESS_CLAMP_TO_EDGE,
    addressV: pc.ADDRESS_CLAMP_TO_EDGE,
    flipY: false,
  }) as Texture

  let state = idleState('f1')
  let lastPrint = ''

  const screenMat = new pc.StandardMaterial() as StandardMaterial
  screenMat.useLighting = false
  screenMat.diffuse.set(0, 0, 0)
  screenMat.emissive.set(1, 1, 1)
  screenMat.emissiveIntensity = 1.15
  screenMat.emissiveMap = texture
  screenMat.useMetalness = true
  screenMat.metalness = 0
  screenMat.gloss = 0.08
  screenMat.cull = pc.CULLFACE_BACK
  screenMat.update()

  const upload = (next: ScoreboardState) => {
    const print = fingerprint(next)
    if (print === lastPrint) return
    lastPrint = print
    state = next
    paint(canvas, next)
    texture.setSource(canvas)
    texture.upload()
    screenMat.emissiveIntensity = next.heroWin ? 2.15 : 1.15
    screenMat.update()
  }

  upload(state)

  const steel = createMaterial(pc, {
    diffuse: [0.16, 0.17, 0.2],
    metalness: 0.62,
    gloss: 0.38,
  })
  const housing = createMaterial(pc, {
    diffuse: [0.07, 0.08, 0.1],
    metalness: 0.28,
    gloss: 0.18,
  })

  const root = new pc.Entity('scoreboard')
  root.setLocalPosition(BOARD_X, 0, 0)
  sceneRoot.addChild(root)

  ;([-BOARD_W / 2 + 0.35, BOARD_W / 2 - 0.35] as const).forEach((z, i) => {
    root.addChild(
      createPrimitive(pc, {
        name: `scoreboard-post-${i}`,
        type: 'box',
        position: [0.08, BOARD_Y / 2, z],
        scale: [0.18, BOARD_Y, 0.18],
        material: steel,
        castShadows: true,
      }),
    )
  })

  root.addChild(
    createPrimitive(pc, {
      name: 'scoreboard-housing',
      type: 'box',
      position: [0.12, BOARD_Y, 0],
      scale: [0.28, BOARD_H + 0.28, BOARD_W + 0.32],
      material: housing,
      castShadows: true,
    }),
  )

  // Explicit YZ quad facing the cars (−X). Box-primitive UVs were mirrored.
  const hw = BOARD_W / 2
  const hh = BOARD_H / 2
  const mesh = new pc.Mesh(app.graphicsDevice)
  mesh.setPositions([
    0, hh, -hw,
    0, hh, hw,
    0, -hh, hw,
    0, -hh, -hw,
  ])
  mesh.setNormals([-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0])
  mesh.setUvs(0, [0, 0, 1, 0, 1, 1, 0, 1])
  mesh.setIndices([0, 3, 2, 0, 2, 1])
  mesh.update()

  const screen = new pc.Entity('scoreboard-screen')
  screen.addComponent('render', {
    meshInstances: [new pc.MeshInstance(mesh, screenMat)],
    castShadows: false,
  })
  screen.setLocalPosition(-0.04, BOARD_Y, 0)
  root.addChild(screen)

  return {
    update: upload,
    setOpponent: (opponent) => {
      upload({ ...state, opponentId: opponent })
    },
    reset: () => {
      lastPrint = ''
      upload(idleState(state.opponentId))
    },
  }
}
