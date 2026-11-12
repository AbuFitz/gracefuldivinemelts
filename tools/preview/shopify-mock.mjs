// Minimal Shopify-ish data + Liquid runtime for LOCAL VISUAL QA ONLY.
// It approximates Shopify objects/filters/tags well enough to render this theme in a browser.
// It is NOT Shopify: behaviour must still be verified on a development store (see docs/07-testing-and-qa.md).
import fs from 'node:fs';
import path from 'node:path';
import { Liquid } from 'liquidjs';

export const THEME = process.env.GDM_THEME_DIR || path.resolve(import.meta.dirname, '../..');
const FIX = process.env.GDM_FIXTURES_DIR || path.join(import.meta.dirname, 'fixtures');
export const imgNames = () => { const d = path.join(FIX, 'img'); return fs.existsSync(d) ? fs.readdirSync(d) : JSON.parse(fs.readFileSync(path.join(FIX, 'img-list.json'), 'utf8')); };
const read = (p) => fs.readFileSync(p, 'utf8');
const readJSON = (p) => JSON.parse(read(p));

/* ---------------- fixtures → Shopify-like objects ---------------- */
const rawProducts = readJSON(path.join(FIX, 'products.json'));
const demoMeta = readJSON(path.join(import.meta.dirname, 'demo-metafields.json'));
const cents = (s) => Math.round(parseFloat(s) * 100);
const imgObj = (i, alt = '') => ({ src: i.src.split('?')[0], width: i.width, height: i.height, alt: i.alt || alt, aspect_ratio: i.width / i.height, id: i.id });

function mapProduct(p) {
  const imgs = p.images.map((i) => imgObj(i, p.title));
  const media = imgs.map((i) => ({ id: i.id, media_type: 'image', preview_image: i, alt: i.alt, aspect_ratio: i.aspect_ratio }));
  const variants = p.variants.map((v) => ({
    id: v.id, title: v.title, price: cents(v.price), compare_at_price: v.compare_at_price ? cents(v.compare_at_price) : 0, available: v.available,
    options: [v.option1, v.option2, v.option3].filter(Boolean), featured_image: null,
  }));
  const prices = variants.map((v) => v.price);
  const first = variants.find((v) => v.available) || variants[0];
  const meta = demoMeta[p.handle] || {};
  const wrap = (v) => (v === undefined ? undefined : { value: v });
  return {
    object_type: 'product', id: p.id, title: p.title, handle: p.handle, url: `/products/${p.handle}`, description: p.body_html, tags: p.tags,
    available: variants.some((v) => v.available), price: Math.min(...prices), price_min: Math.min(...prices), price_max: Math.max(...prices), price_varies: Math.min(...prices) !== Math.max(...prices),
    compare_at_price: 0, compare_at_price_max: 0,
    featured_image: imgs[0], featured_media: media[0], media, images: imgs, variants,
    options: p.options.map((o) => o.name),
    options_with_values: p.options.map((o, idx) => ({ name: o.name, values: o.values, selected_value: first.options[idx] })),
    has_only_default_variant: variants.length === 1 && variants[0].title === 'Default Title',
    selected_or_first_available_variant: first,
    template_suffix: p.handle === 'our-bundle-deal' ? 'bundle' : p.handle === 'request-a-specific-scent' ? 'custom-scent' : '',
    metafields: { custom: { scent_family: wrap(meta.family), top_notes: wrap(meta.top), heart_notes: wrap(meta.heart), base_notes: wrap(meta.base), inspired_by: wrap(meta.inspired) } },
  };
}
export const products = rawProducts.map(mapProduct);
const byHandle = Object.fromEntries(products.map((p) => [p.handle, p]));
const pick = (...hs) => hs.map((h) => byHandle[h]).filter(Boolean);
const waxMelts = pick('mixed-scent-package', 'candles-example-product-4', 'golden-goddess', 'dark-desire', 'candles-example-product-3', 'modern-muse', 'divine-fortune', 'rose-elegance', 'paradox-wax-melt', 'limited-divine-noir');

