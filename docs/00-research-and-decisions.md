# 00 — Research and design decision record

Date: 2026-11-05. Scope: what was actually consulted, and the decisions it produced.

## Honest limits of this research
- **Done:** a full crawl of the live public store (HTML, `products.json`, `collections.json`, sitemaps, robots), a read of Shopify's Customer Privacy API page, and six web searches (UK wax-melt retailers, Consumer Contracts Regulations, Shopify cookie banner, CLP for wax melts).
- **Not done:** the search tool returned product pages and marketplace listings rather than brand home pages, so no competitor site was browsed in a browser or screenshotted. Nothing below claims to have "studied" a competitor's layout. Competitor notes are from search snippets only.
- **Not retrieved:** the GOV.UK guidance page itself (search returned legislation.gov.uk and council summaries); CLP/GPSR points come from trade-supplier guides, which disagree with each other. All legal points are therefore **flags for the owner's review**, not conclusions.
- **Shopify platform detail** (Online Store 2.0 file structure, section groups, filtering params) was written from working knowledge plus passing Shopify Theme Check; it has **not** been run on a Shopify store (none available).

## Reference notes → decisions
| Source | What it showed | Problem it informed | Decision (not copied) |
|---|---|---|---|
| Live store `gracefuldivinemelts.com` | 13 products, one variant-based bundle (14 pair options, all £28.99), photography 3:4, pink/black/cream identity, Didone-style logo | Preserve real commerce; echo brand | Bodoni Moda (display) echoes the logo's high-contrast serif; Hanken Grotesk for text; paper/blush/ink/rose palette sampled from logo and photography; portrait 3:4 cards |
| Scent26 Candle Co (search snippet) | Sells a "mix and match any 10 snap bars" bundle | Shoppers want to build sets | Keep the existing variant-based bundle as the source of truth; present pairs as readable "A & B" choices; **no** new bundle engine |
| Northumberland Candle Co (snippet) | States cell count and weight (5-cell, 50g) | Buyers can't judge size online | Flag pack contents/weight as required owner data; not invented in theme |
| HexNex (snippet) | Dominant notes in the product copy | Scent can't be experienced | Top / heart / base notes ladder from product metafields, falling back to the description |
| Shopify Customer Privacy API docs (fetched) | Banner is Shopify's own, configured in admin; `privacyBanner.showPreferences()` reopens it; consent only on visitor action | Fake cookie banners | No custom banner. Footer "Cookie preferences" calls the documented API and says so if the banner isn't enabled |
| Consumer Contracts Regulations (via search) | 14-day cancellation for distance sales; period starts on delivery | Returns wording | Existing returns copy retained, labelled for legal review; policy text sourced from Shopify policy records |
| CLP guidance (trade guides, conflicting) | Fragranced wax melts often need CLP labelling and allergen disclosure; sources disagree | Product safety info | Safety page uses only the owner's existing wording; CLP/labelling listed as an open owner item |

## Design decisions
1. **One direction:** "soft editorial perfumery". Cream paper, blush sections, ink-black contrast panels, rose for links/buttons, the logo's smoke curl as the single ornament.
2. **Photography leads.** Cards, hero and bundle use the real images; no illustration or invented imagery.
3. **Signature component:** the scent-notes ladder (product page) plus scent-family index (home / Find your scent), both driven by owner-editable data.
4. **Native first.** Shopify cart, checkout, search, policies, forms, customer-privacy banner, structured data. No apps, no external runtime.
5. **Rejected:** quiz/recommender (needs data the owner doesn't have), custom bundle builder (would break working variant logic), cart drawer (page cart is more robust; AJAX toast covers feedback), review widgets (no verified source of reviews beyond a Trustpilot link), countdown/urgency elements.
