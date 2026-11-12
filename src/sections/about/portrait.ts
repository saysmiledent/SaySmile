// Portrait behaviour on the About page (no library).
// - Pointer x -> yaw (9 photo angles), pointer y -> looks down. Touch and drag do the same on phones.
//   The full turn needs most of the screen width, so he rarely ends up in profile.
// - With WebGL the frames are drawn as a 3D relief (portrait3d.ts); without it the photo stack tilts.
// - It moves only while the visitor moves, so nothing loops and no pause control is needed.
// - Reduced motion: the centre photo, no listeners.
import { createRelief, type Relief } from './portrait3d';

export function initPortrait() {
  const root = document.querySelector<HTMLElement>('[data-portrait]');
  if (!root) return;
  const tilt = root.querySelector<HTMLElement>('[data-portrait-tilt]')!;
  const yawFrames = [...root.querySelectorAll<HTMLImageElement>('[data-yaw]')]
    .sort((a, b) => Number(a.dataset.yaw) - Number(b.dataset.yaw));
  const down = root.querySelector<HTMLImageElement>('[data-pitch="down"]')!;
  const n = yawFrames.length;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mobile = matchMedia('(max-width: 768px)').matches;
  const maxTilt = mobile ? 4 : 9;
  const maxShift = mobile ? 6 : 16;
  const cfg = JSON.parse(root.dataset.relief || '{}') as { depth: string[]; down: string };
  let relief: Relief | null = null;

  // Gaze, -1..1 (x: left..right, y: up..down). `aim` is where the pointer asks it to go.
  const gaze = { x: 0, y: 0 };
  const aim = { x: 0, y: 0 };
  let raf = 0;

  function render() {
    // yaw position 0..n-1 across the photos (centre = middle one)
    const p = ((gaze.x + 1) / 2) * (n - 1);
    const i = Math.min(n - 2, Math.floor(p));
    // Snap towards the nearest photo: short cross-fades keep the head from ghosting
    const f = Math.min(1, Math.max(0, (p - i - 0.42) / 0.16));
    yawFrames.forEach((img, k) => { img.style.opacity = k === i ? '1' : k === i + 1 ? String(f) : '0'; });
    // the look-down frame fades in near the centre yaw, with a dead zone so a pointer at eye level shows no ghosting
    const centre = Math.max(0, 1 - Math.abs(gaze.x) * 2.2);
    const dz = (v: number) => { const k = Math.min(1, Math.max(0, (Math.abs(v) - 0.5) / 0.35)); return k * k * (3 - 2 * k); };
    const downAmt = gaze.y > 0 ? dz(gaze.y) * centre : 0;
    down.style.opacity = String(downAmt);
    if (relief) {
      relief.setFrames(i, i + 1);
      relief.render({
        mix: f * f * (3 - 2 * f), down: downAmt,
        rotY: gaze.x * 0.3, rotX: gaze.y * 0.16, lightX: gaze.x, lightY: gaze.y, time: 0,
      });
    } else {
      // The photos already turn the head; keep the tilt small and in the same direction
      tilt.style.transform = `translateX(${(gaze.x * maxShift).toFixed(1)}px) rotateY(${(gaze.x * maxTilt).toFixed(2)}deg) rotateX(${(-gaze.y * maxTilt * 0.6).toFixed(2)}deg)`;
    }
  }

  function tick() {
    raf = 0;
    gaze.x += (aim.x - gaze.x) * 0.12;
    gaze.y += (aim.y - gaze.y) * 0.12;
    render();
    if (Math.abs(aim.x - gaze.x) + Math.abs(aim.y - gaze.y) > 0.002) raf = requestAnimationFrame(tick);
  }
  const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

  const look = (e: PointerEvent) => {
    const r = root.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    aim.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth * 0.8)));
    aim.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.3)) / (innerHeight * 0.5)));
    wake();
  };
  addEventListener('pointermove', look, { passive: true });
  addEventListener('pointerdown', look, { passive: true });

  createRelief(root, yawFrames.map((f) => f.currentSrc || f.src), cfg.depth, down.currentSrc || down.src, cfg.down, 600 / 720)
    .then((r) => {
      if (!r) return;
      relief = r;
      root.classList.add('is-gl');
      tilt.style.transform = '';
      render();
      addEventListener('resize', () => { r.resize(); render(); });
    })
    .catch(() => {});

  render();
}
