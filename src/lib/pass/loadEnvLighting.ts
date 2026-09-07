import type { Application, Texture } from 'playcanvas'

import { loadTextureAsset } from './loadTextureAsset'
import type { PlayCanvasNamespace } from './scenePrimitives'
import type { PassQuality } from './types'

/** Poly Haven PureSky — sky + sun, no ground photo. */
const ENV_HDR_URL = '/models/kloofendal_48d_partly_cloudy_puresky_2k.hdr'

/**
 * Apply a daytime sky HDRI as skybox + IBL. Returns false on mobile/low
 * quality or if the file fails to load — callers keep the procedural sky.
 */
export async function applyPassEnvLighting(
  app: Application,
  pc: PlayCanvasNamespace,
  quality: PassQuality,
): Promise<boolean> {
  if (quality !== 'high') return false

  try {
    const asset = await loadTextureAsset(app, pc, ENV_HDR_URL, 'pass-puresky', {
      mipmaps: false,
      srgb: false,
    })
    const source = asset.resource as Texture | undefined
    if (!source) return false

    source.addressU = pc.ADDRESS_CLAMP_TO_EDGE
    source.addressV = pc.ADDRESS_CLAMP_TO_EDGE

    const skybox = pc.EnvLighting.generateSkyboxCubemap(source, 512)
    const lighting = pc.EnvLighting.generateLightingSource(source, { size: 128 })
    const envAtlas = pc.EnvLighting.generateAtlas(lighting, {
      size: 512,
    })
    lighting.destroy()

    app.scene.skybox = skybox
    app.scene.envAtlas = envAtlas
    app.scene.skyboxMip = 0
    app.scene.skyboxIntensity = 0.65
    const skyboxLayer = app.scene.layers.getLayerById(pc.LAYERID_SKYBOX)
    if (skyboxLayer) skyboxLayer.enabled = false
    app.scene.ambientLight = new pc.Color(0.18, 0.20, 0.24)

    return true
  } catch (error) {
    console.warn('[pass] Kloofendal PureSky unavailable — keeping procedural sky', error)
    return false
  }
}
