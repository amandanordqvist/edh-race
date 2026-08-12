import type { Application, Asset } from 'playcanvas'

import type { PlayCanvasNamespace } from './scenePrimitives'

export function loadContainerAsset(
  app: Application,
  pc: PlayCanvasNamespace,
  url: string,
  name: string,
): Promise<Asset> {
  return new Promise((resolve, reject) => {
    const asset = new pc.Asset(name, 'container', { url })

    asset.on('error', (message: string) => {
      reject(new Error(message || `Failed to load ${url}`))
    })

    asset.on('load', () => {
      resolve(asset)
    })

    app.assets.add(asset)
    app.assets.load(asset)
  })
}
