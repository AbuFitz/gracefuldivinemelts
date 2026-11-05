# 01 — Website audit (live store, crawled 2026-11-05)

Method: public HTML, `/products.json`, `/collections.json`, sitemaps and robots. Admin-only facts are marked **PENDING ACCESS**.

## Platform
- Shopify, theme **Horizon 3.5.1** ("Updated copy of Flora", role `main`, id 189927981382). Currency GBP.
- No third-party app scripts detected in public HTML (no review/email/bundle app markup). Confirming this needs admin access → **PENDING ACCESS**.

## Inventory
**Products (13)** — all £6.99 unless noted; one image each (1086×1448) except where stated.
| Handle | Title | Notes |
|---|---|---|
| angelic-aura | Angelic Aura | created 2026-10-26 |
| divine-fortune | Divine Fortune | **sold out** |
| golden-goddess | Golden Goddess | **sold out** |
| dark-desire | Dark Desire | |
| modern-muse | Modern Muse | |
| rose-elegance | Rosé Elegance | |
| limited-divine-noir | LIMITED- Divine Noir | |
| paradox-wax-melt | Parisian Bloom | handle does not match title |
| candles-example-product-4 | Midnight Drift | tagged "Sample Product"; "example" in URL |
| candles-example-product-3 | Crimson Luxe | tagged "Sample Product"; "example" in URL |
| mixed-scent-package | Mixed Scent Package | £4.99; 3 images |
| request-a-specific-scent | Request a specific scent | £15.99; "3 wax melts"; customer enters scent in checkout *Special Instructions* |
| our-bundle-deal | OUR BUNDLE DEAL | £28.99; **variant-based**: option "Choose Bundle", 14 variants, each a pair of scents. 2 snap bars + 1 mixed-scent packet + 1 burner |

**Collections:** `wax-melts` (10), `bundles` (6), `frontpage` (0), `candles-example-products` (0). **Pages:** `contact`, `gracefuldivinemeltswax-melt-faq`. **Blog:** `news` (in sitemap). **Policies:** only `/policies/privacy-policy` resolves; shipping, refund and terms return 404.

**Navigation:** Home, Catalog, Contact, "Choose your scent !", Bundle Deal, Mixed Scent Package, Leave us a review. **Footer:** Privacy policy, Instagram, TikTok, country selector.
**Contact routes:** email gracefuldivinemelts@outlook.com, WhatsApp link, bare contact form (name, email, phone, comment). **Reviews:** Trustpilot and Google links only; one unattributed homepage quote. **Newsletter:** email field, "sign up for discount codes". **Media:** one homepage video. Search, account and cart exist natively.

## Classification
| Feature | Class | Reason |
|---|---|---|
| Variant-based bundle | **KEEP** | Working fulfilment logic; theme renders its variants as readable pairs |
| Request a specific scent | **KEEP / IMPROVE** | Kept as a product; theme adds a visible "Which scent?" line-item property so the request is not dependent on a cart note (cart note kept too) |
| Mixed Scent Package | **KEEP** | Core discovery tool |
| Sold-out states | **KEEP** | Handled natively; clearer badge and disabled button |
| Homepage FAQ (returns text) | **CONSOLIDATE** | Duplicates the FAQ page; returns terms live nowhere as a policy record |
| FAQ page (care) | **IMPROVE** | Rich content, no structure/navigation; regrouped with topic nav, wording preserved |
| Contact page | **IMPROVE** | Form with no business information or routes |
| Nav item "Leave us a review" | **CONSOLIDATE** | Moved to footer/contact; link kept |
| Nav "Choose your scent !" | **PENDING ACCESS** | Destination unknown from public crawl; replaced by a "Find your scent" page, owner to confirm |
| Homepage video | **KEEP** | Re-uploadable via the Video section |
| Unattributed testimonial | **REMOVE from default** | Cannot be verified; Customer quote section exists, empty until the owner supplies a permissioned quote |
| Scripture lines (announcement, "Proverbs 16:3") | **KEEP (editable)** | Real brand voice; announcement text editable |
| Shipping / refund / terms policy records | **IMPROVE (owner)** | Missing as Shopify policy records |

## Defects and opportunities
1. **Missing legal destinations:** shipping, refund, terms are 404. Returns terms only appear inside FAQ text.
2. **Sample URLs/tags:** two best-sellers have `candles-example-product-*` handles and a "Sample Product" tag. Changing handles needs Shopify redirects (auto-offered on rename); see doc 08.
3. **Bundle typo:** variant "Crimsion Luxe & Rosé Elegance".
4. **Bundle availability:** bundle variants include Golden Goddess (sold out as a single) yet appear purchasable. Owner decision.
5. **Copy:** "Coco Channel", "Parada Paradox", "Rośe Elegance", "Rošé"-type diacritics, fragments in Mixed Scent Package copy ("smooth, clean, confident and unforgettable."), inconsistent spacing around "Inspired by". Theme does not rewrite product data; list for owner in doc 06.
6. **Trademarks / comparative claims:** product copy names third-party perfumes. The existing disclaimer is good practice but UK comparative-advertising rules should be checked by a professional.
7. **No structured scent data:** notes exist only inside prose descriptions.
8. **Contact page** gives no reply time, hours or order-help route.
9. **Currency-code clutter:** prices render as "£6.99 GBP" in the live theme.
10. **Mobile:** live theme duplicates "Sale price/Regular price" text visibly for screen readers.
