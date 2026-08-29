import type { Application, Texture } from 'playcanvas'

import type { PlayCanvasNamespace } from './scenePrimitives'

type CanvasTextureOptions = {
  repeatU?: boolean
  repeatV?: boolean
  mipmaps?: boolean
  srgb?: boolean
}

/**
 * Upload canvas pixels as a typed buffer. `Texture#setSource(canvas)` reads
 * `getBoundingClientRect()` on detached canvases (0×0 → 1×1) and often falls
 * back to linear RGBA8, which kills smoke/crowd and trips the particle sRGB warning.
 */
export function createCanvasTexture(
  app: Application,
  pc: PlayCanvasNamespace,
  name: string,
  width: number,
  height: number,
  paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  options: CanvasTextureOptions = {},
): Texture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) paint(ctx, width, height)

  const srgb = options.srgb ?? true
  const pixels = ctx
    ? new Uint8Array(ctx.getImageData(0, 0, width, height).data)
    : new Uint8Array(width * height * 4)

  const texture = new pc.Texture(app.graphicsDevice, {
    name,
    width,
    height,
    format: pc.PIXELFORMAT_RGBA8,
    srgb,
    mipmaps: options.mipmaps ?? true,
    minFilter: options.mipmaps === false ? pc.FILTER_LINEAR : pc.FILTER_LINEAR_MIPMAP_LINEAR,
    magFilter: pc.FILTER_LINEAR,
    levels: [pixels],
  })
  texture.addressU = options.repeatU ? pc.ADDRESS_REPEAT : pc.ADDRESS_CLAMP_TO_EDGE
  texture.addressV = options.repeatV ? pc.ADDRESS_REPEAT : pc.ADDRESS_CLAMP_TO_EDGE
  return texture
}
