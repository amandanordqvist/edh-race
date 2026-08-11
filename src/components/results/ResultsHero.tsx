import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { landmarkPass } from '../../data/results'
import { useT } from '../../i18n'
import './ResultsHero.css'

gsap.registerPlugin(useGSAP)

export function ResultsHero() {
  const t = useT()
  const rootRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      const media = mediaRef.current
      const copy = copyRef.current
      if (!root || !media || !copy) return

      const img = media.querySelector('img')
      if (!img) return

      if (reduceMotion) {
        gsap.set([img, copy], { clearProps: 'all', opacity: 1, y: 0, scale: 1 })
        return
      }

      gsap.set(img, { opacity: 0, scale: 1.08 })
      gsap.set(copy, { opacity: 0, y: 28 })

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to(img, { opacity: 1, scale: 1, duration: 1.35, ease: 'power2.out' }, 0)
        .to(copy, { opacity: 1, y: 0, duration: 0.85 }, '-=0.55')
    },
    { scope: rootRef, dependencies: [reduceMotion] },
  )

  return (
    <section
      ref={rootRef}
      className={`results-hero${reduceMotion ? ' results-hero--reduced' : ''}`}
    >
      <div ref={mediaRef} className="results-hero__media">
        <img
          src={landmarkPass.image}
          alt={t.results.heroAlt}
          width={1600}
          height={1000}
          decoding="async"
        />
        <div className="results-hero__scrim" />
      </div>

      <div ref={copyRef} className="results-hero__content">
        <h1 className="results-hero__page-title">{t.results.title}</h1>
        <p className="results-hero__et">{t.results.heroEt}</p>
        <p className="results-hero__speed">{t.results.heroSpeed}</p>
        <p className="results-hero__caption">{t.results.heroCaption}</p>
        <a href="#kalender" className="btn btn--ghost btn--icon results-hero__cta">
          <span className="btn__label">{t.results.heroCta}</span>
          <span className="btn__icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 11L11 3M11 3H4.5M11 3V9.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </section>
  )
}
