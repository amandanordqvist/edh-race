import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { edhTimeslipRows, type TimeslipSplitId } from '../../data/simulator'
import { useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import { Section } from '../ui/Section'
import './PerformanceStrip.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const SPLIT_IDS = ['sixty', 'threeThirty', 'eighth', 'thousand'] as const satisfies readonly TimeslipSplitId[]

export function PerformanceStrip() {
  const t = useT()
  const locale = useLocale()
  const boardRef = useRef<HTMLDivElement>(null)

  const cards = SPLIT_IDS.map((id) => {
    const row = edhTimeslipRows.find((item) => item.id === id)
    const et = row?.et
    if (et == null) throw new Error(`Missing ET for split ${id}`)
    return {
      id,
      value: formatLocaleNumber(et, locale, 4),
      label: t.pass.timeslipSplits[id].label,
      meters: t.pass.timeslipSplits[id].meters,
    }
  })

  useGSAP(
    () => {
      const board = boardRef.current
      if (!board) return

      const cells = gsap.utils.toArray<HTMLElement>('.perf-strip__cell', board)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(cells, { clearProps: 'opacity', opacity: 1 })
        return
      }

      gsap.set(cells, { opacity: 0.16 })
      gsap.to(cells, {
        opacity: 1,
        stagger: 0.18,
        ease: 'none',
        scrollTrigger: {
          trigger: board,
          start: 'top 82%',
          end: 'top 38%',
          scrub: 0.55,
        },
      })
    },
    { scope: boardRef },
  )

  return (
    <Section className="perf-strip" wide>
      <h2 className="sr-only">{t.home.statsTitle}</h2>
      <div ref={boardRef} className="perf-strip__board">
        {cards.map((card) => (
          <article className="perf-strip__cell" key={card.id}>
            <p className="perf-strip__readout">
              <span className="sr-only">
                {card.label}. {card.value} s. {card.meters}.
              </span>
              <span className="perf-strip__value" aria-hidden="true">
                {card.value}
              </span>
              <span className="perf-strip__unit" aria-hidden="true">
                {card.label}
              </span>
            </p>
            <p className="perf-strip__label" aria-hidden="true">
              {card.meters}
            </p>
          </article>
        ))}
      </div>
    </Section>
  )
}