const mkCollection = (handle, title, prods, extra = {}) => ({
  handle, title, url: `/collections/${handle}`, description: extra.description || '', products: prods, products_count: prods.length, image: null, featured_image: null,
  sort_by: 'manual', sort_options: [{ name: 'Featured', value: 'manual' }, { name: 'Best selling', value: 'best-selling' }, { name: 'Alphabetically, A-Z', value: 'title-ascending' }, { name: 'Price, low to high', value: 'price-ascending' }, { name: 'Price, high to low', value: 'price-descending' }],
  filters: extra.filters ?? [], ...extra.rest,
});
const demoFilters = [
  { label: 'Availability', type: 'list', active_values: [], values: [{ label: 'In stock', value: '1', param_name: 'filter.v.availability', count: 8, active: false }, { label: 'Out of stock', value: '0', param_name: 'filter.v.availability', count: 2, active: false }] },
  { label: 'Scent family', type: 'list', active_values: [], values: ['Floral', 'Sweet', 'Woody', 'Fresh'].map((v) => ({ label: v, value: v, param_name: 'filter.p.m.custom.scent_family', count: 3, active: false })) },
  { label: 'Price', type: 'price_range', active_values: [], range_max: 2899, min_value: { param_name: 'filter.v.price.gte', value: null }, max_value: { param_name: 'filter.v.price.lte', value: null } },
];
export const collections = {
  'wax-melts': mkCollection('wax-melts', 'Wax Melts', waxMelts, { filters: demoFilters }),
  all: mkCollection('all', 'Products', products, { filters: demoFilters }),
  'hero-picks': mkCollection('hero-picks', 'Hero picks', pick('dark-desire', 'candles-example-product-4', 'rose-elegance', 'modern-muse', 'candles-example-product-3')),
  bundles: mkCollection('bundles', 'Bundles', pick('our-bundle-deal', 'mixed-scent-package', 'request-a-specific-scent')),
  empty: mkCollection('empty', 'Empty demo collection', []),
};

/* ---------------- settings, menus, shop ---------------- */
const schema = readJSON(path.join(THEME, 'config/settings_schema.json'));
export const settings = {};
for (const g of schema) for (const s of g.settings || []) if (s.id) settings[s.id] = s.default ?? (s.type === 'checkbox' ? false : null);
const logoFile = imgNames().find((f) => f.startsWith('Black_and_Beige'));
settings.logo = logoFile ? { src: `/img/${logoFile}`, width: 1100, height: 1100, alt: 'Graceful Divine Melts' } : null;
settings.logo_width = 84;
settings.google_review_link = '';
settings.care_page = { url: '/pages/wax-melt-care-safety', title: 'Wax melt care & safety' };

