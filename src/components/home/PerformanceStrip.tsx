import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { homeHeadlineBests } from '../../data/results'
import { useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import { Section } from '../ui/Section'
import './PerformanceStrip.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function PerformanceStrip() {
  const t = useT()
  const locale = useLocale()
  const boardRef = useRef<HTMLDivElement>(null)
  const kmh = t.pass.racingHud.speedUnit
  const quarter = t.pass.timeslipSplits.quarter.meters
  const eighth = t.pass.timeslipSplits.eighth.meters

  const cards = [
    {
      id: 'quarterEt',
      value: formatLocaleNumber(homeHeadlineBests.quarterEt, locale, 2),
      metric: t.home.statsBestEt,
      detail: quarter,
      spokenUnit: 's',
    },
    {
      id: 'eighthEt',
      value: formatLocaleNumber(homeHeadlineBests.eighthEt, locale, 2),
      metric: t.home.statsBestEt,
      detail: eighth,
      spokenUnit: 's',
    },
    {
      id: 'quarterSpeed',
      value: formatLocaleNumber(homeHeadlineBests.quarterSpeedKmh, locale, 0),
      metric: t.home.statsBestSpeed,
      detail: `${quarter} · ${kmh}`,
      spokenUnit: kmh,
    },
    {
      id: 'eighthSpeed',
      value: formatLocaleNumber(homeHeadlineBests.eighthSpeedKmh, locale, 0),
      metric: t.home.statsBestSpeed,
      detail: `${eighth} · ${kmh}`,
      spokenUnit: kmh,
    },
  ]

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
                {card.metric}. {card.value} {card.spokenUnit}. {card.detail}.
              </span>
              <span className="perf-strip__value" aria-hidden="true">
                {card.value}
              </span>
              <span className="perf-strip__unit" aria-hidden="true">
                {card.metric}
              </span>
            </p>
            <p className="perf-strip__label" aria-hidden="true">
              {card.detail}
            </p>
          </article>
        ))}
      </div>
    </Section>
  )
}
