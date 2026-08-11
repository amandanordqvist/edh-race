import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { useLocale, useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PerformanceStrip.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type StatCard = { code: string; value: string; unit: string; label: string }

function parseStat(
  value: string,
): { num: number; decimals: number } | null {
  const match = value.replace(/\s/g, ' ').match(/^([0-9]+(?:[.,][0-9]+)?)$/)
  if (!match) return null
  const raw = match[1].replace(',', '.')
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  return {
    num: Number(raw),
    decimals,
  }
}

export function PerformanceStrip() {
  const t = useT()
  const locale = useLocale()
  const { quarter, topSpeed, eighth, base } = t.home.stats
  const cards: StatCard[] = [quarter, topSpeed, eighth, base]
  const boardRef = useRef<HTMLDivElement>(null)
  const decimalSep = locale === 'sv' ? ',' : '.'

  useGSAP(
    () => {
      const board = boardRef.current
      if (!board) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const values = board.querySelectorAll<HTMLElement>('[data-stat-value]')

      values.forEach((el, index) => {
        const raw = el.dataset.statValue ?? ''
        const parsed = parseStat(raw)
        if (!parsed || Number.isNaN(parsed.num)) return

        const state = { n: 0 }
        gsap.fromTo(
          state,
          { n: 0 },
          {
            n: parsed.num,
            duration: 1.15,
            delay: index * 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: board,
              start: 'top 80%',
              once: true,
            },
            onUpdate: () => {
              el.textContent =
                parsed.decimals > 0
                  ? state.n.toFixed(parsed.decimals).replace('.', decimalSep)
                  : String(Math.round(state.n))
            },
          },
        )
      })
    },
    {
      scope: boardRef,
      dependencies: [quarter.value, topSpeed.value, eighth.value, decimalSep],
    },
  )

  return (
    <Section className="perf-strip" wide>
      <Reveal className="perf-strip__intro">
        <p className="perf-strip__meta">{t.home.statsMeta}</p>
        <h2 className="perf-strip__title">{t.home.statsTitle}</h2>
        <p className="perf-strip__lead">{t.home.statsLead}</p>
      </Reveal>

      <div ref={boardRef}>
        <Reveal className="perf-strip__board" delay={0.08} stagger={0.08} y={28}>
          {cards.map((card) => (
            <article className="perf-strip__cell" key={card.code}>
              <p className="perf-strip__code">{card.code}</p>
              <p className="perf-strip__readout">
                <span
                  className="perf-strip__value"
                  data-stat-value={parseStat(card.value) ? card.value : undefined}
                >
                  {locale === 'sv' && parseStat(card.value)
                    ? card.value.replace('.', ',')
                    : card.value}
                </span>
                {card.unit ? <span className="perf-strip__unit">{card.unit}</span> : null}
              </p>
              <p className="perf-strip__label">{card.label}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
