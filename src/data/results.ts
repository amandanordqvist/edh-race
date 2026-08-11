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

/** Landmark quarter-mile pass — Results hero */
export const landmarkPass = {
  image: '/images/journey/2024-santapod4.JPG',
}
