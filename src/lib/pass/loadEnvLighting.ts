import type { Application, Texture } from 'playcanvas'

import { loadTextureAsset } from './loadTextureAsset'
import type { PlayCanvasNamespace } from './scenePrimitives'
import type { PassQuality } from './types'

/** Poly Haven PureSky — blue sky + sun. Not a landscape photo. */
const ENV_HDR_URL = '/models/sunflowers_puresky_2k.hdr'

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
    const asset = await loadTextureAsset(app, pc, ENV_HDR_URL, 'pass-puresky')
    const source = asset.resource as Texture | undefined
    if (!source) return false

    source.addressU = pc.ADDRESS_CLAMP_TO_EDGE
    source.addressV = pc.ADDRESS_CLAMP_TO_EDGE

    const skybox = pc.EnvLighting.generateSkyboxCubemap(source, 256)
    const lighting = pc.EnvLighting.generateLightingSource(source, { size: 128 })
    const envAtlas = pc.EnvLighting.generateAtlas(lighting, {
      size: 256,
      numReflectionSamples: 256,
      numAmbientSamples: 512,
    })
    lighting.destroy()

    app.scene.skybox = skybox
    app.scene.envAtlas = envAtlas
    // Mip 1+ filters the cubemap so car paint isn't pixel-speckle.
    app.scene.skyboxMip = 1
    app.scene.skyboxIntensity = 0.95
    app.scene.ambientLight = new pc.Color(0.1, 0.12, 0.16)

    return true
  } catch (error) {
    console.warn('[pass] PureSky HDRI unavailable — keeping procedural sky', error)
    return false
  }
}
