// Live 3D relief of the doctor (raw WebGL, no library).
// Every photo frame is drawn on a finely subdivided grid whose height comes from a small depth map,
// so the head and shoulders are real geometry: they rotate in perspective, catch a light that follows
// the cursor, and blend between photo angles. Returns null when WebGL (or vertex texture fetch) is missing,
// and the caller keeps the plain <img> stack instead.

export interface ReliefState {
  mix: number;        // 0..1 blend between frame A and frame B
  down: number;       // 0..1 look-down frame strength
  rotX: number;       // radians
  rotY: number;       // radians
  lightX: number;     // -1..1
  lightY: number;     // -1..1
  time: number;       // seconds, for the idle breathing
}

export interface Relief {
  setFrames(a: number, b: number): void;
  render(s: ReliefState): void;
  resize(): void;
  destroy(): void;
}

const VS = `
attribute vec2 aUv;
uniform sampler2D uDepthA, uDepthB, uDepthD;
uniform float uMix, uDown, uScale;
uniform vec2 uRot;
uniform float uAspect;
varying vec2 vUv;
void main() {
  vUv = aUv;
  float dA = texture2D(uDepthA, aUv).r;
  float dB = texture2D(uDepthB, aUv).r;
  float dD = texture2D(uDepthD, aUv).r;
  float mask = 1.0 - smoothstep(0.34, 0.5, aUv.y);
  float d = mix(mix(dA, dB, uMix), dD, uDown * mask);
  vec3 p = vec3((aUv.x - 0.5) * uAspect, 0.5 - aUv.y, d * 0.2);
  vec3 pivot = vec3(0.0, 0.2, 0.06);
  p -= pivot;
  float cy = cos(uRot.y), sy = sin(uRot.y), cx = cos(uRot.x), sx = sin(uRot.x);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  p += pivot;
  float persp = 1.0 / (1.0 - p.z * 0.9);
  gl_Position = vec4(p.x / (0.5 * uAspect) * uScale * persp, p.y / 0.5 * uScale * persp, -p.z, 1.0);
}`;

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uColA, uColB, uColD, uDepthA, uDepthB;
uniform float uMix, uDown;
uniform vec2 uLight;
uniform vec2 uTexel;
varying vec2 vUv;
float depthAt(vec2 uv) { return mix(texture2D(uDepthA, uv).r, texture2D(uDepthB, uv).r, uMix); }
void main() {
  vec4 c = mix(texture2D(uColA, vUv), texture2D(uColB, vUv), uMix);
  float mask = 1.0 - smoothstep(0.34, 0.5, vUv.y);
  c = mix(c, texture2D(uColD, vUv), uDown * mask);
  if (c.a < 0.01) discard;
  vec2 g = vec2(depthAt(vUv + vec2(uTexel.x, 0.0)) - depthAt(vUv - vec2(uTexel.x, 0.0)),
                depthAt(vUv + vec2(0.0, uTexel.y)) - depthAt(vUv - vec2(0.0, uTexel.y)));
  vec3 n = normalize(vec3(-g.x * 5.0, g.y * 5.0, 1.0));
  vec3 l = normalize(vec3(uLight.x * 0.9, -uLight.y * 0.7 + 0.25, 0.85));
  float shade = 0.9 + 0.22 * dot(n, l);
  gl_FragColor = vec4(c.rgb * shade, c.a);
}`;

const load = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });

export async function createRelief(
  host: HTMLElement,
  colorUrls: string[],
  depthUrls: string[],
  downColor: string,
  downDepth: string,
  aspect: number,
): Promise<Relief | null> {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero__gl';
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true }) as WebGLRenderingContext | null;
  if (!gl || gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 3) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  };
  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
  } catch (e) {
    console.warn('[hero3d] shader', e);
    return null;
  }
  gl.useProgram(prog);

  // grid
  const NX = 80, NY = 96;
  const uv = new Float32Array((NX + 1) * (NY + 1) * 2);
  let k = 0;
  for (let y = 0; y <= NY; y++) for (let x = 0; x <= NX; x++) { uv[k++] = x / NX; uv[k++] = y / NY; }
  const idx = new Uint16Array(NX * NY * 6);
  k = 0;
  for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
    const a = y * (NX + 1) + x, b = a + 1, c = a + NX + 1, d = c + 1;
    idx[k++] = a; idx[k++] = c; idx[k++] = b; idx[k++] = b; idx[k++] = c; idx[k++] = d;
  }
  const vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aUv');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);

  // textures
  const mk = (img: HTMLImageElement, premultiply: boolean) => {
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  let colors: WebGLTexture[], depths: WebGLTexture[], colD: WebGLTexture, depD: WebGLTexture;
  try {
    const [ci, di, cd, dd] = await Promise.all([
      Promise.all(colorUrls.map(load)), Promise.all(depthUrls.map(load)), load(downColor), load(downDepth),
    ]);
    colors = ci.map((i) => mk(i, true));
    depths = di.map((i) => mk(i, false));
    colD = mk(cd, true);
    depD = mk(dd, false);
  } catch (e) {
    console.warn('[hero3d] textures', e);
    return null;
  }

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = {
    colA: U('uColA'), colB: U('uColB'), colD: U('uColD'), depA: U('uDepthA'), depB: U('uDepthB'), depD: U('uDepthD'),
    mix: U('uMix'), down: U('uDown'), rot: U('uRot'), light: U('uLight'), scale: U('uScale'), aspect: U('uAspect'), texel: U('uTexel'),
  };
  gl.uniform1f(u.aspect, aspect);
  gl.uniform2f(u.texel, 1 / 150, 1 / 180);
  gl.uniform1i(u.colD, 4);
  gl.uniform1i(u.depD, 5);
  gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, colD);
  gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, depD);
  gl.uniform1i(u.colA, 0); gl.uniform1i(u.colB, 1); gl.uniform1i(u.depA, 2); gl.uniform1i(u.depB, 3);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 0);

  let fa = -1, fb = -1;
  const bind = (unit: number, tex: WebGLTexture) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); };
  host.appendChild(canvas);

  const api: Relief = {
    setFrames(a, b) {
      if (a === fa && b === fb) return;
      fa = a; fb = b;
      bind(0, colors[a]); bind(1, colors[b]); bind(2, depths[a]); bind(3, depths[b]);
    },
    resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = Math.round(host.clientWidth * dpr), h = Math.round(host.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    render(s) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const breathe = Math.sin(s.time * 1.3) * 0.004;
      gl.uniform1f(u.mix, s.mix);
      gl.uniform1f(u.down, s.down);
      gl.uniform2f(u.rot, s.rotX + breathe, s.rotY);
      gl.uniform2f(u.light, s.lightX, s.lightY);
      gl.uniform1f(u.scale, 0.97 + breathe);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    },
    destroy() { canvas.remove(); },
  };
  api.resize();
  return api;
}
