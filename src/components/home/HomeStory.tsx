import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'
import { timeline } from '../../data/timeline'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './HomeStory.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Garage → valley → plate peak → rebuild → Santa Pod */
const TEASER_IDS = [
  '2010-nitrous',
  '2016-680',
  '2021-record',
  '2023-beast',
  '2024-santapod',
] as const

export function HomeStory() {
  const t = useT()
  const locale = useLocale()
  const pinRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const beats = TEASER_IDS.map((id) => timeline.find((entry) => entry.id === id)).filter(
    (entry): entry is NonNullable<typeof entry> => Boolean(entry),
  )

  useGSAP(
    () => {
      const pin = pinRef.current
      const viewport = viewportRef.current
      const track = trackRef.current
      const progress = progressRef.current
      if (!pin || !viewport || !track || !progress) return

      const mm = gsap.matchMedia()

      mm.add(
        '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        () => {
          const getTravel = () => Math.max(0, track.scrollWidth - viewport.clientWidth)

          gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })

          const tween = gsap.to(track, {
            x: () => -getTravel(),
            ease: 'none',
            scrollTrigger: {
              trigger: pin,
              start: () => {
                const raw = getComputedStyle(document.documentElement)
                  .getPropertyValue('--header-height')
                  .trim()
                const header = Number.parseFloat(raw) || 72
                return `top top+=${header}`
              },
              end: () => `+=${getTravel() * 1.15}`,
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                gsap.set(progress, { scaleX: self.progress })
              },
            },
          })

          return () => {
            tween.scrollTrigger?.kill()
            tween.kill()
            gsap.set(track, { clearProps: 'transform' })
            gsap.set(progress, { clearProps: 'transform' })
          }
        },
      )

      return () => mm.revert()
    },
    { dependencies: [beats.length] },
  )

  return (
    <Section className="home-story" wide>
      <Reveal className="home-story__intro">
        <p className="home-story__label">{t.home.storyLabel}</p>
        <h2 className="home-story__title">{t.home.storyTitle}</h2>
        <p className="home-story__body">{t.home.storyBody}</p>
      </Reveal>

      <div ref={pinRef} className="home-story__pin">
        <div
          ref={viewportRef}
          className="home-story__viewport"
          role="region"
          aria-label={t.home.storyTitle}
        >
          <div ref={trackRef} className="home-story__track">
            {beats.map((beat, index) => (
              <StoryBeat
                key={beat.id}
                index={index}
                total={beats.length}
                year={beat.year}
                text={t.journey.timeline[beat.id] ?? ''}
                image={beat.image}
                fallback={t.home.imageFallback}
                eager={index === 0}
              />
            ))}
          </div>
        </div>

        <div className="home-story__progress" aria-hidden="true">
          <div ref={progressRef} className="home-story__progress-fill" />
        </div>
      </div>

      <Reveal className="home-story__cta" delay={0.06} y={24}>
        <Button to={localePath(locale, 'journey')} variant="ghost" icon>
          {t.home.storyCta}
        </Button>
      </Reveal>
    </Section>
  )
}

function StoryBeat({
  index,
  total,
  year,
  text,
  image,
  fallback,
  eager,
}: {
  index: number
  total: number
  year: string
  text: string
  image?: string
  fallback: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const marker = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <article className="home-story__beat">
      <header className="home-story__meta">
        <p className="home-story__marker">{marker}</p>
        <p className="home-story__year">{year}</p>
      </header>

      {image && !failed ? (
        <img
          className="home-story__img"
          src={image}
          alt=""
          width={640}
          height={400}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : image ? (
        <div className="home-story__fallback">{fallback}</div>
      ) : null}

      <p className="home-story__text">{text}</p>
    </article>
  )
}
