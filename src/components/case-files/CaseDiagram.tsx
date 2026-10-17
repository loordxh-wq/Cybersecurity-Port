import type { CaseCategory } from "@/content/case-files";

/**
 * Case workflow figure: an original technical drawing of the method (never of results)
 * plus the five workflow stages as an ordered flow.
 *
 * - The drawing is SVG and keeps its orientation in RTL (protocol diagrams are not
 *   mirrored); its only words are protocol tokens, plus translated lane names on CF-01.
 *   It is described by the figure caption (role="img" + aria-labelledby).
 * - The stage flow is HTML, so it follows the reading direction in Hebrew and Arabic.
 */
export function CaseDiagram({
  id,
  category,
  caption,
  stages,
  lanes,
}: {
  id: string;
  category: CaseCategory;
  caption: string;
  stages: { key: string; label: string }[];
  lanes?: { client: string; resolver: string; server: string; query: string; response: string };
}) {
  const captionId = `cf-diagram-${id}`;
  return (
    <figure className="cf-diagram">
      <div className="cf-diagram-plate">
        <span aria-hidden="true" className="cf-card-ticks" />
        <svg
          className="cf-diagram-svg"
          data-category={category}
          viewBox={category === "network" ? "0 0 400 300" : "0 0 400 240"}
          role="img"
          aria-labelledby={captionId}
          focusable="false"
        >
          {category === "network" && lanes ? <Sequence lanes={lanes} /> : category === "siem" ? <Triage /> : <Domain />}
        </svg>
      </div>
      <figcaption id={captionId} className="cf-diagram-caption">
        {caption}
      </figcaption>
      <ol className="cf-flow">
        {stages.map((s, i) => (
          <li key={s.key}>
            <span aria-hidden="true" className="cf-flow-no" dir="ltr">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="cf-flow-label">{s.label}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Arrow between two lifelines at height y, with its label centred above it. */
function Msg({ x1, x2, y, label, accent = false, dashed = false, token = true }: { x1: number; x2: number; y: number; label: string; accent?: boolean; dashed?: boolean; token?: boolean }) {
  const dir = x2 > x1 ? -1 : 1;
  return (
    <g className={accent ? "cf-d-accent" : "cf-d-msg"}>
      <line x1={x1} y1={y} x2={x2} y2={y} strokeDasharray={dashed ? "4 4" : undefined} />
      <polyline points={`${x2 + dir * 7},${y - 4} ${x2},${y} ${x2 + dir * 7},${y + 4}`} fill="none" />
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" direction={token ? "ltr" : undefined} className={accent ? "cf-d-label cf-d-label--accent" : "cf-d-label"}>
        {label}
      </text>
    </g>
  );
}

/** CF-01: a page request across three lifelines — DNS, the TCP handshake, then HTTP or TLS. */
function Sequence({ lanes }: { lanes: { client: string; resolver: string; server: string; query: string; response: string } }) {
  const xs = [52, 200, 348];
  const names = [lanes.client, lanes.resolver, lanes.server];
  return (
    <>
      {xs.map((x, i) => (
        <g key={x}>
          <text x={x} y={20} textAnchor="middle" className="cf-d-lane">
            {names[i]}
          </text>
          <rect x={x - 9} y={30} width={18} height={11} className="cf-d-node" />
          <line x1={x} y1={44} x2={x} y2={290} className="cf-d-rail" />
        </g>
      ))}
      <Msg x1={52} x2={200} y={74} label={lanes.query} token={false} />
      <Msg x1={200} x2={52} y={102} label={lanes.response} token={false} />
      <Msg x1={52} x2={348} y={142} label="SYN" />
      <Msg x1={348} x2={52} y={170} label="SYN-ACK" />
      <Msg x1={52} x2={348} y={198} label="ACK" accent />
      <Msg x1={52} x2={348} y={240} label="GET · ClientHello" />
      <Msg x1={348} x2={52} y={268} label="200 · ServerHello" dashed />
      <path d="M380 228 h8 v52 h-8" className="cf-d-bracket" />
      <path d="M380 130 h8 v80 h-8" className="cf-d-bracket cf-d-bracket--accent" />
    </>
  );
}

/** CF-02: many events → a query → the few that matter → a timeline → a verdict. */
function Triage() {
  const dots = [];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 6; c++) dots.push(<circle key={`${r}-${c}`} cx={22 + c * 14} cy={40 + r * 18} r={2.6} className="cf-d-dot" />);
  const ticks = [6, 9, 22, 30, 34, 28, 31, 12, 7, 5];
  return (
    <>
      {dots}
      <path d="M112 30 L176 98 L176 128 L112 196" className="cf-d-msg-line" fill="none" />
      <circle cx={196} cy={96} r={3} className="cf-d-dot" />
      <circle cx={196} cy={113} r={4.5} className="cf-d-accent-fill" />
      <circle cx={196} cy={130} r={3} className="cf-d-dot" />
      <line x1={180} y1={113} x2={190} y2={113} className="cf-d-rail" />
      {/* timeline: a burst between quiet periods */}
      <line x1={222} y1={200} x2={330} y2={200} className="cf-d-rail" />
      {ticks.map((h, i) => (
        <line key={i} x1={228 + i * 10} y1={200} x2={228 + i * 10} y2={200 - h * 2.4} className={i >= 2 && i <= 6 ? "cf-d-accent" : "cf-d-msg-line"} />
      ))}
      <path d="M204 118 C 230 140, 250 150, 268 128" className="cf-d-rail" fill="none" strokeDasharray="3 4" />
      {/* verdict */}
      <rect x={344} y={92} width={42} height={42} className="cf-d-accent" fill="none" />
      <polyline points="354,113 362,121 377,104" className="cf-d-accent" fill="none" />
      <line x1={202} y1={113} x2={344} y2={113} className="cf-d-rail" strokeDasharray="2 5" />
    </>
  );
}

/** CF-03: lab.local → organizational units → users, a security group, computers; a GPO linked to one unit. */
function Domain() {
  return (
    <>
      <rect x={146} y={10} width={108} height={30} className="cf-d-node" />
      <text x={200} y={30} textAnchor="middle" direction="ltr" className="cf-d-token">
        lab.local
      </text>
      <line x1={200} y1={40} x2={200} y2={58} className="cf-d-rail" />
      <line x1={72} y1={58} x2={328} y2={58} className="cf-d-rail" />
      {[72, 200, 328].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={58} x2={x} y2={72} className="cf-d-rail" />
          <rect x={x - 32} y={72} width={64} height={26} className={i === 1 ? "cf-d-accent" : "cf-d-node"} fill="none" />
          <text x={x} y={90} textAnchor="middle" direction="ltr" className={i === 1 ? "cf-d-token cf-d-token--accent" : "cf-d-token"}>
            OU
          </text>
          <line x1={x} y1={98} x2={x} y2={118} className="cf-d-rail" />
        </g>
      ))}
      {/* users */}
      {[48, 72, 96].map((x) => (
        <g key={x}>
          <line x1={x} y1={118} x2={x} y2={132} className="cf-d-rail" />
          <circle cx={x} cy={140} r={7} className="cf-d-node" fill="none" />
          <path d={`M${x - 10} 162 q10 -14 20 0`} className="cf-d-node" fill="none" />
        </g>
      ))}
      <line x1={48} y1={118} x2={96} y2={118} className="cf-d-rail" />
      {/* security group with members */}
      <rect x={172} y={124} width={56} height={22} rx={3} className="cf-d-accent" fill="none" />
      {[182, 200, 218].map((x) => (
        <circle key={x} cx={x} cy={135} r={3.2} className="cf-d-accent-fill" />
      ))}
      {[180, 220].map((x) => (
        <g key={x}>
          <line x1={x} y1={146} x2={x} y2={160} className="cf-d-accent" />
          <circle cx={x} cy={168} r={6} className="cf-d-accent" fill="none" />
        </g>
      ))}
      {/* computers */}
      {[308, 348].map((x) => (
        <g key={x}>
          <rect x={x - 14} y={124} width={28} height={20} className="cf-d-node" fill="none" />
          <line x1={x - 8} y1={150} x2={x + 8} y2={150} className="cf-d-node" />
        </g>
      ))}
      <line x1={308} y1={118} x2={348} y2={118} className="cf-d-rail" />
      {/* GPO linked to the computers' OU */}
      <rect x={300} y={196} width={56} height={28} className="cf-d-node" fill="none" />
      <text x={328} y={215} textAnchor="middle" direction="ltr" className="cf-d-token">
        GPO
      </text>
      <path d="M328 196 V 170 M328 160 V 98" className="cf-d-link" fill="none" />
    </>
  );
}
