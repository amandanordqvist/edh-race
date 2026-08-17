import { useState } from 'react'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './HomeDriver.css'

export function HomeDriver() {
  const t = useT()
  const locale = useLocale()
  const [failed, setFailed] = useState(false)

  return (
    <Section className="home-driver" wide>
      <div className="home-driver__frame">
        <Reveal className="home-driver__copy" delay={0.06} y={24}>
          <p className="home-driver__label">{t.home.driverLabel}</p>
          <h2 className="home-driver__title">{t.home.driverTitle}</h2>
          <p className="home-driver__body">{t.home.driverBody}</p>
          <Button to={localePath(locale, 'team')} icon>
            {t.home.driverCta}
          </Button>
        </Reveal>

        <Reveal className="home-driver__media" delay={0.1} y={20} as="figure" variant="media">
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
      </div>
    </Section>
  )
}
