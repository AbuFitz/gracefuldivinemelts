# 20: Go-live runbook for Graceful Divine Melts (Shopify Basic)

First live Shopify client. The aim: she can run the store herself afterwards, nothing is broken, and we are only needed for something major.

**Plan facts that matter:** Shopify **Basic**. Everything in the theme works on Basic. Basic does **not** include checkout code customisation (checkout.liquid / checkout UI extensions), so nothing here touches checkout: the custom-scent request travels as a line-item property on the product page, and the welcome code is a normal discount code.

> Status key: ☐ to do · ✔ done in the theme repo · **[admin]** has to be done inside her Shopify admin by someone with access.

---

## 0. Before touching anything

- ☐ Take a note of the **current live theme name** (this is the rollback).
- ☐ Export products (Products > Export) and take a screenshot of Settings > General > Policies as a safety copy.
- ☐ Duplicate the live theme (Online Store > Themes > ⋯ > Duplicate) and leave it untouched.

## 1. Install the theme as an unpublished copy **[admin]**

Either:
1. Download the repo as a zip (theme files at the root: `assets, config, layout, locales, sections, snippets, templates`) and **Online Store > Themes > Add theme > Upload zip**; or
2. **Add theme > Connect from GitHub** and pick branch `claude/exciting-cerf-2hsvp2` (or `main` once merged). Shopify then tracks that branch.

Do **not** publish yet. Use **Customise** and the theme preview link for everything below.

## 2. Product data the design reads **[admin]**

Settings > Custom data > Products > **Add definition** (turn on **Storefront access**, so the theme can read them):

| Name | Namespace and key | Type |
|---|---|---|
| Scent family | `custom.scent_family` | Single line text (values: Floral, Sweet, Woody, Fresh) |
| Top notes | `custom.top_notes` | List of single line text |
| Heart notes | `custom.heart_notes` | List of single line text |
| Base notes | `custom.base_notes` | List of single line text |
| Inspired by | `custom.inspired_by` | Single line text |

Fill these in on each scent product. The "Find your scent" page, "Discover by mood" and the collection filter all read them.

**Collection filters:** install the free **Search & Discovery** app and add filters: Availability, Scent family (from the metafield), Price. Without it the scent-family filter will not appear.

## 3. Content that must exist **[admin]**

| Create | Details |
|---|---|
| Collection | handle `wax-melts` (the homepage rail and scent pages draw from it) |
| Pages | **About** (template `about`), **Find your scent** (template `find-scent`), **FAQ** (template `faq`), **Wax melt care & safety** (template `care`), **Delivery & returns** (template `delivery`), **Contact** (template `contact`), **Policies & legal** (template `policies`) |
| Products | **Our bundle deal** (template `product.bundle`), **Request a specific scent** (template `product.custom-scent`), plus every scent product |
| Menus | `main-menu` (Shop, Discover Scents, Custom Scent, About) and `footer` (FAQ, Delivery & returns, Care & safety, Contact) |
| Policies | Settings > Policies: refund, privacy, terms, shipping (UK) |

Then Customise > Theme settings: business email, phone, hours, WhatsApp link, Instagram, TikTok, Google review link, Trustpilot and Shop links. Upload her chosen **portrait** (About page) and **thumbnails** for the Instagram/TikTok row.


## 3b. Legal pages: what you actually need to build **[admin]**

You do **not** build the legal pages in the theme. Shopify generates them from **Settings > Policies**; the theme only styles them and links them in the footer. For the UK, create these four (Shopify has a "Create from template" button for each; read it and edit to match her real business):

| Policy | Notes |
|---|---|
| **Privacy policy** | Already exists (updated 1 Nov 2026). Check her contact details inside it. |
| **Refund policy** | 14-day cancellation right for online orders, returns condition, who pays return postage, faulty or damaged goods. |
| **Shipping policy** | Carrier, prices, dispatch and delivery times, tracking. |
| **Terms of service** | Standard template is fine; check business name and address. |

Also add the trading name, address and company number (if she has one) under Theme settings so the footer shows them. Shopify's templates are a starting point, not legal advice; if she wants certainty, have a professional read them once. Wax melts are a product with heat and fragrance: the **Care & safety** page already carries sensible guidance; keep it matching her real labels.

The **Policies & legal** page and the footer links fill in by themselves as soon as the policies exist. Until then the preview shows a "Policy not yet published" note; on her live store that disappears once they are saved.

## 3c. The contact form: how it works **[admin]**

It is Shopify's built-in contact form, so it needs no app and no extra setup beyond the store email:

1. A visitor fills it in; Shopify spam protection (reCAPTCHA) runs in the background.
2. Shopify emails the message to the **store contact email** (Settings > Store details > *Store contact email*). Check this is an inbox she reads (currently gracefuldivinemelts@outlook.com).
3. The visitor sees "Thanks, message sent". The sender's address is on the message, so she replies from her normal email.
4. The message is also saved as a customer record (Customers) if the visitor is new.

