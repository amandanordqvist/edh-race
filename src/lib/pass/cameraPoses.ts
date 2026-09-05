export type CameraPose = {
  position: [number, number, number]
  look: [number, number, number]
  fov: number
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function mixPose(a: CameraPose, b: CameraPose, t: number): CameraPose {
  return {
    position: [
      lerp(a.position[0], b.position[0], t),
      lerp(a.position[1], b.position[1], t),
      lerp(a.position[2], b.position[2], t),
    ],
    look: [
      lerp(a.look[0], b.look[0], t),
      lerp(a.look[1], b.look[1], t),
      lerp(a.look[2], b.look[2], t),
    ],
    fov: lerp(a.fov, b.fov, t),
  }
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / Math.max(0.0001, edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Low rear 3/4 — car fills the frame, tree reads in the background. */
export function inspectPose(
  heroX: number,
  heroZ: number,
  yawDeg: number,
  pitchDeg: number,
  radius: number,
  lookY: number,
): CameraPose {
  const yaw = (yawDeg * Math.PI) / 180
  const pitch = (pitchDeg * Math.PI) / 180
  const cosPitch = Math.cos(pitch)

  return {
    position: [
      heroX + Math.sin(yaw) * cosPitch * radius,
      lookY + Math.sin(pitch) * radius,
      heroZ + Math.cos(yaw) * cosPitch * radius,
    ],
    look: [heroX + 0.25, lookY + 0.04, heroZ],
    fov: 38,
  }
}

/** Staging: low rear 3/4, tree visible past the body — not scraping the asphalt. */
export function treeInsertPose(heroX: number, heroZ: number): CameraPose {
  return {
    position: [heroX - 5.4, 0.72, heroZ + 0.82],
    look: [heroX + 3.8, 0.58, heroZ + 0.04],
    fov: 34,
  }
}

/** Launch: close chase, FOV opens as the car leaves. */
export function launchPose(heroX: number, heroZ: number, accel01: number): CameraPose {
  return {
    position: [heroX - 4.6, 0.78, heroZ + 0.86],
    look: [heroX + 4.4, 0.56, heroZ + 0.04],
    fov: 40 + accel01 * 6,
  }
}

/** Mid-strip: side track, car is the silhouette. */
export function sideTrackPose(heroX: number, heroZ: number): CameraPose {
  return {
    position: [heroX - 1.2, 1.05, heroZ + 4.1],
    look: [heroX + 1.4, 0.52, heroZ],
    fov: 44,
  }
}

/** High speed: chase behind the car, high enough that the strip stays readable. */
export function blastPose(heroX: number, heroZ: number, speed01: number): CameraPose {
  return {
    position: [heroX - 5.6, 0.92, heroZ + 0.88],
    look: [heroX + 6.2, 0.58, heroZ + 0.06],
    fov: 42 + speed01 * 10,
  }
}

export function heroFinishPose(heroX: number, heroZ: number): CameraPose {
  return {
    position: [heroX - 4.4, 0.86, heroZ + 0.72],
    look: [heroX + 5.2, 0.64, heroZ + 0.08],
    fov: 34,
  }
}

export function finishSettlePose(heroX: number, heroZ: number): CameraPose {
  return {
    position: [heroX - 7.2, 1.45, heroZ + 5.6],
    look: [heroX + 1.8, 0.72, heroZ - 0.15],
    fov: 38,
  }
}

export function cockpitPose(
  heroX: number,
  heroZ: number,
  speed01: number,
  accel01 = 0,
): CameraPose {
  return {
    position: [heroX + 1.35, 1.25 + speed01 * 0.05, heroZ],
    look: [heroX + 32, 0.95 + speed01 * 0.12, heroZ],
    fov: 68 + speed01 * 10 + accel01 * 6,
  }
}

export function overviewPose(trackLength: number): CameraPose {
  return {
    position: [trackLength * 0.1, 14, 18],
    look: [1.6, 0.7, 0],
    fov: 46,
  }
}

/**
 * Directed broadcast cameras for the reconstruction.
 * Cuts are blended over short progress windows so the car never leaves frame.
 */
export function directedRacePose(
  heroX: number,
  heroZ: number,
  progress01: number,
  speed01: number,
  accel01: number,
  chute01: number,
): CameraPose {
  const start = treeInsertPose(heroX, heroZ)
  const launch = launchPose(heroX, heroZ, accel01)
  const side = sideTrackPose(heroX, heroZ)
  const blast = blastPose(heroX, heroZ, speed01)
  const finish = heroFinishPose(heroX, heroZ)
  const settle = finishSettlePose(heroX, heroZ)

  if (chute01 > 0.12) {
    return mixPose(finish, settle, smoothstep(0.12, 0.85, chute01))
  }
  if (progress01 < 0.07) {
    return mixPose(start, launch, smoothstep(0, 0.07, progress01))
  }
  if (progress01 < 0.2) {
    return mixPose(launch, side, smoothstep(0.07, 0.2, progress01))
  }
  if (progress01 < 0.48) {
    return mixPose(side, blast, smoothstep(0.2, 0.48, progress01))
  }
  if (progress01 < 0.9) {
    return blast
  }
  return mixPose(blast, finish, smoothstep(0.9, 1, progress01))
}
