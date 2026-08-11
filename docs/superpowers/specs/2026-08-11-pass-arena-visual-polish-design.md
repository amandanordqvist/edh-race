# Pass Arena Visual Polish (A+B) — Design Spec

**Date:** 2026-08-11  
**Status:** Approved in conversation (A craft + B cinematic set)  
**Parent:** `docs/superpowers/specs/2026-08-11-pass-arena-playcanvas-design.md`  
**Branch context:** `feature/pass-arena`

## Goal

Raise Pass Arena from “boxes on asphalt” to a restrained night-strip set: readable multi-part vehicle silhouettes, richer track/environment, and a timeslip-style finish HUD — still stylized primitives (no GLB).

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Scope | A (craft) + B (cinematic set) |
| Vehicles | Multi-part primitives (body + cabin/cockpit + wheels/wings) |
| GLB | Out of scope |
| Timeslip | Finish panel + larger race clock readout; data from `simulator.ts` only |
| Atmosphere | Darker night clearColor, blue fill, cheap sky/fog plane, guardrails, finish tower |
| Quality tiers | High: more props + soft shadows; Low: fewer props, no/soft shadows off |
| Motion / audio | Unchanged contracts from parent spec |

## Out of scope

- Licensed vehicle models, crowd, reaction gameplay, new audio bed, Home teaser redesign

## §1 Vehicles

Each racer is a parent `Entity` with child meshes so `resetRacers` / race motion still move one root:

| Id | Parts (min) | Look |
| --- | --- | --- |
| camaro | body, cabin/roof, nose cue, 4 wheel discs | Primary blue, slight emissive rim on high |
| f1 | low body, cockpit bulge, side pods (thin boxes) | Silver / neutral |
| jet | fuselage, two wings, optional tail | Elongated muted gray |

Preserve lane Z offsets and `trackLength` motion on root X.

## §2 Track & set

Add (quality-gated where noted):

- Start line stripe at x≈0  
- Dashed center / lane edge markers (high may use more dashes)  
- Low guardrail strips along track sides  
- Christmas tree: clearer pole + dual arms + bulbs (keep `setTreeLights` API)  
- Finish chequer (existing, tighten) + simple timing-tower block silhouette (high)  
- Sky/backdrop: dark gradient plane or large dark box behind finish (cheap)  
- Optional very subtle fog if PlayCanvas API allows without fighting TS types; else skip

Lighting: cooler key, primary-blue fill on high; clearColor near `#07090d`.

## §3 Timeslip HUD

**During race:** status + large mono clock (timeslip ET feel).

**On finished:** replace flat list chrome with a timeslip card:

- Header: “402 m” / quarter-mile label (i18n)  
- Rows: place · name · ET · speed (same `simulatorRacers` sort)  
- Camaro row emphasized (blue wash, not neon)  
- Journey CTA below  

Reuse `PassResultsList` structure or split `PassTimeslip` component; keep a11y (`aria-live` on status).

## §4 Files

| Area | Likely touch |
| --- | --- |
| Scene | `src/lib/pass/buildScene.ts` (split helpers if >300 lines: `vehicles.ts` / `environment.ts`) |
| HUD | `PassArena.tsx/css`, `PassFallback.tsx` or new `PassTimeslip.tsx` |
| i18n | `pass.timeslip*` labels (EN+SV) |
| Camera | light tweaks only if framing needs tower/tree |

## Acceptance

1. Vehicles readable as Camaro / F1 / jet at staging wide shot  
2. Strip shows start, lanes, rails, finish tower (high) without neon  
3. Finish HUD reads as timeslip; Camaro 5.74s first  
4. Low tier still completes race; Home still free of playcanvas chunk  
5. `npm run build` passes  
