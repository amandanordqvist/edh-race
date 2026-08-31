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

/** 3/4 still used if WebGL is unavailable. */
export const studioPosterSrc = '/images/images-car/showcase/13.webp'
