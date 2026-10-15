import type { ReactNode } from "react";
import { ui } from "@/lib/ui";

/**
 * Section heading with a numbered eyebrow and a short gradient rule.
 * The index is a decorative, language-neutral marker ("01"), hidden from assistive tech.
 */
export function SectionHeading({
  index,
  id,
  as: Tag = "h2",
  className = "",
  titleClassName = ui.sectionTitle,
  children,
}: {
  index: string;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
  titleClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div aria-hidden="true" className="flex items-center gap-3">
        <span className="font-mono text-xs font-medium text-ice">{index}</span>
        <span className="h-px w-12 bg-gradient-to-r from-ice/70 to-transparent rtl:bg-gradient-to-l" />
      </div>
      <Tag id={id} className={`mt-4 ${titleClassName}`}>
        {children}
      </Tag>
    </div>
  );
}
