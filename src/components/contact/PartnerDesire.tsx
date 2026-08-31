import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { useT } from '../../i18n'
import { SplitWords } from '../home/SplitWords'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PartnerDesire.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function PartnerDesire() {
  const t = useT()
  const frameRef = useRef<HTMLDivElement>(null)
  const values = [
    t.contact.values.exposure,
    t.contact.values.beast,
    t.contact.values.precision,
  ]

  useGSAP(
    () => {
      const frame = frameRef.current
      if (!frame) return

      const words = frame.querySelectorAll('.cinematic-word')
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(words, { clearProps: 'opacity,transform', opacity: 1 })
        return
      }

      gsap.set(words, { opacity: 0.12 })
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: frame,
          start: 'top 78%',
          end: 'top 28%',
          scrub: 0.75,
        },
      })
    },
    { scope: frameRef },
  )

  return (
    <Section wide className="partner-desire">
      <div ref={frameRef} className="partner-desire__frame">
        <h2 className="partner-desire__scrub">
          <SplitWords text={t.contact.valuesScrub} />
        </h2>
      </div>

      <Reveal as="ul" className="partner-desire__list" stagger={0.08} pace="settle">
        {values.map((value) => (
          <li key={value.title} className="partner-desire__item">
            <h3>{value.title}</h3>
            <p>{value.body}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}