const L = (title, url, links = []) => ({ title, url, links, current: false });
export const linklists = {
  'main-menu': { links: [L('Shop', '/collections/all', [L('All wax melts', '/collections/wax-melts'), L('Bundle deal', '/products/our-bundle-deal'), L('Mixed Scent Package', '/products/mixed-scent-package'), L('Gift & bundles', '/collections/bundles')]), L('Discover Scents', '/pages/find-your-scent'), L('Custom Scent', '/products/request-a-specific-scent'), L('About', '/pages/about')] },
  secondary: { links: [L('FAQ & care', '/pages/faq'), L('Delivery & returns', '/pages/delivery-returns'), L('Contact', '/pages/contact')] },
  footer: { links: [L('FAQ', '/pages/faq'), L('Delivery & returns', '/pages/delivery-returns'), L('Wax melt care & safety', '/pages/wax-melt-care-safety'), L('Contact', '/pages/contact')] },
};
export const policies = [{ title: 'Privacy policy', handle: 'privacy-policy', url: '/policies/privacy-policy', body: '<p>(Demo) Shopify-managed privacy policy text appears here. On the live store this record already exists.</p>' }];
export const shop = { name: 'Graceful Divine Melts', url: 'http://localhost', customer_accounts_enabled: true, policies, shipping_policy: null, refund_policy: null, terms_of_service: null, privacy_policy: policies[0], enabled_payment_types: ['visa', 'master', 'american_express', 'paypal', 'apple_pay', 'google_pay', 'shopify_pay'] };
export const routes = { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', search_url: '/search', predictive_search_url: '/search/suggest', all_products_collection_url: '/collections/all', account_url: '/account', account_login_url: '/account/login', account_register_url: '/account/register', account_logout_url: '/account/logout', account_addresses_url: '/account/addresses', privacy_policy_url: '/policies/privacy-policy', product_recommendations_url: '/recommendations/products' };

/* ---------------- cart (in-memory, single session) ---------------- */
export const cart = { items: [], note: '', taxes_included: true, cart_level_discount_applications: [] };
export function cartView() {
  const items = cart.items.map((it, i) => {
    const p = byHandle[it.handle]; const v = p.variants.find((x) => x.id === it.variant_id) || p.variants[0];
    return {
      key: `${v.id}:${i}`, id: v.id, quantity: it.quantity, url: p.url, image: p.featured_image, title: p.title, product: p, options_with_values: p.options_with_values.map((o) => ({ name: o.name, value: v.options[p.options.indexOf(o.name)] })),
      properties: it.properties || {}, final_price: v.price, final_line_price: v.price * it.quantity, original_line_price: v.price * it.quantity, line_level_discount_allocations: [], url_to_remove: `/cart/change?line=${i + 1}&quantity=0`, variant_id: v.id,
    };
  });
  const total = items.reduce((a, i) => a + i.final_line_price, 0);
  return { ...cart, items, item_count: items.reduce((a, i) => a + i.quantity, 0), total_price: total, original_total_price: total };
}
export function addToCart(variantId, quantity = 1, properties = {}) {
  const p = products.find((x) => x.variants.some((v) => v.id === variantId)); if (!p) return { status: 422, description: 'Cannot find variant' };
  const v = p.variants.find((x) => x.id === variantId);
  if (!v.available) return { status: 422, message: 'Cart Error', description: `All ${p.title} are sold out.` };
  const existing = cart.items.find((i) => i.variant_id === variantId && JSON.stringify(i.properties) === JSON.stringify(properties));
  if (existing) existing.quantity += quantity; else cart.items.push({ handle: p.handle, variant_id: variantId, quantity, properties });
  return { ok: true };
}

/* ---------------- Liquid engine ---------------- */
const locale = readJSON(path.join(THEME, 'locales/en.default.json'));
const interp = (s, vars) => String(s).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? '');
const fmtMoney = (c) => '£' + (Number(c) / 100).toFixed(2);
const kv = (args) => { const o = {}; for (const a of args) if (Array.isArray(a) && typeof a[0] === 'string') o[a[0]] = a[1]; return o; };

export const state = { forms: {}, locale };
export const missingKeys = new Set();

