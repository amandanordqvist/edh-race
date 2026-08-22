export type CalendarCountry = 'sweden' | 'england'

export type CalendarRound = {
  round: number
  name: string
  venue: string
  city: string
  country: CalendarCountry
  /** ISO date — first day of the event */
  startDate: string
  /** ISO date — last day, when the event spans more than one day */
  endDate?: string
  isFinal?: boolean
}

/** Atmosphere plates per venue — honest reuse when no dedicated shoot exists */
export const venueImages: Record<string, string> = {
  'Santa Pod Raceway': '/images/santa-pod.JPG',
  'Tierp Arena': '/images/tierp.jpeg',
  'Hudik Raceway': '/images/IMG_1860.JPG',
  'Mantorp Park': '/images/IMG_4727.JPG',
  'Sundsvall Raceway': '/images/winner.JPG',
}

/** Cover-crop anchors so faces, cars and watermarks land correctly in wide frames */
export const venueImagePositions: Record<string, string> = {
  'Santa Pod Raceway': 'center 34%',
  'Tierp Arena': '62% 68%',
  'Hudik Raceway': 'center 36%',
  'Mantorp Park': 'center 42%',
  'Sundsvall Raceway': '72% 24%',
}

export const calendar2026: CalendarRound[] = [
  {
    round: 1,
    name: 'Doorslammers',
    venue: 'Santa Pod Raceway',
    city: 'Podington',
    country: 'england',
    startDate: '2026-05-15',
    endDate: '2026-05-17',
  },
  {
    round: 2,
    name: 'Carl Cox Five90 Pro Mod',
    venue: 'Santa Pod Raceway',
    city: 'Podington',
    country: 'england',
    startDate: '2026-05-21',
    endDate: '2026-05-22',
  },
  {
    round: 3,
    name: 'The Main Event',
    venue: 'Santa Pod Raceway',
    city: 'Podington',
    country: 'england',
    startDate: '2026-05-22',
    endDate: '2026-05-26',
  },
  {
    round: 4,
    name: 'SpeedEvents Internationals',
    venue: 'Tierp Arena',
    city: 'Tierp',
    country: 'sweden',
    startDate: '2026-06-04',
    endDate: '2026-06-07',
  },
  {
    round: 5,
    name: 'TT Hudik Raceway',
    venue: 'Hudik Raceway',
    city: 'Hudiksvall',
    country: 'sweden',
    startDate: '2026-06-27',
    endDate: '2026-06-28',
  },
  {
    round: 6,
    name: "Test'n Tune Glada Hudik Summer Week",
    venue: 'Hudik Raceway',
    city: 'Hudiksvall',
    country: 'sweden',
    startDate: '2026-07-16',
  },
  {
    round: 7,
    name: "Meguiar's Drag Festival",
    venue: 'Mantorp Park',
    city: 'Mantorp',
    country: 'sweden',
    startDate: '2026-07-23',
    endDate: '2026-07-26',
  },
  {
    round: 8,
    name: 'Summit Racing Internationals',
    venue: 'Tierp Arena',
    city: 'Tierp',
    country: 'sweden',
    startDate: '2026-08-06',
    endDate: '2026-08-09',
  },
  {
    round: 9,
    name: 'Mid Sweden Finals',
    venue: 'Sundsvall Raceway',
    city: 'Sundsvall',
    country: 'sweden',
    startDate: '2026-08-22',
    endDate: '2026-08-23',
  },
  {
    round: 10,
    name: 'Markus Memorial',
    venue: 'Hudik Raceway',
    city: 'Hudiksvall',
    country: 'sweden',
    startDate: '2026-09-04',
    endDate: '2026-09-05',
    isFinal: true,
  },
]

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatCalendarDates(
  startDate: string,
  endDate: string | undefined,
  locale: 'sv' | 'en',
): string {
  const loc = locale === 'sv' ? 'sv-SE' : 'en-GB'
  const start = parseIsoDate(startDate)
  const end = endDate ? parseIsoDate(endDate) : start
  const month = new Intl.DateTimeFormat(loc, { month: 'short' })
  const day = new Intl.DateTimeFormat(loc, { day: 'numeric' })

  if (start.getTime() === end.getTime()) {
    return `${day.format(start)} ${month.format(start)}`
  }

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${day.format(start)}–${day.format(end)} ${month.format(end)}`
  }

  return `${day.format(start)} ${month.format(start)} – ${day.format(end)} ${month.format(end)}`
}

function startOfDay(from: Date): Date {
  const today = new Date(from)
  today.setHours(0, 0, 0, 0)
  return today
}

export function isCalendarRoundPast(
  round: CalendarRound,
  from: Date = new Date(),
): boolean {
  return parseIsoDate(round.endDate ?? round.startDate) < startOfDay(from)
}

export function getNextCalendarRound(
  rounds: CalendarRound[] = calendar2026,
  from: Date = new Date(),
): CalendarRound | undefined {
  const today = startOfDay(from)
  return rounds.find((round) => parseIsoDate(round.endDate ?? round.startDate) >= today)
}

export function getVenueImage(venue: string): string {
  return venueImages[venue] ?? '/images/IMG_1860.JPG'
}

export function getVenueImagePosition(venue: string): string {
  return venueImagePositions[venue] ?? 'center 38%'
}
