import Image, { type StaticImageData } from "next/image";

/**
 * Concept C: Eli's photo mounted as an evidence exhibit. A duotone base with a
 * true-colour band revealed by a slow scan beam; crop marks and a ruler frame it.
 */
export function Exhibit({ portrait, alt, label }: { portrait: StaticImageData; alt: string; label: string }) {
  const ticks = Array.from({ length: 41 }, (_, i) => i);
  return (
    <figure className="relative">
      {/* Crop marks */}
      {["-start-3 -top-3 border-s border-t", "-end-3 -top-3 border-e border-t", "-start-3 -bottom-3 border-s border-b", "-end-3 -bottom-3 border-e border-b"].map((p) => (
        <span key={p} aria-hidden="true" className={`absolute size-5 border-[#ffb547]/80 ${p}`} />
      ))}
      <div className="bg-[#14141a] p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.95)] ring-1 ring-white/10">
        <div className="relative aspect-[4/5] overflow-hidden bg-black">
          <Image
            src={portrait}
            alt={alt}
            priority
            sizes="(min-width: 1024px) 340px, 60vw"
            className="size-full object-cover object-[50%_30%] [filter:grayscale(1)_contrast(1.25)_brightness(0.85)]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#6d4dff]/40 mix-blend-color" />
          <Image
            src={portrait}
            alt=""
            aria-hidden="true"
            sizes="(min-width: 1024px) 340px, 60vw"
            className="df-reveal absolute inset-0 size-full object-cover object-[50%_30%] [filter:saturate(1.15)_brightness(1.06)]"
          />
          <div aria-hidden="true" className="df-beam absolute inset-x-0 h-px bg-[#ffb547] shadow-[0_0_14px_2px_rgb(255_181_71/0.75)]" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_65%,rgb(10_10_13/0.55))]" />
        </div>
        <figcaption aria-hidden="true" className="flex items-center justify-between px-0.5 pt-2.5 font-mono text-xs text-[#f2efe8]/60" dir="ltr">
          <span>{label}</span>
          <span className="text-[#ffb547]/80">E.S.</span>
        </figcaption>
      </div>
      {/* Ruler along the inline-end edge */}
      <div aria-hidden="true" className="absolute -end-7 top-2.5 bottom-10 hidden w-4 flex-col justify-between sm:flex">
        {ticks.map((i) => (
          <span key={i} className={`h-px bg-[#f2efe8]/35 ${i % 5 === 0 ? "w-4" : "w-2"}`} />
        ))}
      </div>
    </figure>
  );
}
