# Graceful Divine Melts — Shopify theme

Online Store 2.0 theme (Liquid, JSON templates, sections, metafields). No build step, no hosting subscription, no apps.

- Install as an **unpublished** theme: follow `docs/20-go-live-runbook-shopify-basic.md` (the step-by-step for the live client store), with `docs/08` as the general checklist.
- Documentation: `docs/00` (research) … `docs/09` (customer handover), plus V2: `10` visual audit, `11` brand/media inventory, `12` design direction, `13` SEO, `14` Shopify compatibility, `15` custom scent journey, `16` QA and outstanding tasks, `17` V3 creative correction (hero, nav, selector, Instagram marquee, footer, payments, preview banner). Screenshots: `docs/screenshots/`.
- Status: Theme Check clean; all local interaction tests pass (including the welcome popup); **not yet run on a Shopify store** (see `docs/14`, `docs/16`).
- `tools/preview` is a local visual-QA harness (LiquidJS + Playwright). It is not part of the theme (`.shopifyignore`).
