import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'

import { createPassAudio } from '../../lib/pass/audioController'
import { createCameraDirector } from '../../lib/pass/cameraDirector'
import { detectPassQuality } from '../../lib/pass/quality'
import { createRaceController } from '../../lib/pass/raceController'
import type { PassCommands, PassPhase } from '../../lib/pass/types'
import './PassCanvas.css'

type PassCanvasProps = {
  muted: boolean
  reducedMotion: boolean
  onPhase: (phase: PassPhase) => void
  onClock: (seconds: number) => void
  onFinished: () => void
  onWebglUnavailable: () => void
  onReady: (commands: PassCommands) => void
}

type LiveHandlers = Pick<
  PassCanvasProps,
  'reducedMotion' | 'onPhase' | 'onClock' | 'onFinished' | 'onWebglUnavailable' | 'onReady'
>

export function PassCanvas(props: PassCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draggingRef = useRef(false)
  const cameraDirectorRef = useRef<ReturnType<typeof createCameraDirector> | null>(null)
  const liveRef = useRef<LiveHandlers>({
    reducedMotion: props.reducedMotion,
    onPhase: props.onPhase,
    onClock: props.onClock,
    onFinished: props.onFinished,
    onWebglUnavailable: props.onWebglUnavailable,
    onReady: props.onReady,
  })

  useEffect(() => {
    liveRef.current = {
      reducedMotion: props.reducedMotion,
      onPhase: props.onPhase,
      onClock: props.onClock,
      onFinished: props.onFinished,
      onWebglUnavailable: props.onWebglUnavailable,
      onReady: props.onReady,
    }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let destroyApp: (() => void) | null = null
    let raceController: ReturnType<typeof createRaceController> | null = null
    let cameraDirector: ReturnType<typeof createCameraDirector> | null = null
    const audio = createPassAudio({ reducedMotion: props.reducedMotion })

    async function init(canvasEl: HTMLCanvasElement) {
      try {
        const [{ createPassApp }, { buildPassScene }] = await Promise.all([
          import('../../lib/pass/createApp'),
          import('../../lib/pass/buildScene'),
        ])

        const quality = detectPassQuality()
        const { app, pc, destroy } = await createPassApp(canvasEl, quality)
        const handleWebglContextLost = (event: Event) => {
          event.preventDefault()
          liveRef.current.onWebglUnavailable()
        }

        canvasEl.addEventListener('webglcontextlost', handleWebglContextLost)

        if (cancelled) {
          canvasEl.removeEventListener('webglcontextlost', handleWebglContextLost)
          destroy()
          return
        }

        destroyApp = () => {
          canvasEl.removeEventListener('webglcontextlost', handleWebglContextLost)
          destroy()
        }

        const scene = buildPassScene(app, pc, quality)
        const reducedMotion = liveRef.current.reducedMotion

        cameraDirector = createCameraDirector({
          camera: scene.camera,
          camaro: scene.racers.camaro,
          trackLength: scene.trackLength,
          reducedMotion,
        })
        cameraDirectorRef.current = cameraDirector

        raceController = createRaceController({
          app,
          scene,
          reducedMotion,
          handlers: {
            onPhase: (phase) => {
              cameraDirector?.onPhase(phase)
              audio.onPhase(phase)
              liveRef.current.onPhase(phase)
            },
            onClock: (seconds) => liveRef.current.onClock(seconds),
            onFinished: () => liveRef.current.onFinished(),
            onWebglUnavailable: () => liveRef.current.onWebglUnavailable(),
          },
          onRaceFrame: (progress01) => {
            cameraDirector?.onRaceProgress(progress01)
          },
        })

        if (cancelled) {
          raceController.destroy()
          cameraDirector.destroy()
          destroyApp()
          return
        }

        liveRef.current.onReady({
          stage: () => {
            void audio.unlock().then(() => raceController?.stage())
          },
          reset: () => {
            raceController?.reset()
            cameraDirector?.reset()
          },
          setMuted: (muted) => {
            audio.setMuted(muted)
          },
          destroy: () => {
            audio.destroy()
            raceController?.destroy()
            cameraDirector?.destroy()
            destroyApp?.()
          },
        })
      } catch (error) {
        if (!cancelled) {
          console.error('[pass] failed to start the PlayCanvas scene', error)
          liveRef.current.onWebglUnavailable()
        }
      }
    }

    init(canvas)

    return () => {
      cancelled = true
      audio.destroy()
      raceController?.destroy()
      cameraDirector?.destroy()
      destroyApp?.()
      cameraDirectorRef.current = null
    }
    // Mount once; live values are read through liveRef to avoid tearing down PlayCanvas per render.
  }, [])

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (liveRef.current.reducedMotion) return
    draggingRef.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current || liveRef.current.reducedMotion) return

    const canvas = canvasRef.current
    const width = canvas?.clientWidth || 1
    const height = canvas?.clientHeight || 1

    cameraDirectorRef.current?.onIdleLook(
      event.movementX / width,
      event.movementY / height,
    )
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div className="pass-canvas" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="pass-canvas__surface"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  )
}
