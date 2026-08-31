import { useRef, useState } from 'react'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { useCinematicMedia } from './useCinematicMedia'
import './HomeMachine.css'

export function HomeMachine() {
  const t = useT()
  const locale = useLocale()
  const [failed, setFailed] = useState(false)
  const rootRef = useRef<HTMLElement | null>(null)
  useCinematicMedia(rootRef, { media: '.home-machine__img' })

  return (
    <Section className="home-machine" wide>
      <figure ref={rootRef as never} className="home-machine__media">
        {failed ? (
          <div className="home-machine__fallback" role="img" aria-label={t.home.imageFallback}>
            <span>{t.home.imageFallback}</span>
          </div>
        ) : (
            <picture>
              <source srcSet="/images/behind.webp" type="image/webp" />
              <img
                className="home-machine__img"
                src="/images/behind.JPG"
                alt={t.home.machineAlt}
                width={1500}
                height={701}
                decoding="async"
                loading="lazy"
                onError={() => setFailed(true)}
              />
            </picture>
        )}
      </figure>

      <Reveal className="home-machine__copy" delay={0.1} y={28}>
        <div className="home-machine__intro">
          <p className="home-machine__label">{t.home.machineLabel}</p>
          <h2 className="home-machine__title">{t.home.machineTitle}</h2>
          <p className="home-machine__body">{t.home.machineBody}</p>
          <Button to={localePath(locale, 'machine')} icon>
            {t.home.machineCta}
          </Button>
        </div>
        <ul className="home-machine__specs">
          {t.home.machineSpecs.map((spec) => (
            <li key={spec}>{spec}</li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
