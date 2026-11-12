# Task sheet: set up Graceful Divine Melts in Shopify admin

For whoever (or whatever) is operating the Shopify admin on the owner's behalf. Follow it in order. Stop and ask a human at any **STOP** marker.

Store: `gracefuldivinemelts.com` (Shopify Basic). The new theme is already uploaded as an unpublished draft named `graceful-divine-melts-theme`.

## Ground rules (read first)
1. **Never publish the new theme** until a human writes "GO" (Part C).
2. **Do not touch:** products' titles, prices, stock or images; orders; customers; payments; billing; plan; shipping rates; taxes; domains; the live theme "Updated copy of Flora" and its duplicate. Never click the blue **Update** button next to those themes.
3. **Delete only what this sheet names.** Nothing else.
4. Do not edit the live **Main menu** or **Footer menu** before Part C. They are also the old site's menus.
5. Never paste any password, token or login into a chat or document.
6. Button names change. Use the closest match. If something is not as described, **STOP** and send a screenshot to the human instead of guessing.
7. Copy text exactly, including capitalisation and punctuation.

## Already done
- Draft theme uploaded and opens in the editor without an error line.
- Five product fields created (Scent family, Top notes, Heart notes, Base notes, Inspired by), with storefront access on. Top, Heart and Base notes are *List of single line text*.

---

## Part A: before go-live (safe, changes nothing customers can see)

### A1. Create five hidden pages
Online Store > Pages > **Add page**. For each: type the **Title**, leave the content empty, set **Visibility: Hidden**, leave **Template: Default page**. Then open **Search engine listing** (pencil icon) and set **URL handle** exactly as below (lowercase, no capitals).

| Title | URL handle |
|---|---|
| About | `about` |
| Find your scent | `find-your-scent` |
| Wax melt care & safety | `wax-melt-care-safety` |
| Delivery & returns | `delivery-returns` |
| Policies & legal | `policies` |

Click **Save** and confirm the handle was kept (no `-1` at the end). The FAQ and Contact pages already exist: **leave them alone**.

If an old unlinked draft "Wax Melt Care Guide in Pink" (Hidden) exists, it may be deleted. Nothing else.

### A2. The welcome discount code
Discounts > Create discount > **Amount off order**.
- Method: Discount code, code `WELCOME10`
- Value: **10%**, applies to all products
- Minimum purchase: none
- Customer eligibility: all customers
- Usage limits: tick **Limit to one use per customer**
- Combinations: allow shipping discounts to combine; no others
- Start now, no end date
Save. (Confirm with the owner first that **10%** is what she wants. **STOP** if unsure.)

### A3. Collection check
Products > Collections: confirm a collection with the handle `wax-melts` exists and contains the wax melt products. If missing: **STOP** and ask the human.

### A4. Settings checks (view only unless stated)
- Settings > Store details: note the **Store contact email**. The contact form delivers there. It must be an inbox the owner reads.
- Settings > Policies: Privacy policy should exist. Note whether Refund, Shipping and Terms of service exist. **Do not write legal text**: if missing, **STOP** and tell the human.
- Settings > Customer privacy: note whether the cookie banner is on.

### A5. Scent data on products (needs the owner's approval of the values)
Each scent product needs: Scent family (Floral, Sweet, Woody or Fresh), Top notes, Heart notes, Base notes, Inspired by (optional). In the product page, scroll down to **Metafields** and fill them. The starting values are in `tools/shopify-setup/scent-fields.csv` in the project repository. The notes come from her own product descriptions; the **scent families are only a suggestion and must be confirmed by the owner**. **STOP** until she confirms the families.

### A6. Report back (end of Part A)
Send the human: screenshots of the Pages list, the discount code page, the Store contact email, the Policies list, and any step that did not match this sheet.

---

## Part B: preview on the draft theme (still unpublished)
Online Store > Themes > on `graceful-divine-melts-theme` click **Edit theme**.
- Open Home page, a product, a collection, the cart. Confirm there is **no red error line** across the top.
- Note anything that looks empty or broken with a screenshot.
- Do **not** press Publish.

Optional: in the editor, open **footer area > Welcome offer popup** and confirm the code shown is `WELCOME10`.

**STOP. Wait for the human to write GO.**

---

## Part C: go-live (only after "GO"; do it in one sitting)

1. **Publish** the new theme (Themes > ⋯ > Publish).
2. For each page set its template, then set **Visibility: Visible**:

| Page | Template |
|---|---|
| About | `about` |
| Find your scent | `find-scent` |
| Wax melt care & safety | `care` |
| Delivery & returns | `delivery` |
| Policies & legal | `policies` |

3. Existing **FAQ** page (title "Wax Melt Care & Use – FAQ"): change its **URL handle** to `faq`, **tick "Create a URL redirect"** if offered, set Template `faq`. If no redirect box appears, add one: Online Store > Navigation > View URL redirects > Create: from `/pages/gracefuldivinemeltswax-melt-faq` to `/pages/faq`.
4. Existing **Contact** page: Template `contact`.
5. **Menus** (Content > Menus). Main menu, exactly four items in this order:
   1. Shop > the `wax-melts` collection
   2. Discover Scents > page Find your scent
   3. Custom Scent > product "Request a specific scent"
   4. About > page About

   Footer menu, exactly four items: FAQ (page FAQ), Delivery & returns, Wax melt care & safety, Contact.
6. In the theme editor (Customise), **Theme settings**: fill in business email, phone, hours, WhatsApp link, and the social links (Instagram `https://www.instagram.com/gracefuldivinemelts`, TikTok `https://www.tiktok.com/@gracefuldivinemelts`) if empty. Do not invent phone numbers or addresses: leave blank and report.
7. Marketing > Automations: turn on **Welcome new subscribers** (Shopify Email) and include the code `WELCOME10`. If it is not available on the plan, **STOP** and report.

## Part D: test checklist (after publishing)
On a phone and a laptop, on the live site:
- Homepage loads, no red error; menu, search ("rose"), bag.
- Add a scent from the homepage, from Find your scent, from a product page; change quantity; remove.
- Custom scent product: the request box is required; the typed text shows on the order line.
- Bundle product: choose a pair; correct variant and price reach the bag.
- Welcome popup: appears after about 12 seconds or 40% scroll; sign up with a test address (e.g. a mailbox you control); it appears in Customers with tags `newsletter` and `welcome-offer`; the code works at checkout; closing it does not bring it back.
- Contact form: send a test message; confirm it arrives in the store contact inbox (check junk).
- Pages: About, Find your scent, FAQ, Care, Delivery, Contact, Policies all load; each shows "Home / Page name" above the headline.
- Footer: all icons open the right place; payment icons are the methods enabled in Settings > Payments.
- Test order without charging a real card: use a 100%-off test code, complete it, then cancel and archive the order, then delete the test code. Do not use real customer data.

**Rollback:** Themes > on "Updated copy of Flora" > ⋯ > Publish. Report the problem to the human.

## Report back
Send the human: what was done, anything skipped, every error message (exact text), and screenshots of each STOP point.
