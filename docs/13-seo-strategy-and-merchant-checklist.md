# 13 — SEO strategy and merchant configuration

A separate workstream. Nothing here changes the live store; theme code only *outputs* what the owner sets in Shopify.

## 1. Baseline (crawled 2026-11-05)
- Page titles are Shopify defaults ("Wax Melts – Graceful Divine Melts", "Dark Desire – …"); the homepage title is only the brand name.
- **No meta descriptions** found on home, collections, products, FAQ or contact (my check looked for `<meta name="description">`).
- JSON-LD is present on every template; product pages have two blocks.
- `robots.txt` allows crawling and blocks cart/checkout/account/admin only; sitemaps exist (products, pages, collections, blogs). The live store is **not** noindex.
- Collections `frontpage` and `candles-example-products` have 0 products; two products have `candles-example-product-*` handles.

## 2. Search evidence (UK, TinyFish live SERP lookups, 2026-11-05)
No search volumes, rankings of this site or keyword difficulty were available (no Search Console, Merchant Center or keyword-tool access) and **none are invented**. What the live results show:
| Query | Who ranks (page type) | Pattern to learn from |
|---|---|---|
| perfume inspired wax melts UK | Nuscents, Smith & Kennedy, Chandlers, The Essence Vault, Lovely Melts, Angelic Scents, Hampshire Candles, Tillybell, Scents & Sassology — **nine of ten are Shopify-style collection pages**; Amazon at #5 | Dedicated collection titled "Perfume Wax Melts"; snippets promise price-from, free-delivery threshold, hand-poured, UK location, vegan/soy |
| wax melt gift set UK | Amazon, Henry & Co, Wax Botanix, Little Moments, The Scenty Shop, Matty's Candles, Village Wax Melts, Molecule, eBay | "Gift sets & boxes" collections; contents spelled out (e.g. 1 burner + 3 melts + tealight) |
| custom wax melts personalised scent request UK | Etsy, craft-fair exhibitor, Matty's Candles, Fosse Living ("build your own"), Forelo, Whiff of Wonder, Moth & Magpie | Product/collection pages that explain the process; Etsy dominates |
| handmade wax melts | Wild Venus, Sam's Handmade, The Suffolk Candle, Country Living Shop, Candle Brand, Made in the Hills | Head term: collection pages from small makers; origin and batch size featured |
Specific-scent searches (e.g. a named designer fragrance + "wax melt") exist but depend on third-party trademarks; see §6.

## 3. Keyword → page map
| Page | Primary target | Secondary | Title (≤ 60 chars) | Meta description (≤ 155) |
|---|---|---|---|---|
| Home `/` | perfume inspired wax melts | handmade wax melts UK | Perfume-Inspired Wax Melts | Graceful Divine Melts | Handmade perfume-inspired wax melts, poured by hand in small batches in the UK. Shop snap bars, bundles and custom scents. |
| `/collections/wax-melts` (keep handle) | perfume wax melts UK | wax melt snap bars | Perfume Wax Melts UK – Snap Bars | Graceful Divine Melts | Shop perfume-inspired wax melt snap bars, with scent notes for every fragrance. Hand-poured in small batches. |
| `/collections/bundles` | wax melt gift set / bundles | wax burner set | Wax Melt Bundles & Gift Sets | Graceful Divine Melts | Wax melt bundle with two snap bars, a mixed scent pack and a burner. Choose your pair of scents. |
| *New smart collections* (from `scent_family`) `/collections/floral-wax-melts`, `…/sweet-…`, `…/woody-…`, `…/fresh-…` | floral / sweet / woody wax melts | — | Floral Wax Melts | Graceful Divine Melts | Floral wax melts with jasmine, rose and lily of the valley. See the notes before you buy. |
| Product (each scent) | "{Scent} wax melt" | scent notes | {Scent} Wax Melt Snap Bar | Graceful Divine Melts | {Top/heart/base notes in one line}. Hand-poured wax melt snap bar. £6.99. |
| `/products/request-a-specific-scent` | custom wax melts | personalised scent wax melts | Custom Scent Wax Melts – Request Your Scent | Tell us the scent you love and we'll make three wax melts, subject to availability. £15.99. |
| `/products/our-bundle-deal` | wax melt bundle | gift set with burner | Wax Melt Bundle with Burner | Two snap bars of your choice, a mixed scent packet and a wax burner. £28.99. |
| `/pages/gracefuldivinemeltswax-melt-faq` (keep) | wax melt care / how to use wax melts | wax melt safety | How to Use Wax Melts – Care & FAQ | Warmer wattage, how many pieces to use, storage and safe use. |
| `/pages/find-your-scent` | — (internal discovery hub) | scent families | Find Your Scent – Wax Melt Families | Floral, sweet, woody and fresh. Pick a mood and see the scents. |
Enter titles/descriptions in each page's **Search engine listing** in Shopify admin (the theme prints them). Never keyword-stuff; headings already contain the target phrases naturally.

