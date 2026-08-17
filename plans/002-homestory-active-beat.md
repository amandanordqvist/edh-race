# 002 — HomeStory active-beat focus

- **Status**: DONE
- **Commit**: 827f0b9
- **Severity**: HIGH
- **Category**: Missed opportunities / Explanation
- **Estimated scope**: 1–2 files (`HomeStory.tsx`, optionally `HomeStory.css`)

## Problem

Desktop HomeStory pins and scrubs the horizontal track, but every beat stays equally “on.” It feels like a slideshow rail, not a cousin of the Journey timeslip cursor.

```tsx
/* src/components/home/HomeStory.tsx:51-71 — current scrub */
const tween = gsap.to(track, {
  x: () => -getTravel(),
  ease: 'none',
  scrollTrigger: {
    trigger: pin,
    start: () => { /* header-aware */ },
    end: () => `+=${getTravel() * 1.15}`,
    pin: true,
    scrub: 0.65,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      gsap.set(progress, { scaleX: self.progress })
    },
  },
})
```

Mobile (`max-width: 899px`) correctly uses native snap scroll — do **not** add pin there.

## Target

On the desktop matchMedia branch only (`(min-width: 900px) and (prefers-reduced-motion: no-preference)`):

While scrubbing, emphasize the beat whose center is closest to the viewport center of `.home-story__viewport`.

Exact motion values:

| State | opacity | scale |
| --- | --- | --- |
| Active beat | `1` | `1` |
| Inactive beats | `0.55` | `0.96` |

- Animate **only** `opacity` and `scale` (transform) on `.home-story__beat`.
- Ease for focus tweens: none on the scrub path — use `gsap.set` or a very short `gsap.to` with `duration: 0.15`, `ease: 'power2.out'`, overwrite `true` so rapid scrub stays interruptible.
- Prefer computing active index in `onUpdate` from beat getBoundingClientRect vs viewport rect (not solely from `self.progress * (n-1)`), so it stays correct if gaps/widths differ.
- Initial state before first update: first beat active, others dimmed (`gsap.set`).
- Progress bar behaviour unchanged (`scaleX: self.progress`).
- Reduced motion / mobile: no focus dimming required; beats stay full opacity/scale (CSS defaults).

Optional CSS (only if needed for GPU hint):

```css
.home-story__beat {
  transform-origin: center center;
  will-change: transform, opacity; /* only inside the desktop pin branch via a class toggled in JS, or leave will-change off if scrub is light */
}
```

Prefer **no permanent will-change** on all beats; set via GSAP or skip.

## Repo conventions to follow

- Exemplar pin+scrub + matchMedia cleanup: current `HomeStory.tsx` itself.
- Journey cursor feel reference (do not import Journey code): `src/components/journey/useJourneyScroll.ts` — one focus, surrounding context quieter.
- Brand: Journey/HomeStory is a career arc, not filter chips or chart replay — focus motion only, no new UI chrome.

## Steps

1. In `HomeStory.tsx` desktop `mm.add` callback, after creating `track` tween, query `const beats = gsap.utils.toArray<HTMLElement>('.home-story__beat', track)`.
2. `gsap.set(beats, { opacity: 0.55, scale: 0.96 })` then `gsap.set(beats[0], { opacity: 1, scale: 1 })`.
3. Extend `onUpdate` to:
   - keep progress `scaleX`
   - find active index by min distance between beat centerX and viewport centerX
   - if index changed (store `let active = 0`), tween previous → inactive values and next → active values with `duration: 0.15`, `ease: 'power2.out'`, `overwrite: 'auto'`
4. In the matchMedia cleanup, `gsap.set(beats, { clearProps: 'opacity,transform' })` alongside existing track/progress clearProps.
5. Do not change TEASER_IDS, copy, or mobile snap CSS beyond what’s required for transform-origin.

## Boundaries

- Do NOT add scroll-dots, markers UI, or filter chips.
- Do NOT pin on mobile / reduced-motion.
- Do NOT animate blur, filter, or width.
- Do NOT change Journey page (`useJourneyScroll.ts`).
- Do NOT alter scrub amount (`0.65`) or pin start/end formulas unless focus math requires a tiny tweak — prefer leaving travel math alone.

## Verification

- **Mechanical**: `npm run build` passes.
- **Feel check** (desktop ≥900px, reduced-motion off):
  - Pin HomeStory; scrub slowly — exactly one beat feels primary; neighbours sit back (dimmer + slightly smaller).
  - Scrub fast both directions — focus retargets without flicker restart from zero.
  - Progress hairline still tracks 0→1.
  - Resize below 900px: native horizontal rail, all beats full strength, no pin.
  - `prefers-reduced-motion: reduce`: no pin, no dimming animation; content readable.
- **Done when**: active-beat focus works on desktop scrub only; cleanup clears transforms; build green.
