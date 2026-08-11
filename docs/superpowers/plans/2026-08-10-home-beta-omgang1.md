# Home Beta Omgång 1 Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a denser, image-led home beta: tighter rhythm, readable type, real hero message, car/team/story/race/partner beats — no empty dark voids.

**Architecture:** Keep existing home components and Vite + React + i18n patterns. Add `HomeMachine`, `HomeTeam`, `HomeStory`, `HomeNextRace`; enhance Hero, PerformanceStrip, HomeDriver, SponsorStrip; replace HomeChutes on the page. Tokens drive spacing/contrast globally.

**Tech Stack:** Vite, React, React Router, custom i18n (`en`/`sv`), CSS tokens, existing `Reveal` / `Section` / `Button`, static `src/data/*`.

## Global Constraints

- Bilingual EN + SV for every new string  
- Brand: dark base, primary blue, Oswald / Barlow Condensed / DM Sans — no neon  
- Motion: `transform`/`opacity` only; respect `prefers-reduced-motion`  
- Do not invent race times or sponsor URLs  
- Prefer existing images under `public/images/`  
- Spec: `docs/superpowers/specs/2026-08-10-home-beta-omgang1-design.md`  
- Voice: underdog, spare Swedish/English  

---

### Task 1: Foundation tokens + readability

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Modify: `src/components/ui/Section.css`

- [ ] **Step 1:** Set `--section-pad: clamp(3.25rem, 7vw, 5.5rem)` and `--section-pad-bottom: clamp(3.5rem, 8vw, 6rem)`; set `--color-silver-gray: #c4c9d4`.
- [ ] **Step 2:** Ensure `body` / paragraph defaults are `font-size: 1rem` and `line-height: 1.55` (or higher).
- [ ] **Step 3:** Bump `.section__eyebrow` to ~0.75–0.8rem; `.section__lead` to `font-size: 1rem`, `line-height: 1.6`, color using lighter silver/white alpha.
- [ ] **Step 4:** Visual check home — sections closer; body readable.

---

### Task 2: Hero message + local overlay

**Files:**
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/Hero.css`
- Modify: `src/i18n/types.ts`, `src/i18n/sv.ts`, `src/i18n/en.ts`

- [ ] **Step 1:** Add i18n keys: `home.eyebrow`, `home.headline`, `home.lead`, `home.ctaTeam`, `home.ctaMachine` (keep `brand` for logo alt).
- [ ] **Step 2:** Restructure Hero: logo image (brand), `h1` = headline, lead paragraph, two Buttons (team primary, machine secondary/ghost).
- [ ] **Step 3:** CSS: local left/bottom scrim; lighten mid/right; warmer video filter; reduced-motion shows poster only.
- [ ] **Step 4:** Verify CTAs route via `localePath` to team and machine.

---

### Task 3: PerformanceStrip fact cards

**Files:**
- Modify: `src/components/home/PerformanceStrip.tsx`
- Modify: `src/components/home/PerformanceStrip.css`
- Modify: i18n home stats strings as needed

- [ ] **Step 1:** Layout title + lead + grid of fact cards (quarter, top speed, eighth time, base/class). Omit 330 km/h unless already in dictionaries.
- [ ] **Step 2:** Style cards without SaaS chrome — hairline borders, typography-led.
- [ ] **Step 3:** Confirm distances are labeled (quarter / eighth).

---

### Task 4: HomeMachine full-bleed car

**Files:**
- Create: `src/components/home/HomeMachine.tsx`
- Create: `src/components/home/HomeMachine.css`
- Modify: `src/pages/HomePage.tsx`
- Modify: i18n

- [ ] **Step 1:** Section with large car image (`/images/camaro_1.jpg` or best available), label, title, body, CTA to machine, optional 4–6 chips from `machineSpecs`.
- [ ] **Step 2:** Desktop min-height ~100vh; text not covering critical car detail; image `onError` fallback.
- [ ] **Step 3:** Insert after DragstripSimulator in HomePage.

---

### Task 5: HomeDriver strengthen

**Files:**
- Modify: `src/components/home/HomeDriver.tsx` + `.css`
- Modify: i18n driver strings

- [ ] **Step 1:** Update copy to “Föraren bakom 5,74” intent + short body (+ optional quote).
- [ ] **Step 2:** Lighten veil so cutout reads; keep layout.
- [ ] **Step 3:** Image error fallback.

---

### Task 6: HomeTeam teaser

**Files:**
- Create: `src/components/home/HomeTeam.tsx` + `.css`
- Modify: HomePage, i18n
- Use: `src/data/team.ts`, `/images/team.JPG`

- [ ] **Step 1:** Group photo + quote + member row (members with images) + CTA to team.
- [ ] **Step 2:** Roles from existing `t.team.roles` where possible.
- [ ] **Step 3:** Insert after HomeDriver.

---

### Task 7: HomeStory timeline teaser (replace Chutes)

**Files:**
- Create: `src/components/home/HomeStory.tsx` + `.css`
- Modify: HomePage (remove HomeChutes)
- Modify: i18n; use `src/data/timeline.ts`

- [ ] **Step 1:** Short “tystnaden” framing + 5–7 timeline beats with year/text/image when present.
- [ ] **Step 2:** CTA to Journey; ≥2 historical images visible.
- [ ] **Step 3:** Remove HomeChutes from HomePage (leave files or delete — prefer delete if unused).

---

### Task 8: HomeNextRace

**Files:**
- Create: `src/components/home/HomeNextRace.tsx` + `.css`
- Modify: HomePage, i18n
- Use: `getNextCalendarRound` from `src/data/calendar.ts`

- [ ] **Step 1:** Show next round card (venue, dates, round, class, status) or season-complete state.
- [ ] **Step 2:** CTA to results/calendar.
- [ ] **Step 3:** Insert before SponsorStrip.

---

### Task 9: SponsorStrip partner value + logo grid

**Files:**
- Modify: `src/components/home/SponsorStrip.tsx` + `.css`
- Modify: i18n; optionally `src/data/sponsors.ts` for `url?`

- [ ] **Step 1:** New title/body + short benefit list (6 items).
- [ ] **Step 2:** Replace marquee with equal-height logo grid; links if URL present.
- [ ] **Step 3:** CTAs to contact.

---

### Task 10: Wire HomePage + polish pass

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Spot-fix all new CSS for mobile padding and type

- [ ] **Step 1:** Final order matches spec arc; SkewDividers only where helpful (not between every beat).
- [ ] **Step 2:** `npm run build` (or `tsc`/vite build) must pass.
- [ ] **Step 3:** Smoke: home SV/EN, all CTAs, images visible, no empty black sections.

---

## Spec coverage

| Spec § | Task |
| --- | --- |
| §1 Foundation | 1 |
| §2 Hero | 2 |
| §3 Records | 3 |
| §4 Pass polish | tokens in 1 + optional copy in 3/10 |
| §5 Car | 4 |
| §6 Anders | 5 |
| §7 Team | 6 |
| §8 Story | 7 |
| §9 Next race | 8 |
| §10 Partners | 9 |
| Page wire | 10 |
