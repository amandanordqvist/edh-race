import type { Application } from 'playcanvas'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import { studioPosterSrc } from '../../data/machine'
import { useT } from '../../i18n'
import type { StudioOrbit } from '../../lib/machine/studioOrbit'
import './CamaroStudio.css'

export function CamaroStudio() {
  const t = useT()
  const labelId = useId()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbitRef = useRef<StudioOrbit | null>(null)
  const draggingRef = useRef(false)
  const claimedRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)

  const [loading, setLoading] = useState(true)
  const [webglOk, setWebglOk] = useState(true)
  const [hintOn, setHintOn] = useState(true)
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !webglOk) return

    let cancelled = false
    let destroyApp: (() => void) | null = null
    let frameHandler: ((dt: number) => void) | null = null
    let appInstance: Application | null = null

    async function init(canvasEl: HTMLCanvasElement) {
      setLoading(true)
      try {
        const [
          { createPassApp },
          { detectPassQuality },
          { buildStudioScene },
          { createStudioOrbit },
        ] = await Promise.all([
          import('../../lib/pass/createApp'),
          import('../../lib/pass/quality'),
          import('../../lib/machine/buildStudio'),
          import('../../lib/machine/studioOrbit'),
        ])

        const quality = detectPassQuality()
        const { app, pc, destroy } = await createPassApp(canvasEl, quality)
        appInstance = app

        const handleContextLost = (event: Event) => {
          event.preventDefault()
          if (!cancelled) setWebglOk(false)
        }
        canvasEl.addEventListener('webglcontextlost', handleContextLost)

        if (cancelled) {
          canvasEl.removeEventListener('webglcontextlost', handleContextLost)
          destroy()
          return
        }

        let destroyed = false
        destroyApp = () => {
          if (destroyed) return
          destroyed = true
          canvasEl.removeEventListener('webglcontextlost', handleContextLost)
          destroy()
        }

        const scene = await buildStudioScene(app, pc, quality)
        if (cancelled) {
          destroyApp()
          return
        }

        const orbit = createStudioOrbit({
          camera: scene.camera,
          look: scene.look,
          reducedMotion,
        })
        orbitRef.current = orbit
        frameHandler = (dt) => orbit.onUpdate(dt)
        app.on('update', frameHandler)
        if (cancelled) {
          app.off('update', frameHandler)
          destroyApp()
          return
        }
        setLoading(false)
      } catch (error) {
        console.error('[machine] failed to start the Camaro studio', error)
        if (!cancelled) {
          setLoading(false)
          setWebglOk(false)
        }
      }
    }

    void init(canvas)

    return () => {
      cancelled = true
      if (frameHandler && appInstance) appInstance.off('update', frameHandler)
      destroyApp?.()
      orbitRef.current = null
    }
  }, [reducedMotion, webglOk])

  const hideHint = useCallback(() => setHintOn(false), [])

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (reducedMotion) return
    if (event.button !== 0 && event.pointerType === 'mouse') return
    draggingRef.current = true
    claimedRef.current = false
    startXRef.current = event.clientX
    startYRef.current = event.clientY
  }

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current || reducedMotion) return

    const dx = event.clientX - startXRef.current
    const dy = event.clientY - startYRef.current

    if (!claimedRef.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      if (Math.abs(dx) <= Math.abs(dy)) {
        draggingRef.current = false
        return
      }
      claimedRef.current = true
      hideHint()
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    event.preventDefault()
    const width = event.currentTarget.clientWidth || 1
    orbitRef.current?.onDrag(event.movementX / width)
  }

  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current && !claimedRef.current) return
    draggingRef.current = false
    claimedRef.current = false
    orbitRef.current?.onDragEnd()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (reducedMotion) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      hideHint()
      orbitRef.current?.nudgeYaw(-18)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      hideHint()
      orbitRef.current?.nudgeYaw(18)
    }
  }

  return (
    <figure className="camaro-studio" aria-labelledby={labelId}>
      <div
        className="camaro-studio__stage"
        tabIndex={webglOk ? 0 : undefined}
        aria-label={t.machine.turntableLabel}
        onKeyDown={onKeyDown}
      >
        {webglOk ? (
          <>
            {loading ? (
              <div className="camaro-studio__loading" role="status" aria-live="polite">
                <span className="camaro-studio__spinner" aria-hidden="true" />
                <span className="camaro-studio__loading-text">{t.machine.studioLoading}</span>
              </div>
            ) : null}
            <canvas
              ref={canvasRef}
              className="camaro-studio__canvas"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
          </>
        ) : (
          <div className="camaro-studio__fallback">
            <img src={studioPosterSrc} alt="" draggable={false} />
            <p className="camaro-studio__fallback-msg" role="status">
              {t.machine.studioFallback}
            </p>
          </div>
        )}
        <p className="camaro-studio__sr" id={labelId}>
          {t.machine.turntableLabel}
        </p>
      </div>
      {webglOk && !reducedMotion ? (
        <figcaption className={`camaro-studio__hint${hintOn ? '' : ' is-dim'}`}>
          {t.machine.turntableHint}
        </figcaption>
      ) : null}
    </figure>
  )
}
