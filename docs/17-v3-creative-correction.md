# 17 — V3 creative correction

**Direction received:** most V2 sections were liked, *including the curved sheets*; the hero was the weak part. The V3 brief also asked to reduce curves — the later message ("we don't want to flatten") settled it: **the V2 section look is kept**. V3 therefore changes only what was asked: hero, navigation, product frames, scent discovery, Instagram, footer, payment presentation and the preview banner. Before/after: `docs/media/v2-vs-v3-hero.jpg`.

## 1. Hero (highest priority)
### Research (what was actually read)
- **Fe Herospot** (Framer listing text): a tabbed header hanging off an announcement bar with the hero image showing through; a fading image carousel; **shoppable hotspots** that open a small card with thumbnail, name, price and a link; hotspots hidden on phones; on phones "the content card slides up over the image". Principle taken: *the hero is a shopping surface, not a poster* — real product, real price, a direct action.
- **Product Stage** (listing text): a centred product carousel with an active/inactive scale, arrows, autoplay and click-to-focus. Principle taken: *one product large and in focus, the others as a quiet selector*.
- **Carousels category**: names only (e.g. Curved Carousel, Parallax Marquee, Shoppable Reels, Product Slideshow). Component source is gated and React-based, so **nothing was copied or assumed exportable**; behaviour was reproduced independently in plain HTML/CSS/JS.
- **Perfume/beauty hero trends** (web search, trend articles only): dark-luxury, story-led, mobile-first, sample-first discovery. These informed *restraint* and the "start with the Mixed Scent Package" link; no site was copied.

### Three compositions built and compared (`docs/media/hero-options-*.jpg`)
| | Idea | Verdict |
|---|---|---|
| A — Product stage | Headline left; a half-screen photo of a real product with a live name/price/add card and a thumbnail selector | **Chosen**: product is huge, "wax melts" is understood instantly, commerce works from the first screen |
| B — Collage | Three overlapping real photos bleeding off the right edge | Pretty but fragmented; no direct shopping; images compete |
| C — Range wall | Giant headline with five product images in a row beneath | Strong range signal but cramped; the headline collided with the products at 900 px high |

### Delivered (A, refined)
Warm-white hero; three-line headline with one highlighted word; **the stage fills the right half**, bleeding to the screen edge, with a single soft corner; crossfading real products from a chosen collection (available products only); an info card with family, **real price**, real top notes (or "inspired by"), **Add to bag** and **View**; a vertical thumbnail selector; a small "New here? Start with the Mixed Scent Package" starter link. Autoplay (6.5 s) stops on interaction, focus, pointer-over, reduced-motion and data-saver. **Mobile is composed separately**: headline → text → full-width stage with the card sliding over the image and thumbnails along the top → buttons. No fake imagery; only the store's own product photos.

## 2. Navigation
One compact **floating white surface** (≈ 60 rem, never full width): *Shop · Discover Scents · Custom Scent · About* | **centred, unframed logo** (no circle, badge or container; it sits at its natural proportions, slightly taller than the bar so it reads as an anchor) | *Search field-style pill · account · Bag*. Separation from the pale page is a hairline ring plus a soft two-layer shadow (no frosted glass, no large radius). The look is **identical at the top and when scrolled** (only the shadow deepens). Links never wrap; hover draws a small pink underline; the bag is the single dark accent. Mobile: a compact floating bar with menu left, **large centred logo**, search and bag right; the menu is the rounded sheet from V2. Tested: bar is white, logo has no radius/background, logo centre is within 2 px of the bar centre, links do not wrap, colour unchanged on scroll.

## 3. Product cards
Kept the V2 direction and restrained it: a thin 1 px frame, 20 px radius, image on top, **name left / price right**, family underneath, availability in words (no badge) — "Sold out" in red; a small round **+ quick add** appears on hover (always visible on touch) only for in-stock single-variant products; the **second image cross-fades on hover only when a second image exists**; no continuous animation. Aspect 4:5 in rails/catalogue.

## 4. Section-by-section composition review (homepage)
| Section | Problem in V2 | V3 composition |
|---|---|---|
| Hero | Template left/right, small product | Product stage (above) |
| Pick a scent (rail) | Fine; items un-framed | Same rail, restrained frames, + quick add |
| **Discover by mood** | Three families as clickable words that led to filtered pages; cards restyled, little value | **Replaced by a scent selector** (below) |
| Custom scent | Strong | **Kept** (dark sheet, big type, typed-scent form) |
| Bundle | Strong | **Kept** (pink sheet, organic-mask photo, pins, scent faces) |
| Story | Strong | **Kept** (editorial text + two photos) |
| Instagram | Draggable rail | **Continuous marquee** (below) |
| Quick answers | Fine | Kept (type-led, hairline list) |
| Review links | Fine | Kept; real brand glyph; clearance above footer |
| Footer | Good wordmark, weak hierarchy | Recomposed (below) |
Rhythm now: white (hero) → white (rail) → blush sheet (selector) → ink sheet (custom) → pink sheet (bundle) → white (story, Instagram, FAQ, reviews) → ink footer. Sections differ structurally: stage, rail, list+stage, typographic+form, image-led split, editorial, marquee, hairline list, strip, footer.

