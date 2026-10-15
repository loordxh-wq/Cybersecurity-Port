import Image from "next/image";
import type { CSSProperties } from "react";
import { person } from "@/content/facts";

/**
 * Eli's real photo (cropped from his supplied original, nothing generated),
 * held in a detection-style frame: corner brackets lock on at page load, a slow
 * radar ring circles the portrait, and a small caption tag names the credential.
 * Everything except the photo is decorative and hidden from assistive tech.
 */
export function PortraitFrame({ alt, id, caption }: { alt: string; id: string; caption: string }) {
  const corners = [
    "top-0 start-0 border-t-2 border-s-2 rounded-ss-2xl",
    "top-0 end-0 border-t-2 border-e-2 rounded-se-2xl",
    "bottom-0 start-0 border-b-2 border-s-2 rounded-es-2xl",
    "bottom-0 end-0 border-b-2 border-e-2 rounded-ee-2xl",
  ];

  return (
    <figure id={id} className="relative mx-auto aspect-square w-[min(60vw,15rem)] sm:w-[20rem] lg:w-[25rem]">
      {/* Glow and rings */}
      <div
        aria-hidden="true"
        className="breathe absolute -inset-12 rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.4),rgb(139_124_255/0.14)_55%,transparent)] blur-2xl"
      />
      <div aria-hidden="true" className="orbit absolute -inset-[11%] rounded-full" />
      <div aria-hidden="true" className="absolute -inset-[5%] rounded-full border border-dashed border-line" />

      {/* Photo card */}
      <div className="edge absolute inset-3 overflow-hidden rounded-[1.6rem] bg-deep shadow-[0_40px_90px_-30px_rgb(0_0_0/0.95),0_0_60px_-20px_rgb(66_213_246/0.45)]">
        <Image
          src={person.portrait}
          alt={alt}
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 320px, 60vw"
          className="size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="grid-faint absolute inset-0 opacity-40 mix-blend-overlay"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_11_22/0.15),transparent_30%,transparent_55%,rgb(5_11_22/0.7))]"
        />
        <div
          aria-hidden="true"
          className="scanline absolute inset-x-0 top-0 h-[10%] bg-[linear-gradient(180deg,transparent,rgb(66_213_246/0.24),transparent)]"
        />
      </div>

      {/* Corner brackets */}
      {corners.map((pos, i) => (
        <span
          key={pos}
          aria-hidden="true"
          style={{ "--i": i } as CSSProperties}
          className={`bracket absolute size-11 border-ice drop-shadow-[0_0_6px_rgb(66_213_246/0.8)] ${pos}`}
        />
      ))}

      {/* Caption tag */}
      <figcaption
        aria-hidden="true"
        dir="ltr"
        className="absolute -bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-ice/30 bg-ink/90 px-3.5 py-1.5 font-mono text-[0.7rem] text-ice-soft shadow-[0_8px_30px_-8px_rgb(0_0_0/0.9)]"
      >
        <span className="size-1.5 rounded-full bg-ok shadow-[0_0_8px_rgb(74_222_128)]" />
        {caption}
      </figcaption>
    </figure>
  );
}