Test it before going live: send a test message from the preview, and confirm it arrives in her inbox (check junk too). If it does not, the cause is almost always the store contact email under Settings > Store details. Shopify's **Inbox** or an app is optional and not needed.

## 4. Welcome offer: 10% for new subscribers

**Please confirm with her that 10% is the offer she wants.** Everything below is editable afterwards.

### 4a. The discount code **[admin]**
Discounts > **Create discount** > **Amount off order**:
- Method: Discount code **`WELCOME10`** (any name works: just make the same name in the popup settings)
- Value: **10%** of the whole order
- Minimum purchase: none (or what she prefers)
- Customer eligibility: all customers, or a segment of customers who have not ordered yet
- Usage limits: tick **Limit to one use per customer**
- Combinations and dates as she prefers

### 4b. The popup (already built in the theme ✔)
Customise > open the **footer area** > **Welcome offer popup**. She can change: on/off, label, heading, text, button words, consent line, thank-you words, the **code shown**, an image, the colour, how long before it appears, scroll trigger, how long it stays away after being closed, and whether it shows on phones.

- Sign-ups use Shopify's own customer form: the person appears in **Customers**, tagged `newsletter` and `welcome-offer`, with email marketing consent.
- After signing up, the popup shows the code with a **Copy code** button.
- It never shows on the bag page, account pages or checkout, once a person has signed up it never returns, and if they close it, it waits (30 days by default).

### 4c. The welcome email **[admin]**
Marketing > **Automations** > **Welcome new subscribers** (Shopify Email). Add her logo and a short note and include the `WELCOME10` code. Turn it on. (Shopify Email includes a free monthly allowance; check the current amount on her plan.)

> The popup's thank-you text says "Use this code at checkout on your first order." It does **not** claim an email is sent. Once the automation above is on, she may change it to "...we have also emailed it to you."

### 4d. Consent (UK)
Settings > **Customer privacy**: turn on the cookie banner for the UK/EU, link the privacy policy. The popup's consent line already links to her privacy policy.

## 5. Quality checks before going live

Run on the **unpublished** theme preview, on a real phone and a laptop:

- ☐ Homepage, each page and the policy pages load; breadcrumbs read "Home / Page name".
- ☐ Menu, search (type "rose"), bag, quantity change, remove.
- ☐ Add a scent from the homepage rail, from **Find your scent**, and from a product page.
- ☐ **Custom scent:** the box is required; the typed request appears on the order line in the admin.
- ☐ **Bundle:** choose a pair, the right variant and price land in the bag.
- ☐ **Welcome popup:** sign up with a real test address; the customer appears in Customers with both tags; the code works at checkout; closing it does not bring it back.
- ☐ **Checkout test without charging a card:** add the product, apply a 100%-off test code (create one, then delete it), complete the order, then cancel and archive it. (Alternatively, use Shopify Payments test mode for a short window; remember to switch it off.)
- ☐ Payments: footer shows the methods enabled in Settings > Payments.
- ☐ Contact form test message arrives in her inbox.
- ☐ Email links, WhatsApp and social links open the right places.
- ☐ No console errors; no sideways scroll on a small phone; keyboard Tab works through the menu and popup; Esc closes the popup.

## 6. Switch on and watch **[admin]**

1. **Publish** the new theme (Themes > ⋯ > Publish).
2. Open the live site on a phone and a laptop; click through the checklist again, quickly.
3. Keep the previous theme in the account for at least a month. **Rollback = publish the old theme.**
4. Watch Orders and Analytics for the first 48 hours.

## 7. Handover

- Give her the plain-English guide (`docs/09-customer-handover-guide.md`) and a 20 minute walk-through: editing text and images, changing the popup, adding a product, adding a scent's notes, changing the announcement messages.
- Tell her what is "major" (new page layouts, new features, anything broken after a Shopify update) and what she can do herself (everything in the theme editor).
- Remove staff/collaborator access we no longer need once the care plan terms are agreed.

## 8. Access we asked for: anything missing?

The requested list covers nearly everything. Items worth confirming are included or adding:

| Area | Why |
|---|---|
| **Settings > Custom data** (metafield definitions) | Required for the scent data above. Often missed because it is under Settings, not Products. |
| **Settings > Notifications** | To brand the order-confirmation and other emails if she wants. |
| **Settings > Customer privacy** | Cookie banner and consent for the UK. |
| **Settings > Payments, Taxes, Shipping** | Needed to verify the checkout and the footer payment icons (view is enough; changes are her decision). |
| **Search & Discovery app** | Collection filters by scent family. |
| **Shopify Email / Marketing automations** | Welcome email. Listed under Marketing: confirm automations are included. |
| **Sales channels** (Shop, Google & YouTube, Facebook & Instagram, TikTok) | Only if she wants them connected. |
| **Staff accounts** | Basic includes a small number of staff seats; collaborator access normally does not use one. |

---

*Everything above marked ✔ is built and covered by the automated browser tests in `tools/preview/e2e.mjs`. Everything marked **[admin]** cannot be tested outside a real store and needs the manual checks in section 5.*
