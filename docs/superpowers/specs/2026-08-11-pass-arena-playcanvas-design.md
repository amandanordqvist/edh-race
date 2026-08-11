# Pass Arena (PlayCanvas) — Design Spec

**Date:** 2026-08-11  
**Status:** Locked in conversation (approach 1); awaiting user review of this doc  
**Pages:** Home teaser + new Pass Arena route  
**Engine:** PlayCanvas (`playcanvas` npm) inside Vite + React

## Goal

Replace the Home 2D lane simulator with a **hybrid**: compact teaser on Home, full cinematic 3D quarter-mile comparison on a dedicated page. Visitors should *feel* how absurd 5.74 s @ 415 km/h is versus F1 and a passenger jet — a signature feature with tyngd, not arcade neon.

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Experience | Cinematic pass (A) + light environment (tree, strip, restrained atmosphere) |
| Interaction | Stage → watch (no cockpit / reaction-time game) |
| Assets v1 | Stylized primitives + materials; Camaro as clear blue hero silhouette; simpler F1/jet |
| GLB upgrade | Optional later; not blocking v1 |
| Placement | Hybrid: Home teaser → own page |
| Routes | `/sv/passet` · `/en/pass` (`PageId: 'pass'`) |
| Nav | Secondary “Mer” (with Results / Team / Media) |
| Mobile | Full 3D everywhere; lower DPR, fewer lights, simpler materials |
| Audio | Richer: tree cues + motor/pass loop during race; mute control; unlock on user gesture |
| Home WebGL | None — still + copy + CTA only |
| Reduced motion | Skip cinematic camera scrub; jump to staged poses / instant finish board; no auto audio |

## Out of scope (v1)

- Reaction-time / “hit green” gameplay
- Full Santa Pod crowd / stadium set dressing
- Real licensed vehicle GLBs
- Physics simulation (Ammo)
- Partner PDF / timeslip PDF export
- Replacing Machine `CarTurntable` (stays frame-based)

---

## §1 Product & page structure

### Home teaser

- Replaces current `DragstripSimulator` slot in Home arc (after PerformanceStrip / story beats as today).
- Content: section title + short lead (reuse/adapt `simulator*` i18n) + one strong still (existing race/strip plate) + primary CTA → Pass Arena.
- No canvas, no PlayCanvas bundle on Home.

### Pass Arena page

- New page in site map; bilingual slugs above.
- Near full-bleed stage under site header; dark cinematic shell matching tokens.
- HUD overlay (HTML, not world-space text): status, clock, Stage / Race again, mute toggle.
- After finish: results list (Camaro / F1 / jet with ET + speed) + secondary link (Journey or Machine).
- Voice: educational comparison, underdog — times speak; no boastful chrome.

### Beat sequence

`idle` → `staging` → `amber` → `green` → `racing` → `finished`  
(Same phase model as today’s simulator; timings from `src/data/simulator.ts`.)

---

## §2 3D experience (scene)

### World

- Quarter-mile strip (402 m scaled into a readable PlayCanvas space — not 1:1 meters if that hurts framing; progress mapped so ET durations match real seconds).
- Christmas tree at start; finish line / traps at end.
- Atmosphere: dark asphalt, subtle edge fog or gradient sky, primary-blue rim on Camaro — **no** cyan/magenta racing neon, no glassmorphism HUD cards.

### Vehicles

| Id | Role | Look |
| --- | --- | --- |
| `camaro` | Hero | Larger/clearer silhouette, primary blue, slight presence (shadow / rim) |
| `f1` | Contrast | Smaller, silver/neutral |
| `jet` | Contrast | Elongated, muted; readable as airliner metaphor |

Motion: each racer translates along lane by its `et` with an ease that sells acceleration (`power2.in` equivalent). Clock HUD tracks race time.

### Camera

- Scripted cinematic: staging wide → tree insert → launch follow on Camaro → slight pull at traps → settle for results.
- Optional very light look-around while **idle only** (pointer drag yaw clamp); disabled during race so the pass stays directed.
- Mobile: same shots, shorter FOV tweaks / less aggressive moves if needed for comfort.

### Quality tiers

| Tier | When | Settings |
| --- | --- | --- |
| High | Desktop, fine pointer, no reduce-motion | Higher resolution scale, soft shadow optional |
| Low | Mobile / constrained GPU | Cap DPR (e.g. 1–1.5), no/soft shadows off, simpler materials, shorter particle/exhaust if any |

