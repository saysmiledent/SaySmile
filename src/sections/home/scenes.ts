// Particle molar scenes on any page: every <canvas data-molar="hero|ask|page" data-src="…molar.bin">.
// Each kind has its own place for the tooth; colours follow the theme; the pointer parts the cloud.
import { createMolar, type MolarScene } from './molar';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 768px)').matches;
const root = document.documentElement;
const rtl = root.dir === 'rtl';

const molarColors = () => {
  const s = getComputedStyle(root);
  return [0, 1, 2, 3, 4, 5].map((i) => s.getPropertyValue(`--m${i}`).trim() || '#5c7a54');
};

// where each tooth stands inside its canvas: centre x, centre y, height (CSS px)
const layouts: Record<string, (w: number, h: number) => [number, number, number]> = {
  hero: (w, h) => (w < 860 ? [w * 0.52, h * 0.8, h * 0.46] : [w * (rtl ? 0.3 : 0.69), h * 0.47, h * 1.02]),
  ask: (w, h) => (w < 860 ? [w * 0.5, h * 0.22, h * 0.4] : [w * (rtl ? 0.44 : 0.56), h * 0.55, h * 0.95]),
  // inner page headers: the tooth stands at the far end and runs past the bottom edge
  page: (w, h) => (w < 860 ? [w * (rtl ? 0.12 : 0.88), h * 0.62, h * 0.95] : [w * (rtl ? 0.17 : 0.83), h * 0.62, h * 1.35]),
};
const sizes: Record<string, [number, number, number, number]> = {
  // desktop points, ink, phone points, ink
  hero: [24600, 7000, 9000, 2200],
  ask: [12000, 3000, 6000, 1200],
  page: [12000, 3200, 5000, 900],
};

export async function initMolars() {
  const scenes: { el: HTMLCanvasElement; scene: MolarScene }[] = [];
  for (const el of [...document.querySelectorAll<HTMLCanvasElement>('canvas[data-molar]')]) {
    const kind = el.dataset.molar && layouts[el.dataset.molar] ? el.dataset.molar : 'hero';
    const [p, i, pm, im] = sizes[kind];
    const scene = await createMolar(el, el.dataset.src || '', { points: mobile ? pm : p, ink: mobile ? im : i, auto: !reduced }, molarColors()).catch(() => null);
    if (!scene) continue;
    const place = () => { scene.resize(); const r = el.getBoundingClientRect(); scene.place(...layouts[kind](r.width, r.height)); };
    place();
    addEventListener('resize', place);
    new IntersectionObserver((e) => (e[0].isIntersecting ? scene.start() : scene.stop())).observe(el);
    scenes.push({ el, scene });
  }
  if (!scenes.length) return;
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
