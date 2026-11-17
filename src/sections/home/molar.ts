// Anatomical molar drawn as ~25 000 points (raw WebGL, no library), with "ink" that keeps leaving its
// surface and drifts away on a slow swirling flow, like ink in water. The pointer parts both the tooth
// and the ink. Point data: public/models/molar.bin (xyz Int16, tag Uint8: 0 enamel, 1 root, 2 pulp),
// generated from a signed distance field of a lower first molar (crown with five cusps, two roots, pulp and canals).

export interface MolarOptions {
  /** how many tooth points to draw (the file is shuffled, so any prefix is an even sample) */
  points: number;
  /** how many ink particles are alive at once */
  ink: number;
  /** false: nothing moves by itself (reduced motion), the pointer still parts the cloud */
  auto: boolean;
}

export interface MolarScene {
  resize(): void;
  /** where the tooth stands: centre in CSS px relative to the canvas, and its height in CSS px */
  place(cx: number, cy: number, height: number): void;
  pointer(x: number, y: number, on: boolean): void;
  start(): void;
  stop(): void;
  setColors(c: string[]): void;
}

const VS = `
attribute vec4 aPos;      // xyz, alpha
attribute vec2 aInfo;     // colour index, random 0..1
uniform mat3 uRot;
uniform vec2 uCenter, uRes, uMouse;
uniform float uScale, uDpr, uTime, uMouseOn, uSize, uRadius;
uniform vec3 uCol[6];
varying vec3 vCol;
varying float vA;
void main() {
  vec3 p = uRot * aPos.xyz;
  float persp = 70.0 / max(70.0 - p.z, 45.0);
  vec2 s = uCenter + vec2(p.x, -p.y) * uScale * persp;
  float r = aInfo.y;
  s += vec2(sin(uTime * 1.3 + r * 40.0), cos(uTime * 1.1 + r * 31.0)) * 0.7;
  vec2 d = s - uMouse;
  float L = length(d);
  if (uMouseOn > 0.0 && L < uRadius) {
    float k = 1.0 - L / uRadius;
    s += d / max(L, 0.001) * k * k * uRadius * 0.45 * (0.6 + r * 0.8) * uMouseOn;
  }
  vec2 c = s / uRes * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
  gl_PointSize = (1.3 + r * 1.9) * persp * uDpr * uSize;
  int i = int(aInfo.x + 0.5);
  vec3 col = uCol[0];
  if (i == 1) col = uCol[1]; else if (i == 2) col = uCol[2]; else if (i == 3) col = uCol[3]; else if (i == 4) col = uCol[4]; else if (i == 5) col = uCol[5];
  vCol = col;
  vA = aPos.w * clamp(0.75 + p.z / 18.0, 0.45, 1.0);
}`;

const FS = `
precision mediump float;
varying vec3 vCol;
varying float vA;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float d = dot(q, q);
  if (d > 0.25) discard;
  float a = vA * smoothstep(0.25, 0.08, d);
  gl_FragColor = vec4(vCol * a, a);   // premultiplied, so the page behind shows through correctly
}`;

const hex = (h: string): number[] => {
  const v = h.replace('#', '');
  const n = parseInt(v.length === 3 ? v.split('').map((c) => c + c).join('') : v, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function rotation(yaw: number, pitch: number, roll: number): Float32Array {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch), cz = Math.cos(roll), sz = Math.sin(roll);
  // R = Rz * Rx * Ry, column-major for WebGL
  const ry = [cy, 0, -sy, 0, 1, 0, sy, 0, cy];
  const rx = [1, 0, 0, 0, cx, sx, 0, -sx, cx];
  const rz = [cz, sz, 0, -sz, cz, 0, 0, 0, 1];
  const mul = (a: number[], b: number[]) => {
    const o = new Array(9).fill(0);
    for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) o[c * 3 + r] += a[k * 3 + r] * b[c * 3 + k];
    return o;
  };
  return new Float32Array(mul(rz, mul(rx, ry)));
}

const apply = (m: Float32Array, x: number, y: number, z: number): [number, number, number] =>
  [m[0] * x + m[3] * y + m[6] * z, m[1] * x + m[4] * y + m[7] * z, m[2] * x + m[5] * y + m[8] * z];

const cache = new Map<string, Promise<ArrayBuffer>>();
export const loadMolar = (url: string) => {
  if (!cache.has(url)) cache.set(url, fetch(url).then((r) => { if (!r.ok) throw new Error('molar'); return r.arrayBuffer(); }));
  return cache.get(url)!;
};

