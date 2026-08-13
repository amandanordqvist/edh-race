# Pass Arena — 3D assets

## In use

| File | Role |
| --- | --- |
| `pass/camaro.glb` | Hero car |
| `2004_ferrari_f2004.glb` | F1 opponent (studio cage meshes stripped at load) |
| `c17_plane_game-ready.glb` | Jet opponent — pick **Passagerarflyg** / **Passenger jet** |
| `dragster_race_christmas_tree.glb` | Christmas tree between the lanes |
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
| 1 | `asphalt_track_diff_2k.jpg` (Poly Haven *asphalt_track*, **Color / Diffuse**) | Roughness alone does not paint the strip |
| 2 | `krail.glb` | White concrete wall segment (~4 m) |

Do **not** need a full track GLB. Layout stays in code.
