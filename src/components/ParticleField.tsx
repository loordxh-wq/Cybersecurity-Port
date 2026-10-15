"use client";

import { useEffect, useRef } from "react";

/**
 * Fine network traces clustered around the portrait frame (#portrait-frame).
 * Progressive enhancement only: a single 2D canvas, capped node count and DPR,
 * paused when off-screen or in a background tab, and a single static frame for
 * visitors who prefer reduced motion. Decorative, so hidden from assistive tech.
 */
interface Node {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  r: number;
  violet: boolean;
}

export function ParticleField({ anchorId }: { anchorId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    function seed() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const anchor = document.getElementById(anchorId)?.getBoundingClientRect();
      const cx = anchor ? anchor.left - rect.left + anchor.width / 2 : width * 0.7;
      const cy = anchor ? anchor.top - rect.top + anchor.height / 2 : height * 0.45;
      const radius = anchor ? Math.max(anchor.width, anchor.height) / 2 : 160;

      const count = width < 640 ? 26 : width < 1024 ? 40 : 56;
      nodes = Array.from({ length: count }, (_, i) => {
        const clustered = i < count * 0.65;
        let hx: number;
        let hy: number;
        if (clustered) {
          const angle = Math.random() * Math.PI * 2;
          const dist = radius * (0.75 + Math.random() * 0.65);
          hx = cx + Math.cos(angle) * dist;
          hy = cy + Math.sin(angle) * dist;
        } else {
          hx = Math.random() * width;
          hy = Math.random() * height;
        }
        return {
          x: hx,
          y: hy,
          hx,
          hy,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() < 0.15 ? 1.8 : 1.1,
          violet: Math.random() < 0.12,
        };
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const ox = pointer.x * 8;
      const oy = pointer.y * 8;
      const maxDist = width < 640 ? 90 : 120;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            ctx!.strokeStyle = `rgba(66, 213, 246, ${0.16 * (1 - d / maxDist)})`;
            ctx!.lineWidth = 0.7;
            ctx!.beginPath();
            ctx!.moveTo(a.x + ox, a.y + oy);
            ctx!.lineTo(b.x + ox, b.y + oy);
            ctx!.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx!.fillStyle = n.violet ? "rgba(139, 124, 255, 0.75)" : "rgba(159, 232, 250, 0.7)";
        ctx!.beginPath();
        ctx!.arc(n.x + ox, n.y + oy, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function step() {
      for (const n of nodes) {
        n.vx += (n.hx - n.x) * 0.0006 + (Math.random() - 0.5) * 0.01;
        n.vy += (n.hy - n.y) * 0.0006 + (Math.random() - 0.5) * 0.01;
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.x += n.vx;
        n.y += n.vy;
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    seed();
    draw();
    start();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      seed();
      draw();
    });
    ro.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
    };
    if (finePointer && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [anchorId]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
