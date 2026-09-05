import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { homeHeadlineBests } from '../../data/results'
import { useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { SplitWords } from './SplitWords'
import './HeroScrollReveal.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type TagTone = 'blue' | 'navy' | 'steel' | 'ink'

function pinCircleReveal(
  wrapper: HTMLElement,
  box: HTMLElement,
  mark: HTMLElement | null,
  radius: string,
  end: string,
  scrub: number,
) {
  const startPath = `circle(${radius} at 50% 50%)`
  gsap.set(box, { clipPath: startPath })
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end,
      scrub,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  })
  tl.fromTo(
    box,
    { clipPath: startPath },
    { clipPath: 'circle(150% at 50% 50%)', ease: 'none' },
    0,
  )
  if (mark) {
    tl.fromTo(mark, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.88, ease: 'none' }, 0)
  }
}

export function HeroScrollReveal() {
  const t = useT()
  const locale = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  const benefitRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const videoBoxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const tagRefs = useRef<(HTMLLIElement | null)[]>([])
  const [reduceMotion, setReduceMotion] = useState(false)

  const kmh = t.pass.racingHud.speedUnit
  const tags: { text: string; tone: TagTone }[] = [
    { text: `${formatLocaleNumber(homeHeadlineBests.quarterEt, locale, 2)} s`, tone: 'blue' },
    {
      text: `${formatLocaleNumber(homeHeadlineBests.quarterSpeedKmh, locale, 0)} ${kmh}`,
      tone: 'navy',
    },
    { text: t.home.machineSpecs[0], tone: 'steel' },
    { text: t.home.machineSpecs[3], tone: 'ink' },
  ]

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
      const benefit = benefitRef.current
      const heading = headingRef.current
      const wrapper = videoWrapRef.current
      const box = videoBoxRef.current
      const mark = markRef.current
      if (!benefit || !heading || !wrapper || !box) return

      const words = heading.querySelectorAll('.cinematic-word')
      const tagEls = tagRefs.current.filter((el): el is HTMLLIElement => el !== null)

      if (reduceMotion) {
        gsap.set([words, tagEls, box], {
          clearProps: 'all',
          opacity: 1,
          yPercent: 0,
          clipPath: 'none',
        })
        if (mark) gsap.set(mark, { clearProps: 'all', opacity: 1, scale: 1 })
        return
      }

      gsap.set(words, { opacity: 0, yPercent: 24 })
      gsap.set(tagEls, {
        opacity: 0,
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      })

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: benefit,
          start: 'top 72%',
          end: 'top 8%',
          scrub: 1.15,
        },
      })
      revealTl.to(words, {
        opacity: 1,
        yPercent: 0,
        stagger: 0.12,
        ease: 'power1.inOut',
      })
      tagEls.forEach((tagEl) => {
        revealTl.to(
          tagEl,
          {
            opacity: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            ease: 'circ.out',
            duration: 0.8,
          },
          '>-0.45',
        )
      })

      const mm = gsap.matchMedia()
      mm.add('(max-width: 639.9px)', () => {
        pinCircleReveal(wrapper, box, mark, '18%', '+=1500', 1.2)
      })
      mm.add('(min-width: 640px) and (max-width: 1023.9px)', () => {
        pinCircleReveal(wrapper, box, mark, '12%', '+=2000', 1.3)
      })
      mm.add('(min-width: 1024px)', () => {
        pinCircleReveal(wrapper, box, mark, '8%', '+=2500', 1.5)
      })

      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [reduceMotion, locale] },
  )

  return (
    <div
      ref={rootRef}
      className={`hero-scroll${reduceMotion ? ' hero-scroll--reduced' : ''}`}
    >
      <section className="hero-scroll__panel hero-scroll__panel--intro">
        <h1 className="hero-scroll__brand">
          <picture>
            <source srcSet="/logo/logo-hero.webp" type="image/webp" />
            <img
              className="hero-scroll__logo"
              src="/logo/logo-hero.png"
              alt={t.home.brand}
              width={2134}
              height={984}
              decoding="async"
            />
          </picture>
        </h1>
        <p className="hero-scroll__kicker">{t.home.heroKicker}</p>
        <p className="hero-scroll__display">
          <span>Top Doorslammer</span>
          <span>Camaro</span>
        </p>
      </section>

      <section ref={benefitRef} className="hero-scroll__benefit">
        <h2 ref={headingRef} className="hero-scroll__heading">
          <SplitWords text={t.home.storyTitle} />
        </h2>
        <ul className="hero-scroll__tags">
          {tags.map((tag, idx) => (
            <li
              key={tag.text}
              ref={(el) => {
                tagRefs.current[idx] = el
              }}
              className={`hero-scroll__tag hero-scroll__tag--${tag.tone}`}
            >
              {tag.text}
            </li>
          ))}
        </ul>
        <p className="hero-scroll__sub">{t.home.passTeaserBody}</p>
      </section>

      <div ref={videoWrapRef} className="hero-scroll__pin">
        <div ref={videoBoxRef} className="hero-scroll__frame">
          <div ref={markRef} className="hero-scroll__mark" aria-hidden="true">
            <img src="/logo/logo-grey-png.png" alt="" width={56} height={56} />
          </div>
          {!reduceMotion ? (
            <video
              ref={videoRef}
              className="hero-scroll__video"
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
              className="hero-scroll__video"
              src="/images/hero-poster.webp"
              alt=""
              width={1920}
              height={1281}
              decoding="async"
            />
          )}
        </div>
      </div>

      <section className="hero-scroll__panel hero-scroll__panel--outro">
        <p className="hero-scroll__display">{t.home.passTeaserTitle}</p>
        <div className="hero-scroll__cta">
          <Button to={localePath(locale, 'pass')} icon>
            {t.home.ctaPass}
          </Button>
          <Button to={localePath(locale, 'journey')} variant="ghost">
            {t.home.ctaJourney}
          </Button>
        </div>
      </section>
    </div>
  )
}
