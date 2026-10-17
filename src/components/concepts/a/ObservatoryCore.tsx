"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

/**
 * Concept A, "Threat Observatory": a 3D point-cloud sphere rendered with a
 * hand-written perspective projection on two 2D canvases. The far hemisphere is
 * drawn behind Eli's portrait and the near hemisphere in front of it, so he sits
 * inside the core. Data trajectories arc across the surface and short streams
 * flow inward to the analyst. Purely decorative: no data, no counters, no claims.
 *
 * Performance: no WebGL, no library. Point count and DPR scale down on small or
 * low-power screens, the loop pauses off-screen and in background tabs, and a
 * single still frame is drawn for prefers-reduced-motion.
 */

type V3 = [number, number, number];

interface Arc {
  a: V3;
  b: V3;
  h: number;
  t: number;
  speed: number;
  violet: boolean;
}

interface Stream {
  p: V3;
  t: number;
  speed: number;
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function fibonacciSphere(n: number): V3[] {
  const pts: V3[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * GOLDEN;
    pts.push([Math.cos(phi) * r, y, Math.sin(phi) * r]);
  }
  return pts;
}

function randomUnit(): V3 {
  const u = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  return [r * Math.cos(t), u, r * Math.sin(t)];
}

function slerp(a: V3, b: V3, u: number): V3 {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-4) return a;
  const s = Math.sin(om);
  const k1 = Math.sin((1 - u) * om) / s;
  const k2 = Math.sin(u * om) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

function newArc(): Arc {
  const a = randomUnit();
  let b = randomUnit();
  // Keep arcs medium-long so they read as trajectories, not specks.
  while (a[0] * b[0] + a[1] * b[1] + a[2] * b[2] > 0.55) b = randomUnit();
  return { a, b, h: 0.12 + Math.random() * 0.22, t: -Math.random() * 1.2, speed: 0.28 + Math.random() * 0.22, violet: Math.random() < 0.3 };
}

function newStream(): Stream {
  return { p: randomUnit(), t: -Math.random() * 2, speed: 0.45 + Math.random() * 0.3 };
}

export function ObservatoryCore({ portrait, alt }: { portrait: StaticImageData; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const back = backRef.current?.getContext("2d");
    const front = frontRef.current?.getContext("2d");
    if (!wrap || !back || !front) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

    let size = 0;
    let points: V3[] = [];
    let arcs: Arc[] = [];
    let streams: Stream[] = [];
    let yaw = 0.6;
    const pitch = -0.32;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let last = 0;
    let running = false;
    let visible = true;
    let lensSpin = 0;

    function setup() {
      size = wrap!.clientWidth;
      const small = size < 520;
      const dpr = Math.min(window.devicePixelRatio || 1, small || lowPower ? 1.5 : 2);
      for (const c of [backRef.current!, frontRef.current!]) {
        c.width = Math.round(size * dpr);
        c.height = Math.round(size * dpr);
      }
      back!.setTransform(dpr, 0, 0, dpr, 0, 0);
      front!.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = fibonacciSphere(small || lowPower ? 560 : 1150);
      arcs = Array.from({ length: small || lowPower ? 7 : 12 }, newArc);
      streams = Array.from({ length: small || lowPower ? 5 : 9 }, newStream);
    }

    function project(p: V3): [number, number, number, number] {
      const cy = Math.cos(yaw + pointer.x * 0.35);
      const sy = Math.sin(yaw + pointer.x * 0.35);
      const x = p[0] * cy + p[2] * sy;
      const z0 = -p[0] * sy + p[2] * cy;
      const pt = pitch + pointer.y * 0.2;
      const cp = Math.cos(pt);
      const sp = Math.sin(pt);
      const y = p[1] * cp - z0 * sp;
      const z = p[1] * sp + z0 * cp;
      const R = size * 0.37;
      const s = 3.4 / (3.4 - z);
      return [size / 2 + x * R * s, size / 2 + y * R * s, z, s];
    }

    const lensR = () => size * 0.17;
    const inLens = (x: number, y: number) => (x - size / 2) ** 2 + (y - size / 2) ** 2 < lensR() ** 2;

    function draw(dt: number) {
      back!.clearRect(0, 0, size, size);
      front!.clearRect(0, 0, size, size);

      // Limb light: a soft rim where the sphere meets space.
      const R0 = size * 0.37;
      const rim = back!.createRadialGradient(size / 2, size / 2, R0 * 0.82, size / 2, size / 2, R0 * 1.12);
      rim.addColorStop(0, "rgba(47,107,255,0)");
      rim.addColorStop(0.55, "rgba(66,160,255,0.16)");
      rim.addColorStop(1, "rgba(47,107,255,0)");
      back!.fillStyle = rim;
      back!.fillRect(0, 0, size, size);

      // Surface points: colour set once per canvas, only opacity varies.
      back!.fillStyle = "rgb(96, 142, 255)";
      front!.fillStyle = "rgb(178, 240, 255)";
      for (const p of points) {
        const [x, y, z] = project(p);
        if (z < 0) {
          back!.globalAlpha = 0.16 + 0.3 * (1 + z);
          back!.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
        } else {
          front!.globalAlpha = (0.42 + 0.55 * z) * (inLens(x, y) ? 0.4 : 1);
          const r = 1.1 + z * 1.3;
          front!.fillRect(x - r / 2, y - r / 2, r, r);
        }
      }
      back!.globalAlpha = 1;
      front!.globalAlpha = 1;

      // Latitude rings and meridians give the core a readable structure, split by depth.
      const rings: Array<(u: number) => V3> = [
        ...[-0.62, -0.32, 0, 0.32, 0.62].map((yy) => {
          const rr = Math.sqrt(1 - yy * yy);
          return (u: number): V3 => [Math.cos(u) * rr, yy, Math.sin(u) * rr];
        }),
        ...[0, Math.PI / 3, (2 * Math.PI) / 3].map((m) => (u: number): V3 => [Math.cos(u) * Math.cos(m), Math.sin(u), Math.cos(u) * Math.sin(m)]),
      ];
      for (const [ri, ring] of rings.entries()) {
        const equator = ri === 2;
        back!.beginPath();
        front!.beginPath();
        for (let i = 0; i < 140; i++) {
          if (!equator && i % 2 === 1) continue; // dotted
          const [x1, y1, z1] = project(ring((i / 140) * Math.PI * 2));
          const [x2, y2] = project(ring(((i + 1) / 140) * Math.PI * 2));
          const ctx = z1 < 0 ? back! : front!;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        back!.strokeStyle = `rgba(86,132,255,${equator ? 0.22 : 0.12})`;
        back!.lineWidth = equator ? 1 : 0.7;
        back!.stroke();
        front!.strokeStyle = `rgba(170,236,252,${equator ? 0.5 : 0.22})`;
        front!.lineWidth = equator ? 1 : 0.7;
        front!.stroke();
      }

      // Outer orbit with two satellites.
      const orbit = (u: number): V3 => [Math.cos(u) * 1.32, Math.sin(u) * 0.36, Math.sin(u) * 1.24];
      back!.beginPath();
      front!.beginPath();
      for (let i = 0; i < 160; i++) {
        const [x1, y1, z1] = project(orbit((i / 160) * Math.PI * 2));
        const [x2, y2] = project(orbit(((i + 1) / 160) * Math.PI * 2));
        const ctx = z1 < 0 ? back! : front!;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      back!.strokeStyle = "rgba(139, 124, 255, 0.12)";
      back!.lineWidth = 0.7;
      back!.stroke();
      front!.strokeStyle = "rgba(139, 124, 255, 0.3)";
      front!.lineWidth = 0.7;
      front!.stroke();
      for (const off of [0, Math.PI]) {
        const [x, y, z] = project(orbit(lensSpin * 0.6 + off));
        const ctx = z < 0 ? back! : front!;
        ctx.fillStyle = z < 0 ? "rgba(196,188,255,0.45)" : "rgba(226,222,255,0.95)";
        ctx.beginPath();
        ctx.arc(x, y, z < 0 ? 1.6 : 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Trajectories: a travelling head with a fading trail along a lifted great circle.
      front!.globalCompositeOperation = "lighter";
      back!.globalCompositeOperation = "lighter";
      for (const arc of arcs) {
        arc.t += dt * arc.speed;
        if (arc.t > 1.4) Object.assign(arc, newArc(), { t: 0 });
        if (arc.t <= 0) continue;
        const head = Math.min(arc.t, 1);
        const tail = Math.max(0, arc.t - 0.38);
        const segs = size < 520 ? 12 : 22;
        let prev: [number, number, number, number] | null = null;
        for (let i = 0; i <= segs; i++) {
          const u = tail + (head - tail) * (i / segs);
          const s = slerp(arc.a, arc.b, u);
          const lift = 1 + arc.h * Math.sin(Math.PI * u);
          const pr = project([s[0] * lift, s[1] * lift, s[2] * lift]);
          if (prev) {
            const ctx = pr[2] < 0 ? back! : front!;
            const k = i / segs;
            const a = k * k * (pr[2] < 0 ? 0.35 : 0.9) * (arc.t > 1 ? 1 - (arc.t - 1) / 0.4 : 1);
            ctx.strokeStyle = arc.violet ? `rgba(160,146,255,${a})` : `rgba(80,220,250,${a})`;
            ctx.lineWidth = 0.6 + k * 1.3;
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(pr[0], pr[1]);
            ctx.stroke();
          }
          prev = pr;
        }
        if (arc.t < 1 && prev) {
          const ctx = prev[2] < 0 ? back! : front!;
          const g = ctx.createRadialGradient(prev[0], prev[1], 0, prev[0], prev[1], 7);
          g.addColorStop(0, arc.violet ? "rgba(225,220,255,0.95)" : "rgba(220,250,255,0.95)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(prev[0], prev[1], 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Inward streams toward the analyst at the centre.
      for (const st of streams) {
        st.t += dt * st.speed;
        if (st.t > 1) Object.assign(st, newStream(), { t: 0 });
        if (st.t <= 0) continue;
        const e = st.t * st.t;
        for (let k = 0; k < 6; k++) {
          const u = Math.max(0, e - k * 0.025);
          const r = 1.05 - u * 0.9;
          const [x, y, z] = project([st.p[0] * r, st.p[1] * r, st.p[2] * r]);
          const ctx = z < 0 ? back! : front!;
          ctx.fillStyle = `rgba(170,236,252,${(1 - k / 6) * 0.7 * (1 - st.t * 0.6)})`;
          ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8);
        }
      }
      front!.globalCompositeOperation = "source-over";
      back!.globalCompositeOperation = "source-over";

      // Lens ring and ticks around the portrait.
      const c = size / 2;
      const r = lensR();
      front!.strokeStyle = "rgba(170,236,252,0.45)";
      front!.lineWidth = 1;
      front!.beginPath();
      front!.arc(c, c, r + 3, 0, Math.PI * 2);
      front!.stroke();
      const longTicks = new Path2D();
      const shortTicks = new Path2D();
      for (let i = 0; i < 72; i++) {
        const ang = (i / 72) * Math.PI * 2 + lensSpin * 0.15;
        const long = i % 6 === 0;
        const r1 = r + 8;
        const r2 = r + (long ? 16 : 11);
        const path = long ? longTicks : shortTicks;
        path.moveTo(c + Math.cos(ang) * r1, c + Math.sin(ang) * r1);
        path.lineTo(c + Math.cos(ang) * r2, c + Math.sin(ang) * r2);
      }
      front!.strokeStyle = "rgba(170,236,252,0.6)";
      front!.stroke(longTicks);
      front!.strokeStyle = "rgba(170,236,252,0.22)";
      front!.stroke(shortTicks);
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      yaw += dt * 0.12;
      lensSpin += dt;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      draw(dt);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    setup();
    if (reduce) {
      for (const a of arcs) a.t = 0.3 + Math.random() * 0.6;
      for (const s of streams) s.t = Math.random() * 0.8;
    }
    draw(0);
    start();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);
    const ro = new ResizeObserver(() => {
      setup();
      draw(0);
    });
    ro.observe(wrap);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
    };
    if (!reduce && window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative aspect-square w-full">
      <canvas ref={backRef} aria-hidden="true" className="absolute inset-0 size-full" />
      {/* Eli inside the core: real photo, cool-toned, edges dissolving into the sphere. */}
      <div className="absolute inset-[33%] overflow-hidden rounded-full shadow-[0_0_80px_10px_rgb(47_107_255/0.35)]">
        <Image
          src={portrait}
          alt={alt}
          priority
          sizes="(min-width: 1024px) 280px, 40vw"
          className="size-full object-cover object-[50%_38%] [filter:saturate(0.55)_contrast(1.08)]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[#2f6bff]/25 mix-blend-color" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle,transparent_52%,rgb(3_7_18/0.85)_78%)]"
        />
      </div>
      <canvas ref={frontRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
    </div>
  );
}
