import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { sponsors } from '../../data/sponsors'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './SponsorStrip.css'

gsap.registerPlugin(useGSAP)

export function SponsorStrip() {
  const t = useT()
  const locale = useLocale()
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.to(track, {
        xPercent: -50,
        duration: 32,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: trackRef },
  )

  const logos = [...sponsors, ...sponsors]

  return (
    <Section className="sponsor-strip" id="partners" wide>
      <Reveal className="sponsor-strip__intro" pace="settle">
        <p className="sponsor-strip__label">{t.home.sponsorsLabel}</p>
        <h2 className="section__title">{t.home.sponsorsTitle}</h2>
        <p className="section__lead">{t.home.sponsorsBody}</p>
        <div className="sponsor-strip__actions">
          <Button to={localePath(locale, 'contact')} icon>
            {t.home.sponsorsCta}
          </Button>
        </div>
      </Reveal>

      <div id="partner-logos" className="sponsor-strip__marquee">
        <div ref={trackRef} className="sponsor-strip__track">
          {logos.map((sponsor, index) => (
            <div
              className="sponsor-strip__logo"
              key={`${sponsor.id}-${index}`}
              aria-hidden={index >= sponsors.length}
            >
              <img
                src={sponsor.logo}
                alt={index >= sponsors.length ? '' : sponsor.name}
                width={220}
                height={88}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
