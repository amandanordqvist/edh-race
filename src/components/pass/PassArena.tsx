import { useCallback, useEffect, useRef, useState } from 'react'

import { PassCanvas } from './PassCanvas'
import { PassFallback } from './PassFallback'
import { PassFinishBeat } from './PassFinishBeat'
import { PassIdleGate } from './PassIdleGate'
import { PassRacingHud } from './PassRacingHud'
import { PassTimeslipDialog } from './PassTimeslipDialog'
import { PassTreeCue } from './PassTreeCue'
import { usePassExpand } from './usePassExpand'
import { Button } from '../ui/Button'
import { useT } from '../../i18n'
import type {
  PassCameraView,
  PassCommands,
  PassOpponentId,
  PassPhase,
  PassSceneMeta,
} from '../../lib/pass/types'
import type { HudSplitId } from '../../data/simulator'
import './PassArena.css'

export function PassArena() {
  const t = useT()
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const [phase, setPhase] = useState<PassPhase>('idle')
  const [clock, setClock] = useState(0)
  const [speedKmh, setSpeedKmh] = useState(0)
  const [cameraView, setCameraView] = useState<PassCameraView>('follow')
  const [splitCallout, setSplitCallout] = useState<HudSplitId | null>(null)
  const [muted, setMuted] = useState(true)
  const [opponent, setOpponent] = useState<PassOpponentId>('none')
  const [webglOk, setWebglOk] = useState(true)
  const [timeslipOpen, setTimeslipOpen] = useState(false)
  const [chuteDeploy01, setChuteDeploy01] = useState(0)
  const [finishReady, setFinishReady] = useState(false)

  const commandsRef = useRef<PassCommands | null>(null)
  const webglRetryRef = useRef(false)
  const arenaRef = useRef<HTMLElement>(null)
  const { expanded, toggle: toggleExpand } = usePassExpand(arenaRef)

  useEffect(() => {
    commandsRef.current?.setMuted(muted)
  }, [muted])

  useEffect(() => {
    if (phase !== 'finished') {
      setFinishReady(false)
      return
    }
    const timer = window.setTimeout(() => setFinishReady(true), 700)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (webglOk || webglRetryRef.current) return
    webglRetryRef.current = true
    setWebglOk(true)
  }, [webglOk])

  const handleReady = useCallback(
    (commands: PassCommands, _meta: PassSceneMeta) => {
      void _meta
      commandsRef.current = commands
      commands.setMuted(muted)
      commands.setOpponent(opponent)
      commands.setCameraView(cameraView === 'cockpit' ? 'cockpit' : 'follow')
      setPhase('idle')
      setClock(0)
      setSpeedKmh(0)
      setChuteDeploy01(0)
      setSplitCallout(null)
    },
    [muted, opponent, cameraView],
  )

  const handleStage = useCallback(() => {
    const view = cameraView === 'cockpit' ? 'cockpit' : 'follow'
    commandsRef.current?.setCameraView(view)
    commandsRef.current?.setOpponent(opponent)
    commandsRef.current?.stage()
  }, [cameraView, opponent])

  const handleLaunch = useCallback(() => {
    commandsRef.current?.launch()
  }, [])

  useEffect(() => {
    if (phase !== 'green') return
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault()
        handleLaunch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, handleLaunch])

  const handleToggleMuted = useCallback(() => {
    setMuted((current) => !current)
  }, [])

  const handleOpponent = useCallback((next: PassOpponentId) => {
    setOpponent(next)
    commandsRef.current?.setOpponent(next)
  }, [])

  const handleView = useCallback((view: 'follow' | 'cockpit') => {
    setCameraView(view)
    commandsRef.current?.setCameraView(view)
  }, [])

  const openTimeslip = useCallback(() => setTimeslipOpen(true), [])
  const closeTimeslip = useCallback(() => setTimeslipOpen(false), [])

  if (!webglOk) {
    return <PassFallback />
  }

  const hideChromeTools = phase === 'finished'
  const showTreeCue = phase === 'staging' || phase === 'amber' || phase === 'green'
  const showRacingHud =
    !reducedMotion && (phase === 'green' || phase === 'racing' || phase === 'finished')
  const showTrapFlash = showRacingHud && phase === 'racing' && splitCallout === 'quarter'

  return (
    <section
      ref={arenaRef}
      className={`pass-arena pass-arena--${phase}${showRacingHud ? ' pass-arena--racing-hud' : ''}${expanded ? ' pass-arena--expanded' : ''}${hideChromeTools ? ' pass-arena--chrome-hidden' : ''}`}
      aria-label={t.pass.title}
    >
      <div className="pass-arena__viewport">
        <PassCanvas
          muted={muted}
          reducedMotion={reducedMotion}
          onPhase={(next) => {
            setPhase(next)
            if (next === 'idle' || next === 'staging') {
              setSpeedKmh(0)
              setSplitCallout(null)
              setChuteDeploy01(0)
            }
            if (next === 'finished') {
              setSplitCallout('quarter')
            }
          }}
          onClock={setClock}
          onSpeed={setSpeedKmh}
          onChuteDeploy={setChuteDeploy01}
          onLaunch={() => {}}
          onSplitCallout={setSplitCallout}
          onCameraView={setCameraView}
          onFinished={() => {}}
          onWebglUnavailable={() => setWebglOk(false)}
          onReady={handleReady}
        />

        <div className="pass-arena__shade" aria-hidden="true" />

        <div className="pass-arena__hud">
          <div className="pass-arena__topbar">
            <div />
            {!hideChromeTools ? (
              <div className="pass-arena__top-actions">
                <Button
                  className="pass-arena__mute"
                  variant="ghost"
                  onClick={handleToggleMuted}
                  aria-pressed={!muted}
                  aria-label={muted ? t.pass.unmute : t.pass.mute}
                >
                  {muted ? t.pass.unmute : t.pass.mute}
                </Button>
                <Button
                  className="pass-arena__expand"
                  variant="ghost"
                  onClick={() => void toggleExpand()}
                  aria-pressed={expanded}
                  aria-label={expanded ? t.pass.collapseTrack : t.pass.expandTrack}
                >
                  {expanded ? t.pass.collapseTrack : t.pass.expandTrack}
                </Button>
              </div>
            ) : (
              <div />
            )}
          </div>

          {showTreeCue ? <PassTreeCue phase={phase} /> : null}

          {showRacingHud ? (
            <PassRacingHud
              phase={phase}
              clock={clock}
              speedKmh={speedKmh}
              splitId={splitCallout}
              chuteDeploy01={chuteDeploy01}
            />
          ) : null}

          {showTrapFlash ? (
            <p className="pass-arena__trap-flash" aria-hidden="true">
              <span>{t.pass.heroWins}</span>
              <span>415 km/h</span>
            </p>
          ) : null}

          {phase === 'idle' ? (
            <PassIdleGate
              cameraView={cameraView}
              opponent={opponent}
              onView={handleView}
              onOpponent={handleOpponent}
              onStart={handleStage}
            />
          ) : null}

          {phase === 'finished' && finishReady ? (
            <PassFinishBeat onAgain={handleStage} onTimeslip={openTimeslip} />
          ) : null}
        </div>
      </div>

      <PassTimeslipDialog open={timeslipOpen} onClose={closeTimeslip} />
    </section>
  )
}