## 5. Scent selector (was "Discover by mood")
**Evaluation:** the catalogue has 13 products, so a quiz or multi-step filter would add friction. The old component only navigated to filtered collection pages. **Outcome now:** pick a scent in a large typographic list and *see that real product* — photo, family, real top/heart/base notes (where the owner has entered them), "inspired by", price, **Add to bag** and **View** — without leaving the page. **Family chips appear only if the products actually carry the `scent_family` metafield** (and only families present); with no metadata it is still a useful product browser (name, image, price, add). Sold-out scents are struck through. Keyboard: ↑/↓/←/→/Home/End, ARIA tabs; mobile turns the list into a horizontal chip row above the product. No-JS: all products stack. Also used on *Find your scent*.

## 6. Instagram (continuous movement)
A pure-CSS **seamless marquee**: two identical groups translated by exactly 50 % on a linear infinite loop, no JavaScript, no pause on hover, no snapping or restart, constant pace (duration scales with item count). Measured in tests: the two groups have equal width (no seam), animation is `running` before and after hover, and it is moving. Items are the owner's real photos plus a **video thumbnail** (poster with a play badge), each linking to the real Instagram profile (or to a post/reel URL if one is pasted into the block); a clear **Follow @gracefuldivinemelts** button sits in the heading. **Accessibility:** the duplicate group is `aria-hidden` and `inert` (not focusable, not announced) so each item exists once for keyboards and screen readers; **reduced motion** shows a static, horizontally scrollable single set. No paid app, no third-party script, no Instagram API.

## 7. Footer
Kept the oversized, clipped wordmark and strengthened it: **desktop** one line cropped at the bottom edge; **mobile** three stacked words at ~31 vw, deliberately bleeding off the right and bottom edges (tested: `scrollWidth > clientWidth`, font ≥ 90 px). Hierarchy: closing line + link groups → *Find us* row with **icon-led profile links** (Instagram, Google, Shop app, Trustpilot, WhatsApp; real brand glyphs from Simple Icons, CC0; accessible names; hover/focus fills white and tints to the brand colour) → legal links, cookie preferences, payments → wordmark. The Shop destination uses the Shopify bag glyph as a stand-in (Shop's own wordmark is not in the icon set; swap in the official asset if desired). Brand logos remain their owners' trademarks and are used only to identify the owner's own profiles.

## 8. Payment methods
**Production:** `shop.enabled_payment_types` rendered with Shopify's `payment_type_svg_tag` — only methods actually enabled in Settings → Payments appear, in Shopify's own icons. Toggle: *Footer → Show the payment methods enabled in Shopify*. **Demo:** the preview server supplies Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay and Shop Pay placeholders and injects the line *"Demo only: placeholder payment icons. The live store shows only the methods enabled in Shopify."* That note and the demo icon data live in the preview layer, not the theme.

## 9. OneSimpleSite preview banner
Restrained green (#1F5C3F), white text: **Design preview** · Created by OneSimpleSite · **onesimplesite.co.uk** (clickable, opens in a new tab). It wraps neatly on mobile (tested ≤ 390 px) and sits *after* the skip link so keyboard order is unchanged. It is **not part of the theme**: it is injected by `tools/preview/serve.mjs` only when `GDM_DEMO_BANNER=1`, which only `demo/api/index.mjs` (the temporary Vercel project) sets. The Shopify theme has no banner markup, CSS or setting; deleting `demo/` removes it entirely.

## 10. Quality gates and bugs found by testing
Theme Check: **0 errors, 0 warnings**. Interaction suite: **28 / 28** (adds: scent selector, hero stage, navigation geometry/colour, marquee behaviour incl. reduced motion, footer icons/payments/mobile wordmark, banner). Layout check at 360 / 390 / 430 / 768 / 1024 / 1440 px on 18 pages: no overflow, one `h1` each, no console errors (excluding the intended 404). 46 screenshots in `docs/screenshots/`.
Real defects found and fixed: invisible hero slides **intercepted clicks** on the product card; the next section's curved top **covered** the hero's Add-to-bag button; the mobile selector list overflowed the viewport; the mobile search pill kept its desktop width and pushed the menu button; a truncated CSS rule swallowed later rules; the sticky bag bar missed jump-scrolls (now scroll-driven); the preview harness did not expose Shopify globals to snippets (footer icons rendered empty in the demo only).

## 11. Not done / for you
- **Not run on a Shopify store.** Real predictive search, line-item property display, dynamic checkout, Search & Discovery filters, enabled-payment icons and the theme editor remain to be verified on a dev store.
- The old file `sections/scent-explorer.liquid` is now an inert stub (no preset, unused). Deleting it was blocked by this session's safety check, so **please delete that one file**.
- The hero collection in the demo is a preview-only "hero picks" list; on the real store choose any collection (it shows only available products).
- Instagram posts are not individually linkable until the owner pastes post/reel URLs into the blocks; media are real files already on the store, and several (hero/rail/story) repeat because few originals are public.
- Framer pages could be read as marketing text only; no component code was inspected or reused.
