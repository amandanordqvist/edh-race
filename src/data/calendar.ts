export type CalendarRound = {
  round: number
  dates: string
  venue: string
  /** ISO date — first day of the event, for “next start” */
  startDate: string
  isFinal?: boolean
}

/** Atmosphere plates per venue — honest reuse when no dedicated shoot exists */
export const venueImages: Record<string, string> = {
  'Tierp Arena': '/images/IMG_4819.JPG',
  'Orsa (Tallhed)': '/images/IMG_4823.JPG',
  Sundsvall: '/images/IMG_4828.JPG',
  Piteå: '/images/IMG_4727.JPG',
}

export const calendar2026: CalendarRound[] = [
  { round: 1, dates: '5–7 Jun', venue: 'Tierp Arena', startDate: '2026-06-05' },
  { round: 2, dates: '19–21 Jun', venue: 'Orsa (Tallhed)', startDate: '2026-06-19' },
  { round: 3, dates: '3–5 Jul', venue: 'Sundsvall', startDate: '2026-07-03' },
  { round: 4, dates: '11–12 Jul', venue: 'Piteå', startDate: '2026-07-11' },
  { round: 5, dates: '17–18 Jul', venue: 'Piteå', startDate: '2026-07-17' },
  { round: 6, dates: '21–23 Aug', venue: 'Sundsvall', startDate: '2026-08-21' },
  {
    round: 7,
    dates: '25–27 Sep',
    venue: 'Tierp Arena',
    startDate: '2026-09-25',
    isFinal: true,
  },
]

export function getNextCalendarRound(
  rounds: CalendarRound[] = calendar2026,
  from: Date = new Date(),
): CalendarRound | undefined {
  const today = new Date(from)
  today.setHours(0, 0, 0, 0)
  return rounds.find((round) => new Date(round.startDate) >= today)
}

export function getVenueImage(venue: string): string {
  return venueImages[venue] ?? '/images/IMG_1860.JPG'
}
