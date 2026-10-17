"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

export interface SignalStop {
  id: string;
  kind: "experience" | "training" | "certification" | "next";
  kindLabel: string;
  title: string;
  org?: string;
}

/**
 * Interactive signal line: a career (or roadmap) drawn as one hairline. Completed
 * stages sit on a solid cyan trace with a travelling packet; the next step is dashed.
 * Each stage is a tab; its detail panel is server-rendered and passed in.
 *
 * Accessibility: WAI-ARIA tabs. Arrow keys follow the visual direction (mirrored in
 * RTL), Home/End jump, only the selected tab is in the tab order. The trace draws in
 * when the line first enters the viewport; with reduced motion it is simply drawn.
 */
export function SignalLine({
  label,
  stops,
  panels,
  initial,
  progressTemplate,
}: {
  label: string;
  stops: readonly SignalStop[];
  panels: readonly ReactNode[];
  initial: number;
  /** e.g. "Stage {current} of {total}" */
  progressTemplate: string;
}) {
  const [active, setActive] = useState(initial);
  const [seen, setSeen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const doneCount = stops.filter((s) => s.kind !== "next").length;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function select(i: number, focus = false) {
    const next = (i + stops.length) % stops.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward || e.key === "ArrowDown") select(active + 1, true);
    else if (e.key === back || e.key === "ArrowUp") select(active - 1, true);
    else if (e.key === "Home") select(0, true);
    else if (e.key === "End") select(stops.length - 1, true);
    else return;
    e.preventDefault();
  }

  // Share of the line's segments that are completed (solid); drives the packet's travel.
  const doneFrac = stops.length > 1 ? (doneCount - 1) / (stops.length - 1) : 1;

  return (
    <div
      ref={rootRef}
      className="cc-signal"
      data-seen={seen ? "true" : "false"}
      style={{ "--done": doneFrac, "--n": stops.length } as CSSProperties}
    >
      <div role="tablist" aria-label={label} className="cc-signal-track" onKeyDown={onKey}>
        <span aria-hidden="true" className="cc-signal-packet" />
        {stops.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            data-kind={s.kind}
            data-seg={i < stops.length - 1 ? (stops[i + 1]?.kind === "next" ? "next" : "done") : undefined}
            style={{ "--i": i } as CSSProperties}
            onClick={() => select(i)}
            className="cc-signal-stop"
          >
            <span aria-hidden="true" className="cc-signal-node" />
            <span className="cc-signal-kind">{s.kindLabel}</span>
            <span className="cc-signal-title">
              <bdi>{s.title}</bdi>
            </span>
            {s.org ? (
              <span className="cc-signal-org">
                <bdi>{s.org}</bdi>
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <p className="cc-signal-progress" aria-hidden="true">
        {progressTemplate.replace("{current}", String(active + 1)).replace("{total}", String(stops.length))}
      </p>

      {panels.map((panel, i) => (
        <div
          key={stops[i]?.id ?? i}
          role="tabpanel"
          id={`${base}-panel-${i}`}
          aria-labelledby={`${base}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="cc-signal-panel"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
