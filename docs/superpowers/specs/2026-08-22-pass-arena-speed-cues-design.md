# Pass Arena Speed Cues (Phase 1) — Design Spec

**Date:** 2026-08-22  
**Status:** Implemented (phase 1)  
**Parent:** `docs/superpowers/specs/2026-08-11-pass-arena-playcanvas-design.md`  
**Pages:** Pass Arena only (`/sv/passet`, `/en/pass`)

## Goal

Make 400 km/h readable in the 3D world. The chase camera must see nearby objects and asphalt detail smear past the Camaro — not a smooth grey slab with five distant posts.

Phase 1 is set dressing only: edge rail, asphalt noise, painted splits, staging cones, timing blocks. No new particles, audio, ghost cars, or post-processing.

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Visual language | C — strip-authentic base + restrained accents |
| Rail construction | One procedural mesh per side (beam + posts combined). Not cloned entities, not a custom shader, not GLB |
| Rail placement | Inner edge of the safety channel, ~0.3 m outside the asphalt, height ~0.55 m |
| Painted splits | Near lane only (`LANE_NEAR_Z`), canvas-textured quads |
| Split labels | `60'` · `330'` · `1/8` · `1000'` · `1320'` at the same scaled X as existing timing posts |
| Cones | Staging / water-box only, 6–8 on `high`, none on `low` |
| Timing blocks | One ~0.4 m foam cube per side at each of the five splits, in the channel |
| Speed streaks / bloom / audio | Unchanged |
| i18n | None — strip markings stay NHRA English feet, like a real track |

## Out of scope (later phases)

- Ghost cars (Volvo / Golf standing start)
- Passing the jet as a visible airborne body beside the strip
- Wind streaks / dust particles beyond the existing restrained `speedStreaks`
- Parallax backdrop layers
- Doppler / whoosh one-shots when passing poles
- Densifying the existing lighting poles or replacing the outer concrete wall
- Sponsor logos on any 3D surface

---

## §1 Edge rail

The existing `wall-foot` / `wall-top` at `BARRIER_Z` stay as the outer concrete wall. The new rail is closer, lower, and denser — that is what flickers in the periphery.

**Mesh.** `buildEdgeRail.ts` builds two renderables (near side, far side). Each mesh is a continuous low beam with vertical posts/seams baked in:

| Quality | Post spacing | Shadows |
| --- | --- | --- |
| `high` | 1.6 m | off |
| `low` | 2.8 m | off |

Shared matte concrete/metal material (same tone family as the outer wall, slightly darker so it reads as steel/concrete, not a second white wall). No emissive.

**Span.** From staging start (`-STAGING_LENGTH`) through shutdown, matching the existing wall length. Skip any post whose X is within 1.2 m of the Christmas tree or the finish gantry legs.

**Why not a tiled texture.** A decal on a long plane has no occlusion or lighting break as a post passes the camera. Why not one box per post: ~250 extra entities on a page that already runs the Camaro GLB on mobile `low`.

---

## §2 Asphalt noise and painted splits

### Surface grain

Keep `/models/pass/asphalt-rough.jpg`. Raise longitudinal frequency and contrast so the grain streaks along the pass (today’s tiling `22 × 3.2` plus a 0.22 diffuse multiply reads as flat charcoal). Exact tiling is a feel-check, but the direction is: more repeats along X, enough albedo contrast that motion blur has something to smear.

### Rubber

Replace the short, gappy slick segments in `buildStripSurface.ts` with long, broken longitudinal streaks in both lanes, covering staging through the traps. Gaps stay (prep is never a perfect stripe) but the eye should read one dark pair of tracks per lane, not a dotted line near the tree. `low` uses fewer, still full-length, streaks.

### Edge ticks

Short white dashes along the asphalt outer edge (not a continuous racing line), every ~2.2 m on `high` / ~4 m on `low`. They sit against the new rail so the two frequencies beat together.

### Painted numerals

Canvas texture on a thin quad, same pattern as the scoreboard (`createScoreboard` canvas → `pc.Texture`), but unlit worn paint:

- Condensed sans, off-white, no glow, gloss ≤ 0.2
- Quad ~3.2 m × 1.6 m, yawed to lie in XZ, y just above the rubber to avoid z-fight
- Centered on `LANE_NEAR_Z` at `worldAt(splitMeters)` using `TRACK_LENGTH / QUARTER_METERS` — identical mapping to `buildTrackMarkers.ts`
- If canvas/texture creation fails, skip numerals; ticks and rubber still build

New file: `buildStripMarkings.ts` (numerals, ticks, cones, foam blocks). Rubber/asphalt contrast stays in `buildStripSurface.ts`; if that file cannot absorb the rubber change without growing further past ~300 lines, extract the rubber loop into the markings module.

---

## §3 Staging cones and timing blocks

**Cones.** 8 orange PlayCanvas cones on `high` (extend `createPrimitive` with `'cone'`), in the staging yard and water-box shoulders — never on the racing line, never past x = 2 m. `low` draws zero cones.

**Foam blocks.** At each of the five splits, one 0.4 m cube per side in the safety channel, tight to the asphalt edge, matte off-white with a muted orange face toward the lane. Not in the center divider, not emissive. Present on both quality tiers (ten cubes total).

Existing photocell posts, boards, and the 1320' gantry in `buildTrackMarkers.ts` stay as they are.

---

## §4 Architecture

Static build, once, inside `buildPassEnvironment`. Call order is the diagram below so the rail sits on finished asphalt and markings can key off the same split X as the timing posts.

```
buildPassEnvironment
  buildStripSurface          ← asphalt contrast + continuous rubber
  buildShutdown
  existing walls / stands
  buildEdgeRail              ← new
  buildTrackMarkers          ← unchanged
  buildStripMarkings         ← new (numerals, ticks, cones, blocks)
  christmas tree / light poles
```

No runtime `update`. No changes to `raceController`, `cameraDirector`, `passEffects`, `audioController`, or i18n. `setSpeedFeel` / motion blur contracts stay as they are.

**Failure isolation.** Rail mesh failure logs a warning and skips the rail. Marking canvas failure skips numerals only.

---

## Acceptance

1. Follow-cam at mid-pass: the near-side rail posts strobe past the frame; the outer wall is still visible behind them.
2. Launch: `60'` then `330'` suck under the camera in the near lane; they read as paint, not HUD.
3. Inspect/staging: a handful of orange cones give scale; none appear down-track.
4. Foam blocks flash at the five splits without sitting in the car path.
5. `low` quality: sparser rail, no cones, same five numerals, no extra shadow casters.
6. No new neon, speed-line art, or audio. Existing streaks and bloom behave as today.

## Feel-check (cannot be proven from code)

Play one pass on `follow` at desktop `high`, then on a phone-width `low` viewport. If the rail feels like a picket fence or the numerals like waypoints, drop post density or shrink the quads — do not add emissive or extra particle streaks to “fix” it.
