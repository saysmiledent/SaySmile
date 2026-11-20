var e=e=>new Promise((t,n)=>{let r=new Image;r.decoding=`async`,r.onload=()=>t(r),r.onerror=n,r.src=e});async function t(t,n,r,i,a,o){let s=document.createElement(`canvas`);s.className=`portrait__gl`;let c=s.getContext(`webgl`,{premultipliedAlpha:!0,alpha:!0,antialias:!0});if(!c||c.getParameter(c.MAX_VERTEX_TEXTURE_IMAGE_UNITS)<3)return null;let l=(e,t)=>{let n=c.createShader(e);if(c.shaderSource(n,t),c.compileShader(n),!c.getShaderParameter(n,c.COMPILE_STATUS))throw Error(c.getShaderInfoLog(n)||`shader`);return n},u;try{if(u=c.createProgram(),c.attachShader(u,l(c.VERTEX_SHADER,`
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
}`)),c.attachShader(u,l(c.FRAGMENT_SHADER,`
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
}`)),c.linkProgram(u),!c.getProgramParameter(u,c.LINK_STATUS))throw Error(c.getProgramInfoLog(u)||`link`)}catch(e){return console.warn(`[portrait3d] shader`,e),null}c.useProgram(u);let d=new Float32Array(15714),f=0;for(let e=0;e<=96;e++)for(let t=0;t<=80;t++)d[f++]=t/80,d[f++]=e/96;let p=new Uint16Array(46080);f=0;for(let e=0;e<96;e++)for(let t=0;t<80;t++){let n=e*81+t,r=n+1,i=n+80+1,a=i+1;p[f++]=n,p[f++]=i,p[f++]=r,p[f++]=r,p[f++]=i,p[f++]=a}let m=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,m),c.bufferData(c.ARRAY_BUFFER,d,c.STATIC_DRAW);let h=c.getAttribLocation(u,`aUv`);c.enableVertexAttribArray(h),c.vertexAttribPointer(h,2,c.FLOAT,!1,0,0);let g=c.createBuffer();c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,g),c.bufferData(c.ELEMENT_ARRAY_BUFFER,p,c.STATIC_DRAW);let _=(e,t)=>{let n=c.createTexture();return c.bindTexture(c.TEXTURE_2D,n),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,e),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,c.LINEAR),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,c.LINEAR),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE),n},v,y,b,x;try{let[t,o,s,c]=await Promise.all([Promise.all(n.map(e)),Promise.all(r.map(e)),e(i),e(a)]);v=t.map(e=>_(e,!0)),y=o.map(e=>_(e,!1)),b=_(s,!0),x=_(c,!1)}catch(e){return console.warn(`[portrait3d] textures`,e),null}let S=e=>c.getUniformLocation(u,e),C={colA:S(`uColA`),colB:S(`uColB`),colD:S(`uColD`),depA:S(`uDepthA`),depB:S(`uDepthB`),depD:S(`uDepthD`),mix:S(`uMix`),down:S(`uDown`),rot:S(`uRot`),light:S(`uLight`),scale:S(`uScale`),aspect:S(`uAspect`),texel:S(`uTexel`)};c.uniform1f(C.aspect,o),c.uniform2f(C.texel,1/150,1/180),c.uniform1i(C.colD,4),c.uniform1i(C.depD,5),c.activeTexture(c.TEXTURE4),c.bindTexture(c.TEXTURE_2D,b),c.activeTexture(c.TEXTURE5),c.bindTexture(c.TEXTURE_2D,x),c.uniform1i(C.colA,0),c.uniform1i(C.colB,1),c.uniform1i(C.depA,2),c.uniform1i(C.depB,3),c.enable(c.DEPTH_TEST),c.depthFunc(c.LEQUAL),c.clearColor(0,0,0,0);let w=-1,T=-1,E=(e,t)=>{c.activeTexture(c.TEXTURE0+e),c.bindTexture(c.TEXTURE_2D,t)};t.appendChild(s);let D={setFrames(e,t){(e!==w||t!==T)&&(w=e,T=t,E(0,v[e]),E(1,v[t]),E(2,y[e]),E(3,y[t]))},resize(){let e=Math.min(devicePixelRatio||1,2),n=Math.round(t.clientWidth*e),r=Math.round(t.clientHeight*e);(s.width!==n||s.height!==r)&&(s.width=n,s.height=r),c.viewport(0,0,s.width,s.height)},render(e){c.clear(c.COLOR_BUFFER_BIT|c.DEPTH_BUFFER_BIT);let t=Math.sin(e.time*1.3)*.004;c.uniform1f(C.mix,e.mix),c.uniform1f(C.down,e.down),c.uniform2f(C.rot,e.rotX+t,e.rotY),c.uniform2f(C.light,e.lightX,e.lightY),c.uniform1f(C.scale,.97+t),c.drawElements(c.TRIANGLES,p.length,c.UNSIGNED_SHORT,0)},destroy(){s.remove()}};return D.resize(),D}function n(){let e=document.querySelector(`[data-portrait]`);if(!e)return;let n=e.querySelector(`[data-portrait-tilt]`),r=[...e.querySelectorAll(`[data-yaw]`)].sort((e,t)=>Number(e.dataset.yaw)-Number(t.dataset.yaw)),i=e.querySelector(`[data-pitch="down"]`),a=r.length;if(matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let o=matchMedia(`(max-width: 768px)`).matches,s=o?4:9,c=o?6:16,l=JSON.parse(e.dataset.relief||`{}`),u=null,d={x:0,y:0},f={x:0,y:0},p=0;function m(){let e=(d.x+1)/2*(a-1),t=Math.min(a-2,Math.floor(e)),o=Math.min(1,Math.max(0,(e-t-.42)/.16));r.forEach((e,n)=>{e.style.opacity=n===t?`1`:n===t+1?String(o):`0`});let l=Math.max(0,1-Math.abs(d.x)*2.2),f=d.y>0?(e=>{let t=Math.min(1,Math.max(0,(Math.abs(e)-.5)/.35));return t*t*(3-2*t)})(d.y)*l:0;i.style.opacity=String(f),u?(u.setFrames(t,t+1),u.render({mix:o*o*(3-2*o),down:f,rotY:d.x*.3,rotX:d.y*.16,lightX:d.x,lightY:d.y,time:0})):n.style.transform=`translateX(${(d.x*c).toFixed(1)}px) rotateY(${(d.x*s).toFixed(2)}deg) rotateX(${(-d.y*s*.6).toFixed(2)}deg)`}function h(){p=0,d.x+=(f.x-d.x)*.12,d.y+=(f.y-d.y)*.12,m(),Math.abs(f.x-d.x)+Math.abs(f.y-d.y)>.002&&(p=requestAnimationFrame(h))}let g=()=>{p||=requestAnimationFrame(h)},_=t=>{let n=e.getBoundingClientRect();n.bottom<0||n.top>innerHeight||(f.x=Math.max(-1,Math.min(1,(t.clientX-(n.left+n.width/2))/(innerWidth*.8))),f.y=Math.max(-1,Math.min(1,(t.clientY-(n.top+n.height*.3))/(innerHeight*.5))),g())};addEventListener(`pointermove`,_,{passive:!0}),addEventListener(`pointerdown`,_,{passive:!0}),t(e,r.map(e=>e.currentSrc||e.src),l.depth,i.currentSrc||i.src,l.down,600/720).then(t=>{t&&(u=t,e.classList.add(`is-gl`),n.style.transform=``,m(),addEventListener(`resize`,()=>{t.resize(),m()}))}).catch(()=>{}),m()}n();