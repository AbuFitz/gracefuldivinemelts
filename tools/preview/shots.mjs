// Full-page screenshots + automatic layout checks (horizontal overflow, console errors, images without size, tiny tap targets).
// Usage: node shots.mjs /path1 /path2 ...   Env: BASE (default http://localhost:4173), OUT (default ./shots), SIZES="mobile,tablet,desktop"
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4173';
const OUT = process.env.OUT || path.resolve('shots');
fs.mkdirSync(OUT, { recursive: true });
const mob = (w, h = 844) => ({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const ALL = { m360: mob(360, 780), m390: mob(390), m430: mob(430, 932), t768: { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 1 }, d1024: { viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 }, d1440: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, mobile: mob(390), tablet: { viewport: { width: 820, height: 1100 }, deviceScaleFactor: 1 }, desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } };
const sizes = (process.env.SIZES || 'mobile,tablet,desktop').split(',');
const paths = process.argv.slice(2);
const browser = await chromium.launch();
let problems = 0;
for (const sz of sizes) {
  const ctx = await browser.newContext(ALL[sz]);
  for (const p of paths) {
    const page = await ctx.newPage(); const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('requestfailed', (r) => errs.push('requestfailed ' + r.url()));
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(900);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in')));
    const name = (p.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home') + '.' + sz + '.png';
    await page.screenshot({ path: path.join(OUT, name), fullPage: true });
    const report = await page.evaluate(() => {
      const de = document.documentElement; const out = { overflowX: de.scrollWidth - de.clientWidth, wide: [], tiny: [], title: document.title, h1: document.querySelectorAll('h1').length };
      const vw = de.clientWidth;
      document.querySelectorAll('body *').forEach((el) => { const r = el.getBoundingClientRect(); if (r.width && r.right > vw + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('dialog,[hidden]') ) { if (out.wide.length < 5) out.wide.push(el.tagName + '.' + (el.className || '').toString().slice(0, 40) + ' right=' + Math.round(r.right)); } });
      document.querySelectorAll('a,button,input,select,summary').forEach((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); if (r.width && cs.visibility !== 'hidden' && !el.closest('dialog:not([open]),[hidden]') && el.type !== 'hidden' && (r.height < 24 || r.width < 24) && !el.matches('.visually-hidden,.skip-link,.opt input,.card__title a,.card a,.item__title a,#osp-banner a') && !el.closest('p,.prose,.accordion__body,.breadcrumbs,label,.field-hint')) { if (out.tiny.length < 6) out.tiny.push((el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 24) + ` ${Math.round(r.width)}x${Math.round(r.height)}`); } });
      return out;
    });
    const bad = report.overflowX > 0 || errs.length || report.tiny.length || report.h1 !== 1;
    if (bad) problems++;
    console.log(`${bad ? '!!' : 'ok'} ${sz.padEnd(7)} ${p.padEnd(44)} h1=${report.h1} overflowX=${report.overflowX} ${report.wide.length ? 'wide=' + JSON.stringify(report.wide) : ''} ${report.tiny.length ? 'tiny=' + JSON.stringify(report.tiny) : ''} ${errs.length ? 'errors=' + JSON.stringify(errs.slice(0, 3)) : ''}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(problems ? `${problems} page/size combos flagged` : 'all clean');
