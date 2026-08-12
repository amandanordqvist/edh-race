# Pass Arena — Camaro GLB

- **File:** `camaro.glb` (web-optimized, ~6 MB)
- **Source backup:** `camaro.source.glb` (original Tripo export, ~41 MB — not required at runtime)
- **Generator:** [Tripo3D](https://tripo3d.ai)

Used in PlayCanvas Pass Arena (`/sv/passet`, `/en/pass`).

`src/lib/pass/loadCamaroGlb.ts` auto-fits any replacement GLB:
- scales longest horizontal axis to ~4.2 m
- yaws so that axis points down the strip (+X); flip via `CAMARO_YAW_FLIP_DEG` (`0` / `180`) after visual QA
- re-grounds from the live mesh AABB after scale
- keeps textured paint (does not force EDH blue over albedo maps)
- skips logo decals when the scan already has textures — **brand paint comes from the scan**

Wheel spin is disabled on Tripo meshes (wrong pivots). Burnout smoke uses fixed parent-space rear anchors instead.

To replace: drop a new `camaro.glb` here (prefer &lt;10 MB / &lt;200k tris for mobile).
