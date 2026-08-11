import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PassTeaser.css'

export function PassTeaser() {
  const t = useT()
  const locale = useLocale()

  return (
    <Section className="pass-teaser" wide>
      <div className="pass-teaser__frame">
        <Reveal className="pass-teaser__copy" y={32}>
          <h2 className="section__title">{t.home.passTeaserTitle}</h2>
          <p className="section__lead">{t.home.passTeaserBody}</p>
          <div className="pass-teaser__actions">
            <Button to={localePath(locale, 'pass')} icon>
              {t.home.passTeaserCta}
            </Button>
          </div>
        </Reveal>

        <Reveal className="pass-teaser__media" as="figure" delay={0.08} y={28} variant="media">
          <img
            className="pass-teaser__image"
            src="/images/santapod.jpeg"
            alt=""
            width={1600}
            height={1000}
            decoding="async"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden'
            }}
          />
        </Reveal>
      </div>
    </Section>
  )
}
