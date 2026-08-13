import { useCallback, useEffect, useRef, useState } from 'react'

import { PassCanvas } from './PassCanvas'
import { getSplitCalloutText, PassFallback } from './PassFallback'
import { PassRacingHud } from './PassRacingHud'
import { PassTimeslipDialog } from './PassTimeslipDialog'
import { usePassExpand } from './usePassExpand'
import { Button } from '../ui/Button'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { edhTimeslipMeta, hudSplitCallouts, type HudSplitId } from '../../data/simulator'
import { SHUTDOWN_COAST_S } from '../../lib/pass/ease'
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
const SCRUB_MAX_S = edhTimeslipMeta.et + SHUTDOWN_COAST_S
const CHUTE_SCRUB_S = edhTimeslipMeta.et + 0.55

const scrubTickLabels: Record<HudSplitId, string> = {
  sixty: "60'",
  threeThirty: "330'",
  eighth: "660'",
  thousand: "1000'",
  quarter: "1320'",
}

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
  const [gapM, setGapM] = useState(0)
  const [chuteDeploy01, setChuteDeploy01] = useState(0)
  const [cameraView, setCameraView] = useState<PassCameraView>('follow')
  const [splitCallout, setSplitCallout] = useState<HudSplitId | null>(null)
  const [muted, setMuted] = useState(true)
  const [opponent, setOpponent] = useState<PassOpponentId>('f1')
  const [camaroUsesGlb, setCamaroUsesGlb] = useState(false)
  const [webglOk, setWebglOk] = useState(true)
  const [timeslipOpen, setTimeslipOpen] = useState(false)
  const [userReactionS, setUserReactionS] = useState<number | null>(null)
  const [flybys, setFlybys] = useState<{ id: FlybyKey; expiresAt: number }[]>([])
  const flybysHitRef = useRef<Set<FlybyKey>>(new Set())
  const [scrubS, setScrubS] = useState<number>(edhTimeslipMeta.et)

  const commandsRef = useRef<PassCommands | null>(null)
  const webglRetryRef = useRef(false)
  const arenaRef = useRef<HTMLElement>(null)
  const { expanded, toggle: toggleExpand } = usePassExpand(arenaRef)

  useEffect(() => {
    commandsRef.current?.setMuted(muted)
  }, [muted])

  // HMR / scene rebuild can trip a one-off WebGL loss. Retry once so Stage
  // comes back without a full page reload; a real missing GPU stays on fallback.
  useEffect(() => {
    if (webglOk || webglRetryRef.current) return
    webglRetryRef.current = true
    setWebglOk(true)
  }, [webglOk])

  const handleReady = useCallback(
    (commands: PassCommands, meta: PassSceneMeta) => {
      commandsRef.current = commands
      commands.setMuted(muted)
      commands.setOpponent(opponent)
      setCamaroUsesGlb(meta.camaroUsesGlb)
      setPhase('idle')
      setClock(0)
      setSpeedKmh(0)
      setGapM(0)
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


  const handleScrub = useCallback((next: number) => {
    setScrubS(next)
    commandsRef.current?.seek(next)
  }, [])

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

  const handleZoomOut = useCallback(() => {
    commandsRef.current?.setCameraView('wide')
    setCameraView('wide')
  }, [])

  const handleCockpit = useCallback(() => {
    commandsRef.current?.setCameraView('cockpit')
    setCameraView('cockpit')
  }, [])

  if (!webglOk) {
    return <PassFallback />
  }

  const showStageCta = phase === 'idle'
  const showOpponentPicker = phase === 'idle'
  const showCameraControls = phase === 'racing' || phase === 'finished'
  const showRacingHud =
    !reducedMotion &&
    (cameraView === 'follow' || cameraView === 'cockpit') &&
    (phase === 'staging' || phase === 'amber' || phase === 'green' || phase === 'racing')

  return (
    <section
      ref={arenaRef}
      className={`pass-arena pass-arena--${phase}${showRacingHud ? ' pass-arena--racing-hud' : ''}${expanded ? ' pass-arena--expanded' : ''}`}
      aria-label={t.pass.title}
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
              setGapM(0)
              setChuteDeploy01(0)
              setUserReactionS(null)
              flybysHitRef.current.clear()
              setFlybys([])
            }
            if (next === 'staging' || next === 'racing') {
              setCameraView('follow')
            }
            if (next === 'finished') {
              setScrubS(SCRUB_MAX_S)
            }
          }}
          onClock={setClock}
          onSpeed={setSpeedKmh}
          onGap={setGapM}
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
            <div className="pass-arena__status">
              {phase !== 'idle' && phase !== 'finished' && !showRacingHud ? (
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
                  <span className="pass-arena__pace-hero">5.74s</span>
                </p>
              ) : null}
              {!showRacingHud && phase !== 'idle' && phase !== 'finished' ? (
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

            <div className="pass-arena__top-actions">
              {showCameraControls && !reducedMotion ? (
                <div className="pass-arena__cam" role="group" aria-label={t.pass.followCar}>
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
                    variant={cameraView === 'cockpit' ? 'primary' : 'ghost'}
                    onClick={handleCockpit}
                    aria-pressed={cameraView === 'cockpit'}
                  >
                    {t.pass.cockpitView}
                  </Button>
                  <Button
                    className="pass-arena__cam-btn"
                    variant={cameraView === 'wide' ? 'primary' : 'ghost'}
                    onClick={handleZoomOut}
                    aria-pressed={cameraView === 'wide'}
                  >
                    {t.pass.zoomOut}
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
          </div>

          {showRacingHud ? (
            <PassRacingHud
              phase={phase}
              clock={clock}
              speedKmh={speedKmh}
              gapM={gapM}
              chuteDeploy01={chuteDeploy01}
            />
          ) : null}

          {showRacingHud && phase === 'racing' && chuteDeploy01 > 0.25 ? (
            <p className="pass-arena__split-banner" role="status" aria-live="polite">
              {t.pass.splitCallouts.chutes}
            </p>
          ) : showRacingHud && phase === 'racing' && splitCallout ? (
            <p className="pass-arena__split-banner" role="status" aria-live="polite">
              {getSplitCalloutText(t, splitCallout)}
            </p>
          ) : null}

          {flybys.length > 0 ? (
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

            {phase === 'finished' ? (
              <div className="pass-arena__finish pass-arena__finish--with-scrubber" role="group" aria-label={t.pass.status.finished}>
                <div className="pass-arena__finish-stats">
                  <div className="pass-arena__finish-stat pass-arena__finish-stat--hero">
                    <span className="pass-arena__finish-stat-label">ET</span>
                    <span className="pass-arena__finish-stat-value">
                      {edhTimeslipMeta.et.toFixed(2)}
                      <span className="pass-arena__finish-stat-unit">s</span>
                    </span>
                  </div>
                  <div className="pass-arena__finish-stat">
                    <span className="pass-arena__finish-stat-label">Trap</span>
                    <span className="pass-arena__finish-stat-value">
                      {edhTimeslipMeta.trapKmh}
                      <span className="pass-arena__finish-stat-unit">km/h</span>
                    </span>
                  </div>
                  {userReactionS !== null ? (
                    <div className="pass-arena__finish-stat pass-arena__finish-stat--reaction">
                      <span className="pass-arena__finish-stat-label">{t.pass.yourReaction}</span>
                      <span className="pass-arena__finish-stat-value">
                        {userReactionS.toFixed(3)}
                      </span>
                      <span className="pass-arena__finish-stat-caption">
                        vs {edhTimeslipMeta.reaction.toFixed(3)} · Anders
                      </span>
                      <span className="pass-arena__finish-stat-delta">
                        {userReactionS <= edhTimeslipMeta.reaction
                          ? t.pass.reactionFaster
                          : `+${((userReactionS - edhTimeslipMeta.reaction) * 1000).toFixed(0)} ms`}
                      </span>
                    </div>
                  ) : (
                    <div className="pass-arena__finish-stat">
                      <span className="pass-arena__finish-stat-label">RT</span>
                      <span className="pass-arena__finish-stat-value">
                        {edhTimeslipMeta.reaction.toFixed(3)}
                      </span>
                    </div>
                  )}
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
                    {t.pass.openTimeslip}
                  </Button>
                  <Button
                    className="pass-arena__finish-secondary"
                    to={localePath(locale, 'journey')}
                    variant="ghost"
                    icon
                  >
                    {t.pass.continueJourney}
                  </Button>
                </div>

                {!reducedMotion ? (
                  <div className="pass-arena__scrubber">
                    <div className="pass-arena__scrubber-head">
                      <span className="pass-arena__scrubber-label">{t.pass.scrubLabel}</span>
                      <span className="pass-arena__scrubber-time">{scrubS.toFixed(3)}s</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={SCRUB_MAX_S}
                      step={0.01}
                      value={scrubS}
                      onChange={(event) => handleScrub(parseFloat(event.target.value))}
                      className="pass-arena__scrubber-slider"
                      aria-label={t.pass.scrubLabel}
                    />
                    <div className="pass-arena__scrubber-ticks" aria-hidden="true">
                      {hudSplitCallouts.map((split) => {
                        const percent = (split.et / SCRUB_MAX_S) * 100
                        return (
                          <button
                            key={split.id}
                            type="button"
                            className="pass-arena__scrubber-tick"
                            style={{ left: `${percent}%` }}
                            onClick={() => handleScrub(split.et)}
                            aria-label={`${scrubTickLabels[split.id]} · ${split.et.toFixed(2)}s`}
                          >
                            <span className="pass-arena__scrubber-tick-dot" />
                            <span className="pass-arena__scrubber-tick-label">
                              {scrubTickLabels[split.id]}
                            </span>
                          </button>
                        )
                      })}
                      <button
                        type="button"
                        className="pass-arena__scrubber-tick"
                        style={{ left: `${(CHUTE_SCRUB_S / SCRUB_MAX_S) * 100}%` }}
                        onClick={() => handleScrub(CHUTE_SCRUB_S)}
                        aria-label={`${t.pass.scrubChute} · ${CHUTE_SCRUB_S.toFixed(2)}s`}
                      >
                        <span className="pass-arena__scrubber-tick-dot" />
                        <span className="pass-arena__scrubber-tick-label">{t.pass.scrubChute}</span>
                      </button>
                    </div>
                  </div>
                ) : null}
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

        {camaroUsesGlb ? (
          <p className="pass-arena__model-credit">
            <a href={t.pass.modelCreditHref} target="_blank" rel="license noopener noreferrer">
              {t.pass.modelCredit}
            </a>
          </p>
        ) : null}
      </div>

      <PassTimeslipDialog open={timeslipOpen} onClose={closeTimeslip} />
    </section>
  )
}
