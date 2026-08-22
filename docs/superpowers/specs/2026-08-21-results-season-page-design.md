# Results Page — Season Story

**Date:** 2026-08-21  
**Status:** Approved  
**Page:** Results (`/sv/resultat` · `/en/results`)

## Goal

A first-time visitor understands the 2026 season in one pass: when Anders races next, then how fast he is on the distance he usually runs (201 m), with the Santa Pod quarter mile and EDRS places as quiet proof afterwards.

## Page arc

```
Quiet page title + one-line lead
→ Next start (featured)
→ Season list 2026 (past quieter, next tagged, Markus Memorial as finale)
→ Times on 201 m (personal best + latest, then a compact archive)
→ Quarter-mile note (5.74 s / 415 km/h)
→ EDRS places (compact year row, no podium)
```

Home keeps the cinematic 5.74 teaser. This page does not open with that number.

## Calendar

- One system: featured next start, then all ten 2026 events in date order.
- Show event name, dates (locale-formatted), venue.
- Past events at reduced opacity. Next start tagged. Final event marked.
- One atmosphere still on the featured next start only. No per-row photo cards.
- If the season is over, show a one-line done state and the list.

## Times

- Lead with 201 m. One sentence: Nordic racing distance, ET = standing start to finish.
- Personal best 3.803 s (2025) and latest 3.859 s (2026) as the two slips.
- Remaining years as a compact list, not a spreadsheet shell.
- Santa Pod 5.74 / 415 as a text note under the 201 m block. Different distance, same car.

## Championship

- EDRS Top Doorslammer finishing places as a compact year/place row.
- No gold/silver/bronze podium theatre.
- Newest years first.

## Voice and craft

- Underdog, facts first. No boast copy.
- Existing fonts, dark base, primary blue. No glass cards, no filter chips, no countdown.
- Motion: existing Reveal, `transform`/`opacity` only, hover on fine pointers, `prefers-reduced-motion`.
- Bilingual EN + SV. Static data in `src/data/calendar.ts` and `src/data/results.ts`.
