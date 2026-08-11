# Task 8 Report: Polish, retire 2D simulator, acceptance

## Scope completed

- Deleted legacy Home simulator files:
  - `src/components/home/DragstripSimulator.tsx`
  - `src/components/home/DragstripSimulator.css`
- Removed obsolete `home.simulator*` keys from:
  - `src/i18n/types.ts`
  - `src/i18n/en.ts`
  - `src/i18n/sv.ts`
- Kept `src/data/simulator.ts` unchanged.
- Kept `home.passTeaser*` keys unchanged.
- No CSS polish was applied because no clearly broken PassArena / PassTeaser / PassPage issue was identified from code review or build output.

## Verification

### Dead simulator cleanup

- `DragstripSimulator` has no remaining references under `src/`.
- `home.simulator*` keys have no remaining references under `src/`.

### Visibility pause + WebGL fallback

- Visibility pause path confirmed in `src/lib/pass/raceController.ts`:
  - listens to `visibilitychange`
  - stores hidden time
  - offsets `raceStartAt` when the tab becomes visible again
  - skips race-frame updates while hidden
- WebGL fallback path confirmed:
  - `src/components/pass/PassCanvas.tsx` calls `onWebglUnavailable()` on startup failure
  - `src/components/pass/PassArena.tsx` switches to `<PassFallback />` when WebGL is unavailable

## Acceptance checklist

1. Home teaser only; no PlayCanvas chunk on Home
   - Verified statically.
   - `HomePage` renders `PassTeaser`.
   - `PassPage` is lazy-loaded from routing, so Pass Arena stays off the Home route.

2. `/sv/passet` + `/en/pass` race; Camaro 5.74s wins
   - Routes verified statically in `src/App.tsx`.
   - Winner/timing logic verified statically from shared `simulatorRacers` ordering and ET values.
   - Not browser-verified in this task.

3. Mute/unmute + audio stops on navigate away
   - Verified statically.
   - `PassArena` toggles `setMuted`.
   - `PassCanvas` cleanup calls `audio.destroy()` on unmount.
   - Not browser-verified in this task.

4. Mobile: completes; DPR capped
   - DPR cap verified statically in `src/lib/pass/createApp.ts` with `maxPixelRatio` set to `1.25` on low quality and `2` otherwise.
   - Completion on mobile was not browser/device-verified in this task.

5. `prefers-reduced-motion`: fast results, no chase
   - Verified statically.
   - `PassArena` reads reduced motion once.
   - `raceController` snaps racers to finish and completes through the reduced-motion path.
   - Camera director receives `reducedMotion`.
   - Not browser-verified in this task.

6. EN/SV parity for teaser + HUD
   - Verified statically.
   - EN and SV dictionaries both contain `home.passTeaser*` and `pass.*` entries used by teaser and HUD.

7. `npm run build` passes
   - Passed.
   - Build emitted non-fatal PlayCanvas/Vite warnings about browser externalization for worker-related modules and large chunk sizes, but the production build completed successfully.

## Notes

- No unrelated WIP was modified.
- `AGENTS.md` was not touched.
