import { useState } from 'react'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './HomeDriver.css'

export function HomeDriver() {
  const t = useT()
  const [failed, setFailed] = useState(false)

  return (
    <Section className="home-driver" wide>
      <div className="home-driver__frame">
        <div className="home-driver__layers" aria-hidden="true">
          <img
            className="home-driver__plate home-driver__plate--a"
            src="/images/camaros11.webp"
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
          />
          <img
            className="home-driver__plate home-driver__plate--b"
            src="/images/camaros13.webp"
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
          />
        </div>

        <Reveal className="home-driver__media" delay={0.08} y={20} as="figure" variant="media">
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

        <Reveal className="home-driver__copy" delay={0.12} y={24}>
          <p className="home-driver__label">{t.home.driverLabel}</p>
          <h2 className="home-driver__title">{t.home.driverTitle}</h2>
          <blockquote className="home-driver__quote">
            <p>“{t.journey.quote2}”</p>
          </blockquote>
          <p className="home-driver__body">{t.home.driverBody}</p>
        </Reveal>
      </div>
    </Section>
  )
}
