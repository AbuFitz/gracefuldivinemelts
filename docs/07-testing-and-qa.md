> **V2 supersedes the results below. See doc 16** (Theme Check clean, 23/23 interaction tests, six-width layout checks, 46 screenshots, and the list of what still needs a Shopify store).

# 07 — Testing and QA

## What was run (2026-11-05)
| Check | Tool | Result |
|---|---|---|
| Shopify Theme Check (`theme-check:recommended`) | `@shopify/theme-check-node` via `tools/theme-check.mjs` | **0 errors, 0 warnings** |
| Translation keys | Theme Check + preview runtime | none missing |
| Interaction tests | `tools/preview/e2e.mjs` (Playwright/Chromium, local mock of Shopify endpoints) | **21 / 21 pass** |
| Full-page captures + automatic checks | `tools/preview/shots.mjs` at 390, 820, 1440 px | no horizontal overflow, one `<h1>` per page, no console errors (excluding intended 404s); tap-target and overflow defects found and fixed |
| Contrast | calculated from tokens | AA for all text pairs (doc 02) |

Pages captured and visually reviewed: home, collection (with filters), product, bundle, cart (filled), FAQ, contact, care & safety, delivery & returns, find your scent, 404, search (no results), privacy policy, login. Defects found and fixed during review: lazy images missing in captures, filter panel overflow on mobile, bundle option boxes nested incorrectly, contact field misalignment, duplicate inspired-by disclaimer, footer links missing from the section group, 4-column setting never applying (string vs number), missing `h1` on Find your scent, sub-24px footer targets, wrapped arrow glyphs.

Interaction tests cover: mobile menu + Esc/focus return, predictive search, add to cart (mobile), sold-out blocking, quantity, bundle variant switch (id, URL, price), bundle in cart, cart quantity/remove/empty, checkout form wiring, quick add, scent-family filter and chip removal, empty-filter state, search hit and no-hit, contact validation and success, newsletter success, FAQ toggle, skip link, 404 status, cookie-prefs fallback, reduced motion, no-JS add to cart.

## What this does NOT prove
The preview (`tools/preview`) is a **local approximation** of Shopify's Liquid runtime built with LiquidJS and a hand-written mock of the storefront AJAX endpoints. Real Shopify may differ in: filter/paginate objects, predictive search, recommendations, dynamic checkout, spam protection, customer-account forms, theme editor behaviour, image CDN output, section rendering. **No Shopify development store was available**, so none of these were run on Shopify, the theme editor was not exercised, and no checkout was reached. Keyboard/screen-reader testing was limited to automated checks and the Playwright keyboard tests above; no assistive-technology run was done. No Lighthouse/Core Web Vitals measurement was taken.

## Required on a development store before launch
1. `shopify theme check` clean; `shopify theme dev` on an unpublished copy.
2. Theme editor: open every section, add/remove blocks, change colours, confirm presets.
3. Real product pages: each variant, sold-out product, the bundle (all 14 options), custom-scent product (property appears in order admin), Mixed Scent Package.
4. Collections: sort, Search & Discovery filters (availability, price, scent family), pagination (>16 products).
5. Cart: add/change/remove, order note, discount code at checkout, shipping rates display at checkout, Shop Pay/Apple Pay buttons (if enabled), test order with Bogus Gateway/test payments.
6. Forms: contact submission arrives in the store email; spam protection active; newsletter creates a customer tagged `newsletter`.
7. Customer privacy banner shows in the UK; "Cookie preferences" reopens it.
8. Policies: all four records exist; footer/cart/product links appear; Delivery & returns page shows them.
9. Customer accounts: register, login, order view, address add/edit/delete.
10. Mobile device pass (iOS Safari, Android Chrome); VoiceOver/NVDA pass; Lighthouse mobile ≥ 90 performance/accessibility/SEO target; Rich Results Test on a product.

## Re-running locally
```bash
cd tools/preview && npm i && npm run fixtures   # downloads public catalogue + photos into ./fixtures (gitignored)
node serve.mjs &                                 # http://localhost:4173
node e2e.mjs && node shots.mjs / /products/dark-desire /cart
```
Theme Check: `npm i @shopify/theme-check-node` then `node tools/theme-check.mjs` (or Shopify CLI `shopify theme check`).
