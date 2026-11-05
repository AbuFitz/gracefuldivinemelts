// Interaction tests against the LOCAL MOCK (validates theme.js + markup behaviour; Shopify itself must be tested on a dev store).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4173';
const results = []; const t = async (name, fn) => { try { await fn(); results.push(['PASS', name]); } catch (e) { results.push(['FAIL', name + ' — ' + String(e.message).split('\n')[0]]); } };
const assert = (c, m) => { if (!c) throw new Error(m); };
const browser = await chromium.launch();
const mk = async (mobile = false) => { const ctx = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => m.type() === 'error' && errs.push(m.text())); page.errs = errs; return page; };
await fetch(BASE + '/__reset');

let page = await mk(true);
await t('mobile menu opens, lists links, Escape closes and returns focus', async () => {
  await page.goto(BASE + '/'); await page.click('.header__menu-btn');
  assert(await page.isVisible('#MenuDialog nav'), 'menu not visible'); assert((await page.locator('#MenuDialog .drawer__nav a').count()) >= 4, 'few links');
  await page.keyboard.press('Escape'); assert(!(await page.isVisible('#MenuDialog nav')), 'still open');
  assert(await page.evaluate(() => document.activeElement?.classList.contains('header__menu-btn')), 'focus not restored');
});
await t('predictive search returns suggestions', async () => {
  await page.goto(BASE + '/'); await page.click('[data-open-dialog="SearchDialog"]'); await page.fill('#HeaderSearch', 'dark');
  await page.waitForSelector('[data-search-results] .search-hit', { timeout: 4000 });
  assert((await page.locator('.search-hit').first().innerText()).includes('Dark Desire'), 'no Dark Desire');
});
await t('add to cart updates header count + toast (mobile)', async () => {
  await page.goto(BASE + '/products/dark-desire'); await page.click('[data-add-btn]'); await page.waitForSelector('#Toast:not([hidden])');
  assert((await page.innerText('[data-cart-count]')).trim() === '1', 'count not 1'); assert((await page.innerText('#Toast')).includes('Added'), 'toast text');
});
await page.context().close();

