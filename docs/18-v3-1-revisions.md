# V3.1 revisions (after V3 review)

Client feedback on V3 reversed several V3 decisions. This note records what changed and why.

## Reversed to the V2 design (client preferred it)
- **Hero**: the V2 pink hero (arch image, orb, price hotspots) is back in full. The V3 product-stage hero was removed from the homepage (its JS is dormant).
- **Navigation**: the floating white pill is back at the full 80rem width with the V2 Search button, and a perfectly round (999px radius) edge. The only change from V2 is the logo, now centred and unframed. On mobile the logo is centred as well.
- **Curved sections**: the V2 domes are kept. The hero-to-scents join now uses a softer asymmetric "swell" curve (`.sheet--swell`). Bundle and Our story use a flat top (`curve` setting, default flat) so the curve is not repeated on every section.
- **Product framing**: bordered cards with arch/soft image crops and a staggered rail are back.

## New
- **Superseded:** the merged "Pick a scent" idea below was reverted at the client's request; the original "Pick a scent" rail and the separate "Discover by mood" explorer are back exactly as in V2.
- ~~**Pick a scent** (`product-rail` with `mood` blocks): "Discover by mood" and the scents rail are one section. Moods filter the rail from real product metadata. The V3 scent selector is retired (`scent-selector` and `scent-explorer` are inert stubs; delete them in the theme editor or repo).
- **Instagram + TikTok showcase** (`media-rail`): two continuous CSS lanes in opposite directions, no pause on hover, inert duplicate sets, static under reduced motion, a follow button per platform.
- **Footer**: rebuilt (closing line, link columns, icon-led follow column incl. TikTok, legal row with payments). On mobile the oversized wordmark is a single line that runs off the screen.
- **Social**: TikTok handle verified as `@gracefuldivinemelts`; the old `gracefuldivine2` link is replaced.

## Media notes
- `tools/preview/demo-assets/tiktok-1..7.jpg` are cover images of the owner's own public TikTok videos, used in the preview only. The owner should upload her own thumbnails in the theme editor. Cover 1 shows a person (identity not confirmed here).
- A TikTok cover with an expired "Summer Sale 10% / SUMMER26" promo was deliberately excluded and deleted.

## Verification
- Theme Check: 0 errors, 0 warnings.
- Browser suite: 28/28 pass, no page errors. Layout check at 360/390/430/768/1024/1440 widths: no horizontal overflow.
- Not yet verified: a real Shopify dev store. The Shop icon is a Shopify glyph stand-in.

## About page (founder)
New `about-founder` section: "Hi, I'm Tamara." hero with an arch portrait, her own words from her TikTok/Shop post (quoted, not rewritten), a signature, three brand facts, a photo mosaic of the work, and follow buttons. The portrait is an image slot; the preview uses a cover of her own TikTok video as a stand-in, so she should upload her chosen portrait in the theme editor. The photo shown on her TikTok post is deliberately not used.

## Social showcase
Instagram and TikTok are one section and one continuous row: photos and video covers interleaved, each with a small platform badge, and both follow buttons together.

## Homepage sections
Hero, Pick a scent, Custom scent, Bundle, Our story (dome restored), social showcase, FAQ and reviews are all present. The V3 scent selector is retired; the V2 scents rail and Discover by mood explorer are both back.~~

## Product frames
The V2 product card and its CSS (large unframed arch/soft-cornered images, staggered rail, family label above the title, round-free quick add) are restored exactly; the V3.1 bordered-card variant is removed.

## Scents to Discover by mood seam
Both sections stay separate, as in V2. The seam between them is a soft vertical fade (paper to blush) instead of a second curved dome; `edge` setting on the explorer (blend / dome).

## Bundle popup, announcement bar, Our story
- (Reverted) Bundle popup removed at the client's request; the bundle section is back on the homepage after Custom scent. `sections/bundle-popup.liquid` is an inert stub to delete. Original note: a small non-modal popup (section `bundle-popup` in the footer group) appears after 25s or about halfway down the page, once per visit, remembers dismissal for 7 days, and is never shown on the cart or product pages. All settings are in the theme editor.
- The announcement bar is white to match the navigation.
- Our story: shorter copy, soft-swell seam (different from the domes), offset arch frame plus round inset.

## Round: mood, story, colours, footer, announcement
- Discover by mood on phones: pill tabs, one description, swipeable row of framed picks (fixed a sideways overflow).
- Our story: V2 dome layout restored; quote is small and sits in a framed card; section is smaller; a pink panel sits behind the floating frames.
- Watch us pour has its own blush background; Our story stays paper.
- Footer: straight edge with a hairline instead of a dome.
- Announcement bar: five rolling messages (auto, vertical slide, pauses on hover/focus, static under reduced motion). Messages only restate things the business already says; no shipping or discount claims.

## Round: search order, wording, portrait
- Mobile search: popular scents (pictures) first, written shortcuts underneath; shortcuts hide while results show.
- Wording: removed the "Behind the pour" label; "Watch us pour." is now "Follow along."; "In her own words" is now "A note from Tamara".
- About portrait: demo-only stand-in is a post from the brand Instagram (founder holding a burner and melts, no text). Low resolution (480x640); the owner should upload a high-resolution original in the theme editor.
- Footer: the curved dome is back (the straight-edge experiment is reverted).
- Overscroll: the page behind the footer is dark and elastic overscroll is turned off, so pulling past the bottom no longer flashes white.
- Hero label "Handmade wax melts · UK" removed. Our story: everything sits inside one large curved white box on a blush background, no shadows, no panel behind the photos. The social section has no heading or intro (buttons plus the row only) and shares the story's blush background.

## Find your scent: immersive journey
New `scent-journey` section on the Find your scent page: pick a mood (the whole screen changes colour and a soft orb drifts), then browse that mood's real scents on a large stage with their top/heart/base notes, add to bag from the stage, "Surprise me" picks one at random. Phones use pill moods, one large framed scent and a thumbnail strip. Moods, colours and copy are blocks and settings in the theme editor. Also: nav links no longer wrap between 1000 and 1199px.
- Breadcrumbs ("Home / Page name") now head the About and Find your scent pages like the FAQ page, and sit above Shopify's own legal/policy pages (via the layout). Our story has a straight top edge under the bundle. Social row: bigger tiles, uneven heights and offsets (V2 rhythm), follow buttons below the row.
- Our story and the social row now sit on the same page background as "Good to know"; the story box is pure white with a hairline and a soft shadow so it floats off the page.
