export type TimelineWeight = 'regular' | 'record'

export type TimelineChapter = 'roots' | 'build' | 'elite' | 'record'

/**
 * The narrative role of a year, independent of layout weight. Drives the
 * hairline / regular / solid year-label rule across the page and the
 * setback / championship / record hits in the running timeslip.
 */
export type TimelineOutcome =
  | 'quiet'
  | 'race'
  | 'record'
  | 'championship'
  | 'setback'
  | 'rebuild'

/**
 * Distances Anders raced on. 2006–2016 was quarter mile (402 m). From 2017
 * onward the class moved to eighth mile (201 m).
 */
export type TimelineDistance = '201m' | '402m'

export type JourneyMedia = {
  /** Largest available variant; also the fallback for browsers ignoring srcSet. */
  src: string
  /** Intrinsic size of `src`. Required so the browser can reserve the box. */
  width: number
  height: number
  /** Only set where a source large enough for a second width existed. */
  srcSet?: string
  priority?: boolean
}

export type TimelineEntry = {
  id: string
  /** Display string: covers '1970s' and '2016–2017', so never parse it as a number. */
  year: string
  chapter: TimelineChapter
  weight: TimelineWeight
  outcome: TimelineOutcome
  /** Cursor holds on this beat while the reader sits in the scene. */
  hold?: boolean
  /** Present only where the year had a measured pass. */
  distance?: TimelineDistance
  et?: string
  mph?: string
  kmh?: string
  media?: JourneyMedia
}

/**
 * `as const satisfies` rather than a `: TimelineEntry[]` annotation — the
 * annotation would widen `id` to `string` and we would lose the literals that
 * `TimelineId` (and with it en/sv parity checking) is derived from.
 */
export const timeline = [
  {
    id: '1970s-first-camaro',
    year: '1970s',
    chapter: 'roots',
    weight: 'regular',
    outcome: 'quiet',
    media: {
      src: '/images/journey/webp/journey-1970s-camaro.webp',
      srcSet:
        '/images/journey/webp/journey-1970s-camaro-960.webp 960w, /images/journey/webp/journey-1970s-camaro.webp 1536w',
      width: 1536,
      height: 1024,
    },
  },
  {
    id: '2004-ebay',
    year: '2004',
    chapter: 'roots',
    weight: 'regular',
    outcome: 'quiet',
    media: {
      src: '/images/journey/webp/ebay.webp',
      srcSet:
        '/images/journey/webp/ebay-960.webp 960w, /images/journey/webp/ebay.webp 1536w',
      width: 1536,
      height: 1024,
    },
  },
  {
    id: '2005-license',
    year: '2005',
    chapter: 'roots',
    weight: 'regular',
    outcome: 'quiet',
    media: {
      src: '/images/journey/webp/journey-2005-1.webp',
      width: 644,
      height: 429,
    },
  },
  {
    id: '2006-10s',
    year: '2006',
    chapter: 'roots',
    weight: 'regular',
    outcome: 'race',
    distance: '402m',
    et: '10.00',
    media: {
      src: '/images/journey/webp/2006-camaro.webp',
      width: 800,
      height: 536,
    },
  },
  {
    id: '2010-nitrous',
    year: '2010',
    chapter: 'roots',
    weight: 'regular',
    outcome: 'race',
    distance: '402m',
    et: '7.80',
    media: {
      src: '/images/journey/webp/2010-camaro-960.webp',
      width: 960,
      height: 687,
    },
  },
  {
    id: '2013-chassis',
    year: '2013',
    chapter: 'build',
    weight: 'regular',
    outcome: 'rebuild',
    media: {
      src: '/images/journey/webp/2013-camaro.webp',
      width: 640,
      height: 423,
    },
  },
  {
    id: '2016-680',
    year: '2016',
    chapter: 'build',
    weight: 'record',
    outcome: 'race',
    hold: true,
    distance: '402m',
    et: '6.80',
    media: {
      src: '/images/journey/webp/camaro-3944.webp',
      width: 920,
      height: 612,
    },
  },
  {
    id: '2016-2017-blower',
    year: '2016–2017',
    chapter: 'elite',
    weight: 'regular',
    outcome: 'rebuild',
    media: {
      src: '/images/journey/webp/2017-camaro.webp',
      width: 640,
      height: 395,
    },
  },
  {
    id: '2017-edrs6',
    year: '2017',
    chapter: 'elite',
    weight: 'regular',
    outcome: 'race',
    distance: '201m',
    et: '4.15',
    media: {
      src: '/images/journey/webp/2017-anders.webp',
      width: 720,
      height: 960,
    },
  },
  {
    id: '2018-runnerup',
    year: '2018',
    chapter: 'elite',
    weight: 'regular',
    outcome: 'championship',
    media: {
      src: '/images/journey/webp/2018-camaro1-1600.webp',
      srcSet:
        '/images/journey/webp/2018-camaro1-960.webp 960w, /images/journey/webp/2018-camaro1-1600.webp 1600w',
      width: 1600,
      height: 1067,
    },
  },
  {
    id: '2019-champion',
    year: '2019',
    chapter: 'elite',
    weight: 'record',
    outcome: 'championship',
    media: {
      src: '/images/journey/webp/2019-camaro.webp',
      width: 980,
      height: 551,
    },
  },
  {
    id: '2021-record',
    year: '2021',
    chapter: 'elite',
    weight: 'record',
    outcome: 'record',
    distance: '201m',
    et: '3.89',
    media: {
      src: '/images/journey/webp/2018-camaro2-1600.webp',
      srcSet:
        '/images/journey/webp/2018-camaro2-960.webp 960w, /images/journey/webp/2018-camaro2-1600.webp 1600w',
      width: 1600,
      height: 1067,
    },
  },
  {
    id: '2023-beast',
    year: '2023',
    chapter: 'record',
    weight: 'regular',
    outcome: 'rebuild',
    media: {
      src: '/images/journey/webp/2023-camaro-1600.webp',
      srcSet:
        '/images/journey/webp/2023-camaro-960.webp 960w, /images/journey/webp/2023-camaro-1600.webp 1600w',
      width: 1600,
      height: 1061,
    },
  },
  {
    id: '2024-santapod',
    year: '2024',
    chapter: 'record',
    weight: 'record',
    outcome: 'record',
    distance: '402m',
    et: '5.7451',
    mph: '258',
    kmh: '415',
    media: {
      src: '/images/journey/webp/2024-santapod4.webp',
      width: 720,
      height: 480,
    },
  },
  {
    id: '2025-podium',
    year: '2025',
    chapter: 'record',
    weight: 'regular',
    outcome: 'championship',
    media: {
      src: '/images/journey/webp/2024-santapod6-1200.webp',
      srcSet:
        '/images/journey/webp/2024-santapod6-960.webp 960w, /images/journey/webp/2024-santapod6-1200.webp 1200w',
      width: 1200,
      height: 800,
    },
  },
  {
    id: '2026-season',
    year: '2026',
    chapter: 'record',
    weight: 'regular',
    outcome: 'race',
    distance: '201m',
    et: '3.87',
    media: {
      src: '/images/journey/webp/2024-santapod5.webp',
      width: 720,
      height: 480,
    },
  },
] as const satisfies readonly TimelineEntry[]

