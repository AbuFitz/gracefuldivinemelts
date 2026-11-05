# 02 — Design system (V2)

The V2 system replaces the first version. Full rationale, type comparison, navigation, search, motion and dependency weights are in **doc 12**; tokens live at the top of `assets/base.css`.

## Tokens
| Role | Token | Default | Setting |
|---|---|---|---|
| Paper | `--c-paper` | #FFFAFB | Theme settings → Brand colours |
| Ink | `--c-ink` | #170A10 | yes |
| Blush surface | `--c-blush` | #FBE4EE | yes |
| Pink field (large areas) | `--c-field` | #F7B9D1 | yes |
| Brand pink (decorative) | `--c-pink` | #F26BB0 | yes |
| Rose (text accents, hover) | `--c-rose` | #A5256B | yes |
Contrast (calculated): ink on paper 17.3:1, rose on paper 6.4:1, white on rose 6.8:1, white on ink 18.4:1. Pink is never used for body text.

**Type:** DM Sans variable only (see doc 12 table). **Space:** 4 px base `--s-1…--s-9`; fluid section rhythm; gutter `clamp(1.25rem, .5rem + 3.6vw, 3.5rem)`. **Layout:** 1360 px page, 38 rem prose. **Shape:** `--r-soft` 28 px, arch `999px 999px 28px 28px`, pill controls, curved sheet radius `clamp(28px, 6vw, 84px)`. **Motion:** 240 ms ease; all disabled under reduced-motion. **Focus:** 2 px rose outline (white on dark).

## Components
Floating nav + dropdown · menu sheet · search overlay · hero (arch, orb, hotspots) · product rail and item · scent explorer · custom-scent feature · bundle showcase · editorial story · media rail and video tile · FAQ accordion · review links · curved page head · catalogue (staggered) · product gallery/mosaic · pair picker with faces · sticky bag bar · bag · oversized footer.
