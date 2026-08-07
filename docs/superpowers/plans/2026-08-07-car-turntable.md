# Car Turntable Hero Implementation Plan

> **For agentic workers:** Execute inline in this session (user approved with “kör”). Steps use checkbox syntax for tracking.

**Goal:** Replace the Machine page static hero with a drag-to-spin 360° frame turntable from 18 Camaro cutouts.

**Architecture:** `CarTurntable` owns pointer/keyboard/auto-rotate and preload; frames listed in `machine.ts`; MachinePage swaps the hero `<img>` for the component. No new dependencies.

**Tech Stack:** Vite + React 19, custom i18n, CSS tokens, existing Reveal wrapper.

## Global Constraints

- No Three.js / new npm deps
- GPU-friendly motion only; respect `prefers-reduced-motion`
- Bilingual EN + SV copy
- Assets live at `/images/images-car/1.png` … `18.png` (folder renamed from `images car`)
- Keep cinematic dark shell; `object-fit: contain` on black

---

### Task 1: Data + i18n

**Files:**
- Modify: `src/data/machine.ts`
- Modify: `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/sv.ts`

- [x] Export `carTurntableFrames` (18 URLs)
- [x] Add `turntableHint` + `turntableLabel` to machine i18n

### Task 2: CarTurntable component

**Files:**
- Create: `src/components/machine/CarTurntable.tsx`
- Create: `src/components/machine/CarTurntable.css`

- [x] Pointer drag with `|dx| > |dy|`, wrap index, neighbor preload, idle preload
- [x] Auto-rotate after enough frames; pause on interact; reduced-motion off
- [x] Keyboard ←/→; hint hides after first interaction

### Task 3: Wire MachinePage

**Files:**
- Modify: `src/pages/MachinePage.tsx`, `src/pages/MachinePage.css`

- [x] Replace hero img with `<CarTurntable />`
- [x] Adjust CSS for contain / no photo hover-zoom

### Task 4: Verify

- [x] `npm run build` passes
- [ ] Manual smoke: drag, keyboard, reduced-motion path
