/** Home headline bests — quarter mile / eighth mile, rounded for the strip. */
export const homeHeadlineBests = {
  quarterEt: 5.74,
  eighthEt: 3.8,
  quarterSpeedKmh: 415,
  eighthSpeedKmh: 330,
} as const

export type Standing = {
  year: number
  place: number
  medal?: 'gold' | 'silver' | 'bronze'
}

export type BestTime = {
  year: number
  event: string
  et: string
  speed: string
  highlight?: 'best' | 'latest'
  image?: string
}

/** Official timing sources — outbound, not a local database. */
export const timesSources = [
  {
    id: 'results',
    href: 'https://www.dragracing.eu/results.asp',
    host: 'dragracing.eu',
  },
  {
    id: 'timeslips',
    href: 'https://www.nitroz.se/tidskort.asp',
    host: 'nitroz.se',
  },
  {
    id: 'personalBests',
    href: 'https://www.drdb.eu/pbcls.asp?cls=9#V',
    host: 'drdb.eu',
  },
] as const

export type TimesSourceId = (typeof timesSources)[number]['id']

export const standings: Standing[] = [
  { year: 2019, place: 1, medal: 'gold' },
  { year: 2018, place: 2, medal: 'silver' },
  { year: 2025, place: 3, medal: 'bronze' },
  { year: 2023, place: 3, medal: 'bronze' },
  { year: 2017, place: 6 },
  { year: 2022, place: 7 },
  { year: 2021, place: 10 },
]

export const bestTimes: BestTime[] = [
  {
    year: 2026,
    event: 'Doorslammers',
    et: '3.859 s',
    speed: '326.71 km/h',
    highlight: 'latest',
    image: '/images/journey/2024-santapod2.png',
  },
  {
    year: 2025,
    event: 'Speedevents Internationals',
    et: '3.803 s',
    speed: '327.07 km/h',
    highlight: 'best',
    image: '/images/journey/2024-santapod5.JPG',
  },
  {
    year: 2024,
    event: 'Scandinavian Internationals',
    et: '3.913 s',
    speed: '318.96 km/h',
  },
  {
    year: 2023,
    event: 'Sweden Internationals',
    et: '4.006 s',
    speed: '308.57 km/h',
  },
  { year: 2022, event: 'Sweden Nationals', et: '3.893 s', speed: '314.14 km/h' },
  {
    year: 2021,
    event: 'Scandinavian Internationals',
    et: '3.898 s',
    speed: '306.12 km/h',
  },
  {
    year: 2020,
    event: 'Mantorp Drag Revival',
    et: '4.015 s',
    speed: '290.79 km/h',
  },
  {
    year: 2019,
    event: 'FHRA Night Race Finals',
    et: '4.031 s',
    speed: '293.16 km/h',
  },
  { year: 2018, event: 'Winter Nats', et: '4.054 s', speed: '291.03 km/h' },
  { year: 2017, event: 'Winter Nats', et: '4.120 s', speed: '283.90 km/h' },
  {
    year: 2014,
    event: 'Marie Memorial Race',
    et: '4.590 s',
    speed: '249.19 km/h',
  },
]
