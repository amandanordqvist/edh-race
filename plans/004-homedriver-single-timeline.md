# 004 — HomeDriver single scrub timeline

- **Status**: DONE
- **Commit**: 827f0b9
- **Severity**: LOW
- **Category**: Performance / Cohesion
- **Estimated scope**: 1 file (`HomeDriver.tsx`)

## Problem

HomeDriver creates three independent ScrollTriggers with nearly identical ranges and different scrub smoothing. Feel is fine; bookkeeping and refresh cost are worse than needed.

```tsx
/* src/components/home/HomeDriver.tsx:31-80 — current */
gsap.fromTo(mark, { xPercent: -3 }, {
  xPercent: 3,
  ease: 'none',
  scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
})
gsap.fromTo(img, { yPercent: 3 }, {
  yPercent: -3,
  ease: 'none',
  scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
})
gsap.fromTo(plate, { yPercent: -5 }, {
  yPercent: 5,
  ease: 'none',
  scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
})
```

## Target

One timeline, one ScrollTrigger, same amplitudes (do not exaggerate parallax):

```tsx
gsap
  .timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2, // single compromise smoothing
    },
  })
  .fromTo(mark, { xPercent: -3 }, { xPercent: 3 }, 0)
  .fromTo(img, { yPercent: 3 }, { yPercent: -3 }, 0)
  .fromTo(plate, { yPercent: -5 }, { yPercent: 5 }, 0)
```

- Keep reduced-motion early return unchanged.
- Keep `gsap.context` + revert cleanup.
- Do not change CSS layout, copy, or Reveal wrappers on media/copy.

## Repo conventions to follow

- Exemplar multi-tween single ST timeline: `src/components/home/Hero.tsx` (scroll exit timeline with several `.to(..., 0)`).
- Parallax amplitudes stay subtle (brand: återhållsamhet) — do not raise percents.

## Steps

1. Replace the three `fromTo`+ST blocks in `HomeDriver.tsx` with the single timeline above.
2. Null-check: if `mark` / `img` / `plate` missing, skip that tween (same as today).
3. No CSS changes.

## Boundaries

- Do NOT add new layers, blur, or stronger parallax.
- Do NOT remove Reveals on media/copy (entrance ≠ scrub).
- Do NOT touch other home sections.

## Verification

- **Mechanical**: `npm run build` passes.
- **Feel check**:
  - Scroll through HomeDriver — EDH mark drifts horizontally, portrait counters vertically, plate drifts opposite; depth feel ≈ before.
  - Reduced motion: no parallax.
  - ScrollTrigger.getAll() count on Home drops by ~2 vs pre-change (optional console check).
- **Done when**: one ST for the three layers; amplitudes unchanged; build green.
