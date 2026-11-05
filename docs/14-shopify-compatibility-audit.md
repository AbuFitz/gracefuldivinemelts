# 14 — Shopify compatibility audit

**Gap check first:** the Vercel project is *not* the product. `demo/` and `tools/preview/` are throw-away tooling (LiquidJS mock + Playwright + one serverless function). Nothing in `layout/ sections/ snippets/ templates/ config/ locales/ assets/` imports, calls or assumes them. `.shopifyignore` excludes both. No React, Framer, GSAP or build step exists in the theme.

| Feature | Shopify mechanism | Status | Risk / what to confirm on a dev store |
|---|---|---|---|
| Predictive search | `/search/suggest` + Section Rendering API (`predictive-search` section, `predictive_search` object) | Theme-check clean; logic tested against a mock | Real endpoint output, `resources[options][unavailable_products]=last` accepted, result counts |
| Search results page | `search` object, `paginate` | Mock | Product/page/article mix |
| Add to bag | `{% form 'product' %}` + `/cart/add.js` (AJAX) with native POST fallback | Mock + no-JS tested | Shopify renders the form with `novalidate`; the theme validates required fields itself |
| Variants | Radios named `options[…]` + variant JSON; `?variant=` | Mock | Variant images (`featured_media`) scroll the gallery |
| Bundle pair picker | Same variant options; faces matched by *title* against a chosen collection | Mock | Unmatched names (e.g. "Crimsion") show a plain dot — fix the typo in admin |
| Custom scent | Line-item property `properties[Requested scent]` via `form=` attribute | Mock | Property appears in cart, checkout, order admin, notifications/packing slip (see doc 15) |
| Quantity / bag updates | `/cart/change.js` + section rendering of `main-cart` | Mock | — |
| Dynamic checkout | `{{ form \| payment_button }}` (hidden on custom-scent) | Not testable here | Appears only if enabled on the store/plan |
| Recommendations | `routes.product_recommendations_url`, `intent=related`, fallback collection | Mock | Real recommendations |
| Collection sort/filter | `collection.sort_options`, `collection.filters` (Search & Discovery) | Mock | Filter param format `filter.p.m.custom.scent_family` must match what Search & Discovery generates; set up the filter first |
| Scent notes/families | Product metafields `custom.*` (doc 05) | Mock | Create definitions; storefront access on |
| Policies | `shop.policies`, `shop.shipping_policy` etc.; `.shopify-policy__*` styling | Mock | Records must exist |
| Cookie consent | Shopify's banner + `privacyBanner.showPreferences()` | Not testable | Enable in Settings → Customer privacy |
| Contact / newsletter forms | `{% form 'contact' %}`, `{% form 'customer' %}` | Mock | Spam protection and tagging need a real store |
| Section groups | `header-group.json`, `footer-group.json` with `sections` blocks | Theme-check clean | Confirm editor shows blocks |
| Sticky floating nav | CSS `position: sticky` on the group wrapper using `:has(> .nav)` | Chromium | `:has()` needs Chrome 105+/Safari 15.4+/Firefox 121+; older browsers get a non-sticky bar |
| Image defaults | `shopify://shop_images/<file>` in JSON templates | Mock | Resolves only if a file with that exact name exists in Files; otherwise the picker is empty and a placeholder shows |
| Video | `video_tag` with a Shopify-hosted video | Mock (stub) | Re-upload a ≤ 720p video; `preload=none`, poster set |
| Menus | `linklists` via `link_list` settings (defaults `main-menu`, `footer`) | Mock | Create menus with children under *Shop* (doc 08) |
| Structured data | `structured_data` filter + hand-built Organization/WebSite/Breadcrumb | Markup inspected | Rich Results Test |
| Google/Instagram/Shop links | Theme settings (URL fields) | — | Owner confirms each URL |
| Dialog element | Native `<dialog>` | Chromium | Widely supported (2022+) |
| `color-mix()` | CSS | Chromium | Chrome 111+/Safari 16.2+/Firefox 113+; fallbacks are solid colours where used for borders only |

**Mock-only artefacts (do not exist in Shopify):** the "[Shopify dynamic checkout button renders here]" stub, `/__reset`, `/__seed`, the cookie cart, the demo banner.
