// Home hero behaviour (no library, see field.ts for the bead simulation).
// - The brand word opens ("Say" | "Smile") and beads gather between the words into a tooth.
// - Pointer: beads move aside and spring back; the letters lift a little under the pointer.
// - Click or tap on the sculpture, or the Tooth / Smile switch: the beads rebuild the other shape.
// - Idle on desktop: the shape changes by itself every few seconds (the pause button stops it).
// - Scroll: beads spread out and fade while the hero leaves.
// - Phones: beads gather once and then rest; they move only when touched.
// - Reduced motion: a still picture; the switch still works, the Play button turns motion on.
import { createField, type FieldColors } from './field';

// `force` runs the full animation even when the system asks for reduced motion (the visitor pressed Play).
export function initHero(force = false) {
  const root = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = root?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const slot = root?.querySelector<HTMLElement>('[data-hero-slot]');
  if (!root || !canvas || !slot) return;

  const reduced = !force && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 768px)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const colors = (): FieldColors => {
    const s = getComputedStyle(root);
    return {
      a: s.getPropertyValue('--bead-a').trim() || '#3f5a38',
      b: s.getPropertyValue('--bead-b').trim() || '#846652',
      c: s.getPropertyValue('--bead-c').trim() || '#ffffff',
    };
  };

  const field = createField(canvas, mobile ? 1800 : 4400, colors());
  if (!field) return;

  // The sculpture sits in the slot between the two words, so the page layout decides its place.
  const place = () => {
    const r = root.getBoundingClientRect();
    const s = slot.getBoundingClientRect();
    field.resize(r.width, r.height);
    field.place(s.left - r.left + s.width / 2, s.top - r.top + s.height * 0.5, s.width * 0.98);
  };
  place();

  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-shape]')];
  const mark = () => buttons.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.shape) === field.shape)));
  let lastInput = performance.now();
  const show = (i: number) => {
    field.setShape(i);
    if (reduced) field.still();
    mark();
    lastInput = performance.now();
  };
  buttons.forEach((b) => b.addEventListener('click', () => show(Number(b.dataset.shape))));
  mark();

  new MutationObserver(() => field.setColors(colors()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const pauseBtn = root.querySelector<HTMLButtonElement>('[data-pause]');

  if (reduced) {
    field.still();
    addEventListener('resize', () => { if (root.classList.contains('is-animated')) return; place(); field.still(); });
    // The system asks for less motion, so the scene starts still. The same button becomes Play:
    // one press turns the full animation on for this visit.
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', 'true');
      pauseBtn.setAttribute('aria-label', pauseBtn.dataset.labelPlay || '');
      pauseBtn.addEventListener('click', () => {
        pauseBtn.setAttribute('aria-pressed', 'false');
        pauseBtn.setAttribute('aria-label', pauseBtn.dataset.labelPause || '');
        root.classList.add('is-animated');
        initHero(true);
      }, { once: true });
    }
    return;
  }

  let paused = false;
  let visible = true;
  const run = () => { if (!paused && visible) field.start(!mobile); };

  pauseBtn?.addEventListener('click', () => {
    paused = !paused;
    root.classList.toggle('is-paused', paused);
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.setAttribute('aria-label', (paused ? pauseBtn.dataset.labelPlay : pauseBtn.dataset.labelPause) || '');
    if (paused) field.stop(); else run();
  });

  // --- intro: the word opens (CSS) while the beads fly in and gather between the two halves ---
  field.gather();
  run();
  addEventListener('resize', place);

  // --- pointer ---
  const rel = (e: PointerEvent) => { const r = root.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, in: e.clientY < r.bottom }; };
  const letters = [...root.querySelectorAll<HTMLElement>('.hero__ch')];
  let lift = 0;
  addEventListener('pointermove', (e) => {
    const p = rel(e);
    field.pointer(p.x, p.y, p.in && !paused);
    lastInput = performance.now();
    if (!fine || paused || lift) return;
    lift = requestAnimationFrame(() => {
      lift = 0;
      letters.forEach((el) => {
        const b = el.getBoundingClientRect();
        const dx = e.clientX - (b.left + b.width / 2);
        const dy = e.clientY - (b.top + b.height / 2);
        const k = Math.exp(-(dx * dx + dy * dy) / (2 * 140 * 140));
        el.style.transform = k > 0.02 ? `translateY(${(-k * 22).toFixed(1)}px)` : '';
      });
    });
  }, { passive: true });
  addEventListener('pointerleave', () => field.pointer(0, 0, false));
  document.documentElement.addEventListener('pointerleave', () => field.pointer(0, 0, false));
  addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') field.pointer(0, 0, false); }, { passive: true });

  // press on the sculpture: the beads jump apart and rebuild the other shape
  addEventListener('pointerdown', (e) => {
    if (paused || (e.target as HTMLElement).closest('a, button, header, footer')) return;
    const p = rel(e);
    if (!p.in) return;
    field.burst(p.x, p.y);
    if (field.hit(p.x, p.y)) show(field.shape + 1);
    lastInput = performance.now();
  }, { passive: true });

  // --- idle: on desktop the shape changes by itself when nobody is touching it ---
  if (!mobile) setInterval(() => {
    if (paused || !visible || document.hidden || performance.now() - lastInput < 6000) return;
    field.setShape(field.shape + 1);
    mark();
  }, 7000);

  // --- scroll: beads spread and fade, the copy under the word lets go ---
  const under = root.querySelector<HTMLElement>('[data-hero-under]');
  let ticking = 0;
  const onScroll = () => {
    if (ticking) return;
    ticking = requestAnimationFrame(() => {
      ticking = 0;
      const p = Math.max(0, Math.min(1, scrollY / (root.offsetHeight * 0.75)));
      field.setScatter(p);
      root.style.setProperty('--away', p.toFixed(3));
      if (under) under.style.opacity = String(Math.max(0, 1 - p * 1.6));
    });
  };
  addEventListener('scroll', onScroll, { passive: true });

  new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
    if (visible) run(); else field.stop();
  }).observe(root);
}
