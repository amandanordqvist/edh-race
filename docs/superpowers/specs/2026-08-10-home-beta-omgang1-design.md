# Home Beta — Omgång 1 Design Spec

**Date:** 2026-08-10  
**Status:** Approved (approach A; user: ship without stepwise Q&A)  
**Page:** Home  
**Scope:** Priority beta that removes empty dark voids and fills the narrative arc

## Goal

Make the homepage feel like a finished racing experience, not a dark skeleton. Every viewport should show fart, teknik, människa, berättelse, or nästa tävling. Keep Vite + React, bilingual EN/SV, brand voice (tyngd · precision · återhållsamhet · underdog), and the one-drag-pass rhythm.

## Approach

**A — Foundation first, then story.** Tighten tokens/readability/grid, then hero, then image-led sections, then team/timeline/race/partners teasers. Reuse existing assets and `src/data/*`; deep-link to Journey / Machine / Team / Results / Contact rather than duplicating full pages.

## Out of scope (later phases)

- New hero video cut (8–15 s) and audio track production  
- Right-side scroll section dots  
- Full dragstrip rebuild with real timeslip timeline + motor sound  
- Interactive chassis hotspots on home (keep on Machine)  
- 6+ image craft gallery lightbox  
- News/articles section and film section  
- Partner PDF download  
- Full footer rebuild (next race + rights block)  
- SEO structured data pass  
- Archive of historical film embeds  

## Page arc (beta)

```
Hero
→ PerformanceStrip (records as fact cards)
→ DragstripSimulator (keep; light copy polish only)
→ HomeMachine (NEW — full-bleed car)
→ HomeDriver (Anders — stronger portrait beat)
→ HomeTeam (NEW — team teaser)
→ HomeStory (REPLACE HomeChutes — visual timeline teaser)
→ HomeNextRace (NEW — next calendar round)
→ SponsorStrip (partner value + logo grid)
```

## §1 Foundation

### Tokens (`src/styles/tokens.css`)

| Token | From | To (approx −35%) |
| --- | --- | --- |
| `--section-pad` | `clamp(5rem, 12vw, 8.5rem)` | `clamp(3.25rem, 7vw, 5.5rem)` |
| `--section-pad-bottom` | `clamp(5.5rem, 13vw, 9.5rem)` | `clamp(3.5rem, 8vw, 6rem)` |
| `--color-silver-gray` | `#a8adb8` | `#c4c9d4` (secondary text AA) |

Keep `--content-max: 1180px`, `--content-wide: 1360px`.

### Typography

- Body: ≥ `1rem`, line-height ≥ `1.55` in `global.css` / `.section__lead`  
- Labels/eyebrows: small caps OK at ~0.75–0.8rem; not for long sentences  
- Nav links: bump to ≥ 0.9rem where currently ~0.72rem on home-adjacent chrome if needed for readability  
- Display (Oswald) for section titles only; body stays DM Sans  

### Grid

- All home sections use `Section` / `Section wide`  
- Composition alternates: center (records), left copy / right media (Anders), right copy / left or full media (car), center (story teaser), grid (team/partners)  
- No orphan text outside max width  

### Images

- Prefer WebP + PNG/JPG fallback via `<picture>` where both exist  
- `loading="lazy"` below fold; hero poster stays eager  
- On image error: swap to a dark placeholder with short accessible text (shared tiny helper or `onError` on home media)  
- Never leave a section as near-black empty surface — every home section has image, fact cards, or structured content  

## §2 Hero

### Content (i18n)

| Key | SV (intent) | EN (intent) |
| --- | --- | --- |
| eyebrow | Svensk Top Doorslammer | Swedish Top Doorslammer |
| headline | 5,74 sekunder. Ett helt team bakom varje hundradel. | 5.74 seconds. A whole team behind every hundredth. |
| lead | Edh Racing från Hudiksvall tävlar med en av Sveriges snabbaste doorslammers. Följ teamet, bilen och jakten på nästa rekord. | Edh Racing from Hudiksvall races one of Sweden’s quickest doorslammers. Follow the team, the car, and the hunt for the next record. |
| ctaPrimary | Möt teamet → `/team` | Meet the team |
| ctaSecondary | Upptäck bilen → `/machine` | Discover the car |

Logo remains brand mark in `h1`; headline is the real message (`h2` or promote headline to visual H1 with logo as brand image — prefer: logo decorative/`aria-hidden` if headline carries H1, or keep logo in H1 and headline as `p`/`h2` for a11y: **logo `img` alt = brand, headline = `h1`**, logo not wrapping H1).

**Decision:** `h1` = headline; logo = brand image above with `alt={t.home.brand}`.

### Overlay

- Replace full-frame heavy fade with **local** left/bottom scrim behind copy  
- Mid/right of frame stays clearer so car/track read  
- Video filter: slightly warmer/more saturated; no flat black veil  

### Video UX (beta)

- Keep existing `hero.mp4` + poster `IMG_1860.JPG`  
- Muted, loop, playsInline  
- `prefers-reduced-motion: reduce` → hide video, show poster only  
- Optional mute toggle only if trivial; otherwise defer audio  

## §3 Records (`PerformanceStrip`)

Rebuild as story + 3–4 fact cards:

1. 5.74 s / 415 km/h — quarter mile (Santa Pod)  
2. 3.80 s — eighth mile  
3. 330 km/h — eighth (if data exists in copy; else omit rather than invent)  
4. Hudiksvall · Top Doorslammer  

