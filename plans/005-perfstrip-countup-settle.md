# 005 — PerformanceStrip count-up after settle

- **Status**: DONE
- **Commit**: 827f0b9
- **Severity**: MEDIUM
- **Category**: Easing & duration / Cohesion
- **Estimated scope**: 1–2 files (`PerformanceStrip.tsx`; assumes plan 001 `pace="launch"` on board)

## Problem

Stat cells Reveal-in while numbers count from 0 at the same ScrollTrigger moment. The timeslip values (the brand’s “let times speak”) fight the entrance instead of landing after the board settles.

```tsx
/* src/components/home/PerformanceStrip.tsx:51-70 — current */
gsap.fromTo(
  state,
  { n: 0 },
  {
    n: parsed.num,
    duration: 1.15,
    delay: index * 0.06,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: board,
      start: 'top 80%',
      once: true,
    },
    onUpdate: () => { /* write textContent */ },
  },
)
```

Board Reveal (after plan 001): `pace="launch"` → duration `0.6`, `delay={0.08}`, `stagger={0.08}`.

## Target

Count-up starts only after the board entrance has largely settled.

Exact values:

| Property | Value |
| --- | --- |
| ST trigger | `board` (unchanged) |
| ST start | `top 86%` (align with launch pace start from plan 001; if 001 not merged yet use `top 86%` anyway) |
| ST once | `true` |
| Base delay before first number | `0.55` seconds |
| Per-index stagger | `0.06` (unchanged) |
| Count duration | `0.9` |
| Ease | `power2.out` |

So first value starts at `0.55s`, last of four at `0.55 + 0.18 = 0.73s` into the trigger — after launch cells (~0.6s + stagger) have arrived.

Reduced motion: keep early `return` (no count-up; final numbers already in DOM from render).

Do not animate the number with blur or scale — textContent tick only.

## Repo conventions to follow

- Locale decimal separator logic stays as-is (`decimalSep`).
- `parseStat` unchanged.
- After plan 001, board Reveal should use `pace="launch"`; this plan may apply that if 001 isn’t done yet (include `pace="launch"` on board + intro when editing this file).

## Steps

1. Ensure board + intro Reveals use `pace="launch"` (no-op if 001 already did it).
2. Change count-up `delay` to `0.55 + index * 0.06`, `duration` to `0.9`, ST `start` to `'top 86%'`.
3. Leave label/code markup alone.

## Boundaries

- Do NOT pin the strip.
- Do NOT replace numbers with canvas/WebGL.
- Do NOT add everyday-anchor comparison cards (brand reject on Journey; don’t sneak onto Home stats).
- Do NOT count when `prefers-reduced-motion: reduce`.

## Verification

- **Mechanical**: `npm run build` passes.
- **Feel check**:
  - Scroll into stats: cells appear first; then values tick into 5.xxx / speed figures.
  - Slow-mo Animations panel: count-up does not start at the same frame as opacity 0→1 on cells.
  - Reduced motion: final values visible, no ticking.
  - SV locale: comma decimals still correct after tick.
- **Done when**: delays/duration/start match table; launch pace present on board Reveal; build green.
