import type { PassQuality } from './types'

function getCanvasSize(canvas: HTMLCanvasElement): { width: number; height: number } {
  const parent = canvas.parentElement

  if (parent) {
    const { width, height } = parent.getBoundingClientRect()

    return {
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(height)),
    }
  }

  return {
    width: Math.max(1, canvas.clientWidth || canvas.width || 1),
    height: Math.max(1, canvas.clientHeight || canvas.height || 1),
  }
}

export async function createPassApp(
  canvas: HTMLCanvasElement,
  quality: PassQuality,
): Promise<{
  app: import('playcanvas').Application
  pc: typeof import('playcanvas')
  destroy: () => void
}> {
  const pc = await import('playcanvas')
  const app = new pc.Application(canvas, {
    graphicsDeviceOptions: { antialias: true, alpha: false },
  })
  app.scene.ambientLight = new pc.Color(0.18, 0.20, 0.24)
  const pixelRatioCap = quality === 'low' ? 1.25 : 2

  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'

  app.graphicsDevice.maxPixelRatio = pixelRatioCap

  const resize = () => {
    const { width, height } = getCanvasSize(canvas)

    app.resizeCanvas(width, height)
    app.setCanvasResolution(pc.RESOLUTION_AUTO)
  }

  const { width, height } = getCanvasSize(canvas)

  app.setCanvasFillMode(pc.FILLMODE_NONE, width, height)
  app.setCanvasResolution(pc.RESOLUTION_AUTO)
  resize()
  window.addEventListener('resize', resize)
  document.addEventListener('fullscreenchange', resize)

  const parent = canvas.parentElement
  const observer = parent ? new ResizeObserver(() => resize()) : null
  if (parent) observer?.observe(parent)

  app.start()

  return {
    app,
    pc,
    destroy: () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('fullscreenchange', resize)
      observer?.disconnect()
      app.destroy()
    },
  }
}
