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

/**
 * Desktop focus without a camera: every element names the beats it belongs to. While a beat is in
 * focus, everything outside it dims and the focused nodes get a ring; the graph never scales.
 */
type Group = "fSpray" | "fSuccess" | "fRdp" | "fLateral" | "fSecond" | "fInd" | "fGap";
const fx = (k: string | null, groups: Group[], extra: CSSProperties = {}) =>
  ({ ...(k ? { "--p": `var(--${k})` } : {}), "--fg": `min(1, calc(${groups.map((g) => `var(--${g})`).join(" + ")}))`, ...extra }) as CSSProperties;

type NodeProps = { x: number; y: number; k: string; kind: "source" | "account" | "host" | "absent"; label: ReactNode; sub?: ReactNode; w?: number; groups: Group[] };
function Node({ x, y, k, kind, label, sub, w = 200, groups }: NodeProps) {
  const h = sub ? 52 : 40;
  return (
    <g className="g-node" data-kind={kind} data-k={k} data-fx="" style={fx(k, groups)}>
      <rect x={x - w / 2 - 5} y={y - h / 2 - 5} width={w + 10} height={h + 10} rx={6} className="g-ring" />
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

/** Observed edges draw in; patterned edges (indicator, not in the data) fade in with their dashes intact. No masks. */
function Edge({
  d,
  k,
  kind,
  outcome,
  width = 2,
  groups,
}: {
  d: string;
  k: string;
  kind: "observed" | "indicator" | "absent";
  outcome?: "ok" | "fail";
  width?: number;
  groups: Group[];
}) {
  if (kind === "observed")
    return (
      <path
        d={d}
        className="g-edge"
        data-outcome={outcome}
        data-k={k}
        data-fx=""
        style={fx(k, groups, { "--vis": 1 } as CSSProperties)}
        pathLength={1}
        strokeWidth={width}
        fill="none"
      />
    );
  return <path d={d} className="g-edge" data-kind={kind} data-k={k} data-fx="" style={fx(k, groups)} strokeWidth={width} fill="none" />;
}

const ticks = [
  ...results.map((e) => ({ t: e.time.slice(0, 8), ok: e.eventId === 4624, src: "45" })),
  ...windowEvents
    .filter((e) => e.ip === "203.0.113.77" || e.id === "e-0201")
    .map((e) => ({ t: e.time.slice(0, 8), ok: e.eventId === 4624, src: e.ip === "203.0.113.77" ? "77" : "45" })),
];

function Axis({ m }: Pick<SceneProps, "m">) {
  return (
    <div className="g-axis" dir="ltr">
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
      <span className="g-axis-label">{m.ch3.axis}</span>
    </div>
  );
}

/** Close-up panel: one card per beat, crossfading; the details the graph can only hint at. */
function Panel({ m, lab, counters }: SceneProps) {
  const c = m.ch3;
  const q = c.panel;
  const Row = ({ k, children }: { k: string; children: ReactNode }) => (
    <div className="d3-close" style={P(k)}>
      {children}
    </div>
  );
  return (
    <aside className="d3-panel">
      <Row k="pStart">
        <span className="d3-close-kicker">{q.start}</span>
        <span className="d3-close-big">{v("203.0.113.45")}</span>
        <dl className="d3-close-facts">
          <div>
            <dt>{q.events}</dt>
            <dd>{v(19)}</dd>
          </div>
          <div>
            <dt>{q.fails}</dt>
            <dd>{v("4625 ×17")}</dd>
          </div>
          <div>
            <dt>{q.oks}</dt>
            <dd>{v("4624 ×2")}</dd>
          </div>
        </dl>
      </Row>
      <Row k="pSpray">
        <span className="d3-close-kicker">{c.labels.spray}</span>
        <span className="d3-close-big" data-tone="fail">
          {c.failed} {v(`×${counters.s45}`)}
        </span>
        <span className="d3-close-line">
          {v(17)} {q.accountsEach} · {q.onHost} {v("JMP01")}
        </span>
        <span className="d3-close-line">
          {v("02:10:05")} → {q.lastAttempt} {v("02:16:40")}
        </span>
      </Row>
      <Row k="pSuccess">
        <span className="d3-close-kicker">{c.labels.success}</span>
        <span className="d3-close-big" data-tone="ok">
          {v("e-0193 · 02:14:37")}
        </span>
        <span className="d3-close-line">{v("203.0.113.45 → j.morgan → JMP01")}</span>
        <span className="d3-close-line">
          {v("4624")} · {lab.fields.logonType} {v(3)} · {v("NTLM")}
        </span>
      </Row>
      <Row k="pRdp">
        <span className="d3-close-kicker">{c.labels.rdp}</span>
        <span className="d3-close-big" data-tone="ok">
          {v("e-0194 · 02:14:52")}
        </span>
        <span className="d3-close-line">{q.after}</span>
        <span className="d3-close-line">
          {v("4624")} · {lab.fields.logonType} {v(10)} · {v("Negotiate")}
        </span>
      </Row>
      <Row k="pLateral">
        <span className="d3-close-kicker">{c.labels.lateral}</span>
        <span className="d3-close-big" data-tone="ok">
          {v("e-0201 · 02:21:13")}
        </span>
        <span className="d3-close-line">{v("198.51.100.10 → j.morgan → SRV-FILE01")}</span>
        <span className="d3-close-line">
          {v("4624")} · {lab.fields.logonType} {v(3)} · {v("Kerberos")}
        </span>
        <span className="d3-close-inv" style={P("inv")}>
          {v("198.51.100.10 = JMP01")} · {c.inventory}
        </span>
      </Row>
      <Row k="pSecond">
        <span className="d3-close-kicker">{c.labels.second}</span>
        <span className="d3-close-big" data-tone="fail">
          {c.failed} {v(`×${counters.s77}`)}
        </span>
        <span className="d3-close-line">{v("203.0.113.77 → JMP01 · 02:31:08–02:34:02")}</span>
        <span className="d3-close-line">{q.includes}</span>
      </Row>
      <Row k="pInd">
        <span className="d3-close-kicker" data-tone="ind">
          {c.labels.indicator}
        </span>
        <span className="d3-close-big" data-tone="ind">
          {v("DESKTOP-7Q2M4")}
        </span>
        <span className="d3-close-line">{q.sharedName}</span>
        <span className="d3-close-line">{q.setByDevice}</span>
      </Row>
      <Row k="pGap">
        <span className="d3-close-kicker" data-tone="absent">
          {c.labels.gap}
        </span>
        <span className="d3-close-big">
          {v("SRV-FILE01")} · {c.files}
        </span>
        <span className="d3-close-line">{q.noFiles}</span>
      </Row>
    </aside>
  );
}

export function Ch3Desk(props: SceneProps) {
  const { m, counters } = props;
  const c = m.ch3;
  return (
    <div className="d3">
      <div className="d3-stage">
        <svg viewBox="0 0 1120 560" className="d3-graph" direction="ltr">
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
          <Edge d={curve(170, 130, 560, 70)} k="e1" kind="observed" outcome="fail" width={3} groups={["fSpray"]} />
          <Edge d={curve(560, 70, 950, 200)} k="e1" kind="observed" outcome="fail" width={3} groups={["fSpray"]} />
          {/* the successful network logon, then the RDP session */}
          <Edge d={curve(170, 130, 560, 200)} k="e2" kind="observed" outcome="ok" groups={["fSuccess"]} />
          <Edge d={curve(560, 200, 950, 200)} k="e2" kind="observed" outcome="ok" groups={["fSuccess"]} />
          <Edge d={curve(170, 139, 560, 209)} k="e3" kind="observed" outcome="ok" groups={["fRdp"]} />
          <Edge d={curve(560, 209, 950, 209)} k="e3" kind="observed" outcome="ok" groups={["fRdp"]} />
          <text x={700} y={184} textAnchor="middle" className="g-elabel" data-fx="" style={fx("e2", ["fSuccess"])}>
            type 3 · NTLM
          </text>
          <text x={700} y={240} textAnchor="middle" className="g-elabel" data-fx="" style={fx("e3", ["fRdp"])}>
            type 10 · RDP
          </text>
          {/* from the jump server to the file server */}
          <Edge d="M1050 205 C 1108 205, 1108 365, 1050 365" k="e4" kind="observed" outcome="ok" groups={["fLateral"]} />
          <g className="g-inv" data-fx="" style={fx("inv", ["fLateral"])}>
            <rect x={822} y={237} width={256} height={24} rx={12} />
            <text x={950} y={254} textAnchor="middle">
              198.51.100.10 = JMP01 · {c.inventory}
            </text>
          </g>
          <text x={950} y={298} textAnchor="middle" className="g-elabel" data-fx="" style={fx("e4", ["fLateral"])}>
            j.morgan · Kerberos · 02:21:13
          </text>
          {/* the second source */}
          <Edge d={curve(170, 400, 560, 400)} k="e5" kind="observed" outcome="fail" width={2.5} groups={["fSecond"]} />
          <Edge d={curve(560, 400, 950, 200)} k="e5" kind="observed" outcome="fail" width={2.5} groups={["fSecond"]} />
          {/* shared attribute between the sources: indicator only */}
          <Edge d="M70 140 C 8 190, 8 350, 70 392" k="e6" kind="indicator" width={2} groups={["fInd"]} />
          <g className="g-ind" data-fx="" style={fx("e6", ["fInd"])}>
            <text x={170} y={258} textAnchor="middle">
              {c.sameClient}
            </text>
            <text x={170} y={278} textAnchor="middle" className="g-mono">
              DESKTOP-7Q2M4
            </text>
          </g>
          {/* not in the data */}
          <Edge d="M950 394 L 950 474" k="e7" kind="absent" width={1.5} groups={["fGap"]} />

          <Node x={170} y={130} k="nS45" kind="source" label="203.0.113.45" groups={["fSpray", "fSuccess", "fRdp", "fInd"]} />
          <Node x={170} y={400} k="nS77" kind="source" label="203.0.113.77" groups={["fSecond", "fInd"]} />
          <Node x={560} y={70} k="nA17" kind="account" label={c.accounts17} sub={`${c.failed} ×${counters.s45}`} groups={["fSpray"]} />
          <Node x={560} y={200} k="nAJM" kind="account" label="j.morgan" groups={["fSuccess", "fRdp"]} />
          <Node x={560} y={400} k="nA7" kind="account" label={c.accounts7} sub={`${c.failed} ×${counters.s77}`} groups={["fSecond"]} />
          <Node x={950} y={200} k="nJMP" kind="host" label="JMP01" groups={["fSpray", "fSuccess", "fRdp", "fLateral", "fSecond"]} />
          <Node x={950} y={370} k="nSRV" kind="host" label="SRV-FILE01" groups={["fLateral", "fGap"]} />
          <Node x={950} y={500} k="ghost" kind="absent" label={c.files} sub={c.notInLogs} groups={["fGap"]} />
        </svg>
        <Axis m={m} />
      </div>
      <Panel {...props} />
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

function Card({
  cam,
  k,
  kind,
  time,
  title,
  children,
}: {
  cam: string;
  k: string;
  kind: "fail" | "ok" | "indicator" | "absent";
  time?: string;
  title: string;
  children: ReactNode;
}) {
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
