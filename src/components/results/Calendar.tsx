import { calendar2026, getNextCalendarRound } from '../../data/calendar'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './Calendar.css'

export function Calendar() {
  const t = useT()
  const next = getNextCalendarRound()

  return (
    <Section wide className="calendar">
      <Reveal>
        <h2 className="results-section__heading">{t.results.calendarTitle}</h2>
      </Reveal>

      <ol className="calendar__list">
        {calendar2026.map((round, i) => {
          const isNext = next?.round === round.round
          return (
            <Reveal
              as="li"
              key={round.round}
              className={[
                'calendar__row',
                round.isFinal ? 'calendar__row--final' : '',
                isNext ? 'calendar__row--next' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              delay={0.04 * i}
              y={24}
            >
              <div className="calendar__round-wrap">
                <p className="calendar__round">
                  {t.results.round} {round.round}
                  {round.isFinal ? ` · ${t.results.final}` : ''}
                </p>
                {isNext ? (
                  <span className="calendar__next-tag">{t.results.nextStart}</span>
                ) : null}
              </div>
              <p className="calendar__dates">{round.dates}</p>
              <p className="calendar__venue">{round.venue}</p>
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