export type TimelineId = (typeof timeline)[number]['id']

/**
 * A real entry: same shape as `TimelineEntry` but with `id` narrowed to the
 * known literals, so translation lookups need no cast. Kept as one object type
 * rather than a union of the literals, which would break `media` narrowing
 * for the entries that omit it.
 */
export type JourneyBeatEntry = Omit<TimelineEntry, 'id'> & { id: TimelineId }

export function entryById(id: TimelineId): JourneyBeatEntry {
  const entry = timeline.find((item) => item.id === id)
  if (!entry) throw new Error(`Unknown timeline id: ${id}`)
  return entry
}

/**
 * Rows the running timeslip renders, in scroll order. The two silent
 * bookends sit where the calendar has gaps (2011–2012 and 2022).
 */
export type TimeslipRow =
  | { kind: 'beat'; id: TimelineId; entry: JourneyBeatEntry }
  | { kind: 'bookend'; id: TimelineBookendId; year: string }

export type TimelineBookendId = 'bookend-2011' | 'bookend-2022'

export const timelineBookends: readonly {
  id: TimelineBookendId
  year: string
  /** Placed after this timeline id in reading order. */
  after: TimelineId
}[] = [
  { id: 'bookend-2011', year: '2011–2012', after: '2010-nitrous' },
  { id: 'bookend-2022', year: '2022', after: '2021-record' },
]

/**
 * The full reading sequence of the page's running timeslip: every beat
 * interleaved with the two silent bookends. Deriving this once keeps the
 * timeslip, scroll spy and reveal effects reading the same list.
 */
export function timeslipRows(): readonly TimeslipRow[] {
  const bookendsByAnchor = new Map(
    timelineBookends.map((bookend) => [bookend.after, bookend]),
  )

  const rows: TimeslipRow[] = []
  for (const entry of timeline) {
    rows.push({ kind: 'beat', id: entry.id, entry })
    const bookend = bookendsByAnchor.get(entry.id)
    if (bookend) {
      rows.push({ kind: 'bookend', id: bookend.id, year: bookend.year })
    }
  }
  return rows
}
