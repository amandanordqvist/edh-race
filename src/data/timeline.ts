export type TimelineWeight = 'quiet' | 'valley' | 'peak' | 'climax'

export type TimelineChapter = 'roots' | 'build' | 'elite' | 'record'

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
  media?: JourneyMedia
}

export const timelineChapters: TimelineChapter[] = [
  'roots',
  'build',
  'elite',
  'record',
]

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
    weight: 'quiet',
    media: {
      src: '/images/journey/webp/camaro70-1600.webp',
      srcSet:
        '/images/journey/webp/camaro70-960.webp 960w, /images/journey/webp/camaro70-1600.webp 1600w',
      width: 1600,
      height: 1067,
    },
  },
  {
    id: '2004-ebay',
    year: '2004',
    chapter: 'roots',
    weight: 'quiet',
    media: {
      src: '/images/journey/webp/car-2004.webp',
      width: 720,
      height: 537,
    },
  },
  {
    id: '2005-license',
    year: '2005',
    chapter: 'roots',
    weight: 'quiet',
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
    weight: 'quiet',
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
    weight: 'quiet',
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
    weight: 'peak',
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
    weight: 'peak',
    media: {
      src: '/images/journey/webp/2016-camaro.webp',
      width: 640,
      height: 424,
    },
  },
  {
    id: '2016-crossroads',
    year: '2016',
    chapter: 'build',
    weight: 'valley',
  },
  {
    id: '2016-2017-blower',
    year: '2016–2017',
    chapter: 'build',
    weight: 'quiet',
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
    weight: 'quiet',
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
    weight: 'peak',
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
    weight: 'peak',
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
    weight: 'peak',
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
    weight: 'peak',
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
    weight: 'climax',
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
    weight: 'quiet',
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
    weight: 'peak',
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
 * rather than a union of the 17 literals, which would break `media` narrowing
 * for the entries that omit it.
 */
export type JourneyBeatEntry = Omit<TimelineEntry, 'id'> & { id: TimelineId }

/** The 2016 low point is rendered as its own set piece, not inside a chapter. */
export const CROSSROADS_ID = '2016-crossroads' satisfies TimelineId

export function entriesForChapter(
  chapter: TimelineChapter,
): readonly JourneyBeatEntry[] {
  return timeline.filter(
    (entry) => entry.chapter === chapter && entry.id !== CROSSROADS_ID,
  )
}

export function entryById(id: TimelineId): JourneyBeatEntry {
  const entry = timeline.find((item) => item.id === id)
  if (!entry) throw new Error(`Unknown timeline id: ${id}`)
  return entry
}