Detect via width + coarse pointer / memory hints; allow future manual toggle only if needed (not required v1).

---

## §3 Audio

- **Default:** muted visually indicated; first Stage (or explicit unmute) unlocks AudioContext after gesture.
- **Cues:** tree staging/amber ticks; green; launch whoosh into **motor/pass loop** while `racing`; soft cut or chute-ish release at finish.
- **Assets:** short licensed-or-original loops under `public/audio/pass/` (placeholders OK until final bed).
- **Respect:** mute toggle always available; `prefers-reduced-motion` does not force mute but skip auto-start of loop without Stage.
- Fail soft: missing files → silent race, HUD still works.

---

## §4 Architecture

```
HomePage
  └─ PassTeaser          # still + CTA (replaces DragstripSimulator)

PassPage
  └─ PassArena
       ├─ HUD (React): status, clock, CTAs, mute, results
       └─ PassCanvas (React wrapper)
            └─ PlayCanvas Application
                 ├─ scene build (strip, tree, racers, lights, camera)
                 ├─ race controller (phases ↔ data/simulator.ts)
                 └─ audio controller (gesture-gated)

src/data/simulator.ts    # shared ET / tree timings (unchanged contract)
src/lib/pass/            # engine helpers (createApp, quality, dispose)
```

### React ↔ PlayCanvas

- Mount canvas in `useEffect`; `app.start()`; destroy app + unload assets on unmount.
- Phase state owned by React (accessibility / HUD); PlayCanvas receives commands (`stage`, `reset`) and emits ticks (`clock`, `phase`, `finished`).
- Dynamic `import('playcanvas')` only from Pass page / PassCanvas so Home stays light.
- No inline imports inside functions beyond the lazy route/module boundary.

### Routing / i18n / nav

- Extend `PageId` + `SLUGS` + secondary nav + footer sitemap.
- Copy keys: teaser + arena status/actions (migrate from `home.simulator*`, keep Home teaser strings adjacent).

### Error handling

- WebGL unavailable / context lost: fallback panel with static comparison table (same ETs) + message; CTA still meaningful.
- Asset load failure: proceed with untextured primitives; log once.
- Always `app.destroy()` and remove resize listeners on leave.

### Performance

- Create app only on Pass page; pause/stop loop when tab hidden (`visibilitychange`).
- Cap pixel ratio on mobile; avoid post-process stacks in v1.
- Keep files focused: PassCanvas / scene / raceController / audio as separate modules (&lt;300 lines each where practical).

---

## §5 Accessibility & motion

- HUD controls are real buttons; status `aria-live="polite"`.
- Keyboard: Stage / Race again / Mute operable without pointer.
- `prefers-reduced-motion: reduce`: no cinematic camera path; optional instant positioning to finish order after Stage; tree can still step for comprehension or skip to results — prefer **fast-forward to results board** after one short staging flash so vestibular load stays low.
- Contrast: HUD text on scrim; bulbs remain decorative (`aria-hidden`) with status text carrying meaning.

---

## §6 Testing / acceptance

1. Home shows teaser only; network: no `playcanvas` chunk until Pass route.
2. `/sv/passet` and `/en/pass` load; Stage runs tree → race → results; Camaro wins with 5.74 s.
3. Mute works; unmute + Stage starts pass loop; leaving page stops audio.
4. Mobile: race completes without tab freeze; DPR capped.
5. Reduced-motion: no long camera chase; results reachable.
6. WebGL fail path shows static comparison.
7. EN/SV copy parity for teaser + HUD.

---

## File touch list (expected)

| Area | Files |
| --- | --- |
| Routes / paths | `src/lib/paths.ts`, router entry, `useNavItems.ts` |
| Pages | `PassPage.tsx`, `HomePage.tsx` |
| Components | `PassTeaser`, `PassArena`, `PassCanvas`, retire or slim `DragstripSimulator` |
| Data | `src/data/simulator.ts` (reuse) |
| i18n | `types.ts`, `sv.ts`, `en.ts` |
| Audio | `public/audio/pass/*` |
| Deps | `playcanvas` |

## Success criteria

- Feels like a **signature EDH feature**, not a toy HUD.
- Comparison insight lands emotionally in under one race.
- Home stays fast; Pass owns the weight.
- On-brand: dark, blue, restrained; underdog voice intact.
