/* Graceful Divine Melts — theme.js
   Progressive enhancement only: every form and link works without this file.
   No dependencies. Handles: dialogs, add-to-cart, variants, quantities, cart updates, predictive search, cookie link, reveals. */
(() => {
  'use strict';
  const T = window.theme || { routes: {}, strings: {} };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /* ---------- toast ---------- */
  const toastEl = () => $('#Toast');
  let toastTimer;
  function toast(html, { error = false, sticky = false } = {}) {
    const el = toastEl(); if (!el) return;
    el.className = 'toast' + (error ? ' toast--error' : '');
    el.innerHTML = html; el.hidden = false;
    clearTimeout(toastTimer);
    if (!sticky) toastTimer = setTimeout(() => { el.hidden = true; }, error ? 7000 : 6000);
  }

  /* ---------- dialogs (mobile menu, search) ---------- */
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open-dialog]');
    if (open) {
      const d = document.getElementById(open.dataset.openDialog);
      if (d && d.showModal) {
        d.showModal(); open.setAttribute('aria-expanded', 'true');
        const focus = d.querySelector('[data-autofocus]'); if (focus) focus.focus();
      }
      return;
    }
    const close = e.target.closest('[data-close-dialog]');
    if (close) { const d = close.closest('dialog'); if (d) d.close(); return; }
    const dlg = e.target.matches && e.target.matches('dialog.drawer') ? e.target : null;
    if (dlg) dlg.close(); // click on backdrop
  });
  $$('dialog.drawer').forEach((d) => d.addEventListener('close', () => {
    $$(`[data-open-dialog="${d.id}"]`).forEach((b) => { b.setAttribute('aria-expanded', 'false'); b.focus(); });
  }));

  /* ---------- cart helpers ---------- */
  function setCartCount(n) {
    $$('[data-cart-count]').forEach((el) => { el.textContent = n; el.dataset.count = n; });
  }
  async function refreshCartCount() {
    try { const r = await fetch(T.routes.cartJson, { headers: { Accept: 'application/json' } }); const c = await r.json(); setCartCount(c.item_count); } catch (_) { /* header count is non-critical */ }
  }

  /* ---------- add to cart (product form + quick add) ---------- */
  async function addToCart(form) {
    const btn = form.querySelector('[type="submit"]');
    const err = form.querySelector('[data-form-error]');
    if (err) { err.hidden = true; err.textContent = ''; }
    if (btn) { btn.classList.add('is-loading'); btn.setAttribute('aria-disabled', 'true'); }
    try {
      const res = await fetch(T.routes.cartAdd + '.js', { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      const data = await res.json();
      if (!res.ok || data.status) {
        const msg = data.description || data.message || T.strings.error;
        if (err) { err.textContent = msg; err.hidden = false; } else { toast(msg, { error: true }); }
        return;
      }
      await refreshCartCount();
      toast(`<span>${T.strings.added}</span> <a href="${T.routes.cart}">${T.strings.viewCart}</a>`);
    } catch (_) {
      const msg = T.strings.network;
      if (err) { err.textContent = msg; err.hidden = false; } else { toast(msg, { error: true }); }
    } finally {
      if (btn) { btn.classList.remove('is-loading'); btn.removeAttribute('aria-disabled'); }
    }
  }
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-product-form], form.js-quick-add');
    if (!f) return;
    if (!f.querySelector('[name="id"]').value) return;
    e.preventDefault();
    const btn = f.querySelector('[type="submit"]');
    if (btn && btn.getAttribute('aria-disabled') === 'true') return;
    addToCart(f);
  });

  /* ---------- quantity steppers ---------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qty-step]'); if (!b) return;
    const input = b.closest('.qty').querySelector('input');
    const next = Math.max(parseInt(input.min || '0', 10), (parseInt(input.value, 10) || 0) + parseInt(b.dataset.qtyStep, 10));
    input.value = next;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---------- variant picker ---------- */
  $$('[data-product-form]').forEach((form) => {
    const root = form.closest('[data-product]'); if (!root) return;
    const json = root.querySelector('script[data-variants]'); if (!json) return;
    const variants = JSON.parse(json.textContent);
    const idInput = form.querySelector('[name="id"]');
    const addBtn = form.querySelector('[data-add-btn]');
    const priceEl = root.querySelector('[data-price-wrap]');
    const stockEl = root.querySelector('[data-stock]');
    const label = (n) => $$(`[data-option-label="${n}"]`, root);

    const selected = () => $$('[data-option-index]', root).filter((i) => i.checked || i.tagName === 'SELECT').map((i) => i.value);
    function update() {
      const opts = selected();
      const v = variants.find((x) => x.options.every((o, i) => o === opts[i]));
      $$('.option', root).forEach((fs, i) => { const l = fs.querySelector('[data-selected-value]'); if (l) l.textContent = opts[i] || ''; });
      if (!v) {
        idInput.value = ''; addBtn.setAttribute('aria-disabled', 'true'); addBtn.textContent = T.strings.unavailable;
        if (stockEl) { stockEl.textContent = T.strings.unavailable; stockEl.className = 'stock stock--out'; }
        return;
      }
      idInput.value = v.id;
      if (priceEl && v.price_html) priceEl.innerHTML = v.price_html;
      if (v.available) { addBtn.removeAttribute('aria-disabled'); addBtn.textContent = T.strings.add; }
      else { addBtn.setAttribute('aria-disabled', 'true'); addBtn.textContent = T.strings.soldOut; }
      if (stockEl) { stockEl.textContent = v.available ? T.strings.inStock : T.strings.outOfStock; stockEl.className = 'stock' + (v.available ? '' : ' stock--out'); }
      if (v.image) { const main = root.querySelector('[data-gallery-main] img'); if (main) { main.src = v.image.src; main.srcset = v.image.srcset || ''; main.alt = v.image.alt || main.alt; } }
      const u = new URL(window.location.href); u.searchParams.set('variant', v.id); history.replaceState({}, '', u);
    }
    form.addEventListener('change', (e) => { if (e.target.matches('[data-option-index]')) update(); });
  });

  /* ---------- gallery ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-thumb]'); if (!t) return;
    const main = $('[data-gallery-main] img'); if (!main) return;
    main.src = t.dataset.src; main.srcset = t.dataset.srcset || ''; main.alt = t.dataset.alt || '';
    $$('[data-thumb]').forEach((b) => b.setAttribute('aria-current', b === t ? 'true' : 'false'));
  });

  /* ---------- cart page: change quantity / remove, re-render section ---------- */
  async function cartChange(line, quantity) {
    const root = $('[data-cart]'); if (!root) return;
    root.classList.add('is-updating');
    const live = $('[data-cart-live]');
    try {
      const res = await fetch(T.routes.cartChange + '.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ line, quantity }) });
      if (!res.ok) throw new Error('change');
      const cart = await res.json();
      setCartCount(cart.item_count);
      const html = await (await fetch(`${T.routes.cart}?section_id=main-cart`)).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const fresh = doc.querySelector('[data-cart-root]');
      if (fresh) root.closest('[data-cart-root]').innerHTML = fresh.innerHTML;
      const l = $('[data-cart-live]'); if (l) l.textContent = '';
    } catch (_) {
      if (live) { live.textContent = T.strings.error; }
      toast(T.strings.network, { error: true });
      root.classList.remove('is-updating');
    }
  }
  document.addEventListener('change', (e) => {
    const i = e.target.closest('[data-cart-qty]'); if (!i) return;
    cartChange(parseInt(i.dataset.line, 10), Math.max(0, parseInt(i.value, 10) || 0));
  });
  document.addEventListener('click', (e) => {
    const r = e.target.closest('[data-cart-remove]'); if (!r) return;
    e.preventDefault(); cartChange(parseInt(r.dataset.line, 10), 0);
  });

  /* ---------- predictive search ---------- */
  const sInput = $('[data-search-input]');
  const sOut = $('[data-search-results]');
  if (sInput && sOut && T.routes.searchSuggest) {
    let ctl;
    const run = debounce(async () => {
      const q = sInput.value.trim();
      if (q.length < 2) { sOut.innerHTML = ''; return; }
      ctl && ctl.abort(); ctl = new AbortController();
      try {
        const url = `${T.routes.searchSuggest}?q=${encodeURIComponent(q)}&section_id=predictive-search&resources[type]=product,collection,page&resources[limit]=6`;
        const html = await (await fetch(url, { signal: ctl.signal })).text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const res = doc.querySelector('[data-predictive]');
        sOut.innerHTML = res ? res.innerHTML : '';
      } catch (err) { if (err.name !== 'AbortError') sOut.innerHTML = ''; }
    }, 220);
    sInput.addEventListener('input', run);
  }

  /* ---------- product recommendations (replaces the fallback list when Shopify returns related products) ---------- */
  $$('[data-recommendations]').forEach(async (el) => {
    if (!el.dataset.url) return;
    try {
      const html = await (await fetch(el.dataset.url)).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const fresh = doc.querySelector('[data-recommendations]');
      if (fresh && fresh.querySelector('.card')) el.innerHTML = fresh.innerHTML;
    } catch (_) { /* keep server-rendered fallback */ }
  });

  /* ---------- collection filters: submit on change ---------- */
  $$('form[data-filter-form]').forEach((f) => f.addEventListener('change', () => f.requestSubmit()));

  /* ---------- cookie preferences (Shopify's own banner) ---------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cookie-prefs]'); if (!b) return;
    if (window.privacyBanner && typeof window.privacyBanner.showPreferences === 'function') { window.privacyBanner.showPreferences(); }
    else { toast(T.strings.noPrefs); }
  });

  /* ---------- scroll reveal (JS adds the class, so no-JS users always see content) ---------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach((el) => { const r = el.getBoundingClientRect(); if (r.top > innerHeight) { el.classList.add('reveal'); io.observe(el); } });
  }
})();
