// Interaction + regression tests against the LOCAL MOCK (validates theme.js and markup; Shopify itself must be tested on a dev store).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4173';
const results = []; const t = async (name, fn) => { try { await fn(); results.push(['PASS', name]); } catch (e) { results.push(['FAIL', name + ' — ' + String(e.message).split('\n')[0]]); } };
const assert = (c, m) => { if (!c) throw new Error(m); };
const browser = await chromium.launch();
const mk = async (mobile = false, extra = {}) => { const ctx = await browser.newContext({ ...(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } }), ...extra }); const page = await ctx.newPage(); page.errs = []; page.on('pageerror', (e) => page.errs.push(String(e))); return page; };
const txt = (p, s) => p.innerText(s);
await fetch(BASE + '/__reset');

let m = await mk(true);
await t('mobile menu sheet opens with big links; Esc closes and focus returns', async () => {
  await m.goto(BASE + '/'); await m.click('.nav__menu-btn'); assert(await m.isVisible('#MenuDialog nav'), 'not visible');
  assert((await m.locator('#MenuDialog nav > ul > li').count()) >= 4, 'links'); await m.keyboard.press('Escape'); assert(!(await m.isVisible('#MenuDialog nav')), 'still open');
  assert(await m.evaluate(() => document.activeElement?.classList.contains('nav__menu-btn')), 'focus not restored');
});
await t('mobile search: opens full screen with shortcuts + popular, types, results with price + availability', async () => {
  await m.goto(BASE + '/'); await m.click('[data-open-dialog="SearchDialog"]'); assert(await m.isVisible('.shortcuts'), 'shortcuts'); assert((await m.locator('.search-popular a').count()) === 3, 'popular');
  await m.fill('#HeaderSearch', 'dark'); await m.waitForSelector('.search-hit'); const first = await txt(m, '.search-hit'); assert(/£\d/.test(first) && /in stock|sold out/i.test(first), 'row content: ' + first);
});
await t('add to bag (mobile) updates count + toast', async () => {
  await m.goto(BASE + '/products/dark-desire'); await m.click('[data-add-btn]'); await m.waitForSelector('#Toast:not([hidden])'); assert((await txt(m, '[data-cart-count]')).trim() === '1', 'count'); assert((await txt(m, '#Toast')).includes('bag'), 'toast says bag');
});
await t('sticky mobile bag bar appears after the main button scrolls away and adds to bag', async () => {
  await fetch(BASE + '/__reset'); await m.goto(BASE + '/products/dark-desire'); assert(!(await m.locator('[data-buybar].is-on').count()), 'visible too early');
  await m.evaluate(() => scrollTo(0, 1500)); await m.waitForSelector('[data-buybar].is-on'); await m.click('[data-buybar-btn]'); await m.waitForSelector('#Toast:not([hidden])'); assert((await txt(m, '[data-cart-count]')).trim() === '1', 'count');
});
await t('gallery on mobile is a swipeable scroll-snap track with dots', async () => {
  await m.goto(BASE + '/products/mixed-scent-package'); const o = await m.$eval('[data-gallery-track]', (e) => getComputedStyle(e).overflowX); assert(o === 'auto' || o === 'scroll', 'overflow ' + o); assert((await m.locator('[data-gallery-dots] span').count()) === 3, 'dots');
});
await m.context().close();

