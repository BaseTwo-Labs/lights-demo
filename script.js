(() => {
  'use strict';

  // Design settings (same defaults as the Claude Design concept)
  const CONFIG = { neonPrimary: '#9d5cff', neonSecondary: '#b6ff3c', flicker: true, cursorGlow: true };
  const n1 = CONFIG.neonPrimary, n2 = CONFIG.neonSecondary;

  const root = document.getElementById('root');
  root.style.setProperty('--n1', n1);
  root.style.setProperty('--n2', n2);
  root.style.setProperty('--buzz', CONFIG.flicker ? 'buzz 6s infinite' : 'none');
  root.style.setProperty('--broken', CONFIG.flicker ? 'broken 5s 3s infinite' : 'none');
  root.style.setProperty('--cursor', CONFIG.cursorGlow ? '1' : '0');

  // ---------- Data ----------
  const cats = [
    { id: 'litere', label: 'Litere volumetrice', color: n1, tech: 'LED frontal / halo', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.' },
    { id: 'neon', label: 'Neon LED', color: n2, tech: 'Neon flex 12V', desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.' },
    { id: 'caseta', label: 'Casete luminoase', color: '#ffb347', tech: 'Casetă aluminiu, LED', desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.' },
    { id: 'logo', label: 'Logo iluminat', color: '#9d5cff', tech: 'Plexiglas, LED spate', desc: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.' },
    { id: 'totem', label: 'Totemuri', color: '#b6ff3c', tech: 'Structură metalică, LED', desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.' },
    { id: 'print', label: 'Print', color: '#fff4e0', tech: 'Print UV / solvent', desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.' },
  ];
  const byId = Object.fromEntries(cats.map(c => [c.id, c]));

  const projectsData = [
    ['Cafenea Lorem', 'neon', 'Cluj-Napoca', 'fațadă cafenea, noaptea', 2],
    ['Farmacia Ipsum', 'caseta', 'București', 'casetă farmacie', 1],
    ['Hotel Dolor', 'litere', 'Brașov', 'litere pe fațadă hotel', 2],
    ['Studio Amet', 'logo', 'Timișoara', 'logo recepție', 1],
    ['Bistro Sit', 'neon', 'Iași', 'neon interior bistro', 1],
    ['Stație Elit', 'totem', 'Ploiești', 'totem stradal', 2],
    ['Clinica Tempor', 'litere', 'Constanța', 'litere halo', 1],
    ['Magazin Magna', 'print', 'Sibiu', 'colantare vitrină', 1],
    ['Showroom Aliqua', 'caseta', 'Oradea', 'casetă dublă față', 1],
    ['Salon Veniam', 'neon', 'Craiova', 'neon script salon', 1],
  ];

  const steps = [
    ['01', 'Discuție', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.'],
    ['02', 'Machetă', 'Eiusmod tempor incididunt ut labore et dolore magna aliqua.'],
    ['03', 'Producție', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.'],
    ['04', 'Montaj', 'Duis aute irure dolor in reprehenderit in voluptate velit.'],
  ];
  const prints = ['Bannere și roll-up-uri', 'Colantări auto', 'Autocolante și etichete', 'Folie pentru vitrine', 'Afișe și meniuri'];

  const dockDefs = [
    ['acasa', 'Acasă', 'M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9'],
    ['proiecte', 'Proiecte', 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 8.5h.01'],
    ['proces', 'Proces', 'M13 2 4 14h7l-1 8 9-12h-7z'],
    ['tipar', 'Tipar', 'M6 9V3h12v6M6 17H4v-8h16v8h-2M6 14h12v7H6z'],
    ['oferta', 'Ofertă', 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5'],
  ];

  // ---------- State ----------
  const state = { dockHover: -1, active: 'acasa', cat: 'all', modal: null, types: [], file: '', sent: false };

  // ---------- Helpers ----------
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const dotStyle = (c, s = 8) => `width:${s}px;height:${s}px;flex:none;border-radius:50%;background:${c};box-shadow:0 0 8px ${c}, 0 0 16px ${c}`;
  const neonText = (c, size) => `margin:0;font:400 ${size}/.95 'Tilt Neon',sans-serif;color:color-mix(in srgb, ${c} 28%, white);text-shadow:0 0 4px #fff, 0 0 14px ${c}, 0 0 36px ${c}`;

  function goTo(id) {
    const el = document.getElementById(id); if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (id === 'acasa' ? 0 : 20), behavior: 'smooth' });
  }

  // ---------- Dock ----------
  const dock = $('dock');
  dock.innerHTML = dockDefs.map(([id, label, path], i) => `
    <button type="button" data-i="${i}" aria-label="${esc(label)}" style="background:none;border:none;padding:0 4px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px;min-width:60px">
      <span class="tile"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="${path}"></path></svg></span>
      <span class="lbl">${esc(label)}</span>
    </button>`).join('');
  const dockBtns = [...dock.querySelectorAll('button')];
  dockBtns.forEach((b, i) => {
    b.addEventListener('click', () => goTo(dockDefs[i][0]));
    b.addEventListener('mouseenter', () => { state.dockHover = i; renderDock(); });
  });
  dock.addEventListener('mouseleave', () => { state.dockHover = -1; renderDock(); });

  function renderDock() {
    dockBtns.forEach((b, i) => {
      const id = dockDefs[i][0];
      const dist = state.dockHover < 0 ? 9 : Math.abs(state.dockHover - i);
      const sc = dist === 0 ? 1.2 : dist === 1 ? 1.07 : 1;
      const act = state.active === id;
      const tile = b.querySelector('.tile'), svg = b.querySelector('svg'), lbl = b.querySelector('.lbl');
      tile.style.cssText = `width:48px;height:48px;border-radius:15px;display:grid;place-items:center;transform-origin:50% 100%;` +
        `transform:translateY(${-(sc - 1) * 26}px) scale(${sc});transition:transform .22s cubic-bezier(.3,1.4,.5,1), background .3s, box-shadow .3s, border-color .3s;` +
        `background:${act ? `linear-gradient(160deg, ${n1}4d, #ffffff0a)` : 'linear-gradient(160deg,#ffffff1a,#ffffff05)'};` +
        `border:1px solid ${act ? n1 + 'aa' : '#ffffff1a'};box-shadow:${act ? `0 0 20px ${n1}66, inset 0 0 10px ${n1}40` : 'inset 0 1px 0 #ffffff14'}`;
      svg.setAttribute('stroke', act ? '#fff' : '#ffffffc8');
      svg.style.cssText = `filter:${act ? `drop-shadow(0 0 4px ${n1}) drop-shadow(0 0 8px ${n1})` : 'none'};transition:filter .3s`;
      lbl.style.cssText = `font:500 11px 'Instrument Sans',sans-serif;letter-spacing:.02em;white-space:nowrap;transition:color .3s, text-shadow .3s;` +
        `color:${act ? '#fff' : '#ffffff8c'};text-shadow:${act ? `0 0 8px ${n1}` : 'none'}`;
    });
  }

  // ---------- Marquee ----------
  $('marquee').innerHTML = [...cats, ...cats].map(c => `
    <span style="display:flex;align-items:center;gap:36px;padding-right:36px;font:400 clamp(28px,3.6vw,48px) 'Tilt Neon',sans-serif;white-space:nowrap;color:#ffffffd0">
      ${esc(c.label)}
      <span style="width:10px;height:10px;transform:rotate(45deg);background:${c.color};box-shadow:0 0 10px ${c.color}, 0 0 22px ${c.color}"></span>
    </span>`).join('');

  // ---------- Steps & print list (static content) ----------
  $('steps').innerHTML = steps.map(([n, title, body]) => `
    <div class="step" data-reveal>
      <div class="step-n">${n}</div>
      <h3>${esc(title)}</h3>
      <p>${esc(body)}</p>
    </div>`).join('');

  $('prints').innerHTML = prints.map((title, i) => `
    <div class="print-row" data-reveal>
      <div style="display:flex;align-items:baseline;gap:20px">
        <span style="font:500 11px 'JetBrains Mono',monospace;color:#ffffff60">0${i + 1}</span>
        <span class="t">${esc(title)}</span>
      </div>
      <span style="font:500 12px 'JetBrains Mono',monospace;color:#ffffff70">→</span>
    </div>`).join('');

  // ---------- Projects: filter chips, header, grid ----------
  const chipList = [{ id: 'all', label: 'Toate', color: '#ffffff' }, ...cats];
  const chipsEl = $('chips');
  chipsEl.innerHTML = chipList.map(c => `<button type="button" data-cat="${c.id}"><span></span>${esc(c.label)}</button>`).join('');
  chipsEl.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { state.cat = b.dataset.cat; renderProjects(); }));

  function renderProjects() {
    // chips
    chipsEl.querySelectorAll('button').forEach((b, i) => {
      const c = chipList[i], on = state.cat === c.id;
      b.style.cssText = `display:flex;align-items:center;gap:9px;padding:11px 18px;border-radius:999px;cursor:pointer;font:500 14px 'Instrument Sans',sans-serif;transition:all .25s;` +
        `color:${on ? '#07060a' : '#ffffffd0'};background:${on ? (c.id === 'all' ? '#fff' : c.color) : '#ffffff08'};` +
        `border:1px solid ${on ? 'transparent' : '#ffffff1f'};box-shadow:${on && c.id !== 'all' ? `0 0 20px ${c.color}88` : 'none'}`;
      b.firstElementChild.style.cssText = c.id === 'all' ? 'display:none' : dotStyle(c.color, 7);
    });

    // header
    const cur = byId[state.cat];
    const list = projectsData.map(([title, cat, city, ph, rows], i) => ({ i, title, cat, city, ph, rows }))
      .filter(p => state.cat === 'all' || p.cat === state.cat);
    const t = $('cat-title');
    t.textContent = cur ? cur.label : 'Toate proiectele';
    t.style.cssText = `font:400 clamp(30px,3vw,42px)/1 'Tilt Neon',sans-serif;color:${cur ? `color-mix(in srgb, ${cur.color} 28%, white)` : '#fff'};` +
      `text-shadow:${cur ? `0 0 4px #fff, 0 0 12px ${cur.color}, 0 0 28px ${cur.color}` : 'none'};transition:all .3s`;
    $('cat-desc').textContent = cur ? cur.desc : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    $('cat-count').textContent = `${list.length} ${list.length === 1 ? 'proiect' : 'proiecte'}`;

    // grid
    const grid = $('projects');
    grid.innerHTML = list.map(p => {
      const c = byId[p.cat];
      return `<button type="button" class="h-project" data-i="${p.i}" style="position:relative;display:block;grid-row:span ${state.cat === 'all' ? p.rows : 1};border-radius:22px;overflow:hidden;border:1px solid #ffffff14;padding:0;cursor:pointer;background:none;font:inherit;transition:box-shadow .4s, border-color .4s, transform .4s;animation:rise .6s cubic-bezier(.2,.7,.2,1) both;animation-timeline:view();animation-range:entry 0% entry 60%">
        <div style="position:absolute;inset:0;background:repeating-linear-gradient(135deg,#14131a 0 12px,#0e0d12 12px 24px)"></div>
        <div style="position:absolute;top:18px;left:18px;right:18px;display:flex;justify-content:space-between;gap:8px;font:500 11px 'JetBrains Mono',monospace;letter-spacing:.08em;color:#ffffff55"><span>[ ${esc(p.ph)} ]</span><span>↗</span></div>
        <div style="position:absolute;left:0;right:0;bottom:0;padding:20px;display:flex;justify-content:space-between;align-items:flex-end;gap:12px;background:linear-gradient(transparent,#07060ae6);text-align:left">
          <div>
            <div style="font-size:20px;font-weight:600;letter-spacing:-.01em;color:#fff">${esc(p.title)}</div>
            <div style="display:flex;align-items:center;gap:8px;font:500 11px 'JetBrains Mono',monospace;letter-spacing:.1em;color:#ffffff90;text-transform:uppercase;margin-top:8px"><span style="${dotStyle(c.color, 7)}"></span>${esc(c.label)} · ${esc(p.city)}</div>
          </div>
          <span style="font:500 11px 'JetBrains Mono',monospace;color:#ffffff80">20XX</span>
        </div>
      </button>`;
    }).join('');
    grid.querySelectorAll('button').forEach(b => b.addEventListener('click', () => openModal(+b.dataset.i)));
  }

  // ---------- Modal ----------
  const modal = $('modal');
  function openModal(i) {
    state.modal = i;
    const [title, cat, city, ph] = projectsData[i], c = byId[cat];
    $('modal-ph').textContent = `[ galerie foto: ${ph} ]`;
    $('modal-dot').style.cssText = dotStyle(c.color);
    $('modal-cat').textContent = c.label;
    const t = $('modal-title');
    t.textContent = title;
    t.style.cssText = neonText(c.color, 'clamp(40px,4.5vw,64px)');
    $('modal-city').textContent = city;
    $('modal-year').textContent = '20XX';
    $('modal-tech').textContent = c.tech;
    modal.hidden = false;
  }
  function closeModal() { state.modal = null; modal.hidden = true; }
  $('featured').addEventListener('click', () => openModal(0));
  modal.addEventListener('click', closeModal);
  $('modal-card').addEventListener('click', e => e.stopPropagation());
  $('modal-close').addEventListener('click', closeModal);
  $('modal-similar').addEventListener('click', () => {
    const id = projectsData[state.modal][1];
    closeModal();
    state.types = [id];
    setSent(false);
    renderTypeChips();
    setTimeout(() => goTo('oferta'), 50);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ---------- Quote form ----------
  const typeEl = $('type-chips');
  typeEl.innerHTML = cats.map(c => `<button type="button" data-id="${c.id}">${esc(c.label)}</button>`).join('');
  typeEl.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.id;
    state.types = state.types.includes(id) ? state.types.filter(x => x !== id) : [...state.types, id];
    renderTypeChips();
  }));
  function renderTypeChips() {
    typeEl.querySelectorAll('button').forEach((b, i) => {
      const c = cats[i], on = state.types.includes(c.id);
      b.style.cssText = `padding:10px 16px;border-radius:999px;cursor:pointer;font:500 14px 'Instrument Sans',sans-serif;transition:all .2s;` +
        `color:${on ? '#fff' : '#ffffffb0'};background:${on ? `${c.color}26` : 'transparent'};border:1px solid ${on ? c.color : '#ffffff26'};` +
        `box-shadow:${on ? `0 0 14px ${c.color}66, inset 0 0 8px ${c.color}33` : 'none'}`;
    });
  }

  const form = $('quote-form'), fileInput = $('file-input');
  function renderFile() { $('file-label').textContent = state.file || 'Atașează logo sau schiță (opțional)'; }
  fileInput.addEventListener('change', e => { state.file = e.target.files?.[0]?.name || ''; renderFile(); });

  function setSent(v) {
    state.sent = v;
    $('sent').hidden = !v;
    form.hidden = v;
  }
  form.addEventListener('submit', e => { e.preventDefault(); setSent(true); });
  $('reset').addEventListener('click', () => {
    form.reset();
    state.types = []; state.file = '';
    renderTypeChips(); renderFile();
    setSent(false);
  });

  // ---------- Cursor neon trail ----------
  // Performance notes:
  //  * rendered at quarter resolution: 16x fewer pixels, and the bilinear upscale gives the soft
  //    glow for free (replaces the CSS blur filter, which re-filtered the whole screen every frame)
  //  * glow is faked with a wide, faint stroke instead of canvas shadowBlur (very expensive)
  //  * the animation loop only runs while there is a trail to draw, and clears only the dirty area
  //  * disabled on touch-only devices, where there is no cursor
  function setupTrail() {
    const cv = $('trail');
    if (!cv || !CONFIG.cursorGlow || !matchMedia('(hover: hover) and (pointer: fine)').matches) { if (cv) cv.remove(); return; }
    const ctx = cv.getContext('2d', { alpha: true, desynchronized: true });
    const SCALE = 0.25;
    const onResize = () => { cv.width = Math.ceil(innerWidth * SCALE); cv.height = Math.ceil(innerHeight * SCALE); cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; dirty = null; };
    let dirty = null; // last drawn bounding box, in CSS px
    onResize(); addEventListener('resize', onResize);

    const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const pal = [n1, n2, '#ffb347'].map(hex);
    const colorAt = t => {
      const ph = (t * 0.0012) % pal.length, i0 = Math.floor(ph), k = ph - i0, a = pal[i0], b = pal[(i0 + 1) % pal.length];
      return `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`;
    };
    const life = 650;
    let pts = [], running = false;

    addEventListener('mousemove', e => {
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!running) { running = true; requestAnimationFrame(frame); }
    }, { passive: true });

    function frame(now) {
      while (pts.length && now - pts[0].t >= life) pts.shift();
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      if (dirty) ctx.clearRect(dirty.x0, dirty.y0, dirty.x1 - dirty.x0, dirty.y1 - dirty.y0);
      dirty = null;
      if (pts.length < 2) { running = pts.length > 0; if (running) requestAnimationFrame(frame); return; }

      ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'lighter';
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      const last = pts.length - 1;
      for (let i = 1; i <= last; i++) {
        const a = pts[i - 1], b = pts[i], k = 1 - (now - b.t) / life;
        if (k <= 0) continue;
        const c = colorAt(b.t);
        // butt caps avoid bright "beads" where segments overlap; only the head gets a round cap
        ctx.lineCap = i === last ? 'round' : 'butt';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = c;
        ctx.globalAlpha = 0.14 * k; ctx.lineWidth = 30 * k; ctx.stroke();   // outer glow
        ctx.globalAlpha = 0.42 * k; ctx.lineWidth = 15 * k; ctx.stroke();   // coloured body
        ctx.strokeStyle = '#fff'; ctx.globalAlpha = 0.45 * k; ctx.lineWidth = 4.5 * k; ctx.stroke(); // hot core
        if (a.x < x0) x0 = a.x; if (b.x < x0) x0 = b.x; if (a.x > x1) x1 = a.x; if (b.x > x1) x1 = b.x;
        if (a.y < y0) y0 = a.y; if (b.y < y0) y0 = b.y; if (a.y > y1) y1 = a.y; if (b.y > y1) y1 = b.y;
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      const pad = 30;
      dirty = { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
      requestAnimationFrame(frame);
    }
  }

  // ---------- Map (dark Leaflet map, no colour inversion) ----------
  function setupMap() {
    const el = $('map'), wrap = $('loc');
    if (!el || !window.L) return;
    // Only build the map (and download tiles) when it is about to scroll into view
    const lazy = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { lazy.disconnect(); buildMap(el, wrap); } }, { rootMargin: '600px 0px' });
    lazy.observe(el);
  }
  function buildMap(el, wrap) {
    const center = [44.4268, 26.1025]; // Piața Unirii, București
    const touch = matchMedia('(hover: none)').matches;
    const map = L.map(el, { center, zoom: 15, scrollWheelZoom: false, dragging: !touch, tap: false, zoomControl: false, attributionControl: true, maxZoom: 16 });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    // Esri "Dark Gray Canvas" basemap + labels: natively dark, free, no API key
    const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
    const attribution = 'Tiles &copy; <a href="https://www.esri.com">Esri</a> — Esri, HERE, Garmin, &copy; OpenStreetMap contributors';
    L.tileLayer(esri + 'World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, attribution }).addTo(map);
    L.tileLayer(esri + 'World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }).addTo(map);
    L.marker(center, { icon: L.divIcon({ className: '', html: '<div class="neon-pin"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }), keyboard: false }).addTo(map);
    // Scroll-zoom only after the user clicks the map, so page scrolling is never hijacked
    map.on('click', () => { map.scrollWheelZoom.enable(); wrap.classList.add('is-active'); });
    el.addEventListener('mouseleave', () => { map.scrollWheelZoom.disable(); wrap.classList.remove('is-active'); });
    // On desktop keep the pin visible to the right of the info card
    if (!touch && innerWidth > 720) map.panBy([-Math.min(200, innerWidth * 0.12), 0], { animate: false });
  }

  // ---------- Scroll reveal + active section ----------
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; e.target.style.filter = 'none'; io.unobserve(e.target); }
  }), { threshold: 0.1 });
  const secIo = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { state.active = e.target.id; renderDock(); }
  }), { rootMargin: '-45% 0px -50% 0px' });

  // Pause looping animations in sections that are off screen (saves GPU/CPU while scrolling)
  const pauseIo = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-offscreen', !e.isIntersecting)));
  ['acasa', 'oferta'].forEach(id => pauseIo.observe(document.getElementById(id)));
  pauseIo.observe($('marquee').parentElement);

  // Reveal the hero once its fonts are loaded (max 1.5s wait) — prevents the layout jump
  Promise.race([
    Promise.all(["700 1em 'Instrument Sans'", "400 1em 'Tilt Neon'"].map(f => document.fonts.load(f))),
    new Promise(r => setTimeout(r, 1500)),
  ]).catch(() => {}).then(() => document.documentElement.classList.remove('fonts-loading'));

  // ---------- Init ----------
  renderDock();
  renderProjects();
  renderTypeChips();
  renderFile();
  setupTrail();
  setupMap();

  // Scroll reveal. Runs synchronously (before first paint) and skips anything already on
  // screen at load, so nothing visible ever jumps. will-change is only kept while animating.
  const vh = innerHeight;
  root.querySelectorAll('[data-reveal]').forEach((el, i) => {
    if (el.getBoundingClientRect().top < vh * 0.95) return;
    const d = (i % 4) * 90;
    el.style.transition = `opacity 1.1s cubic-bezier(.2,.7,.2,1) ${d}ms, transform 1.1s cubic-bezier(.2,.7,.2,1) ${d}ms, filter 1.1s ${d}ms, box-shadow .4s, border-color .4s`;
    el.style.opacity = '0'; el.style.transform = 'translateY(56px) scale(.985)'; el.style.filter = 'blur(10px)';
    el.style.willChange = 'opacity, transform, filter';
    el.addEventListener('transitionend', function done(ev) {
      if (ev.target !== el || ev.propertyName !== 'opacity') return;
      el.style.willChange = ''; el.style.filter = ''; el.removeEventListener('transitionend', done);
    });
    io.observe(el);
  });
  ['acasa', 'proiecte', 'proces', 'tipar', 'oferta'].forEach(id => { const s = document.getElementById(id); if (s) secIo.observe(s); });
})();
