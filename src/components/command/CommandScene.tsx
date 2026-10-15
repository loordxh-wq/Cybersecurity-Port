"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SceneHandle } from "./scene";

interface Props {
  portrait: StaticImageData;
  alt: string;
  /** Text shown with the scene so nobody mistakes it for monitoring. */
  simulatedLabel: string;
}

/**
 * Hosts the WebGL scene. Server render is a CSS poster (rings, lattice dots and
 * the real portrait) so the hero is complete before any 3D loads. three.js is
 * imported only after mount, and the poster stays if WebGL is unavailable.
 * The core's horizontal position comes from the `--cx` custom property, which
 * CSS sets per breakpoint and mirrors for right-to-left languages.
 */
export function CommandScene({ portrait, alt, simulatedLabel }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowPower = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    const readCenter = () => parseFloat(getComputedStyle(host).getPropertyValue("--cx")) || 0.5;
    const scanTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-scan-sync]"));

    let handle: SceneHandle | null = null;
    let cancelled = false;
    let onMove: ((e: PointerEvent) => void) | null = null;
    let onScroll: (() => void) | null = null;
    let onResize: (() => void) | null = null;

    import("./scene")
      .then(({ createCommandScene }) =>
        createCommandScene(canvas, {
          portraitSrc: portrait.src,
          reduced: reducedQuery.matches,
          small: window.innerWidth < 768,
          lowPower,
          centerX: readCenter(),
          onReady: () => !cancelled && setLive(true),
          onScan: (p) => {
            for (const el of scanTargets) {
              el.style.setProperty("--scan", String(p));
              el.dataset.scanning = p >= 0 ? "true" : "false";
            }
          },
        }),
      )
      .then((h) => {
        if (cancelled) {
          h.dispose();
          return;
        }
        handle = h;
        onMove = (e) => h.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
        onScroll = () => h.setScroll(Math.min(1, Math.max(0, window.scrollY / (host.offsetHeight || 1))));
        onResize = () => h.setCenter(readCenter());
        if (!reducedQuery.matches) window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        onScroll();
      })
      .catch(() => {
        /* WebGL failed: the poster remains, which is a complete design on its own. */
      });

    return () => {
      cancelled = true;
      if (onMove) window.removeEventListener("pointermove", onMove);
      if (onScroll) window.removeEventListener("scroll", onScroll);
      if (onResize) window.removeEventListener("resize", onResize);
      handle?.dispose();
    };
  }, [portrait.src]);

  return (
    <div ref={hostRef} className="cc-scene" data-live={live ? "true" : "false"}>
      {/* Poster: complete without JavaScript, also the fallback when WebGL is unavailable. */}
      <div className="cc-poster" aria-hidden="true">
        <span className="cc-poster-glow" />
        <span className="cc-poster-lattice" />
        <span className="cc-poster-ring cc-poster-ring--1" />
        <span className="cc-poster-ring cc-poster-ring--2" />
        <span className="cc-poster-ring cc-poster-ring--3" />
      </div>
      <div className="cc-portrait">
        <Image src={portrait} alt={alt} priority sizes="(min-width: 1024px) 22rem, 12rem" className="cc-portrait-img" />
      </div>
      <canvas ref={canvasRef} className="cc-canvas" aria-hidden="true" />
      <p className="cc-sim">
        <span className="cc-sim-tag" aria-hidden="true" />
        {simulatedLabel}
      </p>
    </div>
  );
}