Animate numbers discreetly on enter (existing Reveal + optional count-up only if already patterned; else static strong typography). Link context in lead: distance + venue.

**No invented timeslip fields.**

## §4 Pass (`DragstripSimulator`)

Keep component. Beta: tighten section padding via tokens; optional one-line explainer under title about 0→400+ km/h in under six seconds (i18n). No full timeslip rebuild.

## §5 Car (`HomeMachine` — new)

- Full-bleed / near full viewport height on desktop  
- Primary asset: strong side or ¾ view from existing set (e.g. `camaro_1.jpg` / Santa Pod / showcase still) with WebP if we add one later; JPG OK for beta  
- Short label + title + 1 sentence + CTA to Machine  
- Optional compact spec chips from `machineSpecs` (4–6 keys: model, body, engine, fuel, transmission) — readable without animation  
- Text beside or below car; never cover nose/grille critical detail  
- Alternating composition: media dominant  

## §6 Anders (`HomeDriver`)

- Keep `standinganders.webp` / `.png`  
- Stronger copy: title intent “Föraren bakom 5,74”; short human body + one quote if space; CTA to Journey (full profile)  
- Ensure figure is large and readable; reduce veil darkness if it eats the cutout  
- Image error → placeholder, never empty black  

## §7 Team (`HomeTeam` — new)

- Group photo: `/images/team.JPG` or `team2.JPG`  
- Quote: “Bilen syns mest. Men varje repa börjar långt innan Anders sätter sig bakom ratten.”  
- Grid of featured crew from `src/data/team.ts` (Anders, Martin, Andreas, Marie + others with images) — name + role from i18n `team.roles`  
- CTA → Team page  
- Roles in plain Swedish/English; no empty portrait slots (skip members without image or show initials tile)  

## §8 Story (`HomeStory` — replaces `HomeChutes`)

- Explain “tystnaden” briefly: pause → rebuild → return → 5.74  
- Horizontal/vertical scannable timeline teaser: 5–7 beats from `timeline` data with year + short text + image when available  
- Must include ≥2 historical images already on disk  
- CTA → Journey  

## §9 Next race (`HomeNextRace` — new)

- Use `getNextCalendarRound(calendar2026)`  
- Card: venue, dates, round, class (Top Doorslammer), status (Kommande)  
- CTA → Results/calendar page  
- If season over: show final round as “Senaste” or season complete message — no fake future dates  

## §10 Partners (`SponsorStrip`)

- Title intent: “Bygg nästa kapitel tillsammans med oss”  
- Body: visibility on car, kit, social, visits, tickets, web/film (short bullet list, not card spam)  
- Primary CTA → Contact; secondary mailto if already patterned  
- Logo presentation: equal-height grid (not thin duplicated marquee); link out when URL exists (add optional `url` on sponsor type if known, else no link)  
- Keep existing three logos; normalize CSS height  

## Architecture

```
HomePage
  Hero
  PerformanceStrip
  DragstripSimulator
  HomeMachine          (new)
  HomeDriver           (enhanced)
  HomeTeam             (new)
  HomeStory            (new; replaces HomeChutes)
  HomeNextRace         (new)
  SponsorStrip         (enhanced)
```

### Shared

- i18n keys under `home.*` in `types.ts`, `en.ts`, `sv.ts`  
- Reuse `Section`, `Reveal`, `Button`, `SkewDivider` sparingly between beats  
- Data: `team`, `timeline`, `calendar`, `machineSpecs`, `sponsors`  

### Files (expected)

| Path | Change |
| --- | --- |
| `src/styles/tokens.css` | Spacing + silver |
| `src/styles/global.css` | Body size/line-height |
| `src/components/ui/Section.css` | Eyebrow/lead readability |
| `src/components/home/Hero.tsx` + `.css` | Message + overlay |
| `src/components/home/PerformanceStrip.tsx` + `.css` | Fact cards |
| `src/components/home/HomeMachine.tsx` + `.css` | New |
| `src/components/home/HomeDriver.tsx` + `.css` | Copy + veil |
| `src/components/home/HomeTeam.tsx` + `.css` | New |
| `src/components/home/HomeStory.tsx` + `.css` | New |
| `src/components/home/HomeNextRace.tsx` + `.css` | New |
| `src/components/home/HomeChutes.tsx` + `.css` | Remove from page (delete or leave unused) |
| `src/components/home/SponsorStrip.tsx` + `.css` | Partner value + grid |
| `src/pages/HomePage.tsx` | New order |
| `src/i18n/*` | All new strings |

## Motion

- Existing `Reveal` (opacity + translateY)  
- GPU transform/opacity only; respect `prefers-reduced-motion`  
- No blur-heavy reveals; no generic neon  

## Success criteria (Omång 1)

1. No home section is an empty near-black void  
2. Vertical rhythm ~30–40% tighter; mobile tighter than desktop  
3. Shared content width; alternating L/C/R compositions  
4. Body ≥ 16px, LH ≥ 1.5, secondary text lighter  
5. Hero states who/why with two CTAs; readable without video  
6. Car section dominates ≥1 viewport on desktop  
7. Anders + team + story timeline + next race + clearer partners all present  
8. Bilingual EN/SV parity  

## Risks

- Missing sponsor URLs → logos without links OK  
- Eighth-mile speed 330 km/h: only show if already in product copy/data; else omit  
- Large JPGs: lazy-load; optimize WebP in a later pass if needed  
