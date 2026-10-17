"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Ch2Desk, Ch2Mobile, Contrast } from "./Ch2";
import { Ch3Desk, Ch3Mobile, Ch3Strip } from "./Ch3";
import type { MotionCopy } from "./copy";
import { axisTime, ch2, ch3, failedSoFar, type Layout } from "./script";
import { cameraAt, cursorAt, latest, valueAt, type Rect } from "./timeline";

/** Lab labels the scenes need, picked on the server so no other lab copy reaches the client. */
export type LabStrings = {
  query: string;
  results: string;
  cols: Record<"time" | "event" | "account" | "source" | "type" | "auth" | "status", string>;
  facets: Record<"event" | "account" | "result", string>;
  outcome: Record<"fail" | "ok", string>;
  eventName: string;
  fields: Record<"account" | "computer" | "logonType" | "source" | "client" | "auth" | "process", string>;
  network: string;
  sim: string;
  notReal: string;
  disclosure: string;
  draft: string;
  supportsTitle: string;
  uncertainTitle: string;
  chapterTitles: [string, string];
  chapterOf: [string, string];
};

export type SceneProps = {
  m: MotionCopy;
  lab: LabStrings;
  typed: string;
  count: number;
  counters: { s45: number; s77: number };
  ph: number;
};

type Chapter = 2 | 3;
const scripts = { 2: ch2, 3: ch3 } as const;

