import type { PassQuality } from './types'

type NavigatorWithDeviceMemory = Navigator & {
  deviceMemory?: number
}

export function detectPassQuality(): PassQuality {
  if (typeof window === 'undefined') {
    return 'high'
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const narrowViewport = window.innerWidth < 768
  const deviceMemory = (navigator as NavigatorWithDeviceMemory).deviceMemory
  const lowMemory = typeof deviceMemory === 'number' && deviceMemory <= 4

  if (coarsePointer || narrowViewport || lowMemory) {
    return 'low'
  }

  return 'high'
}
