/**
 * The Me² mark in light (hero): a window onto the work.
 *
 * A ray-marched scene in plain WebGL, no libraries: a dark glass square (the big square of the mark) and a small
 * coral square at its top-right corner (the ²), which glows and lights the glass. The face of the glass is clear:
 * behind it sits real HTML (the screen: a page being designed, an AI role drafting, the Command Centre board),
 * which this script pins to the face with a CSS perspective transform worked out from the same rotation the
 * shader uses, so the glass, its reflections and the screen move as one object.
 *
 * - Starts dark and "ignites" over about two seconds.
 * - Leans toward the pointer; tips back as the hero scrolls away.
 * - Pauses off-screen and in background tabs; one still frame for reduced motion.
 * - Compiles without blocking where the browser can, and lowers its resolution if frames run slow.
 * The canvas is transparent wherever there is no glass: the glow is added light over the hero's CSS background.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/** Shared with the screen maths below: half the clear part of the face, in units of the big square's half-width. */
const FACE = 0.925;
const CAMZ = 7.0;
const SLAB_Z = 0.13;

const FRAG = `
precision highp float;
uniform vec2 uCenter;   // where the big square's centre sits, in canvas pixels (origin bottom-left)
uniform float uSize;    // half the big square's width, in canvas pixels
uniform float uTime;
uniform mat3 uRot;      // world -> object rotation (worked out in JS, shared with the screen)
uniform float uScroll;  // 0 at the top, 1 when the hero has scrolled away
uniform float uIgnite;  // 0..1, the ² lighting up

const vec3 CORAL = vec3(0.906, 0.471, 0.361);
const float CAMZ = ${CAMZ.toFixed(1)};
const float FACE = ${FACE};
const vec3 BIG_B = vec3(1.0, 1.0, ${SLAB_Z});
const vec3 SMALL_C = vec3(1.31, 1.1, 0.0);
const vec3 SMALL_B = vec3(0.21, 0.21, ${SLAB_Z});

mat3 rot;

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

// Scene in object space: x = distance, y = 1 for the glass, 2 for the coral square.
vec2 mapObj(vec3 q) {
  float a = sdRoundBox(q, BIG_B, 0.07);
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

// GLSL ES 1.0 has no transpose(); rotations are orthonormal, so the transpose is the inverse.
mat3 transpose3(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]);
}

// The studio the glass reflects: a soft light overhead, a cool strip on the left, the ²'s warm light,
// and two long strip lights in front whose reflections sweep across the face as it turns.
vec3 env(vec3 r, vec3 toCoral) {
  vec3 c = vec3(0.012, 0.025, 0.04);
  c += smoothstep(0.25, 0.95, r.y) * smoothstep(1.0, 0.2, abs(r.x)) * vec3(0.5, 0.56, 0.62) * 0.85;
  c += smoothstep(0.6, 0.98, -r.x) * vec3(0.3, 0.36, 0.42) * 0.6;
  float front = smoothstep(0.0, 0.5, r.z);
  c += exp(-pow((r.x + 0.3) / 0.06, 2.0)) * front * vec3(0.55, 0.62, 0.7) * 0.3;
  c += exp(-pow((r.y - 0.4) / 0.08, 2.0)) * front * vec3(0.5, 0.57, 0.65) * 0.16;
  c += pow(max(dot(r, toCoral), 0.0), 6.0) * CORAL * 0.9 * uIgnite;
  return c;
}

// Colour (premultiplied) and coverage of the surface at pos.
vec4 shade(vec3 pos, vec3 rd, float id) {
  vec3 n = normalAt(pos);
  vec3 v = -rd;
  vec3 lightPos = transpose3(rot) * SMALL_C;
  vec3 toL = lightPos - pos;
  float dL = length(toL);
  vec3 L = toL / dL;
  vec3 q = rot * pos;
  vec3 nq = rot * n;

  if (id > 1.5) {
    // The ²: warm and bright, a little hotter at the centre of its face.
    vec2 uv = (q.xy - SMALL_C.xy) / SMALL_B.xy;
    float core = 1.0 - smoothstep(0.0, 1.4, length(uv));
    vec3 c = CORAL * (0.9 + 0.22 * core) + vec3(1.0, 0.85, 0.75) * 0.06 * core * core;
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    c = mix(c, CORAL * 0.7, rim * 0.5);
    return vec4(mix(vec3(0.05, 0.06, 0.08), c, uIgnite), 1.0);
  }

  float fres = 0.035 + 0.965 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
  vec3 r = reflect(rd, n);
  vec3 refl = env(r, L) * mix(0.1, 1.0, fres);
  float falloff = 1.0 / (1.0 + dL * dL * 0.45);
  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 70.0) * falloff;
  // Light from the ² gathering in the glass near its corner.
  float nearCorner = exp(-length(q.xy - vec2(1.0)) * 1.8);

  // The clear face: the screen behind shows through, with the glass's reflections over it.
  if (nq.z > 0.95 && abs(q.x) < FACE && abs(q.y) < FACE) {
    float a = 0.1 + 0.6 * fres;
    vec3 c = vec3(0.03, 0.065, 0.1) * a + refl * 0.9 + CORAL * (nearCorner * 0.12 + spec * 1.5) * uIgnite;
    return vec4(c, a);
  }

  // The rest of the glass: deep navy, polished, lit warm from the ² and cool from the studio.
  float diff = max(dot(n, L), 0.0) * falloff;
  vec3 base = vec3(0.035, 0.078, 0.125);
  vec3 c = base * (0.55 + 0.6 * max(n.y, 0.0));
  c += CORAL * diff * 1.5 * uIgnite;
  c += refl;
  c += CORAL * spec * 2.2 * uIgnite;
  c += CORAL * nearCorner * 0.18 * uIgnite;
  return vec4(c, 1.0);
}

void main() {
  rot = uRot;
  vec2 p = (gl_FragCoord.xy - uCenter) / uSize;          // 1.0 = half the big square
  // Pinhole camera: one world unit at z = 0 is uSize pixels on screen.
  vec3 ro = vec3(0.0, 0.0, CAMZ);
  vec3 rd = normalize(vec3(p, -CAMZ));

  // Light only: the ²'s glow, from how close the ray passes to it.
  vec3 sw = transpose3(rot) * SMALL_C;
  vec3 toS = sw - ro;
  float along = dot(toS, rd);
  float miss = length(toS - rd * along);
  float glow = (0.42 / (1.0 + miss * miss * 3.2) + 0.26 * exp(-miss * miss * 14.0)) * uIgnite;
  vec3 light = CORAL * glow * 0.9 * (1.0 - 0.6 * uScroll);

  // March only rays that come near the mark.
  vec4 col = vec4(0.0);
  float b = dot(ro, rd);
  float cc = dot(ro, ro) - 2.6 * 2.6;
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
    } else if (minD < foot) {
      vec3 pos = ro + rd * minT;
      vec4 s = shade(pos, rd, map(pos).y);
      float cover = 1.0 - smoothstep(0.0, foot, minD);
      col = vec4(s.rgb * cover, s.a * cover);
    }
    // The glass sits in front of part of the glow (light still bleeds round its edges); the ² is the light itself.
    if (col.a > 0.0) light *= mix(1.0, id > 1.5 ? 0.0 : 0.12, col.a);
  }

  // Fine grain against banding in the glow.
  float g = (hash(gl_FragCoord.xy + fract(uTime) * 17.0) - 0.5) / 255.0;
  // Premultiplied: colour already carries its coverage; the glow (alpha 0) is added light.
  gl_FragColor = vec4(col.rgb + light + g, col.a);
}
`;

