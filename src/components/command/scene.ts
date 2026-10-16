/**
 * CYBER COMMAND — signature intelligence scene (WebGL via three.js).
 *
 * Story, not noise:
 *  1. Assemble  – scattered data converges into a lattice core.
 *  2. Identify  – Eli's real portrait sits at the centre, always unobstructed; an identify
 *                 sweep passes over it once and the tick crown draws in.
 *  3. Connect   – a simulated topology establishes and terminates links; packets travel them.
 *  4. Scan      – a scan field sweeps the structure every few seconds; points it passes light up.
 *
 * Everything is decorative and explicitly simulated: no data source, no counters, no claims.
 *
 * Why WebGL here: thousands of additive points, depth-correct occlusion around the portrait
 * and a per-point scan highlight are GPU work. On the CPU (prototype A) the same idea topped
 * out at a few hundred points and ~45 fps on a throttled phone.
 */
import type * as THREE from "three";

export interface SceneOptions {
  portraitSrc: string;
  reduced: boolean;
  small: boolean;
  lowPower: boolean;
  /** Horizontal position of the core as a fraction of the canvas width (already mirrored for RTL). */
  centerX: number;
  onReady: () => void;
  /** 0..1 progress of the current scan sweep, or -1 between sweeps. */
  onScan?: (progress: number) => void;
}

export interface SceneHandle {
  setPointer(x: number, y: number): void;
  setScroll(p: number): void;
  setCenter(fraction: number): void;
  dispose(): void;
}

