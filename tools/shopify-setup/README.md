# Store setup script (Shopify Admin API)

A theme upload carries the design and its wording. It cannot create pages, menus, discount codes or product fields. This script does, safely.

**Status: tested against a local mock of the API only. It has not yet run against a real Shopify store.** That is why the default is a dry run, and why you should read the dry-run output before using `--apply`. If Shopify rejects anything, the script prints the exact message and carries on; send that to us.

## What it does
| Step | Creates | If it already exists |
|---|---|---|
| 1 | Five product fields (`custom.scent_family`, `top_notes`, `heart_notes`, `base_notes`, `inspired_by`) with storefront access | skipped |
| 2 | Pages About, Find your scent, FAQ, Care & safety, Delivery & returns, Contact, Policies & legal, each with the right template | skipped |
| 3 | Checks the `wax-melts` collection exists (it never creates it: which products go in it is her choice) | reports |
| 4 | Discount code `WELCOME10`, 10% off the order, one use per customer, can combine with shipping discounts | skipped |
| 5 | Menus `main-menu` and `footer` | **left untouched** unless you pass `--replace-menus` |

It never deletes anything and never touches products, orders, customers or policies.

## 1. Get a token (5 minutes)
1. In her admin: **Settings > Apps and sales channels > Develop apps > Create an app** (turn on "Allow custom app development" if asked). Name it `GDM setup`.
2. **Configure Admin API scopes**, tick only: `read_products`, `write_content`, `write_online_store_pages`, `read_online_store_navigation`, `write_online_store_navigation`, `read_discounts`, `write_discounts`, `read_metaobject_definitions`, `write_metaobject_definitions`, `read_products` and **`write_products`** (product field definitions are managed under the products scope). If a name is not offered, pick the closest in Content, Online Store, Discounts and Products.
3. **Install app**, then **Reveal token once**. It starts `shpat_`. Copy it somewhere safe; you cannot see it again.

## 2. Run it (on your own computer; Node 18 or newer)
```bash
cd tools/shopify-setup
export SHOPIFY_STORE=her-store.myshopify.com
export SHOPIFY_TOKEN=shpat_xxxxxxxx
node setup.mjs            # dry run: only lists what it WOULD do
node setup.mjs --apply    # creates
```
Menus: her existing `main-menu` is not changed by default. To switch it to our four links (Shop, Discover Scents, Custom Scent, About) run once more with `--replace-menus` (after the pages exist). Take a note of her current menu first.

## 3. Scent data on her products
```bash
node setup.mjs --csv      # writes scent-fields.csv, no network needed
```
- The notes were copied from her live product descriptions. **The scent families (Floral, Sweet, Woody) are a design guess.** She must check every row before it is imported.
- Back up first (Products > Export). Import with **Products > Import**, tick *Overwrite existing products with matching handles*. Try a one-row file first and open that product to check it landed.
- Alternative: type the values into each product by hand (bottom of the product page).

## 4. Finish
Delete the `GDM setup` app (Settings > Apps > Develop apps) so the token stops working. Then do the by-hand items in `docs/20`: refund, shipping and terms policies, the welcome email, the cookie banner.