export function makeEngine() {
  const engine = new Liquid({ root: [path.join(THEME, 'snippets')], partials: [path.join(THEME, 'snippets')], extname: '.liquid', outputEscape: undefined, strictFilters: false, strictVariables: false, jsTruthy: false });
  engine.registerFilter('t', function (key, ...args) {
    const vars = kv(args); let v = key.split('.').reduce((a, k) => (a ? a[k] : undefined), locale);
    if (v === undefined) { missingKeys.add(key); return `[missing ${key}]`; }
    if (typeof v === 'object') v = vars.count === 1 ? v.one : v.other;
    return interp(v, vars);
  });
  engine.registerFilter('asset_url', (n) => `/assets/${n}`);
  engine.registerFilter('image_url', (img, ...a) => (img && img.src ? img.src.replace(/^https?:\/\/[^/]+\/cdn\/shop\/files\//, '/img/') : ''));
  engine.registerFilter('money', fmtMoney);
  engine.registerFilter('money_with_currency', (c) => fmtMoney(c) + ' GBP');
  engine.registerFilter('money_without_currency', (c) => (Number(c) / 100).toFixed(2));
  engine.registerFilter('placeholder_svg_tag', (n, cls) => `<svg class="${cls || ''}" viewBox="0 0 525 525" xmlns="http://www.w3.org/2000/svg"><rect width="525" height="525" fill="#f6c6dc"/></svg>`);
  engine.registerFilter('preload_tag', (url, ...a) => { const o = kv(a); return `<link rel="preload" href="${url}" as="${o.as}" type="${o.type}" crossorigin>`; });
  engine.registerFilter('structured_data', (p) => JSON.stringify({ '@context': 'http://schema.org/', '@type': 'Product', name: p.title, offers: p.variants.map((v) => ({ '@type': 'Offer', price: (v.price / 100).toFixed(2), priceCurrency: 'GBP', availability: v.available ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock' })) }));
  engine.registerFilter('payment_button', () => '<div class="shopify-payment-button"><button type="button" class="btn btn--block" style="margin-top:.75rem" disabled>[Shopify dynamic checkout button renders here]</button></div>');
  engine.registerFilter('payment_type_svg_tag', (type, ...a) => {
    const icons = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'payment-icons.json'), 'utf8')); const i = icons[type];
    if (!i) return `<svg viewBox="0 0 46 30" role="img" aria-label="Shop Pay"><title>Shop Pay</title><text x="23" y="19" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="800" font-size="8.5" fill="#5A31F4">Shop Pay</text></svg>`;
    return `<svg viewBox="-9 -3 42 30" role="img" aria-label="${i.t}"><title>${i.t}</title><path fill="#${i.h === '000000' ? '111111' : i.h}" d="${i.p}"/></svg>`;
  });
  engine.registerFilter('video_tag', (v) => (v && v.demoUrl ? `<video src="${v.demoUrl}" poster="${v.poster || ''}" muted loop playsinline preload="none"></video>` : ''));
  engine.registerFilter('default_errors', (e) => (Array.isArray(e) ? e.join('; ') : String(e)));
  engine.registerFilter('format_address', (a) => (a ? Object.values(a).join('<br>') : ''));
  engine.registerFilter('format_code', (c) => c);
  engine.registerFilter('time_tag', (d, f) => `<time datetime="${new Date(d || Date.now()).toISOString()}">${new Date(d || Date.now()).toDateString()}</time>`);
  engine.registerFilter('handle', (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  engine.registerFilter('at_most', (v, m) => Math.min(v, m));
  engine.registerFilter('strip_html', (s) => String(s || '').replace(/<[^>]+>/g, ''));

  // {% form 'type', ... %}
  engine.registerTag('form', {
    parse(token, remain) {
      this.args = token.args; this.tpls = [];
      const stream = this.liquid.parser.parseStream(remain);
      stream.on('tag:endform', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('endform missing'); });
      stream.start();
    },
    *render(ctx, emitter) {
      const type = (this.args.match(/^\s*['"]([^'"]+)['"]/) || [])[1];
      const cls = (this.args.match(/class:\s*['"]([^'"]*)['"]/) || [])[1];
      let id = (this.args.match(/\bid:\s*['"]([^'"]*)['"]/) || [])[1];
      if (!id) { const v = (this.args.match(/\bid:\s*([A-Za-z_][\w.]*)/) || [])[1]; if (v) id = ctx.getSync(v.split('.')); }
      const styleAttr = (this.args.match(/style:\s*['"]([^'"]*)['"]/) || [])[1];
      const st = state.forms[type] || {};
      const action = { product: '/cart/add', contact: '/contact', customer: '/contact', customer_login: '/account/login', create_customer: '/account', recover_customer_password: '/account/recover', customer_address: '/account/addresses' }[type] || '/';
      const form = { 'posted_successfully?': !!st.ok, errors: st.errors || null, ...(st.values || {}), id: 'f1' };
      ctx.push({ form });
      emitter.write(`<form method="post" action="${action}" ${id ? `id="${id}"` : ''} ${cls ? `class="${cls}"` : ''} ${styleAttr ? `style="${styleAttr}"` : ''} ${/data-product-form/.test(this.args) ? 'data-product-form' : ''} accept-charset="UTF-8"><input type="hidden" name="form_type" value="${type}">`);
      yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
      emitter.write('</form>');
      ctx.pop();
    },
  });
  // {% paginate x by n %}
  engine.registerTag('paginate', {
    parse(token, remain) {
      this.tpls = [];
      const stream = this.liquid.parser.parseStream(remain);
      stream.on('tag:endpaginate', () => stream.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => { throw new Error('endpaginate missing'); });
      stream.start();
    },
    *render(ctx, emitter) {
      ctx.push({ paginate: { pages: 1, current_page: 1, parts: [], previous: null, next: null, items: 0 } });
      yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
      ctx.pop();
    },
  });
  engine.registerTag('sections', {
    parse(token) { this.name = token.args.trim().replace(/['"]/g, ''); },
    async render() { return renderGroup(this.name, this.liquid); },
  });
  return engine;
}

/* ---------------- sections ---------------- */
const engine = makeEngine();
const sectionSrc = (type) => read(path.join(THEME, 'sections', `${type}.liquid`));
function splitSchema(src) {
  const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  const body = src.replace(/\{%-?\s*schema\s*-?%\}[\s\S]*?\{%-?\s*endschema\s*-?%\}/, '')
    .replace(/\{%-?\s*style\s*-?%\}/g, '<style>').replace(/\{%-?\s*endstyle\s*-?%\}/g, '</style>');
  return { schema: m ? JSON.parse(m[1]) : {}, body };
}
function resolveSetting(def, value) {
  const v = value === undefined ? def.default : value;
  switch (def.type) {
    case 'collection': return v ? collections[v] || null : null;
    case 'product': return v ? byHandle[v] || null : null;
    case 'link_list': return v ? linklists[v] || null : null;
    case 'image_picker': return typeof v === 'string' && v ? imageByFile(v.replace('shopify://shop_images/', '')) : v || null;
    case 'video': return v || null;
    case 'url': return typeof v === 'string' ? v.replace(/^shopify:\/\/(collections|pages|products)\/(.+)$/, '/$1/$2') : v;
    case 'page': return v || null;
    case 'range': return Number(v);
    case 'checkbox': return v === undefined ? false : v;
    default: return v === undefined ? '' : v;
  }
}
function dims(file) {
  try {
    const b = fs.readFileSync(path.join(FIX, 'img', file));
    if (b[0] === 0x89) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; i += 2 + b.readUInt16BE(i + 2); }
  } catch { /* fall through */ }
  return { w: 1086, h: 1448 };
}
const imageByFile = (f) => { const d = dims(f); return { src: `/img/${f}`, width: d.w, height: d.h, alt: '', aspect_ratio: d.w / d.h }; };
export async function renderSection(type, id, data = {}, ctxVars = {}, index = 0, overrides = {}) {
  const { schema, body } = splitSchema(sectionSrc(type));
  const settings_ = {};
  for (const def of schema.settings || []) if (def.id) settings_[def.id] = resolveSetting(def, (overrides[id] ?? {})[def.id] ?? (data.settings || {})[def.id]);
  const blockDefs = Object.fromEntries((schema.blocks || []).map((b) => [b.type, b]));
  const order = data.block_order || Object.keys(data.blocks || {});
  const blocks = order.map((bid) => {
    const b = data.blocks[bid]; const def = blockDefs[b.type] || { settings: [] }; const s = {};
    for (const sd of def.settings || []) if (sd.id) s[sd.id] = resolveSetting(sd, (overrides[`${id}.${bid}`] ?? {})[sd.id] ?? (b.settings || {})[sd.id]);
    return { id: bid, type: b.type, settings: s, shopify_attributes: '' };
  });
  engine.options.globals = { ...baseVars(), ...ctxVars };
  const section = { id, settings: settings_, blocks, index, type };
  const html = await engine.parseAndRender(body, { ...baseVars(), ...ctxVars, section });
  const tag = schema.tag || 'section';
  return `<${tag} id="shopify-section-${id}" class="shopify-section${data.__group ? ' shopify-section-group-' + data.__group : ''}">${html}</${tag}>`;
}
let current = { vars: {}, overrides: {} };
export function setContext(vars, overrides = {}) { current = { vars, overrides }; engine.options.globals = { ...baseVars(), ...vars }; }
async function renderGroup(name) {
  const g = readJSON(path.join(THEME, 'sections', `${name}.json`)); let out = ''; let i = 0;
  for (const id of g.order) out += await renderSection(g.sections[id].type, id, { ...g.sections[id], __group: `${g.type}-group` }, current.vars, i++, current.overrides);
  return out;
}
export async function renderTemplateJSON(file, ctxVars, overrides = {}) {
  const t = readJSON(file); let out = ''; let i = 0;
  for (const id of t.order) out += await renderSection(t.sections[id].type, id, t.sections[id], ctxVars, i++, overrides);
  return out;
}
export const baseVars = () => ({
  shop, settings, routes, linklists, collections, cart: cartView(), request: { locale: { iso_code: 'en' }, page_type: 'index' }, localization: {}, current_page: 1, current_tags: null,
  canonical_url: 'http://localhost/', page_title: 'Graceful Divine Melts', page_description: '', template: { name: 'index' }, content_for_header: '', additional_checkout_buttons: false, content_for_additional_checkout_buttons: '', customer: null,
});
export async function renderLayout(content, vars) {
  let src = read(path.join(THEME, 'layout/theme.liquid')).replace(/\{%-?\s*style\s*-?%\}/g, '<style>').replace(/\{%-?\s*endstyle\s*-?%\}/g, '</style>');
  setContext(vars);
  return engine.parseAndRender(src, { ...baseVars(), ...vars, content_for_layout: content });
}
export { engine, byHandle };
