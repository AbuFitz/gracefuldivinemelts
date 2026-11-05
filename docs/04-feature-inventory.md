# 04 — Feature / functionality inventory

"Verified (mock)" = exercised by `tools/preview/e2e.mjs` against a local mock of Shopify's endpoints. It proves the theme's front-end logic, **not** Shopify's behaviour. Everything marked "Needs dev store" must be re-tested there (doc 07).

| Feature | Implementation | Status |
|---|---|---|
| Responsive navigation, sticky header | Inline nav ≥990px; native `<dialog>` menu below; Esc closes; focus returns to opener | Verified (mock) |
| Search | Header dialog with predictive suggestions via Section Rendering API (`/search/suggest`), full results page, no-results state | Mock verified; **Needs dev store** for real predictive endpoint |
| Cart count | Server-rendered; updated from `/cart.js` after add/change | Mock verified |
| Collections | Native `collection.products`, `paginate`, sort select, filter UI from `collection.filters` | Layout verified; filters **need Search & Discovery** configured |
| Filters by scent family | Uses metafield `custom.scent_family` once added as a filter in Shopify Search & Discovery | Needs admin setup |
| Product gallery | Large image + thumbnails (images only; video/3D media not rendered) | Verified (mock) |
| Variants | Radio options → hidden variant id, price, stock text, button state, URL `?variant=`, variant image | Verified (mock) |
| Bundle | Variant-based; pairs split on " & " for display; no logic changed | Verified (mock); **Needs dev store** with the real product |
| Availability | Sold-out badge/button, per-value "(sold out)" for single-option products | Verified (mock) |
| Quantity | Stepper + native number input | Verified (mock) |
| Add to cart | Progressive enhancement: `fetch` to `/cart/add.js`; native form post without JS | Verified (mock) incl. no-JS |
| Quick add | Single-variant, in-stock products only | Verified (mock) |
| Dynamic checkout | `{{ form \| payment_button }}`, toggle in editor; appears only if enabled on the store/plan | Needs dev store |
| Custom scent request | Required text input saved as line-item property "Requested scent" | Verified (mock); needs product assignment |
| Cart page | Quantity change and remove via `/cart/change.js`, section re-render, order note, discounts shown only if Shopify returns them, cart-level policy links | Verified (mock) |
| Checkout | Native Shopify checkout (`name="checkout"` submit). Nothing fabricated | Needs dev store |
| Related scents | Shopify product recommendations (`intent=related`) with a fallback collection | Needs dev store for live recommendations |
| Scent notes | Metafields `custom.top_notes / heart_notes / base_notes` (list of text) | Needs data entry |
| Inspired-by line | Metafield `custom.inspired_by`; global disclaimer in Theme settings; suppressed when the description already carries it | Verified (mock) |
| Contact form | Native `{% form 'contact' %}`; field errors, success state; Shopify's built-in spam protection | Verified (mock); spam protection **needs dev store** |
| Newsletter | Native customer form tagged `newsletter`; success/error states | Needs dev store; no fake success |
| Cookie consent | Shopify's own banner (admin). Footer link calls `privacyBanner.showPreferences()` or explains it is unavailable | Needs admin setup |
| SEO | One canonical via `canonical_url`, native `structured_data` Product JSON-LD, Organization + WebSite + BreadcrumbList JSON-LD, OG/Twitter tags, one `<h1>` per page, descriptive alt text from Shopify | Verified (markup) |
| Policies | Footer links all `shop.policies`; cart links to shipping/refund/terms/privacy if present; Delivery & returns page renders records | Needs policy records |
| Accounts | Native customer templates | Built, untested on Shopify |
| Reviews | Not implemented: link to Trustpilot only | By design |
| Gift cards | Template only | Only if offered |
| Multi-currency / languages | English only; locale file structure ready | Out of scope |

## V2 additions (see docs 12, 14, 15)
| Feature | Implementation | Status |
|---|---|---|
| Floating nav with Shop dropdown, compaction on scroll | CSS + 24 px scroll class | Verified (mock, Chromium) |
| Mobile menu sheet | Native `<dialog>` | Verified (mock) |
| Search overlay with shortcuts, popular scents, live results, keyboard, error/empty states | Shopify predictive search section | Verified against mock; **needs dev store** |
| Scent explorer (tabs by family) | Metafield `custom.scent_family` | Verified (mock); needs metafields |
| Custom scent journey | Required line-item property + `?scent=` prefill | Verified (mock); **needs dev store** |
| Bundle pair picker with scent faces | Existing variants + title match | Verified (mock) |
| Sticky mobile bag bar | IntersectionObserver + `form=` button | Verified (mock) |
| Curated media rail with video tile | Files + `video_tag`, muted autoplay only when visible/allowed | Verified (mock stub) |
| Review/profile destinations | Theme settings (Instagram, Google, Shop app, Trustpilot) | Links verified present |
