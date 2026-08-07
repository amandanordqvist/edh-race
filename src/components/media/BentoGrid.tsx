import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { mediaItems } from '../../data/media'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './BentoGrid.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function BentoGrid() {
  const t = useT()
  const rootRef = useRef<HTMLUListElement>(null)
  const featured = mediaItems.find((item) => item.featured)
  const rest = mediaItems.filter((item) => !item.featured)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const items = root.querySelectorAll('.bento__item')
      items.forEach((item) => {
        const media = item.querySelector('img, video')
        if (!media) return

        gsap.fromTo(
          media,
          { scale: 0.94, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top 92%',
              end: 'top 40%',
              scrub: true,
            },
          },
        )
      })
    },
    { dependencies: [] },
  )

  const featuredCopy = featured ? t.media.items[featured.id] : null

  return (
    <Section className="bento" wide>
      {featured && featuredCopy ? (
        <Reveal as="article" className="bento__hero" y={36}>
          {featured.type === 'video' ? (
            <video
              src={featured.src}
              controls
              muted
              playsInline
              preload="metadata"
              poster={featured.poster ?? '/images/IMG_1860.JPG'}
            />
          ) : (
            <img src={featured.src} alt={featuredCopy.title} loading="eager" />
          )}
          <div className="bento__hero-copy">
            <h2>{featuredCopy.title}</h2>
            <p>{featuredCopy.caption}</p>
            {featured.credit ? (
              <p className="bento__credit">{featured.credit}</p>
            ) : null}
          </div>
        </Reveal>
      ) : null}

      <ul className="bento__grid" ref={rootRef}>
        {rest.map((item) => {
          const copy = t.media.items[item.id]
          return (
            <li
              key={item.id}
              className="bento__item"
              style={{ aspectRatio: item.aspect }}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  poster={item.poster}
                />
              ) : (
                <img src={item.src} alt={copy.title} loading="lazy" />
              )}
              <div className="bento__caption">
                <h3>{copy.title}</h3>
                <p>{copy.caption}</p>
                {item.credit ? (
                  <p className="bento__credit">{item.credit}</p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
