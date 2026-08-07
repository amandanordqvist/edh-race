export type SpecRow = {
  key: string
  value: string
}

export const machineSpecs: SpecRow[] = [
  { key: 'model', value: 'Chevrolet Camaro (2018)' },
  { key: 'class', value: 'Top Doorslammer' },
  { key: 'body', value: 'Five Star carbon fibre body (USA)' },
  { key: 'engine', value: 'BAE (Brad Anderson Engineering) 521 Hemi' },
  { key: 'displacement', value: '521 ci (8.5 L)' },
  { key: 'power', value: '~3,500 – 4,000 hp' },
  { key: 'transmission', value: 'Coan 400 with sprag clutch' },
  { key: 'crankshaft', value: 'Sonny' },
  { key: 'fuel', value: 'Methanol (~25 L per pass)' },
  {
    key: 'weight',
    value: '~1,140 kg (class min. 1,179 kg incl. driver after finish)',
  },
]

export const hotspotIds = ['engine', 'compressor', 'chassis', 'fourLink'] as const
export type HotspotId = (typeof hotspotIds)[number]

/** Curated orbit of normalized WebP angles (raw plates are not a true 360 set). */
export const carShowcaseOrder = [
  13, 6, 12, 2, 9, 8, 14, 4, 3, 17, 16, 1, 10, 7, 18, 15, 5,
] as const

export const carTurntableFrames = carShowcaseOrder.map(
  (id) => `/images/images-car/showcase/${String(id).padStart(2, '0')}.webp`,
)
