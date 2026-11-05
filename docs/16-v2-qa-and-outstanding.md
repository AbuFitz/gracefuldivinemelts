> Latest results are in `docs/17-v3-creative-correction.md` §10 (28/28 interaction tests, six-width layout checks, refreshed screenshots).

# 16 — V2 QA results and outstanding tasks

## Automated checks (2026-11-05)
| Check | Result |
|---|---|
| Shopify Theme Check (`theme-check:recommended`) | **0 errors, 0 warnings** |
| Interaction suite `tools/preview/e2e.mjs` (Playwright, local mock) | **23 / 23 pass** — menu, search (keyboard, clear, empty, error/retry), add to bag, sticky bag bar, gallery dots, nav compaction + dropdown, sold-out, bundle pairs, bag update/remove/empty, custom scent validation + prefill + line property, home → custom prefill, scent explorer, rail, collection filters, search page, contact validation/success, FAQ, skip link, 404, social/review links, **internal link crawl (no dead links)**, reduced motion, no-JS add to bag |
| Layout checks at 360, 390, 430, 768, 1024, 1440 px (`tools/preview/shots.mjs`) on 18 pages | No horizontal overflow, one `<h1>` per page, no console errors (excluding the intended 404 request), no sub-24 px controls |
| Screenshots | 46 images in `docs/screenshots/` (desktop + mobile for every major page; menu, search, dropdown, scrolled nav, sticky bar, custom prefill states) |
**Bugs found by this QA and fixed:** product-card grid showing the wrong column count (string vs number), invisible video (a filter used inside a filter argument), pair pin numbering counted every block, 22 px "Remove"/legal links, filter panel overflow, footer columns and wordmark overflowing on mobile, tablet hero image clipped by the next sheet, giant arrow icons in overlays, italic description text rendered in rose, **required custom-scent field not enforced** (Shopify renders product forms with `novalidate`), rail first item snapped off-grid, and a test-harness bug that disconnected the external `form=` buttons.

## Visual review
I looked at the screenshots at desktop, tablet and mobile for home, collection, product, bundle, custom scent, bag, FAQ, contact, find-your-scent and the overlays and iterated on what I saw. I did **not** review every one of the 6 widths × 18 pages by eye (the automated checks cover overflow/targets; eyeballing covered 390, 768, 1024, 1440).

## Not done / cannot be done from here
- **No Shopify store was available.** Nothing in doc 14 marked "needs a dev store" has been run on Shopify (checkout, predictive search, recommendations, dynamic checkout, spam protection, theme editor, line-item property display in orders).
- Google Business Profile could not be read (bot check): **no rating/review count shown or claimed**.
- No keyword volumes or rankings (no tool access).
- Screen-reader testing and Lighthouse were not run.
- The Vercel demo build was not re-verified on Vercel after V2.

## Outstanding tasks that need the customer or store access
1. Shopify dev store / collaborator access; run doc 07's list plus doc 15 test order.
2. Create metafield definitions and fill scent family, notes and "inspired by" for all 11 scents (demo values are inferred, not customer data).
3. Search & Discovery filters; smart collections for scent families; swap family links from filter URLs to collection URLs.
4. Menus (Shop › All / Bundle / Mixed / Gift & bundles; Discover Scents; Custom Scent; About) and secondary menu.
5. Pages with templates; policy records (shipping, refund, terms); cookie banner.
6. Upload logo; upload 6–10 original photos and a ≤ 720p video; set alt text in Files.
7. Approve the corrected story wording; supply Google review link; confirm TikTok/Facebook (or leave blank).
8. Answer the custom-scent questions in doc 15; update the product description.
9. Set SEO titles/descriptions (doc 13); fix product-copy typos and the bundle's "Crimsion" variant; resolve the bundle's tealight discrepancy (a promo graphic lists four tealights; the product text does not).
10. Customer approval of the visual direction before anything is published.
