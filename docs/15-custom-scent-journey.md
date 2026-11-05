# 15 — Custom scent journey (product `request-a-specific-scent`, £15.99)

## What the customer does
1. Finds it from the nav (*Custom Scent*), the search shortcuts, the homepage feature, or the collection promo.
2. Optionally types the scent on the homepage; the text is carried to the product page (`?scent=`) and pre-filled.
3. On the product page (`product.custom-scent` template) they see the price, "3 wax melts in your requested scent", a **required** field *Which scent would you like?*, quantity and **Add to bag**. A note states *Requests are subject to availability.*
4. The request is submitted through the normal Shopify cart as a **line-item property** named *Requested scent*. It stays attached to that line (not a cart-wide note), is visible in the bag, and travels with the order.
5. The merchant sees it on the order. The existing live copy tells customers to use checkout *Special instructions* — that wording is replaced on this template by the new journey (the product description block is not shown on this template).

## What was verified
In the local mock only: the required field blocks empty submissions, `?scent=` prefills, the property is stored on the line and displayed in the bag. **Not yet verified on Shopify:** that the property displays in checkout, the order admin, order confirmation and packing slip. Test it on a development store with a test order before launch.

## Not decided — needs the owner (not invented)
| Question | Why it matters |
|---|---|
| If a requested scent is unavailable, who contacts the customer, how, and within what time? | The brief requires this to be documented; the site only says "subject to availability" |
| Is the order held before preparing, or prepared and then cancelled? | Determines refund/cancellation process |
| How is a refund or alternative scent offered, and how long does a refund take? | UK consumer-law and policy wording; add to the Refund policy record |
| Is WhatsApp (her published *Custom scent requests* graphic) still a confirmation channel? | The theme uses the order, not WhatsApp; WhatsApp link stays in the footer/contact |
| Are brand-named perfumes acceptable in requests (trademark / "dupe" wording)? | Legal review |
| Can customers request something that conflicts with safety rules (allergens, labelling)? | Product-safety review |
| Update the product description in Shopify to match the new flow | The current text references the Special Instructions box |
Hard facts from the live product: £15.99; "You will be given 3 wax melts"; subject to availability. The owner's own graphic describes a three-step process (tell us the scent → we check availability and confirm → enjoy); the on-site steps mirror that without adding promises about refunds or timings.
