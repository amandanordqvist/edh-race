# Pass Arena Speed Cues (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add near-camera speed references to Pass Arena — edge rail, asphalt grain, painted splits, staging cones, timing blocks.

**Architecture:** Static set dressing in `buildPassEnvironment`. One procedural rail mesh per side. Canvas-textured numeral quads. No runtime updates, no audio/VFX/i18n.

**Tech Stack:** PlayCanvas 2.21 (`Mesh` / `MeshInstance` as in `createScoreboard.ts`), existing `createPrimitive` / `createMaterial`.

**Spec:** `docs/superpowers/specs/2026-08-22-pass-arena-speed-cues-design.md`

## Global Constraints

- No neon, no custom shader, no GLB, no cloned-per-post entities
- `high` / `low` quality gating as specified
- Files stay under ~300 lines; extract rather than grow `buildStripSurface.ts`
- Do not touch `raceController`, `cameraDirector`, `passEffects`, `audioController`, i18n
- Bump `PASS_SCENE_REVISION` so the mounted canvas rebuilds

## File map

| File | Role |
| --- | --- |
| `src/lib/pass/passLayout.ts` | `stripWorldX`, `STRIP_SPLITS`, `RAIL_Z`, `CHRISTMAS_TREE_X` |
| `src/lib/pass/scenePrimitives.ts` | Add `'cone'` to primitive types |
| `src/lib/pass/buildEdgeRail.ts` | One combined mesh per side |
| `src/lib/pass/buildStripMarkings.ts` | Numerals, edge ticks, cones, foam blocks |
| `src/lib/pass/buildStripSurface.ts` | Stronger asphalt tiling + continuous rubber |
| `src/lib/pass/buildTrackMarkers.ts` | Use shared `stripWorldX` / `STRIP_SPLITS` (visual unchanged) |
| `src/lib/pass/buildChristmasTree.ts` | Use `CHRISTMAS_TREE_X` |
| `src/lib/pass/buildEnvironment.ts` | Call rail then markers then markings |
| `src/lib/pass/passRevision.ts` | Bump revision |

---

### Task 1: Shared layout + cone primitive

- [ ] Add `stripWorldX`, `STRIP_SPLITS`, `RAIL_Z`, `CHRISTMAS_TREE_X` to `passLayout.ts`
- [ ] Extend `createPrimitive` with `'cone'`
- [ ] Point tree + track markers at the shared constants
- [ ] `npx tsc -b --pretty false`

### Task 2: Edge rail mesh

- [ ] Create `buildEdgeRail.ts` — beam + posts in one `pc.Mesh` per side, skip posts within 1.2 m of tree X and `TRACK_LENGTH`
- [ ] `high` spacing 1.6 m, `low` 2.8 m, no shadows
- [ ] Wire into `buildPassEnvironment` after walls, before track markers; warn + skip on failure

### Task 3: Asphalt grain + rubber

- [ ] Raise asphalt-rough tiling/contrast in `buildStripSurface.ts`
- [ ] Replace short slick segments with long broken streaks covering staging→traps; more transverse seams

### Task 4: Markings, cones, foam blocks

- [ ] Create `buildStripMarkings.ts` (canvas numerals in near lane, edge ticks, 8 staging cones on `high`, 10 foam blocks)
- [ ] Call after `buildTrackMarkers`; skip numerals only if canvas/texture fails
- [ ] Bump `PASS_SCENE_REVISION`
- [ ] `npm run build`

### Task 5: Feel-check

- [ ] Follow-cam: rail strobes; `60'` / `330'` suck under the car; cones only in staging; no neon
