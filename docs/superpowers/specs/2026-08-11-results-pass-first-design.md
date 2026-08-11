# Results Page — Pass-first Design Spec

**Date:** 2026-08-11  
**Status:** Implemented  
**Page:** Results (`/results` · Tävlingar & resultat)  
**Scope:** Make the page feel like a race weekend, not a spreadsheet

## Goal

A visitor who doesn’t know drag racing should open the page and instantly understand: **this is about timed passes on a strip**. Championship places and the SM calendar stay, but they follow the visual proof — they don’t lead.

Voice stays underdog: times and craft speak. No boastful podium theatre, no meta-labels (“SECTION 01”), no glass cards.

## Approach (recommended)

**Pass-first arc.** Open with one cinematic timeslip moment (quarter-mile landmark), then short championship proof, then personal-best archive, then a living calendar. Reuse existing plates under `public/images/journey/` (Santa Pod set) and race/team stills already on the site. Keep static data in `src/data/results.ts` + `src/data/calendar.ts`; extend with optional image paths only where needed.

### Rejected alternatives

| Approach | Why not |
| --- | --- |
| Calendar-first | Useful logistics, cold opening; Home already teases next start |
| Podium-first | Numbers without a pass feel like league tables |
| Full CMS / live timing | Out of MVP; static TS data is enough |

## Page arc

```
ResultsHero (NEW — full-bleed pass / timeslip)
→ Standings (tighten — podium + sparse year list)
→ BestTimes (featured as visual slips; table as archive)
→ Calendar (venue strips + next-start emphasis)
```

One job per section. Huge chapter breathing (existing section pad tokens). No duplicate “5.74” sermon if Home already owns the short teaser — here the number sits **on the photo** as fact, with one quiet caption.

## §1 ResultsHero

**Job:** Attention — show a pass.

- Full-bleed still (prefer Santa Pod plate from `journey/2024-santapod*`; pick the clearest launch/pass frame). Local bottom/center scrim only — keep asphalt/car readable.
- Dominant readout: **5.74 s** + **415 km/h** (quarter mile / 402 m), same facts as Home `PerformanceStrip` / simulator.
- One short bilingual caption, e.g. SV: *Snabbaste kvarts mile — Santa Pod.* EN: *Quickest quarter mile — Santa Pod.*
- Page `h1` can be visually quiet (small UI label or integrated in caption stack) so the time is the hero signal — not a 6-line title wall. Accessible name still clear (`Tävlingar & resultat` / brand context).
- Optional single CTA: jump to calendar anchor (`#kalender`) or “Nästa start” — max one.
- Motion (GSAP, transform/opacity only): media scale settle + time fade/up; respect `prefers-reduced-motion`. No blur reveals.

**Not in hero:** standings chips, full calendar, pill tags, “Top Doorslammer” eyebrow spam, second long lead.

## §2 Standings (championship)

**Job:** Proof of seasons — sparse.

- Keep medal podium for gold/silver/bronze years; allow a small photo on the strongest year only if a real plate exists (else number-led is fine).
- One line of context above the block: what this list is (EDRS Top Doorslammer placings) — not a paragraph.
- Non-medal years stay in a compact table or quiet list under the podium.
- No fake trophy 3D; medal color via existing tokens only.

## §3 BestTimes (201 m / 660 ft)

**Job:** Personal bests — feel the slip, then archive.

Clarify distance in the section heading (already: historiska tider 201 m). Do **not** visually compete with the quarter-mile hero number — different distance, different chapter.

- Featured `best` + `latest` become **timeslip panels**: large ET + speed over a still (reuse race imagery; optional per-row `image` in data later).
- Remaining rows stay in the data table (archive).
- Optional micro-line: what ET / sluthastighet means — one sentence max, bilingual.

## §4 Calendar 2026

**Job:** When to watch — living list.

- Keep round / dates / venue; emphasize `getNextCalendarRound()` visually (existing next tag).
- Each row (or every unique venue) gets a thin horizontal plate — atmosphere, not a postcard collage. Map venues to shared stills where dedicated venue photos don’t exist (honest reuse > empty dark).
- Final round stays marked; no countdown widgets.
- Anchor id for hero CTA deep-link.

## Data & i18n

- Extend copy in `sv.ts` / `en.ts` / `types.ts`: hero caption, standings one-liner, optional ET explainer, calendar section unchanged title OK.
- Optional: `image?: string` on `BestTime` / calendar venue map in `src/data/` — static only.
- Do not invent live results APIs.

## Motion & craft

- GPU `transform` / `opacity` (+ sanctioned `clip-path` if used for slips).
- Hover motion gated to `(hover: hover) and (pointer: fine)`.
- Reveal stagger on lists OK; keep under marketing durations, not UI 150 ms snappiness for the hero entrance.
- Match Home cinematic polish; no scroll-dots, custom cursors, glassmorphism.

## Success criteria

- First viewport reads as a **pass**, not a title page.
- A non-racer can tell championship place ≠ 201 m ET ≠ quarter-mile landmark after one scroll.
- Page uses ≥ 3 real race images (hero + featured slips and/or calendar strips).
- No new fonts; brand tokens only.
- EN + SV complete for new strings.

## Out of scope

- Live timing / FIA results feed  
- Per-round result breakdowns and elimination trees  
- New photography shoot (use inventory)  
- News/race reports CMS  
- Rebuilding HomeNextRace or PerformanceStrip  
- Partner PDF, scroll dots, timeslip simulator rebuild  

## Implementation notes (for later plan)

Touch primarily: `ResultsPage.tsx`, new `ResultsHero` (+ css), `Standings` / `BestTimes` / `Calendar` polish, `results.ts` / `calendar.ts` image hooks, i18n. Prefer one composition per section; avoid card grids.
