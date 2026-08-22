import {
  formatCalendarDates,
  getNextCalendarRound,
  getVenueImage,
  getVenueImagePosition,
} from '../../data/calendar'
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
      <Reveal className="home-next__shell" y={32}>
        {next ? (
          <div className="home-next__media" aria-hidden="true">
            <img
              src={getVenueImage(next.venue)}
              alt=""
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: getVenueImagePosition(next.venue) }}
            />
          </div>
        ) : null}
        <div className="home-next__card">
          <p className="home-next__label">{t.home.nextRaceLabel}</p>
          <h2 className="home-next__title">{t.home.nextRaceTitle}</h2>

          {next ? (
            <dl className="home-next__facts">
              <div>
                <dt>{t.home.nextRaceEventLabel}</dt>
                <dd>{next.name}</dd>
              </div>
              <div>
                <dt>{t.home.nextRaceDateLabel}</dt>
                <dd>{formatCalendarDates(next.startDate, next.endDate, locale)}</dd>
              </div>
              <div>
                <dt>{t.home.nextRaceTrackLabel}</dt>
                <dd>{next.venue}</dd>
              </div>
              <div>
                <dt>{t.home.nextRacePlaceLabel}</dt>
                <dd>
                  {next.city}, {t.home.countries[next.country]}
                </dd>
              </div>
              <div>
                <dt>{t.home.nextRaceClassLabel}</dt>
                <dd>{t.home.nextRaceClass}</dd>
              </div>
              <div>
                <dt>{t.home.nextRaceStatusLabel}</dt>
                <dd>{t.home.nextRaceStatus}</dd>
              </div>
            </dl>
          ) : (
            <p className="home-next__done">{t.home.nextRaceEmpty}</p>
          )}

          <Button to={localePath(locale, 'results')} icon>
            {t.home.nextRaceCta}
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}
