import Image from "next/image";
import type { CSSProperties } from "react";
import { person } from "@/content/facts";

/**
 * Eli's real photo (cropped from his supplied original, nothing generated),
 * held in a detection-style frame whose corner brackets lock on at page load.
 */
export function PortraitFrame({ alt, id }: { alt: string; id: string }) {
  const corners = [
    "top-0 start-0 border-t-2 border-s-2 rounded-ss-xl",
    "top-0 end-0 border-t-2 border-e-2 rounded-se-xl",
    "bottom-0 start-0 border-b-2 border-s-2 rounded-es-xl",
    "bottom-0 end-0 border-b-2 border-e-2 rounded-ee-xl",
  ];

  return (
    <figure id={id} className="relative mx-auto aspect-square w-[min(78vw,20rem)] lg:w-[24rem]">
      <div
        aria-hidden="true"
        className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.35),rgb(139_124_255/0.12)_55%,transparent)] blur-2xl"
      />
      <div className="absolute inset-3 overflow-hidden rounded-2xl border border-line-strong bg-deep shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]">
        <Image
          src={person.portrait}
          alt={alt}
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 384px, 78vw"
          className="size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(7_16_27/0.55))]"
        />
        <div
          aria-hidden="true"
          className="scanline absolute inset-x-0 top-0 h-[10%] bg-[linear-gradient(180deg,transparent,rgb(66_213_246/0.22),transparent)]"
        />
      </div>
      {corners.map((pos, i) => (
        <span
          key={pos}
          aria-hidden="true"
          style={{ "--i": i } as CSSProperties}
          className={`bracket absolute size-10 border-ice ${pos}`}
        />
      ))}
    </figure>
  );
}
