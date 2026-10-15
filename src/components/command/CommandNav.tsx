"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LocaleLinks } from "../concepts/LocaleLinks";
import { useMenu } from "../concepts/useMenu";

type Href = "/" | "/about" | "/certifications" | "/contact";

interface Props {
  name: string;
  items: readonly { href: Href; label: string }[];
  labels: { primary: string; open: string; close: string; language: string; menu: string };
  localeNames: Record<Locale, string>;
}

/**
 * Command navigation. Desktop: a single hairline bar with numbered destinations,
 * the active one marked by a cyan tick. Mobile: a menu control that opens a
 * full-screen index which slides in from the scene side.
 */
export function CommandNav({ name, items, labels, localeNames }: Props) {
  const { open, setOpen, buttonRef, panelRef } = useMenu();

  return (
    <header className="cc-header absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-12">
        <Link href="/" className="relative z-50 flex min-h-11 items-center gap-3 text-white" aria-label={name}>
          <span aria-hidden="true" className="cc-mark">
            <span />
          </span>
          <span aria-hidden="true" dir="ltr" className="font-mono text-xs tracking-[0.22em] text-white/80">
            ELI SAAD
          </span>
        </Link>

        <nav aria-label={labels.primary} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={i === 0 ? "page" : undefined}
                  className="cc-navlink group inline-flex min-h-11 items-center gap-2 px-4 text-sm text-white/70 transition-colors hover:text-white aria-[current=page]:text-white"
                >
                  <span aria-hidden="true" className="font-mono text-xs text-white/60 group-aria-[current=page]:text-[#7fdcff]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-50 flex items-center gap-3 lg:gap-6">
          <div className="hidden sm:block">
            <LocaleLinks
              label={labels.language}
              names={localeNames}
              short
              className="flex items-center font-mono text-xs"
              linkClassName="inline-flex min-h-11 min-w-10 items-center justify-center uppercase text-white/60 hover:text-white"
              activeClassName="!text-white"
            />
          </div>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="command-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-3 ps-2 text-sm font-medium text-white lg:hidden"
          >
            <span>{open ? labels.close : labels.menu}</span>
            <span aria-hidden="true" className="cc-burger" data-open={open ? "true" : "false"}>
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="command-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
            className="cc-menu fixed inset-0 z-40 flex flex-col px-5 pb-8 pt-24 sm:px-8"
          >
            <nav aria-label={labels.primary} className="flex-1">
              <ul>
                {items.map((item, i) => (
                  <li key={item.href} className="border-b border-white/10">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={i === 0 ? "page" : undefined}
                      className="group flex min-h-18 items-center gap-5 py-2"
                    >
                      <span aria-hidden="true" className="w-7 font-mono text-xs text-white/60 group-aria-[current=page]:text-[#7fdcff]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="cc-display text-[clamp(1.85rem,8.6vw,3.4rem)] font-extrabold leading-none text-white transition-colors group-hover:text-[#9fe6ff]">
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
              activeClassName="!text-white underline decoration-[#42d5f6] underline-offset-8"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
