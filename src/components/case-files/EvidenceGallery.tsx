"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";

export interface EvidenceItem {
  id: string;
  image: StaticImageData;
  alt: string;
  caption: string;
  /** e.g. "Sanitized 2026-11-02" (already localized by the server). */
  meta: string;
}

/**
 * Evidence gallery: sanitized screenshots from Eli's own lab, each with a figure id
 * that findings cite. A figure opens full size in a native modal dialog (focus is
 * trapped by the browser, Escape and the close button return focus). Planned slots
 * without evidence render as empty frames that say so; nothing is ever simulated.
 */
export function EvidenceGallery({
  items,
  emptySlots,
  labels,
}: {
  items: EvidenceItem[];
  emptySlots: { id: string; caption: string }[];
  labels: { viewFull: string; close: string; evidenceSlot: string };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState<EvidenceItem | null>(null);

  function open(item: EvidenceItem, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setActive(item);
    requestAnimationFrame(() => dialogRef.current?.showModal());
  }

  return (
    <>
      <ul className="cf-gallery">
        {items.map((item) => (
          <li key={item.id} id={`cf-${item.id}`}>
            <figure className="cf-figure">
              <button type="button" className="cf-figure-frame cf-figure-frame--real" onClick={(e) => open(item, e.currentTarget)}>
                <span aria-hidden="true" className="cf-card-ticks" />
                <Image src={item.image} alt={item.alt} placeholder="blur" sizes="(min-width: 1024px) 46rem, 92vw" className="cf-figure-img" />
                <span className="sr-only">{labels.viewFull}</span>
              </button>
              <figcaption>
                <span className="cf-figure-id" dir="ltr">
                  {item.id}
                </span>
                <span>{item.caption}</span>
                <span className="cf-figure-meta">{item.meta}</span>
              </figcaption>
            </figure>
          </li>
        ))}
        {emptySlots.map((slot) => (
          <li key={slot.id}>
            <figure className="cf-figure">
              <div className="cf-figure-frame">
                <span aria-hidden="true" className="cf-card-ticks" />
                <span className="cf-figure-empty">{labels.evidenceSlot}</span>
              </div>
              <figcaption>
                <span className="cf-figure-id" dir="ltr">
                  {slot.id}
                </span>
                <span>{slot.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="cf-viewer"
        aria-label={active ? `${active.id} · ${active.caption}` : undefined}
        onClose={() => {
          setActive(null);
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        {active ? (
          <div className="cf-viewer-body">
            <div className="cf-viewer-head">
              <p>
                <span className="cf-figure-id" dir="ltr">
                  {active.id}
                </span>{" "}
                {active.caption}
              </p>
              <button type="button" className="cf-viewer-close" onClick={() => dialogRef.current?.close()}>
                {labels.close}
              </button>
            </div>
            <Image src={active.image} alt={active.alt} sizes="96vw" className="cf-viewer-img" />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
