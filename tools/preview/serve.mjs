// Local preview server (dev tooling only). Serves rendered pages + the theme assets + a tiny mock of the Shopify
// storefront AJAX endpoints that theme.js uses (/cart/add.js, /cart.js, /cart/change.js, /search/suggest, /recommendations/products).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { THEME, products, collections, cart, cartView, addToCart, state, missingKeys, renderLayout, renderTemplateJSON, renderSection, baseVars, byHandle, shop, policies, engine } from './shopify-mock.mjs';

const FIX = path.join(import.meta.dirname, 'fixtures');
const PORT = Number(process.env.PORT || 4173);
const mime = { '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.txt': 'text/plain' };
const exists = (p) => fs.existsSync(p);
const find = (prefix) => fs.readdirSync(path.join(FIX, 'img')).find((f) => f.startsWith(prefix));
const DEMO_IMG = { hero: find('B8B5F1DE'), story: find('1254') || find('9FDA295B'), hearts: find('B4CE0A0E'), bundle: find('9FDA295B') };
const overrides = { hero: { image: DEMO_IMG.hero }, story: { image: DEMO_IMG.bundle }, bundle: { image: DEMO_IMG.bundle }, mixed: { image: DEMO_IMG.hearts } };

const PAGES = { contact: 'page.contact', 'gracefuldivinemeltswax-melt-faq': 'page.faq', 'wax-melt-care-safety': 'page.care', 'delivery-returns': 'page.delivery', 'find-your-scent': 'page.find-scent', about: 'page.about', policies: 'page.policies', 'terms-test': 'page' };
const PAGE_TITLES = { contact: 'Contact', 'gracefuldivinemeltswax-melt-faq': 'Wax Melt Care & Use – FAQ', 'wax-melt-care-safety': 'Wax melt care & safety', 'delivery-returns': 'Delivery & returns', 'find-your-scent': 'Find your scent', about: 'About', policies: 'Policies & legal' };
const body = (req) => new Promise((r) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => r(b)); });
const parseForm = (b) => Object.fromEntries(new URLSearchParams(b));

function applyCollectionQuery(col, q) {
  const c = JSON.parse(JSON.stringify({ ...col, products: undefined }));
  let list = [...col.products];
  const fam = q.getAll('filter.p.m.custom.scent_family');
  if (fam.length) list = list.filter((p) => fam.includes(p.metafields.custom.scent_family?.value));
  const av = q.getAll('filter.v.availability');
  if (av.length === 1) list = list.filter((p) => (av[0] === '1' ? p.available : !p.available));
  const sort = q.get('sort_by') || 'manual';
  if (sort === 'price-ascending') list.sort((a, b) => a.price - b.price);
  if (sort === 'price-descending') list.sort((a, b) => b.price - a.price);
  if (sort === 'title-ascending') list.sort((a, b) => a.title.localeCompare(b.title));
  c.sort_by = sort;
  for (const f of c.filters) {
    f.active_values = [];
    for (const v of f.values || []) {
      v.active = q.getAll(v.param_name).includes(v.value);
      if (v.active) { const u = new URLSearchParams(q); const keep = u.getAll(v.param_name).filter((x) => x !== v.value); u.delete(v.param_name); keep.forEach((k) => u.append(v.param_name, k)); v.url_to_remove = `${col.url}?${u}`; f.active_values.push(v); }
    }
  }
  return { ...c, products: list, products_count: list.length };
}

