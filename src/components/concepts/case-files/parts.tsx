import type { ReactNode } from "react";
import type { EvidenceStatus } from "@/content/evidence";
import { statusKey } from "./data";

/** Status pill: the same three states everywhere (awaiting evidence, in progress, documented). */
export function CaseStatus({ status, label }: { status: EvidenceStatus; label: string }) {
  return (
    <span className="cf-status" data-status={statusKey[status]}>
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

/** Content slot for text that does not exist yet: says what will go here, never pretends to be it. */
export function Slot({ note, children }: { note: string; children: ReactNode }) {
  return (
    <div className="cf-slot">
      <p className="cf-slot-note">{note}</p>
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
