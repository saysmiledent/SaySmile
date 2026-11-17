// Home page behaviour (no library). Sections: Preloader, Hero, Why, Services, Feature, Doctor, Ask.
// - Loader: real progress (tooth model + fonts), once per session, then one page-load entrance.
// - Two particle molars (hero, ask): drift and shed ink by themselves; the pointer parts them.
// - Scroll: headings rise word by word, the services rail travels sideways, the big photo opens,
//   the about paragraph darkens word by word, figures count up.
// - Statement: on desktop the pointer leaves a short trail of result photos.
// - Reduced motion: no loader, no entrances, nothing moves by itself; the pointer still parts the molars
//   and scrolling still drives the rail (it is the visitor's own movement).
import { createMolar, loadMolar, type MolarScene } from './molar';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 768px)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;
const rtl = root.dir === 'rtl';
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const $$ = <T extends HTMLElement = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

const molarColors = () => {
  const s = getComputedStyle(root);
  return [0, 1, 2, 3, 4, 5].map((i) => s.getPropertyValue(`--m${i}`).trim() || '#5c7a54');
};

// where each tooth stands inside its canvas
const layouts: Record<string, (w: number, h: number) => [number, number, number]> = {
  hero: (w, h) => (w < 860 ? [w * 0.5, h * 0.76, h * 0.5] : [w * (rtl ? 0.3 : 0.69), h * 0.47, h * 1.02]),
  ask: (w, h) => (w < 860 ? [w * 0.5, h * 0.3, h * 0.42] : [w * (rtl ? 0.62 : 0.38), h * 0.58, h * 0.95]),
};

async function molars() {
  const scenes: { el: HTMLCanvasElement; scene: MolarScene; host: HTMLElement; kind: string }[] = [];
  for (const el of $$<HTMLCanvasElement>('canvas[data-molar]')) {
    const kind = el.dataset.molar || 'hero';
    const big = kind === 'hero';
    const scene = await createMolar(el, el.dataset.src || '', {
      points: mobile ? (big ? 9000 : 6000) : big ? 24600 : 12000,
      ink: mobile ? (big ? 2200 : 1200) : big ? 7000 : 3000,
      auto: !reduced,
    }, molarColors()).catch(() => null);
    if (!scene) continue;
    const host = el.parentElement!;
    const place = () => { scene.resize(); const r = el.getBoundingClientRect(); scene.place(...layouts[kind](r.width, r.height)); };
    place();
    addEventListener('resize', place);
    new IntersectionObserver((e) => (e[0].isIntersecting ? scene.start() : scene.stop())).observe(el);
    scenes.push({ el, scene, host, kind });
  }
  new MutationObserver(() => { const c = molarColors(); scenes.forEach((s) => s.scene.setColors(c)); })
    .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  const move = (e: PointerEvent) => {
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect();
      const inside = e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.right;
      s.scene.pointer(e.clientX - r.left, e.clientY - r.top, inside);
    }
  };
  addEventListener('pointermove', move, { passive: true });
  addEventListener('pointerdown', move, { passive: true });
  addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') scenes.forEach((s) => s.scene.pointer(-1e4, -1e4, false)); }, { passive: true });
  document.addEventListener('pointerleave', () => scenes.forEach((s) => s.scene.pointer(-1e4, -1e4, false)));
}

// ---------- loader: real progress, then the page-load entrance ----------
function loader(ready: Promise<unknown>) {
  const el = document.querySelector<HTMLElement>('[data-loader]');
  const fill = el?.querySelector<SVGElement>('[data-loader-fill]');
  const pct = el?.querySelector<HTMLElement>('[data-loader-pct]');
  const open = () => {
    root.classList.add('is-loaded');
    setTimeout(() => root.classList.add('is-ready'), root.classList.contains('no-loader') ? 0 : 450);
    try { sessionStorage.setItem('ss-loaded', '1'); } catch { /* private mode */ }
  };
  if (!el || root.classList.contains('no-loader')) { ready.finally(open); return; }
  let target = 8, shown = 0, done = false;
  const tick = () => {
    if (!done) target = Math.min(85, target + 0.35);       // creeps while files arrive
    shown += (target - shown) * 0.12;
    const v = Math.round(shown);
    if (pct) pct.textContent = `${v}%`;
    fill?.style.setProperty('--p', String(v));
    if (done && v >= 99) { if (pct) pct.textContent = '100%'; setTimeout(open, 160); return; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const finish = () => { done = true; target = 100; };
  ready.then(finish, finish);
  setTimeout(finish, 3500); // never keep anyone waiting on a slow network
}

// ---------- headings rise word by word, blocks fade up ----------
function reveals() {
  $$('[data-h-lines]').forEach((el) => {
    const words = (el.textContent || '').trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const o = document.createElement('span'); o.className = 'hw';
      const n = document.createElement('span'); n.textContent = w; n.style.setProperty('--i', String(i));
      o.append(n); el.append(o); if (i < words.length - 1) el.append(' ');
    });
  });
  const io = new IntersectionObserver((list) => list.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });
  // siblings that appear together are staggered a little
  $$('[data-h-rise]').forEach((el) => {
    const sib = [...(el.parentElement?.children || [])].filter((c) => c.hasAttribute('data-h-rise'));
    el.style.setProperty('--rd', `${Math.max(0, sib.indexOf(el)) * 0.08}s`);
    io.observe(el);
  });
  $$('[data-h-lines]').forEach((el) => io.observe(el));
}