declare global {
  interface Window {
    __motion?: { duration: number; seek: (s: number) => void };
  }
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Viewport({ layout, children, overlay, vpRef, layerRef, cursorRef }: { layout: Layout; children: ReactNode; overlay: ReactNode; vpRef: React.RefObject<HTMLDivElement | null>; layerRef: React.RefObject<HTMLDivElement | null>; cursorRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className={`ms-vp ms-vp--${layout}`} ref={vpRef}>
      <div className="ms-layer" ref={layerRef}>
        {children}
      </div>
      <div aria-hidden="true" className="ms-vignette" />
      {overlay}
      <div aria-hidden="true" className={`ms-cursor ms-cursor--${layout}`} ref={cursorRef}>
        {layout === "desk" ? (
          <svg viewBox="0 0 20 24" width="20" height="24">
            <path d="M2 1.5v18.2l4.9-4.6 3 6.9 3.1-1.4-3-6.8h6.6z" fill="#e8eef6" stroke="#04060b" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        ) : null}
        <span className="ms-tap" />
      </div>
    </div>
  );
}

export function MotionStudy({ chapter, m, lab, capture }: { chapter: Chapter; m: MotionCopy; lab: LabStrings; capture: boolean }) {
  const script = scripts[chapter];
  const root = useRef<HTMLDivElement>(null);
  const refs = {
    desk: { vp: useRef<HTMLDivElement>(null), layer: useRef<HTMLDivElement>(null), cursor: useRef<HTMLDivElement>(null) },
    mobile: { vp: useRef<HTMLDivElement>(null), layer: useRef<HTMLDivElement>(null), cursor: useRef<HTMLDivElement>(null) },
  };
  const rects = useRef<Record<Layout, Map<string, Rect>>>({ desk: new Map(), mobile: new Map() });
  const tRef = useRef(0);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(capture);
  const [view, setView] = useState({ caption: "", label: "" as string, typed: "", count: 0, s45: 0, s77: 0, ph: 0, sec: 0, capAt: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /** Measure every camera and pointer target in content coordinates, with the camera at rest. */
  const measure = useCallback(() => {
    for (const layout of ["desk", "mobile"] as const) {
      const layer = refs[layout].layer.current;
      if (!layer || !layer.offsetParent) continue;
      const prev = layer.style.transform;
      layer.style.transform = "none";
      const base = layer.getBoundingClientRect();
      const map = new Map<string, Rect>();
      layer.querySelectorAll<HTMLElement | SVGElement>("[data-cam]").forEach((el) => {
        const r = el.getBoundingClientRect();
        map.set(el.getAttribute("data-cam")!, { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height });
      });
      layer.style.transform = prev;
      rects.current[layout] = map;
    }
    // refs are stable objects created once per render of this component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rectOf = (layout: Layout) => (id: string) => {
    const parts = id.split("+").map((p) => rects.current[layout].get(p)).filter(Boolean) as Rect[];
    if (!parts.length) return null;
    const x = Math.min(...parts.map((r) => r.x));
    const y = Math.min(...parts.map((r) => r.y));
    return { x, y, w: Math.max(...parts.map((r) => r.x + r.w)) - x, h: Math.max(...parts.map((r) => r.y + r.h)) - y };
  };

  const last = useRef(view);
  const apply = useCallback(
    (t: number) => {
      const el = root.current;
      if (!el) return;
      for (const [name, track] of Object.entries(script.tracks)) el.style.setProperty(`--${name}`, valueAt(track, t, reduced).toFixed(4));
      el.style.setProperty("--progress", (t / script.duration).toFixed(4));
      const cap = latest(script.captions as { at: number; key: string }[], t);
      const lab = latest(script.labels as { at: number; key: string | null }[], t);
      el.style.setProperty("--capIn", reduced || !cap ? "1" : Math.min(1, (t - cap.at) / 0.3).toFixed(3));
      el.style.setProperty("--labIn", reduced || !lab ? "1" : Math.min(1, (t - lab.at) / 0.3).toFixed(3));

      for (const layout of ["desk", "mobile"] as const) {
        const { vp, layer, cursor } = refs[layout];
        if (!vp.current || !layer.current || !vp.current.offsetParent) continue;
        const vw = vp.current.clientWidth;
        const vh = vp.current.clientHeight;
        const cw = layer.current.offsetWidth;
        const ch = layer.current.offsetHeight;
        const cam = cameraAt(script.camera[layout], t, rectOf(layout), vw, vh, cw, ch, reduced);
        layer.current.style.transform = `translate3d(${cam.x.toFixed(2)}px, ${cam.y.toFixed(2)}px, 0) scale(${cam.k.toFixed(4)})`;
        if (cursor.current) {
          const c = reduced ? { pos: null, click: 0 } : cursorAt(script.cursor[layout], t, rectOf(layout));
          cursor.current.style.opacity = c.pos ? "1" : "0";
          if (c.pos) cursor.current.style.transform = `translate3d(${(c.pos.x * cam.k + cam.x).toFixed(1)}px, ${(c.pos.y * cam.k + cam.y).toFixed(1)}px, 0)`;
          cursor.current.style.setProperty("--click", c.click.toFixed(3));
        }
      }

      let typed = "";
      if (script.typing) {
        const { at, text, perChar } = script.typing;
        const n = t < at ? 0 : reduced ? text.length : Math.min(text.length, Math.floor((t - at) / perChar) + 1);
        typed = text.slice(0, n);
      }
      let count = 0;
      if (script.count) {
        const { at, dur, to } = script.count;
        count = t < at ? 0 : reduced ? to : Math.round(to * Math.min(1, (t - at) / dur));
      }
      const f = chapter === 3 ? failedSoFar(t, reduced) : { s45: 0, s77: 0, ph: 0 };
      if (chapter === 3) el.querySelectorAll("[data-ph-label]").forEach((n) => (n.textContent = axisTime(f.ph)));
      const next = { caption: cap?.key ?? "", label: lab?.key ?? "", typed, count, s45: f.s45, s77: f.s77, ph: f.ph, sec: Math.floor(t), capAt: cap?.at ?? 0 };
      const prev = last.current;
      if (Object.keys(next).some((k) => next[k as keyof typeof next] !== prev[k as keyof typeof prev] && k !== "ph")) {
        last.current = next;
        setView(next);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [script, reduced, chapter],
  );

  useLayoutEffect(() => {
    measure();
    apply(tRef.current);
    const ro = new ResizeObserver(() => {
      measure();
      apply(tRef.current);
    });
    if (root.current) ro.observe(root.current);
    document.fonts?.ready.then(() => {
      measure();
      apply(tRef.current);
    });
    return () => ro.disconnect();
  }, [measure, apply]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let prev = performance.now();
    const step = (now: number) => {
      tRef.current = Math.min(script.duration, tRef.current + (now - prev) / 1000);
      prev = now;
      apply(tRef.current);
      if (tRef.current >= script.duration) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const hide = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", hide);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [playing, apply, script.duration]);

  useEffect(() => {
    if (!capture) return;
    window.__motion = {
      duration: script.duration,
      seek: (s) => {
        tRef.current = s;
        flushSync(() => apply(s));
      },
    };
    return () => {
      delete window.__motion;
    };
  }, [capture, apply, script.duration]);

  const play = () => {
    if (tRef.current >= script.duration) tRef.current = 0;
    setStarted(true);
    setPlaying(true);
  };
  const restart = () => {
    tRef.current = 0;
    apply(0);
    setStarted(true);
    setPlaying(true);
  };

  const scene: SceneProps = { m, lab, typed: view.typed, count: view.count, counters: { s45: view.s45, s77: view.s77 }, ph: view.ph };
  const captionText = useMemo(() => {
    if (!view.caption) return "";
    return chapter === 2 ? m.ch2.captions[view.caption as keyof MotionCopy["ch2"]["captions"]] : m.ch3.captions[view.caption as keyof MotionCopy["ch3"]["captions"]];
  }, [view.caption, chapter, m]);

  const lower = (supports: string, uncertain: string) => (
    <div className="ms-lower" aria-hidden="true">
      <div className="ms-lower-card" data-kind="supports">
        <span className="ms-lower-title">{lab.supportsTitle}</span>
        <p>{supports}</p>
      </div>
      <div className="ms-lower-card" data-kind="uncertain">
        <span className="ms-lower-title">{lab.uncertainTitle}</span>
        <p>{uncertain}</p>
      </div>
    </div>
  );

  const focusLabel = (layout: Layout) => {
    const key = view.label;
    if (!key) return null;
    const text = chapter === 2 ? m.ch2.labels[key as keyof MotionCopy["ch2"]["labels"]] : m.ch3.labels[key as keyof MotionCopy["ch3"]["labels"]];
    return (
      <div className={`ms-focus ms-focus--${layout}`} aria-hidden="true" data-key={key}>
        <span className="ms-focus-dot" />
        <span>{text}</span>
        <FocusValue chapter={chapter} k={key} />
      </div>
    );
  };

  const overlay = (layout: Layout) => (
    <>
      {focusLabel(layout)}
      {chapter === 2 ? <Ch2Overlay layout={layout} {...scene} /> : <Ch3Overlay layout={layout} {...scene} />}
      {chapter === 2 ? lower(m.ch2.supports, m.ch2.uncertain) : lower(m.ch3.supports, m.ch3.uncertain)}
    </>
  );

  return (
    <div className="lm ms" ref={root} data-chapter={chapter} data-reduced={reduced || undefined} data-capture={capture || undefined}>
      <p className="lm-review lm-review--ws">{m.review}</p>
      <div className="site-wrap ms-wrap">
        <header className="ms-head">
          <p className="ms-simline">
            <span className="cc-simlabel lm-sim">
              <span aria-hidden="true" className="cc-simtag" />
              {lab.sim}
            </span>
            <span>{lab.notReal}</span>
          </p>
          <h1 className="ms-title">
            <span className="ms-kicker">
              {m.study} · {lab.chapterOf[chapter - 2]}
            </span>
            {lab.chapterTitles[chapter - 2]}
          </h1>
        </header>

        <div className="ms-stage" role="img" aria-label={`${lab.chapterTitles[chapter - 2]}. ${lab.sim}. ${lab.notReal}`}>
          <Viewport layout="desk" vpRef={refs.desk.vp} layerRef={refs.desk.layer} cursorRef={refs.desk.cursor} overlay={overlay("desk")}>
            {chapter === 2 ? <Ch2Desk {...scene} /> : <Ch3Desk {...scene} />}
          </Viewport>
          <Viewport layout="mobile" vpRef={refs.mobile.vp} layerRef={refs.mobile.layer} cursorRef={refs.mobile.cursor} overlay={overlay("mobile")}>
            {chapter === 2 ? <Ch2Mobile {...scene} /> : <Ch3Mobile {...scene} />}
          </Viewport>
          {!started ? (
            <button type="button" className="ms-start" onClick={play}>
              <span className="ms-start-btn" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                  <path d="M7 4.5v15l12-7.5z" />
                </svg>
              </span>
              <span>{m.play}</span>
              <span className="ms-start-hint">{reduced ? m.reduced : m.start}</span>
            </button>
          ) : null}
        </div>

        <p className="ms-caption" aria-live={playing ? "polite" : "off"} aria-label={m.captionsLabel} key={view.capAt}>
          {captionText}
        </p>

        <div className="ms-transport" dir="ltr">
          <button type="button" className="ms-tbtn" onClick={restart} aria-label={m.restart}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 5V2L7 6.5 12 11V7.5a5.5 5.5 0 1 1-5.5 5.5H4a8 8 0 1 0 8-8z" />
            </svg>
          </button>
          <button type="button" className="ms-tbtn ms-tbtn--main" onClick={() => (playing ? setPlaying(false) : play())} aria-label={playing || capture ? m.pause : m.play}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d={playing || capture ? "M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" : "M7 4.5v15l12-7.5z"} />
            </svg>
          </button>
          <div className="ms-bar" role="progressbar" aria-label={m.progress} aria-valuemin={0} aria-valuemax={Math.round(script.duration)} aria-valuenow={view.sec}>
            <i />
            {script.captions.map((c) => (
              <b key={c.at} style={{ insetInlineStart: `${(c.at / script.duration) * 100}%` }} />
            ))}
          </div>
          <span className="ms-clock">
            {clock(view.sec)} / {clock(script.duration)}
          </span>
        </div>

        <nav className="ms-chapters" aria-label={m.chapters}>
            {([2, 3] as const).map((c) => (
              <a key={c} href={`?chapter=${c}`} aria-current={c === chapter ? "page" : undefined}>
                <span className="ms-chip-n">{`0${c}`}</span>
                {lab.chapterTitles[c - 2]}
              </a>
            ))}
          </nav>
        <p className="ms-note">{lab.disclosure}</p>
        <p className="ms-note ms-note--draft">{lab.draft}</p>
      </div>
    </div>
  );
}

/** Technical value shown next to the focus label; data, so never translated. */
function FocusValue({ chapter, k }: { chapter: Chapter; k: string }) {
  const values: Record<string, string> =
    chapter === 2
      ? { query: "ip:203.0.113.45 · 01:45–02:45 UTC", time: "02:10:05 → 02:16:40 · 6 min 35 s", ip: "203.0.113.45 · 19 / 19", acct: "18 · 1 × each", evt: "4625 ×17 · 4624 ×2", e0193: "e-0193 · 4624 · 02:14:37", base: "e-0071 · 10 Mar 16:58:12", rdp: "e-0194 · 4624 · type 10 · +15 s", sum: "" }
      : { spray: "4625 · 02:10:05–02:16:40", success: "4624 · type 3 · NTLM", rdp: "4624 · type 10 · Negotiate", lateral: "4624 · Kerberos · 198.51.100.10", second: "4625 · 02:31:08–02:34:02", indicator: "DESKTOP-7Q2M4", gap: "SRV-FILE01", sum: "" };
  const v = values[k];
  return v ? (
    <bdi dir="ltr" className="ms-focus-v">
      {v}
    </bdi>
  ) : null;
}

/* Layout-specific overlays (not affected by the camera). */
function Ch2Overlay({ layout, m, lab }: SceneProps & { layout: Layout }) {
  if (layout === "desk") return null;
  // iPhone: the event details rise as a sheet inside the fixed viewport, then hand over to the baseline.
  return (
    <div className="m2-sheet" aria-hidden="true">
      <div className="m2-sheet-fields">
        <p className="m2-sheet-head">
          <bdi dir="ltr">4624 · e-0193</bdi>
          <span>{lab.eventName}</span>
        </p>
        <dl>
          <div>
            <dt>{lab.fields.account}</dt>
            <dd>
              <bdi dir="ltr">j.morgan</bdi>
            </dd>
          </div>
          <div data-f="type">
            <dt>{lab.fields.logonType}</dt>
            <dd>
              <bdi dir="ltr">3</bdi> · {lab.network}
            </dd>
          </div>
          <div data-f="auth">
            <dt>{lab.fields.auth}</dt>
            <dd>
              <bdi dir="ltr">NTLM</bdi>
            </dd>
          </div>
          <div data-f="src">
            <dt>{lab.fields.source}</dt>
            <dd>
              <bdi dir="ltr">203.0.113.45</bdi>
            </dd>
          </div>
          <div>
            <dt>{lab.fields.computer}</dt>
            <dd>
              <bdi dir="ltr">JMP01</bdi>
            </dd>
          </div>
        </dl>
      </div>
      <div className="m2-sheet-base">
        <p className="m2-sheet-head">
          <span>{m.ch2.baseTitle}</span>
          <bdi dir="ltr">e-0071 · 10 Mar 16:58:12</bdi>
        </p>
        <Contrast m={m} />
      </div>
    </div>
  );
}

function Ch3Overlay(props: SceneProps & { layout: Layout }) {
  const { layout, m } = props;
  if (layout === "mobile") return <Ch3Strip {...props} />;
  const L = m.ch3.legend;
  return (
    <div className={`ms-legend ms-legend--${layout}`} aria-hidden="true">
      <span data-k="observed">{L.observed}</span>
      <span data-k="inventory">{L.inventory}</span>
      <span data-k="indicator">{L.indicator}</span>
      <span data-k="absent">{L.absent}</span>
    </div>
  );
}
