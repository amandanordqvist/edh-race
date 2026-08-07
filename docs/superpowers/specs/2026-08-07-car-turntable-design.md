# Car Turntable Hero — Design Spec

**Date:** 2026-08-07  
**Status:** Approved in conversation; awaiting final user review of this doc  
**Page:** Machine (`/maskinen` / machine route)  
**Approach:** Frame-based 360° turntable (not WebGL / Three.js)

## Goal

Replace the static Camaro hero on the Machine page with an interactive 360° spin built from the 18 cutout PNGs (renamed to `public/images/images-car/`). The effect should feel like inspecting a 3D model while staying on-brand (dark cinematic, primary blue accents, performant, intentional motion).

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Placement | Machine page hero |
| Static hero | Fully replaced by turntable |
| Technique | Frame turntable (swap image sources by drag) |
| New deps | None |
| Folder rename | `images car` → `images-car` |

## UX

- **Pointer:** Horizontal drag / swipe advances frames. Sensitivity: ~desktop 12–16 px per frame; mobile slightly higher so it does not feel twitchy.
- **Keyboard:** Left/Right arrows change frame when the turntable (or its focusable control) is focused.
- **Auto-rotate:** Slow continuous loop after enough frames are ready. Pauses on pointer down / focus / keyboard use; resumes after a short idle (e.g. 2–3 s) unless `prefers-reduced-motion: reduce`.
- **Reduced motion:** No auto-rotate; no decorative hover scale. Drag and keyboard still work.
- **Hint:** Bilingual microcopy (“Dra för att snurra” / “Drag to spin”) below the stage (same typographic slot as today’s credit line); hides after first intentional interaction.
- **Visual shell:** Keep existing hero frame language — border, radius, deep shadow, subtle wash — but use `object-fit: contain` on black so cutouts are not cropped.
- **Caption:** Drop the Patrik Jacobsson / racebilder.nu credit for this hero — those cutouts are a different asset set. Hint line occupies that slot.

## Architecture

```
MachinePage
  └─ CarTurntable
       ├─ stage (pointer + keyboard handlers)
       ├─ visible <img> (current frame)
       ├─ offscreen preload via `new Image()` / neighbor URLs
       └─ hint (visible; no live-region chatter)
```

### Files

| Path | Change |
| --- | --- |
| `src/components/machine/CarTurntable.tsx` | New component |
| `src/components/machine/CarTurntable.css` | New styles |
| `src/data/machine.ts` | Export `carTurntableFrames: string[]` (ordered 1…18) |
| `src/pages/MachinePage.tsx` | Swap hero `<img>` for `<CarTurntable />` |
| `src/pages/MachinePage.css` | Adjust hero rules for turntable (contain, no zoom-on-hover of photo) |
| `src/i18n/{en,sv,types}.ts` | `turntableHint`, `turntableLabel` (aria) |
| `public/images/images-car/*` | Renamed from `images car` |

### Data

```ts
export const carTurntableFrames = Array.from(
  { length: 18 },
  (_, i) => `/images/images-car/${i + 1}.png`,
)
```

Frame order is numeric `1.png` … `18.png` as on disk. If visual rotation direction feels wrong in QA, reverse the array or invert delta once — do not renumber assets.

## Interaction details

- Track pointer via `pointerdown` / `pointermove` / `pointerup` with `setPointerCapture`.
- Accumulate horizontal delta; each threshold step increments/decrements frame index with wrap-around (`mod 18`).
- Require `|dx| > |dy|` before claiming the gesture so vertical page scroll still works on mobile.
- Use a single visible image element; update `src` (or use two stacked images for crossfade only if flicker appears — default is instant swap for crisp “mechanical” feel).

## Performance

- Initial paint: frame 1 with `loading="eager"` / high fetch priority.
- Preload ±2 neighbors of the current frame immediately.
- Background: queue remaining frames with `requestIdleCallback` (fallback: staggered `setTimeout`) after first interaction or after first auto-rotate tick.
- Do not start auto-rotate until at least ~4–6 frames (including current) have loaded, or after a max wait with still image.
- Out of scope for this change: WebP/AVIF conversion and CDN image resizing (follow-up if LCP suffers).

## Accessibility

- Region/`figure` with `aria-label` from i18n (`turntableLabel`).
- Focusable control (`tabIndex={0}` or native button wrapper for the stage).
- No `aria-live` frame announcements.
- Respect `prefers-reduced-motion`.

## Error handling

- If a frame URL fails to load, skip to nearest successfully loaded neighbor and continue.
- Missing preload must never block interaction on already-loaded frames.

## Testing (manual)

- [ ] Desktop drag feels smooth through a full revolution
- [ ] Mobile swipe does not fight vertical scroll
- [ ] Auto-rotate pauses on interaction and resumes
- [ ] Reduced-motion: no auto-rotate
- [ ] Keyboard ←/→ works when focused
- [ ] EN/SV hint copy switches with locale
- [ ] Machine page LCP acceptable on a mid phone (spot-check Network)

## Out of scope

- Three.js / R3F / CSS 3D carousel cylinder
- Replacing InteractiveChassis
- Compressing/converting the 18 source PNGs
- Using the turntable on Home or Media pages
