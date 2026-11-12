// Bead sculpture for the home hero (2D canvas, no library).
// A few thousand small beads hold a shape (a tooth, then a smile). The pointer pushes them aside like a
// finger through sand and they spring back; switching the shape sends every bead to its new place.
// The module has no imports so it can be run and tested on its own.

export interface FieldColors { a: string; b: string; c: string }

export interface Field {
  /** Sculpture centre and size in CSS pixels, relative to the canvas. */
  place(cx: number, cy: number, size: number): void;
  /** Canvas size in CSS pixels. */
  resize(w: number, h: number): void;
  /** Pointer position relative to the canvas; `on` false when it left. */
  pointer(x: number, y: number, on: boolean): void;
  /** Outward push from a point (click or tap). */
  burst(x: number, y: number): void;
  setShape(i: number): void;
  readonly shape: number;
  readonly shapes: number;
  /** 0..1: beads spread out and fade as the hero scrolls away. */
  setScatter(p: number): void;
  setColors(c: FieldColors): void;
  /** Beads fly in from around the stage and gather into the shape. */
  gather(): void;
  /** Run the simulation. `idle` keeps a slow breathing motion once the beads have settled. */
  start(idle: boolean): void;
  stop(): void;
  /** Put every bead on its place and draw one frame (reduced motion, paused switch). */
  still(): void;
  /** True when (x, y) is on the sculpture. */
  hit(x: number, y: number): boolean;
}

const TOOTH = 'M10 22c0-8 5-12 10-12 2 0 3 1 4 1s2-1 4-1c5 0 10 4 10 12 0 6-2 8-3 14-.5 3-1.5 4-3 4s-2-3-3-8c-.5-2-1.5-3-5-3s-4.5 1-5 3c-1 5-1.5 8-3 8s-2.5-1-3-4c-1-6-3-8-3-14z';
const M = 320; // mask resolution

type Draw = (c: CanvasRenderingContext2D) => void;

const drawTooth: Draw = (c) => {
  const s = 8.6;
  c.translate(M / 2, M / 2);
  c.scale(s, s);
  c.translate(-24, -25.4);
  c.fill(new Path2D(TOOTH));
};

const drawSmile: Draw = (c) => {
  c.beginPath();
  c.arc(104, 112, 21, 0, Math.PI * 2);
  c.arc(216, 112, 21, 0, Math.PI * 2);
  c.fill();
  c.lineWidth = 36;
  c.lineCap = 'round';
  c.beginPath();
  c.arc(160, 132, 104, Math.PI * 0.16, Math.PI * 0.84);
  c.stroke();
};

/** Points of a shape in -0.5..0.5, a third of them on the outline so the silhouette stays crisp. */
function sample(draw: Draw, n: number): Float32Array {
  const cv = document.createElement('canvas');
  cv.width = cv.height = M;
  const c = cv.getContext('2d', { willReadFrequently: true })!;
  c.fillStyle = c.strokeStyle = '#000';
  draw(c);
  const d = c.getImageData(0, 0, M, M).data;
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < M && y < M && d[(y * M + x) * 4 + 3] > 128;
  const fill: number[] = [];
  const edge: number[] = [];
  for (let y = 0; y < M; y++) {
    for (let x = 0; x < M; x++) {
      if (!on(x, y)) continue;
      fill.push(x, y);
      if (!on(x - 3, y) || !on(x + 3, y) || !on(x, y - 3) || !on(x, y + 3)) edge.push(x, y);
    }
  }
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const src = i % 3 === 0 && edge.length ? edge : fill;
    const k = Math.floor(Math.random() * (src.length / 2)) * 2;
    out[i * 2] = (src[k] + Math.random() - M / 2) / M;
    out[i * 2 + 1] = (src[k + 1] + Math.random() - M / 2) / M;
  }
  return out;
}

