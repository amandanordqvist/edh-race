# Home motion plans (GSAP / ScrollTrigger)

Plans from the home-page animation audit. Execute in order — later plans assume earlier APIs exist.

| # | Title | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 001 | Reveal paces + kill refresh thrash | HIGH | DONE | — |
| 002 | HomeStory active-beat focus | HIGH | DONE | — |
| 003 | PassTeaser scrub tease | MEDIUM | DONE | 001 (optional; can ship alone) |
| 004 | HomeDriver single scrub timeline | LOW | DONE | — |
| 005 | PerformanceStrip count-up after settle | MEDIUM | DONE | 001 |

## Recommended order

1. **001** — unlocks role-differentiated entrances and removes mount jank.
2. **005** — uses launch pace from 001 so times land after cells.
3. **002** — biggest narrative win on the story rail.
4. **003** — Pass Arena tease without WebGL.
5. **004** — tidy-up; same feel, fewer triggers.

## Brand constraints (do not violate)

- Animate `transform` / `opacity` only (no blur reveals, no layout props).
- Respect `prefers-reduced-motion` (gentler / snap, not zero feedback where comprehension needs it).
- No scroll-dots, custom cursors, glassmorphism cards, or WebGL on Home.
- Voice stays underdog; motion = tyngd, precision, återhållsamhet — one drag-pass arc.

## Execute

Hand any plan to an agent with: implement `plans/NNN-….md` exactly; do not expand scope.
