# 11 — Brand research, media inventory and content map

## 1. Brand sources: what was actually verified
| Source | Result | Used for |
|---|---|---|
| Original store (`gracefuldivinemelts.com`) | Crawled in full (doc 01) | Catalogue, copy, FAQ, policies, imagery |
| Shop app profile (`shop.app/m/gracefuldivinemelts`, redirects to `shop.com/m/…`) | **Read** via a browser fetch (direct fetches were rate-limited). Description verified. Lists collections Wax Melts and Bundles, 11 products | Brand story, profile link |
| Instagram `@gracefuldivinemelts` | **Read** (logged-out view): bio "wax melts \| UK Based — Poured with intention, inspired by grace", link-in-bio includes the website and WhatsApp, highlights: *Our scents, Mixed package, Customer review, BTS*. Follower/post counts exist but are **not displayed** on the site (they change and are small) | Handle, tagline, follow CTA |
| Google Business Profile | **Could not be read**: Google served a bot check to this environment. Only the identifiers in the store's own link (`kgmid=/g/11zxdwrt_5`) are known. **No rating or review count is stated anywhere** | A "Google reviews" link to the profile; a "Review us on Google" button appears only once a write-review link is entered in Theme settings |
| TikTok `@gracefuldivine2` (existing footer link) | Not verifiable from here (page reported the account as not found to this environment). **Removed from defaults**; field kept in Theme settings | — |
| Trustpilot (existing link) | Link retained from the live store; page not read; **no rating claimed** | Review link |
| Public reviews | None verified → none shown. The single unattributed homepage quote is not used | — |

### Brand story (verified text)
Shop profile description, verbatim: *"Graceful Divine Melts was created from Our genuine love for perfumes and candles and the way beautiful scents have always made is feel good, calm, and uplifted. We poured that feeling into every product, wanting others to experience the same comfort and joy we find in fragrance."*
Used on the site with three silent typo corrections ("Our"→"our", "made is feel"→"made us feel", comma tidy). **Owner to approve the corrected wording.** Instagram tagline "Poured with intention, inspired by grace" is used in the announcement bar and footer.

