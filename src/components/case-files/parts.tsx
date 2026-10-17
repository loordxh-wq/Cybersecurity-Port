import type { ReactNode } from "react";
import type { EvidenceStatus } from "@/content/evidence";
import { statusKey, type CaseCategory } from "@/content/case-files";
import { CaseGlyph } from "./glyphs";

/**
 * Status pill: the same three states everywhere (planned, in progress, documented).
 * `quiet` drops the frame, for lists where the state repeats on every item.
 */
export function CaseStatus({ status, label, quiet = false }: { status: EvidenceStatus; label: string; quiet?: boolean }) {
  return (
    <span className={quiet ? "cf-status cf-status--quiet" : "cf-status"} data-status={statusKey[status]}>
      <span aria-hidden="true" className="cf-status-mark" />
      {label}
    </span>
  );
}

/** Evidence meter: one hairline cell per planned item, filled only for approved evidence. */
export function EvidenceMeter({ approved, planned, label }: { approved: number; planned: number; label: string }) {
  return (
    <span className="cf-meter">
      <span aria-hidden="true" className="cf-meter-cells">
        {Array.from({ length: planned }, (_, i) => (
          <span key={i} className="cf-meter-cell" data-filled={i < approved ? "true" : undefined} />
        ))}
      </span>
      <span className="cf-meter-label">{label}</span>
    </span>
  );
}

/**
 * Content slot for text that does not exist yet: a dashed box that says what will go
 * here, never pretends to be it. One notice at the top of the case explains why; the
 * slots themselves stay quiet.
 */
export function Slot({ children }: { children: ReactNode }) {
  return (
    <div className="cf-slot">
      <p className="cf-slot-text">{children}</p>
    </div>
  );
}

/** Mono label + value rows, the dossier's metadata. */
export function Facts({ rows }: { rows: readonly { label: string; value: ReactNode }[] }) {
  return (
    <dl className="cf-facts">
      {rows.map((r) => (
        <div key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Tools({ tools }: { tools: readonly string[] }) {
  return (
    <ul className="cf-tools">
      {tools.map((t) => (
        <li key={t}>
          <bdi>{t}</bdi>
        </li>
      ))}
    </ul>
  );
}

/**
 * Dossier plate: case number and status stacked on one side, the case diagram on the
 * other. The number and the status never share a line, so long translations cannot
 * squeeze either one.
 */
export function CasePlate({
  number,
  category,
  status,
  size = "card",
  numberHidden = false,
}: {
  number: string;
  category: CaseCategory;
  status: ReactNode;
  size?: "card" | "dossier";
  numberHidden?: boolean;
}) {
  return (
    <div className={`cf-plate cf-plate--${size}`}>
      <div className="cf-plate-id">
        <span className="cf-plate-no" dir="ltr" aria-hidden={numberHidden || undefined}>
          {number}
        </span>
        {status}
      </div>
      <CaseGlyph category={category} />
    </div>
  );
}
