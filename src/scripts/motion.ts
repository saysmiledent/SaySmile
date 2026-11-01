// SaySmile motion system (GSAP + ScrollTrigger + Lenis). One entry point for every page.
// Markup contract (all optional, combine freely):
//   data-split[="chars"]      text rises word by word (letters by letter, never in Farsi: letters must stay joined)
//   data-reveal[="left|right|scale|clip"]  fade/slide in; inside [data-reveal-group] children stagger
//   data-parallax="0.2"       vertical drift while scrolling (desktop)
//   data-mdepth="1.2"         shifts with the pointer; larger = nearer
//   data-tilt[="flat"]        3D tilt + light glare following the pointer (flat = glare only)
//   data-magnetic="0.3"       element leans toward the pointer
//   data-counter="9"          counts up when visible
//   data-marquee="1"          endless ticker; reacts to scroll speed
//   data-stack                children pin and stack like cards while scrolling
//   data-draw                 line that draws itself with scroll; data-activate lights items as it passes
//   data-cursor="label"       big cursor bubble with a label over this element
// Reduced motion: nothing moves, everything is visible. Touch: no cursor/tilt, lighter distances.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const doc = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const mobile = matchMedia('(max-width: 768px)').matches;
const rtl = doc.dir === 'rtl';
// Motion energy (DESIGN.md): home page high, inner pages medium, mobile light.
const home = !!document.querySelector('[data-hero]');
const energy = mobile ? 1 : home ? 3 : 2;
const lang = doc.lang;

export let lenis: Lenis | null = null;

const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  [...root.querySelectorAll<T>(sel)];

export function initMotion() {
  progressBar();
  pageTransition();
  header();
  if (reduced) {
    $$('[data-split]').forEach((e) => e.classList.add('is-split'));
    $$('[data-reveal]').forEach((e) => e.classList.add('is-in'));
    $$('[data-counter]').forEach((e) => (e.textContent = fmt(Number(e.dataset.counter))));
    $$('[data-draw]').forEach((e) => (e.style.transform = 'scaleY(1)'));
    $$('[data-activate]').forEach((e) => e.classList.add('is-on'));
    return;
  }
  smoothScroll();
  splitText();
  reveals();
  parallax();
  stacks();
  timeline();
  counters();
  marquees();
  if (fine) { cursor(); tilt(); magnetic(); mouseDepth(); }
}

const fmt = (n: number) => n.toLocaleString(lang === 'fa' ? 'fa-IR' : lang === 'ru' ? 'ru-RU' : 'en-US');

/* ------------------------------------------------------------------ smooth scroll */
function smoothScroll() {
  if (mobile) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 });
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // in-page anchors glide too
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const target = document.querySelector(a.getAttribute('href')!);
    if (target) { e.preventDefault(); lenis!.scrollTo(target as HTMLElement, { offset: -80 }); }
  });
}

