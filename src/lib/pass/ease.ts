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

const FT_S_TO_KMH = (QUARTER_METERS / QUARTER_FEET) * 3.6

type DistanceKnot = {
  et: number
  feet: number
  dFeetDt: number
}

/**
 * Monotonic cubic (PCHIP / Fritsch–Carlson) through the timeslip marks.
 * Linear interpolation between splits holds a constant average speed in each
 * interval, then jumps — that reads as gear shifts. PCHIP hits every mark
 * exactly with a continuous speed that only rises.
 */
function pchipKnots(splits: readonly { feet: number; et: number }[]): DistanceKnot[] {
  const n = splits.length
  if (n < 2) return []

  const h: number[] = []
  const delta: number[] = []
  for (let i = 0; i < n - 1; i += 1) {
    const prev = splits[i]
    const next = splits[i + 1]
    const dt = next.et - prev.et
    h.push(dt)
    delta.push(dt <= 0 ? 0 : (next.feet - prev.feet) / dt)
  }

  const slopes = new Array<number>(n).fill(0)
  for (let i = 1; i < n - 1; i += 1) {
    const left = delta[i - 1]
    const right = delta[i]
    const hLeft = h[i - 1]
    const hRight = h[i]
    if (left <= 0 || right <= 0) {
      slopes[i] = 0
    } else {
      const w1 = 2 * hRight + hLeft
      const w2 = hRight + 2 * hLeft
      slopes[i] = (w1 + w2) / (w1 / left + w2 / right)
    }
  }

  // Standing start — zero velocity at green, not a one-sided launch jump.
  slopes[0] = 0
  // Last 66' average is the official trap; end on that slope.
  slopes[n - 1] = delta[n - 2] ?? 0

  return splits.map((split, i) => ({
    et: split.et,
    feet: split.feet,
    dFeetDt: slopes[i] ?? 0,
  }))
}

function hermiteFeet(prev: DistanceKnot, next: DistanceKnot, elapsedS: number): number {
  const h = next.et - prev.et
  const u = h <= 0 ? 1 : (elapsedS - prev.et) / h
  const u2 = u * u
  const u3 = u2 * u
  return (
    (2 * u3 - 3 * u2 + 1) * prev.feet +
    (u3 - 2 * u2 + u) * h * prev.dFeetDt +
    (-2 * u3 + 3 * u2) * next.feet +
    (u3 - u2) * h * next.dFeetDt
  )
}

function hermiteFeetPerSec(prev: DistanceKnot, next: DistanceKnot, elapsedS: number): number {
  const h = next.et - prev.et
  if (h <= 0) return next.dFeetDt
  const u = (elapsedS - prev.et) / h
  const u2 = u * u
  const dsdu =
    (6 * u2 - 6 * u) * prev.feet +
    (3 * u2 - 4 * u + 1) * h * prev.dFeetDt +
    (-6 * u2 + 6 * u) * next.feet +
    (3 * u2 - 2 * u) * h * next.dFeetDt
  return dsdu / h
}

function sampleKnots(
  elapsedS: number,
  knots: DistanceKnot[],
): { prev: DistanceKnot; next: DistanceKnot } | null {
  const first = knots[0]
  const last = knots[knots.length - 1]
  if (!first || !last) return null
  if (elapsedS <= first.et) return { prev: first, next: knots[1] ?? first }
  if (elapsedS >= last.et) return { prev: knots[knots.length - 2] ?? last, next: last }

  for (let i = 1; i < knots.length; i += 1) {
    const prev = knots[i - 1]
    const next = knots[i]
    if (elapsedS <= next.et) return { prev, next }
  }
  return { prev: knots[knots.length - 2] ?? last, next: last }
}

const camaroKnots = pchipKnots(camaroDistanceSplits)

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
  const last = camaroKnots[camaroKnots.length - 1]
  if (!last) return 0
  if (elapsedS <= 0) return 0
  if (elapsedS >= last.et) return 1

  const sample = sampleKnots(elapsedS, camaroKnots)
  if (!sample) return 0
  return Math.min(1, Math.max(0, hermiteFeet(sample.prev, sample.next, elapsedS) / QUARTER_FEET))
}

/**
 * Instantaneous speed in km/h from the same cubic as the car's motion,
 * so HUD and chase camera follow one continuous pass — not stepped gears.
 */
export function camaroInstantSpeedKmh(elapsedS: number): number {
  if (elapsedS <= 0) return 0
  const last = camaroKnots[camaroKnots.length - 1]
  if (!last) return 0

  const sample = sampleKnots(elapsedS, camaroKnots)
  if (!sample) return 0
  const t = Math.min(last.et, elapsedS)
  const ftPerSec = hermiteFeetPerSec(sample.prev, sample.next, t)
  return Math.max(0, ftPerSec * FT_S_TO_KMH)
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
