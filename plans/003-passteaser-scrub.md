# 003 — PassTeaser scrub tease

- **Status**: DONE
- **Commit**: 827f0b9
- **Severity**: MEDIUM
- **Category**: Missed opportunities / Delight
- **Estimated scope**: 2 files (`PassTeaser.tsx`, light CSS if needed)

## Problem

PassTeaser is the Home bridge to Pass Arena, but it uses the same generic `Reveal` fade as Machine/Team. The delight budget for this rare moment is unused — and brand forbids WebGL on Home, so motion must stay DOM/GSAP.

```tsx
/* src/components/home/PassTeaser.tsx:17-44 — current */
<Reveal className="pass-teaser__copy" y={32}>
  …
</Reveal>
<Reveal className="pass-teaser__media" as="figure" delay={0.08} y={28} variant="media">
  …
</Reveal>
```

## Target

Replace the two Reveals with a section-scoped `useGSAP` + ScrollTrigger scrub (marketing explanatory motion — longer scrub OK).

Exact recipe:

```tsx
// prefers-reduced-motion: set opacity 1, clear transforms, return
// else:
gsap.set(copy, { opacity: 0, y: 28 })
gsap.set(media, { opacity: 0, scale: 1.05 })

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: frame, // .pass-teaser__frame
    start: 'top 78%',
    end: 'top 28%',
    scrub: 0.8,
    once: false, // scrub reverses on scroll up — intentional spatial continuity
  },
})

tl.to(media, { opacity: 1, scale: 1, ease: 'none' }, 0)
  .to(copy, { opacity: 1, y: 0, ease: 'none' }, 0.15) // slight lag behind media
```

- Properties: `opacity`, `y` (transform), `scale` only.
- No pin.
- No blur.
- Reduced motion: static final state, no scrub.
- Keep existing markup structure (`frame` / `copy` / `media` / image / CTA); only swap Reveal wrappers for plain elements + refs.
- Hover on CTA stays Button’s own behaviour; do not add section hover motion.
- Gate nothing else; scrub is scroll-driven not hover.

Optional: after plan 001, if you keep a one-shot entrance instead of scrub-only, do **either** scrub **or** Reveal — not both fighting. This plan chooses **scrub only**.

## Repo conventions to follow

- Exemplar scrub timeline: `src/components/home/Hero.tsx` exit timeline (`scrub: 0.65`, `ease: 'none'` on scrub children).
- Exemplar matchMedia / reduced motion early exit: `HomeDriver.tsx` / `HomeStory.tsx`.
- Register plugins at module top: `gsap.registerPlugin(ScrollTrigger, useGSAP)`.
- No inline imports.

## Steps

1. Refactor `PassTeaser.tsx`: remove `Reveal` import; add refs for `frame`, `copy`, `media`; add `useGSAP` block implementing the target timeline.
2. Ensure failed-image fallback still works inside media figure.
3. If CSS assumes `.reveal` class, it doesn’t — Reveals only added a class `reveal`; removing it is fine (`Reveal.css` is global no-op for layout).
4. Confirm `PassTeaser.css` overflow (`overflow: clip` on section) still clips scale 1.05 without horizontal scroll — adjust `overflow` on `__media` only if needed (already `overflow: hidden`).

## Boundaries

- Do NOT load PlayCanvas / WebGL / `camaro.glb` on Home.
- Do NOT pin the section.
- Do NOT add opponent-picker UI or HUD (those belong on `/pass`).
- Do NOT change i18n copy.
- Do NOT animate layout properties.

## Verification

- **Mechanical**: `npm run build` passes.
- **Feel check**:
  - Scroll into PassTeaser: image leads, copy follows ~15% later on the scrub timeline; feels like a pass tease, not a card fade.
  - Scroll back up: motion reverses smoothly (scrub).
  - Reduced motion: content visible immediately, no scrub transform.
  - Mobile: same scrub is OK (no pin); confirm no horizontal overflow from scale.
- **Done when**: Reveals gone from PassTeaser; scrub recipe matches values above; build green.
