## Learned User Preferences

- Prefers Swedish in conversation and product copy; the site must ship bilingual EN + SV.
- Keep the existing Vite + React stack; do not migrate to Next.js from the blueprint.
- MVP first (seven pages, design system, copy, static data); phase 2 dragstrip simulator and interactive chassis are now approved and in scope.
- MVP contact should use mailto (zero setup); Formspree/Resend or similar can come later.
- Rejected Speed Rusher and Aristotele as too messy; prefer clean condensed webfonts (Oswald display, Barlow Condensed UI, DM Sans body) without italic display headings.
- Visual makeovers should stay on-brand (dark base, primary blue, locked fonts); prefer high-end cinematic polish over generic racing neon.
- Motion should stay intentional and performant: GPU `transform`/`opacity` only, hover gated to fine pointers, respect `prefers-reduced-motion`; avoid blur-heavy reveals.

## Learned Workspace Facts

- Public GitHub repo: https://github.com/amandanordqvist/edh-race (local project `edh-race`).
- Site is for EDH Racing / Anders Edh — Scandinavian drag racing team; brand direction is Scandinavian minimalism meets racing (dark base, primary blue accent).
- Spec/content source of truth is `full_website_blueprint (1).md` (and `blueprint.md`); blueprint mentions Next.js but implementation is Vite + React Router.
- Results, sponsors, calendar, team, and similar content live as static TypeScript data files under `src/data/` for MVP (light CMS later if needed).
- i18n is a custom locale provider with `en`/`sv` dictionaries under `src/i18n/`.
- Core narrative arc: garage-built path from Hudiksvall (mini-moped roots) to Santa Pod record pace (5.74 s @ 415 km/h).
- GSAP powers scroll reveals and phase-2 interactivity (dragstrip simulator, interactive chassis SVG hotspots).
- Local animation/design skills live under `.agents/skills/` (animate, improve-animations, apple-design, emil-design-eng, etc.).
