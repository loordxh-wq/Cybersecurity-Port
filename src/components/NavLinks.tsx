"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { ArrowIcon } from "./icons";

export interface NavItem {
  href: "/" | "/about" | "/certifications" | "/contact";
  label: string;
}

export function NavLinks({
  items,
  className,
  linkClassName,
  onNavigate,
  numbered = false,
}: {
  items: readonly NavItem[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
  /** Mobile menu style: a decorative "01" index before and an arrow after each link. */
  numbered?: boolean;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {items.map((item, i) => {
        const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              data-current={current ? "" : undefined}
              onClick={onNavigate}
              className={`${linkClassName ?? ""} ${current ? "text-fg" : "text-fg-muted hover:text-fg"}`}
            >
              {numbered ? (
                <span aria-hidden="true" className="w-6 shrink-0 font-mono text-xs text-ice/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : null}
              <span className={numbered ? "flex-1" : undefined}>{item.label}</span>
              {numbered ? <ArrowIcon aria-hidden="true" className="flip-rtl shrink-0 text-fg-muted" width={18} height={18} /> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
