# 08 — Migration and launch checklist

**Rule: nothing in this repo touches the live store until the owner approves. The live theme (Horizon "Updated copy of Flora") is never deleted or overwritten.**

## A. Install as an unpublished theme
**Option 1 — GitHub integration:** Shopify admin → Online Store → Themes → Add theme → Connect from GitHub → repo `AbuFitz/gracefuldivinemelts`, branch `claude/exciting-cerf-2hsvp2` (or `main` after merge). This creates an *unpublished* theme. (Confirm that Shopify ignores the non-theme folders `docs/` and `tools/` at the repo root on first sync; if it complains, move theme files into a subfolder or use Option 2.)
**Option 2 — Shopify CLI:** `shopify theme push --unpublished --theme "GDM redesign"` from the repo root (`.shopifyignore` excludes docs/tools).
**Option 3 — Zip:** zip `assets config layout locales sections snippets templates` and upload.

## B. Checklist by owner of the task
| Step | Carried by theme | Admin config | Owner content | Owner approval | Final test |
|---|:-:|:-:|:-:|:-:|:-:|
| Layout, sections, templates, styling, fonts | ✔ | | | | ✔ |
| Upload logo (Theme settings → Logo) | | ✔ | ✔ (existing file) | | ✔ |
| Brand colours (defaults match logo) | ✔ | ✔ confirm | | ✔ | |
| Menus: Main menu (Shop › All wax melts / Bundle deal / Mixed Scent Package / Request a scent; Find your scent; Care & FAQ; Contact) and Footer menu | | ✔ | | ✔ | ✔ |
| Create metafield definitions (doc 05) and fill notes/family | | ✔ | ✔ | | ✔ |
| Enable Search & Discovery filters: Availability, Price, `custom.scent_family` | | ✔ | | | ✔ |
| Assign product templates: bundle → `bundle`, request scent → `custom-scent` | | ✔ | | | ✔ |
| Create pages with templates: Contact, FAQ (keep existing handle `faq`), Care & safety, Delivery & returns, Find your scent, About, Policies & legal | | ✔ | ✔ | ✔ | ✔ |
| Policies: create Terms, Refund, Shipping; review Privacy | | ✔ | ✔ | ✔ + adviser | ✔ |
| Enable Customer privacy banner (UK) | | ✔ | | ✔ | ✔ |
| Shipping rates & delivery times; "Delivery reassurance" setting only if matching | | ✔ | ✔ | ✔ | ✔ |
| Business details in Theme settings (legal name, address, phone, hours, VAT/company no.) | | ✔ | ✔ | ✔ | |
| Re-upload homepage video; add real quote if permissioned | | ✔ | ✔ | ✔ | |
| Fix product copy typos/variant "Crimsion" | | ✔ | ✔ | ✔ | |
| Rename `candles-example-product-*` handles (keep "Create URL redirect" ticked) | | ✔ | | ✔ | ✔ |
| Newsletter/Shopify Email or Klaviyo wiring | | ✔ | | ✔ | ✔ |
| Test order, bundle order, custom-scent order, refund test | | | | | ✔ |
| Lighthouse + accessibility pass | | | | | ✔ |

## C. URL and redirect plan
No existing URL is changed by this theme: product, collection, page (`/pages/contact`, `/pages/faq`), policy and blog URLs are preserved. The only recommended URL changes are the two `candles-example-product-*` handles (and optionally `paradox-wax-melt` → `parisian-bloom`); Shopify creates 301 redirects when "Create a URL redirect" is ticked. Old nav items (`/collections/all`, Mixed Scent Package, Bundle Deal) all still resolve. Add any `Choose your scent` destination to the new menu once identified.

## D. Go-live
1. Customer previews the unpublished theme (Preview link) on mobile and desktop and approves in writing.
2. Complete section B and the dev-store tests in doc 07.
3. Publish at a quiet time → Themes → Actions → Publish. The previous theme remains in the library.
4. Smoke test: place a real low-value order, check emails, check order admin shows the *Requested scent* property for a custom-scent test.

## E. Rollback
Themes → older theme → Actions → **Publish**. Theme settings and menus are theme-scoped, so rollback is immediate. Product, customer, order and financial data are not stored in the theme and are unaffected either way. Metafields and pages created for the redesign are harmless if left in place. Handle renames are not rolled back by republishing (redirects keep old URLs working).