## 2. Social integration decision
| | Curated gallery (chosen) | Live Instagram widget/app |
|---|---|---|
| Visual flexibility | Full: mixed aspect ratios, video, captions | Usually fixed square grid |
| Performance | Shopify-hosted images, lazy | Third-party script + external images |
| Privacy / consent | None added | Third-party cookies/scripts; needs consent handling |
| Reliability | Does not depend on Meta's API/tokens | Tokens expire; API changes break widgets |
| Permissions | Owner uploads her own files | App needs account access |
| Cost / maintenance | £0; owner swaps images in the theme editor | Often a monthly fee; ongoing upkeep |
Instagram's own CDN image URLs are signed and expire, so they are **never hotlinked**. The rail uses files already on the store's Shopify CDN (the store's Instagram sync), and the owner can replace them with originals.

## 3. Media inventory
Permission column: **Owner-published** = already published by the owner on her own store/Shop profile; ownership of the underlying photo is **owner to confirm** (several images look studio-composited; none should be AI-generated per the brief).

| # | File (Shopify Files) | Source URL base | Type | Permission | Intended use | Crop / aspect | Alt text | Mobile |
|---|---|---|---|---|---|---|---|---|
| 1 | `B8B5F1DE-4923-459A-8A4B-5E4DEA0E5B43.jpg` | cdn.shopify.com/s/files/1/0969/1437/4982/files/ | Photo, pouches flat-lay | Owner-published (product image) | Hero arch | 3:4 portrait, arch mask | Two pink pouches of heart-shaped wax melts beside a pink card | Arch under headline, full width ≤34rem |
| 2 | `20260820041440_38331383.jpg` | same | Photo, hand holding pink heart melt, flowers | Owner-published | Hero circle; media rail (tall) | Circle crop (1:1 centre); 9:14 | A hand holding a pink heart-shaped wax melt beside pink flowers | Overlaps arch bottom-left |
| 3 | `B4CE0A0E-F326-4A16-9652-569A94A410AF.png` | same | Photo, coloured hearts on dish | Owner-published (Mixed Scent Package image 3) | Story arch | 3:4, arch | Hand holding purple heart-shaped wax melt over a dish with yellow and blue hearts | Stacked above second image |
| 4 | `instagram-image-33691ada-f79d-4c12-ae82-4dd3eb3a1a3c.jpg` | same | Photo, wax in moulds (preparation) | Owner-published (Instagram sync) | Story inset; media rail | 4:3 | Pink wax poured into heart and bar moulds on a glass table | Overlapped inset |
| 5 | `instagram-image-0dd90166-7cfe-40a9-81ca-9984b6342fe1.jpg` | same | Photo, three snap bars in hand | Owner-published | Media rail | 4:5 | A hand holding three snap bars of wax melts in blue, yellow and black | 58 vw rail item |
| 6 | `3D815A4E-00F9-4200-A8C9-F7B010B05AF3.png` | same | Photo, holographic pouches | Owner-published (Mixed Scent Package) | Media rail | 1:1 | Two pink pouches of mixed heart-shaped wax melts | Rail item |
| 7 | `IMG-0641.png` | same | Product photo, "?" snap bar | Owner-published (Request a scent) | Custom-scent feature arch | 3:4 arch | A hand holding a snap bar of cream wax melts marked with question marks | Above headline |
| 8 | `9FDA295B-6575-4B27-8E83-873BED1ECD7D.png` | same | Product photo, full bundle | Owner-published | Bundle showcase (organic mask) + product page | 1:1 | Wax burner, three snap bars, two pouches and tealights | Full width |
| 9 | 13 product photos | `/products.json` | Product photography | Owner-published | Rail, explorer, search, cards, product pages | 3:4 | From Shopify (set per image in admin) | 2-up grid |
| 10 | `Black_and_Beige_Minimalist_Elegant_Cosmetics_Logo-4.png` | same | Logo | Owner's | Nav logo coin (set in Theme settings) | 1:1 | Graceful Divine Melts | 3.7–4.3 rem coin |
| 11 | Homepage video (`…20afbb3f….HD-1080p-7.2Mbps….mp4`) | gracefuldivinemelts.com/cdn/shop/videos/ | Video 1080p, 7.2 Mbps | Owner-published | Media rail video tile | 9:14 tile | Poster alt via caption | `preload=none`, muted autoplay only in view; never when reduced-motion/data-saver |

**Not used, with reasons:** `instagram-image-023828b8…` (custom-scent promo graphic with text and a phone number); `…201380ed…` (bundle "returning for Christmas" promo, dated); `…bab9a363…` (expired summer-sale graphic with discount code); `…70c49946…` (text "Now available" graphic); `…bc1df531…` (portrait of a woman — identity and whether it is real photography are unknown; do not use until the owner confirms); `DA26315C…` (script banner); Shop profile cover (`FF57A527…`; usable later); all `cdninstagram.com` URLs (expiring, not owned by the theme).
**Gaps:** the owner has few real process/burner/packing photos in public. The media rail and story reuse some images; ask the owner for 6–10 originals (pouring, packing, burner in use, orders ready to ship, a face if she wishes) and a shorter (≤ 720p) video, then swap them in the editor.

## 4. Content inventory (by homepage section)
| Section | Purpose | Primary content & source | Media | Interaction | Mobile | Shopify resource | Fallback |
|---|---|---|---|---|---|---|---|
| Hero | State what is sold, start shopping | "Wax melts inspired by perfume." (brief); handmade/small batch (live FAQ) | Arch + circle photos, hotspot | CTAs; hotspot link | Stacked stage | Image pickers, product picker | Placeholder SVG; hotspot hidden |
| Pick a scent | Browse the range | Real titles/prices/availability | Product photos | Rail, arrows, quick add | 68 vw snap rail | Collection `wax-melts` | Empty state |
| Discover by mood | Choose by fragrance family | Family descriptions (from product notes) | Products per family | Tabs | Chip tabs | Metafield `scent_family` | All panels visible without JS; description + link without metafields |
| Custom scent | Differentiator, £15.99 / 3 melts | Live product copy; owner's own request process | Product image | Typed scent → product page | Image first | Product `request-a-specific-scent` | Form posts to product page |
| Bundle | Show what is in the box | Live bundle description | Bundle photo, pins, scent faces | Pick-a-pair on product page | Pins hidden ≤599 px | Product + variants | Text list |
| Story | Credibility and personality | Shop-profile story | Two photos | Handle link | Stacked | Section settings | Text only |
| Media rail | Real social proof of craft | Captions; Instagram handle | Photos + video | Rail, play | 58 vw rail | Files, video | Photos only |
| Quick answers | Remove last doubts | 4 verified FAQs | — | `details` | Full width | Blocks | Native |
| Review links | Send reviews to real profiles | Links only | — | — | Wraps | Theme settings | Hidden if empty |
