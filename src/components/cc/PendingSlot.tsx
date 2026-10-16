import type { ReactNode } from "react";
import { SimTag } from "./SimTag";

/**
 * Stand-in for content whose evidence is not ready. Only rendered in the protected
 * preview (callers gate on isVisible); never a fake screenshot or filler text.
 */
export function PendingSlot({
  status,
  title,
  summary,
  neededLabel,
  needed,
  tags,
  glyph,
}: {
  status: string;
  title: ReactNode;
  summary: ReactNode;
  neededLabel: string;
  needed: ReactNode;
  tags?: ReactNode;
  glyph?: ReactNode;
}) {
  return (
    <article className="cc-pending">
      <div className="cc-pending-head">
        <span className="cc-pending-status">
          <SimTag />
          {status}
        </span>
        {glyph}
      </div>
      <h3 className="cc-pending-title">{title}</h3>
      <p className="cc-pending-summary">{summary}</p>
      {tags}
      <p className="cc-pending-needed">
        <span className="cc-pending-needed-label">{neededLabel}</span>
        {needed}
      </p>
    </article>
  );
}
