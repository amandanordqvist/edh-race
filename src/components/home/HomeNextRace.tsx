import { getNextCalendarRound } from '../../data/calendar'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './HomeNextRace.css'

export function HomeNextRace() {
  const t = useT()
  const locale = useLocale()
  const next = getNextCalendarRound()

  return (
    <Section className="home-next" wide>
      <Reveal className="home-next__shell" y={40}>
        <div className="home-next__media" aria-hidden="true">
          <img
            src="/images/IMG_4819.JPG"
            alt=""
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="home-next__card">
          <div className="home-next__head">
            <p className="home-next__label">{t.home.nextRaceLabel}</p>
            {next ? <p className="home-next__status">{t.home.nextRaceStatus}</p> : null}
          </div>
          <h2 className="home-next__title">{t.home.nextRaceTitle}</h2>

          {next ? (
            <dl className="home-next__facts">
              <div>
                <dt>{t.results.round}</dt>
                <dd>
                  {next.round}
                  {next.isFinal ? ` · ${t.results.final}` : ''}
                </dd>
              </div>
              <div>
                <dt>{t.common.location}</dt>
                <dd>{next.venue}</dd>
              </div>
              <div>
                <dt>{t.results.colEvent}</dt>
                <dd>{next.dates}</dd>
              </div>
              <div>
                <dt>{t.home.nextRaceClassLabel}</dt>
                <dd>{t.home.nextRaceClass}</dd>
              </div>
            </dl>
          ) : (
            <p className="home-next__done">{t.home.nextRaceSeasonDone}</p>
          )}

          <Button to={localePath(locale, 'results')} icon>
            {t.home.nextRaceCta}
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}
