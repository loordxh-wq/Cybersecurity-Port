"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LocaleLinks } from "../LocaleLinks";
import { useMenu } from "../useMenu";

interface Props {
  name: string;
  caseFile: string;
  index: string;
  items: readonly { href: "/" | "/about" | "/certifications" | "/contact"; label: string }[];
  labels: { primary: string; open: string; close: string; language: string };
  localeNames: Record<Locale, string>;
}

/** Concept C navigation: a case index with numbered tabs and a scan line beneath. */
export function ForensicsNav({ name, caseFile, index, items, labels, localeNames }: Props) {
  const { open, setOpen, buttonRef, panelRef } = useMenu();

  return (
    <header className="relative z-40">
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-6 px-5 sm:px-10">
        <Link href="/" className="relative z-50 flex min-h-11 items-center gap-2.5 font-mono text-[0.75rem] text-[#f2efe8]">
          <span className="text-[#ffb547]">{caseFile}</span>
          <span aria-hidden="true" className="text-white/25">
            /
          </span>
          <span className="font-sans text-[0.95rem] font-semibold">{name}</span>
        </Link>

        <nav aria-label={labels.primary} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={i === 0 ? "page" : undefined}
                  className="group flex min-h-11 items-center gap-2 px-3 text-sm text-[#f2efe8]/55 transition-colors hover:text-[#f2efe8] aria-[current=page]:text-[#f2efe8]"
                >
                  <span aria-hidden="true" className="font-mono text-xs text-[#a48bff] group-aria-[current=page]:text-[#ffb547]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <LocaleLinks
            label={labels.language}
            names={localeNames}
            short
            className="flex items-center gap-0.5 font-mono text-xs"
            linkClassName="inline-flex min-h-11 min-w-9 items-center justify-center text-[#f2efe8]/60 hover:text-[#f2efe8]"
            activeClassName="!text-[#ffb547]"
          />
        </div>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="forensics-index"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 inline-flex min-h-11 items-center gap-2 border border-[#f2efe8]/20 px-3.5 font-mono text-xs text-[#f2efe8] lg:hidden"
        >
          <span aria-hidden="true" className="text-[#ffb547]">
            {open ? "×" : "≡"}
          </span>
          {open ? labels.close : index}
        </button>
      </div>
      <div aria-hidden="true" className="df-sweep relative h-px overflow-hidden bg-[#f2efe8]/10" />

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="forensics-index"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#0a0a0d] px-5 pb-10 pt-24 lg:hidden"
          >
            <p className="font-mono text-xs text-[#ffb547]">{index}</p>
            <nav aria-label={labels.primary} className="mt-4">
              <ul className="border-t border-[#f2efe8]/12">
                {items.map((item, i) => (
                  <li key={item.href} className="border-b border-[#f2efe8]/12">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-16 items-center gap-4 text-2xl font-semibold text-[#f2efe8]"
                    >
                      <span aria-hidden="true" className="w-7 font-mono text-xs text-[#a48bff]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <span aria-hidden="true" className="font-mono text-sm text-[#f2efe8]/60 rtl:-scale-x-100">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto">
              <p className="mb-3 font-mono text-xs text-[#f2efe8]/60">{labels.language}</p>
              <LocaleLinks
                label={labels.language}
                names={localeNames}
                className="grid grid-cols-3 border border-[#f2efe8]/15"
                linkClassName="flex min-h-12 items-center justify-center text-[#f2efe8]/60 border-e border-[#f2efe8]/15"
                activeClassName="!text-[#0a0a0d] bg-[#ffb547]"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
