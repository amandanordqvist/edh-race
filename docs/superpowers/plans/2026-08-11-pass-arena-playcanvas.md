# Pass Arena (PlayCanvas) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a hybrid Pass feature — Home teaser (no WebGL) + dedicated `/sv/passet` · `/en/pass` cinematic PlayCanvas quarter-mile comparison with rich gesture-gated audio.

**Architecture:** React owns phase/HUD state; a lazy-loaded Pass page mounts `PassCanvas`, which dynamically imports `playcanvas`, builds a stylized strip scene, and drives racers from `src/data/simulator.ts`. Home swaps `DragstripSimulator` for `PassTeaser` (still + CTA). No PlayCanvas on Home.

**Tech Stack:** Vite, React 19, React Router, custom i18n (`en`/`sv`), GSAP only where already used elsewhere (not required for Pass motion), `playcanvas` npm, Web Audio / HTMLAudioElement, CSS tokens.

**Spec:** `docs/superpowers/specs/2026-08-11-pass-arena-playcanvas-design.md`

## Global Constraints

- Bilingual EN + SV for every new string  
- Brand: dark base, primary blue (`#2A4F9A` family via tokens), Oswald / Barlow Condensed / DM Sans — no cyan/magenta racing neon  
- Voice: underdog; times speak; no boastful copy  
- Motion: respect `prefers-reduced-motion` (fast-forward to results; no cinematic chase)  
- Home must not load the `playcanvas` chunk  
- Reuse `src/data/simulator.ts` ET / tree timings; do not invent new race times  
- Keep modules focused (&lt;300 lines where practical)  
- No test runner in repo — verify with `npm run build` + manual checklist per task  
- Imports at top of modules; dynamic `import('playcanvas')` only at PassCanvas / pass lib boundary  

## File map

| Path | Responsibility |
| --- | --- |
| `src/lib/paths.ts` | Add `PageId` / slugs `passet` / `pass` |
| `src/components/layout/useNavItems.ts` | Add `pass` to secondary nav |
| `src/App.tsx` | Lazy route for Pass page |
| `src/i18n/types.ts`, `sv.ts`, `en.ts` | `nav.pass` + `pass.*` + Home teaser strings |
| `src/pages/PassPage.tsx` (+ css) | Page shell |
| `src/components/home/PassTeaser.tsx` (+ css) | Home teaser; replaces DragstripSimulator |
| `src/components/pass/PassArena.tsx` (+ css) | HUD + orchestrates canvas |
| `src/components/pass/PassCanvas.tsx` | React ↔ PlayCanvas mount |
| `src/components/pass/PassFallback.tsx` | Static comparison if no WebGL |
| `src/lib/pass/types.ts` | Shared phase / bridge types |
| `src/lib/pass/quality.ts` | High/Low tier detection |
| `src/lib/pass/createApp.ts` | Application create / resize / destroy |
| `src/lib/pass/ease.ts` | `power2In` progress helper |
| `src/lib/pass/buildScene.ts` | Strip, tree, racers, lights, camera entities |
| `src/lib/pass/raceController.ts` | Phase timers + racer motion |
| `src/lib/pass/cameraDirector.ts` | Cinematic camera paths |
| `src/lib/pass/audioController.ts` | Mute, unlock, cues, pass loop |
| `public/audio/pass/*` | Placeholder audio files |
| Delete after cutover | `DragstripSimulator.tsx` / `.css` |

---

### Task 1: Routing, nav, i18n foundation + Pass page stub

**Files:**
- Modify: `src/lib/paths.ts`
- Modify: `src/components/layout/useNavItems.ts`
- Modify: `src/App.tsx`
- Modify: `src/i18n/types.ts`, `src/i18n/sv.ts`, `src/i18n/en.ts`
- Create: `src/pages/PassPage.tsx`
- Create: `src/pages/PassPage.css`

**Interfaces:**
- Consumes: existing `localePath`, `Layout` outlet pattern
- Produces: `PageId` includes `'pass'`; routes `/sv/passet`, `/en/pass`; `t.nav.pass`; stub page renders title

- [ ] **Step 1: Extend paths**

