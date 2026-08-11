export type TimelineWeight = 'quiet' | 'valley' | 'peak' | 'climax'

export type TimelineChapter = 'roots' | 'build' | 'elite' | 'record'

export type TimelineEntry = {
  id: string
  year: string
  image?: string
  weight?: TimelineWeight
  chapter: TimelineChapter
}

export const timelineChapters: TimelineChapter[] = [
  'roots',
  'build',
  'elite',
  'record',
]

export const timeline: TimelineEntry[] = [
  {
    id: '1970s-first-camaro',
    year: '1970s',
    image: '/images/camaro70.jpg',
    weight: 'quiet',
    chapter: 'roots',
  },
  {
    id: '2004-ebay',
    year: '2004',
    image: '/images/car-2004.JPG',
    weight: 'quiet',
    chapter: 'roots',
  },
  {
    id: '2005-license',
    year: '2005',
    image: '/images/journey/journey-2005-1.jpeg',
    weight: 'quiet',
    chapter: 'roots',
  },
  {
    id: '2006-10s',
    year: '2006',
    image: '/images/journey/2006-camaro.jpg',
    weight: 'quiet',
    chapter: 'roots',
  },
  {
    id: '2010-nitrous',
    year: '2010',
    image: '/images/journey/2010-camaro.JPG',
    weight: 'quiet',
    chapter: 'roots',
  },
  {
    id: '2013-chassis',
    year: '2013',
    image: '/images/journey/2013 - camaro.jpeg',
    weight: 'peak',
    chapter: 'build',
  },
  {
    id: '2016-680',
    year: '2016',
    image: '/images/journey/2016-camaro.jpeg',
    weight: 'valley',
    chapter: 'build',
  },
  {
    id: '2016-2017-blower',
    year: '2016–2017',
    image: '/images/journey/2017-camaro.jpeg',
    weight: 'quiet',
    chapter: 'build',
  },
  {
    id: '2017-edrs6',
    year: '2017',
    image: '/images/journey/2017-anders.jpg',
    weight: 'quiet',
    chapter: 'elite',
  },
  {
    id: '2018-runnerup',
    year: '2018',
    image: '/images/journey/2018-camaro1.jpg',
    weight: 'quiet',
    chapter: 'elite',
  },
  {
    id: '2019-champion',
    year: '2019',
    image: '/images/journey/2019-camaro.jpeg',
    weight: 'peak',
    chapter: 'elite',
  },
  {
    id: '2021-record',
    year: '2021',
    image: '/images/journey/2018-camaro2.jpg',
    weight: 'peak',
    chapter: 'elite',
  },
  {
    id: '2023-beast',
    year: '2023',
    image: '/images/journey/2023-camaro.JPG',
    weight: 'peak',
    chapter: 'record',
  },
  {
    id: '2024-santapod',
    year: '2024',
    image: '/images/journey/2024-santapod4.JPG',
    weight: 'climax',
    chapter: 'record',
  },
  {
    id: '2025-podium',
    year: '2025',
    image: '/images/journey/2024-santapod6.JPG',
    weight: 'quiet',
    chapter: 'record',
  },
  {
    id: '2026-season',
    year: '2026',
    image: '/images/journey/2024-santapod5.JPG',
    weight: 'quiet',
    chapter: 'record',
  },
]
