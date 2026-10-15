"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LocaleLinks } from "../LocaleLinks";
import { useMenu } from "../useMenu";

interface Props {
  name: string;
  items: readonly { href: "/" | "/about" | "/certifications" | "/contact"; label: string }[];
  labels: { primary: string; open: string; close: string; language: string; index: string };
  localeNames: Record<Locale, string>;
}

/** Concept B navigation: a quiet top bar and a full-screen typographic index. */
export function MonolithNav({ name, items, labels, localeNames }: Props) {
  const { open, setOpen, buttonRef, panelRef } = useMenu();

  return (
    <header className="relative z-40">
      <div className="flex h-16 items-center justify-between px-5 sm:h-20 sm:px-[5vw]">
        <Link href="/" className="relative z-50 flex min-h-11 items-center gap-3 text-white">
          <span
            aria-hidden="true"
            dir="ltr"
            className="font-[family-name:var(--font-archivo)] text-lg font-extrabold tracking-tight [font-stretch:125%]"
          >
            E<span className="text-[#4d86ff]">/</span>S
          </span>
          <span className="hidden text-sm text-white/60 sm:inline">{name}</span>
          <span className="sr-only sm:hidden">{name}</span>
        </Link>

        <div className="relative z-50 flex items-center gap-2 sm:gap-6">
          <div className="hidden sm:block">
            <LocaleLinks
              label={labels.language}
              names={localeNames}
              short
              className="flex items-center font-mono text-xs"
              linkClassName="inline-flex min-h-11 min-w-10 items-center justify-center text-white/60 hover:text-white"
              activeClassName="!text-white"
            />
          </div>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="monolith-index"
            onClick={() => setOpen((v) => !v)}
            className="group inline-flex min-h-11 items-center gap-3 border-b border-white/30 ps-1 text-sm font-medium text-white transition-colors hover:border-[#4d86ff]"
          >
            <span>{open ? labels.close : labels.index}</span>
            <span aria-hidden="true" className="font-mono text-xs text-white/60">
              {open ? "×" : `0${items.length}`}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="monolith-index"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-[#060708] px-5 pb-10 pt-28 sm:px-[5vw]"
          >
            <nav aria-label={labels.primary} className="flex-1">
              <ul>
                {items.map((item, i) => (
                  <li key={item.href} className="border-b border-white/10">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex min-h-20 items-center gap-5 py-2 sm:min-h-28"
                    >
                      <span aria-hidden="true" className="w-8 font-mono text-xs text-white/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-[family-name:var(--font-archivo),var(--font-sans)] text-[clamp(2.2rem,8vw,5.5rem)] font-extrabold leading-none tracking-tight text-white transition-colors [font-stretch:115%] group-hover:text-[#7aa5ff]">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <LocaleLinks
              label={labels.language}
              names={localeNames}
              className="flex gap-6 text-sm"
              linkClassName="inline-flex min-h-11 items-center text-white/60 hover:text-white"
              activeClassName="!text-white underline decoration-[#4d86ff] underline-offset-8"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
