import type { TimelineBookendId, TimelineId } from '../../data/timeline'

/** Prefixed because several timeline ids start with a digit. */
export function beatDomId(id: TimelineId): string {
  return `beat-${id}`
}

export function bookendDomId(id: TimelineBookendId): string {
  return id
}

/** Every row in the running timeslip resolves to a stable DOM id. */
export type TimeslipAnchorId = ReturnType<typeof beatDomId | typeof bookendDomId>
