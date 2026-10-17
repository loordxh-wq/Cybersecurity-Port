"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "./nav";
import { useMenu } from "./useMenu";

interface Props {
  /** Localized name, the brand link's accessible label. */
  name: string;
  /** Localized name shown beside the mark in Hebrew and Arabic (null in English). */
  localName: string | null;
  items: readonly NavItem[];
  labels: { primary: string; menu: string; close: string; forRecruiters: string; recruitersShort: string };
  localeBar: ReactNode;
  localeMenu: ReactNode;
  social: ReactNode;
}

const isCurrent = (pathname: string, href: NavItem["href"]) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

/**
 * Cyber Command header, shared by every page.
 * Transparent over the hero; a graphite glass bar once the page scrolls. The blur
 * lives on a pseudo-element, so the full-screen menu (position: fixed) is never
 * trapped inside a backdrop-filter containing block.
 * Desktop: numbered destinations with a cyan current-page tick. Below 1024 px a
 * menu control opens a full-screen index: focus moves in, Escape closes and
 * returns focus, page scroll locks, and navigating closes it.
 */
export function CommandHeader({ name, localName, items, labels, localeBar, localeMenu, social }: Props) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { open, setOpen, buttonRef, panelRef } = useMenu();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname, setOpen]);

  return (
    <header className="site-header" data-scrolled={scrolled || open ? "true" : "false"}>
      <div className="site-bar">
        <Link href="/" aria-label={name} className="site-brand">
          <span aria-hidden="true" className="site-mark">
            <span />
          </span>
          <span aria-hidden="true" dir="ltr" className={`site-brand-latin ${localName ? "max-sm:hidden" : ""}`}>
            ELI SAAD
          </span>
          {localName ? (
            <span aria-hidden="true" className="site-brand-local">
              {localName}
            </span>
          ) : null}
        </Link>

        <nav aria-label={labels.primary} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item, i) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={current ? "page" : undefined} className="site-navlink">
                    <span aria-hidden="true" className="site-navlink-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative z-50 flex items-center gap-2 lg:gap-4">
          <div className="hidden lg:block">{localeBar}</div>
          <Link href="/recruiter" aria-current={pathname === "/recruiter" ? "page" : undefined} className="site-recruiter">
            <span className="max-lg:hidden">{labels.forRecruiters}</span>
            <span className="lg:hidden">{labels.recruitersShort}</span>
          </Link>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className="site-menu-button lg:hidden"
          >
            <span>{open ? labels.close : labels.menu}</span>
            <span aria-hidden="true" className="site-burger" data-open={open ? "true" : "false"}>
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
            id="site-menu"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0.15 : 0.55, ease: [0.7, 0, 0.2, 1] }}
            className="site-menu"
          >
            <span aria-hidden="true" className="site-menu-orbit" />
            <nav aria-label={labels.primary} className="relative flex-1">
              <ul>
                {items.map((item, i) => {
                  const current = isCurrent(pathname, item.href);
                  return (
                    <li key={item.href} className="border-b border-white/10">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={current ? "page" : undefined}
                        className="site-menu-link group"
                      >
                        <span aria-hidden="true" className="site-menu-index">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="cc-display site-menu-label">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="relative mt-8 flex flex-col gap-4">
              <Link href="/recruiter" onClick={() => setOpen(false)} className="cc-btn site-menu-recruiter">
                <span>{labels.forRecruiters}</span>
                <span aria-hidden="true" className="cc-arrow">
                  →
                </span>
              </Link>
              {localeMenu}
              {social}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
