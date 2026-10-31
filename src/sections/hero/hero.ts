// Hero behaviour (GSAP).
// - Cursor x -> yaw (5 photo angles, cross-faded), cursor y -> pitch (looks up/down)
// - Whole stage tilts in 3D toward the cursor; background shapes drift by depth
// - Idle: gentle auto-sway. Touch: drag/touch moves the gaze.
// - Scroll: stage shrinks and rises, title letters spread, copy fades.
// - Reduced motion: static centre frame, no listeners.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const up = root.querySelector<HTMLImageElement>('[data-pitch="up"]')!;
  const down = root.querySelector<HTMLImageElement>('[data-pitch="down"]')!;
  const chars = root.querySelectorAll<HTMLElement>('.hero__ch');
  const blobs = root.querySelectorAll<HTMLElement>('.blob');
  const copy = root.querySelector<HTMLElement>('[data-hero-copy]');

  if (reduced) { yawFrames.forEach((f, i) => (f.style.opacity = i === 2 ? '1' : '0')); return; }

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
    // yaw position 0..4 across the five photos (centre = 2)
    const p = (gaze.x + 1) * 2;
    const i = Math.min(3, Math.floor(p));
    // Snap towards the nearest photo: poses differ, so long cross-fades look ghostly
    const raw = p - i;
    const f = Math.min(1, Math.max(0, (raw - 0.35) / 0.3));
    yawFrames.forEach((img, k) => {
      img.style.opacity = k === i ? '1' : k === i + 1 ? String(f) : '0';
    });
    // pitch frames fade in on top, strongest near the centre yaw
    const centre = Math.max(0, 1 - Math.abs(gaze.x) * 1.6);
    // (dead zone so a cursor near eye level shows no ghosting)
    const dz = (v: number) => { const k = Math.min(1, Math.max(0, (Math.abs(v) - 0.5) / 0.35)); return k * k * (3 - 2 * k); };
    up.style.opacity = String(gaze.y < 0 ? dz(gaze.y) * centre : 0);
    down.style.opacity = String(gaze.y > 0 ? dz(gaze.y) * centre : 0);

    // The photos already turn the head; keep the 3D tilt subtle and in the same direction
    tiltY(gaze.x * maxTilt);
    tiltX(-gaze.y * maxTilt * 0.6);
    shiftX(gaze.x * maxShift);
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

  // --- idle sway when nobody is moving the pointer (also what phones see) ---
  gsap.ticker.add((time) => {
    if (performance.now() - lastInput < 2500) return;
    setX(Math.sin(time * 0.6) * 0.55);
    setY(Math.sin(time * 0.4 + 1) * 0.15);
  });

  // --- intro ---
  gsap.from(chars, { yPercent: 40, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.07 });
  gsap.from(stage, { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.15 });
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
