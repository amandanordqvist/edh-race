import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { useLocale, useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PerformanceStrip.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type StatCard = { value: string; label: string }

function parseStat(
  value: string,
): { prefix: string; num: number; decimals: number; suffix: string } | null {
  const match = value.replace(/\s/g, ' ').match(/^([^0-9]*)([0-9]+(?:[.,][0-9]+)?)(.*)$/)
  if (!match) return null
  const raw = match[2].replace(',', '.')
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  return {
    prefix: match[1],
    num: Number(raw),
    decimals,
    suffix: match[3],
  }
}

export function PerformanceStrip() {
  const t = useT()
  const locale = useLocale()
  const { quarter, topSpeed, eighth, base } = t.home.stats
  const cards: StatCard[] = [quarter, topSpeed, eighth, base]
  const gridRef = useRef<HTMLDivElement>(null)
  const decimalSep = locale === 'sv' ? ',' : '.'

  useGSAP(
    () => {
      const grid = gridRef.current
      if (!grid) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const values = grid.querySelectorAll<HTMLElement>('[data-stat-value]')

      values.forEach((el) => {
        const raw = el.dataset.statValue ?? ''
        const parsed = parseStat(raw)
        if (!parsed || Number.isNaN(parsed.num)) return

        const state = { n: 0 }
        gsap.fromTo(
          state,
          { n: 0 },
          {
            n: parsed.num,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            onUpdate: () => {
              const formatted =
                parsed.decimals > 0
                  ? state.n.toFixed(parsed.decimals).replace('.', decimalSep)
                  : String(Math.round(state.n))
              el.textContent = `${parsed.prefix}${formatted}${parsed.suffix}`
            },
          },
        )
      })
    },
    {
      scope: gridRef,
      dependencies: [quarter.value, topSpeed.value, eighth.value, decimalSep],
    },
  )

  return (
    <Section className="perf-strip">
      <Reveal className="perf-strip__intro">
        <h2 className="perf-strip__title">{t.home.statsTitle}</h2>
        <p className="perf-strip__lead">{t.home.statsLead}</p>
      </Reveal>

      <div ref={gridRef}>
        <Reveal className="perf-strip__grid" delay={0.06} stagger={0.1} y={36}>
          {cards.map((card) => (
            <article className="perf-strip__card" key={card.label}>
              <p className="perf-strip__value" data-stat-value={card.value}>
                {card.value}
              </p>
              <p className="perf-strip__label">{card.label}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