In `src/lib/paths.ts`, add `'pass'` to `PageId`, `SLUGS` (`sv: 'passet'`, `en: 'pass'`), `SLUG_TO_PAGE`, and `getPageIds()`.

- [ ] **Step 2: Secondary nav**

In `useNavItems.ts`, set:

```ts
const SECONDARY: PageId[] = ['pass', 'results', 'team', 'media']
```

- [ ] **Step 3: i18n**

Add to `NavKey`: `'pass'`.

`nav.pass`: SV `Passet` / EN `The pass`.

Add dictionary section (exact keys):

```ts
pass: {
  title: string
  lead: string
  stage: string
  again: string
  mute: string
  unmute: string
  webglFallback: string
  continueJourney: string
  status: {
    idle: string
    staging: string
    amber: string
    green: string
    racing: string
    finished: string
  }
  compare: {
    camaro: string
    f1: string
    jet: string
  }
}
```

SV/EN copy can migrate from current `home.simulator*` (same meaning). Keep `home.simulator*` temporarily until Task 2 retargets Home teaser.

Also add Home teaser keys now (used in Task 2):

```ts
// under home:
passTeaserTitle: string
passTeaserBody: string
passTeaserCta: string
```

SV example: title `Passet`, body one short line pointing to the live comparison, CTA `Öppna passet`.  
EN: `The pass` / CTA `Open the pass`.

- [ ] **Step 4: Stub PassPage + lazy route**

```tsx
// src/pages/PassPage.tsx
import { useId } from 'react'
import { useT } from '../i18n'
import './PassPage.css'

export default function PassPage() {
  const t = useT()
  const titleId = useId()
  return (
    <main className="pass-page" aria-labelledby={titleId}>
      <h1 id={titleId} className="pass-page__title">
        {t.pass.title}
      </h1>
      <p className="pass-page__lead">{t.pass.lead}</p>
    </main>
  )
}
```

In `App.tsx`:

```tsx
import { lazy, Suspense } from 'react'
const PassPage = lazy(() => import('./pages/PassPage'))
// routes:
<Route
  path="passet"
  element={
    <Suspense fallback={null}>
      <PassPage />
    </Suspense>
  }
/>
<Route
  path="pass"
  element={
    <Suspense fallback={null}>
      <PassPage />
    </Suspense>
  }
/>
```

- [ ] **Step 5: Verify**

Run: `npm run build`  
Expected: success. Manually open `/sv/passet` and `/en/pass` — stub title visible; “Mer” shows Passet.

- [ ] **Step 6: Commit**

```bash
git add src/lib/paths.ts src/components/layout/useNavItems.ts src/App.tsx \
  src/i18n/types.ts src/i18n/sv.ts src/i18n/en.ts \
  src/pages/PassPage.tsx src/pages/PassPage.css
git commit -m "$(cat <<'EOF'
Add Pass Arena route, nav, and i18n stub.

EOF
)"
```

---

### Task 2: Home PassTeaser (remove WebGL from Home path)

**Files:**
- Create: `src/components/home/PassTeaser.tsx`
- Create: `src/components/home/PassTeaser.css`
- Modify: `src/pages/HomePage.tsx`
- Optional later delete: `DragstripSimulator.*` (do in Task 8 after Arena works)

**Interfaces:**
- Consumes: `localePath(locale, 'pass')`, `t.home.passTeaser*`, `Button`, `Section`, `Reveal`
- Produces: Home CTA into Pass page; no canvas

- [ ] **Step 1: Implement PassTeaser**

Image: prefer existing plate e.g. `/images/santapod.jpeg` or a journey Santa Pod still. One composition: title, lead, image, CTA — no cards cluster.

```tsx
import { Link } from 'react-router-dom' // only if needed; prefer Button `to`
import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './PassTeaser.css'

export function PassTeaser() {
  const t = useT()
  const locale = useLocale()
  return (
    <Section className="pass-teaser">
      <Reveal>
        <h2 className="section__title">{t.home.passTeaserTitle}</h2>
        <p className="section__lead">{t.home.passTeaserBody}</p>
        <Button to={localePath(locale, 'pass')} icon>
          {t.home.passTeaserCta}
        </Button>
      </Reveal>
      <Reveal className="pass-teaser__media" delay={0.08} y={28}>
        <img
          src="/images/santapod.jpeg"
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden'
          }}
        />
      </Reveal>
    </Section>
  )
}
```

