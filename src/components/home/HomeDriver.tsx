import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './HomeDriver.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function HomeDriver() {
  const t = useT()
  const locale = useLocale()
  const [failed, setFailed] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const mark = root.querySelector<HTMLElement>('.home-driver__mark')
      const img = root.querySelector<HTMLElement>('.home-driver__img')
      const plate = root.querySelector<HTMLElement>('.home-driver__plate')

      const ctx = gsap.context(() => {
        if (mark) {
          gsap.fromTo(
            mark,
            { xPercent: -3 },
            {
              xPercent: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.1,
              },
            },
          )
        }

        if (img) {
          gsap.fromTo(
            img,
            { yPercent: 3 },
            {
              yPercent: -3,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            },
          )
        }

        if (plate) {
          gsap.fromTo(
            plate,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
              },
            },
          )
        }
      }, root)

      return () => ctx.revert()
    },
    { scope: rootRef },
  )

  return (
    <Section className="home-driver" wide>
      <div className="home-driver__frame" ref={rootRef}>
        <span className="home-driver__mark" aria-hidden="true">
          EDH
        </span>

        <figure className="home-driver__plate" aria-hidden="true">
          <picture>
            <source
              srcSet="/images/journey/webp/2024-santapod6-960.webp"
              type="image/webp"
            />
            <img
              src="/images/journey/webp/2024-santapod6-960.webp"
              alt=""
              width={960}
              height={640}
              decoding="async"
              loading="lazy"
            />
          </picture>
          <figcaption>
            <span className="home-driver__plate-meta">{t.home.driverCardMeta}</span>
            <span className="home-driver__plate-time">{t.home.driverCardTime}</span>
          </figcaption>
        </figure>

        <Reveal
          className="home-driver__media"
          delay={0.06}
          y={20}
          as="figure"
          variant="media"
        >
          {failed ? (
            <div
              className="home-driver__fallback"
              role="img"
              aria-label={t.home.imageFallback}
            >
              <span>{t.home.imageFallback}</span>
            </div>
          ) : (
            <picture>
              <source srcSet="/images/standinganders.webp" type="image/webp" />
              <img
                className="home-driver__img"
                src="/images/standinganders.png"
                alt={t.home.driverAlt}
                width={458}
                height={1600}
                decoding="async"
                loading="lazy"
                onError={() => setFailed(true)}
              />
            </picture>
          )}
        </Reveal>

        <div className="home-driver__veil" aria-hidden="true" />

        <Reveal className="home-driver__copy" delay={0.1} y={24}>
          <p className="home-driver__eyebrow">
            <span className="home-driver__eyebrow-rule" aria-hidden="true" />
            <span className="home-driver__eyebrow-label">{t.home.driverLabel}</span>
            <span className="home-driver__eyebrow-dot" aria-hidden="true">
              ·
            </span>
            <span className="home-driver__eyebrow-meta">
              {t.home.driverEyebrowMeta}
            </span>
          </p>

          <h2 className="home-driver__title">{t.home.driverTitle}</h2>
          <p className="home-driver__tagline">{t.home.driverTagline}</p>
          <p className="home-driver__body">{t.home.driverBody}</p>

          {t.home.driverQuote ? (
            <p className="home-driver__quote">
              <span aria-hidden="true">“</span>
              {t.home.driverQuote}
              <span aria-hidden="true">”</span>
            </p>
          ) : null}

          <div className="home-driver__ctas">
            <Button to={localePath(locale, 'journey')} variant="primary" icon>
              {t.home.driverCta}
            </Button>
            <Button to={localePath(locale, 'machine')} variant="ghost" icon>
              {t.home.driverCtaSecondary}
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
