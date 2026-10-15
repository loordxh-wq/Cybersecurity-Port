"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { directionFor, locales, type Locale } from "@/i18n/routing";

/** Same page in another language. Styling comes from each prototype. */
export function LocaleLinks({
  label,
  names,
  short = false,
  className = "",
  linkClassName = "",
  activeClassName = "",
}: {
  label: string;
  names: Record<Locale, string>;
  short?: boolean;
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
}) {
  const current = useLocale();
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      <ul className={className}>
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
                aria-label={names[l]}
                className={`${linkClassName} ${active ? activeClassName : ""}`}
              >
                {short ? l.toUpperCase() : names[l]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
