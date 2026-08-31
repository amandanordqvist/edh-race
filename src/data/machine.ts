export type SpecRow = {
  key: string
  value: string
}

/** Team spec card — Camaro / Top Doorslammer. */
export const machineSpecs: SpecRow[] = [
  { key: 'brand', value: 'Camaro' },
  { key: 'class', value: 'Top Doorslammer' },
  { key: 'builtIn', value: '2023' },
  { key: 'builtBy', value: 'Anders Edh' },
  { key: 'chassis', value: 'Mats Brag' },
  { key: 'body', value: 'Five Star' },
  { key: 'paintedBy', value: 'P.Jons' },
  { key: 'fuel', value: 'Metanol' },
  { key: 'poweradder', value: 'Blower' },
  { key: 'engine', value: 'BAE' },
  { key: 'displacement', value: '521' },
  { key: 'crankshaft', value: 'Sonny' },
  { key: 'transmission', value: 'Coan 400' },
  { key: 'rear', value: 'MB' },
]

export const specHighlightKeys = ['bestEt', 'bestSpeed', 'class'] as const

export type MachinePhotoId = 'front' | 'engine' | 'side'

export type MachinePhoto = {
  id: MachinePhotoId
  src: string
  webp: string
  webpSrcSet?: string
  width: number
  height: number
  credit?: string
}

export const machineHeroPhoto: MachinePhoto = {
  id: 'front',
  src: '/images/2023-camaro.JPG',
  webp: '/images/journey/webp/2023-camaro-1600.webp',
  webpSrcSet:
    '/images/journey/webp/2023-camaro-960.webp 960w, /images/journey/webp/2023-camaro-1600.webp 1600w',
  width: 1600,
  height: 1061,
}

export const machinePairPhotos: MachinePhoto[] = [
  {
    id: 'engine',
    src: '/images/behind.JPG',
    webp: '/images/behind.webp',
    width: 1500,
    height: 701,
  },
  {
    id: 'side',
    src: '/images/camaros14.jpg',
    webp: '/images/camaros14.webp',
    width: 2048,
    height: 1152,
    credit: 'Patrik Jacobsson / racebilder.nu',
  },
]

