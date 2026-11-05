# Temporary Vercel design preview

**Not Shopify.** This renders the theme with a local approximation of Shopify's Liquid runtime (the same one used for QA in `tools/preview`), using the live store's *public* products and photos. Cart is simulated (cookie, per visitor); checkout is a stub. It exists so the design can be viewed while it is being edited.

## Set up on Vercel
1. Project → Settings → General → **Root Directory = `demo`** (leave "include source files outside root" ON).
2. Framework Preset **Other** (this folder's `vercel.json` already overrides build settings).
3. Settings → Deployment Protection: keep **Vercel Authentication** on for a private link, or switch off for a public one. Pages are also `noindex`.
4. Every push to the branch redeploys.

## Remove when the demo phase ends
Delete the Vercel project, then `git rm -r demo` (and optionally `tools/preview`). The theme itself never depends on any of this.
