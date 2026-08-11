# Home Driver Portrait — Design Spec

**Date:** 2026-08-07  
**Status:** Approved in conversation; building  
**Page:** Home  
**Approach:** Full-figure vignette with cutout (`standinganders.png`)

## Goal

Add a calm “the driver” beat after the dragstrip simulator: Anders as underdog face of the pass, before chutes and partner invite. Image carries weight; copy stays sparse; Journey gets the rest of the story.

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Placement | After `DragstripSimulator`, before `HomeChutes` |
| Content | Short portrait + CTA to Journey |
| Layout | Full-figure vignette (text left / figure right on desktop) |
| Asset | `/images/standinganders.png` |
| New deps | None |

## Page arc

`Hero → PerformanceStrip → DragstripSimulator → **HomeDriver** → HomeChutes → SponsorStrip`

## UX / Visual

- Label (ui caps, primary blue): Föraren / The driver  
- Title: Anders Edh  
- Body: 1–2 humble sentences (garage, drives, lets times speak)  
- CTA: ghost button → Journey  
- Desktop: two columns; cutout nearly full section height with soft ground shadow  
- Mobile: copy above, figure below  
- Background: dark gradient + soft vignette (hero language, no neon glow)  
- Motion: existing `Reveal` (opacity + translateY); respect `prefers-reduced-motion`

## Architecture

```
HomePage
  └─ HomeDriver
       ├─ copy (label, title, body, CTA)
       └─ figure (standinganders.png)
```

### Files

| Path | Change |
| --- | --- |
| `src/components/home/HomeDriver.tsx` | New |
| `src/components/home/HomeDriver.css` | New |
| `src/pages/HomePage.tsx` | Insert between simulator and chutes |
| `src/i18n/types.ts` | `home.driver*` keys |
| `src/i18n/en.ts` / `sv.ts` | Copy |

## Out of scope

- Replacing or merging HomeChutes  
- Stats/facts row on the portrait  
- Parallax beyond Reveal  
- New image processing / WebGL  
