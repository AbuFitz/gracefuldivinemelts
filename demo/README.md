# Temporary Vercel design preview

**Not Shopify.** This renders the theme with a local approximation of Shopify's Liquid runtime (the same one used for QA in `tools/preview`), using the live store's *public* products and photos. Cart is simulated (cookie, per visitor); checkout is a stub. It exists so the design can be viewed while it is being edited.

## Set up on Vercel
1. Project → Settings → General → **Root Directory = `demo`** (leave "include source files outside root" ON).
2. Framework Preset **Other** (this folder's `vercel.json` already overrides build settings).
3. Settings → Deployment Protection: keep **Vercel Authentication** on for a private link, or switch off for a public one. Pages are also `noindex`.
4. Every push to the branch redeploys.

## Remove when the demo phase ends
Delete the Vercel project, then `git rm -r demo` (and optionally `tools/preview`). The theme itself never depends on any of this.

## Preview-only layers (not part of the theme)
- **Banner:** green "Design preview · Created by OneSimpleSite · onesimplesite.co.uk", injected by the preview server only while `GDM_DEMO_BANNER=1` (set by `demo/api/index.mjs`). The Shopify theme has no banner code or setting.
- **Payment icons:** the footer shows placeholder icons plus a "Demo only" note in this preview. On Shopify the footer shows only the methods enabled in Settings → Payments (`shop.enabled_payment_types`).
- **Remove everything** with the demo: delete the Vercel project, then `git rm -r demo`.
