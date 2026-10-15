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
}: {
  label: string;
  names: Record<Locale, string>;
  switchLabels: Record<Locale, string>;
  compact?: boolean;
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

  return (
    <nav aria-label={label} className="flex items-center gap-1">
      {!compact ? <GlobeIcon className="me-1 text-fg-muted" /> : null}
      <ul className="flex items-center gap-1 rounded-xl border border-line p-1">
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
                className={`inline-flex min-h-9 min-w-11 items-center justify-center rounded-lg px-2.5 text-sm transition-colors ${
                  active ? "bg-raised text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {names[l]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
