import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { sponsors } from '../../data/sponsors'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PartnerRoster.css'

gsap.registerPlugin(useGSAP)

export function PartnerRoster() {
  const t = useT()
  const trackRef = useRef<HTMLDivElement>(null)
  const names = sponsors.map((sponsor) => sponsor.name)
  const marquee = [...names, ...names]

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.to(track, {
        xPercent: -50,
        duration: 42,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: trackRef },
  )

  return (
    <Section wide className="partner-roster" id="roster">
      <div className="partner-roster__marquee" aria-hidden="true">
        <div ref={trackRef} className="partner-roster__track">
          {marquee.map((name, index) => (
            <span className="partner-roster__name" key={`${name}-${index}`}>
              {name}
            </span>
          ))}
        </div>
      </div>

      <Reveal className="partner-roster__intro" pace="settle">
        <h2 className="partner-roster__title">{t.contact.rosterTitle}</h2>
      </Reveal>

      <ul className="partner-roster__list">
        {sponsors.map((sponsor) => (
          <li className="partner-roster__item" key={sponsor.id}>
            <img
              src={sponsor.logo}
              alt=""
              width={280}
              height={160}
              loading="lazy"
              decoding="async"
            />
            <p className="partner-roster__label">{sponsor.name}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
