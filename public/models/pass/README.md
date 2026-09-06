# Pass Arena — 3D assets

## In use

| File | Role |
| --- | --- |
| `pass/camaro.glb` | Hero car |
| `2004_ferrari_f2004.glb` | F1 opponent (studio cage meshes stripped at load) |
| `c17_plane_game-ready.glb` | Jet opponent — pick **Passagerarflyg** / **Passenger jet** |
| `dragster_race_christmas_tree.glb` | Christmas tree between the lanes |
| `kloofendal_48d_partly_cloudy_puresky_2k.hdr` | Daytime skybox + IBL (Poly Haven PureSky, CC0) |
| `pass/asphalt_track_diff_1k.jpg` | Track albedo (Poly Haven *asphalt_track*, 1k to stay under ~1.5 MB with roughness) |
| `pass/asphalt-rough.jpg` | Track roughness |

`loadFittedGlb` strips Sketchfab studio cages, then scales/yaws/grounds the mesh.

## Do not load

| File | Why |
| --- | --- |
| `rosendal_plains_2_2k.exr` / `pass/env-day.hdr` | Landscape photo, not a sky |
| `sunflowers_puresky_2k.hdr` | PureSky still has a sunflower field on the ground band |
| `asphalt_track_rough_2k.exr` | Roughness only; PlayCanvas cannot load EXR in-browser |

## Still useful

| Priority | File | Why |
| --- | --- | --- |
| 1 | `krail.glb` | White concrete wall segment (~4 m) |

Layout stays in code. Crowd cards, spectator/tree billboards, and burnout puffs are generated at runtime.

## Camaro refinement (2026-09-06)

`camaro.glb` now retains and smooths the original Tripo body, with new analytic
slicks/rims, four hub-centred wheel nodes, blower, recessed eight-aperture intake,
fuel fittings, exhausts and a simplified roll cage. Paint, carbon, polycarbonate,
rubber and metal use separate PBR materials. The front fascia keeps its original
albedo image; no new sponsor textures or edited photo textures are included.

The photographic references are `camaros10.webp`, `camaros11.jpg`,
`camaros13.webp` and `camaros14.jpg`. This is a photo-guided refinement, not a
dimensionally measured CAD replica. The retained body and fascia still inherit
some reconstruction irregularities. Cabin structure and hidden engine details
are approximations; no engineering or fabrication accuracy is claimed.

The model keeps the original normalized scale and +X forward convention.
`edh-wheel-fl/fr/rl/rr` have local Z axles and hub translations. `loadCamaroGlb`
continues to fit the asset to the existing scene; `camaroWheelSpin` handles the
new pivots as well as the primitive fallback. Runtime remains PlayCanvas.

### Reproduce and review

Node 22.16+ is needed for the standalone TypeScript wheel check. Python build
dependencies are tooling only; they are not website dependencies.

```sh
python3 -m venv /tmp/edh-camaro-build
/tmp/edh-camaro-build/bin/pip install numpy Pillow fast-simplification==0.2.0
mkdir -p .tmp-verify
git show 3f1031df4b0e5f2823bff98665cd75eead43cb77:public/models/pass/camaro.glb > .tmp-verify/camaro-original.glb
/tmp/edh-camaro-build/bin/python tools/refine-camaro.py --source .tmp-verify/camaro-original.glb
node --experimental-strip-types tools/check-camaro.mjs
npm run build
npm run dev
```

Open `/tools/camaro-preview.html` on the local Vite server to compare the original
and refined model under identical lighting, rotate/zoom, select front/side/rear
views, or check wheel rotation. This Swedish review utility is development-only
and is not added to the site's production routes. The original comparison button
is disabled if the local baseline file is absent. The builder refuses an already
refined model as input, so rerunning cannot progressively deform the asset.
