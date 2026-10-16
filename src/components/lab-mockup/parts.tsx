import type { ReactNode } from "react";
import type { Copy } from "./copy";
import { brush, histogram, type Severity } from "./data";

/** A technical value (IP, account, code, timestamp): always left-to-right, isolated from RTL text. */
export function V({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={`lm-v ${className}`}>
      {children}
    </bdi>
  );
}

/** Severity: shape and word, never colour alone. */
export function Sev({ level, label }: { level: Severity; label: string }) {
  return (
    <span className="lm-sev" data-sev={level}>
      <span aria-hidden="true" className="lm-sev-mark" />
      {label}
    </span>
  );
}

/** Event outcome: glyph + word. */
export function Outcome({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="lm-outcome" data-ok={ok || undefined}>
      <span aria-hidden="true">{ok ? "✓" : "✕"}</span>
      {label}
    </span>
  );
}

export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
}

/**
 * Events per minute for the alert window, stacked: other events (faint), failures and
 * successes matching the query. The time axis runs left to right in every language
 * (labels are translated); the brushed range is shaded.
 */
export function Histogram({ t, compact = false }: { t: Copy; compact?: boolean }) {
  const w = 600;
  const h = compact ? 44 : 72;
  const base = h;
  const bw = w / histogram.length;
  const max = 5;
  const scale = (n: number) => (n / max) * (base - 6);
  const ticks = [
    [0, "01:45"],
    [15, "02:00"],
    [30, "02:15"],
    [45, "02:30"],
    [59, "02:45"],
  ] as const;
  return (
    <figure className="lm-histo">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${t.logs.histo}. ${t.logs.brush}.`} direction="ltr" preserveAspectRatio="none">
        <rect x={brush[0] * bw} y={0} width={(brush[1] - brush[0]) * bw} height={base} className="lm-histo-brush" />
        <line x1={brush[0] * bw} x2={brush[0] * bw} y1={0} y2={base} className="lm-histo-handle" />
        <line x1={brush[1] * bw} x2={brush[1] * bw} y1={0} y2={base} className="lm-histo-handle" />
        {histogram.map(([other, fail, ok], i) => {
          const x = i * bw + 1;
          const hOther = scale(other);
          const hFail = scale(fail);
          const hOk = scale(ok);
          return (
            <g key={i}>
              {other ? <rect x={x} y={base - hOther} width={bw - 2} height={hOther} className="lm-bar-other" /> : null}
              {fail ? <rect x={x} y={base - hOther - hFail} width={bw - 2} height={hFail} className="lm-bar-fail" /> : null}
              {ok ? <rect x={x} y={base - hOther - hFail - hOk} width={bw - 2} height={hOk} className="lm-bar-ok" /> : null}
            </g>
          );
        })}
        <line x1={0} x2={w} y1={base} y2={base} className="lm-histo-axis" />
      </svg>
      <div className="lm-histo-ticks" dir="ltr" aria-hidden="true">
        {ticks.map(([i, label]) => (
          <span key={label} style={{ insetInlineStart: `${(i / 59) * 100}%` }} data-edge={i === 0 ? "start" : i === 59 ? "end" : undefined}>
            {label}
          </span>
        ))}
      </div>
      {compact ? null : (
        <figcaption className="lm-histo-legend">
          <span>
            <i className="lm-key lm-key-other" aria-hidden="true" />
            {t.logs.legend.other}
          </span>
          <span>
            <i className="lm-key lm-key-fail" aria-hidden="true" />
            {t.logs.legend.fail}
          </span>
          <span>
            <i className="lm-key lm-key-ok" aria-hidden="true" />
            {t.logs.legend.ok}
          </span>
          <span className="lm-histo-sel">{t.logs.brush}</span>
        </figcaption>
      )}
    </figure>
  );
}
