# Graceful Divine Melts notification emails

Prepared for the Shopify notification editor. Do not paste these into theme files.

## Global email branding

In **Settings → Notifications → Customer notifications → Customize email templates**:

- choose the same Graceful Divine Melts logo used by the theme;
- set the accent colour to `#A5256B`;
- keep the logo width close to `120px` so it remains crisp without dominating mobile emails.

These global controls brand every customer notification, including complex order and fulfilment emails, without replacing Shopify's maintained order logic.

## Marketing verification

`customer-marketing-confirmation.html` is the complete replacement for **Customer marketing confirmation**. Its confirmation action uses Shopify's required `{{ customer.subscribe_url }}` link. Subject: **One last step — confirm your email**.

The store currently has Marketing double opt-in turned off. Enabling it changes the signup flow and should be an owner decision.

## Other transactional emails

Keep Shopify's default bodies for Order confirmation, Shipping confirmation, Shipping update, Delivered, Refund and Cancellation so new platform fields remain supported. Add `social-footer.html` immediately before each template's closing `</body>` tag if a social footer is wanted. Global logo and accent branding already applies to all of them.

New customer accounts use Shopify's passwordless sign-in flow. Its one-time-code email is controlled by Shopify/checkout-and-account branding, not the legacy Customer account invite or password-reset templates.
