import { camaroDistanceSplits, QUARTER_FEET, QUARTER_METERS } from '../../data/simulator'

// The Pass Arena caches these functions inside long-lived closures (race
// controller updateHandler, effects loops). Partial HMR patches leave stale
// bindings alive and the HUD keeps reading the old speed curve — so we accept
// our own updates and immediately invalidate, which forces a full-page reload
// down the dependency chain and hands out the fresh module everywhere.
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    import.meta.hot?.invalidate()
  })
}

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
 * Segment average speeds from the real Doorslammers timeslip.
 *
 * Each segment's mean speed is anchored at that segment's midpoint; between
 * midpoints we linearly interpolate so the HUD glides between "gears" instead
 * of step-changing. The last segment (1254'→1320') averages exactly
 * 258.18 mph ≈ 415 km/h — matching the officially timed trap speed at the
 * finish line, so the HUD reads the true trap number as the car crosses.
 */
const camaroSpeedAnchors: { et: number; kmh: number }[] = (() => {
  const splits = camaroDistanceSplits
  const anchors: { et: number; kmh: number }[] = [{ et: 0, kmh: 0 }]
  for (let i = 1; i < splits.length; i += 1) {
    const prev = splits[i - 1]
    const next = splits[i]
    if (!prev || !next) continue
    const feet = next.feet - prev.feet
    const time = next.et - prev.et
    if (time <= 0) continue
    const metersPerSecond = ((feet / QUARTER_FEET) * QUARTER_METERS) / time
    anchors.push({ et: (prev.et + next.et) / 2, kmh: metersPerSecond * 3.6 })
  }
  return anchors
})()

/**
 * Instantaneous speed in km/h. Uses the segment-midpoint anchors so the trap
 * reading matches the official 258.18 mph / 415 km/h at the finish line.
 */
export function camaroInstantSpeedKmh(elapsedS: number): number {
  if (elapsedS <= 0) return 0
  if (camaroSpeedAnchors.length < 2) return 0

  const last = camaroSpeedAnchors[camaroSpeedAnchors.length - 1]
  if (elapsedS >= last.et) return last.kmh

  for (let i = 1; i < camaroSpeedAnchors.length; i += 1) {
    const prev = camaroSpeedAnchors[i - 1]
    const next = camaroSpeedAnchors[i]
    if (elapsedS <= next.et) {
      const span = next.et - prev.et
      const u = span <= 0 ? 1 : (elapsedS - prev.et) / span
      return prev.kmh + (next.kmh - prev.kmh) * u
    }
  }
  return last.kmh
}

/** Instantaneous normalized speed 0–1 relative to trap speed. */
export function camaroSpeed01(elapsedS: number, topSpeedKmh = 415): number {
  const kmh = camaroInstantSpeedKmh(elapsedS)
  return Math.min(1, Math.max(0, kmh / topSpeedKmh))
}

export function camaroDisplaySpeedKmh(elapsedS: number, topSpeedKmh = 415): number {
  return Math.min(topSpeedKmh, camaroInstantSpeedKmh(elapsedS))
}

/** Seconds of coast after a racer's ET, into the shutdown. */
export const SHUTDOWN_COAST_S = 1.9

/** 0–1 ease-out along the shutdown after `et`. */
export function shutdownCoast01(elapsedS: number, et: number): number {
  if (elapsedS <= et) return 0
  const u = Math.min(1, (elapsedS - et) / SHUTDOWN_COAST_S)
  return 1 - (1 - u) * (1 - u)
}

/** Trap speed decay after ET — chutes bite, HUD leaves 415 km/h behind. */
export function camaroCoastSpeedKmh(elapsedS: number, et: number, topSpeedKmh = 415): number {
  const trap = camaroDisplaySpeedKmh(Math.min(elapsedS, et), topSpeedKmh)
  return trap * (1 - shutdownCoast01(elapsedS, et) * 0.82)
}

export function camaroCoastSpeed01(elapsedS: number, et: number, topSpeedKmh = 415): number {
  if (topSpeedKmh <= 0) return 0
  return Math.min(1, Math.max(0, camaroCoastSpeedKmh(elapsedS, et, topSpeedKmh) / topSpeedKmh))
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
