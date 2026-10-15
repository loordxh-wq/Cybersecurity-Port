"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Concept B: a graphite monolith built from CSS 3D faces (no WebGL). Eli's photo
 * sits in a window carved into the front face; the verified credential is
 * engraved below it. The block turns a few degrees toward the pointer.
 */
export function Monolith({
  portrait,
  alt,
  engraving,
  caption,
}: {
  portrait: StaticImageData;
  alt: string;
  engraving: string;
  caption: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      el.style.setProperty("--px", cur.x.toFixed(4));
      el.style.setProperty("--py", cur.y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="mono-scene relative" style={{ "--px": 0, "--py": 0 } as CSSProperties}>
      {/* Floor shadow and cold reflection */}
      <div aria-hidden="true" className="absolute -bottom-10 left-1/2 h-16 w-[170%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(37_99_235/0.35),rgb(0_0_0/0.9)_55%,transparent)] blur-md" />
      <div className="mono-body">
        <div className="mono-face mono-front">
          <div className="mono-window">
            <Image
              src={portrait}
              alt={alt}
              priority
              sizes="(min-width: 1024px) 200px, 30vw"
              className="size-full object-cover object-[50%_35%] [filter:grayscale(1)_contrast(1.15)_brightness(0.95)]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[#1d4ed8]/35 mix-blend-soft-light" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(5_6_8/0.7))]" />
          </div>
          <div aria-hidden="true" className="mono-engraving" dir="ltr">
            <span className="block font-[family-name:var(--font-archivo)] text-[1.9em] font-extrabold leading-none [font-stretch:125%]">
              {engraving}
            </span>
            <span className="mt-[0.5em] block font-mono text-[0.55em] tracking-[0.3em]">{caption}</span>
          </div>
          <div aria-hidden="true" className="mono-sheen" />
        </div>
        <div aria-hidden="true" className="mono-face mono-side mono-side-end">
          <span className="mono-strip" />
        </div>
        <div aria-hidden="true" className="mono-face mono-side mono-side-start" />
        <div aria-hidden="true" className="mono-face mono-top" />
      </div>
    </div>
  );
}