export function createField(canvas: HTMLCanvasElement, count: number, colors: FieldColors): Field | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const shapes = [sample(drawTooth, count), sample(drawSmile, count)];
  let shape = 0;

  const x = new Float32Array(count);
  const y = new Float32Array(count);
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const z = new Float32Array(count);      // depth 0.55..1.45: size and pointer parallax
  const rad = new Float32Array(count);
  const phase = new Float32Array(count);
  const tone = new Uint8Array(count);     // 0 main, 1 warm, 2 light
  for (let i = 0; i < count; i++) {
    z[i] = 0.55 + Math.random() * 0.9;
    rad[i] = (0.9 + Math.random() * 1.8) * z[i];
    phase[i] = Math.random() * Math.PI * 2;
    const r = Math.random();
    tone[i] = r < 0.66 ? 0 : r < 0.87 ? 1 : 2;
  }

  let W = 1, H = 1, dpr = 1;
  let cx = 0, cy = 0, size = 1;
  let px = -9999, py = -9999, pOn = false;
  let tiltX = 0, tiltY = 0;               // smoothed pointer offset from the centre, -1..1
  let scatter = 0;
  let pal = colors;
  let raf = 0, running = false, idle = true, last = 0, t = 0;

  const homeX = (i: number) => cx + shapes[shape][i * 2] * size * (1 + scatter * 1.4) + tiltX * (z[i] - 1) * 34;
  const homeY = (i: number) => cy + shapes[shape][i * 2 + 1] * size * (1 + scatter * 1.4) + tiltY * (z[i] - 1) * 26 - scatter * size * 0.5 * z[i];

  function draw() {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, W, H);
    ctx!.globalAlpha = Math.max(0, 1 - scatter * 1.15);
    const fills = [pal.a, pal.b, pal.c];
    for (let k = 0; k < 3; k++) {
      ctx!.fillStyle = fills[k];
      ctx!.beginPath();
      for (let i = 0; i < count; i++) {
        if (tone[i] !== k) continue;
        ctx!.moveTo(x[i] + rad[i], y[i]);
        ctx!.arc(x[i], y[i], rad[i], 0, 6.2832);
      }
      ctx!.fill();
    }
  }

  function frame(now: number) {
    raf = 0;
    if (!running) return;
    const step = Math.min(2.2, (now - last) / 16.67 || 1);
    last = now;
    t += step * 0.0167;

    // pointer tilt eases toward the pointer, and back to rest when it leaves
    const txx = pOn ? Math.max(-1, Math.min(1, (px - cx) / (W * 0.5))) : 0;
    const tyy = pOn ? Math.max(-1, Math.min(1, (py - cy) / (H * 0.5))) : 0;
    tiltX += (txx - tiltX) * 0.06 * step;
    tiltY += (tyy - tiltY) * 0.06 * step;

    const R = Math.max(70, size * 0.3);
    const R2 = R * R;
    const k = 0.06 * step;
    const damp = Math.pow(0.86, step);
    let energy = 0;
    for (let i = 0; i < count; i++) {
      let hx = homeX(i), hy = homeY(i);
      if (idle) {
        hx += Math.sin(t * 0.9 + phase[i]) * 2.2 * z[i];
        hy += Math.cos(t * 0.7 + phase[i] * 1.7) * 2.2 * z[i];
      }
      vx[i] += (hx - x[i]) * k;
      vy[i] += (hy - y[i]) * k;
      if (pOn) {
        const dx = x[i] - px, dy = y[i] - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) * (1 - d / R) * 5.5 * step;
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f;
        }
      }
      vx[i] *= damp;
      vy[i] *= damp;
      x[i] += vx[i] * step;
      y[i] += vy[i] * step;
      energy += Math.abs(vx[i]) + Math.abs(vy[i]);
    }
    draw();
    // Without the idle motion the loop sleeps once everything has settled (phones, DESIGN.md mobile energy 1)
    if (!idle && !pOn && energy / count < 0.012) { running = false; return; }
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (!running || raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  const api: Field = {
    place(nx, ny, ns) { cx = nx; cy = ny; size = ns; },
    resize(w, h) {
      W = w; H = h;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (!running) draw();
    },
    pointer(nx, ny, on) {
      px = nx; py = ny; pOn = on;
      if (on && !raf && running === false && started) { running = true; wake(); }
    },
    burst(bx, by) {
      const R = Math.max(120, size * 0.55);
      for (let i = 0; i < count; i++) {
        const dx = x[i] - bx, dy = y[i] - by;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d > R) continue;
        const f = (1 - d / R) * 16;
        vx[i] += (dx / d) * f;
        vy[i] += (dy / d) * f;
      }
      if (started) { running = true; wake(); }
    },
    setShape(i) {
      shape = ((i % shapes.length) + shapes.length) % shapes.length;
      // a short swirl so the change reads as one movement, not a jump
      for (let k = 0; k < count; k++) {
        const dx = x[k] - cx, dy = y[k] - cy;
        vx[k] += (-dy / size) * 9 + (Math.random() - 0.5) * 3;
        vy[k] += (dx / size) * 9 + (Math.random() - 0.5) * 3;
      }
      if (started) { running = true; wake(); }
    },
    get shape() { return shape; },
    get shapes() { return shapes.length; },
    setScatter(p) {
      scatter = Math.max(0, Math.min(1, p));
      if (started) { running = true; wake(); } else api.still();
    },
    setColors(c) { pal = c; if (!running) draw(); },
    gather() {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = size * (0.9 + Math.random() * 1.6);
        x[i] = cx + Math.cos(a) * r;
        y[i] = cy + Math.sin(a) * r * 0.8;
        vx[i] = vy[i] = 0;
      }
    },
    start(withIdle) {
      idle = withIdle;
      started = true;
      running = true;
      wake();
    },
    stop() {
      running = false;
      started = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
    still() {
      for (let i = 0; i < count; i++) { x[i] = homeX(i); y[i] = homeY(i); vx[i] = vy[i] = 0; }
      draw();
    },
    hit(hx, hy) {
      const dx = hx - cx, dy = hy - cy;
      return dx * dx + dy * dy < size * size * 0.3;
    },
  };
  let started = false;
  return api;
}
