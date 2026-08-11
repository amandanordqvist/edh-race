import { useState } from 'react'
import { machineSpecs } from '../../data/machine'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './HomeMachine.css'

const CHIP_KEYS = new Set(['model', 'body', 'engine', 'fuel', 'transmission', 'class'])

export function HomeMachine() {
  const t = useT()
  const locale = useLocale()
  const [failed, setFailed] = useState(false)
  const chips = machineSpecs.filter((row) => CHIP_KEYS.has(row.key))

  return (
    <Section className="home-machine" wide>
      <div className="home-machine__frame">
        <Reveal className="home-machine__media" as="figure" delay={0.06} y={24} variant="media">
          {failed ? (
            <div className="home-machine__fallback" role="img" aria-label={t.home.imageFallback}>
              <span>{t.home.imageFallback}</span>
            </div>
          ) : (
            <img
              className="home-machine__img"
              src="/images/IMG_4828.JPG"
              alt={t.home.machineAlt}
              width={1600}
              height={1000}
              decoding="async"
              loading="lazy"
              onError={() => setFailed(true)}
            />
          )}
        </Reveal>

        <Reveal className="home-machine__copy" delay={0.14} y={40}>
          <p className="home-machine__label">{t.home.machineLabel}</p>
          <h2 className="home-machine__title">{t.home.machineTitle}</h2>
          <p className="home-machine__body">{t.home.machineBody}</p>
          <ul className="home-machine__chips">
            {chips.map((chip) => (
              <li key={chip.key}>
                <span className="home-machine__chip-value">{chip.value}</span>
              </li>
            ))}
          </ul>
          <Button to={localePath(locale, 'machine')} icon>
            {t.home.machineCta}
          </Button>
        </Reveal>
      </div>
    </Section>
  )
}
