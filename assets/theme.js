/* Graceful Divine Melts — theme.js (v2)
   Progressive enhancement only: every form and link works without this file. No dependencies (≈11 kB min, no animation library).
   Handles: floating-nav state, dialogs, predictive search overlay, add to bag, variants, gallery dots, sticky buy bar,
   custom-scent prefill, rails, scent explorer tabs, video tiles, bag updates, recommendations, cookie link, reveals. */
(() => {
  'use strict';
  const T = window.theme || { routes: {}, strings: {} };
  const S = T.strings;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(html, { error = false } = {}) {
    const el = $('#Toast'); if (!el) return;
    el.className = 'toast' + (error ? ' toast--error' : ''); el.innerHTML = html; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, error ? 7000 : 6000);
  }

  /* ---------- floating nav: compact once the page scrolls ---------- */
  const root = document.documentElement;
  let ticking = false;
  const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { root.classList.toggle('is-scrolled', window.scrollY > 24); ticking = false; }); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- dialogs ---------- */
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open-dialog]');
    if (open) {
      const d = document.getElementById(open.dataset.openDialog);
      if (d && d.showModal) { d.showModal(); open.setAttribute('aria-expanded', 'true'); const f = d.querySelector('[data-autofocus]'); if (f) f.focus(); }
      return;
    }
    const close = e.target.closest('[data-close-dialog]');
    if (close) { const d = close.closest('dialog'); if (d) d.close(); return; }
    if (e.target.matches && e.target.matches('dialog.overlay')) e.target.close(); // backdrop click
  });
  $$('dialog.overlay').forEach((d) => d.addEventListener('close', () => {
    $$(`[data-open-dialog="${d.id}"]`).forEach((b) => { b.setAttribute('aria-expanded', 'false'); b.focus({ preventScroll: true }); });
  }));
  // following a link inside the menu sheet should close it (same-page anchors)
  $$('#MenuDialog a').forEach((a) => a.addEventListener('click', () => { const d = a.closest('dialog'); if (d && a.getAttribute('href')?.startsWith('#')) d.close(); }));

  /* ---------- predictive search overlay ---------- */
  const sDlg = $('#SearchDialog');
  if (sDlg) {
    const input = $('[data-search-input]', sDlg), out = $('[data-search-results]', sDlg), status = $('[data-search-status]', sDlg);
    const clear = $('[data-search-clear]', sDlg), shortcuts = $('[data-search-shortcuts]', sDlg), popular = $('[data-search-popular]', sDlg);
    let ctl, active = -1;
    const options = () => $$('[role="option"]', out);
    const setActive = (i) => {
      const opts = options(); if (!opts.length) return;
      active = (i + opts.length) % opts.length;
      opts.forEach((o, n) => o.setAttribute('aria-selected', n === active ? 'true' : 'false'));
      input.setAttribute('aria-activedescendant', opts[active].id); opts[active].scrollIntoView({ block: 'nearest' });
    };
    const reset = () => { out.innerHTML = ''; status.textContent = ''; if (popular) popular.hidden = false; shortcuts && shortcuts.classList.remove('is-dim'); input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; clear.hidden = !input.value; };
    const run = debounce(async () => {
      const q = input.value.trim(); clear.hidden = !input.value;
      if (q.length < 2) { ctl && ctl.abort(); reset(); return; }
      ctl && ctl.abort(); ctl = new AbortController();
      status.innerHTML = `<span class="loading-dots">${S.searching}</span>`; if (popular) popular.hidden = true; shortcuts && shortcuts.classList.add('is-dim');
      try {
        const url = `${T.routes.searchSuggest}?q=${encodeURIComponent(q)}&section_id=predictive-search&resources[type]=product,collection&resources[limit]=6&resources[options][unavailable_products]=last`;
        const res = await fetch(url, { signal: ctl.signal }); if (!res.ok) throw new Error('bad');
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html'); const block = $('[data-predictive]', doc);
        out.innerHTML = block ? block.innerHTML : ''; const n = parseInt(block?.dataset.count || '0', 10);
        status.textContent = n === 0 ? '' : (n === 1 ? S.resultsOne : S.resultsMany.replace(/^\d+/, n));
        input.setAttribute('aria-expanded', n > 0 ? 'true' : 'false'); active = -1;
      } catch (err) {
        if (err.name === 'AbortError') return;
        out.innerHTML = ''; status.innerHTML = `${S.searchError} <button type="button" class="link-btn" data-search-retry>${S.retry}</button>`;
      }
    }, 200);
    input.addEventListener('input', run);
    sDlg.addEventListener('click', (e) => { if (e.target.closest('[data-search-retry]')) run(); });
    clear.addEventListener('click', () => { input.value = ''; reset(); input.focus(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active < 0 ? -1 : active - 1); }
      else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); options()[active].click(); }
    });
    sDlg.addEventListener('cancel', (e) => { if (input.value) { e.preventDefault(); input.value = ''; reset(); } }); // first Esc clears, second closes
    sDlg.addEventListener('close', () => { input.value = ''; reset(); });
  }

  /* ---------- bag helpers ---------- */
  const setCartCount = (n) => $$('[data-cart-count]').forEach((el) => { el.textContent = n; el.dataset.count = n; });
  async function refreshCartCount() { try { const c = await (await fetch(T.routes.cartJson, { headers: { Accept: 'application/json' } })).json(); setCartCount(c.item_count); } catch (_) { /* non-critical */ } }

  async function addToCart(form) {
    const btns = $$('[type="submit"]', form).concat($$(`[type="submit"][form="${form.id}"]`));
    const err = $('[data-form-error]', form);
    if (err) { err.hidden = true; err.textContent = ''; }
    btns.forEach((b) => { b.classList.add('is-loading'); b.setAttribute('aria-disabled', 'true'); });
    try {
      const res = await fetch(T.routes.cartAdd + '.js', { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      const data = await res.json();
      if (!res.ok || data.status) { const msg = data.description || data.message || S.error; if (err) { err.textContent = msg; err.hidden = false; } else toast(msg, { error: true }); return; }
      await refreshCartCount();
      toast(`<span>${S.added}</span> <a href="${T.routes.cart}">${S.viewCart}</a>`);
    } catch (_) {
      if (err) { err.textContent = S.network; err.hidden = false; } else toast(S.network, { error: true });
    } finally { btns.forEach((b) => { b.classList.remove('is-loading'); b.removeAttribute('aria-disabled'); }); }
  }
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-product-form], form.js-quick-add'); if (!f) return;
    const id = f.querySelector('[name="id"]'); if (!id || !id.value) return;
    e.preventDefault();
    // Shopify's product form is rendered with novalidate, so validate required fields (e.g. the custom scent) ourselves
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const sub = e.submitter; if (sub && sub.getAttribute('aria-disabled') === 'true') return;
    addToCart(f);
  });

  /* ---------- quantity ---------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qty-step]'); if (!b) return;
    const input = b.closest('.qty').querySelector('input');
    input.value = Math.max(parseInt(input.min || '0', 10), (parseInt(input.value, 10) || 0) + parseInt(b.dataset.qtyStep, 10));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---------- product page ---------- */
  $$('[data-product]').forEach((rootEl) => {
    const form = $('[data-product-form]', rootEl); if (!form) return;
    const jsonEl = $('script[data-variants]', rootEl); const variants = jsonEl ? JSON.parse(jsonEl.textContent) : [];
    const idInput = $('[name="id"]', form), addBtn = $('[data-add-btn]', form);
    const bar = $('[data-buybar]'), barBtn = $('[data-buybar-btn]'), barPrice = $('[data-buybar-price]');
    const priceEl = $('[data-price-wrap]', rootEl), stockEl = $('[data-stock]', rootEl);
    const labelAdd = (v) => (v ? (v.available ? S.add : S.soldOut) : S.unavailable);
    const syncBar = (v) => { if (!barBtn) return; barBtn.textContent = labelAdd(v); if (v && v.available) barBtn.removeAttribute('aria-disabled'); else barBtn.setAttribute('aria-disabled', 'true'); };

    function update() {
      const opts = $$('[data-option-index]:checked', form).map((i) => i.value);
      $$('.option', form).forEach((fs, i) => { const l = $('[data-selected-value]', fs); if (l) l.textContent = opts[i] || ''; });
      const v = variants.find((x) => x.options.every((o, i) => o === opts[i]));
      if (!v) { idInput.value = ''; addBtn.setAttribute('aria-disabled', 'true'); addBtn.textContent = S.unavailable; if (stockEl) { stockEl.textContent = S.unavailable; stockEl.className = 'stock stock--out'; } syncBar(null); return; }
      idInput.value = v.id;
      if (priceEl && v.price_html) priceEl.innerHTML = v.price_html; if (barPrice && v.price_html) barPrice.innerHTML = v.price_html;
      if (v.available) addBtn.removeAttribute('aria-disabled'); else addBtn.setAttribute('aria-disabled', 'true');
      addBtn.textContent = labelAdd(v); syncBar(v);
      if (stockEl) { stockEl.textContent = v.available ? S.inStock : S.outOfStock; stockEl.className = 'stock' + (v.available ? '' : ' stock--out'); }
      if (v.media) { const slide = $(`[data-media-id="${v.media}"]`, rootEl); if (slide) slide.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'center' }); }
      const u = new URL(location.href); u.searchParams.set('variant', v.id); history.replaceState({}, '', u);
    }
    form.addEventListener('change', (e) => { if (e.target.matches('[data-option-index]')) update(); });

    // sticky mobile bag bar: visible once the main button has scrolled above the viewport
    if (bar && addBtn) {
      let pend = false;
      const check = () => {
        pend = false; const show = addBtn.getBoundingClientRect().bottom < 0;
        bar.classList.toggle('is-on', show); bar.setAttribute('aria-hidden', show ? 'false' : 'true'); if (barBtn) barBtn.tabIndex = show ? 0 : -1;
      };
      const queue = () => { if (!pend) { pend = true; requestAnimationFrame(check); } };
      addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue); check();
    }
    // gallery dots on the mobile carousel
    const track = $('[data-gallery-track]', rootEl), dots = $$('[data-gallery-dots] span', rootEl);
    if (track && dots.length && 'IntersectionObserver' in window) {
      const slides = $$('.gallery__slide', track);
      const io = new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) dots.forEach((d, i) => d.classList.toggle('is-on', slides[i] === en.target)); }), { root: track, threshold: .6 });
      slides.forEach((s) => io.observe(s));
    }
    // custom-scent: prefill from ?scent=
    const pre = $('[data-prefill-scent]', rootEl); const q = new URLSearchParams(location.search).get('scent');
    if (pre && q) pre.value = q.slice(0, 120);
  });

  /* ---------- scent explorer (tabs) ---------- */
  $$('[data-explorer]').forEach((ex) => {
    const tabs = $$('[role="tab"]', ex), panels = $$('[role="tabpanel"]', ex);
    const select = (i, focus) => {
      tabs.forEach((t, n) => { t.setAttribute('aria-selected', n === i ? 'true' : 'false'); t.tabIndex = n === i ? 0 : -1; });
      panels.forEach((p, n) => { p.hidden = n !== i; }); if (focus) tabs[i].focus();
    };
    panels.forEach((p, n) => { p.hidden = n !== 0; });
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) select(i); });
      t.addEventListener('keydown', (e) => {
        const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select((i + k + tabs.length) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); } if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
  });


  /* ---------- rails (native scroll-snap + arrow buttons) ---------- */
  $$('[data-rail]').forEach((rail) => {
    const sec = rail.closest('section'); const prev = $('[data-rail-prev]', sec), next = $('[data-rail-next]', sec); if (!prev || !next) return;
    const step = () => Math.max(rail.clientWidth * .8, 240);
    const upd = () => { prev.disabled = rail.scrollLeft < 8; next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8; };
    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }));
    rail.addEventListener('scroll', debounce(upd, 60), { passive: true }); upd();
    rail.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); } if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); } });
  });

  /* ---------- hero product stage ---------- */
  $$('[data-hero]').forEach((hero) => {
    const slides = $$('[data-hero-slide]', hero), infos = $$('[data-hero-info]', hero), thumbs = $$('[data-hero-thumb]', hero);
    if (slides.length < 2) return;
    let i = 0, timer;
    const set = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-on', k === i)); infos.forEach((s, k) => s.classList.toggle('is-on', k === i));
      thumbs.forEach((t, k) => t.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
    };
    const stop = () => { clearInterval(timer); timer = null; };
    let locked = false;
    const start = () => { if (!reduced && !saveData && !locked && !timer) timer = setInterval(() => { if (!document.hidden) set(i + 1); }, 6500); };
    thumbs.forEach((t, k) => t.addEventListener('click', () => { locked = true; stop(); set(k); }));
    hero.addEventListener('focusin', () => { locked = true; stop(); });
    const stage = $('.hero__stage', hero);
    if (stage) { stage.addEventListener('pointerenter', stop); stage.addEventListener('pointerleave', start); }
    start();
  });

  /* ---------- scent selector (tabs + optional family filter) ---------- */
  $$('[data-selector]').forEach((sel) => {
    const rows = $$('[role="tab"]', sel), panels = $$('[role="tabpanel"]', sel), chips = $$('[data-family][aria-pressed]', sel);
    const visibleRows = () => rows.filter((r) => !r.closest('li').hidden);
    const select = (r, focus) => {
      rows.forEach((x, n) => { const on = x === r; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; panels[n].hidden = !on; });
      if (focus) r.focus();
    };
    panels.forEach((p, n) => { p.hidden = n !== 0; });
    rows.forEach((r) => {
      r.addEventListener('click', () => select(r));
      r.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover) and (min-width: 900px)').matches) select(r); });
      r.addEventListener('keydown', (e) => {
        const v = visibleRows(); const k = v.indexOf(r); const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); select(v[(k + d + v.length) % v.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(v[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(v[v.length - 1], true); }
      });
    });
    chips.forEach((chip) => chip.addEventListener('click', () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
      const fam = chip.dataset.family;
      rows.forEach((r) => { const li = r.closest('li'); li.hidden = !!fam && li.dataset.family !== fam; });
      const first = visibleRows()[0]; if (first) select(first);
    }));
  });

  /* ---------- moods: filter the rail by real scent family ---------- */
  $$('[data-rail-section]').forEach((sec) => {
    const moods = $('[data-moods]', sec); if (!moods) return;
    const tabs = $$('.moods__tab', moods), desc = $('[data-moods-desc]', moods), rail = $('[data-rail]', sec);
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-pressed', t === tab ? 'true' : 'false'));
      const fam = tab.dataset.mood;
      $$('li[data-family]', rail).forEach((li) => { li.hidden = !!fam && li.dataset.family !== fam; li.classList.add('is-in'); });
      desc.textContent = fam ? (tab.dataset.desc || '') : '';
      if (fam && tab.dataset.link) { const a = document.createElement('a'); a.className = 'link'; a.href = tab.dataset.link; a.textContent = tab.dataset.cta || 'Shop all'; desc.append(' ', a); }
      rail.scrollTo({ left: 0, behavior: reduced ? 'auto' : 'smooth' }); rail.dispatchEvent(new Event('scroll'));
    }));
  });

  /* ---------- video tiles: muted autoplay only when visible, motion allowed and data not saved ---------- */
  $$('[data-video-tile]').forEach((tile) => {
    const v = $('video', tile), btn = $('[data-video-play]', tile); if (!v) return;
    v.muted = true; v.playsInline = true; v.loop = true;
    const play = () => v.play().then(() => { if (btn) btn.hidden = true; }).catch(() => {});
    if (btn) btn.addEventListener('click', play);
    v.addEventListener('click', () => { if (v.paused) play(); else { v.pause(); if (btn) btn.hidden = false; } });
    if (!reduced && !saveData && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { if (en.isIntersecting) { v.preload = 'auto'; play(); } else { v.pause(); if (btn) btn.hidden = false; } }, { threshold: .65 }).observe(tile);
    }
  });

  /* ---------- bag page: change quantity / remove, re-render the section ---------- */
  async function cartChange(line, quantity) {
    const wrap = $('[data-cart]'); if (!wrap) return;
    const form = $('.bag', wrap); if (form) form.classList.add('is-updating');
    try {
      const res = await fetch(T.routes.cartChange + '.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ line, quantity }) });
      if (!res.ok) throw new Error('change');
      setCartCount((await res.json()).item_count);
      const doc = new DOMParser().parseFromString(await (await fetch(`${T.routes.cart}?section_id=main-cart`)).text(), 'text/html');
      const fresh = $('[data-cart-root]', doc); if (fresh) wrap.closest('[data-cart-root]').innerHTML = fresh.innerHTML;
    } catch (_) { toast(S.network, { error: true }); if (form) form.classList.remove('is-updating'); }
  }
  document.addEventListener('change', (e) => { const i = e.target.closest('[data-cart-qty]'); if (i) cartChange(parseInt(i.dataset.line, 10), Math.max(0, parseInt(i.value, 10) || 0)); });
  document.addEventListener('click', (e) => { const r = e.target.closest('[data-cart-remove]'); if (r) { e.preventDefault(); cartChange(parseInt(r.dataset.line, 10), 0); } });

  /* ---------- related products from Shopify recommendations ---------- */
  $$('[data-recommendations]').forEach(async (el) => {
    if (!el.dataset.url) return;
    try { const doc = new DOMParser().parseFromString(await (await fetch(el.dataset.url)).text(), 'text/html'); const fresh = $('[data-recommendations]', doc); if (fresh && $('.item', fresh)) el.innerHTML = fresh.innerHTML; } catch (_) { /* keep fallback */ }
  });
  $$('form[data-filter-form]').forEach((f) => f.addEventListener('change', () => f.requestSubmit()));

  /* ---------- scroll reveal (JS adds the class, so no-JS users always see content) ---------- */
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach((el) => { const r = el.getBoundingClientRect(); if (r.top > innerHeight) { el.classList.add('reveal'); io.observe(el); } });
  }

  /* ---------- announcement bar: rolling messages (auto; pauses on hover/focus/hidden tab; static when reduced motion) ---------- */
  $$('[data-announce]').forEach((bar) => {
    const track = $('.announce__track', bar), items = $$('.announce__item', bar);
    if (!track || items.length < 2 || reduced) return;
    const gap = (Number(bar.dataset.interval) || 5) * 1000;
    const clone = items[0].cloneNode(true); clone.setAttribute('aria-hidden', 'true'); clone.querySelectorAll('a').forEach((a) => { a.tabIndex = -1; }); track.appendChild(clone);
    const h = () => items[0].getBoundingClientRect().height;
    let i = 0, timer = null, paused = false;
    const mark = () => items.forEach((el, k) => { const on = k === i % items.length; el.setAttribute('aria-hidden', on ? 'false' : 'true'); el.querySelectorAll('a').forEach((a) => { a.tabIndex = on ? 0 : -1; }); });
    const go = () => { i += 1; track.style.transform = `translateY(${-i * h()}px)`; mark(); };
    track.addEventListener('transitionend', () => { if (i >= items.length) { track.classList.add('is-instant'); i = 0; track.style.transform = 'translateY(0)'; void track.offsetHeight; track.classList.remove('is-instant'); mark(); } });
    const start = () => { stop(); timer = setInterval(() => { if (!paused && !document.hidden) go(); }, gap); };
    const stop = () => { clearInterval(timer); };
    bar.addEventListener('pointerenter', () => { paused = true; }); bar.addEventListener('pointerleave', () => { paused = false; });
    bar.addEventListener('focusin', () => { paused = true; }); bar.addEventListener('focusout', () => { paused = false; });
    addEventListener('resize', () => { track.classList.add('is-instant'); track.style.transform = `translateY(${-(i % items.length) * h()}px)`; void track.offsetHeight; track.classList.remove('is-instant'); });
    mark(); start();
  });

  /* ---------- Find your scent journey ---------- */
  $$('[data-journey]').forEach((root) => {
    const moods = $$('[data-mood]', root), panels = $$('[data-panel]', root);
    const pickScent = (panel, k, focus) => {
      const items = $$('.journey__scent', panel), thumbs = $$('.journey__thumb', panel);
      items.forEach((el, n) => el.classList.toggle('is-on', n === k));
      thumbs.forEach((el, n) => { el.classList.toggle('is-on', n === k); el.setAttribute('aria-selected', n === k ? 'true' : 'false'); });
      if (focus && thumbs[k]) thumbs[k].focus();
    };
    const pickMood = (i, focus) => {
      moods.forEach((m, n) => { const on = n === i; m.classList.toggle('is-on', on); m.setAttribute('aria-selected', on ? 'true' : 'false'); });
      panels.forEach((p, n) => p.classList.toggle('is-on', n === i));
      root.style.setProperty('--j-bg', moods[i].dataset.color || '#F7B9D1'); root.style.setProperty('--j-i', i);
      if (focus) moods[i].focus();
    };
    moods.forEach((m, i) => {
      m.addEventListener('click', () => pickMood(i));
      m.addEventListener('keydown', (e) => {
        const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); pickMood((i + k + moods.length) % moods.length, true); }
      });
    });
    panels.forEach((p) => {
      const thumbs = $$('.journey__thumb', p);
      thumbs.forEach((t, k) => {
        t.addEventListener('click', () => pickScent(p, k));
        t.addEventListener('keydown', (e) => {
          const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
          if (d) { e.preventDefault(); pickScent(p, (k + d + thumbs.length) % thumbs.length, true); }
        });
      });
    });
    const sur = $('[data-surprise]', root);
    if (sur) sur.addEventListener('click', () => {
      const i = Math.floor(Math.random() * moods.length), p = panels[i], n = $$('.journey__scent', p).length;
      pickMood(i); if (n) pickScent(p, Math.floor(Math.random() * n));
    });
  });

  /* ---------- welcome offer popup: timed, once per browser, remembers close + sign-up ---------- */
  $$('[data-subpop]').forEach((dlg) => {
    if (typeof dlg.showModal !== 'function') return;
    const DAYS = (Number(dlg.dataset.days) || 30) * 864e5, UNTIL = 'gdm-subpop-until', DONE = 'gdm-subpop-subscribed';
    const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } };
    const ask = $('[data-subpop-ask]', dlg), done = $('[data-subpop-done]', dlg), form = $('form', dlg), err = $('[data-subpop-error]', dlg), email = $('[data-subpop-email]', dlg);
    const showDone = () => { if (ask) ask.hidden = true; if (done) done.hidden = false; set(DONE, '1'); const h = $('h2', done); if (h) { h.tabIndex = -1; h.focus(); } };
    dlg.addEventListener('close', () => { if (get(DONE) !== '1') set(UNTIL, String(Date.now() + DAYS)); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('click', (e) => { if (e.target.closest('[data-subpop-close]')) dlg.close(); });
    const copy = $('[data-subpop-copy]', dlg);
    if (copy) copy.addEventListener('click', async () => {
      const code = dlg.dataset.code || ($('[data-subpop-code]', dlg) || {}).textContent || '';
      try { await navigator.clipboard.writeText(code); } catch (e) { const r = document.createRange(); const n = $('[data-subpop-code]', dlg); if (n) { r.selectNodeContents(n); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } }
      const old = copy.textContent; copy.textContent = copy.dataset.copied || old; setTimeout(() => { copy.textContent = old; }, 2000);
    });
    if (form) form.addEventListener('submit', async (e) => {
      e.preventDefault(); if (err) err.hidden = true;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const btn = $('[data-subpop-submit]', dlg); if (btn) btn.disabled = true;
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'text/html' } });
        const html = res.ok ? await res.text() : '';
        const ok = res.ok && (/customer_posted=true/.test(res.url) || html.includes('__subpopPosted'));
        if (ok) showDone(); else if (err) { err.hidden = false; if (email) email.setAttribute('aria-invalid', 'true'); }
      } catch (x) { if (err) err.hidden = false; }
      if (btn) btn.disabled = false;
    });
    if (window.__subpopPosted) { set(DONE, '1'); showDone(); dlg.showModal(); return; }
    if (get(DONE) === '1' || Number(get(UNTIL)) > Date.now()) return;
    if (dlg.dataset.mobile === 'false' && matchMedia('(max-width: 699px)').matches) return;
    let timer = null, shown = false;
    const scrollAt = Number(dlg.dataset.scroll) || 0;
    const onScroll = () => { const h = document.documentElement; if (scrollAt && (scrollY + innerHeight) / h.scrollHeight * 100 >= scrollAt) open(); };
    function open() {
      if (shown) return;
      if (document.querySelector('dialog[open]') || document.hidden) { clearTimeout(timer); timer = setTimeout(open, 4000); return; }
      shown = true; clearTimeout(timer); removeEventListener('scroll', onScroll); dlg.showModal();
    }
    if (scrollAt) addEventListener('scroll', onScroll, { passive: true });
    timer = setTimeout(open, (Number(dlg.dataset.delay) || 12) * 1000);
  });
})();
