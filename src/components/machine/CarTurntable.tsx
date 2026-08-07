import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { carTurntableFrames } from '../../data/machine'
import { useT } from '../../i18n'
import './CarTurntable.css'

const FRAMES = carTurntableFrames
const COUNT = FRAMES.length
const AUTO_MS = 3800
const RESUME_MS = 3200
const FADE_MS = 420
const PX_PER_FRAME = 28

function wrap(i: number) {
  return ((i % COUNT) + COUNT) % COUNT
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function CarTurntable() {
  const t = useT()
  const labelId = useId()
  const stageRef = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(0)
  const [base, setBase] = useState(0)
  const [overlay, setOverlay] = useState(0)
  const [fading, setFading] = useState(false)
  const [hintOn, setHintOn] = useState(true)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const activeRef = useRef(0)
  const fadingRef = useRef(false)
  const pausedRef = useRef(false)
  const draggingRef = useRef(false)
  const claimedRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const startIndexRef = useRef(0)
  const resumeTimer = useRef<number | null>(null)
  const autoTimer = useRef<number | null>(null)
  const fadeTimer = useRef<number | null>(null)

  const goTo = useCallback((nextRaw: number, { instant = false } = {}) => {
    const next = wrap(nextRaw)
    if (next === activeRef.current) return
    if (fadingRef.current && !instant) return

    setHintOn(false)
    activeRef.current = next
    setActive(next)

    if (instant || reducedMotion()) {
      setBase(next)
      setOverlay(next)
      setFading(false)
      fadingRef.current = false
      return
    }

    fadingRef.current = true
    setOverlay(next)
    setFading(true)
    if (fadeTimer.current != null) window.clearTimeout(fadeTimer.current)
    fadeTimer.current = window.setTimeout(() => {
      setBase(next)
      setFading(false)
      fadingRef.current = false
      fadeTimer.current = null
    }, FADE_MS)
  }, [])

  const pause = useCallback(() => {
    pausedRef.current = true
    if (resumeTimer.current != null) {
      window.clearTimeout(resumeTimer.current)
      resumeTimer.current = null
    }
  }, [])

  const scheduleResume = useCallback(() => {
    if (reducedMotion()) return
    if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      pausedRef.current = false
      resumeTimer.current = null
    }, RESUME_MS)
  }, [])

  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
    })
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    const tick = () => {
      if (!pausedRef.current && !draggingRef.current && !fadingRef.current) {
        goTo(activeRef.current + 1)
      }
      autoTimer.current = window.setTimeout(tick, AUTO_MS)
    }
    autoTimer.current = window.setTimeout(tick, AUTO_MS + 800)
    return () => {
      if (autoTimer.current != null) window.clearTimeout(autoTimer.current)
      if (resumeTimer.current != null) window.clearTimeout(resumeTimer.current)
      if (fadeTimer.current != null) window.clearTimeout(fadeTimer.current)
    }
  }, [goTo])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    draggingRef.current = true
    claimedRef.current = false
    startXRef.current = event.clientX
    startYRef.current = event.clientY
    startIndexRef.current = activeRef.current
    pause()
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current
    if (el && !draggingRef.current && !reducedMotion()) {
      const rect = el.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      setTilt({
        x: +(py * -6).toFixed(2),
        y: +(px * 10).toFixed(2),
      })
    }

    if (!draggingRef.current) return

    const dx = event.clientX - startXRef.current
    const dy = event.clientY - startYRef.current

    if (!claimedRef.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      if (Math.abs(dx) <= Math.abs(dy)) {
        draggingRef.current = false
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
        scheduleResume()
        return
      }
      claimedRef.current = true
      setHintOn(false)
    }

    event.preventDefault()
    goTo(startIndexRef.current + Math.round(dx / -PX_PER_FRAME), { instant: true })
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current && !claimedRef.current) return
    draggingRef.current = false
    claimedRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    scheduleResume()
  }

  const onPointerLeave = () => {
    if (!draggingRef.current) setTilt({ x: 0, y: 0 })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      pause()
      goTo(activeRef.current - 1)
      scheduleResume()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      pause()
      goTo(activeRef.current + 1)
      scheduleResume()
    } else if (event.key === 'Home') {
      event.preventDefault()
      pause()
      goTo(0)
      scheduleResume()
    } else if (event.key === 'End') {
      event.preventDefault()
      pause()
      goTo(COUNT - 1)
      scheduleResume()
    }
  }

  const pick = (i: number) => {
    pause()
    goTo(i)
    scheduleResume()
  }

  return (
    <figure className="car-turntable" aria-labelledby={labelId}>
      <div
        ref={stageRef}
        className="car-turntable__stage"
        tabIndex={0}
        aria-label={t.machine.turntableLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
        onKeyDown={onKeyDown}
      >
        <div className="car-turntable__atmosphere" aria-hidden="true" />
        <div className="car-turntable__floor" aria-hidden="true" />

        <div
          className="car-turntable__rig"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          <img
            className="car-turntable__layer car-turntable__layer--base"
            src={FRAMES[base]}
            alt=""
            draggable={false}
            decoding="async"
            fetchPriority="high"
          />
          <img
            className={`car-turntable__layer car-turntable__layer--overlay${fading ? ' is-in' : ''}`}
            src={FRAMES[overlay]}
            alt=""
            draggable={false}
            decoding="async"
          />
        </div>

        <p className="car-turntable__sr" id={labelId}>
          {t.machine.turntableLabel}
        </p>
      </div>

      <div className="car-turntable__rail" role="tablist" aria-label={t.machine.turntableHint}>
        {FRAMES.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`car-turntable__thumb${i === active ? ' is-active' : ''}`}
            onClick={() => pick(i)}
          >
            <img src={src} alt="" draggable={false} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>

      <figcaption className={`car-turntable__hint${hintOn ? '' : ' is-hidden'}`}>
        {t.machine.turntableHint}
      </figcaption>
    </figure>
  )
}
