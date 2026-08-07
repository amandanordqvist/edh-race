export type TimelineWeight = 'quiet' | 'valley' | 'peak' | 'climax'

export type TimelineEntry = {
  id: string
  year: string
  image?: string
  weight?: TimelineWeight
}

export const timeline: TimelineEntry[] = [
  { id: '1970s-first-camaro', year: '1970s', weight: 'quiet' },
  { id: '2004-ebay', year: '2004', weight: 'quiet' },
  { id: '2005-license', year: '2005', weight: 'quiet' },
  { id: '2006-10s', year: '2006', weight: 'quiet' },
  {
    id: '2010-nitrous',
    year: '2010',
    image: '/images/2010-anders.jpeg',
    weight: 'quiet',
  },
  { id: '2013-chassis', year: '2013', weight: 'peak' },
  {
    id: '2016-680',
    year: '2016',
    image: '/images/camaro-2016old.jpg',
    weight: 'valley',
  },
  { id: '2016-2017-blower', year: '2016–2017', weight: 'quiet' },
  {
    id: '2017-edrs6',
    year: '2017',
    image: '/images/2017-anders.jpg',
    weight: 'quiet',
  },
  { id: '2018-runnerup', year: '2018', weight: 'quiet' },
  {
    id: '2019-champion',
    year: '2019',
    image: '/images/camaro_2.jpg',
    weight: 'peak',
  },
  {
    id: '2021-record',
    year: '2021',
    image: '/images/2009 - Anders.jpeg',
    weight: 'peak',
  },
  {
    id: '2023-beast',
    year: '2023',
    image: '/images/2023-camaro.JPG',
    weight: 'peak',
  },
  {
    id: '2024-santapod',
    year: '2024',
    image: '/images/IMG_1867.JPG',
    weight: 'climax',
  },
  {
    id: '2025-podium',
    year: '2025',
    image: '/images/camaro_1.jpg',
    weight: 'quiet',
  },
  {
    id: '2026-season',
    year: '2026',
    image: '/images/IMG_1857.JPG',
    weight: 'quiet',
  },
]
