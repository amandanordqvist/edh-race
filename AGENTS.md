## Learned User Preferences

- Prefers Swedish in conversation and product copy; the site must ship bilingual EN + SV.
- Keep the existing Vite + React stack; do not migrate to Next.js from the blueprint.
- MVP first (seven pages, design system, copy, static data); phase 2 includes Pass Arena (PlayCanvas) and interactive chassis.
- MVP contact should use mailto (zero setup); Formspree/Resend or similar can come later.
- Rejected Speed Rusher and Aristotele as too messy; prefer clean condensed webfonts (Oswald display, Barlow Condensed UI, DM Sans body) without italic display headings.
- Visual makeovers should stay on-brand (dark base, primary blue, locked fonts); prefer high-end cinematic polish over generic racing neon.
- Motion should stay intentional and performant: GPU `transform`/`opacity` only, hover gated to fine pointers, respect `prefers-reduced-motion`; avoid blur-heavy reveals.
- Design north star: the whole site should feel like one drag pass (staging → launch → pass → chutes → partner invite); weigh choices against tyngd, precision, and återhållsamhet; reject scroll-dots, custom cursors, and glassmorphism cards.
- Voice: Anders as underdog — humble garage builder, never boastful or “pro brand”; let times and craft speak.
- For the car 360, prefer a lightweight frame-based turntable over Three.js / WebGL; Pass Arena is the separate PlayCanvas 3D feature.
- Home hero should be logo-led and sparse: TEAM above, centered EDH logo, TOP DOORSLAMMER below, short CTAs—no repeated slogans or harsh logo shadow; full-bleed video behind the header with a local scrim; GSAP for entrance.
- Home Anders feature should be image-led (standing cutout) with sparse copy; Results should open pass-first (big times on race imagery before tables); avoid empty dark voids and card-heavy SaaS grids on Home.

## Learned Workspace Facts

- Public GitHub repo: https://github.com/amandanordqvist/edh-race (local project `edh-race`).
- Site is for EDH Racing / Anders Edh — Scandinavian drag racing team; brand direction is Scandinavian minimalism meets racing (dark base, primary blue accent).
- Spec/content source of truth is `full_website_blueprint (1).md` (and `blueprint.md`); `PRODUCT.md` locks brand/product context; feature specs/plans live in `docs/superpowers/`.
- Results, sponsors, calendar, team, simulator timings, and similar content live as static TypeScript data files under `src/data/` for MVP (light CMS later if needed).
- i18n is a custom locale provider with `en`/`sv` dictionaries under `src/i18n/`.
- Core narrative arc: garage-built path from Hudiksvall (mini-moped roots) to Santa Pod record pace (5.74 s @ 415 km/h).
- GSAP powers scroll reveals and HomeStory pin+scrub; Pass Arena is PlayCanvas on `/sv/passet` and `/en/pass` with a Home teaser only (no WebGL on Home); interactive chassis remains phase-2.
- Machine page hero uses `CarTurntable` with curated WebP frames under `public/images/images-car/showcase/` (raw plates are not a true sequential 360).
- Primary nav spine is Journey → Machine → Sponsors (`contact`); Results, Team, Media, and Pass sit under secondary “Mer”.
- Official Facebook is https://www.facebook.com/edhracing; Media embeds it via `FacebookFeed`.
- Home `HomeDriver` uses `/images/standinganders.webp` (PNG fallback); Results opens with `ResultsHero` (pass-first).
- Historical Journey/HomeStory plates live under `public/images/journey/`; HomeStory is a horizontal beat rail (desktop pin+scrub, mobile/reduced-motion snap).