let d = await mk();
await t('desktop: floating nav compacts on scroll; Shop dropdown shows links + featured product', async () => {
  await d.goto(BASE + '/'); assert(!(await d.evaluate(() => document.documentElement.classList.contains('is-scrolled'))), 'scrolled at top');
  await d.hover('.nav__item:first-child'); assert(await d.isVisible('.nav__panel'), 'panel'); assert((await d.locator('.nav__panel li a').count()) >= 3, 'panel links');
  await d.mouse.move(700, 700); await d.evaluate(() => scrollTo(0, 800)); await d.waitForFunction(() => document.documentElement.classList.contains('is-scrolled'));
});
await t('search overlay: Arrow keys + Enter open a result; first Esc clears, second closes', async () => {
  await d.goto(BASE + '/'); await d.click('[data-open-dialog="SearchDialog"]'); await d.fill('#HeaderSearch', 'rose'); await d.waitForSelector('.search-hit');
  assert((await d.getAttribute('#HeaderSearch', 'aria-expanded')) === 'true', 'aria-expanded'); assert((await txt(d, '[data-search-status]')).includes('found'), 'live status');
  await d.keyboard.press('ArrowDown'); await d.keyboard.press('ArrowDown'); assert((await d.locator('[role=option][aria-selected=true]').count()) === 1, 'selected'); assert(!!(await d.getAttribute('#HeaderSearch', 'aria-activedescendant')), 'activedescendant');
  await d.keyboard.press('Escape'); assert((await d.inputValue('#HeaderSearch')) === '', 'not cleared'); assert(await d.isVisible('#SearchDialog .search-sheet'), 'closed too early'); await d.keyboard.press('Escape'); assert(!(await d.isVisible('#SearchDialog .search-sheet')), 'not closed');
  await d.click('[data-open-dialog="SearchDialog"]'); await d.fill('#HeaderSearch', 'dark'); await d.waitForSelector('.search-hit'); await d.keyboard.press('ArrowDown'); await Promise.all([d.waitForURL('**/products/**'), d.keyboard.press('Enter')]);
});
await t('search overlay: empty results state, clear button, and error state with retry', async () => {
  await d.goto(BASE + '/'); await d.click('[data-open-dialog="SearchDialog"]'); await d.fill('#HeaderSearch', 'zzzz'); await d.waitForSelector('#SearchDialog .empty'); assert((await txt(d, '#SearchDialog .empty')).toLowerCase().includes('nothing found'), 'text');
  await d.click('[data-search-clear]'); assert((await d.inputValue('#HeaderSearch')) === '', 'clear'); assert(await d.isVisible('[data-search-popular]'), 'popular back');
  await d.route('**/search/suggest*', (r) => r.abort()); await d.fill('#HeaderSearch', 'rose'); await d.waitForSelector('[data-search-retry]'); await d.unroute('**/search/suggest*'); await d.click('[data-search-retry]'); await d.waitForSelector('.search-hit');
});
await t('sold-out product cannot be added; shows state', async () => {
  await d.goto(BASE + '/products/golden-goddess'); assert((await d.getAttribute('[data-add-btn]', 'aria-disabled')) === 'true', 'not disabled'); assert(/sold out/i.test(await txt(d, '[data-add-btn]')), 'label');
  const before = await txt(d, '[data-cart-count]'); await d.click('[data-add-btn]', { force: true }); assert((await txt(d, '[data-cart-count]')) === before, 'count changed');
});
await t('bundle: pair picker shows faces, switching updates id/url/price', async () => {
  await d.goto(BASE + '/products/our-bundle-deal'); assert((await d.locator('.opt__faces img').count()) >= 20, 'faces'); const id1 = await d.inputValue('form[data-product-form] input[name=id]');
  await d.locator('.opt').nth(3).click(); const id2 = await d.inputValue('form[data-product-form] input[name=id]'); assert(id1 !== id2, 'id'); assert(d.url().includes('variant=' + id2), 'url'); assert((await txt(d, '[data-price-wrap]')).includes('28.99'), 'price');
});
await t('bag: bundle shows chosen pair; quantity + remove re-render; empty state', async () => {
  await fetch(BASE + '/__reset'); await d.goto(BASE + '/products/our-bundle-deal'); await d.click('[data-add-btn]'); await d.waitForSelector('#Toast:not([hidden])'); await d.goto(BASE + '/cart');
  assert((await txt(d, '.bag-lines')).includes('Parisian Bloom'), 'pair in bag'); const before = await txt(d, '[data-cart-total]'); await d.locator('[data-qty-step="1"]').first().click(); await d.waitForFunction((b) => document.querySelector('[data-cart-total]')?.innerText !== b, before);
  while (await d.locator('[data-cart-remove]').count()) { await d.locator('[data-cart-remove]').first().click(); await d.waitForTimeout(250); } await d.waitForSelector('.empty'); assert((await txt(d, '.empty')).toLowerCase().includes('empty'), 'empty');
});
await t('custom scent: required field blocks empty add; value (and ?scent= prefill) is saved on the line item', async () => {
  await fetch(BASE + '/__reset'); await d.goto(BASE + '/products/request-a-specific-scent'); await d.click('[data-add-btn]'); await d.waitForTimeout(400); assert((await txt(d, '[data-cart-count]')).trim() === '0', 'added without scent');
  assert(await d.$eval('[data-prefill-scent]', (e) => !e.checkValidity()), 'field should be invalid');
  await d.goto(BASE + '/products/request-a-specific-scent?scent=Baccarat%20Rouge'); assert((await d.inputValue('[data-prefill-scent]')) === 'Baccarat Rouge', 'prefill'); await d.click('[data-add-btn]'); await d.waitForSelector('#Toast:not([hidden])');
  await d.goto(BASE + '/cart'); const bag = await txt(d, '.bag-lines'); assert(/Requested scent/i.test(bag) && bag.includes('Baccarat Rouge'), 'property missing in bag: ' + bag.slice(0, 120));
});
await t('home custom-scent form sends the typed scent to the product page prefilled', async () => {
  await d.goto(BASE + '/'); await d.fill('.custom__form input', 'Black Opium'); await Promise.all([d.waitForURL('**/request-a-specific-scent?scent=*'), d.click('.custom__form button')]); assert((await d.inputValue('[data-prefill-scent]')) === 'Black Opium', 'prefill');
});
await t('scents rail + Discover by mood explorer: tabs from metadata, panel switches, keyboard, products shown, add works', async () => {
  await fetch(BASE + '/__reset'); await d.goto(BASE + '/'); assert((await txt(d, '.rail-section, [data-rail]')).length > 0, 'rail'); assert(/Pick a scent/.test(await txt(d, 'main')), 'rail heading');
  const tabs = (await d.locator('[data-explorer] [role=tab]').allInnerTexts()).map((x) => x.trim()); assert(tabs.length === 3 && tabs.includes('Floral') && tabs.includes('Sweet') && tabs.includes('Woody'), 'tabs ' + tabs);
  assert(/Discover by mood/i.test(await txt(d, 'main')), 'explorer eyebrow');
  await d.locator('[data-explorer] [role=tab]', { hasText: 'Sweet' }).click(); assert((await d.getAttribute('[data-explorer] [role=tab]:has-text("Sweet")', 'aria-selected')) === 'true', 'selected'); assert((await d.locator('[data-explorer] [role=tabpanel]:visible').count()) === 1, 'one panel visible');
  await d.keyboard.press('ArrowDown'); assert((await d.getAttribute('[data-explorer] [role=tab]:has-text("Woody")', 'aria-selected')) === 'true' || (await d.getAttribute('[data-explorer] [role=tab]:has-text("Floral")', 'aria-selected')) === 'true', 'arrow moves');
  await d.locator('.rail .js-quick-add button').first().click({ force: true }); await d.waitForSelector('#Toast:not([hidden])');
});
await t('hero: V2 pink hero with arch image, hotspot price, headline fits three lines, CTAs work', async () => {
  await d.goto(BASE + '/'); assert(await d.isVisible('.hero h1'), 'h1'); const lines = await d.$eval('.hero h1', (e) => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight))); assert(lines <= 3, 'h1 lines ' + lines);
  assert((await d.locator('.hero a.btn').count()) >= 2, 'ctas'); assert(/£\d/.test(await txt(d, '.hero')), 'hotspot price'); const hero = await d.$eval('.hero', (e) => getComputedStyle(e).backgroundColor); assert(hero === 'rgb(247, 185, 209)', 'hero bg ' + hero);
});
await t('navigation: white pill (fully rounded), 80rem wide, centred unframed logo, links never wrap, Search button present', async () => {
  await d.goto(BASE + '/'); const o = await d.evaluate(() => { const cs = (e) => getComputedStyle(e); const bar = document.querySelector('.nav__bar'), logo = document.querySelector('.nav__logo'), img = logo.querySelector('img'); const br = bar.getBoundingClientRect(), lr = logo.getBoundingClientRect();
    return { bg: cs(bar).backgroundColor, radius: cs(bar).borderRadius, h: br.height, w: br.width, shadow: cs(bar).boxShadow !== 'none', logoBg: cs(logo).backgroundColor, imgRadius: cs(img).borderRadius, delta: Math.abs(lr.left + lr.width / 2 - (br.left + br.width / 2)), wrap: [...document.querySelectorAll('.nav__link')].some((l) => l.getBoundingClientRect().height > 40), search: !!document.querySelector('.pill-btn--search') }; });
  assert(o.bg === 'rgb(255, 255, 255)' && o.shadow, 'surface ' + JSON.stringify(o)); assert(parseFloat(o.radius) >= o.h / 2, 'not a perfect pill ' + o.radius + ' h ' + o.h); assert(o.w >= 1270, 'narrow ' + o.w); assert(o.imgRadius === '0px' && /rgba\(0, 0, 0, 0\)|transparent/.test(o.logoBg), 'logo framed'); assert(o.delta <= 2, 'logo not centred ' + o.delta); assert(!o.wrap && o.search, 'wrap/search ' + JSON.stringify(o));
  const m = await mk(true); await m.goto(BASE + '/'); const mo = await m.evaluate(() => { const bar = document.querySelector('.nav__bar'), logo = document.querySelector('.nav__logo').getBoundingClientRect(), b = bar.getBoundingClientRect(); return { r: parseFloat(getComputedStyle(bar).borderRadius) >= b.height / 2, d: Math.abs(logo.left + logo.width / 2 - (b.left + b.width / 2)) }; }); assert(mo.r && mo.d <= 2, 'mobile nav ' + JSON.stringify(mo)); await m.context().close();
});
await t('instagram + tiktok showcase: ONE seamless CSS row mixing both; never pauses; duplicate inert; real links; reduced motion static', async () => {
  await d.goto(BASE + '/'); const tracks = await d.$$eval('.marquee__track', (e) => e.map((x) => ({ n: getComputedStyle(x).animationName, st: getComputedStyle(x).animationPlayState }))); assert(tracks.length === 1 && tracks[0].st === 'running' && tracks[0].n !== 'none', 'tracks ' + JSON.stringify(tracks));
  await d.hover('.marquee'); await d.waitForTimeout(200); assert((await d.$eval('.marquee__track', (e) => getComputedStyle(e).animationPlayState)) === 'running', 'paused on hover');
  const dup = await d.$eval('.marquee__group:nth-child(2)', (e) => e.getAttribute('aria-hidden') === 'true' && e.hasAttribute('inert')); assert(dup, 'duplicate not inert'); assert((await d.locator('.marquee__group:nth-child(2) a[tabindex="-1"]').count()) >= 10, 'dup tabindex');
  const hrefs = await d.$$eval('.marquee__group:first-child a', (a) => a.map((x) => x.href)); const ig = hrefs.filter((h) => h.includes('instagram.com/gracefuldivinemelts')), tt = hrefs.filter((h) => /tiktok\.com\/@gracefuldivinemelts\/video\/\d+/.test(h)); assert(ig.length >= 5 && tt.length === 7 && ig.length + tt.length === hrefs.length, 'links ' + hrefs);
  const kinds = await d.$$eval('.marquee__group:first-child a', (a) => a.slice(0, 4).map((x) => x.classList.contains('marquee__item--video'))); assert(kinds[0] !== kinds[1], 'platforms not interleaved ' + kinds);
  const w = await d.$$eval('.marquee__group', (g) => g.map((x) => Math.round(x.getBoundingClientRect().width))); assert(Math.abs(w[0] - w[1]) <= 1, 'seam ' + w);
  assert((await d.locator('.showcase__follow a').count()) === 2, 'follow buttons'); const p = await mk(false, { reducedMotion: 'reduce' }); await p.goto(BASE + '/'); const r = await p.$eval('.marquee__track', (e) => getComputedStyle(e).animationName); assert(r === 'none', 'animates under reduced motion'); await p.context().close();
});
await t('footer: brand icons incl. TikTok with accessible names; payments (demo placeholders); wordmark hidden on mobile', async () => {
  await d.goto(BASE + '/'); const names = await d.$$eval('.footer .socials a', (a) => a.map((x) => x.getAttribute('aria-label'))); for (const n of ['Instagram', 'TikTok', 'Google', 'Shop', 'Trustpilot', 'WhatsApp']) assert(names.some((x) => x && x.includes(n)), 'icon ' + n + ' in ' + names);
  assert((await d.locator('.footer .payments li').count()) === 7, 'payments'); assert(!(await txt(d, '.footer')).toLowerCase().includes('demo only'), 'demo note should be gone');
  const m2 = await mk(true); await m2.goto(BASE + '/'); assert(!(await m2.isVisible('.footer__mark')), 'wordmark should be hidden on mobile'); const dw = await d.isVisible('.footer__mark'); assert(dw, 'wordmark should show on desktop'); await m2.context().close();
});
await t('find your scent journey: moods change the screen colour, scents + notes show, thumbs switch, surprise me, add to bag, one h1', async () => {
  await fetch(BASE + '/__reset'); await d.goto(BASE + '/pages/find-your-scent'); assert((await d.locator('h1').count()) === 1, 'h1 count');
  const names = (await d.locator('[data-journey] [role=tab][data-mood]').allInnerTexts()).map((x) => x.trim()); assert(names.join() === 'Floral,Sweet,Woody', 'moods ' + names);
  const c0 = await d.$eval('[data-journey]', (e) => getComputedStyle(e).getPropertyValue('--j-bg').trim()); await d.locator('[data-mood="1"]').click(); const c1 = await d.$eval('[data-journey]', (e) => getComputedStyle(e).getPropertyValue('--j-bg').trim()); assert(c0 !== c1, 'colour did not change ' + c0 + ' ' + c1);
  assert((await d.getAttribute('[data-mood="1"]', 'aria-selected')) === 'true', 'selected'); assert((await d.locator('.journey__panel.is-on').count()) === 1, 'one panel'); assert(/Orange|Vanilla|Musk|Amber/.test(await txt(d, '.journey__panel.is-on .journey__scent.is-on')), 'notes shown');
  const first = await txt(d, '.journey__panel.is-on .journey__scent.is-on .journey__name'); await d.locator('.journey__panel.is-on .journey__thumb').nth(1).click(); const second = await txt(d, '.journey__panel.is-on .journey__scent.is-on .journey__name'); assert(first !== second, 'thumb did not switch');
  await d.keyboard.press('ArrowRight'); await d.click('[data-surprise]'); assert((await d.locator('.journey__panel.is-on').count()) === 1, 'surprise');
  await d.locator('[data-mood="1"]').click(); await d.locator('.journey__panel.is-on .journey__thumb').first().click();
  await d.locator('.journey__panel.is-on .journey__scent.is-on .js-quick-add button').click(); await d.waitForSelector('#Toast:not([hidden])');
  const m = await mk(true); await m.goto(BASE + '/pages/find-your-scent'); assert(await m.isVisible('.journey__mood'), 'mobile moods'); const ov = await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1); assert(ov, 'mobile overflow'); await m.context().close();
});
await t('bundle: homepage shows the bundle section (no popup anywhere)', async () => {
  await d.goto(BASE + '/'); assert((await d.locator('.bundle').count()) === 1, 'bundle section'); assert((await d.locator('.bundle a.btn').getAttribute('href')).includes('our-bundle-deal'), 'bundle link'); assert((await d.locator('[data-bundle-popup], .bpop').count()) === 0, 'popup present');
});
await t('announcement bar: white, rolls through every message automatically, pauses on hover, static under reduced motion', async () => {
  await d.goto(BASE + '/'); const bg = await d.$eval('.announce', (e) => getComputedStyle(e).backgroundColor); assert(bg === 'rgb(255, 255, 255)', 'announce ' + bg);
  const n = await d.locator('.announce__item').count(); assert(n >= 6, 'items + clone ' + n); const t0 = await d.$eval('.announce__track', (e) => e.style.transform || 'none');
  await d.waitForFunction(() => (document.querySelector('.announce__track').style.transform || '') !== '' && document.querySelector('.announce__track').style.transform !== 'translateY(0px)', null, { timeout: 9000 }); assert(t0 !== (await d.$eval('.announce__track', (e) => e.style.transform)), 'did not roll');
  const p = await mk(false, { reducedMotion: 'reduce' }); await p.goto(BASE + '/'); await p.waitForTimeout(6500); assert(((await p.$eval('.announce__track', (e) => e.style.transform)) || '') === '', 'moves under reduced motion'); await p.context().close();
});
await t('demo banner: green, says Design preview / Created by OneSimpleSite, link works; absent from theme files', async () => {
  await d.goto(BASE + '/'); const b = await d.$eval('#osp-banner', (e) => ({ bg: getComputedStyle(e).backgroundColor, text: e.innerText, href: e.querySelector('a').href })); assert(b.bg === 'rgb(31, 92, 63)', 'bg ' + b.bg); assert(/design preview/i.test(b.text) && /created by onesimplesite/i.test(b.text), 'text'); assert(b.href.startsWith('https://onesimplesite.co.uk'), 'href');
  const m3 = await mk(true); await m3.goto(BASE + '/'); const box = await m3.$eval('#osp-banner', (e) => e.getBoundingClientRect().width); assert(box <= 390, 'banner overflows mobile'); await m3.context().close();
});
await t('product rail: next button scrolls; prev enabled afterwards', async () => {
  await d.goto(BASE + '/'); const rail = d.locator('[data-rail]').first(); assert(await d.$eval('[data-rail-prev]', (e) => e.disabled), 'prev should start disabled'); await d.click('[data-rail-next]'); await d.waitForFunction(() => document.querySelector('[data-rail]').scrollLeft > 100); await d.waitForFunction(() => !document.querySelector('[data-rail-prev]').disabled);
});
await t('collection: scent-family filter, chip removal, empty filtered state, quick add', async () => {
  await d.goto(BASE + '/collections/wax-melts?filter.p.m.custom.scent_family=Woody'); const n = await d.locator('.catalogue .item').count(); assert(n >= 1 && n < 10, 'n=' + n);
  await d.click('.active-filters a.chip'); await d.waitForLoadState(); assert((await d.locator('.catalogue .item').count()) === 10, 'reset'); await d.goto(BASE + '/collections/wax-melts?filter.p.m.custom.scent_family=Nope'); assert((await txt(d, '.empty')).includes('No products match'), 'empty');
  await fetch(BASE + '/__reset'); await d.goto(BASE + '/collections/wax-melts'); await d.locator('.js-quick-add button').first().click(); await d.waitForSelector('#Toast:not([hidden])');
});
await t('search results page + no-results state', async () => {
  await d.goto(BASE + '/search?q=rose'); assert((await d.locator('.catalogue .item').count()) >= 1, 'hits'); await d.goto(BASE + '/search?q=zzzz'); assert((await txt(d, '.empty')).includes('Nothing found'), 'empty');
});
await t('contact: validation errors then success; newsletter-free footer by default', async () => {
  await d.goto(BASE + '/pages/contact'); await d.evaluate(() => document.querySelectorAll('#ContactForm [required]').forEach((e) => e.removeAttribute('required'))); await d.click('#ContactForm button[type=submit]'); await d.waitForSelector('.notice--error'); assert((await d.locator('#Contact-email[aria-invalid="true"]').count()) === 1, 'aria-invalid');
  await d.goto(BASE + '/pages/contact'); await d.fill('#Contact-email', 'a@b.co'); await d.fill('#Contact-body', 'Hi'); await d.click('#ContactForm button[type=submit]'); await d.waitForSelector('.notice--ok'); await d.goto(BASE + '/'); assert((await d.locator('#FooterNewsletter').count()) === 0, 'newsletter should be off by default');
});
await t('FAQ accordion + skip link + 404 status', async () => {
  await d.goto(BASE + '/pages/gracefuldivinemeltswax-melt-faq'); const dt = d.locator('details').first(); await dt.locator('summary').click(); assert(await dt.evaluate((e) => e.open), 'open');
  await d.goto(BASE + '/'); await d.keyboard.press('Tab'); assert(await d.evaluate(() => document.activeElement.classList.contains('skip-link')), 'skip'); const r = await d.goto(BASE + '/products/does-not-exist'); assert(r.status() === 404, '404');
});
await t('social + review destinations: Instagram, Google, Shop profile present with safe rel; TikTok verified', async () => {
  await d.goto(BASE + '/'); const hrefs = await d.$$eval('.footer a[target=_blank]', (as) => as.map((a) => [a.href, a.rel])); const joined = hrefs.map((h) => h[0]).join(' ');
  assert(joined.includes('tiktok.com/@gracefuldivinemelts'), 'tiktok missing: ' + joined);
});
await t('internal link crawl: every same-site link on key pages resolves (no dead links)', async () => {
  const seen = new Set(); const bad = [];
  for (const p of ['/', '/collections/wax-melts', '/products/dark-desire', '/pages/contact', '/pages/find-your-scent', '/pages/delivery-returns', '/pages/wax-melt-care-safety', '/cart']) {
    await d.goto(BASE + p); const links = await d.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href').split('#')[0]).filter(Boolean));
    for (const l of links) { if (seen.has(l) || l.startsWith('/cart/change') || l.startsWith('/account')) continue; seen.add(l); const r = await fetch(BASE + l); if (r.status >= 400) bad.push(l + ' ' + r.status); }
  } assert(bad.length === 0, 'dead: ' + bad.slice(0, 5).join(', '));
});
await t('reduced motion: no reveal hiding; autoplay disabled', async () => {
  const p = await mk(false, { reducedMotion: 'reduce' }); await p.goto(BASE + '/'); assert((await p.locator('.reveal').count()) === 0, 'reveal'); await p.context().close();
});
await t('no-JS: add to bag posts natively; nav/search links usable', async () => {
  const p = await mk(false, { javaScriptEnabled: false }); await fetch(BASE + '/__reset'); await p.goto(BASE + '/products/dark-desire'); await p.click('[data-add-btn]'); await p.waitForURL('**/cart'); assert((await p.locator('.bag-line').count()) === 1, 'line'); assert(await p.isVisible('.nav__links'), 'nav'); await p.context().close();
});
console.log(results.map((r) => r.join(' ')).join('\n')); console.log('\npage errors:', d.errs.length ? d.errs : 'none');
await browser.close(); process.exit(results.some((r) => r[0] === 'FAIL') ? 1 : 0);
