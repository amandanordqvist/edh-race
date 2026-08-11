export type MediaItem = {
  id: string
  type: 'video' | 'image'
  src: string
  poster?: string
  aspect: '16/9' | '1/1' | '4/3' | '3/4'
  featured?: boolean
  credit?: string
}

export const mediaItems: MediaItem[] = [
  {
    id: 'miracle',
    type: 'video',
    src: '/movies/hero.mp4',
    poster: '/images/IMG_1860.JPG',
    aspect: '16/9',
    featured: true,
    credit: 'Julian Hunt / eurodragster.com',
  },
  {
    id: 'burnout',
    type: 'image',
    src: '/images/IMG_1867.JPG',
    aspect: '4/3',
    credit: 'Julian Hunt / eurodragster.com',
  },
  {
    id: 'launch',
    type: 'image',
    src: '/images/2024-santapod6.JPG',
    aspect: '16/9',
    credit: 'Patrik Jacobsson / racebilder.nu',
  },
  {
    id: 'pits',
    type: 'image',
    src: '/images/IMG_1863.JPG',
    aspect: '3/4',
    credit: 'Julian Hunt / eurodragster.com',
  },
  {
    id: 'staging',
    type: 'image',
    src: '/images/IMG_1872.JPG',
    aspect: '4/3',
    credit: 'Julian Hunt / eurodragster.com',
  },
  {
    id: 'archive',
    type: 'image',
    src: '/images/journey/2009 - Anders.jpeg',
    aspect: '4/3',
  },
  {
    id: 'santapodLane',
    type: 'image',
    src: '/images/santapod.jpeg',
    aspect: '16/9',
  },
  {
    id: 'stripNight',
    type: 'image',
    src: '/images/IMG_4640.JPG',
    aspect: '3/4',
  },
  {
    id: 'burnoutClose',
    type: 'image',
    src: '/images/IMG_4727.JPG',
    aspect: '4/3',
  },
  {
    id: 'crewMoment',
    type: 'image',
    src: '/images/IMG_4729.JPG',
    aspect: '4/3',
  },
  {
    id: 'garageEra',
    type: 'image',
    src: '/images/old_camaro.JPG',
    aspect: '4/3',
  },
  {
    id: 'earlyCamaro',
    type: 'image',
    src: '/images/camaro70.jpg',
    aspect: '4/3',
  },
  {
    id: 'recordFrame',
    type: 'image',
    src: '/images/IMG_5378.JPG',
    aspect: '16/9',
  },
]
