# V3.1 revisions (after V3 review)

Client feedback on V3 reversed several V3 decisions. This note records what changed and why.

## Reversed to the V2 design (client preferred it)
- **Hero**: the V2 pink hero (arch image, orb, price hotspots) is back in full. The V3 product-stage hero was removed from the homepage (its JS is dormant).
- **Navigation**: the floating white pill is back at the full 80rem width with the V2 Search button, and a perfectly round (999px radius) edge. The only change from V2 is the logo, now centred and unframed. On mobile the logo is centred as well.
- **Curved sections**: the V2 domes are kept. The hero-to-scents join now uses a softer asymmetric "swell" curve (`.sheet--swell`). Bundle and Our story use a flat top (`curve` setting, default flat) so the curve is not repeated on every section.
- **Product framing**: bordered cards with arch/soft image crops and a staggered rail are back.

## New
- **Pick a scent** (`product-rail` with `mood` blocks): "Discover by mood" and the scents rail are one section. Moods filter the rail from real product metadata. The V3 scent selector is retired (`scent-selector` and `scent-explorer` are inert stubs; delete them in the theme editor or repo).
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

## Homepage sections
Hero, Pick a scent, Custom scent, Bundle, Our story (dome restored), social showcase, FAQ and reviews are all present. The only section retired is the V3 scent selector, replaced by Pick a scent.
