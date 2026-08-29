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
