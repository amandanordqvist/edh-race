import { useRef, useState } from 'react'
import { SITE } from '../../data/site'
import { useT } from '../../i18n'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { useCinematicMedia } from './useCinematicMedia'
import './HomeDispatch.css'

export function HomeDispatch() {
  const t = useT()
  const [failed, setFailed] = useState(false)
  const plateRef = useRef<HTMLElement>(null)
  useCinematicMedia(plateRef, { media: 'img' })

  return (
    <Section wide className="home-dispatch">
      <figure ref={plateRef as never} className="home-dispatch__plate">
        {failed ? (
          <div className="home-dispatch__fallback" role="img" aria-label={t.home.imageFallback}>
            <span>{t.home.imageFallback}</span>
          </div>
        ) : (
          <picture>
            <source srcSet="/images/camaros12.webp" type="image/webp" />
            <img
              src="/images/camaros12.jpg"
              alt={t.home.facebookAlt}
              width={1600}
              height={1068}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
            />
          </picture>
        )}
      </figure>
      <Reveal className="home-dispatch__copy">
        <h2 className="home-dispatch__title">{t.home.facebookTitle}</h2>
        <p className="home-dispatch__body">{t.home.facebookBody}</p>
        <Button href={SITE.social.facebook} variant="ghost" icon>
          {t.home.facebookCta}
        </Button>
      </Reveal>
    </Section>
  )
}
