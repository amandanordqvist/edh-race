# 001 — Reveal paces + kill refresh thrash

- **Status**: DONE
- **Commit**: 827f0b9
- **Severity**: HIGH
- **Category**: Cohesion & tokens / Performance
- **Estimated scope**: 2 core files + ~6 home call-site tweaks

## Problem

Almost every home section uses the same `Reveal` entrance (`y: 48`, `duration: 0.85`, `power3.out`, `start: 'top 88%'`). The page reads as a stack of identical fades instead of one drag-pass (staging → launch → pass → chutes).

Additionally, every `Reveal` mount calls `ScrollTrigger.refresh()`, which thrash-refreshes on a page with many Reveals.

```tsx
/* src/components/ui/Reveal.tsx:53-67 — current */
gsap.from(targets, {
  ...fromVars,
  duration: variant === 'media' ? 1.05 : 0.85,
  delay,
  stagger: stagger ?? 0,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: el,
    start: 'top 88%',
    once: true,
  },
})
// …
ScrollTrigger.refresh()
```

## Target

1. Add a `pace` prop with three presets (plus existing `variant: 'media'` behaviour). Defaults keep today’s rise feel so non-home call sites stay stable.

| pace | y | duration | ease | start | Use on Home |
| --- | --- | --- | --- | --- | --- |
| `launch` | 24 | 0.6 | `power3.out` | `top 86%` | PerformanceStrip intro + board |
| `rise` (default) | 40 | 0.85 | `power3.out` | `top 88%` | Machine, Driver, Team, Story, NextRace |
| `settle` | 20 | 0.7 | `power2.out` | `top 90%` | SponsorStrip |

- `variant: 'media'` still forces media from-vars (`opacity: 0, scale: 1.06, y: y * 0.35`) and duration `1.05` unless `pace === 'launch'` then duration `0.75`.
- Explicit `y` / `delay` / `stagger` props still override pace defaults for `y`/`delay`/`stagger`.
- **Remove** the `ScrollTrigger.refresh()` call from `Reveal`. Do not replace it inside Reveal. `useGSAP` + existing page-level refreshes (Hero, etc.) are enough; if a layout shift appears, fix at the page/section level, not per Reveal.

Exact Reveal API after change:

```tsx
type RevealPace = 'launch' | 'rise' | 'settle'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  stagger?: number
  variant?: 'rise' | 'media'
  pace?: RevealPace
  as?: 'div' | 'li' | 'article' | 'section' | 'figure' | 'ul'
  style?: CSSProperties
}
```

Pace resolution (pseudo):

```ts
const PACE = {
  launch: { y: 24, duration: 0.6, ease: 'power3.out', start: 'top 86%' },
  rise: { y: 40, duration: 0.85, ease: 'power3.out', start: 'top 88%' },
  settle: { y: 20, duration: 0.7, ease: 'power2.out', start: 'top 90%' },
} as const

const paceKey = pace ?? 'rise'
const preset = PACE[paceKey]
const resolvedY = y ?? preset.y
// duration: if variant==='media' → pace==='launch' ? 0.75 : 1.05 ; else preset.duration
```

Home call-site mapping (only change `pace` / tighten `y` where noted — do not restyle):

| File | Change |
| --- | --- |
| `PerformanceStrip.tsx` | intro + board → `pace="launch"`; board keep `stagger={0.08}` but drop explicit `y={28}` so launch y=24 applies (or set `y={24}`) |
| `SponsorStrip.tsx` | intro + grid → `pace="settle"`; grid keep stagger, drop or lower `y` to settle default |
| `PassTeaser.tsx` | leave for plan 003 (or temporarily `pace="rise"` — no new scrub here) |
| Others | leave default `rise` unless they already pass a custom `y` (keep those `y` values) |

## Repo conventions to follow

- Motion tokens live in `src/styles/tokens.css` (`--ease-out`, `--duration-*`). GSAP uses string easings (`power3.out`) matching existing Reveal/Hero — do **not** invent new CSS tokens for this plan.
- Exemplar for scoped GSAP + reduced motion: `src/components/ui/Reveal.tsx` itself and `src/components/home/Hero.tsx` (`prefers-reduced-motion` early return + `clearProps`).
- Imports stay at top of file (no inline imports).
- Keep files under ~200–300 lines; Reveal stays one module.

## Steps

1. Edit `src/components/ui/Reveal.tsx`: add `RevealPace`, `pace?: RevealPace` (default behaviour = current `rise` numbers with default `y` changing from hard-coded `48` to pace default `40` when `y` omitted). Update the `gsap.from` to use resolved duration/ease/start. Remove `ScrollTrigger.refresh()`.
2. Update `src/components/home/PerformanceStrip.tsx` Reveals to `pace="launch"`.
3. Update `src/components/home/SponsorStrip.tsx` Reveals to `pace="settle"`.
4. Grep for other `Reveal` usages outside home — leave them unchanged (they get the new default `y: 40` when omitting `y`; if any relied on default `48` without passing `y`, that is intentional tightening — verify Media/Bento if they use Reveal).
5. Do not touch Hero, HomeStory pin logic, or Pass Arena.

## Boundaries

- Do NOT add new dependencies.
- Do NOT add blur, width/height animation, or scroll-dots.
- Do NOT implement PassTeaser scrub (plan 003) or HomeStory beat focus (plan 002) here.
- Do NOT reintroduce `ScrollTrigger.refresh()` inside Reveal.
- If `Reveal` default `y` change from 48→40 would break a non-home page that omitted `y`, either pass explicit `y={48}` at that call site or accept the slight tighten — prefer accepting it (brand: återhållsamhet).

## Verification

- **Mechanical**: `npm run build` (runs `tsc -b && vite build`) must pass; `npm run lint` clean on touched files.
- **Feel check**:
  - Load `/sv` or `/en`. Scroll past PerformanceStrip: cells should arrive **snappier** than Machine/Driver below.
  - Sponsor logos near footer: quieter, shorter travel than mid-page rises.
  - Open DevTools Performance on cold load of Home: fewer long ScrollTrigger.refresh spikes than before (qualitative).
  - Toggle `prefers-reduced-motion: reduce` — Reveals snap visible, no throw.
- **Done when**: `pace` exists; home launch/settle applied; no `ScrollTrigger.refresh()` in `Reveal.tsx`; build green.
