import type { Application, Asset } from 'playcanvas'

import type { PlayCanvasNamespace } from './scenePrimitives'

export function loadTextureAsset(
  app: Application,
  pc: PlayCanvasNamespace,
  url: string,
  name: string,
  data?: Record<string, unknown>,
): Promise<Asset> {
  return new Promise((resolve, reject) => {
    const asset = new pc.Asset(name, 'texture', { url }, data)

    asset.on('error', (message: string) => {
      reject(new Error(message || `Failed to load texture ${url}`))
    })

    asset.on('load', () => {
      resolve(asset)
    })

    app.assets.add(asset)
    app.assets.load(asset)
  })
}
