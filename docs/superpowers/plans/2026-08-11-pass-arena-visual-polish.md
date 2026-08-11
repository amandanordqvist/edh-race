# Pass Arena Visual Polish (A+B) Implementation Plan

> **For agentic workers:** Execute task-by-task. Checkbox steps for tracking.

**Goal:** Multi-part vehicles, cinematic strip set, timeslip finish HUD — no GLB.

**Architecture:** Split scene builders under `src/lib/pass/`; keep race root entities; restyle Pass results as timeslip card.

**Tech Stack:** Existing PlayCanvas + React Pass Arena.

**Spec:** `docs/superpowers/specs/2026-08-11-pass-arena-visual-polish-design.md`

## Global Constraints

- Brand: dark, primary blue, no neon / glassmorphism  
- Data only from `simulator.ts`  
- High/low quality gating  
- EN+SV for new strings  
- Files prefer &lt;300 lines  

---

### Task 1: Split + rebuild scene (vehicles + environment)

**Files:**
- Create: `src/lib/pass/sceneMaterials.ts` (shared material helper) if useful
- Create: `src/lib/pass/buildVehicles.ts`
- Create: `src/lib/pass/buildEnvironment.ts`
- Modify: `src/lib/pass/buildScene.ts` — compose only

- [ ] Multi-part camaro / f1 / jet roots
- [ ] Start line, dashes, guardrails, tree arms, finish tower (high), sky plane
- [ ] Preserve `PassScene` public API
- [ ] `npm run build`

### Task 2: Timeslip HUD

**Files:**
- Create or modify: `PassTimeslip` / `PassFallback` / `PassArena` + CSS
- Modify: i18n `pass.timeslipTitle` (or equivalent), distance label

- [ ] Larger race clock
- [ ] Finish timeslip card layout
- [ ] EN+SV
- [ ] `npm run build`

### Task 3: Camera framing tweak + acceptance

- [ ] Idle/staging camera frames tree + cars; race still follows camaro
- [ ] Manual checklist from spec
- [ ] Commit polish