export async function createMolar(canvas: HTMLCanvasElement, url: string, opt: MolarOptions, colors: string[]): Promise<MolarScene | null> {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return null;
  const buf = await loadMolar(url);
  const total = new Uint32Array(buf, 0, 1)[0];
  const n = Math.min(total, opt.points);
  const raw = new Int16Array(buf, 4, total * 3);
  const tags = new Uint8Array(buf, 4 + total * 6, total);

  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const U = (name: string) => gl.getUniformLocation(prog, name);
  const u = {
    rot: U('uRot'), center: U('uCenter'), res: U('uRes'), mouse: U('uMouse'), scale: U('uScale'), dpr: U('uDpr'),
    time: U('uTime'), mouseOn: U('uMouseOn'), size: U('uSize'), radius: U('uRadius'), col: U('uCol[0]'),
  };
  const aPos = gl.getAttribLocation(prog, 'aPos');
  const aInfo = gl.getAttribLocation(prog, 'aInfo');

  // --- tooth: static buffers ---
  const unit = 24 / 32767;
  const tPos = new Float32Array(n * 4);
  const tInfo = new Float32Array(n * 2);
  const surface: number[] = []; // indexes of enamel and root points (ink leaves from these)
  for (let i = 0; i < n; i++) {
    tPos[i * 4] = raw[i * 3] * unit; tPos[i * 4 + 1] = raw[i * 3 + 1] * unit; tPos[i * 4 + 2] = raw[i * 3 + 2] * unit;
    tPos[i * 4 + 3] = 1.0;
    tInfo[i * 2] = tags[i]; tInfo[i * 2 + 1] = Math.random();
    if (tags[i] !== 2) surface.push(i);
  }
  const toothPos = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, toothPos); gl.bufferData(gl.ARRAY_BUFFER, tPos, gl.STATIC_DRAW);
  const toothInfo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, toothInfo); gl.bufferData(gl.ARRAY_BUFFER, tInfo, gl.STATIC_DRAW);

  // --- ink: CPU particles in world space (after rotation), re-uploaded each frame ---
  const m = opt.ink;
  const iPos = new Float32Array(m * 4);
  const iInfo = new Float32Array(m * 2);
  const vel = new Float32Array(m * 3);
  const age = new Float32Array(m);
  const life = new Float32Array(m);
  for (let i = 0; i < m; i++) { iInfo[i * 2] = 3 + Math.floor(Math.random() * 3); iInfo[i * 2 + 1] = Math.random(); }
  const inkPos = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, inkPos); gl.bufferData(gl.ARRAY_BUFFER, iPos, gl.DYNAMIC_DRAW);
  const inkInfo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, inkInfo); gl.bufferData(gl.ARRAY_BUFFER, iInfo, gl.STATIC_DRAW);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let W = 1, H = 1, dpr = 1, cx = 0, cy = 0, scale = 10;
  let mx = -1e4, my = -1e4, tmx = -1e4, tmy = -1e4, mOn = 0, tOn = 0;
  let px = 0, py = 0;          // pointer -0.5..0.5 for the slow turn toward the pointer
  let yaw = 0.2, t = 0, raf = 0, running = false, last = 0, settled = false;
  let rot = rotation(yaw, -0.1, 0.28);
  const ident = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

  // Ink leaves from a few "vents" on the surface at a time (each moves on after a while), so it forms
  // plumes and threads like ink dropped in water, not an even haze.
  const vents = Array.from({ length: 7 }, () => surface[(Math.random() * surface.length) | 0]);
  let ventClock = 0;
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.9;
  const spawn = (i: number, warm: boolean) => {
    const k = Math.random() < 0.8 ? vents[i % vents.length] : surface[(Math.random() * surface.length) | 0];
    const [x, y, z] = apply(rot, tPos[k * 4] + gauss(), tPos[k * 4 + 1] + gauss(), tPos[k * 4 + 2] + gauss());
    iPos[i * 4] = x; iPos[i * 4 + 1] = y; iPos[i * 4 + 2] = z;
    vel[i * 3] = x * 0.0025; vel[i * 3 + 1] = 0.004; vel[i * 3 + 2] = z * 0.0025;
    life[i] = 5 + Math.random() * 6;
    age[i] = warm ? Math.random() * life[i] : 0;
  };
  for (let i = 0; i < m; i++) spawn(i, true);

  // swirling flow (sums of sines: cheap, smooth, divergence small enough to read as curling ink)
  const step = (dt: number) => {
    const R = 150, R2 = R * R;
    ventClock += dt;
    if (ventClock > 1.4) { ventClock = 0; vents[(Math.random() * vents.length) | 0] = surface[(Math.random() * surface.length) | 0]; }
    for (let i = 0; i < m; i++) {
      age[i] += dt;
      if (age[i] > life[i]) { spawn(i, false); continue; }
      let x = iPos[i * 4], y = iPos[i * 4 + 1], z = iPos[i * 4 + 2];
      const fx = Math.sin(0.13 * y + t * 0.35) + 0.7 * Math.cos(0.11 * z - t * 0.25) + 0.35;
      const fy = Math.sin(0.12 * z + t * 0.3) + 0.7 * Math.cos(0.14 * x + t * 0.2) + 0.25;
      const fz = Math.sin(0.12 * x - t * 0.3) + 0.7 * Math.cos(0.1 * y + t * 0.35);
      // slow drift (about one tooth-millimetre a second), so the ink hangs around the tooth in threads
      let vx = vel[i * 3] * 0.96 + fx * 0.0009 * dt * 60;
      let vy = vel[i * 3 + 1] * 0.96 + fy * 0.0009 * dt * 60;
      const vz = vel[i * 3 + 2] * 0.96 + fz * 0.0009 * dt * 60;
      if (mOn > 0) {
        const sx = cx + x * scale, sy = cy - y * scale;
        const dx = sx - mx, dy = sy - my, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / R) * 0.03 * mOn; vx += (dx / d) * f; vy -= (dy / d) * f; }
      }
      x += vx * dt * 60; y += vy * dt * 60;
      vel[i * 3] = vx; vel[i * 3 + 1] = vy; vel[i * 3 + 2] = vz;
      iPos[i * 4] = x; iPos[i * 4 + 1] = y; iPos[i * 4 + 2] += vz * dt * 60;
      const a = age[i] / life[i];
      iPos[i * 4 + 3] = Math.min(1, a * 8) * (1 - a) * 0.95;
    }
  };

  const bind = (pos: WebGLBuffer, info: WebGLBuffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, pos); gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, info); gl.enableVertexAttribArray(aInfo); gl.vertexAttribPointer(aInfo, 2, gl.FLOAT, false, 0, 0);
  };

  const draw = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.center, cx, cy); gl.uniform2f(u.res, W, H); gl.uniform2f(u.mouse, mx, my);
    gl.uniform1f(u.scale, scale); gl.uniform1f(u.dpr, dpr); gl.uniform1f(u.time, t); gl.uniform1f(u.mouseOn, mOn);
    gl.uniform1f(u.radius, Math.max(110, scale * 7));
    // ink behind and in front: one pass is enough at this density
    gl.uniformMatrix3fv(u.rot, false, ident); gl.uniform1f(u.size, 1.1);
    gl.bindBuffer(gl.ARRAY_BUFFER, inkPos); gl.bufferSubData(gl.ARRAY_BUFFER, 0, iPos);
    bind(inkPos, inkInfo);
    gl.drawArrays(gl.POINTS, 0, m);
    gl.uniformMatrix3fv(u.rot, false, rot); gl.uniform1f(u.size, 1);
    bind(toothPos, toothInfo);
    gl.drawArrays(gl.POINTS, 0, n);
  };

  const frame = (now: number) => {
    raf = 0;
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    mx += (tmx - mx) * 0.25; my += (tmy - my) * 0.25;
    mOn += (tOn - mOn) * 0.12;
    if (opt.auto) {
      t += dt;
    }
    // sways around the cheek-side view (both roots visible) instead of spinning, so it always reads as a molar
    yaw = 0.15 + Math.sin(t * 0.22) * 0.45;
    rot = rotation(yaw + px * 0.6, -0.1 + py * 0.3, 0.28 + Math.sin(t * 0.17) * 0.05);
    if (opt.auto) step(dt);
    draw();
    // without automatic motion the loop sleeps once the pointer has gone and the parting has closed
    if (!opt.auto && tOn === 0 && mOn < 0.01) { running = false; return; }
    raf = requestAnimationFrame(frame);
  };
  const wake = () => { if (!raf) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } };

  const scene: MolarScene = {
    resize() {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      draw();
    },
    place(x, y, height) { cx = x; cy = y; scale = height / 24; draw(); },
    pointer(x, y, on) {
      tmx = x; tmy = y; tOn = on ? 1 : 0;
      if (mx < -1e3) { mx = x; my = y; }
      px = Math.max(-0.5, Math.min(0.5, (x - cx) / W));
      py = Math.max(-0.5, Math.min(0.5, (y - cy) / H));
      wake();
    },
    start() {
      if (opt.auto) { wake(); return; }
      // still scene: let the ink drift for a few seconds once, then hold that frame
      if (!settled) { settled = true; for (let k = 0; k < 90; k++) { t += 0.05; step(0.05); } t = 0; }
      draw();
    },
    stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; },
    setColors(c) { gl.useProgram(prog); gl.uniform3fv(u.col, new Float32Array(c.flatMap(hex))); draw(); },
  };
  scene.setColors(colors);
  scene.resize();
  return scene;
}
