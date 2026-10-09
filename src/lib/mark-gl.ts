/**
 * The Me² mark in light (hero). A ray-marched scene in plain WebGL, no libraries:
 * a dark glass square (the big square of the mark) and a small coral square at its top-right corner (the ²),
 * which glows and lights the glass. Faint task squares on the glass light up as a wave runs toward the ².
 *
 * - Starts dark and "ignites" over about two seconds.
 * - Leans toward the pointer; tips back as the hero scrolls away.
 * - Pauses off-screen and in background tabs; one still frame for reduced motion.
 * - Lowers its resolution if frames run slow, so phones stay smooth.
 * The canvas is transparent where there is no glass: the glow is added light over the hero's CSS background.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;      // canvas size in pixels
uniform vec2 uCenter;   // where the mark sits, in pixels (origin bottom-left)
uniform float uSize;    // half the big square's width, in pixels
uniform float uTime;
uniform vec2 uLean;     // pointer, -1..1, smoothed
uniform float uScroll;  // 0 at the top, 1 when the hero has scrolled away
uniform float uIgnite;  // 0..1, the ² lighting up

const vec3 CORAL = vec3(0.906, 0.471, 0.361);
const vec3 MIST = vec3(0.91, 0.93, 0.945);
const float CAMZ = 7.0;
const vec3 BIG_C = vec3(-0.2, -0.2, 0.0);
const vec3 BIG_B = vec3(1.0, 1.0, 0.13);
const vec3 SMALL_C = vec3(1.22, 1.22, 0.0);
const vec3 SMALL_B = vec3(0.27, 0.27, 0.13);

mat3 rot;

// GLSL ES 1.0 has no transpose(); rotations are orthonormal, so the transpose is the inverse.
mat3 transpose3(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]);
}

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

// Scene in object space: x = distance, y = 1 for the glass, 2 for the coral square.
vec2 mapObj(vec3 q) {
  float a = sdRoundBox(q - BIG_C, BIG_B, 0.07);
  float b = sdRoundBox(q - SMALL_C, SMALL_B, 0.05);
  return a < b ? vec2(a, 1.0) : vec2(b, 2.0);
}
vec2 map(vec3 p) { return mapObj(rot * p); }

vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    map(p + e.xyy).x - map(p - e.xyy).x,
    map(p + e.yxy).x - map(p - e.yxy).x,
    map(p + e.yyx).x - map(p - e.yyx).x));
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

// The studio the glass reflects: a long soft light overhead, a cool strip on the left, the ²'s warm light.
vec3 env(vec3 r, vec3 toCoral) {
  vec3 c = vec3(0.012, 0.025, 0.04);
  c += smoothstep(0.25, 0.95, r.y) * smoothstep(1.0, 0.2, abs(r.x)) * vec3(0.5, 0.56, 0.62) * 0.85;
  c += smoothstep(0.6, 0.98, -r.x) * vec3(0.3, 0.36, 0.42) * 0.6;
  // Two long strip lights in front of the glass: as it turns, their reflections sweep across the face.
  float front = smoothstep(0.0, 0.5, r.z);
  c += exp(-pow((r.x + 0.32) / 0.07, 2.0)) * front * vec3(0.55, 0.62, 0.7) * 0.42;
  c += exp(-pow((r.y - 0.42) / 0.09, 2.0)) * front * vec3(0.5, 0.57, 0.65) * 0.22;
  c += pow(max(dot(r, toCoral), 0.0), 6.0) * CORAL * 0.9 * uIgnite;
  return c;
}

vec3 shade(vec3 pos, vec3 rd, float id) {
  vec3 n = normalAt(pos);
  vec3 v = -rd;
  vec3 lightPos = transpose3(rot) * SMALL_C;
  vec3 toL = lightPos - pos;
  float dL = length(toL);
  vec3 L = toL / dL;
  vec3 q = rot * pos;
  vec3 nq = rot * n;

  if (id > 1.5) {
    // The ²: warm, bright, a little hotter at the centre of its face.
    vec2 uv = (q.xy - SMALL_C.xy) / SMALL_B.xy;
    float core = 1.0 - smoothstep(0.0, 1.4, length(uv));
    vec3 c = CORAL * (0.95 + 0.3 * core) + vec3(1.0, 0.85, 0.75) * 0.1 * core * core;
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    c = mix(c, CORAL * 0.7, rim * 0.5);
    return mix(vec3(0.05, 0.06, 0.08), c, uIgnite);
  }

  // The glass: deep navy, polished, lit warm from the ² and cool from the studio.
  float fres = 0.035 + 0.965 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
  vec3 r = reflect(rd, n);
  vec3 base = vec3(0.035, 0.078, 0.125);
  float falloff = 1.0 / (1.0 + dL * dL * 0.45);
  float diff = max(dot(n, L), 0.0) * falloff;
  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 70.0) * falloff;
  vec3 c = base * (0.55 + 0.6 * max(n.y, 0.0));
  c += CORAL * diff * 1.5 * uIgnite;
  c += env(r, L) * mix(0.1, 1.0, fres);
  c += CORAL * spec * 2.2 * uIgnite;

  // Light from the ² gathering inside the glass near its corner.
  vec2 cornerUv = (q.xy - BIG_C.xy) / BIG_B.xy;
  float nearCorner = exp(-length(cornerUv - vec2(1.0)) * 1.6);
  c += CORAL * nearCorner * 0.22 * uIgnite;

  // Task squares on the face: a faint grid; now and then a wave lights a few on the way to the ².
  if (abs(nq.z) > 0.9) {
    vec2 uv = (q.xy - BIG_C.xy) / BIG_B.xy;             // -1..1 across the face
    vec2 g = (uv * 0.5 + 0.5) * 10.0;
    vec2 cell = floor(g);
    vec2 f = fract(g) - 0.5;
    float sq = step(max(abs(f.x), abs(f.y)), 0.24) - step(max(abs(f.x), abs(f.y)), 0.21);
    float edgeFade = smoothstep(0.0, 0.08, 1.0 - max(abs(uv.x), abs(uv.y)));
    c += MIST * sq * 0.018 * edgeFade;
    // The check: now and then a fine line sweeps across the glass toward the ², lighting the squares it passes.
    float d = (uv.x + uv.y) * 0.5;
    float sweep = mix(-1.5, 1.6, fract(uTime * 0.075));
    float line = exp(-pow((d - sweep) / 0.012, 2.0));
    float near = exp(-pow((d - sweep + 0.06) / 0.09, 2.0));
    float solid = step(max(abs(f.x), abs(f.y)), 0.24);
    float pick = step(0.55, hash(cell));
    c += MIST * line * 0.32 * edgeFade * uIgnite;
    c += MIST * solid * pick * near * 0.16 * edgeFade * uIgnite;
  }
  return c;
}

void main() {
  float t = uTime;
  float yaw = 0.38 * sin(t * 0.19) - 0.42 + uLean.x * 0.32 + uScroll * 0.9;
  float pitch = 0.18 * sin(t * 0.15 + 1.3) + 0.26 - uLean.y * 0.22 - uScroll * 0.55;
  float roll = 0.05 * sin(t * 0.11);
  // rot takes a world point into object space.
  rot = rotZ(-roll) * rotX(-pitch) * rotY(-yaw);

  vec2 p = (gl_FragCoord.xy - uCenter) / uSize;          // 1.0 = half the big square
  // Pinhole camera: one world unit at z = 0 is uSize pixels on screen.
  vec3 ro = vec3(0.0, 0.0, CAMZ);
  vec3 rd = normalize(vec3(p, -CAMZ));

  // Light only: the ²'s glow, from how close the ray passes to it.
  vec3 sw = transpose3(rot) * SMALL_C;
  vec3 toS = sw - ro;
  float along = dot(toS, rd);
  float miss = length(toS - rd * along);
  float glow = (0.5 / (1.0 + miss * miss * 2.6) + 0.32 * exp(-miss * miss * 10.0)) * uIgnite;
  vec3 light = CORAL * glow * 0.9 * (1.0 - 0.6 * uScroll);

  // March only rays that come near the mark.
  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float b = dot(ro, rd);
  float cc = dot(ro, ro) - 2.4 * 2.4;
  float h = b * b - cc;
  if (h > 0.0) {
    float tt = -b - sqrt(h);
    float tEnd = -b + sqrt(h);
    float id = 0.0;
    float minD = 1e9, minT = tt;
    float px = 1.0 / uSize;                               // one pixel, in p units
    for (int i = 0; i < 90; i++) {
      vec2 m = map(ro + rd * tt);
      if (m.x < minD) { minD = m.x; minT = tt; }
      if (m.x < 0.0008 * tt) { id = m.y; break; }
      tt += m.x * 0.9;
      if (tt > tEnd) break;
    }
    // Footprint of a pixel at this distance, for soft (antialiased) silhouette edges.
    float foot = px * minT / CAMZ * 1.4;
    if (id > 0.5) {
      col = shade(ro + rd * tt, rd, id);
      alpha = 1.0;
    } else if (minD < foot) {
      vec3 pos = ro + rd * minT;
      col = shade(pos, rd, map(pos).y);
      alpha = 1.0 - smoothstep(0.0, foot, minD);
    }
    // The glass sits in front of part of the glow; light still bleeds round its edges.
    if (alpha > 0.0) light *= mix(1.0, id > 1.5 ? 0.0 : 0.12, alpha);
  }

  // Fine grain against banding in the glow.
  float g = (hash(gl_FragCoord.xy + fract(t) * 17.0) - 0.5) / 255.0;
  // Premultiplied: the glass is opaque; the glow (alpha 0) is added light.
  gl_FragColor = vec4(col * alpha + light + g, alpha);
}
`;

export function startMark(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' });
  if (!gl) return;

  // Compile without blocking the page where the browser can (KHR_parallel_shader_compile): ask for the
  // program, then check back on later frames instead of waiting for it. Errors are only read once it's done.
  const shader = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };
  const vs = shader(gl.VERTEX_SHADER, VERT);
  const fs = shader(gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  const parallel = gl.getExtension('KHR_parallel_shader_compile');
  const whenReady = (go: () => void) => {
    if (parallel && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
      requestAnimationFrame(() => whenReady(go));
      return;
    }
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn(gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog));
      return;
    }
    go();
  };
  whenReady(() => run(gl, canvas, prog));
}

function run(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, prog: WebGLProgram) {
  gl.useProgram(prog);

  // One triangle that covers the screen.
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const U = { res: u('uRes'), center: u('uCenter'), size: u('uSize'), time: u('uTime'), lean: u('uLean'), scroll: u('uScroll'), ignite: u('uIgnite') };

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = canvas.closest('section') ?? canvas;
  let scale = Math.min(devicePixelRatio || 1, innerWidth < 800 ? 1 : 1.5);
  let w = 0, h = 0;

  // Where the mark sits and how big, by screen shape (pixels, origin top-left; flipped for GL below).
  const layout = () => {
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (cw >= 1100) return { x: cw * 0.795, y: ch * 0.5, s: Math.min(cw * 0.105, ch * 0.2) };
    if (cw >= 640) return { x: cw * 0.66, y: ch * 0.3, s: Math.min(cw * 0.2, ch * 0.17) };
    return { x: cw * 0.5, y: ch * 0.31, s: Math.min(cw * 0.23, ch * 0.12) };
  };

  const resize = () => {
    w = Math.max(1, Math.round(canvas.clientWidth * scale));
    h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  };

  const lean = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!still && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (e) => {
      lean.tx = (e.clientX / innerWidth) * 2 - 1;
      lean.ty = (e.clientY / innerHeight) * 2 - 1;
    }, { passive: true });
  }

  let t0 = performance.now();
  let clock = 8.0;          // start mid-turn, not at the dullest angle
  let last = 0;
  let ignite = still ? 1 : 0;
  let running = false, raf = 0;
  let slowFrames = 0, frames = 0;

  const draw = (ig: number) => {
    const L = layout();
    const rect = hero.getBoundingClientRect();
    const scrolled = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
    lean.x += (lean.tx - lean.x) * 0.04;
    lean.y += (lean.ty - lean.y) * 0.04;
    gl.uniform2f(U.res, w, h);
    gl.uniform2f(U.center, L.x * scale, h - L.y * scale);
    gl.uniform1f(U.size, L.s * scale);
    gl.uniform1f(U.time, clock);
    gl.uniform2f(U.lean, lean.x, lean.y);
    gl.uniform1f(U.scroll, scrolled);
    gl.uniform1f(U.ignite, ig);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now: number) => {
    if (!running) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    clock += dt;
    if (ignite < 1) ignite = Math.min(1, (now - t0) / 2200);
    draw(1 - Math.pow(1 - ignite, 3));
    // If frames keep running long, drop the resolution a step (once or twice), so it stays smooth.
    if (dt > 0.026) slowFrames++;
    if (++frames === 90) {
      if (slowFrames > 30 && scale > 0.55) { scale *= 0.72; resize(); }
      frames = 0; slowFrames = 0;
    }
    raf = requestAnimationFrame(frame);
  };

  const play = () => { if (running || still) return; running = true; last = 0; raf = requestAnimationFrame(frame); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  resize();
  new ResizeObserver(() => { resize(); if (still || !running) draw(still ? 1 : 1 - Math.pow(1 - ignite, 3)); }).observe(canvas);
  canvas.classList.add('is-on');
  t0 = performance.now();
  if (still) { draw(1); return; }
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible && !document.hidden ? play() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden || !visible ? stop() : play()));
  play();
}