type M3 = number[]; // row-major 3x3
const mul = (a: M3, b: M3): M3 => {
  const r: M3 = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
  return r;
};
const rx = (t: number): M3 => [1, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t)];
const ry = (t: number): M3 => [Math.cos(t), 0, Math.sin(t), 0, 1, 0, -Math.sin(t), 0, Math.cos(t)];
const rz = (t: number): M3 => [Math.cos(t), -Math.sin(t), 0, Math.sin(t), Math.cos(t), 0, 0, 0, 1];
/** Column-major copy for gl.uniformMatrix3fv. */
const colMajor = (m: M3) => new Float32Array([m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]);

/**
 * CSS matrix3d that maps a W×W element (transform-origin 0 0) onto the quad q0..q3
 * (top-left, top-right, bottom-right, bottom-left). Projective square-to-quad (Heckbert).
 */
function quadMatrix(W: number, q: [number, number][]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const den = dx1 * dy2 - dx2 * dy1 || 1e-9;
  const g = (sx * dy2 - dx2 * sy) / den;
  const h = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + h * y3, f = y0;
  return `matrix3d(${[a / W, d / W, 0, g / W, b / W, e / W, 0, h / W, 0, 0, 1, 0, c, f, 0, 1].map((n) => n.toFixed(6)).join(',')})`;
}

