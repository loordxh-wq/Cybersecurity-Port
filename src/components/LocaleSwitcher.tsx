"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { directionFor, locales, type Locale } from "@/i18n/routing";
import type { MouseEvent } from "react";
import { GlobeIcon } from "./icons";

/**
 * Switches language on the same page. Keeps the reader's place by carrying the
 * id of the section currently in view (sections share ids across languages).
 */
export function LocaleSwitcher({
  label,
  names,
  switchLabels,
  compact = false,
  landmark = true,
  stretch = false,
  appearance = "panel",
  short = false,
}: {
  label: string;
  names: Record<Locale, string>;
  switchLabels: Record<Locale, string>;
  compact?: boolean;
  /** False renders a labelled group, so a second copy (footer) doesn't repeat the "Language" landmark. */
  landmark?: boolean;
  /** Full-width segmented control (mobile menu). */
  stretch?: boolean;
  /** "command": the Cyber Command header and menu style (hairline, no panel). */
  appearance?: "panel" | "command";
  /** Show the language code (EN / HE / AR) instead of the name; the name stays the accessible label. */
  short?: boolean;
}) {
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function currentSectionId(): string | null {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    let id: string | null = null;
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= 140) id = s.id;
    }
    return id;
  }

  function onSwitch(event: MouseEvent<HTMLAnchorElement>, next: Locale) {
    if (next === current || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    const id = currentSectionId();
    router.replace(id ? `${pathname}#${id}` : pathname, { locale: next, scroll: !id });
  }

  const Wrapper = landmark ? "nav" : "div";

  if (appearance === "command") {
    return (
      <Wrapper aria-label={label} role={landmark ? undefined : "group"}>
        <ul className={`flex items-center ${short ? "" : "gap-6"}`}>
          {locales.map((l) => {
            const active = l === current;
            return (
              <li key={l}>
                <Link
                  href={pathname}
                  locale={l}
                  lang={l}
                  dir={directionFor(l)}
                  hrefLang={l}
                  aria-current={active ? "true" : undefined}
                  aria-label={active ? names[l] : switchLabels[l]}
                  onClick={(e) => onSwitch(e, l)}
                  className={`cmd-locale ${short ? "cmd-locale--short" : ""}`}
                >
                  {short ? <span dir="ltr">{l.toUpperCase()}</span> : names[l]}
                </Link>
              </li>
            );
          })}
        </ul>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      aria-label={label}
      role={landmark ? undefined : "group"}
      className={`flex items-center gap-1.5 ${stretch ? "w-full" : ""}`}
    >
      {!compact ? <GlobeIcon className="me-1 shrink-0 text-fg-muted" /> : null}
      <ul
        className={`flex items-center gap-1 rounded-xl border border-line bg-ink/50 p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] ${
          stretch ? "flex-1" : ""
        }`}
      >
        {locales.map((l) => {
          const active = l === current;
          return (
            <li key={l} className={stretch ? "flex-1" : undefined}>
              <Link
                href={pathname}
                locale={l}
                lang={l}
                dir={directionFor(l)}
                hrefLang={l}
                aria-current={active ? "true" : undefined}
                aria-label={active ? names[l] : switchLabels[l]}
                onClick={(e) => onSwitch(e, l)}
                className={`inline-flex min-h-9 min-w-11 items-center justify-center rounded-lg px-3 text-sm transition-colors ${
                  stretch ? "min-h-11 w-full" : ""
                } ${
                  active
                    ? "bg-gradient-to-b from-raised to-panel text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_0_0_1px_rgb(66_213_246/0.35)]"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {names[l]}
              </Link>
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
}