// ---------- figures count up once ----------
function counters() {
  const lang = root.lang.startsWith('fa') ? 'fa-IR' : root.lang.startsWith('ru') ? 'ru-RU' : 'en-US';
  const io = new IntersectionObserver((list) => list.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target as HTMLElement;
    const to = Number(el.dataset.count);
    const t0 = performance.now();
    const run = (now: number) => {
      const k = clamp((now - t0) / 1300);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString(lang, { useGrouping: false });
      if (k < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => { if (el.dataset.count) io.observe(el); });
}

// ---------- scroll-driven pieces ----------
function scrollScenes() {
  const rail = document.querySelector<HTMLElement>('[data-h-rail]');
  const pin = rail?.querySelector<HTMLElement>('[data-h-rail-pin]');
  const track = rail?.querySelector<HTMLElement>('[data-h-rail-track]');
  const grow = document.querySelector<HTMLElement>('[data-h-grow]');
  const read = document.querySelector<HTMLElement>('[data-h-read]');
  let distance = 0;
  let words: HTMLElement[] = [];

  if (read && !reduced) {
    const text = (read.textContent || '').trim().split(/\s+/);
    read.textContent = '';
    words = text.map((w, i) => {
      const s = document.createElement('span'); s.className = 'rw'; s.textContent = w;
      read.append(s); if (i < text.length - 1) read.append(' ');
      return s;
    });
    read.classList.add('is-reading');
  }

  const measure = () => {
    if (!rail || !pin || !track) return;
    if (mobile) { rail.style.height = ''; track.style.transform = ''; distance = 0; return; }
    distance = Math.max(0, track.scrollWidth - innerWidth);
    rail.style.height = `${pin.offsetHeight + distance}px`;
  };

  let raf = 0;
  const update = () => {
    raf = 0;
    if (rail && track && distance > 0) {
      const p = clamp(-rail.getBoundingClientRect().top / distance);
      track.style.transform = `translate3d(${(rtl ? 1 : -1) * p * distance}px,0,0)`;
    }
    if (grow && !reduced) {
      const r = grow.getBoundingClientRect();
      grow.style.setProperty('--g', clamp((innerHeight - r.top) / (innerHeight * 0.85)).toFixed(3));
    }
    if (read && words.length) {
      const r = read.getBoundingClientRect();
      const p = clamp((innerHeight * 0.88 - r.top) / (r.height + innerHeight * 0.4));
      const lit = p * (words.length + 3);
      words.forEach((w, i) => w.style.setProperty('--o', (0.2 + 0.8 * clamp(lit - i)).toFixed(2)));
    }
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  measure(); update();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); update(); });
  // images and fonts change the track width after load
  addEventListener('load', () => { measure(); update(); });
}

// ---------- statement: a short trail of result photos follows the pointer ----------
function trail() {
  const sec = document.querySelector<HTMLElement>('[data-h-why]');
  if (!sec || !fine || reduced) return;
  const pics: string[] = JSON.parse(sec.dataset.trail || '[]');
  if (!pics.length) return;
  pics.forEach((src) => { const i = new Image(); i.src = src; });   // warm the cache
  let k = 0, lx = -999, ly = -999, live = 0;
  sec.addEventListener('pointermove', (e) => {
    const r = sec.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (Math.hypot(x - lx, y - ly) < 120 || live > 5) return;
    lx = x; ly = y; live++;
    const img = document.createElement('img');
    img.className = 'h-trail'; img.alt = ''; img.src = pics[k++ % pics.length];
    img.style.left = `${x}px`; img.style.top = `${y}px`;
    img.style.rotate = `${(Math.random() - 0.5) * 10}deg`;
    img.addEventListener('animationend', () => { img.remove(); live--; });
    sec.append(img);
  }, { passive: true });
}

// ---------- ask form: opens the messenger with the message filled in ----------
function form() {
  const f = document.querySelector<HTMLFormElement>('[data-h-form]');
  if (!f) return;
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(f);
    const val = (k: string) => String(d.get(k) || '').trim();
    const msg = (f.dataset.msg || '')
      .replace('{name}', val('name')).replace('{phone}', val('phone') || '-').replace('{question}', val('question'));
    const via = (e.submitter as HTMLButtonElement | null)?.value;
    const url = via === 'whatsapp'
      ? `https://wa.me/${f.dataset.wa}?text=${encodeURIComponent(msg)}`
      : `${f.dataset.tg}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  });
}

export function initHome() {
  const first = $$<HTMLCanvasElement>('canvas[data-molar]')[0];
  const model = first?.dataset.src ? loadMolar(first.dataset.src) : Promise.resolve();
  const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready ?? Promise.resolve();
  loader(Promise.all([model, fonts]));
  molars();
  reveals();
  counters();
  scrollScenes();
  trail();
  form();
}
