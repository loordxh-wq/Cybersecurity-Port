"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LocaleLinks } from "../LocaleLinks";
import { useMenu } from "../useMenu";

interface Props {
  name: string;
  items: readonly { href: "/" | "/about" | "/certifications" | "/contact"; label: string }[];
  labels: { primary: string; open: string; close: string; language: string };
  localeNames: Record<Locale, string>;
  contactLabel: string;
}

/** Orbit glyph: a ring with a satellite, echoing the core. */
function OrbitMark() {
  return (
    <svg aria-hidden="true" width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="5" fill="#a5ebfb" />
      <ellipse cx="13" cy="13" rx="11.5" ry="5" transform="rotate(-24 13 13)" stroke="#a5ebfb" strokeOpacity="0.55" />
      <circle cx="23.2" cy="9.4" r="1.6" fill="#c4bcff" />
    </svg>
  );
}

export function ObservatoryNav({ name, items, labels, localeNames, contactLabel }: Props) {
  const { open, setOpen, buttonRef, panelRef } = useMenu();

  return (
    <header className="relative z-30">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-5 sm:h-20 sm:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-3 text-[0.95rem] font-semibold tracking-tight text-white">
          <OrbitMark />
          {name}
        </Link>

        <nav aria-label={labels.primary} className="hidden lg:block">
          <ul className="flex items-center gap-9 text-[0.92rem]">
            {items.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={i === 0 ? "page" : undefined}
                  className="group relative inline-flex min-h-11 items-center text-white/55 transition-colors hover:text-white aria-[current=page]:text-white"
                >
                  {item.label}
                  <span className="absolute inset-x-0 bottom-2 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan-300 to-violet-400 transition-transform duration-500 group-hover:scale-x-100 group-aria-[current=page]:scale-x-100 rtl:origin-right" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LocaleLinks
            label={labels.language}
            names={localeNames}
            short
            className="flex items-center gap-1 font-mono text-xs"
            linkClassName="inline-flex min-h-11 min-w-9 items-center justify-center text-white/60 transition-colors hover:text-white"
            activeClassName="!text-cyan-200"
          />
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:border-cyan-200/70 hover:bg-white/5"
          >
            {contactLabel}
          </Link>
        </div>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="observatory-menu"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] lg:hidden"
        >
          <span className="sr-only">{open ? labels.close : labels.open}</span>
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span className={`absolute inset-x-0 top-0 h-px bg-white transition-transform duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`absolute inset-x-0 bottom-0 h-px bg-white transition-transform duration-300 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="observatory-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-[radial-gradient(ellipse_at_50%_0%,#0b1a3a,#030712_70%)] px-6 pb-10 pt-24 lg:hidden"
          >
            <nav aria-label={labels.primary}>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-16 items-baseline gap-4 border-b border-white/[0.07] text-[2rem] font-semibold tracking-tight text-white"
                    >
                      <span aria-hidden="true" className="font-mono text-xs text-cyan-200/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto">
              <p className="mb-3 font-mono text-xs text-white/60">{labels.language}</p>
              <LocaleLinks
                label={labels.language}
                names={localeNames}
                className="grid grid-cols-3 gap-2"
                linkClassName="flex min-h-12 items-center justify-center rounded-full border border-white/12 text-white/70"
                activeClassName="!border-cyan-200/60 !text-white bg-white/[0.06]"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