export function startMark(canvas: HTMLCanvasElement, screen: HTMLElement | null) {
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
  const whenReady = () => {
    if (parallel && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) { requestAnimationFrame(whenReady); return; }
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog)); return; }
    run(gl, canvas, screen, prog);
  };
  whenReady();
}

function run(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, screen: HTMLElement | null, prog: WebGLProgram) {
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const U = { center: u('uCenter'), size: u('uSize'), time: u('uTime'), rot: u('uRot'), scroll: u('uScroll'), ignite: u('uIgnite') };

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = canvas.closest('section') ?? canvas;
  let scale = Math.min(devicePixelRatio || 1, innerWidth < 800 ? 1 : 1.5);
  let w = 0, h = 0;

  // Where the big square's centre sits and half its width, by screen shape (CSS pixels, origin top-left).
  const layout = () => {
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (cw >= 1100) return { x: cw * 0.665, y: ch * 0.5, s: Math.min(cw * 0.135, ch * 0.26) };
    if (cw >= 640) return { x: cw * 0.6, y: ch * 0.32, s: Math.min(cw * 0.2, ch * 0.17) };
    return { x: cw * 0.42, y: ch * 0.3, s: Math.min(cw * 0.29, ch * 0.135) };
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

  // The screen: pinned to the clear part of the face (object space ±FACE on x and y, at the front of the slab).
  const placeScreen = (R: M3, L: { x: number; y: number; s: number }) => {
    if (!screen) return;
    const corners: [number, number][] = [[-FACE, FACE], [FACE, FACE], [FACE, -FACE], [-FACE, -FACE]];
    const quad = corners.map(([ox, oy]) => {
      // world = Rᵀ · object
      const px = R[0] * ox + R[3] * oy + R[6] * SLAB_Z;
      const py = R[1] * ox + R[4] * oy + R[7] * SLAB_Z;
      const pz = R[2] * ox + R[5] * oy + R[8] * SLAB_Z;
      const k = CAMZ / (CAMZ - pz);
      return [L.x + px * k * L.s, L.y - py * k * L.s] as [number, number];
    });
    screen.style.transform = quadMatrix(screen.offsetWidth || 1, quad);
  };

  let t0 = performance.now();
  let clock = 6.0;
  let last = 0;
  let ignite = still ? 1 : 0;
  let running = false, raf = 0;
  let slowFrames = 0, frames = 0;

  const draw = (ig: number) => {
    const L = layout();
    const rect = hero.getBoundingClientRect();
    const scrolled = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
    lean.x += (lean.tx - lean.x) * 0.05;
    lean.y += (lean.ty - lean.y) * 0.05;
    const t = clock;
    // Gentle enough that the screen stays easy to read.
    const yaw = -0.2 + 0.1 * Math.sin(t * 0.21) + lean.x * 0.14 + scrolled * 0.5;
    const pitch = 0.07 + 0.05 * Math.sin(t * 0.17 + 1.3) - lean.y * 0.1 + scrolled * 0.6;
    const roll = 0.02 * Math.sin(t * 0.13);
    const R = mul(rz(-roll), mul(rx(-pitch), ry(-yaw)));
    gl.uniform2f(U.center, L.x * scale, h - L.y * scale);
    gl.uniform1f(U.size, L.s * scale);
    gl.uniform1f(U.time, t);
    gl.uniformMatrix3fv(U.rot, false, colMajor(R));
    gl.uniform1f(U.scroll, scrolled);
    gl.uniform1f(U.ignite, ig);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    placeScreen(R, L);
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
  // Place the screen on the glass before switching it over, so it never shows at the top-left for a frame.
  draw(still ? 1 : 0);
  hero.classList.add('is-gl');
  new ResizeObserver(() => { resize(); if (still || !running) draw(still ? 1 : 1 - Math.pow(1 - ignite, 3)); }).observe(canvas);
  canvas.classList.add('is-on');
  t0 = performance.now();
  if (still) {
    draw(1);
    addEventListener('scroll', () => draw(1), { passive: true });
    return;
  }
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible && !document.hidden ? play() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden || !visible ? stop() : play()));
  play();
}
