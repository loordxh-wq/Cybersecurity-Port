"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { CloseIcon, MenuIcon } from "./icons";
import { NavLinks, type NavItem } from "./NavLinks";

/**
 * Mobile menu: a solid full-width sheet under the header with a dimmed backdrop.
 * Focus moves to the first link, Escape or a tap on the backdrop closes it and
 * returns focus to the toggle, and the page behind stops scrolling while open.
 */
export function MobileNav({
  items,
  openLabel,
  closeLabel,
  navLabel,
  languageLabel,
  language,
  social,
}: {
  items: readonly NavItem[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
  languageLabel: string;
  language: ReactNode;
  social?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border text-fg transition-colors ${
          open ? "border-ice/50 bg-raised" : "border-line-strong bg-deep/60"
        }`}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
      </button>
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              key="backdrop"
              aria-hidden="true"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-full h-[100dvh] bg-[#02060e]/80"
            />
            <motion.div
              key="panel"
              ref={panelRef}
              id={panelId}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
              // Opaque, not .glass: the header's own backdrop-filter stops a nested blur from reaching the page.
              className="absolute inset-x-3 top-[calc(100%+0.5rem)] max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-2xl border border-line-strong bg-[linear-gradient(180deg,var(--color-raised),var(--color-deep)_55%)] p-2 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9),0_0_0_1px_rgb(66_213_246/0.08)]"
            >
              <div aria-hidden="true" className="beam mx-4 mb-1 opacity-70" />
              <nav aria-label={navLabel}>
                <NavLinks
                  items={items}
                  numbered
                  onNavigate={() => setOpen(false)}
                  className="flex flex-col gap-0.5 p-1"
                  linkClassName="relative flex min-h-14 items-center gap-3 rounded-xl px-3 text-lg font-medium transition-colors hover:bg-white/[0.04] data-[current]:bg-ice/[0.08] data-[current]:before:absolute data-[current]:before:inset-y-3 data-[current]:before:start-0 data-[current]:before:w-0.5 data-[current]:before:rounded-full data-[current]:before:bg-ice data-[current]:before:shadow-[0_0_10px_rgb(66_213_246)]"
                />
              </nav>
              <div className="mx-2 mt-2 rounded-xl border border-line bg-ink/40 p-3">
                <p className="mb-2 px-1 text-xs font-medium text-fg-muted">{languageLabel}</p>
                {language}
              </div>
              {social ? <div className="flex justify-center px-2 py-3">{social}</div> : null}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
