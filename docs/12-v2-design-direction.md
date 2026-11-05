> **V3 update:** the navigation, hero, product frames, scent discovery, Instagram and footer described below were revised in `docs/17-v3-creative-correction.md` (white floating nav with an unframed centred logo, product-stage hero, scent selector, seamless marquee). Typography, colour, curved sheets and libraries decisions here still stand.

# 12 — V2 design direction, typography, navigation, search, motion

## Direction
**Perfume counter, edited for the screen.** One large pink field (sampled from the packaging and the logo's pink), warm paper, near-black ink and a deeper rose for text. Sections are **curved sheets** that overlap each other; images are masked into **arches and circles** that echo the logo's curve; type is large, geometric and tight. Rounded geometry is deliberate and sparing — never a card around everything.

## Typography
Compared on the real copy (`docs/media/type-comparison.png`): Geist, Inter, DM Sans, Manrope — *Golden Goddess, Dark Desire, Request a Specific Scent, Mixed Scent Package, Choose your scent, Add to bag, Your bag, Delivery and returns, Graceful Divine Melts*.
- Geist and Inter: clean but read as software UI at display size.
- Manrope: distinctive but the numerals and "a" feel stiff for fragrance.
- **DM Sans (chosen):** geometric, friendly and crisp; bold weights hold at very large sizes, tight tracking looks modern, numerals are even. One family, no serif, no italics.
| Role | Size (fluid) | Weight | Tracking | Line height |
|---|---|---|---|---|
| Display / h1 | 3.1 → 10 rem | 700 | −0.05em | 0.9 |
| h2 | 2.3 → 5.2 rem | 700 | −0.045em | 0.95 |
| h3 | 1.7 → 3 rem | 650 | −0.035em | 1.0 |
| h4 / item titles | 1.2 → 1.55 rem | 600–650 | −0.02em | 1.15 |
| Body | 1 rem | 400–500 | 0 | 1.55 |
| Labels | 0.78 rem caps | 700 | +0.14em | 1.2 |
Self-hosted variable WOFF2 (36.9 kB, latin), `font-display: swap`, preloaded; SIL OFL licence in `assets/`.

## Navigation (implemented)
- **Desktop:** a floating dark bar with soft asymmetric corners, a white **logo coin** overlapping its left edge as the anchor, links *Shop · Discover Scents · Custom Scent · About*, a quiet *Search* pill and a pink *Bag* pill with count. *Shop* opens a curved dropdown (children from the menu + a featured product).
- **Scroll:** past 24 px the bar shrinks and flips to paper with a soft shadow (one class on `<html>`, rAF-throttled). It never hides, so position is predictable.
- **Mobile:** coin + search + bag + menu. Menu opens a full-height rounded **sheet** with 3rem type, sub-links as chips, secondary links, email and social icons. Native `<dialog>`: focus trap, Esc, focus return (tested).
- FAQ and Contact live in the secondary menu, footer and contextual links, as briefed.

## Search overlay (implemented)
Desktop: a large anchored panel under the nav; mobile: full screen. Opening shows **shortcuts** (editable blocks), suggested families and **Popular scents** (from a chosen collection). Typing (≥ 2 chars, 200 ms debounce) calls Shopify's **predictive search** section (`/search/suggest`) and renders thumbnail, name, price, availability. ARIA combobox/listbox, ↑/↓/Enter, first Esc clears, second closes, clear button, loading, empty, **error with retry**, polite live-region result counts, "see all results". No local product array exists — results are always Shopify's.

## Motion (small, purposeful)
Nav compaction; search/menu rise-in; scent-explorer crossfade; hero hotspot pulse; reveal-on-scroll for rail/catalogue items; image hover zoom; sticky bag bar slide; rail arrows with scroll-snap. No scroll-jacking, no per-heading animation. `prefers-reduced-motion` disables all animation and reveals; video autoplay is also disabled when reduced-motion or data-saver is on.

## Libraries and weight
| Item | Added? | Size | Note |
|---|---|---|---|
| `assets/base.css` | yes | 60 kB raw / **12.2 kB gzip** | single render-blocking stylesheet |
| `assets/theme.js` | yes | 17.4 kB raw / 5.6 kB gzip (**4.0 kB gzip if minified**) | no dependencies |
| DM Sans WOFF2 | yes | 36.9 kB | preloaded |
| **GSAP** | **no** | ≈ 27 kB gzip core (third-party aggregators; unverified) | everything needed is CSS transitions + IntersectionObserver |
| **Embla** | **no** | ≈ 7 kB gzip (third-party aggregators) | CSS scroll-snap + two buttons covers rails and the gallery; revisit only for drag-inertia or looping |
| Framer / React | **no** | — | not a storefront dependency |

## Reference study (honest scope)
Read: Framer's free-component listing (names only: *Floating Pill Nav, Curved Carousel, Scroll Sync Showcase, Filterable Gallery, Switching Tabs Card, Playful Nudge Footer, Snapshot Footer, Text Reveal*), Segment UI's remix page (marketing page only), Embla's homepage, GSAP size claims. Component **implementations were not retrievable** (marketplace code is gated and React-based), so nothing was copied; only the interaction ideas were reproduced in plain HTML/CSS/JS:
| Pattern seen | Reproduced as |
|---|---|
| Floating pill nav | Floating curved bar + logo coin (not a frosted capsule) |
| Curved carousel / product rails | Scroll-snap rail with staggered offsets and arrow buttons |
| Switching tabs card | Scent explorer (ARIA tabs, crossfade) |
| Footer with big type | Oversized wordmark ending |
| Scroll reveals | IntersectionObserver fade-up on rail/catalogue items only |
| Bottom sheet | Mobile menu and full-screen search sheets (`<dialog>`) |
Not adopted: 3D galleries, scroll-synced showcases, lightbox, Lenis smooth-scroll (scroll-jacking risk, weight).
