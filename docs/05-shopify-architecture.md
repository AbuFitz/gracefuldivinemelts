# 05 — Shopify architecture

Online Store 2.0 theme in Liquid. No build step, no external runtime, no apps, no third-party scripts. Runs entirely on the merchant's existing Shopify plan.

```
layout/        theme.liquid, password.liquid
config/        settings_schema.json (brand colours, logo, layout, business details, social, cart, product), settings_data.json
templates/     JSON templates (index, product[.bundle|.custom-scent], collection, page[.contact|.faq|.care|.delivery|.find-scent|.about|.policies], cart, search, 404, blog, article, list-collections, password, customers/*) + gift_card.liquid
sections/      one file per section; header-group.json, footer-group.json
snippets/      icon, image, price, product-card (item), scent-notes, breadcrumbs, meta-tags, social-links, pagination, page-head
assets/        base.css (tokens + components), theme.js (no dependencies), DM Sans WOFF2 + licence
locales/       en.default.json
```

## Decisions
- **Section groups** for header/footer so owners edit them in the editor.
- **JS** is progressive enhancement only: dialogs, add-to-cart, variants, cart updates, predictive search, recommendations, cookie link. Every form works without it.
- **Cart is a page**, not a drawer: simpler, accessible, robust; the toast confirms adds.
- **Images** via `image_url` with explicit width/height and `srcset`; first hero/product image eager + `fetchpriority=high`, rest lazy.
- **SEO:** canonical emitted once from `canonical_url`; Product JSON-LD from `structured_data`. No hard-coded absolute URLs. Page titles come from Shopify's `page_title`.
- **No dev-store handles in logic.** Homepage/page JSON defaults reference the *live store's* handles (`wax-melts`, `our-bundle-deal`, `mixed-scent-package`, `/pages/find-your-scent`) as editable defaults only; unresolved references render safely/empty.
- **Fonts** self-hosted DM Sans (no Google Fonts request → no extra consent concern, fewer third parties).
- **Media defaults** use `shopify://shop_images/<file>` so the theme picks up files already in the store's Files; owners replace them in the editor.
- **V2 additions:** floating nav/menu/search in `sections/header.liquid`; custom-scent line item property via `form=`-associated input; sticky bag bar; section-group blocks for search shortcuts and footer.

## Metafields (create in Settings → Custom data → Products; namespace `custom`)
| Name | Key | Type | Used for |
|---|---|---|---|
| Scent family | `scent_family` | Single line text | Card label; collection filter |
| Top notes | `top_notes` | List of single line text | Notes ladder |
| Heart notes | `heart_notes` | List of single line text | Notes ladder |
| Base notes | `base_notes` | List of single line text | Notes ladder |
| Inspired by | `inspired_by` | Single line text | Disclaimer line |
All optional; every consumer has a fallback. Storefront access must be enabled for each definition.

## Page templates to assign
Product "Bundle deal" → `bundle`; "Request a specific scent" → `custom-scent`; page "Contact" → `contact`; FAQ page → `faq`; create pages: Wax melt care & safety (`care`), Delivery & returns (`delivery`), Find your scent (`find-scent`), About (`about`), Policies & legal (`policies`).

## Theme editor controls (deliberately few)
Colours (5), logo, page width, card shape, business details (email, WhatsApp, address, phone, hours, company/VAT numbers), social links, review link, cart note, delivery reassurance line, inspired-by disclaimer, care page; per section: copy, images, collection/product pickers, blocks.
