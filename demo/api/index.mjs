// Single catch-all function: renders the theme with the mock Shopify runtime. Cart is stored in a cookie per visitor.
import path from 'node:path';
process.env.GDM_THEME_DIR = path.resolve(import.meta.dirname, '../_theme');
process.env.GDM_FIXTURES_DIR = path.resolve(import.meta.dirname, '../_data');
process.env.GDM_COOKIE_CART = '1';
process.env.GDM_DEMO_BANNER = '1';
// The preview has expired: every page shows the expired notice. Set the Vercel environment variable GDM_DEMO_EXPIRED=0 to show the design again.
process.env.GDM_DEMO_EXPIRED = process.env.GDM_DEMO_EXPIRED ?? '1';
const { handle } = await import('../_runtime/serve.mjs');
export default (req, res) => handle(req, res);
