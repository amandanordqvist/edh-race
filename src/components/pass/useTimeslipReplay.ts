import { useEffect, useRef, useState, type RefObject } from 'react'

import { edhTimeslipMeta, edhTimeslipRows, type TimeslipSplitId } from '../../data/simulator'
import { camaroStripProgress } from '../../lib/pass/ease'

export type LitMark = TimeslipSplitId

const ALL_LIT: ReadonlySet<LitMark> = new Set(
  edhTimeslipRows.map((row) => row.id),
)

const START_LIT: ReadonlySet<LitMark> = new Set(['reaction'])

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function applyProgress(
  progress: number,
  fillRef: RefObject<HTMLSpanElement | null>,
  travellerRef: RefObject<HTMLSpanElement | null>,
) {
  const p = Math.min(1, Math.max(0, progress))
  if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`
  if (travellerRef.current) travellerRef.current.style.transform = `translateX(${p * 100}%)`
}

function marksAt(elapsedS: number): Set<LitMark> {
  const next = new Set<LitMark>(['reaction'])
  for (const row of edhTimeslipRows) {
    if (row.et !== null && elapsedS >= row.et) next.add(row.id)
  }
  return next
}

export function useTimeslipReplay(active: boolean) {
  const fillRef = useRef<HTMLSpanElement>(null)
  const travellerRef = useRef<HTMLSpanElement>(null)
  const [lit, setLit] = useState<ReadonlySet<LitMark>>(START_LIT)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const reduced = prefersReducedMotion()

    if (!active) {
      setLit(START_LIT)
      setRunning(false)
      applyProgress(0, fillRef, travellerRef)
      return
    }

    if (reduced) {
      setLit(ALL_LIT)
      setRunning(false)
      applyProgress(1, fillRef, travellerRef)
      return
    }

    setLit(START_LIT)
    setRunning(true)
    applyProgress(0, fillRef, travellerRef)

    let frame = 0
    const startedAt = performance.now()
    const et = edhTimeslipMeta.et
    let lastSize = START_LIT.size

    const tick = (now: number) => {
      const elapsed = Math.min(et, (now - startedAt) / 1000)
      applyProgress(camaroStripProgress(elapsed), fillRef, travellerRef)

      const next = marksAt(elapsed)
      if (next.size !== lastSize) {
        lastSize = next.size
        setLit(next)
      }

      if (elapsed < et) {
        frame = requestAnimationFrame(tick)
        return
      }

      setLit(ALL_LIT)
      setRunning(false)
      applyProgress(1, fillRef, travellerRef)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      setRunning(false)
    }
  }, [active])

  return { lit, running, fillRef, travellerRef }
}
