# 10 — V2 visual audit of the first demo

Captured 2026-11-05 from `gracefuldivinemelts.vercel.app` with headless Chromium at 1440 px and 390 px (full-page). Evidence image: `docs/media/v1-demo-baseline.jpg`. I also re-read every page and component at six widths while rebuilding (360 / 390 / 430 / 768 / 1024 / 1440).

## What the first demo got right (kept)
- A working functional spine: native forms, add-to-cart, variants, cart updates, search endpoints, policies, 404 and empty states, no-JS fallbacks. All retained and extended.
- Real product photography at 3:4, real copy, real prices, sold-out states.
- Accessibility basics: skip link, focus styles, native `<dialog>`, `details` accordions, labelled forms.
- The bundle remained variant-based, untouched.

## What failed visually (replaced, not polished)
| Area | Finding | V2 response |
|---|---|---|
| Identity | Serif display type tried to copy the logo; felt like a wedding stationer, not a 2026 shop | DM Sans only; the logo stays the only decorative letterform |
| Hero | Left text / right rectangular image — the default template | Type and media form one composition: oversized headline, arch-masked photo, circular inset, live product hotspot |
| Section rhythm | Rectangle after rectangle; every section a flat band with a hairline | Full-bleed curved "sheets" that overlap, alternating paper, blush, pink, ink |
| Product grid | Uniform tiles, same crop, same label stack | Borderless rail with arch/rounded crops, staggered offsets, family labels, arrow controls |
| Scent discovery | A text list of three families | Interactive explorer: large type switches a live preview of real products by family |
| Custom scent | Buried as a product among 13 | A full dark section with a typed-scent form that carries the text into the product page |
| Bundle | Dark box with bullets | Organic-mask photo with numbered pins, included list, scent thumbnails, price, one CTA |
| Story | Absent | Editorial section built from the Shop-profile story and the pouring photo |
| Social | Absent | Curated media rail (video + photos, mixed aspect ratios) with a follow card |
| Navigation | Standard header, text links, icon buttons | Floating curved bar, logo coin, Shop dropdown with featured product, compact-on-scroll, mobile sheet |
| Search | Basic form + list | Overlay with shortcuts, popular scents, live results with price and availability, combobox keyboard support, states |
| Footer | A few link columns | Closing line, four link groups incl. Instagram / Google / Shop profile, oversized wordmark |
| Mobile | Desktop stacked | Per-section compositions: stacked hero stage with overlapping orb, chip tabs, sticky bag bar on product pages, full-screen search, sheet menu |
| Defect | One product image (Midnight Drift) was blank on Vercel | Build now retries downloads and fails loudly if any image is missing |

## Principles used for the rebuild
1. A section must have a distinct job; none repeats another's content.
2. Curved geometry belongs to full-bleed sheets and image masks, not to boxes around content.
3. Imagery is the hero of every section; type is large, plain and tightly set.
4. Everything dynamic uses a Shopify mechanism (see doc 14).
