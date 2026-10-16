"use client";

import { useEffect, useState } from "react";

/**
 * Desktop chapter index (1280 px and wider): a thin column of ticks on the page's
 * end edge. The current chapter's tick extends; each tick is a real link with its
 * chapter name. Hidden on smaller screens, where the page simply scrolls.
 */
export function ChapterRail({ label, items }: { label: string; items: readonly { id: string; index: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className="home-rail">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined} className="home-rail-link">
              <span aria-hidden="true" className="home-rail-tick" />
              <span className="home-rail-index" aria-hidden="true">
                {item.index}
              </span>
              <span className="home-rail-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
