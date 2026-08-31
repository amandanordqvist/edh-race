import type { PassQuality } from './types'

/**
 * Full 3D on desktop; lower fidelity on phones. Do not key off
 * `deviceMemory` — Chrome often reports 4 GB on laptops, which killed HDRI,
 * crowd, smoke, and left a flat “dead” strip.
 */
export function detectPassQuality(): PassQuality {
  if (typeof window === 'undefined') {
    return 'high'
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const narrowViewport = window.innerWidth < 768

  if (coarsePointer || narrowViewport) {
    return 'low'
  }

  return 'high'
}
