import type { CSSProperties, ReactNode } from "react";
import { results, windowEvents } from "@/components/lab-mockup/data";
import type { SceneProps } from "./MotionStudy";
import { axisPos } from "./script";

/**
 * Chapter 3 · Event correlation. Connections appear in the order the events happened, driven
 * by the playhead (--ph) and per-element progress variables. Line styles carry meaning, always
 * with words beside them: solid = observed in events, dotted = asset inventory, dashed amber =
 * indicator only, dashed grey = not in the data.
 */

const v = (s: string | number) => <bdi dir="ltr">{s}</bdi>;
const P = (k: string) => ({ "--p": `var(--${k})` }) as CSSProperties;

type NodeProps = { x: number; y: number; k: string; kind: "source" | "account" | "host" | "absent"; label: ReactNode; sub?: ReactNode; w?: number };
function Node({ x, y, k, kind, label, sub, w = 200 }: NodeProps) {
  const h = sub ? 52 : 40;
  return (
    <g className="g-node" data-kind={kind} data-k={k} style={P(k)}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3} />
      <text x={x} y={sub ? y - 4 : y + 5} textAnchor="middle" className="g-label">
        {label}
      </text>
      {sub ? (
        <text x={x} y={y + 15} textAnchor="middle" className="g-sub">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

const curve = (ax: number, ay: number, bx: number, by: number) => {
  const mx = (ax + bx) / 2;
  return `M${ax + 100} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx - 100} ${by}`;
};

function Edge({ d, k, kind, outcome, width = 2 }: { d: string; k: string; kind: "observed" | "inventory" | "indicator" | "absent"; outcome?: "ok" | "fail"; width?: number }) {
  if (kind === "observed") return <path d={d} className="g-edge" data-outcome={outcome} data-k={k} style={P(k)} pathLength={1} strokeWidth={width} fill="none" />;
  // Patterned lines are revealed through a mask that draws in, so the dash pattern stays intact.
  return (
    <g data-k={k}>
      <mask id={`mk-${k}`} maskUnits="userSpaceOnUse" x={0} y={0} width={1120} height={580}>
        <path d={d} className="g-draw" style={P(k)} pathLength={1} stroke="#fff" strokeWidth={10} fill="none" />
      </mask>
      <path d={d} className="g-edge" data-kind={kind} mask={`url(#mk-${k})`} strokeWidth={width} fill="none" />
    </g>
  );
}

const ticks = [
  ...results.map((e) => ({ t: e.time.slice(0, 8), ok: e.eventId === 4624, src: "45" })),
  ...windowEvents.filter((e) => e.ip === "203.0.113.77" || e.id === "e-0201").map((e) => ({ t: e.time.slice(0, 8), ok: e.eventId === 4624, src: e.ip === "203.0.113.77" ? "77" : "45" })),
];

function Axis({ m }: Pick<SceneProps, "m">) {
  return (
    <div className="g-axis" dir="ltr">
      <span className="g-axis-label">{m.ch3.axis}</span>
      <div className="g-axis-track">
        {["02:08", "02:12", "02:16", "02:20", "02:24", "02:28", "02:32", "02:36"].map((t) => (
          <span key={t} className="g-axis-tick" style={{ insetInlineStart: `${axisPos(`${t}:00`) * 100}%` }}>
            {t}
          </span>
        ))}
        {ticks.map((e) => {
          const pos = axisPos(e.t);
          return <i key={e.t + e.src} className="g-ev" data-ok={e.ok || undefined} data-src={e.src} style={{ insetInlineStart: `${pos * 100}%`, "--at": pos } as CSSProperties} />;
        })}
        <span className="g-playhead">
          <b data-ph-label />
        </span>
      </div>
    </div>
  );
}

export function Ch3Desk({ m, counters }: SceneProps) {
  const c = m.ch3;
  return (
    <div className="d3">
      <svg viewBox="0 0 1120 560" className="d3-graph" direction="ltr">
        {/* camera targets, in graph coordinates */}
        <rect data-cam="g-spray" x={40} y={40} width={1040} height={200} className="g-cam" />
        <rect data-cam="g-success" x={40} y={105} width={1040} height={140} className="g-cam" />
        <rect data-cam="g-lateral" x={800} y={170} width={320} height={260} className="g-cam" />
        <rect data-cam="g-second" x={40} y={170} width={1040} height={270} className="g-cam" />
        <rect data-cam="g-indicator" x={0} y={100} width={360} height={340} className="g-cam" />
        <rect data-cam="g-gap" x={790} y={330} width={330} height={210} className="g-cam" />
        <rect data-cam="g-summary" x={0} y={10} width={1120} height={540} className="g-cam" />

        <g className="g-cols" style={P("cols")}>
          <text x={170} y={30} textAnchor="middle">
            {c.cols.sources}
          </text>
          <text x={560} y={30} textAnchor="middle">
            {c.cols.accounts}
          </text>
          <text x={950} y={30} textAnchor="middle">
            {c.cols.hosts}
          </text>
        </g>

        {/* failed logons from the first source */}
        <g className="g-fail" data-dim-on="1">
          <Edge d={curve(170, 130, 560, 70)} k="e1" kind="observed" outcome="fail" width={3} />
          <Edge d={curve(560, 70, 950, 200)} k="e1" kind="observed" outcome="fail" width={3} />
        </g>
        {/* the successful network logon, then the RDP session */}
        <Edge d={curve(170, 130, 560, 200)} k="e2" kind="observed" outcome="ok" />
        <Edge d={curve(560, 200, 950, 200)} k="e2" kind="observed" outcome="ok" />
        <Edge d={curve(170, 139, 560, 209)} k="e3" kind="observed" outcome="ok" />
        <Edge d={curve(560, 209, 950, 209)} k="e3" kind="observed" outcome="ok" />
        <text x={700} y={190} textAnchor="middle" className="g-elabel" style={P("e2")}>
          type 3 · NTLM
        </text>
        <text x={700} y={232} textAnchor="middle" className="g-elabel" style={P("e3")}>
          type 10 · RDP
        </text>
        {/* from the jump server to the file server */}
        <Edge d="M1050 205 C 1108 205, 1108 365, 1050 365" k="e4" kind="observed" outcome="ok" />
        <g className="g-inv" style={P("inv")}>
          <rect x={835} y={238} width={230} height={22} rx={11} />
          <text x={950} y={253} textAnchor="middle">
            198.51.100.10 = JMP01 · {c.inventory}
          </text>
        </g>
        <text x={950} y={298} textAnchor="middle" className="g-elabel" style={P("e4")}>
          j.morgan · Kerberos · 02:21:13
        </text>
        {/* the second source */}
        <g className="g-fail" data-dim-on="1">
          <Edge d={curve(170, 400, 560, 400)} k="e5" kind="observed" outcome="fail" width={2.5} />
          <Edge d={curve(560, 400, 950, 200)} k="e5" kind="observed" outcome="fail" width={2.5} />
        </g>
        {/* shared attribute between the sources: indicator only */}
        <Edge d="M70 140 C 8 190, 8 350, 70 392" k="e6" kind="indicator" width={2} />
        <g className="g-ind" style={P("e6")}>
          <text x={170} y={258} textAnchor="middle">
            {c.sameClient}
          </text>
          <text x={170} y={278} textAnchor="middle" className="g-mono">
            DESKTOP-7Q2M4
          </text>
        </g>
        {/* not in the data */}
        <Edge d="M950 394 L 950 474" k="e7" kind="absent" width={1.5} />

        <Node x={170} y={130} k="nS45" kind="source" label="203.0.113.45" />
        <Node x={170} y={400} k="nS77" kind="source" label="203.0.113.77" />
        <Node x={560} y={70} k="nA17" kind="account" label={c.accounts17} sub={`${c.failed} ×${counters.s45}`} />
        <Node x={560} y={200} k="nAJM" kind="account" label="j.morgan" />
        <Node x={560} y={400} k="nA7" kind="account" label={c.accounts7} sub={`${c.failed} ×${counters.s77}`} />
        <Node x={950} y={200} k="nJMP" kind="host" label="JMP01" />
        <Node x={950} y={370} k="nSRV" kind="host" label="SRV-FILE01" />
        <Node x={950} y={500} k="ghost" kind="absent" label={c.files} sub={c.notInLogs} />
      </svg>
      <Axis m={m} />
    </div>
  );
}

function Flow({ items, dashed = false }: { items: string[]; dashed?: boolean }) {
  return (
    <span className="m3-flow" data-dashed={dashed || undefined}>
      {items.map((it, i) => (
        <span key={it + i}>
          {i ? (
            <span aria-hidden="true" className="m3-arrow">
              {dashed ? "⇢" : "→"}
            </span>
          ) : null}
          <span className="m3-pill">{v(it)}</span>
        </span>
      ))}
    </span>
  );
}

function Card({ cam, k, kind, time, title, children }: { cam: string; k: string; kind: "fail" | "ok" | "indicator" | "absent"; time?: string; title: string; children: ReactNode }) {
  return (
    <li className="m3-card" data-cam={cam} data-kind={kind} style={P(k)}>
      {time ? <span className="m3-time">{v(time)}</span> : null}
      <span className="m3-title">{title}</span>
      {children}
    </li>
  );
}

export function Ch3Mobile({ m, counters }: SceneProps) {
  const c = m.ch3;
  const L = c.legend;
  return (
    <div className="m3">
      <div className="m3-start" data-cam="m3-start">
        <span className="m3-axis">{c.axis}</span>
        <div className="ms-legend ms-legend--inline">
          <span data-k="observed">{L.observed}</span>
          <span data-k="inventory">{L.inventory}</span>
          <span data-k="indicator">{L.indicator}</span>
          <span data-k="absent">{L.absent}</span>
        </div>
      </div>
      <ol className="m3-cards">
        <Card cam="m3-a" k="e1" kind="fail" time="02:10:05–02:16:40" title={c.labels.spray}>
          <Flow items={["203.0.113.45", c.accounts17, "JMP01"]} />
          <span className="m3-meta">
            {v("4625")} · {c.failed} {v(`×${counters.s45}`)}
          </span>
        </Card>
        <Card cam="m3-b" k="e2" kind="ok" time="02:14:37" title={c.labels.success}>
          <Flow items={["203.0.113.45", "j.morgan", "JMP01"]} />
          <span className="m3-meta">{v("4624 · type 3 · NTLM")}</span>
        </Card>
        <Card cam="m3-c" k="e3" kind="ok" time="02:14:52" title={c.labels.rdp}>
          <Flow items={["203.0.113.45", "j.morgan", "JMP01"]} />
          <span className="m3-meta">{v("4624 · type 10 · Negotiate")}</span>
        </Card>
        <Card cam="m3-d" k="e4" kind="ok" time="02:21:13" title={c.labels.lateral}>
          <Flow items={["198.51.100.10", "j.morgan", "SRV-FILE01"]} />
          <span className="m3-meta">{v("4624 · type 3 · Kerberos")}</span>
          <span className="m3-inv" style={P("inv")}>
            {v("198.51.100.10 = JMP01")} · {c.inventory}
          </span>
        </Card>
        <Card cam="m3-e" k="e5" kind="fail" time="02:31:08–02:34:02" title={c.labels.second}>
          <Flow items={["203.0.113.77", c.accounts7, "JMP01"]} />
          <span className="m3-meta">
            {v("4625")} · {c.failed} {v(`×${counters.s77}`)}
          </span>
        </Card>
        <Card cam="m3-f" k="e6" kind="indicator" title={c.labels.indicator}>
          <Flow items={["203.0.113.45", "203.0.113.77"]} dashed />
          <span className="m3-meta">
            {c.sameClient} · {v("DESKTOP-7Q2M4")}
          </span>
        </Card>
        <Card cam="m3-g" k="e7" kind="absent" title={c.labels.gap}>
          <Flow items={["SRV-FILE01", c.files]} dashed />
          <span className="m3-meta">{c.notInLogs}</span>
        </Card>
      </ol>
    </div>
  );
}

/** iPhone: a compact path strip pinned to the top of the viewport, lighting up as entities appear. */
export function Ch3Strip({ m }: SceneProps) {
  return (
    <div className="m3-strip" aria-hidden="true">
      <span className="m3-strip-row">
        <span className="m3-pill" style={P("nS45")}>
          {v("203.0.113.45")}
        </span>
        <span className="m3-arrow" style={P("e2")}>
          →
        </span>
        <span className="m3-pill" style={P("nAJM")}>
          {v("j.morgan")}
        </span>
        <span className="m3-arrow" style={P("e2")}>
          →
        </span>
        <span className="m3-pill" style={P("nJMP")}>
          {v("JMP01")}
        </span>
        <span className="m3-arrow" style={P("e4")}>
          →
        </span>
        <span className="m3-pill" style={P("nSRV")}>
          {v("SRV-FILE01")}
        </span>
      </span>
      <span className="m3-strip-row">
        <span className="m3-pill" data-kind="indicator" style={P("nS77")}>
          {v("203.0.113.77")}
        </span>
        <span className="m3-strip-note" style={P("e6")}>
          ⇢ {m.ch3.sameClient}
        </span>
      </span>
    </div>
  );
}
