import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'

import { createPassAudio } from '../../lib/pass/audioController'
import { createCameraDirector } from '../../lib/pass/cameraDirector'
import { createPassEffects } from '../../lib/pass/passEffects'
import { detectPassQuality } from '../../lib/pass/quality'
import { createRaceController } from '../../lib/pass/raceController'
import type { HudSplitId } from '../../data/simulator'
import { useT } from '../../i18n'
import { PASS_SCENE_REVISION } from '../../lib/pass/passRevision'
import type { PassCameraView, PassCommands, PassPhase, PassSceneMeta } from '../../lib/pass/types'
import './PassCanvas.css'

type PassCanvasProps = {
  muted: boolean
  reducedMotion: boolean
  onPhase: (phase: PassPhase) => void
  onClock: (seconds: number) => void
  onSpeed?: (speedKmh: number) => void
  onGap?: (gapM: number) => void
  onRemaining?: (meters: number) => void
  onOpponentClock?: (seconds: number) => void
  onChuteDeploy?: (chuteDeploy01: number) => void
  onLaunch?: (reactionS: number | null) => void
  onSplitCallout?: (splitId: HudSplitId) => void
  onCameraView?: (view: PassCameraView) => void
  onFinished: () => void
  onWebglUnavailable: () => void
  onReady: (commands: PassCommands, meta: PassSceneMeta) => void
  onInspectInteract?: () => void
}

type LiveHandlers = Pick<
  PassCanvasProps,
  | 'reducedMotion'
  | 'onPhase'
  | 'onClock'
  | 'onSpeed'
  | 'onGap'
  | 'onRemaining'
  | 'onOpponentClock'
  | 'onChuteDeploy'
  | 'onLaunch'
  | 'onSplitCallout'
  | 'onCameraView'
  | 'onFinished'
  | 'onWebglUnavailable'
  | 'onReady'
  | 'onInspectInteract'
>