Style: full-bleed or wide media under copy; dark scrim; on-brand — not a SaaS card grid.

- [ ] **Step 2: Wire HomePage**

Replace `<DragstripSimulator />` with `<PassTeaser />`.

- [ ] **Step 3: Verify**

Home shows teaser; CTA navigates to Pass stub. DevTools Network: visiting Home does not fetch a `playcanvas` chunk.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/PassTeaser.tsx src/components/home/PassTeaser.css \
  src/pages/HomePage.tsx src/i18n/types.ts src/i18n/sv.ts src/i18n/en.ts
git commit -m "$(cat <<'EOF'
Replace Home simulator with Pass Arena teaser.

EOF
)"
```

---

### Task 3: Install PlayCanvas + app factory + quality + types

**Files:**
- Modify: `package.json` / lockfile via npm
- Create: `src/lib/pass/types.ts`
- Create: `src/lib/pass/quality.ts`
- Create: `src/lib/pass/createApp.ts`
- Create: `src/lib/pass/ease.ts`

**Interfaces:**
- Produces:

```ts
// types.ts
export type PassPhase =
  | 'idle'
  | 'staging'
  | 'amber'
  | 'green'
  | 'racing'
  | 'finished'

export type PassQuality = 'high' | 'low'

export type PassBridgeHandlers = {
  onPhase: (phase: PassPhase) => void
  onClock: (seconds: number) => void
  onFinished: () => void
  onWebglUnavailable: () => void
}

export type PassCommands = {
  stage: () => void
  reset: () => void
  setMuted: (muted: boolean) => void
  destroy: () => void
}
```

```ts
// quality.ts
export function detectPassQuality(): PassQuality
// low if matchMedia('(pointer: coarse)') OR innerWidth < 768 OR deviceMemory <= 4 when available
```

```ts
// createApp.ts
export async function createPassApp(canvas: HTMLCanvasElement, quality: PassQuality): Promise<{
  app: import('playcanvas').Application
  pc: typeof import('playcanvas')
  destroy: () => void
}>
```

```ts
// ease.ts
export function power2In(t: number): number // t in [0,1]
```

- [ ] **Step 1: Install**

Run: `npm install playcanvas`  
Expected: dependency listed; install succeeds.

- [ ] **Step 2: Implement `ease.ts`**

```ts
export function power2In(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x
}
```

- [ ] **Step 3: Implement `quality.ts` + `types.ts`** as above.

- [ ] **Step 4: Implement `createApp.ts`**

Use modern PlayCanvas imports (`Application`, `FILLMODE_NONE` or fill parent, `RESOLUTION_AUTO`). Cap `app.graphicsDevice.maxPixelRatio` to `1.25` on low, `2` on high. Attach resize listener that calls `app.resizeCanvas()`. `destroy()` removes listener and calls `app.destroy()`.

Fill mode: size canvas to parent via CSS `width/height 100%` and `app.resizeCanvas()` — do **not** force full window if the stage is a page section.

- [ ] **Step 5: Verify**

Run: `npm run build`  
Expected: success (even if createApp unused yet).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/pass/
git commit -m "$(cat <<'EOF'
Add PlayCanvas pass engine helpers and quality tiers.

EOF
)"
```

---

### Task 4: Scene build (strip, tree, vehicles, lights, camera)

**Files:**
- Create: `src/lib/pass/buildScene.ts`

**Interfaces:**
- Consumes: `pc` namespace + `app` + `PassQuality`
- Produces:

