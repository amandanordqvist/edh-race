import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Section } from '../ui/Section'
import { SplitWords } from './SplitWords'
import './PassTeaser.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function PassTeaser() {
  const t = useT()
  const locale = useLocale()
  const [failed, setFailed] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const frame = frameRef.current
      const copy = copyRef.current
      const media = mediaRef.current
      if (!frame || !copy || !media) return

      const words = copy.querySelectorAll('.cinematic-word')
      const rest = copy.querySelectorAll('.pass-teaser__lead, .pass-teaser__actions')

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([copy, media, words, rest], {
          clearProps: 'opacity,transform',
          opacity: 1,
          y: 0,
          scale: 1,
        })
        return
      }

      gsap.set(media, { opacity: 0.5, scale: 0.92 })
      gsap.set(words, { opacity: 0.12 })
      gsap.set(rest, { opacity: 0, y: 20 })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: frame,
            start: 'top 82%',
            end: 'top 28%',
            scrub: 0.75,
          },
        })
        .to(media, { opacity: 1, scale: 1, ease: 'none' }, 0)
        .to(words, { opacity: 1, stagger: 0.08, ease: 'none' }, 0.08)
        .to(rest, { opacity: 1, y: 0, stagger: 0.06, ease: 'none' }, 0.22)
    },
    { scope: frameRef },
  )

  return (
    <Section className="pass-teaser" wide>
      <div ref={frameRef} className="pass-teaser__frame">
        <div ref={copyRef} className="pass-teaser__copy">
          <p className="pass-teaser__label">{t.home.passTeaserLabel}</p>
          <h2 className="pass-teaser__title">
            <SplitWords text={t.home.passTeaserTitle} />
          </h2>
          <p className="pass-teaser__lead">{t.home.passTeaserBody}</p>
          <div className="pass-teaser__actions">
            <Button to={localePath(locale, 'pass')} icon>
              {t.home.passTeaserCta}
            </Button>
          </div>
        </div>

        <figure ref={mediaRef} className="pass-teaser__media">
          {failed ? (
            <div className="pass-teaser__fallback" role="img" aria-label={t.home.imageFallback}>
              <span>{t.home.imageFallback}</span>
            </div>
          ) : (
            <picture>
              <source srcSet="/images/camaros10.webp" type="image/webp" />
              <img
                className="pass-teaser__image"
                src="/images/camaros10.jpg"
                alt={t.home.passTeaserAlt}
                width={1600}
                height={900}
                decoding="async"
                loading="lazy"
                onError={() => setFailed(true)}
              />
            </picture>
          )}
          <figcaption className="pass-teaser__facts">{t.home.passTeaserFacts}</figcaption>
        </figure>
      </div>
    </Section>
  )
}
