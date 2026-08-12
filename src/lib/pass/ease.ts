import { camaroDistanceSplits, QUARTER_FEET, QUARTER_METERS } from '../../data/simulator'

/** Legacy ease-in — kept for comparison vehicles. */
export function power2In(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x
}

/**
 * Camaro distance along the strip from real Doorslammers split times.
 * Returns 0–1 progress for a given elapsed time from green.
 */
export function camaroStripProgress(elapsedS: number): number {
  const splits = camaroDistanceSplits
  const last = splits[splits.length - 1]
  if (!last) return 0

  if (elapsedS <= 0) return 0
  if (elapsedS >= last.et) return 1

  for (let i = 1; i < splits.length; i += 1) {
    const prev = splits[i - 1]
    const next = splits[i]
    if (!prev || !next) continue

    if (elapsedS <= next.et) {
      const span = next.et - prev.et
      const u = span <= 0 ? 1 : (elapsedS - prev.et) / span
      const feet = prev.feet + (next.feet - prev.feet) * u
      return feet / QUARTER_FEET
    }
  }

  return 1
}

/**
 * Instantaneous physical speed in km/h — derived from the piecewise-linear
 * position curve between real Doorslammers split times. Widening the sample
 * window smooths out the segment boundaries so the HUD doesn't step-change.
 */
export function camaroInstantSpeedKmh(elapsedS: number): number {
  if (elapsedS <= 0) return 0

  const eps = 0.06
  const a = camaroStripProgress(Math.max(0, elapsedS - eps))
  const b = camaroStripProgress(elapsedS + eps)
  const fractionPerSecond = (b - a) / (2 * eps)
  const metersPerSecond = fractionPerSecond * QUARTER_METERS

  return Math.max(0, metersPerSecond * 3.6)
}

/** Instantaneous normalized speed 0–1 relative to trap speed. */
export function camaroSpeed01(elapsedS: number, topSpeedKmh = 415): number {
  const kmh = camaroInstantSpeedKmh(elapsedS)
  return Math.min(1, Math.max(0, kmh / topSpeedKmh))
}

export function camaroDisplaySpeedKmh(elapsedS: number, topSpeedKmh = 415): number {
  return Math.min(topSpeedKmh, camaroInstantSpeedKmh(elapsedS))
}

/**
 * F1 / jet motion over their total ET.
 * Ease-in (slow off the line) — doorslammer hooks harder at 60′ than an F1
 * or jet from a standing start. Ease-out was incorrectly putting them ahead
 * at the first split.
 */
export function comparisonStripProgress(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x ** 2.1
}