```ts
export type PassScene = {
  camera: import('playcanvas').Entity
  treeBulbs: {
    stage: import('playcanvas').Entity[]
    amber: import('playcanvas').Entity[]
    green: import('playcanvas').Entity[]
  }
  racers: Record<'camaro' | 'f1' | 'jet', import('playcanvas').Entity>
  trackLength: number // world units from start to finish
  setTreeLights: (mode: 'off' | 'stage' | 'amber' | 'green') => void
  resetRacers: () => void
}

export function buildPassScene(
  app: import('playcanvas').Application,
  pc: typeof import('playcanvas'),
  quality: PassQuality,
): PassScene
```

- [ ] **Step 1: Build environment**

- Ground plane / long box as asphalt (`render` type `box` or `plane`), dark material.  
- Center line / lane markers with thin boxes (restrained).  
- Finish chequer thin boxes at `trackLength`.  
- Christmas tree: vertical pole + bulb entities (emissive materials) near start.  
- Lights: one directional; optional second fill on high only. Clear color near `#0a0c10`.  
- Fog optional subtle if cheap.

- [ ] **Step 2: Vehicles**

Use `render` primitives (boxes) with different scales:

| id | scale hint | color |
| --- | --- | --- |
| camaro | largest | primary blue ~ `42/255, 79/255, 154/255` |
| f1 | smaller/lower | silver |
| jet | long/thin | muted gray |

Place side-by-side at x=0 lanes (z offsets). Store start positions for reset.

- [ ] **Step 3: Camera**

Perspective camera behind/side start looking toward finish. Return entity for `cameraDirector`.

- [ ] **Step 4: Tree helper**

`setTreeLights` toggles emissive intensity / enabled state on bulb materials.

- [ ] **Step 5: Verify**

Temporarily mount in PassCanvas smoke (Task 5) OR unit-less: `npm run build` after Task 5. If building alone, export compiles.

- [ ] **Step 6: Commit**

```bash
git add src/lib/pass/buildScene.ts
git commit -m "$(cat <<'EOF'
Build stylized Pass Arena PlayCanvas scene.

EOF
)"
```

---

### Task 5: Race controller + camera director + PassCanvas bridge

**Files:**
- Create: `src/lib/pass/raceController.ts`
- Create: `src/lib/pass/cameraDirector.ts`
- Create: `src/components/pass/PassCanvas.tsx`
- Create: `src/components/pass/PassCanvas.css`

**Interfaces:**
- Consumes: `simulatorRacers`, `TREE_STAGE_MS`, `TREE_AMBER_MS`, `buildPassScene`, `createPassApp`, `power2In`
- Produces: `PassCommands` via `onReady(commands)`

```ts
// raceController.ts
export function createRaceController(opts: {
  app: import('playcanvas').Application
  scene: PassScene
  reducedMotion: boolean
  handlers: PassBridgeHandlers
  onRaceFrame?: (progress01: number, clock: number) => void
}): {
  stage: () => void
  reset: () => void
  destroy: () => void
}
```

```ts
// cameraDirector.ts
export function createCameraDirector(opts: {
  camera: import('playcanvas').Entity
  camaro: import('playcanvas').Entity
  trackLength: number
  reducedMotion: boolean
}): {
  onIdleLook: (dx: number, dy: number) => void
  onPhase: (phase: PassPhase) => void
  onRaceProgress: (t01: number) => void
  reset: () => void
  destroy: () => void
}
```

- [ ] **Step 1: Race controller logic**

Mirror Home simulator phases:

1. `stage()` ignored if already staging/amber/green/racing  
2. `staging` for `TREE_STAGE_MS` → tree stage lights  
3. `amber` for `TREE_AMBER_MS`  
4. `green` ~180ms  
5. `racing`: each frame, for each racer `u = power2In(min(1, elapsed/et))`, set local x = `u * trackLength`  
6. Clock = elapsed seconds; complete when elapsed >= max(et); then `finished`  

`reducedMotion`: after short staging flash (~200ms), snap racers to finish positions, set clock to max ET, `finished` — no chase.

Clear timers on `reset`/`destroy`. Pause updates when `document.visibilityState === 'hidden'` (freeze clock).

- [ ] **Step 2: Camera director**

- Idle: allow small yaw from `onIdleLook` (clamp ±12°).  
- Staging/amber: ease toward tree.  
- Racing: follow camaro with look-ahead along track.  
- Finished: pull back slightly.  
- `reducedMotion`: keep static wide shot.