async function page(name, vars = {}, { status = 200, ov = overrides } = {}) {
  const v = { request: { locale: { iso_code: 'en' }, page_type: vars.page_type || 'index' }, ...vars };
  const { setContext } = await import('./shopify-mock.mjs'); setContext(v, ov);
  const file = path.join(THEME, 'templates', name);
  const content = exists(file + '.json') ? await renderTemplateJSON(file + '.json', { ...baseVars(), ...v }, ov) : await engine.parseAndRender(fs.readFileSync(file + '.liquid', 'utf8'), { ...baseVars(), ...v });
  return { status, html: await renderLayout(content, v) };
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost'); const p = u.pathname; const q = u.searchParams;
  const send = (s, ct, b) => { res.writeHead(s, { 'content-type': ct }); res.end(b); };
  try {
    if (p.startsWith('/assets/')) { const f = path.join(THEME, 'assets', path.basename(p)); return exists(f) ? send(200, mime[path.extname(f)] || 'text/plain', fs.readFileSync(f)) : send(404, 'text/plain', 'nf'); }
    if (p.startsWith('/img/')) { const f = path.join(FIX, 'img', path.basename(p)); return exists(f) ? send(200, mime[path.extname(f)] || 'image/png', fs.readFileSync(f)) : send(404, 'text/plain', 'nf'); }
    if (p === '/__missing') return send(200, 'application/json', JSON.stringify([...missingKeys]));
    if (p === '/__reset') { cart.items.length = 0; state.forms = {}; return send(200, 'text/plain', 'ok'); }
    if (p === '/__seed') { addToCart(byHandle['dark-desire'].variants[0].id, 2); addToCart(byHandle['our-bundle-deal'].variants[0].id, 1); return send(200, 'text/plain', 'ok'); }

    /* AJAX mocks */
    if (p === '/cart.js') return send(200, 'application/json', JSON.stringify({ item_count: cartView().item_count, total_price: cartView().total_price }));
    if (p === '/cart/add.js' && req.method === 'POST') {
      const ct = req.headers['content-type'] || ''; const raw = await body(req); let id, qty = 1; const props = {};
      if (ct.includes('multipart')) { const m = [...raw.matchAll(/name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n--/g)]; for (const [, k, val] of m) { if (k === 'id') id = Number(val); if (k === 'quantity') qty = Number(val); const pm = k.match(/^properties\[(.+)\]$/); if (pm) props[pm[1]] = val; } }
      else { const f = parseForm(raw); id = Number(f.id); qty = Number(f.quantity || 1); }
      const r = addToCart(id, qty, props); if (r.status) return send(422, 'application/json', JSON.stringify(r));
      return send(200, 'application/json', JSON.stringify({ id, quantity: qty }));
    }
    if (p === '/cart/change.js' && req.method === 'POST') {
      const j = JSON.parse(await body(req)); const it = cart.items[j.line - 1]; if (!it) return send(422, 'application/json', '{"status":422}');
      if (j.quantity <= 0) cart.items.splice(j.line - 1, 1); else it.quantity = j.quantity; return send(200, 'application/json', JSON.stringify({ item_count: cartView().item_count }));
    }
    if (p === '/cart/add' && req.method === 'POST') { const f = parseForm(await body(req)); addToCart(Number(f.id), Number(f.quantity || 1)); res.writeHead(302, { location: '/cart' }); return res.end(); }
    if (p === '/cart/change') { const l = Number(q.get('line')); cart.items.splice(l - 1, 1); res.writeHead(302, { location: '/cart' }); return res.end(); }
    if (p === '/cart' && req.method === 'POST') { const f = parseForm(await body(req)); if ('checkout' in f) return send(200, 'text/html', '<h1>Shopify checkout (mock handoff)</h1>'); res.writeHead(302, { location: '/cart' }); return res.end(); }
    if (p === '/search/suggest') {
      const term = (q.get('q') || '').toLowerCase(); const hits = products.filter((x) => x.title.toLowerCase().includes(term) || x.description.toLowerCase().includes(term)).slice(0, 6);
      const html = await renderSection('predictive-search', 'predictive-search', {}, { ...baseVars(), predictive_search: { performed: true, terms: q.get('q'), resources: { products: hits, collections: [] } } });
      return send(200, 'text/html', html);
    }
    if (p === '/recommendations/products') {
      const sid = q.get('section_id'); const pr = products.find((x) => x.id === Number(q.get('product_id')));
      const recs = products.filter((x) => x.id !== pr.id && x.available && !['our-bundle-deal', 'request-a-specific-scent'].includes(x.handle)).slice(0, 4);
      const html = await renderSection('related-products', sid, { settings: { heading: 'You may also like', limit: 4 } }, { ...baseVars(), product: pr, recommendations: { performed: true, products: recs } });
      return send(200, 'text/html', html);
    }

    /* pages */
    let out;
    if (p === '/') out = await page('index', { page_type: 'index', template: { name: 'index' } });
    else if (p.startsWith('/products/')) {
      const pr = byHandle[p.split('/')[2]]; if (!pr) out = await page('404', { template: { name: '404' }, page_type: '404', page_title: '404' }, { status: 404 });
      else { const v = Number(q.get('variant')); if (v) { const vr = pr.variants.find((x) => x.id === v); if (vr) pr.selected_or_first_available_variant = vr; pr.options_with_values.forEach((o, i) => { if (vr) o.selected_value = vr.options[i]; }); }
        const col = q.get('collection') ? collections[q.get('collection')] : null;
        const tpl = pr.template_suffix && exists(path.join(THEME, 'templates', `product.${pr.template_suffix}.json`)) ? `product.${pr.template_suffix}` : 'product';
        out = await page(tpl, { product: pr, collection: col, template: { name: 'product', suffix: pr.template_suffix }, page_type: 'product', page_title: pr.title }); }
    }
    else if (p === '/collections' ) out = await page('list-collections', { collections: Object.values(collections).filter((c) => c.products.length), template: { name: 'list-collections' }, page_type: 'list-collections', page_title: 'Collections' });
    else if (p.startsWith('/collections/')) {
      const col = collections[p.split('/')[2]]; if (!col) out = await page('404', { template: { name: '404' }, page_type: '404', page_title: '404' }, { status: 404 });
      else out = await page('collection', { collection: applyCollectionQuery(col, q), template: { name: 'collection' }, page_type: 'collection', page_title: col.title });
    }
    else if (p === '/search') {
      const term = (q.get('q') || '').toLowerCase(); const results = term ? products.filter((x) => x.title.toLowerCase().includes(term) || x.description.toLowerCase().includes(term)) : [];
      out = await page('search', { search: { performed: !!term, terms: q.get('q') || '', results, results_count: results.length }, template: { name: 'search' }, page_type: 'search', page_title: 'Search' });
    }
    else if (p === '/cart') {
      if (q.get('section_id') === 'main-cart') { const html = await renderSection('main-cart', 'main-cart', {}, { ...baseVars() }); return send(200, 'text/html', html); }
      out = await page('cart', { template: { name: 'cart' }, page_type: 'cart', page_title: 'Your cart' });
    }
    else if (p.startsWith('/pages/')) {
      const h = p.split('/')[2]; const t = PAGES[h]; const title = PAGE_TITLES[h] || h;
      if (!t) out = await page('404', { template: { name: '404' }, page_type: '404', page_title: '404' }, { status: 404 });
      else out = await page(t, { page: { title, handle: h, content: '<p>(Demo) page body.</p>', url: p }, template: { name: 'page', suffix: t.split('.')[1] }, page_type: 'page', page_title: title });
    }
    else if (p.startsWith('/policies/')) {
      const pol = policies.find((x) => x.handle === p.split('/')[2]);
      if (!pol) out = await page('404', { template: { name: '404' }, page_type: '404', page_title: '404' }, { status: 404 });
      else { const content = `<div class="shopify-policy__container"><div class="shopify-policy__title"><h1>${pol.title}</h1></div><div class="shopify-policy__body"><div class="rte">${pol.body}<h2>Example heading</h2><p>Policy text rendered by Shopify uses this container. Lists:</p><ul><li>One</li><li>Two</li></ul></div></div></div>`;
        out = { status: 200, html: await renderLayout(content, { template: { name: 'policy' }, page_type: 'policy', page_title: pol.title }) }; }
    }
    else if (p === '/contact' && req.method === 'POST') {
      const f = parseForm(await body(req)); const type = f.form_type;
      if (type === 'contact') { const errs = {}; if (!f['contact[email]']) errs.email = 'cannot be blank'; if (!f['contact[body]']) errs.body = 'cannot be blank';
        state.forms.contact = Object.keys(errs).length ? { errors: Object.assign(Object.keys(errs).map((k) => k), { messages: errs, translated_fields: { email: 'email', body: 'message' } }), values: { email: f['contact[email]'], body: f['contact[body]'] } } : { ok: true };
        out = await page('page.contact', { page: { title: 'Contact', handle: 'contact', content: '', url: '/pages/contact' }, template: { name: 'page', suffix: 'contact' }, page_type: 'page', page_title: 'Contact' }); state.forms.contact = null; }
      else { state.forms.customer = { ok: true }; out = await page('index', { template: { name: 'index' }, page_type: 'index' }); state.forms.customer = null; }
    }
    else if (p === '/account/login') out = await page('customers/login', { template: { name: 'customers/login' }, page_type: 'customers/login', page_title: 'Sign in', form: {} });
    else if (p === '/account/register') out = await page('customers/register', { template: { name: 'customers/register' }, page_type: 'customers/register', page_title: 'Create account' });
    else if (p === '/account') out = await page('customers/account', { customer: { first_name: 'Sam', email: 'sam@example.com', name: 'Sam Example', orders: [], default_address: null }, template: { name: 'customers/account' }, page_type: 'customers/account', page_title: 'Account' });
    else if (p === '/blogs/news') out = await page('blog', { blog: { title: 'News', url: p, articles: [] }, template: { name: 'blog' }, page_type: 'blog', page_title: 'News' });
    else if (p === '/password') out = await page('password', { template: { name: 'password' }, page_type: 'password' });
    else out = await page('404', { template: { name: '404' }, page_type: '404', page_title: '404 Not Found' }, { status: 404 });
    send(out.status, 'text/html; charset=utf-8', out.html);
  } catch (e) { console.error(e); send(500, 'text/plain', String(e.stack || e)); }
});
server.listen(PORT, () => console.log(`preview on http://localhost:${PORT}`));
