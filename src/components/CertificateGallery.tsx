"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { CredentialKind } from "@/content/facts";
import { CredentialBadge } from "./CredentialBadge";
import { CloseIcon, ExpandIcon } from "./icons";

export interface GalleryItem {
  id: string;
  title: string;
  issuer: string;
  kind: CredentialKind;
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
              className={`panel scroll-mt-28 rounded-3xl p-3 sm:p-4 ${
                featured ? "edge md:col-span-2 md:grid md:grid-cols-[1.25fr_1fr] md:items-center md:gap-10" : ""
              }`}
            >
              <button
                type="button"
                onClick={(e) => open(item.id, e.currentTarget)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-30px_rgb(0_0_0/0.9)]"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  placeholder="blur"
                  sizes={featured ? "(min-width: 768px) 55vw, 92vw" : "(min-width: 768px) 45vw, 92vw"}
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgb(5_11_22/0.35))] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="absolute bottom-3 end-3 inline-flex items-center gap-2 rounded-xl border border-ice/30 bg-ink/90 px-3.5 py-2 text-sm font-medium text-fg shadow-lg transition-colors group-hover:border-ice/60">
                  <ExpandIcon width={16} height={16} className="text-ice" />
                  {labels.view}
                </span>
              </button>

              <div className="px-2 pb-3 pt-6 md:px-1">
                <CredentialBadge kind={item.kind} label={item.kindLabel} />
                <h2 className={`mt-4 font-semibold leading-tight text-fg ${featured ? "text-2xl sm:text-[2rem]" : "text-xl"}`}>
                  <bdi>{item.title}</bdi>
                </h2>
                <p className="mt-2 flex flex-wrap items-center gap-x-2 text-fg-muted">
                  <bdi className="font-medium text-fg/80">{item.issuer}</bdi>
                  <span aria-hidden="true" className="text-line-strong">
                    |
                  </span>
                  <span className="text-sm">{item.dateLabel}</span>
                </p>
                <p className="measure mt-4 leading-relaxed text-fg/85">{item.description}</p>
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
        className="m-auto w-[min(96vw,74rem)] max-w-none overflow-hidden rounded-3xl border border-line-strong bg-deep p-0 text-fg shadow-[0_40px_120px_-20px_rgb(0_0_0/0.95),0_0_0_1px_rgb(66_213_246/0.12)] backdrop:bg-[#02060e]/85 backdrop:backdrop-blur-md"
      >
        {active ? (
          <div className="flex max-h-[92dvh] flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-line bg-gradient-to-b from-raised/60 to-deep px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <CredentialBadge kind={active.kind} label={active.kindLabel} />
                <h2 id="cert-dialog-title" className="mt-2.5 text-lg font-semibold leading-snug sm:text-xl">
                  <bdi>{active.title}</bdi>
                </h2>
                <p className="text-sm text-fg-muted">
                  <bdi>{active.issuer}</bdi>
                  <span aria-hidden="true"> · </span>
                  {active.dateLabel}
                </p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => dialogRef.current?.close()}
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-ink/60 transition-colors hover:border-ice/60"
              >
                <CloseIcon />
                <span className="sr-only">{labels.close}</span>
              </button>
            </div>
            <div className="overflow-auto bg-[radial-gradient(ellipse_at_center,#ffffff,#eef2f7)] p-3 sm:p-6">
              <Image
                src={active.image}
                alt={active.imageAlt}
                sizes="96vw"
                quality={90}
                className="mx-auto h-auto max-h-[76dvh] w-auto max-w-full rounded-lg object-contain shadow-[0_12px_40px_-12px_rgb(0_0_0/0.35)]"
              />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
