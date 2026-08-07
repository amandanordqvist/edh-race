import { useCallback, useId, useState, type PointerEvent } from 'react'
import { hotspotIds, type HotspotId } from '../../data/machine'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './InteractiveChassis.css'

const hotspotPositions: Record<HotspotId, { left: string; top: string }> = {
  engine: { left: '29.2%', top: '49%' },
  compressor: { left: '34.4%', top: '32.5%' },
  chassis: { left: '50%', top: '61.5%' },
  fourLink: { left: '72.2%', top: '64.5%' },
}

export function InteractiveChassis() {
  const t = useT()
  const titleId = useId()
  const [active, setActive] = useState<HotspotId>('engine')
  const [tilt, setTilt] = useState({ x: 0, y: -8 })

  const activeCopy = t.machine.hotspots[active]

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({
      x: +(py * -10).toFixed(2),
      y: +(px * 14).toFixed(2),
    })
  }, [])

  const onPointerLeave = useCallback(() => {
    setTilt({ x: 0, y: -8 })
  }, [])

  return (
    <Section wide className="ichassis" aria-labelledby={titleId}>
      <Reveal>
        <h2 className="ichassis__heading" id={titleId}>
          {t.machine.chassisTitle}
        </h2>
        <p className="ichassis__lead">{t.machine.chassisBody}</p>
      </Reveal>

      <div className="ichassis__layout">
        <Reveal className="ichassis__viewport" delay={0.05} y={28}>
          <div
            className="ichassis__stage"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <div
              className="ichassis__tilt"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              <svg
                className="ichassis__svg"
                viewBox="0 0 720 240"
                role="img"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="ichassis-body" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2a4f9a" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#1a2436" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                <ellipse cx="360" cy="210" rx="250" ry="12" fill="rgba(0,0,0,0.35)" />

                <path
                  d="M90 150 H610 M120 150 L160 110 H300 L340 150 M400 150 L440 110 H560 L600 150"
                  fill="none"
                  stroke="rgba(196,199,204,0.55)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M160 110 L160 150 M240 110 L240 150 M300 110 L300 150 M440 110 L440 150 M520 110 L520 150 M560 110 L560 150"
                  fill="none"
                  stroke="rgba(196,199,204,0.35)"
                  strokeWidth="2"
                />

                <path
                  d="M95 150
                     C110 148 130 120 155 112
                     L250 95
                     C280 88 320 82 360 84
                     L480 92
                     C530 96 580 108 620 128
                     L640 150
                     L620 158
                     C560 168 480 172 360 170
                     C240 168 150 162 110 156
                     Z"
                  fill="url(#ichassis-body)"
                  stroke="rgba(243,245,248,0.28)"
                  strokeWidth="1.5"
                />

                <rect
                  x="228"
                  y="52"
                  width="44"
                  height="42"
                  rx="4"
                  fill="rgba(10,12,16,0.85)"
                  stroke="rgba(168,173,184,0.45)"
                />
                <rect
                  x="234"
                  y="44"
                  width="32"
                  height="12"
                  rx="2"
                  fill="rgba(42,79,154,0.8)"
                />

                <circle cx="170" cy="168" r="28" fill="#0a0c10" stroke="rgba(168,173,184,0.4)" />
                <circle cx="170" cy="168" r="10" fill="rgba(168,173,184,0.25)" />
                <circle cx="545" cy="168" r="36" fill="#0a0c10" stroke="rgba(168,173,184,0.4)" />
                <circle cx="545" cy="168" r="12" fill="rgba(168,173,184,0.25)" />

                <path
                  d="M600 100 H655 L648 118 H595 Z"
                  fill="rgba(26,36,54,0.95)"
                  stroke="rgba(168,173,184,0.35)"
                />
              </svg>

              {hotspotIds.map((id) => {
                const pos = hotspotPositions[id]
                const isActive = active === id
                return (
                  <button
                    key={id}
                    type="button"
                    className={`ichassis__hotspot ${isActive ? 'is-active' : ''}`}
                    style={{ left: pos.left, top: pos.top }}
                    aria-label={t.machine.hotspots[id].title}
                    aria-pressed={isActive}
                    onClick={() => setActive(id)}
                  />
                )
              })}
            </div>
            <p className="ichassis__hint">{t.machine.chassisHint}</p>
          </div>
        </Reveal>

        <Reveal className="ichassis__panel" delay={0.1} y={24}>
          <p className="ichassis__panel-role">{activeCopy.title}</p>
          <p className="ichassis__panel-body">{activeCopy.body}</p>
          <ul className="ichassis__tabs">
            {hotspotIds.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  className={`ichassis__tab ${active === id ? 'is-active' : ''}`}
                  onClick={() => setActive(id)}
                  aria-pressed={active === id}
                >
                  {t.machine.hotspots[id].title}
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
