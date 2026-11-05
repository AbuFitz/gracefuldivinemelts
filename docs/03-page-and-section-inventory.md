# 03 — Page and section inventory

Status key: **Built** = implemented and rendered/tested in the local preview; **Store-dependent** = needs real Shopify data/admin setup to be complete.

## Page map
| Route | Template | Sections | Primary action | Status |
|---|---|---|---|---|
| `/` | `index.json` | hero, product rail, scent explorer, custom-scent feature, bundle showcase, story, media rail, FAQ, review links | Shop wax melts | Built (V2) |
| `/collections/all`, `/collections/*` | `collection.json` | main-collection (sort, filters, grid, pagination, empty states) | Open a product / quick add | Built; filters Store-dependent |
| `/collections` | `list-collections.json` | main-list-collections | Open a collection | Built |
| `/products/*` | `product.json` | main-product, related-products | Add to cart | Built |
| Bundle | `product.bundle.json` | pair-style options, bundle copy | Add to cart | Built; assign to bundle product |
| Request a specific scent | `product.custom-scent.json` | required "Which scent?" property | Add to cart | Built; assign to product |
| Mixed Scent Package | `product.json` | default product | Add to cart | Built |
| `/search` | `search.json` | main-search (+ predictive search in header) | Search | Built |
| `/cart` | `cart.json` | main-cart (empty state, quantity, remove, note, checkout) | Checkout | Built |
| `/pages/contact` | `page.contact.json` | contact-form | Send message | Built |
| FAQ page | `page.faq.json` | main-faq (4 groups, 14 questions) | Read / contact | Built |
| Care & safety | `page.care.json` | care-safety | Read | Built; owner safety review |
| Delivery & returns | `page.delivery.json` | policy-summary (pulls Shopify policy records) | Read | Built; needs policy records |
| Find your scent | `page.find-scent.json` | scent explorer (with page head), custom-scent feature, product rail | Pick a family | Built; needs metafields |
| About | `page.about.json` | page, image+text, newsletter | — | Built; owner story required |
| Policies hub | `page.policies.json` | policy-hub (lists every Shopify policy) | Open policy | Built |
| Any other page | `page.json` | main-page | — | Built |
| `/policies/*` | Shopify-rendered | styled via `.shopify-policy__*` CSS | — | Styled; records Store-dependent |
| `/blogs/*`, article | `blog.json`, `article.json` | main-blog, main-article | Read | Built |
| `/account/*` | `customers/*.json` | login, register, account, order, addresses, reset, activate | — | Built; **untested on Shopify** |
| Gift card | `gift_card.liquid` | minimal | — | Built; only matters if gift cards are sold |
| `404` | `404.json` | main-404 | Search / shop | Built |
| Password | `password.json` + `layout/password.liquid` | main-password | — | Built |

## Section library (editable in theme editor)
**V2:** announcement-bar · header (nav + menu sheet + search overlay) · footer · hero · product-rail · scent-explorer · custom-scent-feature · bundle-showcase · story-editorial · media-rail · faq · review-links · related-products · image-text · newsletter · video-feature · rich-text · plus the page-level sections above. (v1's usp-strip, featured-collection, scent-families, bundle-spotlight and quote were removed.) All homepage-relevant sections have presets; blocks are limited (e.g. key points ≤ 4).

## States covered
Empty cart · empty search · no search results · empty/filtered collection · sold-out product and card · unavailable variant combination · form validation errors · form success (contact, newsletter) · add-to-cart error and network failure (toast / inline) · loading (button spinner, cart dimming) · missing metafields (ladder hidden, description remains) · missing policy record (visible placeholder) · 404 · password page · no-JS fallbacks (native form posts, search link, noscript update button).