/* ------------------------------------------------------------------ progress bar */
function progressBar() {
  const bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  const update = () => {
    const max = doc.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

/* ------------------------------------------------------------------ page transition (curtain) */
function pageTransition() {
  const pt = document.querySelector<HTMLElement>('.pt');
  if (!pt || reduced) return;
  const clear = () => { doc.classList.remove('pt-in'); gsap.set(pt, { clearProps: 'clipPath' }); };

  if (doc.classList.contains('pt-in')) {
    gsap.fromTo(pt, { clipPath: 'inset(0% 0 0 0)' },
      { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power4.inOut', delay: 0.1, onComplete: clear });
  }
  addEventListener('pageshow', (e) => { if (e.persisted) clear(); });

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol.startsWith('mailto') || url.protocol.startsWith('tel')) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // same page / hash
    e.preventDefault();
    try { sessionStorage.setItem('saysmile-pt', '1'); } catch { /* ignore */ }
    lenis?.stop();
    gsap.fromTo(pt, { clipPath: 'inset(100% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)', duration: 0.6, ease: 'power4.inOut',
      onComplete: () => { location.href = url.href; },
    });
    setTimeout(() => { location.href = url.href; }, 1600); // safety
  });
}

/* ------------------------------------------------------------------ smart floating header */
function header() {
  const h = document.querySelector<HTMLElement>('.header');
  if (!h) return;
  let last = scrollY;
  const onScroll = () => {
    const y = scrollY;
    h.classList.toggle('is-solid', y > 24);
    h.style.setProperty('--hp', String(Math.min(1, y / 260)));
    const open = doc.classList.contains('menu-open');
    h.classList.toggle('is-hidden', !open && y > 360 && y > last + 4);
    if (y < last - 4 || y < 360) h.classList.remove('is-hidden');
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ------------------------------------------------------------------ split text */
function splitText() {
  $$('[data-split]').forEach((el) => {
    const mode = el.dataset.split;
    const text = (el.textContent || '').trim();
    if (!text) { el.classList.add('is-split'); return; }
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const letters = mode === 'chars' && lang !== 'fa' && energy > 1;
    text.split(/\s+/).forEach((word, i, all) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.className = 'wi';
      if (letters) {
        [...word].forEach((c) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; inner.append(s); });
        inner.style.display = 'inline-block';
      } else inner.textContent = word;
      w.append(inner);
      el.append(w);
      if (i < all.length - 1) el.append(' ');
    });
    const parts = letters ? $$('.ch', el) : $$('.wi', el);
    gsap.set(parts, { yPercent: 118 });
    el.classList.add('is-split');
    gsap.to(parts, {
      yPercent: 0, duration: letters ? 0.9 : energy === 1 ? 0.6 : 1.05, ease: 'power4.out',
      stagger: letters ? (energy === 3 ? 0.03 : 0.022) : energy === 1 ? 0.035 : 0.06, delay: Number(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 94%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ reveals */
function reveals() {
  const dist = energy === 1 ? 14 : energy === 2 ? 32 : 46;
  const dur = energy === 1 ? 0.5 : energy === 2 ? 0.85 : 1;
  const from = (kind: string | null): gsap.TweenVars => {
    const s = rtl ? -1 : 1;
    if (kind === 'left') return { x: -dist * 1.6 * s };
    if (kind === 'right') return { x: dist * 1.6 * s };
    if (kind === 'scale') return { scale: 0.88, y: dist * 0.5 };
    if (kind === 'clip') return { clipPath: 'inset(0 0 100% 0)', scale: 1.08 };
    return { y: dist };
  };
  const to = (kind: string | null): gsap.TweenVars =>
    kind === 'clip' ? { clipPath: 'inset(0 0 0% 0)', scale: 1 } : { x: 0, y: 0, scale: 1 };
  const mark = (el: Element) => el.classList.add('is-in');

  $$('[data-reveal-group]').forEach((group) => {
    const items = $$('[data-reveal]', group);
    items.forEach((i) => i.setAttribute('data-reveal-done', ''));
    gsap.set(items, { opacity: 0, ...from(null) });
    items.forEach(mark);
    gsap.to(items, {
      opacity: 1, ...to(null), duration: dur, ease: 'power3.out', stagger: energy === 1 ? 0.05 : energy === 2 ? 0.09 : 0.11,
      scrollTrigger: { trigger: group, start: 'top 86%', once: true },
    });
  });

  $$('[data-reveal]:not([data-reveal-done])').forEach((el) => {
    const kind = el.dataset.reveal || null;
    gsap.set(el, { opacity: 0, ...from(kind) });
    mark(el);
    gsap.to(el, {
      opacity: 1, ...to(kind), duration: dur, ease: 'power3.out', delay: Number(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ parallax */
function parallax() {
  if (mobile) return;
  $$('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.2') * (home ? 1 : 0.55);
    gsap.fromTo(el, { yPercent: speed * 60 }, {
      yPercent: -speed * 60, ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ------------------------------------------------------------------ pointer: depth, tilt, magnet, cursor */
function mouseDepth() {
  const items = $$('[data-mdepth]').map((el) => ({
    d: Number(el.dataset.mdepth || 1),
    x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
  }));
  if (!items.length) return;
  addEventListener('pointermove', (e) => {
    const nx = e.clientX / innerWidth - 0.5;
    const ny = e.clientY / innerHeight - 0.5;
    items.forEach((i) => { const k = home ? 1 : 0.5; i.x(-nx * 44 * i.d * k); i.y(-ny * 32 * i.d * k); });
  }, { passive: true });
}

function tilt() {
  $$('[data-tilt]').forEach((el) => {
    const flat = el.dataset.tilt === 'flat';
    const max = Number(el.dataset.tiltMax || 7);
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
      if (flat) return;
      gsap.to(el, {
        rotationY: (px - 0.5) * max * 2, rotationX: -(py - 0.5) * max * 2,
        transformPerspective: 900, duration: 0.5, ease: 'power3.out', overwrite: 'auto',
      });
    });
    el.addEventListener('pointerleave', () => {
      if (!flat) gsap.to(el, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'elastic.out(1,0.6)', overwrite: 'auto' });
    });
  });
}

function magnetic() {
  $$('[data-magnetic]').forEach((el) => {
    const k = Number(el.dataset.magnetic || 0.3);
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = Math.max(r.width, r.height) * 0.9;
      if (Math.hypot(dx, dy) < reach) { x(dx * k); y(dy * k); } else { x(0); y(0); }
    }, { passive: true });
  });
}

function cursor() {
  const c = document.createElement('div');
  c.className = 'cursor';
  c.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'cursor__label';
  c.append(label);
  document.body.append(c);
  const x = gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3.out' });
  addEventListener('pointermove', (e) => {
    x(e.clientX); y(e.clientY);
    c.classList.add('is-on');
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, summary, input[type="range"], [data-doc]');
    const on = !!t;
    const text = t?.dataset.cursor ?? '';
    c.classList.toggle('is-link', on);
    c.classList.toggle('is-label', on && !!text && !t!.closest('.header'));
    label.textContent = c.classList.contains('is-label') ? text : '';
  }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.remove('is-on'));
  addEventListener('pointerdown', () => c.classList.add('is-down'));
  addEventListener('pointerup', () => c.classList.remove('is-down'));
}

/* ------------------------------------------------------------------ counters */
function counters() {
  $$('[data-counter]').forEach((el) => {
    const end = Number(el.dataset.counter);
    const o = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(o, {
      v: end, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(Math.round(o.v)); },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ marquee, faster when you scroll */
function marquees() {
  $$('[data-marquee]').forEach((m) => {
    const track = m.querySelector<HTMLElement>('.marquee__track');
    if (!track) return;
    for (let i = 0; i < 2; i++) { const c = track.cloneNode(true) as HTMLElement; c.setAttribute('aria-hidden', 'true'); m.append(c); }
    const dir = Number(m.dataset.marquee) < 0 ? -1 : 1;
    const tween = gsap.to($$('.marquee__track', m), {
      xPercent: dir > 0 ? -100 : 100, repeat: -1, duration: Number(m.dataset.speed || 28), ease: 'none',
    });
    if (dir < 0) tween.progress(0.5);
    ScrollTrigger.create({
      trigger: m, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity() / 400;
        gsap.to(tween, { timeScale: (v > 0 ? 1 : -1) * Math.min(6, 1 + Math.abs(v)), duration: 0.2, overwrite: true });
        gsap.to(tween, { timeScale: 1, duration: 0.9, delay: 0.2, overwrite: false });
      },
    });
  });
}

/* ------------------------------------------------------------------ sticky card stacks */
function stacks() {
  $$('[data-stack]').forEach((box) => {
    const items = [...box.children] as HTMLElement[];
    items.forEach((item, i) => {
      const next = items[i + 1];
      if (!next || mobile) return;
      const inner = (item.firstElementChild as HTMLElement) || item;
      gsap.to(inner, {
        scale: 0.93, opacity: 0.55, ease: 'none',
        scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 18%', scrub: true },
      });
    });
  });
}

/* ------------------------------------------------------------------ self-drawing timeline */
function timeline() {
  $$('[data-draw]').forEach((line) => {
    const host = line.parentElement!;
    gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1, ease: 'none', transformOrigin: 'top',
      scrollTrigger: { trigger: host, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 },
    });
  });
  $$('[data-activate]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 62%',
      onEnter: () => el.classList.add('is-on'),
      onLeaveBack: () => el.classList.remove('is-on'),
    });
  });
}
