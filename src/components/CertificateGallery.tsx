"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { CloseIcon, ExpandIcon } from "./icons";

export interface GalleryItem {
  id: string;
  title: string;
  issuer: string;
  isCertification: boolean;
  kindLabel: string;
  dateLabel: string;
  description: string;
  imageAlt: string;
  image: StaticImageData;
  verificationUrl?: string;
}

/**
 * Original certificate images with a full-size viewer built on the native
 * <dialog> element: focus moves into it, Escape closes it, the page behind is
 * inert, and focus returns to the card that opened it.
 */
export function CertificateGallery({
  items,
  labels,
}: {
  items: readonly GalleryItem[];
  labels: { view: string; close: string; verify: string; newTab: string };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((i) => i.id === activeId) ?? null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active && dialog && !dialog.open) dialog.showModal();
  }, [active]);

  function open(id: string, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setActiveId(id);
  }

  function onClose() {
    setActiveId(null);
    triggerRef.current?.focus();
  }

  function onBackdrop(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) dialogRef.current?.close();
  }

  return (
    <>
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((item, index) => {
          const featured = index === 0;
          return (
            <li
              key={item.id}
              id={item.id}
              className={`scroll-mt-28 rounded-3xl border bg-deep/60 p-3 sm:p-4 ${
                featured ? "border-ice/30 md:col-span-2 md:grid md:grid-cols-[1.25fr_1fr] md:items-center md:gap-8" : "border-line"
              }`}
            >
              <button
                type="button"
                onClick={(e) => open(item.id, e.currentTarget)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-white"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  placeholder="blur"
                  sizes={featured ? "(min-width: 768px) 55vw, 92vw" : "(min-width: 768px) 45vw, 92vw"}
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.015]"
                />
                <span className="absolute bottom-3 end-3 inline-flex items-center gap-2 rounded-lg bg-ink/85 px-3 py-2 text-sm font-medium text-fg backdrop-blur">
                  <ExpandIcon width={16} height={16} />
                  {labels.view}
                </span>
              </button>

              <div className="px-2 pb-2 pt-5 md:px-1">
                <p
                  className={`inline-flex rounded-full border px-3 py-0.5 text-sm font-medium ${
                    item.isCertification ? "border-ice/40 bg-ice/10 text-ice-soft" : "border-line-strong text-fg-muted"
                  }`}
                >
                  {item.kindLabel}
                </p>
                <h2 className={`mt-3 font-semibold text-fg ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                  <bdi>{item.title}</bdi>
                </h2>
                <p className="mt-1 text-fg-muted">
                  <bdi>{item.issuer}</bdi>
                </p>
                <p className="mt-1 text-sm text-fg-muted">{item.dateLabel}</p>
                <p className="measure mt-4 text-fg/90">{item.description}</p>
                {item.verificationUrl ? (
                  <a
                    href={item.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center font-medium text-ice underline underline-offset-4"
                  >
                    {labels.verify}
                    <span className="sr-only"> ({labels.newTab})</span>
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={onClose}
        onClick={onBackdrop}
        aria-labelledby="cert-dialog-title"
        className="m-auto w-[min(96vw,72rem)] max-w-none rounded-2xl border border-line-strong bg-deep p-0 text-fg backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        {active ? (
          <div className="flex max-h-[92dvh] flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
              <div>
                <h2 id="cert-dialog-title" className="font-semibold">
                  <bdi>{active.title}</bdi>
                </h2>
                <p className="text-sm text-fg-muted">
                  <bdi>{active.issuer}</bdi>
                  <span aria-hidden="true"> / </span>
                  {active.dateLabel}
                </p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => dialogRef.current?.close()}
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-line"
              >
                <CloseIcon />
                <span className="sr-only">{labels.close}</span>
              </button>
            </div>
            <div className="overflow-auto bg-white p-2 sm:p-4">
              <Image
                src={active.image}
                alt={active.imageAlt}
                sizes="96vw"
                quality={90}
                className="mx-auto h-auto max-h-[78dvh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
