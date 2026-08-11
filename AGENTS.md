## Learned User Preferences

- Prefers Swedish in conversation and product copy; the site must ship bilingual EN + SV.
- Keep the existing Vite + React stack; do not migrate to Next.js from the blueprint.
- MVP first (seven pages, design system, copy, static data); phase 2 dragstrip simulator and interactive chassis are now approved and in scope.
- MVP contact should use mailto (zero setup); Formspree/Resend or similar can come later.
- Rejected Speed Rusher and Aristotele as too messy; prefer clean condensed webfonts (Oswald display, Barlow Condensed UI, DM Sans body) without italic display headings.
- Visual makeovers should stay on-brand (dark base, primary blue, locked fonts); prefer high-end cinematic polish over generic racing neon.
- Motion should stay intentional and performant: GPU `transform`/`opacity` only, hover gated to fine pointers, respect `prefers-reduced-motion`; avoid blur-heavy reveals.
- Design north star: the whole site should feel like one drag pass (staging → launch → pass → chutes → partner invite); weigh choices against tyngd, precision, and återhållsamhet; reject scroll-dots, custom cursors, and glassmorphism cards.
- Voice: Anders as underdog — humble garage builder, never boastful or “pro brand”; let times and craft speak.
- For the car 360, prefer a lightweight frame-based turntable over Three.js / WebGL.
- Home hero should be message-led (record/team headline, short lead, CTAs) with the EDH logo as brand mark—not a logo-only poster or plain “EDH RACING” type; keep car/track visible via a local scrim, full-bleed video behind the header.
- Home Anders feature should be image-led (standing cutout) with sparse copy; fuller biography lives on Journey; avoid large empty dark voids on Home—fill sections with real race/team imagery rather than card-heavy SaaS grids.

## Learned Workspace Facts

- Public GitHub repo: https://github.com/amandanordqvist/edh-race (local project `edh-race`).
- Site is for EDH Racing / Anders Edh — Scandinavian drag racing team; brand direction is Scandinavian minimalism meets racing (dark base, primary blue accent).
- Spec/content source of truth is `full_website_blueprint (1).md` (and `blueprint.md`); `PRODUCT.md` locks brand/product context for design; blueprint mentions Next.js but implementation is Vite + React Router.
- Results, sponsors, calendar, team, and similar content live as static TypeScript data files under `src/data/` for MVP (light CMS later if needed).
- i18n is a custom locale provider with `en`/`sv` dictionaries under `src/i18n/`.
- Core narrative arc: garage-built path from Hudiksvall (mini-moped roots) to Santa Pod record pace (5.74 s @ 415 km/h).
- GSAP powers scroll reveals, HomeStory pin+scrub storytelling, and phase-2 interactivity (dragstrip simulator, interactive chassis SVG hotspots).
- Local animation/design skills live under `.agents/skills/` (animate, improve-animations, apple-design, emil-design-eng, etc.).
- Machine page hero uses `CarTurntable` with curated WebP frames under `public/images/images-car/showcase/` (raw plates are not a true sequential 360); feature specs/plans live in `docs/superpowers/`.
- Primary nav spine is Journey → Machine → Sponsors (`contact`); Results, Team, and Media sit under secondary “Mer”.
- Home `HomeDriver` uses the standing Anders cutout at `/images/standinganders.webp` (PNG fallback).
- Historical Journey/HomeStory plates live under `public/images/journey/`; HomeStory is a horizontal beat rail (desktop pin+scrub, mobile/reduced-motion snap).
