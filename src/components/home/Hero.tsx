import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Hero() {
  const t = useT()
  const locale = useLocale()
  const rootRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const posterRef = useRef<HTMLImageElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const logoWrapRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reduceMotion) {
      video.pause()
      return
    }
    void video.play().catch(() => {
      /* autoplay may be blocked; poster remains */
    })
  }, [reduceMotion])

  useGSAP(
    () => {
      const root = rootRef.current
      const media = mediaRef.current
      const frame = videoRef.current ?? posterRef.current
      const veil = veilRef.current
      const logoWrap = logoWrapRef.current
      const cta = ctaRef.current
      if (!root || !media || !frame || !veil || !logoWrap || !cta) return

      const copy = [logoWrap, cta]

      if (reduceMotion) {
        gsap.set([frame, ...copy], {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: 'none',
        })
        gsap.set(veil, { autoAlpha: 0 })
        return
      }

      gsap.set(frame, { opacity: 0, scale: 1.14 })
      gsap.set(logoWrap, {
        opacity: 0,
        y: 36,
        scale: 0.94,
        clipPath: 'inset(108% 0 0 0)',
      })
      gsap.set(cta, { opacity: 0, y: 18 })
      gsap.set(veil, { autoAlpha: 1 })

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to(veil, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut' }, 0.08)
        .to(frame, { opacity: 1, scale: 1.04, duration: 1.55, ease: 'power2.out' }, 0.04)
        .to(
          logoWrap,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.15,
            ease: 'power4.out',
          },
          '-=0.95',
        )
        .to(cta, { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')

      gsap.to(frame, {
        scale: 1.09,
        xPercent: -1,
        yPercent: -0.5,
        duration: 28,
        ease: 'none',
        repeat: -1,
        yoyo: true,
        delay: 1.7,
      })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.65,
          },
        })
        .to(media, { yPercent: 22, scale: 1.06, ease: 'none' }, 0)
        .to(copy, { y: -28, opacity: 0, ease: 'none' }, 0)
        .fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 0.5, ease: 'none' }, 0.2)

      ScrollTrigger.refresh()
    },
    { scope: rootRef, dependencies: [reduceMotion] },
  )

  return (
    <section
      ref={rootRef}
      className={`hero${reduceMotion ? ' hero--reduced' : ''}`}
    >
      <div ref={mediaRef} className="hero__media" aria-hidden="true">
        {!reduceMotion ? (
          <video
            ref={videoRef}
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-poster.webp"
          >
            <source src="/movies/hero.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            ref={posterRef}
            className="hero__poster"
            src="/images/hero-poster.webp"
            alt=""
            width={1920}
            height={1281}
            decoding="async"
          />
        )}
        <div className="hero__scrim" />
        <div ref={veilRef} className="hero__veil" />
      </div>

      <div className="hero__content">
        <h1 ref={logoWrapRef} className="hero__brand">
          <picture>
            <source srcSet="/logo/logo-hero.webp" type="image/webp" />
            <img
              className="hero__logo"
              src="/logo/logo-hero.png"
              alt={t.home.brand}
              width={2134}
              height={984}
              decoding="async"
            />
          </picture>
        </h1>
        <div ref={ctaRef} className="hero__cta">
          <Button to={localePath(locale, 'journey')} icon>
            {t.home.ctaJourney}
          </Button>
          <Button to={localePath(locale, 'machine')} variant="ghost">
            {t.home.ctaMachine}
          </Button>
        </div>
      </div>
    </section>
  )
}
