import { useCallback, useEffect, useRef, useState } from 'react'

import { PassCanvas } from './PassCanvas'
import { getSplitCalloutText, PassFallback } from './PassFallback'
import { PassRacingHud } from './PassRacingHud'
import { PassTimeslipDialog } from './PassTimeslipDialog'
import { usePassExpand } from './usePassExpand'
import { Button } from '../ui/Button'
import { useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import { edhTimeslipMeta, type HudSplitId } from '../../data/simulator'
import type {
  PassCameraView,
  PassCommands,
  PassOpponentId,
  PassPhase,
  PassSceneMeta,
} from '../../lib/pass/types'
import './PassArena.css'

type FlybyKey = 'highway' | 'autobahn' | 'tgv' | 'hypercar'
type FlybyThreshold = { id: FlybyKey; kmh: number }

const flybyThresholds: FlybyThreshold[] = [
  { id: 'highway', kmh: 120 },
  { id: 'autobahn', kmh: 200 },
  { id: 'tgv', kmh: 300 },
  { id: 'hypercar', kmh: 400 },
]

const FLYBY_LIFETIME_MS = 2100

export function PassArena() {
  const locale = useLocale()
  const t = useT()
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const [phase, setPhase] = useState<PassPhase>('idle')
  const [clock, setClock] = useState(0)
  const [speedKmh, setSpeedKmh] = useState(0)
  const [remainingM, setRemainingM] = useState(402)
  const [opponentClock, setOpponentClock] = useState(0)
  const [chuteDeploy01, setChuteDeploy01] = useState(0)
  const [cameraView, setCameraView] = useState<PassCameraView>('follow')
  const [splitCallout, setSplitCallout] = useState<HudSplitId | null>(null)
  const [muted, setMuted] = useState(true)
  const [opponent, setOpponent] = useState<PassOpponentId>('f1')
  const [webglOk, setWebglOk] = useState(true)
  const [timeslipOpen, setTimeslipOpen] = useState(false)
  const [userReactionS, setUserReactionS] = useState<number | null>(null)
  const [flybys, setFlybys] = useState<{ id: FlybyKey; expiresAt: number }[]>([])
  const flybysHitRef = useRef<Set<FlybyKey>>(new Set())
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
    const timer = window.setTimeout(() => setFinishReady(true), 1000)
    return () => window.clearTimeout(timer)
  }, [phase])

  // HMR / scene rebuild can trip a one-off WebGL loss. Retry once so Stage
  // comes back without a full page reload; a real missing GPU stays on fallback.
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
      setPhase('idle')
      setClock(0)
      setSpeedKmh(0)
      setRemainingM(402)
      setOpponentClock(0)
      setChuteDeploy01(0)
      setSplitCallout(null)
      setCameraView('follow')
    },
    [muted, opponent],
  )

  const handleStage = useCallback(() => {
    setUserReactionS(null)
    commandsRef.current?.stage()
  }, [])

  const handleLaunch = useCallback(() => {
    commandsRef.current?.launch()
  }, [])

  // Spacebar = tap-to-launch when the tree turns green (accessibility win).
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

  // Reference-object flybys: fire once per pass when Camaro overtakes each
  // real-world speed anchor, so users physically see her leaving the highway /
  // Autobahn / TGV / Chiron behind.
  useEffect(() => {
    if (phase !== 'racing') return
    if (reducedMotion) return

    const spawned: FlybyKey[] = []
    flybyThresholds.forEach((threshold) => {
      if (speedKmh >= threshold.kmh && !flybysHitRef.current.has(threshold.id)) {
        flybysHitRef.current.add(threshold.id)
        spawned.push(threshold.id)
      }
    })
    if (spawned.length === 0) return
    const now = performance.now()
    setFlybys((prev) => [
      ...prev,
      ...spawned.map((id) => ({ id, expiresAt: now + FLYBY_LIFETIME_MS })),
    ])
  }, [speedKmh, phase, reducedMotion])

  useEffect(() => {
    if (flybys.length === 0) return
    const now = performance.now()
    const nextExpiry = Math.min(...flybys.map((f) => f.expiresAt))
    const timeout = window.setTimeout(
      () => {
        setFlybys((prev) => prev.filter((f) => f.expiresAt > performance.now()))
      },
      Math.max(50, nextExpiry - now),
    )
    return () => window.clearTimeout(timeout)
  }, [flybys])


  const handleToggleMuted = useCallback(() => {
    setMuted((current) => !current)
  }, [])

  const handleOpponent = useCallback((next: PassOpponentId) => {
    setOpponent(next)
    commandsRef.current?.setOpponent(next)
  }, [])

  const openTimeslip = useCallback(() => setTimeslipOpen(true), [])
  const closeTimeslip = useCallback(() => setTimeslipOpen(false), [])

  const handleFollow = useCallback(() => {
    commandsRef.current?.setCameraView('follow')
    setCameraView('follow')
  }, [])

  const handleCycleCamera = useCallback(() => {
    const order: PassCameraView[] = ['follow', 'cockpit', 'wide']
    const index = order.indexOf(cameraView)
    const next = order[(index + 1) % order.length] ?? 'follow'
    commandsRef.current?.setCameraView(next)
    setCameraView(next)
  }, [cameraView])

  if (!webglOk) {
    return <PassFallback />
  }

  const showStageCta = phase === 'idle'
  const showOpponentPicker = phase === 'idle'
  const showCameraControls = phase === 'racing'
  const hideChromeTools = phase === 'finished'
  const showRacingHud =
    !reducedMotion &&
    (cameraView === 'follow' || cameraView === 'cockpit') &&
    (phase === 'staging' || phase === 'amber' || phase === 'green' || phase === 'racing')

  const cameraViewLabel =
    cameraView === 'cockpit'
      ? t.pass.cockpitView
      : cameraView === 'wide'
        ? t.pass.zoomOut
        : t.pass.followCar

  return (
    <section
      ref={arenaRef}
      className={`pass-arena pass-arena--${phase}${showRacingHud ? ' pass-arena--racing-hud' : ''}${expanded ? ' pass-arena--expanded' : ''}${hideChromeTools ? ' pass-arena--chrome-hidden' : ''}`}
      aria-label={t.pass.title}
      onPointerMove={() => {
        arenaRef.current?.classList.add('pass-arena--chrome-visible')
      }}
      onPointerLeave={() => {
        arenaRef.current?.classList.remove('pass-arena--chrome-visible')
      }}
    >
      <div className="pass-arena__viewport">
        <PassCanvas
          muted={muted}
          reducedMotion={reducedMotion}
          onPhase={(next) => {
            setPhase(next)
            if (next !== 'racing') {
              setSpeedKmh(0)
              setSplitCallout(null)
            }
            if (next === 'idle' || next === 'staging') {
              setRemainingM(402)
              setOpponentClock(0)
              setChuteDeploy01(0)
              setUserReactionS(null)
              flybysHitRef.current.clear()
              setFlybys([])
            }
            if (next === 'staging' || next === 'racing') {
              setCameraView('follow')
            }
          }}
          onClock={setClock}
          onSpeed={setSpeedKmh}
          onRemaining={setRemainingM}
          onOpponentClock={setOpponentClock}
          onChuteDeploy={setChuteDeploy01}
          onLaunch={setUserReactionS}
          onSplitCallout={setSplitCallout}
          onCameraView={setCameraView}
          onFinished={() => {}}
          onWebglUnavailable={() => setWebglOk(false)}
          onReady={handleReady}
        />

        <div className="pass-arena__shade" aria-hidden="true" />

        <div className="pass-arena__hud">
          <div className="pass-arena__topbar">
            {phase === 'idle' || (!showRacingHud && phase !== 'finished') ? (
            <div className="pass-arena__status">
              {phase !== 'idle' && !showRacingHud ? (
                <p className="pass-arena__status-text" role="status" aria-live="polite">
                  {t.pass.status[phase]}
                </p>
              ) : null}
              {phase === 'idle' ? (
                <p className="pass-arena__pace" aria-hidden="true">
                  <span>1/4 mile</span>
                  <span className="pass-arena__pace-sep">·</span>
                  <span>402 m</span>
                  <span className="pass-arena__pace-sep">·</span>
                  <span className="pass-arena__pace-hero">
                    {formatLocaleNumber(edhTimeslipMeta.et, locale, 3)}s
                  </span>
                </p>
              ) : null}
              {!showRacingHud && phase !== 'idle' ? (
                <>
                  <p className="pass-arena__clock" data-phase={phase}>
                    {clock.toFixed(2)}s
                  </p>
                  {phase === 'racing' && speedKmh > 0 ? (
                    <p className="pass-arena__speed" aria-live="polite">
                      {Math.round(speedKmh)} km/h
                    </p>
                  ) : null}
                </>
              ) : null}
              {phase === 'racing' && splitCallout && !showRacingHud && chuteDeploy01 <= 0.25 ? (
                <p className="pass-arena__callout" aria-live="polite">
                  {getSplitCalloutText(t, splitCallout)}
                </p>
              ) : null}
              {phase === 'racing' && !showRacingHud && chuteDeploy01 > 0.25 ? (
                <p className="pass-arena__callout" aria-live="polite">
                  {t.pass.splitCallouts.chutes}
                </p>
              ) : null}
            </div>
            ) : (
              <div />
            )}

            {!hideChromeTools ? (
            <div className="pass-arena__top-actions">
              {showCameraControls && !reducedMotion ? (
                <div className="pass-arena__cam" role="group" aria-label={t.pass.cameraViews}>
                  <Button
                    className="pass-arena__cam-btn"
                    variant={cameraView === 'follow' ? 'primary' : 'ghost'}
                    onClick={handleFollow}
                    aria-pressed={cameraView === 'follow'}
                  >
                    {t.pass.followCar}
                  </Button>
                  <Button
                    className="pass-arena__cam-btn"
                    variant={cameraView !== 'follow' ? 'primary' : 'ghost'}
                    onClick={handleCycleCamera}
                    aria-label={`${t.pass.cameraViews}: ${cameraViewLabel}`}
                  >
                    {t.pass.cameraViews}
                  </Button>
                </div>
              ) : null}

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

          {(phase === 'racing' || phase === 'finished') ? (
            <p className="sr-only" role="status" aria-live="polite">
              {`${t.pass.laneBoard}: EDH ${clock.toFixed(3)} · ${t.pass.compare[opponent]} ${opponentClock.toFixed(3)}`}
            </p>
          ) : null}

          {showRacingHud ? (
            <PassRacingHud
              phase={phase}
              speedKmh={speedKmh}
              remainingM={remainingM}
              chuteDeploy01={chuteDeploy01}
            />
          ) : null}

          {showRacingHud && phase === 'racing' && chuteDeploy01 <= 0.25 && splitCallout ? (
            <p className="pass-arena__split-banner" role="status" aria-live="polite">
              {getSplitCalloutText(t, splitCallout)}
            </p>
          ) : null}

          {flybys.length > 0 && phase === 'racing' ? (
            <div className="pass-arena__flyby-rail" aria-hidden="true">
              {flybys.map((flyby) => (
                <div key={flyby.id} className="pass-arena__flyby-chip">
                  <span className="pass-arena__flyby-arrow">→</span>
                  <span className="pass-arena__flyby-label">{t.pass.flyby[flyby.id]}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="pass-arena__footer">
            {phase === 'idle' ? (
              <div className="pass-arena__idle-hints">
                <p className="pass-arena__inspect-hint">{t.pass.inspectHint}</p>
                <p className="pass-arena__reaction-hint">{t.pass.reactionHint}</p>
                <button
                  type="button"
                  className="pass-arena__timeslip-link"
                  onClick={openTimeslip}
                >
                  <span>{t.pass.readTimeslip}</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path
                      d="M2 8L8 2M8 2H3.5M8 2V6.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ) : null}

            {(phase === 'staging' || phase === 'amber' || phase === 'green') && !reducedMotion ? (
              <div className="pass-arena__launch">
                <button
                  type="button"
                  className={`pass-arena__launch-btn${phase === 'green' ? ' pass-arena__launch-btn--live' : ''}`}
                  onClick={handleLaunch}
                  disabled={phase !== 'green'}
                  aria-live="polite"
                >
                  <span className="pass-arena__launch-eyebrow">
                    {phase === 'green' ? t.pass.launchNow : t.pass.launchWait}
                  </span>
                  <span className="pass-arena__launch-hint">{t.pass.launchKeyHint}</span>
                </button>
              </div>
            ) : null}

            {phase === 'finished' && finishReady ? (
              <div className="pass-arena__finish pass-arena__finish--result" role="group" aria-label={t.pass.status.finished}>
                <div className="pass-arena__finish-hero">
                  <p className="pass-arena__finish-wins">{t.pass.heroWins}</p>
                  <p className="pass-arena__finish-et">
                    <span className="pass-arena__finish-et-value">
                      {formatLocaleNumber(edhTimeslipMeta.et, locale, 4)}
                    </span>
                    <span className="pass-arena__finish-et-unit">s</span>
                  </p>
                  <p className="pass-arena__finish-trap">
                    {edhTimeslipMeta.trapKmh} km/h
                  </p>
                  {userReactionS !== null ? (
                    <p className="pass-arena__finish-reaction">
                      {t.pass.reactionLate.replace(
                        '{seconds}',
                        formatLocaleNumber(Math.max(0, userReactionS), locale, 3),
                      )}
                    </p>
                  ) : null}
                </div>

                <div className="pass-arena__finish-actions">
                  <Button className="pass-arena__stage" onClick={handleStage}>
                    {t.pass.again}
                  </Button>
                  <Button
                    className="pass-arena__finish-secondary"
                    variant="ghost"
                    onClick={openTimeslip}
                  >
                    {t.pass.seeTimeslip}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pass-arena__actions">
                {showOpponentPicker ? (
                  <div className="pass-arena__opponent" role="group" aria-label={t.pass.pickOpponent}>
                    <span className="pass-arena__opponent-label">{t.pass.pickOpponent}</span>
                    <div className="pass-arena__opponent-btns">
                      <Button
                        className="pass-arena__opponent-btn"
                        variant={opponent === 'f1' ? 'primary' : 'ghost'}
                        onClick={() => handleOpponent('f1')}
                        aria-pressed={opponent === 'f1'}
                      >
                        {t.pass.compare.f1}
                      </Button>
                      <Button
                        className="pass-arena__opponent-btn"
                        variant={opponent === 'jet' ? 'primary' : 'ghost'}
                        onClick={() => handleOpponent('jet')}
                        aria-pressed={opponent === 'jet'}
                      >
                        {t.pass.compare.jet}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {showStageCta ? (
                  <Button className="pass-arena__stage" onClick={handleStage}>
                    {t.pass.stage}
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      <PassTimeslipDialog open={timeslipOpen} onClose={closeTimeslip} />
    </section>
  )
}
