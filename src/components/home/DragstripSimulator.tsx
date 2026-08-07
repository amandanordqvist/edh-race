import { useCallback, useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  simulatorRacers,
  TREE_AMBER_MS,
  TREE_STAGE_MS,
  type SimulatorRacerId,
} from '../../data/simulator'
import { useT } from '../../i18n'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './DragstripSimulator.css'

type Phase = 'idle' | 'staging' | 'amber' | 'green' | 'racing' | 'finished'

function assertNever(x: never): never {
  throw new Error(`Unhandled phase: ${x}`)
}

export function DragstripSimulator() {
  const t = useT()
  const labelId = useId()
  const [phase, setPhase] = useState<Phase>('idle')
  const [clock, setClock] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const laneRefs = useRef<Record<SimulatorRacerId, HTMLDivElement | null>>({
    camaro: null,
    f1: null,
    jet: null,
  })
  const timers = useRef<number[]>([])
  const raceTween = useRef<gsap.core.Timeline | null>(null)

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  const resetLanes = useCallback(() => {
    raceTween.current?.kill()
    raceTween.current = null
    simulatorRacers.forEach((racer) => {
      const el = laneRefs.current[racer.id]
      if (el) gsap.set(el, { x: 0, yPercent: -50 })
    })
  }, [])

  useEffect(
    () => () => {
      clearTimers()
      raceTween.current?.kill()
    },
    [clearTimers],
  )

  useEffect(() => {
    simulatorRacers.forEach((racer) => {
      const el = laneRefs.current[racer.id]
      if (el) gsap.set(el, { x: 0, yPercent: -50 })
    })
  }, [])

  const runRace = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const maxEt = Math.max(...simulatorRacers.map((r) => r.et))

    if (reduced) {
      simulatorRacers.forEach((racer) => {
        const el = laneRefs.current[racer.id]
        if (!el) return
        const track = trackRef.current
        const travel = track ? track.clientWidth - el.offsetWidth - 24 : 280
        gsap.set(el, { x: travel, yPercent: -50 })
      })
      setClock(simulatorRacers[0].et)
      setPhase('finished')
      return
    }

    setPhase('racing')
    const tl = gsap.timeline({
      onUpdate: () => setClock(Number(tl.time().toFixed(2))),
      onComplete: () => {
        setClock(maxEt)
        setPhase('finished')
      },
    })
    raceTween.current = tl

    simulatorRacers.forEach((racer) => {
      const el = laneRefs.current[racer.id]
      if (!el) return
      const track = trackRef.current
      const travel = track ? track.clientWidth - el.offsetWidth - 24 : 280
      tl.fromTo(
        el,
        { x: 0, yPercent: -50 },
        {
          x: travel,
          yPercent: -50,
          duration: racer.et,
          ease: 'power2.in',
        },
        0,
      )
    })
  }, [])

  const stage = useCallback(() => {
    if (phase === 'staging' || phase === 'amber' || phase === 'green' || phase === 'racing') {
      return
    }
    clearTimers()
    resetLanes()
    setClock(0)
    setPhase('staging')

    timers.current.push(
      window.setTimeout(() => {
        setPhase('amber')
        timers.current.push(
          window.setTimeout(() => {
            setPhase('green')
            timers.current.push(
              window.setTimeout(() => {
                runRace()
              }, 180),
            )
          }, TREE_AMBER_MS),
        )
      }, TREE_STAGE_MS),
    )
  }, [phase, clearTimers, resetLanes, runRace])

  const statusLabel = (() => {
    switch (phase) {
      case 'idle':
        return t.home.simulatorStatus.idle
      case 'staging':
        return t.home.simulatorStatus.staging
      case 'amber':
        return t.home.simulatorStatus.amber
      case 'green':
        return t.home.simulatorStatus.green
      case 'racing':
        return t.home.simulatorStatus.racing
      case 'finished':
        return t.home.simulatorStatus.finished
      default:
        return assertNever(phase)
    }
  })()

  const showStageCta = phase === 'idle' || phase === 'finished'
  const treeLit =
    phase === 'amber' || phase === 'green' || phase === 'racing' || phase === 'finished'
  const greenLit = phase === 'green' || phase === 'racing' || phase === 'finished'
  const staged = phase !== 'idle'

  return (
    <Section className="sim" aria-labelledby={labelId}>
      <Reveal>
        <h2 className="section__title" id={labelId}>
          {t.home.simulatorTitle}
        </h2>
        <p className="section__lead">{t.home.simulatorBody}</p>
      </Reveal>

      <Reveal className="sim__stage" delay={0.06} y={28}>
        <div className="sim__tree" aria-hidden="true">
          <div className="sim__tree-column">
            <span className={`sim__bulb sim__bulb--stage ${staged ? 'is-on' : ''}`} />
            <span
              className={`sim__bulb sim__bulb--stage ${staged && phase !== 'staging' ? 'is-on' : ''}`}
            />
            <span className={`sim__bulb sim__bulb--amber ${treeLit && !greenLit ? 'is-on' : ''}`} />
            <span className={`sim__bulb sim__bulb--amber ${treeLit && !greenLit ? 'is-on' : ''}`} />
            <span className={`sim__bulb sim__bulb--amber ${treeLit && !greenLit ? 'is-on' : ''}`} />
            <span className={`sim__bulb sim__bulb--green ${greenLit ? 'is-on' : ''}`} />
          </div>
        </div>

        <div className="sim__controls">
          <p className="sim__status" role="status" aria-live="polite">
            {statusLabel}
          </p>
          <p className="sim__clock">{clock.toFixed(2)}s</p>
          <div className="sim__actions">
            {showStageCta ? (
              <Button onClick={stage}>
                {phase === 'finished' ? t.home.simulatorAgain : t.home.simulatorStage}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="sim__track" ref={trackRef}>
          {simulatorRacers.map((racer) => (
            <div className="sim__lane" key={racer.id}>
              <div className="sim__lane-meta">
                <span className="sim__lane-name">{t.home.simulatorCompare[racer.id]}</span>
                <span className="sim__lane-et">{racer.et.toFixed(2)}s</span>
              </div>
              <div className="sim__lane-rail">
                <div
                  className="sim__car-mover"
                  ref={(el) => {
                    laneRefs.current[racer.id] = el
                  }}
                >
                  <div className={`sim__car sim__car--${racer.id}`} />
                </div>
                <span className="sim__finish" />
              </div>
            </div>
          ))}
        </div>

        {phase === 'finished' ? (
          <ol className="sim__results">
            {[...simulatorRacers]
              .sort((a, b) => a.et - b.et)
              .map((racer, i) => (
                <li
                  key={racer.id}
                  className={`sim__result ${racer.id === 'camaro' ? 'sim__result--win' : ''}`}
                >
                  <span className="sim__result-place">{i + 1}</span>
                  <span className="sim__result-name">
                    {t.home.simulatorCompare[racer.id]}
                  </span>
                  <span className="sim__result-et">{racer.et.toFixed(2)}s</span>
                  <span className="sim__result-speed">{racer.speedLabel}</span>
                </li>
              ))}
          </ol>
        ) : null}
      </Reveal>
    </Section>
  )
}