export function PassCanvas(props: PassCanvasProps) {
  const t = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draggingRef = useRef(false)
  const cameraDirectorRef = useRef<ReturnType<typeof createCameraDirector> | null>(null)
  const [loading, setLoading] = useState(true)
  const liveRef = useRef<LiveHandlers>({
    reducedMotion: props.reducedMotion,
    onPhase: props.onPhase,
    onClock: props.onClock,
    onSpeed: props.onSpeed,
    onGap: props.onGap,
    onRemaining: props.onRemaining,
    onOpponentClock: props.onOpponentClock,
    onChuteDeploy: props.onChuteDeploy,
    onLaunch: props.onLaunch,
    onSplitCallout: props.onSplitCallout,
    onCameraView: props.onCameraView,
    onFinished: props.onFinished,
    onWebglUnavailable: props.onWebglUnavailable,
    onReady: props.onReady,
    onInspectInteract: props.onInspectInteract,
  })

  useEffect(() => {
    liveRef.current = {
      reducedMotion: props.reducedMotion,
      onPhase: props.onPhase,
      onClock: props.onClock,
      onSpeed: props.onSpeed,
      onGap: props.onGap,
      onRemaining: props.onRemaining,
      onOpponentClock: props.onOpponentClock,
      onChuteDeploy: props.onChuteDeploy,
      onLaunch: props.onLaunch,
      onSplitCallout: props.onSplitCallout,
      onCameraView: props.onCameraView,
      onFinished: props.onFinished,
      onWebglUnavailable: props.onWebglUnavailable,
      onReady: props.onReady,
      onInspectInteract: props.onInspectInteract,
    }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let destroyApp: (() => void) | null = null
    let raceController: ReturnType<typeof createRaceController> | null = null
    let cameraDirector: ReturnType<typeof createCameraDirector> | null = null
    let passEffects: ReturnType<typeof createPassEffects> | null = null
    let frameHandler: ((dt: number) => void) | null = null
    let appInstance: import('playcanvas').Application | null = null
    const audio = createPassAudio({ reducedMotion: props.reducedMotion })

    async function init(canvasEl: HTMLCanvasElement) {
      setLoading(true)
      try {
        const [{ createPassApp }, { buildPassScene }] = await Promise.all([
          import('../../lib/pass/createApp'),
          import('../../lib/pass/buildScene'),
        ])

        const quality = detectPassQuality()
        const { app, pc, destroy } = await createPassApp(canvasEl, quality)
        appInstance = app
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

        const scene = await buildPassScene(app, pc, quality)
        const reducedMotion = liveRef.current.reducedMotion

        cameraDirector = createCameraDirector({
          camera: scene.camera,
          camaro: scene.racers.camaro,
          trackLength: scene.trackLength,
          reducedMotion,
          onViewChange: (view) => liveRef.current.onCameraView?.(view),
        })
        cameraDirectorRef.current = cameraDirector

        passEffects = createPassEffects({
          app,
          pc,
          sceneRoot: scene.sceneRoot,
          trackLength: scene.trackLength,
          quality,
          stripLightMaterials: scene.stripLightMaterials,
          camaro: scene.racers.camaro,
          camaroBodyMaterial: scene.camaroBodyMaterial,
          camaroHasTextures: scene.camaroHasTextures,
          reducedMotion,
          isWideView: () => cameraDirector?.getView() === 'wide',
          setSpeedFeel: scene.setSpeedFeel,
        })

        frameHandler = (dt: number) => {
          cameraDirector?.onUpdate(dt)
        }
        app.on('update', frameHandler)

        raceController = createRaceController({
          app,
          scene,
          reducedMotion,
          handlers: {
            onPhase: (phase) => {
              cameraDirector?.onPhase(phase)
              passEffects?.onPhase(phase)
              audio.onPhase(phase)
              liveRef.current.onPhase(phase)
            },
            onClock: (seconds) => liveRef.current.onClock(seconds),
            onFinished: () => liveRef.current.onFinished(),
            onWebglUnavailable: () => liveRef.current.onWebglUnavailable(),
            onLaunch: (reactionS) => liveRef.current.onLaunch?.(reactionS),
          },
          onRaceFrame: (frame) => {
            cameraDirector?.onRaceProgress(
              frame.progress01,
              frame.speed01,
              frame.heroX,
              frame.timeScale,
              frame.chuteDeploy01,
            )
            passEffects?.onRaceFrame(
              frame.progress01,
              frame.speed01,
              frame.heroX,
              frame.chuteDeploy01,
            )
            audio.onRaceSpeed(frame.speed01)
            liveRef.current.onSpeed?.(frame.speedKmh)
            liveRef.current.onGap?.(frame.gapM)
            liveRef.current.onRemaining?.(
              Math.max(0, (1 - frame.progress01) * 402),
            )
            liveRef.current.onOpponentClock?.(frame.opponentClock)
            liveRef.current.onChuteDeploy?.(frame.chuteDeploy01)
            if (frame.splitHit) {
              liveRef.current.onSplitCallout?.(frame.splitHit)
            }
          },
        })

        if (cancelled) {
          if (frameHandler) app.off('update', frameHandler)
          passEffects?.destroy()
          raceController.destroy()
          cameraDirector.destroy()
          destroyApp()
          return
        }

        liveRef.current.onReady(
          {
            stage: () => {
              void audio.unlock().then(() => raceController?.stage())
            },
            launch: () => raceController?.launch(),
            seek: (elapsedS) => raceController?.seek(elapsedS),
            reset: () => {
              raceController?.reset()
              cameraDirector?.reset()
              passEffects?.reset()
            },
            setMuted: (muted) => {
              audio.setMuted(muted)
            },
            setCameraView: (view) => {
              cameraDirector?.setView(view)
            },
            setOpponent: (opponent) => {
              scene.setOpponent(opponent)
            },
            destroy: () => {
              if (frameHandler) app.off('update', frameHandler)
              audio.destroy()
              passEffects?.destroy()
              raceController?.destroy()
              cameraDirector?.destroy()
              destroyApp?.()
            },
          },
          {
            camaroUsesGlb: scene.camaroUsesGlb,
            camaroHasTextures: scene.camaroHasTextures,
          },
        )
        if (!cancelled) {
          setLoading(false)
        }
      } catch (error) {
        if (!cancelled) {
          setLoading(false)
          console.error('[pass] failed to start the PlayCanvas scene', error)
        }
      }
    }

    init(canvas)

    return () => {
      cancelled = true
      if (frameHandler && appInstance) {
        appInstance.off('update', frameHandler)
      }
      audio.destroy()
      passEffects?.destroy()
      raceController?.destroy()
      cameraDirector?.destroy()
      destroyApp?.()
      cameraDirectorRef.current = null
    }
    // Mount once per scene revision; live values go through liveRef.
  }, [PASS_SCENE_REVISION])

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (liveRef.current.reducedMotion) return
    draggingRef.current = true
    liveRef.current.onInspectInteract?.()
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
    cameraDirectorRef.current?.onIdleLookEnd()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleWheel = (event: ReactWheelEvent<HTMLCanvasElement>) => {
    if (liveRef.current.reducedMotion) return
    event.preventDefault()
    liveRef.current.onInspectInteract?.()
    cameraDirectorRef.current?.onZoomDelta(event.deltaY)
  }

  return (
    <div className="pass-canvas" aria-hidden={loading ? 'true' : undefined}>
      {loading ? (
        <div className="pass-canvas__loading" role="status" aria-live="polite">
          <span className="pass-canvas__loading-spinner" aria-hidden="true" />
          <span className="pass-canvas__loading-text">{t.pass.loading}</span>
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        className="pass-canvas__surface"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      />
    </div>
  )
}
