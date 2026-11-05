# 02 — Design system

Single stylesheet `assets/base.css`; tokens at the top. Brand colours are theme settings (Theme settings → Brand colours); everything else is fixed so the owner cannot accidentally break the system.

## Tokens
| Role | Token | Value |
|---|---|---|
| Paper | `--c-paper` | #FCF7F4 |
| Ink | `--c-ink` | #1A1214 |
| Blush surface | `--c-blush` | #F9E3EC |
| Brand pink (decorative only) | `--c-pink` | #F26BB0 |
| Rose (links, buttons hover, accents) | `--c-rose` | #A5256B |
| Error / OK | `--c-error` / `--c-ok` | #B3261E / #1F6B45 |
Contrast checked by calculation (see doc 07): ink on paper 17.3:1, rose on paper 6.4:1, rose on blush 5.6:1, white on rose 6.8:1, white on ink 18.4:1 (all pass WCAG AA for body text). Pink is never used for text.

**Type:** Bodoni Moda (display, variable 400–900, roman + italic) and Hanken Grotesk (text, variable). Both SIL OFL, self-hosted woff2 (latin subset, ≈90 kB total), `font-display: swap`, display + text preloaded. Licences ship in `assets/`. Scale is fluid: `--t-h1` 2.5→6rem, `--t-h2` 2→3.75rem, body 1.0625rem.
**Spacing:** 4px base `--s-1…--s-9`; section rhythm `clamp(3.5rem, 2rem+6vw, 7.5rem)`; fluid gutter.
**Layout:** page width 1320px (setting), prose 40rem, narrow 52rem.
**Breakpoints:** 600 / 760 / 900 / 990 / 1100px.
**Shape:** images 3px, controls 2px, hairline 1px borders; no shadows except the toast.
**Image ratios:** product cards and gallery 3:4 (matches existing 1086×1448 photography), square option in settings, bundle gallery switches to 1:1 automatically.
**Buttons:** primary (ink fill → rose on hover), secondary (outline), light (on dark). Min height 48px. **Inputs:** 16px text (no iOS zoom), 1px strong border, rose focus.
**Focus:** 2px rose outline (white on dark), 3px offset. **Motion:** 220ms ease; reveal-on-scroll added by JS only and disabled under `prefers-reduced-motion`.

## Components
Announcement bar · header (inline nav ≥990px, native `<dialog>` menu and search below) · hero · key points · product card (family label, sold-out/sale badge, optional quick add) · scent-family index · bundle spotlight · image+text · FAQ accordion (native `<details>`) · scent-notes ladder · option chips (pair style for bundles) · quantity stepper · notices (error/ok/info) · pagination · breadcrumbs · toast · footer.

## Signature moves
1. The **notes ladder** (top / heart / base in Bodoni on hairlines).
2. The **smoke wisp** ornament derived from the logo's curl, used once per page.
3. **Ink bundle panel** — the only large dark block on the home page.