- [ ] **Step 3: PassCanvas**

```tsx
type Props = {
  muted: boolean
  reducedMotion: boolean
  onPhase: (p: PassPhase) => void
  onClock: (s: number) => void
  onFinished: () => void
  onWebglUnavailable: () => void
  onReady: (commands: PassCommands) => void
}

export function PassCanvas(props: Props) {
  // canvas ref
  // useEffect: createPassApp → buildPassScene → raceController → cameraDirector
  // pointer drag idle look
  // props.muted → audio later; for now store
  // cleanup destroy
}
```

Dynamic import inside effect:

```ts
const pc = await import('playcanvas')
```

Wire `onReady({ stage, reset, setMuted, destroy })`.

- [ ] **Step 4: Smoke on PassPage**

Temporarily render `<PassCanvas … />` full width (~70vh) with local state logging phases — or jump to Task 6 HUD.

- [ ] **Step 5: Verify**

Run: `npm run build`. Open Pass page: scene visible; Stage moves cars; Camaro finishes first visually.

- [ ] **Step 6: Commit**

```bash
git add src/lib/pass/raceController.ts src/lib/pass/cameraDirector.ts \
  src/components/pass/PassCanvas.tsx src/components/pass/PassCanvas.css
git commit -m "$(cat <<'EOF'
Wire Pass race controller and PlayCanvas canvas bridge.

EOF
)"
```

---

### Task 6: PassArena HUD + PassPage composition + fallback

**Files:**
- Create: `src/components/pass/PassArena.tsx`
- Create: `src/components/pass/PassArena.css`
- Create: `src/components/pass/PassFallback.tsx`
- Modify: `src/pages/PassPage.tsx`, `src/pages/PassPage.css`

**Interfaces:**
- Consumes: `PassCanvas`, `simulatorRacers`, `Button`, `t.pass.*`, `localePath(..., 'journey')`
- Produces: full page UX per spec §1

- [ ] **Step 1: PassFallback**

Static ordered list of racers (sort by `et`) with names/speeds + `t.pass.webglFallback` message. No canvas.

- [ ] **Step 2: PassArena**

State: `phase`, `clock`, `muted` (default `true`), `webglOk` (default true), `commandsRef`.

UI:

- Status `role="status" aria-live="polite"`  
- Clock `toFixed(2)`  
- Stage / Again button when idle or finished  
- Mute / Unmute toggle  
- Results `<ol>` when finished (highlight camaro)  
- Link: `t.pass.continueJourney` → journey  

Decorative tree bulbs optional in HUD (aria-hidden) OR rely on 3D tree only — prefer **3D tree only** to avoid duplicate chrome.

Detect reduced motion once:

```ts
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

- [ ] **Step 3: PassPage**

Near full-bleed arena under header; title/lead can be visually minimal or overlay eyebrow — keep one clear `h1` for a11y (visually discreet OK).

- [ ] **Step 4: Verify**

Full Stage → finish → results; Journey link works; keyboard can activate Stage/Mute.

- [ ] **Step 5: Commit**

```bash
git add src/components/pass/PassArena.tsx src/components/pass/PassArena.css \
  src/components/pass/PassFallback.tsx src/pages/PassPage.tsx src/pages/PassPage.css
git commit -m "$(cat <<'EOF'
Add Pass Arena HUD, fallback, and page shell.

