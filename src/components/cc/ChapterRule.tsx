import type { ElementType, ReactNode } from "react";

/**
 * Section opener: mono index, localized label and the signal-horizon hairline,
 * which draws in as the chapter enters the viewport (scroll-driven, progressive).
 */
export function ChapterRule({
  index,
  children,
  as: Tag = "p",
  id,
  className = "",
}: {
  index: string;
  children: ReactNode;
  as?: ElementType;
  id?: string;
  className?: string;
}) {
  return (
    <Tag id={id} className={`cc-chapter ${className}`}>
      <span aria-hidden="true" className="cc-chapter-index">
        {index}
      </span>
      <span>{children}</span>
      <span aria-hidden="true" className="cc-chapter-rule" />
    </Tag>
  );
}
