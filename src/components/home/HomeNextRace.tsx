import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  formatCalendarDates,
  getNextCalendarRound,
  getVenueImage,
  getVenueImagePosition,
} from '../../data/calendar'
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Section } from '../ui/Section'
import { useCinematicMedia } from './useCinematicMedia'
import './HomeNextRace.css'

export function HomeNextRace() {
  const t = useT()
  const locale = useLocale()
  const next = getNextCalendarRound()
  const shellRef = useRef<HTMLAnchorElement>(null)
  useCinematicMedia(shellRef, { media: '.home-next__media img', copy: '.home-next__card' })

  return (
    <Section className="home-next" wide>
      <Link
        ref={shellRef}
        to={localePath(locale, 'results')}
        className="home-next__shell"
        aria-label={t.home.nextRaceCta}
      >
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
          <p className="home-next__label">{t.home.nextRaceTitle}</p>

          {next ? (
            <>
              <h2 className="home-next__venue">{next.venue}</h2>
              <p className="home-next__event">{next.name}</p>
              <p className="home-next__date">
                {formatCalendarDates(next.startDate, next.endDate, locale)}
              </p>
              <p className="home-next__meta">
                <span>
                  {next.city}, {t.home.countries[next.country]}
                </span>
                <span>{t.home.nextRaceClass}</span>
              </p>
            </>
          ) : (
            <h2 className="home-next__venue">{t.home.nextRaceEmpty}</h2>
          )}

          <p className="home-next__more">{t.home.nextRaceCta}</p>
        </div>
      </Link>
    </Section>
  )
}
