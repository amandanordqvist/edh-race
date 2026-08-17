import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PerformanceStrip.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type StatCard = { value: string; unit: string; label: string }

function parseStat(value: string): { num: number; decimals: number; sep: '.' | ',' } | null {
  const match = value.replace(/\s/g, '').match(/^([0-9]+)([.,]([0-9]+))?$/)
  if (!match) return null
  const sep = (match[2]?.[0] as '.' | ',') ?? '.'
  const decimals = match[3]?.length ?? 0
  const num = Number(`${match[1]}.${match[3] ?? ''}`)
  if (Number.isNaN(num)) return null
  return { num, decimals, sep }
}

function formatStat(n: number, decimals: number, sep: '.' | ','): string {
  const raw = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n))
  return sep === ',' ? raw.replace('.', ',') : raw
}

export function PerformanceStrip() {
  const t = useT()
  const { quarter, topSpeed, eighth, eighthSpeed } = t.home.stats
  const cards: StatCard[] = [quarter, topSpeed, eighth, eighthSpeed]
  const boardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const board = boardRef.current
      if (!board) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const values = board.querySelectorAll<HTMLElement>('[data-stat-value]')

      values.forEach((el, index) => {
        const raw = el.dataset.statValue ?? ''
        const parsed = parseStat(raw)
        if (!parsed) return

        const state = { n: parsed.num }
        gsap.fromTo(
          state,
          { n: 0 },
          {
            n: parsed.num,
            duration: 0.9,
            delay: index * 0.06,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: board,
              start: 'top 82%',
              once: true,
            },
            onUpdate: () => {
              el.textContent = formatStat(state.n, parsed.decimals, parsed.sep)
            },
          },
        )
      })
    },
    {
      scope: boardRef,
      dependencies: [quarter.value, topSpeed.value, eighth.value, eighthSpeed.value],
    },
  )

  return (
    <Section className="perf-strip" wide>
      <h2 className="sr-only">{t.home.statsTitle}</h2>
      <div ref={boardRef}>
        <Reveal className="perf-strip__board" pace="launch" stagger={0.08}>
          {cards.map((card) => (
            <article className="perf-strip__cell" key={card.label}>
              <p className="perf-strip__readout">
                <span className="sr-only">
                  {card.value} {card.unit}. {card.label}
                </span>
                <span
                  className="perf-strip__value"
                  data-stat-value={parseStat(card.value) ? card.value : undefined}
                  aria-hidden="true"
                >
                  {card.value}
                </span>
                {card.unit ? (
                  <span className="perf-strip__unit" aria-hidden="true">
                    {card.unit}
                  </span>
                ) : null}
              </p>
              <p className="perf-strip__label" aria-hidden="true">
                {card.label}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