## 4. What the theme implements (technical SEO)
One canonical per page via `canonical_url`; native Product JSON-LD (`structured_data`) with price, currency, availability; Organization, WebSite (+ search action) and BreadcrumbList JSON-LD; one `<h1>` per template; descriptive headings; image `alt` from Shopify (and section alt fields); responsive `srcset`, explicit width/height, eager/high-priority hero and first PDP image, lazy elsewhere; internal links from home → collection → product → care guide → FAQ, product → related scents, scent explorer → family collections; real URLs preserved; 404 page; no hard-coded absolute URLs; OG/Twitter tags; no `noindex` anywhere in the theme.
**Filtered URLs** (`?filter…`) are for shoppers; crawlable family landing pages should be **smart collections** (see §3). The theme's family links currently use filter URLs because collections do not exist yet; **swap to the new collection URLs once created** (Find-your-scent and home explorer link fields).
Vercel demo: `noindex` meta, `X-Robots-Tag` header and `Disallow: /` robots — to avoid duplicate content; remove with the demo.

## 5. Merchant listing eligibility and configuration checklist
- [ ] Shipping and Refund policies exist (Settings → Policies) — needed for merchant listings and trust.
- [ ] Shipping rates/times configured in Shopify; same information in Merchant Center shipping settings.
- [ ] Return policy and window configured in Merchant Center to match the refund policy.
- [ ] Product data: titles, descriptions, GTIN/brand where available, correct availability, price matches page (Shopify's JSON-LD supplies price/availability).
- [ ] Remove "Sample Product" tags; rename `candles-example-product-*` handles with redirects (doc 08).
- [ ] Google Search Console: verify the domain, submit `sitemap.xml`, inspect home/collection/product, watch Coverage and Merchant listings reports.
- [ ] Google Merchant Center: claim the website, confirm business details and policies, accept free listings.
- [ ] Shopify **Google & YouTube** channel: connect Merchant Center, sync products, review disapprovals. (Check the current in-admin steps before starting; these change.)
- [ ] Google Business Profile: confirm category, hours/service area, add website link, answer reviews; obtain the **short review link** and paste it into Theme settings.
- [ ] Alt text on every Files image; set it once in Shopify Files.
- [ ] Core Web Vitals check with PageSpeed Insights on mobile after launch (weights in doc 12).

## 6. Risks and cautions
- Naming third-party perfumes in titles/URLs/ads ("inspired by …") raises trademark and comparative-advertising questions; competitors do it ("dupe", brand names) but that is **not** evidence it is safe. The theme keeps the existing disclaimer and uses brand names only in the owner's product copy. Get professional advice before building pages around brand names.
- Do not copy competitor wording; the table above is structure only.
- Re-research after Search Console has 4–8 weeks of data: real queries beat any list here.
