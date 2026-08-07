import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import './Hero.css'

export function Hero() {
  const t = useT()
  const locale = useLocale()

  return (
    <section className="hero">
      <div className="hero__media" aria-hidden="true">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/IMG_1860.JPG"
        >
          <source src="/movies/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero__fade" />
        <div className="hero__vignette" />
      </div>

      <div className="hero__content">
        <h1 className="hero__brand">{t.home.brand}</h1>
        <p className="hero__title">{t.home.tagline}</p>
        <div className="hero__cta">
          <Button to={localePath(locale, 'journey')} icon>
            {t.home.cta}
          </Button>
        </div>
      </div>
    </section>
  )
}
