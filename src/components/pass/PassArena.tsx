import { useCallback, useEffect, useRef, useState } from 'react'

import { PassCanvas } from './PassCanvas'
import { getSplitCalloutText, PassFallback } from './PassFallback'
import { PassRacingHud } from './PassRacingHud'
import { PassTimeslipDialog } from './PassTimeslipDialog'
import { Button } from '../ui/Button'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { edhTimeslipMeta, type HudSplitId } from '../../data/simulator'
import type {
  PassCameraView,
  PassCommands,
  PassOpponentId,
  PassPhase,
  PassSceneMeta,
} from '../../lib/pass/types'
import './PassArena.css'

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
  const [cameraView, setCameraView] = useState<PassCameraView>('follow')
  const [splitCallout, setSplitCallout] = useState<HudSplitId | null>(null)
  const [muted, setMuted] = useState(true)
  const [opponent, setOpponent] = useState<PassOpponentId>('f1')
  const [camaroUsesGlb, setCamaroUsesGlb] = useState(false)
  const [webglOk, setWebglOk] = useState(true)
  const [timeslipOpen, setTimeslipOpen] = useState(false)

  const commandsRef = useRef<PassCommands | null>(null)

  useEffect(() => {
    commandsRef.current?.setMuted(muted)
  }, [muted])

  const handleReady = useCallback(
    (commands: PassCommands, meta: PassSceneMeta) => {
      commandsRef.current = commands
      commands.setMuted(muted)
      commands.setOpponent(opponent)
      setCamaroUsesGlb(meta.camaroUsesGlb)
    },
    [muted, opponent],
  )

  const handleStage = useCallback(() => {
    commandsRef.current?.stage()
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

  if (!webglOk) {
    return <PassFallback />
  }

  const showStageCta = phase === 'idle'
  const showOpponentPicker = phase === 'idle'
  const showCameraControls = phase === 'racing' || phase === 'finished'
  const showRacingHud =
    !reducedMotion &&
    cameraView === 'follow' &&
    (phase === 'staging' || phase === 'amber' || phase === 'green' || phase === 'racing')

  return (
    <section
      className={`pass-arena pass-arena--${phase}${showRacingHud ? ' pass-arena--racing-hud' : ''}`}
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
            if (next === 'staging' || next === 'racing') {
              setCameraView('follow')
            }
          }}
          onClock={setClock}
          onSpeed={setSpeedKmh}
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
              <p className="pass-arena__status-text" role="status" aria-live="polite">
                {t.pass.status[phase]}
              </p>
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
              {phase === 'racing' && splitCallout && !showRacingHud ? (
                <p className="pass-arena__callout" aria-live="polite">
                  {getSplitCalloutText(t, splitCallout)}
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
            </div>
          </div>

          {showRacingHud ? (
            <PassRacingHud phase={phase} clock={clock} speedKmh={speedKmh} />
          ) : null}

          {showRacingHud && phase === 'racing' && splitCallout ? (
            <p className="pass-arena__split-banner" role="status" aria-live="polite">
              {getSplitCalloutText(t, splitCallout)}
            </p>
          ) : null}

          <div className="pass-arena__footer">
            {phase === 'idle' ? (
              <div className="pass-arena__idle-hints">
                <p className="pass-arena__inspect-hint">{t.pass.inspectHint}</p>
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

            {phase === 'finished' ? (
              <div className="pass-arena__finish" role="group" aria-label={t.pass.status.finished}>
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
                  <div className="pass-arena__finish-stat">
                    <span className="pass-arena__finish-stat-label">RT</span>
                    <span className="pass-arena__finish-stat-value">
                      {edhTimeslipMeta.reaction.toFixed(3)}
                    </span>
                  </div>
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
