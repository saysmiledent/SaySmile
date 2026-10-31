// Hero behaviour (GSAP).
// - Cursor x -> yaw (9 photo angles cut from the doctor's video), cursor y -> looks down
// - Whole stage tilts in 3D toward the cursor; background shapes drift by depth
// - Idle: gentle auto-sway. Touch: drag/touch moves the gaze.
// - Scroll: stage shrinks and rises, title letters spread, copy fades.
// - Reduced motion: static centre frame, no listeners.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createRelief, type Relief } from './hero3d';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const root = document.querySelector<HTMLElement>('[data-hero]');
  if (!root) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 768px)').matches;
  const stage = root.querySelector<HTMLElement>('[data-hero-stage]')!;
  const tilt = root.querySelector<HTMLElement>('[data-hero-tilt]')!;
  const yawFrames = [...root.querySelectorAll<HTMLImageElement>('[data-yaw]')]
    .sort((a, b) => Number(a.dataset.yaw) - Number(b.dataset.yaw));
  const down = root.querySelector<HTMLImageElement>('[data-pitch="down"]')!;
  const chars = root.querySelectorAll<HTMLElement>('.hero__ch');
  const blobs = root.querySelectorAll<HTMLElement>('.blob');
  const copy = root.querySelector<HTMLElement>('[data-hero-copy]');

  const surface = root.querySelector<HTMLElement>('[data-relief]')!;
  const reliefCfg = JSON.parse(surface.dataset.relief || '{}') as { depth: string[]; down: string };
  let relief: Relief | null = null;
  let visible = true;
  const glState = { mix: 0, down: 0, rotX: 0, rotY: 0, lightX: 0, lightY: 0, time: 0 };

  const mid = (yawFrames.length - 1) / 2;
  if (reduced) { yawFrames.forEach((f, i) => (f.style.opacity = i === mid ? '1' : '0')); return; }

  // Gaze state, -1..1 (x: left..right, y: up..down). Smoothed with GSAP.
  const gaze = { x: 0, y: 0 };
  const setX = gsap.quickTo(gaze, 'x', { duration: 0.55, ease: 'power3.out', onUpdate: render });
  const setY = gsap.quickTo(gaze, 'y', { duration: 0.55, ease: 'power3.out', onUpdate: render });

  const tiltY = gsap.quickSetter(tilt, 'rotationY', 'deg');
  const tiltX = gsap.quickSetter(tilt, 'rotationX', 'deg');
  const shiftX = gsap.quickSetter(tilt, 'x', 'px');
  const maxTilt = mobile ? 4 : 9;
  const maxShift = mobile ? 6 : 16;

  function render() {
    // yaw position 0..N-1 across the photos (centre = middle one)
    const n = yawFrames.length;
    const p = ((gaze.x + 1) / 2) * (n - 1);
    const i = Math.min(n - 2, Math.floor(p));
    // Snap towards the nearest photo: short cross-fades keep the head from ghosting
    const raw = p - i;
    const f = Math.min(1, Math.max(0, (raw - 0.42) / 0.16));
    yawFrames.forEach((img, k) => {
      img.style.opacity = k === i ? '1' : k === i + 1 ? String(f) : '0';
    });
    glState.mix = f * f * (3 - 2 * f);
    // look-down frame fades in on top near the centre yaw, with a dead zone so a cursor at eye level shows no ghosting
    const centre = Math.max(0, 1 - Math.abs(gaze.x) * 2.2);
    const dz = (v: number) => { const k = Math.min(1, Math.max(0, (Math.abs(v) - 0.5) / 0.35)); return k * k * (3 - 2 * k); };
    const downAmt = gaze.y > 0 ? dz(gaze.y) * centre : 0;
    down.style.opacity = String(downAmt);
    glState.down = downAmt;
    glState.rotY = gaze.x * 0.3;
    glState.rotX = gaze.y * 0.16;
    glState.lightX = gaze.x;
    glState.lightY = gaze.y;
    if (relief) relief.setFrames(i, i + 1);

    // The photos already turn the head; keep the 3D tilt subtle and in the same direction
    if (!relief) {
      tiltY(gaze.x * maxTilt);
      tiltX(-gaze.y * maxTilt * 0.6);
      shiftX(gaze.x * maxShift);
    }
    blobs.forEach((b, k) => {
      const d = Number(b.dataset.depth || 1) * (k % 2 ? -1 : 1);
      b.style.transform = `translate3d(${-gaze.x * 26 * d}px, ${-gaze.y * 18 * d}px, 0)`;
    });
  }

  // --- input: pointer position relative to the stage centre ---
  let lastInput = performance.now();
  const aim = (cx: number, cy: number) => {
    const r = stage.getBoundingClientRect();
    const x = (cx - (r.left + r.width / 2)) / (innerWidth * 0.5);
    const y = (cy - (r.top + r.height * 0.3)) / (innerHeight * 0.5);
    setX(Math.max(-1, Math.min(1, x)));
    setY(Math.max(-1, Math.min(1, y)));
    lastInput = performance.now();
  };
  addEventListener('pointermove', (e) => aim(e.clientX, e.clientY), { passive: true });
  addEventListener('pointerdown', (e) => aim(e.clientX, e.clientY), { passive: true });

  // --- spotlight follows the pointer; the big brand letters bulge up toward it ---
  const letters = [...chars].map((el) => ({
    el,
    y: gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' }),
    s: gsap.quickTo(el, 'scaleY', { duration: 0.45, ease: 'power3.out' }),
  }));
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      root.style.setProperty('--mx', `${e.clientX - r.left}px`);
      root.style.setProperty('--my', `${e.clientY - r.top}px`);
      if (r.bottom < 0) return;
      letters.forEach((l) => {
        const b = l.el.getBoundingClientRect();
        const dx = e.clientX - (b.left + b.width / 2);
        const dy = e.clientY - (b.top + b.height / 2);
        const k = Math.exp(-(dx * dx + dy * dy) / (2 * 150 * 150));
        l.y(-k * 34);
        l.s(1 + k * 0.16);
      });
    }, { passive: true });
  }

  // --- live 3D relief (WebGL). Falls back to the photo stack above when unavailable ---
  const colorUrls = yawFrames.map((f) => f.currentSrc || f.src);
  createRelief(surface, colorUrls, reliefCfg.depth, down.currentSrc || down.src, reliefCfg.down, 600 / 720)
    .then((r) => {
      if (!r) return;
      relief = r;
      root.classList.add('is-gl');
      tiltY(0); tiltX(0); shiftX(0);
      render();
      addEventListener('resize', () => r.resize());
    })
    .catch(() => {});
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(root);
  gsap.ticker.add((time) => {
    if (!relief || !visible) return;
    glState.time = time;
    relief.render(glState);
  });

  // --- idle sway when nobody is moving the pointer (also what phones see) ---
  gsap.ticker.add((time) => {
    if (performance.now() - lastInput < 2500) return;
    setX(Math.sin(time * 0.6) * 0.55);
    setY(Math.sin(time * 0.4 + 1) * 0.15);
  });

  // --- intro ---
  gsap.from(chars, { yPercent: 40, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.07 });
  gsap.from(stage, { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.15 });
  gsap.from(root.querySelectorAll('.glass'), { opacity: 0, scale: 0.8, y: 24, duration: 0.9, delay: 1, stagger: 0.18, ease: 'back.out(1.6)' });
  if (copy) gsap.from(copy.children, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 0.5 });

  // --- scroll: the scene recedes ---
  const st = { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 };
  gsap.to(stage, { scale: 0.82, yPercent: -6, ease: 'none', scrollTrigger: st });
  gsap.to(chars, {
    yPercent: (i) => -20 - i * 6, ease: 'none', scrollTrigger: st,
  });
  if (copy) gsap.to(copy, { opacity: 0, y: -40, ease: 'none', scrollTrigger: { ...st, end: 'bottom 60%' } });

  render();
}