EOF
)"
```

---

### Task 7: Audio (tree cues + motor/pass loop)

**Files:**
- Create: `src/lib/pass/audioController.ts`
- Create: `public/audio/pass/tree-tick.wav` (or `.mp3`)
- Create: `public/audio/pass/green.wav`
- Create: `public/audio/pass/launch.wav`
- Create: `public/audio/pass/pass-loop.wav` (short seamless-ish loop)
- Create: `public/audio/pass/finish.wav`
- Modify: `PassCanvas` / race wiring to call audio on phase

**Interfaces:**

```ts
export function createPassAudio(): {
  setMuted: (muted: boolean) => void
  unlock: () => Promise<void> // call from Stage click
  onPhase: (phase: PassPhase) => void
  destroy: () => void
}
```

- [ ] **Step 1: Placeholder assets**

Generate short placeholder WAVs (even near-silent beeps) via a one-off node script **run once** and delete the script, OR craft minimal files in `public/audio/pass/`. Document filenames exactly as above.

Prefer real short whoosh/loop if available in project; else procedural placeholders are fine for v1.

- [ ] **Step 2: audioController**

- Default muted.  
- `unlock()` resumes AudioContext / primes HTMLAudioElements (must run in Stage click path).  
- Phase map: staging/amber → tick; green → green+launch; racing → start/loop `pass-loop`; finished → stop loop + finish cue.  
- Missing file: catch `error`, continue silent.  
- `destroy()` pause all, remove listeners.

- [ ] **Step 3: Wire**

On Stage: `await audio.unlock()` then `race.stage()`.  
`setMuted` from HUD.  
On unmount: `audio.destroy()`.

- [ ] **Step 4: Verify**

Muted by default (no sound). Unmute + Stage: cues + loop during race; leave page → silence.

- [ ] **Step 5: Commit**

```bash
git add src/lib/pass/audioController.ts public/audio/pass/ \
  src/components/pass/PassCanvas.tsx
git commit -m "$(cat <<'EOF'
Add gesture-gated Pass Arena audio cues and loop.

EOF
)"
```

---

### Task 8: Polish, retire 2D simulator, acceptance

**Files:**
- Delete: `src/components/home/DragstripSimulator.tsx`, `DragstripSimulator.css` (if unused)
- Modify: i18n — remove obsolete `home.simulator*` only if nothing references them  
- Modify: CSS polish for PassArena / PassTeaser / PassPage  
- Modify: `AGENTS.md` only if user asks (skip unless needed)

- [ ] **Step 1: Remove dead simulator**

Grep for `DragstripSimulator` / `home.simulator` — delete component files; clean i18n keys no longer referenced; keep `src/data/simulator.ts`.

- [ ] **Step 2: Visibility + context loss**

Confirm tab hide pauses race clock; WebGL fail shows `PassFallback`.

- [ ] **Step 3: Acceptance checklist**

1. Home teaser only; no playcanvas chunk on Home  
2. `/sv/passet` + `/en/pass` race; Camaro 5.74s wins  
3. Mute/unmute + audio stops on navigate away  
4. Mobile: completes; DPR capped (inspect `maxPixelRatio`)  
5. `prefers-reduced-motion`: fast results, no chase  
6. EN/SV parity for teaser + HUD  
7. `npm run build` passes  

- [ ] **Step 4: Commit**

```bash
git add -u src/components/home/DragstripSimulator.tsx \
  src/components/home/DragstripSimulator.css \
  src/i18n/types.ts src/i18n/sv.ts src/i18n/en.ts \
  src/components/pass/ src/pages/PassPage.css src/components/home/PassTeaser.css
git commit -m "$(cat <<'EOF'
Polish Pass Arena and remove legacy 2D home simulator.

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
| --- | --- |
| Hybrid Home teaser + own page | 1, 2, 6 |
| Routes `/sv/passet` `/en/pass` + secondary nav | 1 |
| Cinematic Stage→tree→race→results | 4, 5, 6 |
| Stylized assets / Camaro hero | 4 |
| Full 3D mobile low tier | 3, 4 |
| Rich audio gesture-gated | 7 |
| Reduced motion fast-forward | 5 |
| WebGL fallback | 6 |
| Lazy PlayCanvas (not on Home) | 1, 2, 5 |
| Reuse simulator.ts timings | 5 |
| Retire 2D simulator | 8 |

## Placeholder scan

No TBD steps; audio placeholders are concrete filenames; verification uses `npm run build` + manual checks (no vitest in repo).

## Type consistency

- `PassPhase`, `PassCommands`, `PassBridgeHandlers`, `PassScene`, `PassQuality` defined in Task 3–4 and consumed unchanged in 5–7.  
- Modern PlayCanvas uses `render` components (not legacy `model`).
