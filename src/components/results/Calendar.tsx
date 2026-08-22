import {
  calendar2026,
  formatCalendarDates,
  getNextCalendarRound,
  getVenueImage,
  getVenueImagePosition,
  isCalendarRoundPast,
} from '../../data/calendar'
import { useLocale, useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './Calendar.css'

export function Calendar() {
  const t = useT()
  const locale = useLocale()
  const next = getNextCalendarRound()

  return (
    <Section wide className="calendar page-intro" id="kalender">
      <Reveal>
        <h1 className="calendar__page-title">{t.results.title}</h1>
        <p className="results-section__lead">{t.results.lead}</p>
      </Reveal>

      {next ? (
        <Reveal className="calendar__next" as="article" y={28}>
          <div className="calendar__next-copy">
            <p className="calendar__next-label">{t.results.nextStart}</p>
            <h2 className="calendar__next-name">{next.name}</h2>
            <p className="calendar__next-dates">
              {formatCalendarDates(next.startDate, next.endDate, locale)}
            </p>
            <p className="calendar__next-venue">
              {next.venue}, {next.city}
            </p>
          </div>
          <div className="calendar__next-plate" aria-hidden="true">
            <img
              src={getVenueImage(next.venue)}
              alt=""
              width={900}
              height={560}
              decoding="async"
              style={{ objectPosition: getVenueImagePosition(next.venue) }}
            />
          </div>
        </Reveal>
      ) : (
        <Reveal>
          <p className="calendar__done">{t.results.seasonDone}</p>
        </Reveal>
      )}

      <Reveal>
        <h2 className="results-section__heading">{t.results.calendarTitle}</h2>
      </Reveal>

      <ol className="calendar__list">
        {calendar2026.map((round, i) => {
          const isNext = next?.round === round.round
          const isPast = isCalendarRoundPast(round)
          return (
            <Reveal
              as="li"
              key={round.round}
              className={[
                'calendar__row',
                isPast ? 'calendar__row--past' : '',
                isNext ? 'calendar__row--next' : '',
                round.isFinal ? 'calendar__row--final' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              delay={0.03 * i}
              y={16}
            >
              <p className="calendar__dates">
                {formatCalendarDates(round.startDate, round.endDate, locale)}
              </p>
              <div className="calendar__body">
                <p className="calendar__name">
                  {round.name}
                  {round.isFinal ? ` · ${t.results.final}` : ''}
                </p>
                <p className="calendar__venue">{round.venue}</p>
              </div>
              {isNext ? (
                <span className="calendar__next-tag">{t.results.nextStart}</span>
              ) : null}
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
