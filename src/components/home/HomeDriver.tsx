import { useRef, useState } from 'react'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { useCinematicMedia } from './useCinematicMedia'
import './HomeDriver.css'

export function HomeDriver() {
  const t = useT()
  const [failed, setFailed] = useState(false)
  const plateRef = useRef<HTMLElement>(null)
  useCinematicMedia(plateRef, { media: 'img' })

  return (
    <Section className="home-driver" wide>
      <figure ref={plateRef as never} className="home-driver__plate">
        {failed ? (
          <div
            className="home-driver__fallback"
            role="img"
            aria-label={t.home.imageFallback}
          >
            <span>{t.home.imageFallback}</span>
          </div>
        ) : (
          <img
            className="home-driver__img"
            src="/images/journey/andersedh.jpg"
            alt={t.home.driverAlt}
            width={2048}
            height={1367}
            decoding="async"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
      </figure>

      <Reveal className="home-driver__copy" delay={0.1} y={24}>
        <p className="home-driver__label">{t.home.driverLabel}</p>
        <h2 className="home-driver__title">{t.home.driverTitle}</h2>
        <blockquote className="home-driver__quote">
          <p>“{t.journey.quote2}”</p>
        </blockquote>
        <p className="home-driver__body">{t.home.driverBody}</p>
      </Reveal>
    </Section>
  )
}