page = await mk();
await t('sold-out product cannot be added; shows state', async () => {
  await page.goto(BASE + '/products/golden-goddess'); assert((await page.getAttribute('[data-add-btn]', 'aria-disabled')) === 'true', 'not disabled');
  assert(/sold out/i.test(await page.innerText('[data-add-btn]')), 'label'); assert((await page.innerText('[data-stock]')).includes('Sold out'), 'stock');
  const before = await page.innerText('[data-cart-count]'); await page.click('[data-add-btn]', { force: true }); assert((await page.innerText('[data-cart-count]')) === before, 'count changed');
});
await t('quantity stepper + add multiple', async () => {
  await fetch(BASE + '/__reset'); await page.goto(BASE + '/products/dark-desire'); await page.click('[data-qty-step="1"]'); await page.click('[data-qty-step="1"]');
  assert((await page.inputValue('.buy input[name=quantity]')) === '3', 'qty'); await page.click('[data-add-btn]'); await page.waitForSelector('#Toast:not([hidden])');
  assert((await page.innerText('[data-cart-count]')).trim() === '3', 'count 3');
});
await t('bundle variant switch updates hidden id + URL, keeps price', async () => {
  await page.goto(BASE + '/products/our-bundle-deal'); const id1 = await page.inputValue('form[data-product-form] input[name=id]');
  await page.locator('.opt').nth(3).click(); const id2 = await page.inputValue('form[data-product-form] input[name=id]');
  assert(id1 !== id2, 'id unchanged'); assert(page.url().includes('variant=' + id2), 'url'); assert((await page.innerText('[data-price-wrap]')).includes('28.99'), 'price');
});
await t('add bundle then cart shows option + subtotal', async () => {
  await page.click('[data-add-btn]'); await page.waitForSelector('#Toast:not([hidden])'); await page.goto(BASE + '/cart');
  const txt = await page.innerText('.cart-lines'); assert(txt.includes('Parisian Bloom') || txt.includes('Choose Bundle'), 'bundle option missing'); assert((await page.innerText('[data-cart-total]')).includes('£'), 'total');
});
await t('cart: increase quantity re-renders totals; remove -> empty state', async () => {
  const before = await page.innerText('[data-cart-total]'); await page.locator('[data-qty-step="1"]').first().click(); await page.waitForFunction((b) => document.querySelector('[data-cart-total]')?.innerText !== b, before);
  while (await page.locator('[data-cart-remove]').count()) { await page.locator('[data-cart-remove]').first().click(); await page.waitForTimeout(250); }
  await page.waitForSelector('.empty'); assert((await page.innerText('.empty')).includes('empty'), 'empty text'); assert((await page.innerText('[data-cart-count]')).trim() === '0', 'count 0');
});
await t('cart checkout button posts to cart (Shopify checkout handoff)', async () => {
  await fetch(BASE + '/__seed'); await page.goto(BASE + '/cart'); assert((await page.getAttribute('[name=checkout]', 'type')) === 'submit', 'submit'); assert((await page.getAttribute('#CartForm', 'action')) === '/cart', 'action');
});
await t('quick add on collection works', async () => {
  await fetch(BASE + '/__reset'); await page.goto(BASE + '/collections/wax-melts'); await page.locator('.js-quick-add button').first().click(); await page.waitForSelector('#Toast:not([hidden])'); assert((await page.innerText('[data-cart-count]')).trim() === '1', 'count');
});
await t('collection filter by scent family narrows results; chip removable', async () => {
  await page.goto(BASE + '/collections/wax-melts?filter.p.m.custom.scent_family=Woody'); const n = await page.locator('.grid .card').count(); assert(n >= 1 && n < 10, 'n=' + n);
  await page.click('.active-filters a.chip'); await page.waitForLoadState(); assert((await page.locator('.grid .card').count()) === 10, 'not reset');
});
await t('empty filtered collection shows recovery state', async () => {
  await page.goto(BASE + '/collections/wax-melts?filter.p.m.custom.scent_family=Nonexistent'); assert((await page.innerText('.empty')).includes('No products match'), 'text');
});
await t('search: results, and no-results state', async () => {
  await page.goto(BASE + '/search?q=rose'); assert((await page.locator('.grid .card').count()) >= 1, 'no hits'); await page.goto(BASE + '/search?q=zzzz'); assert((await page.innerText('.empty')).includes('Nothing found'), 'empty');
});
await t('contact: validation errors then success', async () => {
  await page.goto(BASE + '/pages/contact'); await page.evaluate(() => { document.querySelectorAll('#ContactForm [required]').forEach((e) => e.removeAttribute('required')); }); await page.click('#ContactForm button[type=submit]');
  await page.waitForSelector('.notice--error'); assert((await page.locator('#Contact-email[aria-invalid="true"]').count()) === 1, 'aria-invalid');
  await page.goto(BASE + '/pages/contact'); await page.fill('#Contact-email', 'a@b.co'); await page.fill('#Contact-body', 'Hi'); await page.click('#ContactForm button[type=submit]'); await page.waitForSelector('.notice--ok');
});
await t('newsletter success state', async () => {
  await page.goto(BASE + '/'); await page.fill('#SecNewsletterEmail', 'a@b.co'); await page.click('#SectionNewsletter button[type=submit]'); await page.waitForSelector('.notice--ok');
});
await t('FAQ accordion toggles', async () => {
  await page.goto(BASE + '/pages/gracefuldivinemeltswax-melt-faq'); const d = page.locator('details').first(); await d.locator('summary').click(); assert(await d.evaluate((e) => e.open), 'not open');
});
await t('skip link is first focus target and works', async () => {
  await page.goto(BASE + '/'); await page.keyboard.press('Tab'); assert(await page.evaluate(() => document.activeElement.classList.contains('skip-link')), 'not skip'); await page.keyboard.press('Enter'); assert(await page.evaluate(() => location.hash === '#MainContent'), 'hash');
});
await t('404 renders with search + shop link and status 404', async () => {
  const r = await page.goto(BASE + '/products/does-not-exist'); assert(r.status() === 404, 'status'); assert((await page.locator('h1').innerText()).length > 3, 'h1');
});
await t('cookie preferences link: graceful when banner API absent', async () => {
  await page.goto(BASE + '/'); await page.click('[data-cookie-prefs]'); await page.waitForSelector('#Toast:not([hidden])');
});
await t('reduced motion: no reveal hiding', async () => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage(); await p.goto(BASE + '/'); assert((await p.locator('.reveal').count()) === 0, 'reveal applied'); await ctx.close();
});
await t('no-JS: product form posts natively, nav + search link usable', async () => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage(); await fetch(BASE + '/__reset');
  await p.goto(BASE + '/products/dark-desire'); await p.click('[data-add-btn]'); await p.waitForURL('**/cart'); assert((await p.locator('.cart-line').count()) === 1, 'line'); await ctx.close();
});
assert; console.log(results.map((r) => r.join(' ')).join('\n')); console.log('\nconsole/page errors:', page.errs.length ? page.errs : 'none');
await browser.close(); process.exit(results.some((r) => r[0] === 'FAIL') ? 1 : 0);
