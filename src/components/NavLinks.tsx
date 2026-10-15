"use client";

import { Link, usePathname } from "@/i18n/navigation";

export interface NavItem {
  href: "/" | "/about" | "/certifications" | "/contact";
  label: string;
}

export function NavLinks({
  items,
  className,
  linkClassName,
  onNavigate,
}: {
  items: readonly NavItem[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {items.map((item) => {
        const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              onClick={onNavigate}
              className={`${linkClassName ?? ""} ${current ? "text-fg" : "text-fg-muted hover:text-fg"}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