const R_CORE = 1.45;
// Portrait radius. CSS mirrors it: diameter = 2 × 0.86 / (2 × 2.269) = 37.9% of the scene height.
const PORTRAIT_R = 0.86;
const SCAN_PERIOD = 7;
const SCAN_SWEEP = 2.6;

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
const easeInOut = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export async function createCommandScene(canvas: HTMLCanvasElement, opts: SceneOptions): Promise<SceneHandle> {
  const T = await import("three");

  const dprCap = opts.small || opts.lowPower ? 1.5 : 2;
  const renderer = new T.WebGLRenderer({ canvas, antialias: !opts.small, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(35, 1, 0.1, 100);
  // Slightly above the equator so rings and the scan field read as ellipses, not lines.
  const CAM = new T.Vector3(0, 1.05, 7.12);
  camera.position.copy(CAM);
  camera.lookAt(0, 0, 0);
  const HALF_H = Math.tan(T.MathUtils.degToRad(17.5)) * CAM.length();
  let centerX = opts.centerX;

  // `stage` carries the composition offset and scroll; `rig` carries rotation.
  const stage = new T.Group();
  const rig = new T.Group();
  stage.add(rig);
  scene.add(stage);

  const uniforms = {
    uTime: { value: 0 },
    uAssemble: { value: opts.reduced ? 1 : 0 },
    uScanY: { value: 99 },
    uPixelRatio: { value: renderer.getPixelRatio() },
  };

  /* ---------------------------------------------------------------- core lattice */
  const count = opts.small || opts.lowPower ? 1500 : 2800;
  const pos = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * golden;
    const shell = R_CORE * (i % 9 === 0 ? 0.985 : 1);
    pos.set([Math.cos(phi) * r * shell, y * shell, Math.sin(phi) * r * shell], i * 3);
    const d = 6 + Math.random() * 6;
    const u = Math.random() * 2 - 1;
    const t = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    scatter.set([Math.cos(t) * s * d, u * d * 0.6, Math.sin(t) * s * d], i * 3);
    seed[i] = Math.random();
  }
  const coreGeo = new T.BufferGeometry();
  coreGeo.setAttribute("position", new T.BufferAttribute(pos, 3));
  coreGeo.setAttribute("aStart", new T.BufferAttribute(scatter, 3));
  coreGeo.setAttribute("aSeed", new T.BufferAttribute(seed, 1));
  const coreMat = new T.ShaderMaterial({
    uniforms: { ...uniforms, uSize: { value: opts.small ? 2.1 : 2.4 }, uColor: { value: new T.Color("#7fdcff") }, uHot: { value: new T.Color("#ffffff") } },
    vertexShader: /* glsl */ `
      uniform float uTime, uAssemble, uScanY, uPixelRatio, uSize;
      attribute vec3 aStart; attribute float aSeed;
      varying float vAlpha; varying float vScan;
      void main() {
        float k = smoothstep(0.0, 1.0, clamp(uAssemble * 1.35 - aSeed * 0.35, 0.0, 1.0));
        vec3 p = mix(aStart, position, k);
        vec4 world = modelMatrix * vec4(p, 1.0);
        vec4 mv = viewMatrix * world;
        vec4 c = viewMatrix * modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        float facing = clamp((mv.z - c.z) / 2.9 + 0.5, 0.0, 1.0);
        // Keep Eli's face readable: points in front of the portrait thin out over it.
        float rr = length((mv.xy - c.xy) * (c.z / mv.z));
        float front = step(c.z, mv.z);
        float hole = mix(1.0, mix(0.15, 1.0, smoothstep(0.86, 1.08, rr)), front);
        float scan = 1.0 - smoothstep(0.0, 0.14, abs(world.y - uScanY));
        vScan = scan;
        float tw = 0.78 + 0.22 * sin(uTime * 1.6 + aSeed * 60.0);
        vAlpha = (0.22 + 0.78 * facing) * tw * k * hole;
        gl_PointSize = uSize * uPixelRatio * (1.0 + scan * 1.8) * (7.2 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor, uHot;
      varying float vAlpha; varying float vScan;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(mix(uColor, uHot, vScan), a * vAlpha * (0.75 + 1.1 * vScan));
      }`,
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
  });
  const core = new T.Points(coreGeo, coreMat);
  rig.add(core);

  /* ---------------------------------------------------------------- inner shell */
  const shellGeo = new T.EdgesGeometry(new T.IcosahedronGeometry(1.08, 1));
  const shellMat = new T.LineBasicMaterial({ color: "#8b7cff", transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false });
  const shell = new T.LineSegments(shellGeo, shellMat);
  rig.add(shell);

  /* ---------------------------------------------------------------- orbital rings with flowing dashes */
  const ringMat = (color: string, dashes: number, speed: number) =>
    new T.ShaderMaterial({
      uniforms: { uTime: uniforms.uTime, uOpacity: { value: opts.reduced ? 1 : 0 }, uColor: { value: new T.Color(color) }, uDashes: { value: dashes }, uSpeed: { value: speed } },
      vertexShader: `attribute float aU; varying float vU; void main(){ vU = aU; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform float uTime, uOpacity, uDashes, uSpeed; uniform vec3 uColor; varying float vU;
        void main(){ float f = fract(vU * uDashes - uTime * uSpeed); float dash = smoothstep(0.0,0.08,f) * (1.0 - smoothstep(0.42,0.5,f));
        gl_FragColor = vec4(uColor, (0.12 + 0.6 * dash) * uOpacity); }`,
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
    });
  const ringDefs = [
    { r: 1.95, tilt: [1.2, 0.0, 0.25], color: "#42d5f6", dashes: 46, speed: 0.12 },
    { r: 2.3, tilt: [1.48, 0.4, -0.5], color: "#8b7cff", dashes: 30, speed: -0.08 },
    { r: 2.75, tilt: [1.05, -0.3, 0.9], color: "#2f6bff", dashes: 64, speed: 0.05 },
  ];
  const rings: THREE.LineLoop[] = [];
  const ringMats: THREE.ShaderMaterial[] = [];
  for (const d of ringDefs) {
    const n = 256;
    const p = new Float32Array(n * 3);
    const u = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      p.set([Math.cos(a) * d.r, Math.sin(a) * d.r, 0], i * 3);
      u[i] = i / n;
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.BufferAttribute(p, 3));
    g.setAttribute("aU", new T.BufferAttribute(u, 1));
    const m = ringMat(d.color, d.dashes, d.speed);
    const loop = new T.LineLoop(g, m);
    loop.rotation.set(d.tilt[0]!, d.tilt[1]!, d.tilt[2]!);
    rig.add(loop);
    rings.push(loop);
    ringMats.push(m);
  }

  /* ---------------------------------------------------------------- simulated topology */
  const NODE_COUNT = opts.small ? 22 : 30;
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const u = Math.random() * 2 - 1;
    const t = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    // A compact shell just outside the lattice keeps links inside the scene, away from the type.
    const d = 1.95 + Math.random() * 0.6;
    nodes.push(new T.Vector3(Math.cos(t) * s * d, u * d * 0.72, Math.sin(t) * s * d));
  }
  const nodeGeo = new T.BufferGeometry();
  nodeGeo.setAttribute("position", new T.BufferAttribute(new Float32Array(nodes.flatMap((v) => [v.x, v.y, v.z])), 3));
  const flash = new Float32Array(NODE_COUNT);
  nodeGeo.setAttribute("aFlash", new T.BufferAttribute(flash, 1));
  const nodeMat = new T.ShaderMaterial({
    uniforms: { uPixelRatio: uniforms.uPixelRatio, uOpacity: { value: opts.reduced ? 1 : 0 } },
    vertexShader: `uniform float uPixelRatio; attribute float aFlash; varying float vF;
      void main(){ vF = aFlash; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = (5.0 + aFlash * 9.0) * uPixelRatio * (7.2 / -mv.z); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uOpacity; varying float vF;
      void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
        float core = smoothstep(0.22, 0.0, d); float halo = smoothstep(0.5, 0.0, d) * 0.35;
        vec3 col = mix(vec3(0.55,0.86,1.0), vec3(1.0), vF);
        gl_FragColor = vec4(col, (core + halo) * (0.55 + 0.45 * vF) * uOpacity); }`,
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
  });
  rig.add(new T.Points(nodeGeo, nodeMat));

  // Links: each establishes (grows), carries packets, then terminates (fades).
  const LINK_COUNT = opts.small ? 7 : 11;
  const SEG = 56;
  interface Link {
    line: THREE.Line;
    mat: THREE.ShaderMaterial;
    curve: THREE.QuadraticBezierCurve3;
    a: number;
    b: number;
    phase: 0 | 1 | 2 | 3; // 0 waiting, 1 grow, 2 hold, 3 fade
    t: number;
    hold: number;
    packet: number;
  }
  const linkMat = () =>
    new T.ShaderMaterial({
      uniforms: { uHead: { value: 0 }, uFade: { value: 1 }, uColor: { value: new T.Color("#5fe3ff") } },
      vertexShader: `attribute float aT; varying float vT; void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform float uHead, uFade; uniform vec3 uColor; varying float vT;
        void main(){ if (vT > uHead) discard; float hot = smoothstep(uHead - 0.22, uHead, vT);
          gl_FragColor = vec4(mix(uColor, vec3(1.0), hot * 0.6), (0.18 + 0.7 * hot) * uFade); }`,
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
    });
  const links: Link[] = [];
  const tmpCtrl = new T.Vector3();
  function curveFor(a: number, b: number) {
    const A = nodes[a]!;
    const B = nodes[b]!;
    tmpCtrl.copy(A).add(B).multiplyScalar(0.5);
    tmpCtrl.setLength(Math.max(tmpCtrl.length(), 1.6) + 0.3);
    return new T.QuadraticBezierCurve3(A.clone(), tmpCtrl.clone(), B.clone());
  }
  function pickPair(): [number, number] {
    for (;;) {
      const a = Math.floor(Math.random() * NODE_COUNT);
      const b = Math.floor(Math.random() * NODE_COUNT);
      if (a !== b && nodes[a]!.distanceTo(nodes[b]!) > 1.4) return [a, b];
    }
  }
  for (let i = 0; i < LINK_COUNT; i++) {
    const [a, b] = pickPair();
    const curve = curveFor(a, b);
    const g = new T.BufferGeometry().setFromPoints(curve.getPoints(SEG - 1));
    const at = new Float32Array(SEG);
    for (let k = 0; k < SEG; k++) at[k] = k / (SEG - 1);
    g.setAttribute("aT", new T.BufferAttribute(at, 1));
    const mat = linkMat();
    const line = new T.Line(g, mat);
    rig.add(line);
    links.push({ line, mat, curve, a, b, phase: opts.reduced ? 2 : 0, t: opts.reduced ? 0 : -i * 0.55, hold: 2.5 + Math.random() * 2.5, packet: Math.random() });
    if (opts.reduced) mat.uniforms.uHead!.value = 1;
  }
  function relink(l: Link) {
    const [a, b] = pickPair();
    l.a = a;
    l.b = b;
    l.curve = curveFor(a, b);
    (l.line.geometry.getAttribute("position") as THREE.BufferAttribute).copyArray(new Float32Array(l.curve.getPoints(SEG - 1).flatMap((v) => [v.x, v.y, v.z])));
    l.line.geometry.getAttribute("position").needsUpdate = true;
    l.line.geometry.computeBoundingSphere();
    l.hold = 2.5 + Math.random() * 2.5;
  }
  const packetPos = new Float32Array(LINK_COUNT * 3).fill(999);
  const packetGeo = new T.BufferGeometry();
  packetGeo.setAttribute("position", new T.BufferAttribute(packetPos, 3));
  const packetMat = new T.PointsMaterial({ color: "#ffffff", size: opts.small ? 0.075 : 0.065, transparent: true, opacity: 0.95, blending: T.AdditiveBlending, depthWrite: false });
  rig.add(new T.Points(packetGeo, packetMat));

  /* ---------------------------------------------------------------- scan field */
  const scanRingGeo = new T.RingGeometry(0.985, 1.0, 128);
  const scanRingMat = new T.MeshBasicMaterial({ color: "#a5f0ff", transparent: true, opacity: 0, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false });
  const scanRing = new T.Mesh(scanRingGeo, scanRingMat);
  scanRing.rotation.x = Math.PI / 2;
  const scanDiscMat = new T.ShaderMaterial({
    uniforms: { uOpacity: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uOpacity; varying vec2 vUv; void main(){ float r = length(vUv - 0.5) * 2.0;
      float a = smoothstep(1.0, 0.2, r) * 0.18 + smoothstep(1.0, 0.94, r) * smoothstep(0.86, 0.94, r) * 0.5;
      gl_FragColor = vec4(0.45, 0.88, 1.0, a * uOpacity); }`,
    transparent: true,
    side: T.DoubleSide,
    depthWrite: false,
    blending: T.AdditiveBlending,
  });
  const scanDisc = new T.Mesh(new T.CircleGeometry(1, 96), scanDiscMat);
  scanDisc.rotation.x = Math.PI / 2;
  const scanGroup = new T.Group();
  scanGroup.add(scanRing, scanDisc);
  stage.add(scanGroup); // world-aligned: the scan sweeps vertically regardless of rotation

  /* ---------------------------------------------------------------- portrait: decrypts at the centre */
  const tex = await new T.TextureLoader().loadAsync(opts.portraitSrc);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 4;
  const portraitMat = new T.ShaderMaterial({
    uniforms: { uTex: { value: tex }, uReveal: { value: opts.reduced ? 1 : 0 }, uScanY: uniforms.uScanY, uTime: uniforms.uTime },
    vertexShader: `varying vec2 vUv; varying vec3 vWorld; void main(){ vUv = uv; vWorld = (modelMatrix * vec4(position,1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vWorld,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTex; uniform float uReveal, uScanY, uTime; varying vec2 vUv; varying vec3 vWorld;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        float r = length(vUv - 0.5) * 2.0;
        if (r > 1.0) discard;
        vec2 tuv = (vUv - 0.5) * 0.9 + vec2(0.49, 0.52);
        vec3 col = texture2D(uTex, tuv).rgb;
        // A light cool grade only: the face keeps its natural tone.
        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(vec3(lum) * vec3(0.86, 0.95, 1.08), col, 0.8);
        // Only the outer rim dissolves, as a fine halftone of round dots that shrink toward
        // the edge, so the portrait joins the lattice without a hard frame. The face is never broken up.
        float fadeIn = smoothstep(1.0, 0.9, r);
        float dotR = 0.6 * fadeIn + 0.1 * hash(floor(vUv * 180.0));
        float dotD = length(fract(vUv * 180.0) - 0.5);
        float dots = (1.0 - smoothstep(dotR - 0.08, dotR + 0.08, dotD)) * sqrt(fadeIn);
        float vis = mix(dots, 1.0, smoothstep(0.92, 0.87, r));
        // Identify sweep (entrance) and the periodic scan: a soft, thin highlight.
        float idY = mix(1.1, -0.1, uReveal);
        float sweep = (1.0 - smoothstep(0.0, 0.05, abs(vUv.y - idY))) * step(uReveal, 0.999);
        float scan = 1.0 - smoothstep(0.0, 0.03, abs(vWorld.y - uScanY));
        col += vec3(0.4, 0.85, 1.0) * (scan * 0.18 + sweep * 0.35);
        float edge = smoothstep(1.0, 0.97, r);
        float vignette = mix(1.0, 0.74, smoothstep(0.62, 1.0, r));
        gl_FragColor = vec4(col * vignette * vis, edge * vis);
      }`,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const portrait = new T.Mesh(new T.CircleGeometry(PORTRAIT_R, 96), portraitMat);
  // Drawn last and on top: no line, particle or ring ever crosses Eli's face.
  portrait.renderOrder = 10;
  stage.add(portrait);

  // Bezel: a fine ring and a slowly turning tick crown around the portrait.
  const bezel = new T.Mesh(new T.RingGeometry(PORTRAIT_R + 0.05, PORTRAIT_R + 0.058, 128), new T.MeshBasicMaterial({ color: "#cfe9ff", transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }));
  stage.add(bezel);
  const tickPts: number[] = [];
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const long = i % 8 === 0;
    const r1 = PORTRAIT_R + 0.1;
    const r2 = PORTRAIT_R + (long ? 0.2 : 0.14);
    tickPts.push(Math.cos(a) * r1, Math.sin(a) * r1, 0, Math.cos(a) * r2, Math.sin(a) * r2, 0);
  }
  const ticksGeo = new T.BufferGeometry();
  ticksGeo.setAttribute("position", new T.BufferAttribute(new Float32Array(tickPts), 3));
  const ticks = new T.LineSegments(ticksGeo, new T.LineBasicMaterial({ color: "#7fdcff", transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }));
  stage.add(ticks);

  /* ---------------------------------------------------------------- volumetric-style light */
  const glowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.25, "rgba(255,255,255,0.45)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  })();
  const glows = [
    // The wide navy wash lives in CSS (no overdraw); only the core's inner light is drawn here.
    { color: "#2f6bff", scale: 4.2, op: 0.4, z: -1.2 },
    { color: "#42d5f6", scale: 3.0, op: 0.2, z: -0.5 },
  ].map((d) => {
    const s = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: d.color, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }));
    s.scale.setScalar(d.scale);
    s.position.set(0, 0, d.z);
    s.userData.op = d.op;
    stage.add(s);
    return s;
  });

  /* ---------------------------------------------------------------- sizing */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    stage.position.x = (centerX - 0.5) * (w / (h / 2)) * HALF_H;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (opts.reduced) renderer.render(scene, camera);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  /* ---------------------------------------------------------------- loop */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let scroll = 0;
  let elapsed = 0;
  let last = performance.now();
  let raf = 0;
  let running = false;
  let visible = true;
  let readyFired = false;
  let tickAngle = 0;
  const tmp = new T.Vector3();
  const zAxis = new T.Vector3(0, 0, 1);
  const tickQ = new T.Quaternion();
  let lastScan = -2;
  const emitScan = (p: number) => {
    if (p === lastScan) return;
    lastScan = p;
    opts.onScan?.(p);
  };

  function update(dt: number) {
    elapsed += dt;
    uniforms.uTime.value = elapsed;
    const e = elapsed;

    // Entrance timeline.
    if (!opts.reduced) {
      uniforms.uAssemble.value = easeOut((e - 0.1) / 1.7);
      shellMat.opacity = 0.16 * easeOut((e - 0.6) / 1.2);
      for (const m of ringMats) m.uniforms.uOpacity!.value = easeOut((e - 0.7) / 1.2);
      nodeMat.uniforms.uOpacity!.value = easeOut((e - 1.2) / 1.0);
      portraitMat.uniforms.uReveal!.value = easeInOut((e - 0.7) / 1.3);
    }
    const intro = opts.reduced ? 1 : easeOut((e - 1.0) / 1.2);
    (bezel.material as THREE.MeshBasicMaterial).opacity = 0.22 * intro;
    (ticks.material as THREE.LineBasicMaterial).opacity = 0.3 * intro;
    for (const g of glows) (g.material as THREE.SpriteMaterial).opacity = (g.userData.op as number) * (opts.reduced ? 1 : easeOut(e / 1.6));

    // Motion: slow rotation, eased pointer parallax.
    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;
    if (!opts.reduced) rig.rotation.y += dt * 0.07;
    rig.rotation.x = -0.08 + pointer.y * 0.16;
    rig.rotation.z = pointer.x * -0.06;
    stage.rotation.y = pointer.x * 0.22;
    tickAngle -= dt * 0.04;

    // Scroll: the scene recedes as the visitor moves into the story.
    camera.position.copy(CAM).multiplyScalar(1 + scroll * 0.45);
    camera.lookAt(0, 0, 0);
    stage.position.y = scroll * 0.9;

    // Scan sweep every SCAN_PERIOD seconds after the entrance.
    const scanT = e - 2.6;
    if (scanT > 0 && !opts.reduced) {
      const ph = scanT % SCAN_PERIOD;
      if (ph < SCAN_SWEEP) {
        const p = easeInOut(ph / SCAN_SWEEP);
        const y = R_CORE + 0.15 - p * (2 * R_CORE + 0.3);
        uniforms.uScanY.value = y + stage.position.y;
        const rr = Math.sqrt(Math.max(R_CORE * R_CORE - y * y, 0.0001));
        scanGroup.position.y = y;
        scanGroup.scale.setScalar(rr);
        const fade = Math.sin(Math.PI * p);
        scanRingMat.opacity = 0.75 * fade;
        scanDiscMat.uniforms.uOpacity!.value = fade;
        emitScan(p);
      } else {
        uniforms.uScanY.value = 99;
        scanRingMat.opacity = 0;
        scanDiscMat.uniforms.uOpacity!.value = 0;
        emitScan(-1);
      }
    }

    // Topology lifecycle.
    for (let i = 0; i < flash.length; i++) flash[i] = Math.max(0, flash[i]! - dt * 1.4);
    links.forEach((l, i) => {
      if (opts.reduced) {
        l.curve.getPoint(0.6, tmp);
        packetPos.set([tmp.x, tmp.y, tmp.z], i * 3);
        return;
      }
      l.t += dt;
      if (l.phase === 0 && l.t >= 0 && e > 1.6) {
        l.phase = 1;
        l.t = 0;
      }
      if (l.phase === 1) {
        l.mat.uniforms.uHead!.value = easeInOut(l.t / 1.1);
        l.mat.uniforms.uFade!.value = 1;
        if (l.t >= 1.1) {
          l.phase = 2;
          l.t = 0;
          flash[l.b] = 1;
        }
      } else if (l.phase === 2) {
        l.packet = (l.packet + dt * 0.55) % 1;
        l.curve.getPoint(l.packet, tmp);
        packetPos.set([tmp.x, tmp.y, tmp.z], i * 3);
        if (l.t >= l.hold) {
          l.phase = 3;
          l.t = 0;
        }
      } else if (l.phase === 3) {
        l.mat.uniforms.uFade!.value = 1 - l.t / 0.8;
        packetPos.set([999, 999, 999], i * 3);
        if (l.t >= 0.8) {
          relink(l);
          l.phase = 1;
          l.t = -Math.random() * 1.2;
          l.mat.uniforms.uHead!.value = 0;
        }
      } else {
        packetPos.set([999, 999, 999], i * 3);
      }
    });
    (nodeGeo.getAttribute("aFlash") as THREE.BufferAttribute).needsUpdate = true;
    (packetGeo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

    // The portrait, bezel and ticks always face the camera; the lattice turns around them.
    portrait.quaternion.copy(camera.quaternion);
    bezel.quaternion.copy(camera.quaternion);
    ticks.quaternion.copy(camera.quaternion).multiply(tickQ.setFromAxisAngle(zAxis, tickAngle));
  }

  // Adaptive resolution: if frames stay slow after the entrance, render fewer pixels.
  let sampleSum = 0;
  let sampleN = 0;
  function adapt(rawDt: number) {
    if (elapsed < 2.5) return;
    sampleSum += rawDt;
    sampleN++;
    if (sampleN < 60) return;
    const mean = sampleSum / sampleN;
    sampleSum = 0;
    sampleN = 0;
    const pr = renderer.getPixelRatio();
    if (mean > 0.028 && pr > 0.75) {
      const next = pr > 1 ? 1 : 0.75;
      renderer.setPixelRatio(next);
      uniforms.uPixelRatio.value = next;
      resize();
    }
  }

  function frame(now: number) {
    const raw = (now - last) / 1000;
    const dt = Math.min(0.1, raw);
    last = now;
    adapt(raw);
    update(dt);
    renderer.render(scene, camera);
    if (!readyFired) {
      readyFired = true;
      opts.onReady();
    }
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running || opts.reduced || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  if (opts.reduced) {
    // One composed still frame: assembled, decrypted, a few links established.
    update(0);
    renderer.render(scene, camera);
    opts.onReady();
  } else {
    start();
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) start();
    else stop();
  });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);

  return {
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
    },
    setScroll(p) {
      scroll = p;
      if (opts.reduced) {
        update(0);
        renderer.render(scene, camera);
      }
    },
    setCenter(fraction) {
      centerX = fraction;
      resize();
      if (opts.reduced) renderer.render(scene, camera);
    },
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      tex.dispose();
      glowTex.dispose();
      renderer.dispose();
    },
  };
}
