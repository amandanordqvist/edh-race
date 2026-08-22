export type SpecRow = {
  key: string
  value: string
}

export const machineSpecs: SpecRow[] = [
  { key: 'model', value: 'Chevrolet Camaro' },
  { key: 'class', value: 'Top Doorslammer' },
  { key: 'body', value: 'Five Star carbon fibre body (USA)' },
  { key: 'chassis', value: 'Chromoly tube chassis by Mats Brag (MB)' },
  { key: 'engine', value: 'BAE 521 Hemi V8 (Brad Anderson Engineering)' },
  { key: 'displacement', value: '521 ci (8.5 L)' },
  { key: 'blower', value: 'PSI screw blower' },
  { key: 'power', value: '~3,500–4,000+ hp' },
  { key: 'transmission', value: 'Coan 400 3-speed racing automatic' },
  { key: 'crankshaft', value: 'Sonny' },
  { key: 'rear', value: 'MB rear axle, four-link suspension' },
  { key: 'fuel', value: 'Methanol' },
  { key: 'weight', value: '1140 kg (incl. driver and 25 L methanol)' },
  { key: 'safety', value: 'Dual parachutes' },
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
