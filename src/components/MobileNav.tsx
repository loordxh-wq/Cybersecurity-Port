"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { CloseIcon, MenuIcon } from "./icons";
import { NavLinks, type NavItem } from "./NavLinks";

export function MobileNav({
  items,
  openLabel,
  closeLabel,
  navLabel,
  children,
}: {
  items: readonly NavItem[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
  children?: React.ReactNode;
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-line text-fg"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id={panelId}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass absolute inset-x-3 top-[calc(100%+0.5rem)] rounded-2xl p-3 shadow-2xl"
          >
            <nav aria-label={navLabel}>
              <NavLinks
                items={items}
                onNavigate={() => setOpen(false)}
                className="flex flex-col"
                linkClassName="flex min-h-12 items-center rounded-xl px-3 text-lg"
              />
            </nav>
            {children ? <div className="mt-2 border-t border-line pt-3">{children}</div> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
