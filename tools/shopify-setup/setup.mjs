#!/usr/bin/env node
// Graceful Divine Melts: store setup via the Shopify Admin API.
// Creates what a theme upload cannot: product field definitions, pages (with the right template), the welcome discount code,
// and (optionally) the menus. Safe by default: DRY RUN unless you pass --apply, never deletes, skips anything that already exists,
// and never overwrites an existing menu unless you pass --replace-menus.
//
//   node setup.mjs --csv                      # no network: write scent-fields.csv for Products > Import
//   SHOPIFY_STORE=xxxx.myshopify.com SHOPIFY_TOKEN=shpat_... node setup.mjs            # dry run
//   SHOPIFY_STORE=... SHOPIFY_TOKEN=... node setup.mjs --apply                          # create things
//   SHOPIFY_STORE=... SHOPIFY_TOKEN=... node setup.mjs --apply --replace-menus          # also rewrite main-menu and footer
//
// Node 18+. No dependencies. The token comes from a custom app (Settings > Apps > Develop apps); delete the app when finished.
import fs from 'node:fs';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply'), REPLACE_MENUS = args.has('--replace-menus');
const STORE = (process.env.SHOPIFY_STORE || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
const TOKEN = process.env.SHOPIFY_TOKEN || '';
const API = process.env.SHOPIFY_API_VERSION || '2025-10';
const here = import.meta.dirname;

// ---------- what to create ----------
const FIELDS = [
  { key: 'scent_family', name: 'Scent family', type: 'single_line_text_field', description: 'Floral, Sweet, Woody or Fresh. Drives Find your scent, Discover by mood and the collection filter.' },
  { key: 'top_notes', name: 'Top notes', type: 'list.single_line_text_field', description: 'The first scents you notice.' },
  { key: 'heart_notes', name: 'Heart notes', type: 'list.single_line_text_field', description: 'The middle of the fragrance.' },
  { key: 'base_notes', name: 'Base notes', type: 'list.single_line_text_field', description: 'The lasting finish.' },
  { key: 'inspired_by', name: 'Inspired by', type: 'single_line_text_field', description: 'The perfume this scent is inspired by.' },
];
const PAGES = [
  { handle: 'about', title: 'About', template: 'about' },
  { handle: 'find-your-scent', title: 'Find your scent', template: 'find-scent' },
  { handle: 'faq', title: 'Wax Melt Care & Use – FAQ', template: 'faq' },
  { handle: 'wax-melt-care-safety', title: 'Wax melt care & safety', template: 'care' },
  { handle: 'delivery-returns', title: 'Delivery & returns', template: 'delivery' },
  { handle: 'contact', title: 'Contact', template: 'contact' },
  { handle: 'policies', title: 'Policies & legal', template: 'policies' },
];
const CODE = { code: process.env.WELCOME_CODE || 'WELCOME10', percent: Number(process.env.WELCOME_PERCENT || 10) };
const MENUS = [
  { handle: 'main-menu', title: 'Main menu', items: [
    { title: 'Shop', type: 'COLLECTION', handle: 'wax-melts' },
    { title: 'Discover Scents', type: 'PAGE', handle: 'find-your-scent' },
    { title: 'Custom Scent', type: 'PRODUCT', handle: 'request-a-specific-scent' },
    { title: 'About', type: 'PAGE', handle: 'about' } ] },
  { handle: 'footer', title: 'Footer menu', items: [
    { title: 'FAQ', type: 'PAGE', handle: 'faq' },
    { title: 'Delivery & returns', type: 'PAGE', handle: 'delivery-returns' },
    { title: 'Wax melt care & safety', type: 'PAGE', handle: 'wax-melt-care-safety' },
    { title: 'Contact', type: 'PAGE', handle: 'contact' } ] },
];

// ---------- CSV (no network) ----------
function writeCsv() {
  const meta = JSON.parse(fs.readFileSync(path.join(here, '../preview/demo-metafields.json'), 'utf8'));
  const q = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const list = (a) => q(JSON.stringify(a || []));
  const rows = [['Handle', 'Scent family (product.metafields.custom.scent_family)', 'Top notes (product.metafields.custom.top_notes)', 'Heart notes (product.metafields.custom.heart_notes)', 'Base notes (product.metafields.custom.base_notes)', 'Inspired by (product.metafields.custom.inspired_by)'].map(q).join(',')];
  for (const [handle, m] of Object.entries(meta)) {
    if (handle.startsWith('_')) continue;
    rows.push([q(handle), q(m.family), list(m.top), list(m.heart), list(m.base), q(m.inspired)].join(','));
  }
  const out = path.join(here, 'scent-fields.csv');
  fs.writeFileSync(out, rows.join('\n') + '\n');
  console.log(`Wrote ${out} (${rows.length - 1} products).`);
  console.log('Notes come from the live product descriptions. SCENT FAMILIES ARE A DESIGN GUESS: she must check each one before importing.');
  console.log('Import: Products > Import > choose this file > tick "Overwrite existing products with matching handles".');
}
if (args.has('--csv')) { writeCsv(); process.exit(0); }

// ---------- Admin API ----------
if (!STORE || !TOKEN) { console.error('Set SHOPIFY_STORE (xxxx.myshopify.com) and SHOPIFY_TOKEN, or use --csv. See README.md.'); process.exit(1); }
const gql = async (query, variables = {}) => {
  const res = await fetch(`${process.env.SHOPIFY_BASE || 'https://' + STORE}/admin/api/${API}/graphql.json`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-shopify-access-token': TOKEN }, body: JSON.stringify({ query, variables }) });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  if (j.errors) throw new Error('GraphQL: ' + JSON.stringify(j.errors).slice(0, 500));
  return j.data;
};
const userErrors = (u) => (u && u.length ? u.map((e) => `${(e.field || []).join('.')}: ${e.message}`).join('; ') : '');
const log = { made: 0, skipped: 0, failed: 0 };
const say = (tag, msg) => console.log(`${tag.padEnd(8)} ${msg}`);
const run = async (label, exists, create) => {
  try {
    if (await exists()) { log.skipped++; say('exists', label); return; }
    if (!APPLY) { say('WOULD', label); return; }
    const err = await create(); if (err) throw new Error(err);
    log.made++; say('created', label);
  } catch (e) { log.failed++; say('FAILED', `${label}: ${e.message}`); }
};

console.log(`${APPLY ? 'APPLYING' : 'DRY RUN (add --apply to create)'} on ${STORE}, API ${API}\n`);
const shop = await gql('{ shop { name myshopifyDomain } }');
console.log(`Connected to: ${shop.shop.name} (${shop.shop.myshopifyDomain})\n`);

// 1. product field definitions
const defs = (await gql(`{ metafieldDefinitions(ownerType: PRODUCT, namespace: "custom", first: 50) { nodes { key } } }`)).metafieldDefinitions.nodes.map((n) => n.key);
for (const f of FIELDS) await run(`product field custom.${f.key} (${f.name})`, async () => defs.includes(f.key), async () => {
  const d = await gql(`mutation($d: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $d) { userErrors { field message } } }`,
    { d: { name: f.name, namespace: 'custom', key: f.key, description: f.description, type: f.type, ownerType: 'PRODUCT', access: { storefront: 'PUBLIC_READ' }, pin: true } });
  return userErrors(d.metafieldDefinitionCreate.userErrors);
});

// 2. pages
for (const p of PAGES) await run(`page /pages/${p.handle} (template ${p.template})`, async () => {
  const d = await gql(`query($q: String!) { pages(first: 1, query: $q) { nodes { id } } }`, { q: `handle:${p.handle}` }); return d.pages.nodes.length > 0;
}, async () => {
  const d = await gql(`mutation($p: PageCreateInput!) { pageCreate(page: $p) { userErrors { field message } } }`,
    { p: { title: p.title, handle: p.handle, templateSuffix: p.template, body: '', isPublished: true } });
  return userErrors(d.pageCreate.userErrors);
});

// 3. collection check (never created: which products go in it is her decision)
const col = await gql(`query { collectionByHandle(handle: "wax-melts") { id title } }`).catch(() => null);
say(col && col.collectionByHandle ? 'exists' : 'MISSING', 'collection wax-melts' + (col && col.collectionByHandle ? '' : ' (create it in Products > Collections: the homepage and Find your scent draw from it)'));

// 4. discount code
await run(`discount code ${CODE.code} (${CODE.percent}% off the order, one use per customer)`, async () => {
  const d = await gql(`query($c: String!) { codeDiscountNodeByCode(code: $c) { id } }`, { c: CODE.code }); return !!d.codeDiscountNodeByCode;
}, async () => {
  const d = await gql(`mutation($b: DiscountCodeBasicInput!) { discountCodeBasicCreate(basicCodeDiscount: $b) { userErrors { field message } } }`, { b: {
    title: `Welcome offer ${CODE.percent}% (${CODE.code})`, code: CODE.code, startsAt: new Date().toISOString(), appliesOncePerCustomer: true,
    customerSelection: { all: true }, customerGets: { value: { percentage: CODE.percent / 100 }, items: { all: true } }, combinesWith: { orderDiscounts: false, productDiscounts: false, shippingDiscounts: true } } });
  return userErrors(d.discountCodeBasicCreate.userErrors);
});

// 5. menus (only with --replace-menus: never rewrite her menus by accident)
const resolve = async (it) => {
  if (it.type === 'PAGE') { const d = await gql(`query($q: String!) { pages(first: 1, query: $q) { nodes { id } } }`, { q: `handle:${it.handle}` }); return d.pages.nodes[0]?.id; }
  if (it.type === 'COLLECTION') { const d = await gql(`query($h: String!) { collectionByHandle(handle: $h) { id } }`, { h: it.handle }); return d.collectionByHandle?.id; }
  if (it.type === 'PRODUCT') { const d = await gql(`query($h: String!) { productByHandle(handle: $h) { id } }`, { h: it.handle }); return d.productByHandle?.id; }
};
const existingMenus = (await gql(`{ menus(first: 50) { nodes { id handle title } } }`)).menus.nodes;
for (const m of MENUS) {
  const have = existingMenus.find((x) => x.handle === m.handle);
  if (have && !REPLACE_MENUS) { say('exists', `menu ${m.handle} (left untouched; use --replace-menus to rewrite it)`); log.skipped++; continue; }
  if (!APPLY) { say('WOULD', `${have ? 'REWRITE' : 'create'} menu ${m.handle}: ${m.items.map((i) => i.title).join(' | ')}`); continue; }
  try {
    const items = [];
    for (const it of m.items) { const id = await resolve(it); if (!id) { say('SKIP', `menu item "${it.title}": ${it.type} ${it.handle} does not exist yet`); continue; } items.push({ title: it.title, type: it.type, resourceId: id }); }
    if (!items.length) throw new Error('no menu items could be resolved');
    const d = have
      ? await gql(`mutation($id: ID!, $t: String!, $i: [MenuItemUpdateInput!]!) { menuUpdate(id: $id, title: $t, items: $i) { userErrors { field message } } }`, { id: have.id, t: m.title, i: items })
      : await gql(`mutation($t: String!, $h: String!, $i: [MenuItemCreateInput!]!) { menuCreate(title: $t, handle: $h, items: $i) { userErrors { field message } } }`, { t: m.title, h: m.handle, i: items });
    const err = userErrors((d.menuUpdate || d.menuCreate).userErrors); if (err) throw new Error(err);
    log.made++; say('created', `menu ${m.handle}`);
  } catch (e) { log.failed++; say('FAILED', `menu ${m.handle}: ${e.message}`); }
}

console.log(`\nDone. created ${log.made}, already there ${log.skipped}, failed ${log.failed}.${APPLY ? '' : ' (dry run: nothing was changed)'}`);
console.log('Still by hand: scent data on products (scent-fields.csv), refund/shipping/terms policies, welcome email, cookie banner.');
process.exit(log.failed ? 1 : 0);
