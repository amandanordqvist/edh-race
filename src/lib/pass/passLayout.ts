import { QUARTER_METERS } from '../../data/simulator'

/** Near lane (+Z) faces the chase cam; far lane is the rival. */
export const LANE_NEAR_Z = 2.2
export const LANE_FAR_Z = -2.2

export const TRACK_LENGTH = 132
export const TRACK_WIDTH = 11.5

/** Map a real-world split (meters) onto the compressed strip. */
export function stripWorldX(meters: number): number {
  return (meters * TRACK_LENGTH) / QUARTER_METERS
}

export const STRIP_SPLITS = [
  { id: '60ft', label: "60'", meters: 18.29 },
  { id: '330ft', label: "330'", meters: 100.58 },
  { id: '660ft', label: '1/8', meters: 201.17 },
  { id: '1000ft', label: "1000'", meters: 304.8 },
  { id: '1320ft', label: "1320'", meters: 402.34 },
] as const

/** Low rail sits just outside the asphalt, inside the safety channel. */
export const RAIL_Z = TRACK_WIDTH / 2 + 0.3

export const CHRISTMAS_TREE_X = 5.4

/** Family wagon in the near channel, well down-strip so inspect stays clear. */
export const STREET_CAR_Z = 6.5
export const STREET_CAR_START_X = 52
/** Standing-start quarter for a stock wagon. Ease-in keeps it nearly still at 60′. */
export const STREET_CAR_ET = 16.4

/** Jet flies the far shoulder rather than rolling on the asphalt. */
export const JET_ALTITUDE = 4.8
export const JET_Z = LANE_FAR_Z - 2.4

/** Burnout box / staging yard behind the start line (negative X). */
export const STAGING_LENGTH = 22

/** Asphalt past the 1320' gantry — chute, coast, sand. */
export const SHUTDOWN_LENGTH = 44

/** Painted safety channel between racing surface and the concrete wall. */
export const CHANNEL_WIDTH = 1.55

export const BARRIER_Z = TRACK_WIDTH / 2 + CHANNEL_WIDTH + 0.35

/** Racing asphalt box — PlayCanvas boxes are centred, so the driving surface is the top face. */
export const TRACK_SURFACE_CENTER_Y = -0.22
export const TRACK_SURFACE_HEIGHT = 0.18
export const STRIP_TOP_Y = TRACK_SURFACE_CENTER_Y + TRACK_SURFACE_HEIGHT / 2
/** Sit tires into the asphalt so round GLB slicks meet the strip in a low chase cam. */
export const VEHICLE_GROUND_Y = STRIP_TOP_Y - 0.05
/** Family-wagon origin sits above the tire bottoms (wheel radius ~0.26 m). */
export const STREET_CAR_Y = VEHICLE_GROUND_Y - 0.02
