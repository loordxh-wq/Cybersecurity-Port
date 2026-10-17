import type { CaseCategory } from "@/content/case-files";

/**
 * Case diagrams: abstract line drawings of the technique each case is about, never
 * of results. No data, addresses, hostnames or screenshots: a TCP handshake ladder
 * for traffic analysis, a filtering funnel for SIEM triage, a directory tree for
 * Active Directory. Decorative (aria-hidden). SVG geometry never mirrors, so diagrams read the same in RTL.
 */
export function CaseGlyph({ category }: { category: CaseCategory }) {
  return (
    <svg className="cf-glyph" data-category={category} viewBox="0 0 200 84" aria-hidden="true" focusable="false">
      {category === "network" ? <Ladder /> : category === "siem" ? <Funnel /> : <Tree />}
    </svg>
  );
}

/** Two endpoints and the three-way handshake between them (protocol flags only). */
function Ladder() {
  const arrow = (x1: number, y1: number, x2: number, y2: number, accent = false) => {
    const dir = x2 > x1 ? -1 : 1;
    return (
      <g className={accent ? "cf-g-accent" : "cf-g-line"}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} />
        <polyline points={`${x2 + dir * 6},${y2 - 3.5} ${x2},${y2} ${x2 + dir * 6},${y2 + 3.5}`} fill="none" />
      </g>
    );
  };
  return (
    <>
      <rect className="cf-g-node" x="22" y="6" width="12" height="8" />
      <rect className="cf-g-node" x="166" y="6" width="12" height="8" />
      <line className="cf-g-rail" x1="28" y1="16" x2="28" y2="80" />
      <line className="cf-g-rail" x1="172" y1="16" x2="172" y2="80" />
      {arrow(30, 24, 170, 36)}
      {arrow(170, 44, 30, 56)}
      {arrow(30, 64, 170, 76, true)}
      <text className="cf-g-label" x="100" y="27" textAnchor="middle">SYN</text>
      <text className="cf-g-label" x="100" y="47" textAnchor="middle">SYN-ACK</text>
      <text className="cf-g-label cf-g-label--accent" x="100" y="67" textAnchor="middle">ACK</text>
    </>
  );
}

/** Many events, one query, a short list: the shape of triage. */
function Funnel() {
  const dots = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) dots.push(<circle key={`${r}-${c}`} className="cf-g-dot" cx={14 + c * 11} cy={14 + r * 14} r="2" />);
  return (
    <>
      {dots}
      <path className="cf-g-line" d="M84 8 L122 34 L122 50 L84 76" fill="none" />
      <line className="cf-g-rail" x1="122" y1="42" x2="146" y2="42" />
      <circle className="cf-g-dot" cx="156" cy="28" r="2.5" />
      <circle className="cf-g-accent-fill" cx="156" cy="42" r="3.5" />
      <circle className="cf-g-dot" cx="156" cy="56" r="2.5" />
      <rect className="cf-g-accent" x="172" y="35" width="16" height="14" fill="none" />
      <line className="cf-g-accent" x1="160" y1="42" x2="172" y2="42" />
    </>
  );
}

/** Domain root, organizational units, objects: one security group highlighted. */
function Tree() {
  const ous = [44, 100, 156];
  return (
    <>
      <rect className="cf-g-node" x="92" y="4" width="16" height="10" />
      <line className="cf-g-rail" x1="100" y1="14" x2="100" y2="24" />
      <line className="cf-g-rail" x1="44" y1="24" x2="156" y2="24" />
      {ous.map((x, i) => (
        <g key={x}>
          <line className="cf-g-rail" x1={x} y1="24" x2={x} y2="34" />
          <rect className={i === 1 ? "cf-g-accent" : "cf-g-node"} x={x - 9} y="34" width="18" height="10" fill="none" />
          <line className="cf-g-rail" x1={x} y1="44" x2={x} y2="56" />
          <line className="cf-g-rail" x1={x - 16} y1="56" x2={x + 16} y2="56" />
          {[-16, 0, 16].map((dx) => (
            <g key={dx}>
              <line className="cf-g-rail" x1={x + dx} y1="56" x2={x + dx} y2="66" />
              <circle className={i === 1 ? "cf-g-accent-fill" : "cf-g-dot"} cx={x + dx} cy="71" r={i === 1 ? 3 : 2.5} />
            </g>
          ))}
        </g>
      ))}
    </>
  );
}
