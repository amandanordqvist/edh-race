import { useCallback, useEffect, useRef, useState } from 'react'

import { PassCanvas } from './PassCanvas'
import { PassFallback, PassResultsList } from './PassFallback'
import { Button } from '../ui/Button'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import type { PassCommands, PassPhase } from '../../lib/pass/types'
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
  const [muted, setMuted] = useState(true)
  const [webglOk, setWebglOk] = useState(true)

  const commandsRef = useRef<PassCommands | null>(null)

  useEffect(() => {
    commandsRef.current?.setMuted(muted)
  }, [muted])

  const handleReady = useCallback(
    (commands: PassCommands) => {
      commandsRef.current = commands
      commands.setMuted(muted)
    },
    [muted],
  )

  const handleStage = useCallback(() => {
    commandsRef.current?.stage()
  }, [])

  const handleToggleMuted = useCallback(() => {
    setMuted((current) => !current)
  }, [])

  if (!webglOk) {
    return <PassFallback />
  }

  const showStageCta = phase === 'idle' || phase === 'finished'

  return (
    <section className="pass-arena" aria-label={t.pass.title}>
      <div className="pass-arena__viewport">
        <PassCanvas
          muted={muted}
          reducedMotion={reducedMotion}
          onPhase={setPhase}
          onClock={setClock}
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
              <p className="pass-arena__clock">{clock.toFixed(2)}s</p>
            </div>

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

          <div className="pass-arena__footer">
            <div className="pass-arena__actions">
              {showStageCta ? (
                <Button className="pass-arena__stage" onClick={handleStage}>
                  {phase === 'finished' ? t.pass.again : t.pass.stage}
                </Button>
              ) : null}
            </div>

            {phase === 'finished' ? (
              <div className="pass-arena__results-panel">
                <PassResultsList />

                <div className="pass-arena__results-actions">
                  <Button to={localePath(locale, 'journey')} variant="ghost" icon>
                    {t.pass.continueJourney}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
