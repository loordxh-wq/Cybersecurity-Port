import type { CSSProperties, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { frames, opsCopy, storyOrder, storyTier, type Frame, type OpsCopy, type PointKind, type Story, type StoryId, type Tier } from "./copy";
import { ad, net, siem, soc } from "./data";

/**
 * Cyber Operations proposal mockups: static frames rendered from code, protected
 * preview only. Each story frame shows one paused moment of a guided story: the
 * provenance strip, the scene (a custom illustration, always LTR), the caption, the
 * reasoning panel and the chapter rail. Nothing animates here; the motion each frame
 * stands for is specified in docs/cyber-operations-proposal.md.
 */
const storyFrames: StoryId[] = ["soc", "net", "siem", "ad"];

const href = (frame: Frame) => `/operations?frame=${frame}`;

/** Technical values stay left-to-right inside Hebrew and Arabic text. */
const V = ({ children }: { children: ReactNode }) => (
  <bdi dir="ltr" className="op-v">
    {children}
  </bdi>
);

/**
 * Isolates every Latin or numeric run (addresses, event IDs, times, "24.1 ms",
 * "SYN, SYN-ACK, ACK") so Hebrew and Arabic sentences keep technical values intact
 * and in reading order. Harmless in English.
 */
export const techRun = /[A-Za-z0-9][\w.:\-=/@]*(?:,? [A-Za-z0-9][\w.:\-=/@]*)*/g;
export function iso(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(techRun)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <bdi key={m.index} dir="ltr">
        {m[0]}
      </bdi>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/* ------------------------------------------------------------ provenance */

function TierMark({ tier }: { tier: Tier }) {
  return <span aria-hidden="true" className={`op-mark op-mark--${tier}`} />;
}

export function TierLabel({ c, tier }: { c: OpsCopy; tier: Tier }) {
  return (
    <span className={`op-tier op-tier--${tier}`}>
      <TierMark tier={tier} />
      {c.tiers[tier].label}
    </span>
  );
}

export function Provenance({ c, tier }: { c: OpsCopy; tier: Tier }) {
  return (
    <div className="op-prov" role="note">
      <TierLabel c={c} tier={tier} />
      <span>{c.synthetic}</span>
      {tier === "simulation" && <span>{c.simNote}</span>}
      <span>{c.notSoftware}</span>
      <span className="op-prov-review">
        {c.review.tech}: <em>{c.review.pending}</em> · {c.review.eli}: <em>{c.review.pending}</em>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- glyphs */

/** Small static signature drawing for each story (decorative). */
function Glyph({ id }: { id: StoryId }) {
  const common = { "aria-hidden": true, viewBox: "0 0 120 72", className: "op-glyph" } as const;
  if (id === "net")
    return (
      <svg {...common}>
        <path d="M24 10v54M96 10v54" className="op-g-line" />
        <path d="M24 20 96 32M96 36 24 48M24 52 96 64" className="op-g-hot" />
      </svg>
    );
  if (id === "siem")
    return (
      <svg {...common}>
        <path d="M14 62h96M14 62V8" className="op-g-line" />
        <rect x="72" y="46" width="38" height="16" className="op-g-zone" />
        {[
          [94, 58],
          [80, 56],
          [20, 14],
          [26, 54],
          [20, 50],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.2" className={i < 2 ? "op-g-dot-hot" : "op-g-dot"} />
        ))}
      </svg>
    );
  if (id === "ad")
    return (
      <svg {...common}>
        <path d="M22 12v48M22 24h22M44 24v30M44 38h22M44 54h22M22 60h22" className="op-g-line" />
        <rect x="66" y="48" width="34" height="12" rx="2" className="op-g-zone" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M20 18 C46 18 46 36 64 36 M20 54 C46 54 46 36 64 36 M64 36 H100" className="op-g-hot" />
      <path d="M20 22v28" className="op-g-dash" />
      {[
        [20, 18],
        [20, 54],
        [64, 36],
        [100, 36],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" className="op-g-dot" />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- scenes */

function NetScene({ s }: { s: Story }) {
  const L = s.labels;
  const hot = new Set([3, 4, 5]);
  return (
    <div className="op-net">
      <div className="op-net-list">
        <p className="op-scene-label">{L.list}</p>
        <div className="op-filter">
          <span className="op-filter-k">{L.filter}</span>
          <code>{net.filter}</code>
        </div>
        <table className="op-pkts">
          <thead>
            <tr>
              <th>{L.no}</th>
              <th>{L.time}</th>
              <th>{L.src}</th>
              <th>{L.dst}</th>
              <th>{L.proto}</th>
              <th>{L.len}</th>
              <th>{L.info}</th>
            </tr>
          </thead>
          <tbody>
            {net.packets.map((p) => (
              <tr key={p.no} data-hot={hot.has(p.no) || undefined}>
                <td>{p.no}</td>
                <td>{p.t}</td>
                <td>{p.src}</td>
                <td>{p.dst}</td>
                <td>{p.proto}</td>
                <td>{p.len}</td>
                <td>{p.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figure className="op-ladder">
        <figcaption className="op-scene-label">{L.ladder}</figcaption>
        <svg viewBox="0 0 360 290" role="img" aria-label={`${L.ladder}: SYN, SYN-ACK, ACK · ${L.rtt} ${net.rttMs} ms`}>
          <text x="118" y="20" className="op-l-head">{L.client}</text>
          <text x="118" y="36" className="op-l-addr">{`${net.client}:${net.clientPort}`}</text>
          <text x="300" y="20" className="op-l-head">{L.server}</text>
          <text x="300" y="36" className="op-l-addr">{`${net.server}:443`}</text>
          <path d="M118 48v232M300 48v232" className="op-l-life" />
          {net.ladder.map((m, i) => {
            const y = 70 + i * 74;
            const [x1, x2] = m.dir === "out" ? [118, 300] : [300, 118];
            const y2 = y + 34;
            const mx = (x1 + x2) / 2;
            const my = (y + y2) / 2;
            // keep labels upright: a right-to-left arrow reads at the same slope, mirrored
            let ang = (Math.atan2(y2 - y, x2 - x1) * 180) / Math.PI;
            if (ang > 90) ang -= 180;
            return (
              <g key={m.label}>
                <path d={`M${x1} ${y} L${x2} ${y2}`} className="op-l-msg" markerEnd="url(#op-arrow)" />
                <text x={mx} y={my - 7} transform={`rotate(${ang} ${mx} ${my})`} className="op-l-label">
                  {m.label}
                </text>
                <text x={mx} y={my + 14} transform={`rotate(${ang} ${mx} ${my})`} className="op-l-detail">
                  {m.detail}
                </text>
                <text x="110" y={(m.dir === "out" ? y : y2) + 3} className="op-l-time">
                  {m.t}
                </text>
              </g>
            );
          })}
          <path d="M30 70v108M26 70h8M26 178h8" className="op-l-rtt" />
          <text x="20" y="124" className="op-l-rtt-t" transform="rotate(-90 20 124)">{`${L.rtt} ${net.rttMs} ms`}</text>
          <defs>
            <marker id="op-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" className="op-l-head-arrow" />
            </marker>
          </defs>
        </svg>
      </figure>
    </div>
  );
}

function SiemScene({ s }: { s: Story }) {
  const L = s.labels;
  // log scale for failures per account: 1 → bottom, 40 → top
  const W = 360;
  const H = 240;
  const x = (a: number) => 40 + (a / 16) * (W - 56);
  const y = (f: number) => H - 32 - (Math.log10(f) / Math.log10(40)) * (H - 56);
  const zoneX = x(siem.threshold);
  const zoneY = y(siem.perAccountMax);
  return (
    <div className="op-siem">
      <figure className="op-chart">
        <figcaption className="op-scene-label">{L.chart}</figcaption>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={siem.sources.map((p) => `${p.ip}: ${p.accounts} / ${p.failures}`).join("; ")}>
          <rect x={zoneX} y={zoneY} width={W - 16 - zoneX} height={H - 32 - zoneY} className="op-c-zone" />
          <path d={`M40 ${H - 32}H${W - 16}M40 ${H - 32}V16`} className="op-c-axis" />
          {[1, 3, 10, 40].map((t) => (
            <g key={t}>
              <path d={`M40 ${y(t)}H${W - 16}`} className="op-c-grid" />
              <text x="32" y={y(t) + 4} className="op-c-tick" textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          {[0, 4, 8, 12, 16].map((t) => (
            <text key={t} x={x(t)} y={H - 14} className="op-c-tick" textAnchor="middle">
              {t}
            </text>
          ))}
          <path d={`M${zoneX} 16V${H - 32}`} className="op-c-thr" />
          <text x={zoneX + 4} y="26" className="op-c-thr-t">{`${L.threshold} ≥ ${siem.threshold}`}</text>
          {siem.sources.map((p) => {
            const cx = x(p.accounts);
            const cy = y(p.failures / p.accounts);
            return (
              <g key={p.ip} className={`op-c-pt op-c-pt--${p.kind}`}>
                <circle cx={cx} cy={cy} r={p.kind === "normal" ? 4 : 6} />
                <text x={cx + p.label[0]} y={cy + p.label[1]} textAnchor={p.label[2]}>
                  {p.ip}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="op-axis-note">
          ↔ {L.x} · ↕ {L.y}
        </p>
        <ul className="op-legend">
          {(["spray", "review", "brute", "normal"] as const).map((k) => (
            <li key={k}>
              <span aria-hidden="true" className={`op-dot op-dot--${k}`} />
              {L[k]}
            </li>
          ))}
        </ul>
      </figure>
      <div className="op-siem-side">
        <p className="op-scene-label">{L.rule}</p>
        <pre className="op-code" dir="ltr">
          <code>{siem.spl.join("\n")}</code>
        </pre>
        <p className="op-scene-label">{L.fields}</p>
        <dl className="op-fields">
          {siem.fields.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function AdScene({ s }: { s: Story }) {
  const L = s.labels;
  return (
    <div className="op-ad">
      <div>
        <p className="op-scene-label">{L.tree}</p>
        <ul className="op-tree">
          {ad.tree.map((n) => (
            <li key={n.name} style={{ "--d": n.depth } as CSSProperties} data-focus={("focus" in n && n.focus) || undefined} data-kind={n.kind}>
              <span className="op-tree-name">{n.name}</span>
              {n.gpos.map((g) => (
                <span key={g} className="op-chip" title={L.gpo}>
                  {g}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
      <div className="op-ad-side">
        <p className="op-scene-label">{L.order}</p>
        <ol className="op-order">
          {ad.order.map((o, i) => (
            <li key={o} data-last={i === ad.order.length - 1 || undefined}>
              <span className="op-order-n">{i + 1}</span>
              {o}
              {i === ad.order.length - 1 && <span className="op-chip">WS-Baseline</span>}
            </li>
          ))}
        </ol>
        <p className="op-small">{L.orderNote}</p>
        <div className="op-setting">
          <span className="op-scene-label">{L.setting}</span>
          <span>{ad.setting[0]}</span>
          <strong>{ad.setting[1]}</strong>
        </div>
        <p className="op-pitfall">{L.pitfall}</p>
        <p className="op-scene-label">{L.check}</p>
        <ul className="op-cmds">
          {ad.checks.map((c) => (
            <li key={c}>
              <code>{c}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SocScene({ s }: { s: Story }) {
  const L = s.labels;
  const kept = [
    ["02:14:37", `4624 · type 3 · NTLM · ${soc.account} → ${soc.jump}`],
    ["02:14:52", `4624 · type 10 · ${soc.account} → ${soc.jump}`],
    ["02:21:13", `4624 · type 3 · Kerberos · ${soc.account} → ${soc.file}`],
    ["02:31:08", `4625 · ${soc.second} · ${soc.client}`],
  ];
  return (
    <div className="op-soc">
      <div className="op-board">
        {s.points.map((p) => (
          <div key={p.k} className={`op-card op-card--${p.k}`}>
            <p className="op-card-k">{s.kinds[p.k]}</p>
            <p>{iso(p.t)}</p>
          </div>
        ))}
      </div>
      <div className="op-soc-foot">
        <div>
          <p className="op-scene-label">{L.kept}</p>
          <ol className="op-kept">
            {kept.map(([t, e]) => (
              <li key={t}>
                <span className="op-v">{t}</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

const scenes: Record<StoryId, (p: { s: Story }) => ReactNode> = { net: NetScene, siem: SiemScene, ad: AdScene, soc: SocScene };

/* ---------------------------------------------------------------- player */

export function Icon({ name }: { name: "play" | "prev" | "next" | "cc" | "text" }) {
  const d = {
    play: "M7 4.5v15l12-7.5z",
    prev: "M12 5V2L7 6.5 12 11V7.5a5.5 5.5 0 1 1-5.5 5.5H4a8 8 0 1 0 8-8z",
    next: "M15.6 5H18v14h-2.4zM14.6 12 5 19V5z",
    cc: "M3 6h18v12H3zM5 8v8h14V8zm2.2 2h3v1.4H8.6v1.2h1.6V14h-3zm6 0h3v1.4h-1.6v1.2h1.6V14h-3z",
    text: "M4 5h16v2H4zm0 4h16v2H4zm0 4h10v2H4zm0 4h13v2H4z",
  }[name];
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d={d} />
    </svg>
  );
}

function Points({ s }: { s: Story }) {
  return (
    <ul className="op-points">
      {s.points.map((p) => (
        <li key={p.k} data-k={p.k}>
          <span className="op-points-k">{s.kinds[p.k as PointKind]}</span>
          {iso(p.t)}
        </li>
      ))}
    </ul>
  );
}

function StoryFrame({ c, id }: { c: OpsCopy; id: StoryId }) {
  const s = c.stories[id];
  const Scene = scenes[id];
  const n = s.chapters.length;
  return (
    <article className="op-story">
      <Provenance c={c} tier={storyTier[id]} />
      <header className="op-story-head">
        <p className="op-eyebrow">{s.cat}</p>
        <h1 className="op-h1">{iso(s.title)}</h1>
      </header>
      <div className="op-player">
        <div className="op-stage-wrap">
          <div className="op-stage" dir="ltr">
            <p className="op-stage-chapter">
              {String(s.at + 1).padStart(2, "0")} · {s.chapters[s.at]}
            </p>
            <Scene s={s} />
          </div>
          <p className="op-caption">{iso(s.caption)}</p>
          <ol className="op-rail" aria-label={c.player.chapter}>
            {s.chapters.map((ch, i) => (
              <li key={ch} aria-current={i === s.at ? "step" : undefined} data-done={i < s.at || undefined}>
                <span className="op-rail-bar">
                  <span style={{ width: i < s.at ? "100%" : i === s.at ? "46%" : "0%" }} />
                </span>
                <span className="op-rail-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="op-rail-name">{ch}</span>
              </li>
            ))}
          </ol>
          <div className="op-transport">
            <button type="button" aria-label={c.player.replay}>
              <Icon name="prev" />
            </button>
            <button type="button" aria-label={c.player.play} className="op-play">
              <Icon name="play" />
            </button>
            <button type="button" aria-label={c.player.next}>
              <Icon name="next" />
            </button>
            <span className="op-count">
              {c.player.chapter} {s.at + 1} {c.player.of} {n} · <V>{s.minutes}</V>
            </span>
            <span className="op-transport-end">
              <button type="button" aria-pressed="true" className="op-tbtn">
                <Icon name="cc" />
                {c.player.captions}
              </button>
              <Link href={href("text")} className="op-tbtn">
                <Icon name="text" />
                {c.player.text}
              </Link>
            </span>
          </div>
        </div>
        <aside className="op-reason" aria-label={c.player.reasoning}>
          {id === "soc" ? (
            // The SOC board already shows the three kinds of statement; the panel carries what follows from them.
            <>
              <p className="op-scene-label">{s.labels.next}</p>
              <ol className="op-next">
                {[s.labels.n1, s.labels.n2, s.labels.n3].map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ol>
              <p className="op-small">{s.labels.motion}</p>
            </>
          ) : (
            <>
              <p className="op-scene-label">{c.player.reasoning}</p>
              <Points s={s} />
            </>
          )}
        </aside>
      </div>
      <p className="op-disclosure">{storyTier[id] === "verified" ? null : c.disclosure}</p>
    </article>
  );
}

/* ------------------------------------------------------------------- hub */

function Hub({ c }: { c: OpsCopy }) {
  return (
    <div className="op-hub">
      <header className="op-hub-head">
        <p className="op-eyebrow">{c.eyebrow}</p>
        <h1 className="op-h1 op-h1--xl">{c.hub.title}</h1>
        <p className="op-lead">{c.hub.lead}</p>
      </header>
      <section aria-labelledby="op-read" className="op-tiers">
        <h2 id="op-read" className="op-h2">
          {c.hub.readTitle}
        </h2>
        <ul>
          {(["verified", "demonstration", "simulation"] as const).map((t) => (
            <li key={t} className={`op-tiercard op-tiercard--${t}`}>
              <TierLabel c={c} tier={t} />
              <p>{c.tiers[t].desc}</p>
            </li>
          ))}
        </ul>
      </section>
      <div className="op-hub-body">
        <div className="op-cats">
          {storyOrder.map((id, i) => {
            const cat = c.hub.cats[id];
            const s = c.stories[id];
            return (
              <section key={id} className="op-cat" aria-labelledby={`op-cat-${id}`}>
                <div className="op-cat-head">
                  <span className="op-cat-n">{String(i + 1).padStart(2, "0")}</span>
                  <h2 id={`op-cat-${id}`} className="op-h2">
                    {cat.name}
                  </h2>
                  <p className="op-muted">{cat.scope}</p>
                </div>
                <div className="op-cat-items">
                  <Link href={href(id)} className="op-storycard">
                    <Glyph id={id} />
                    <span className="op-storycard-body">
                      <TierLabel c={c} tier={storyTier[id]} />
                      <span className="op-storycard-title">{iso(s.title)}</span>
                      <span className="op-muted">{iso(s.summary)}</span>
                      <span className="op-storycard-meta">
                        {s.chapters.length} {c.hub.chapters} · <V>{s.minutes}</V> · {c.review.eli}: {c.review.pending}
                      </span>
                    </span>
                  </Link>
                  {cat.caseFile && (
                    <div className="op-verified">
                      <TierLabel c={c} tier="verified" />
                      <span>
                        <V>{cat.caseFile}</V> · {c.hub.awaiting}
                      </span>
                      <span className="op-small">
                        {c.hub.verifiedNone} ({c.hub.previewOnly})
                      </span>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
        <aside className="op-route" aria-labelledby="op-route">
          <h2 id="op-route" className="op-h3">
            {c.hub.routeTitle}
          </h2>
          <ol>
            {c.hub.route.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- text version */

function TextVersion({ c }: { c: OpsCopy }) {
  const s = c.stories.net;
  return (
    <article className="op-text">
      <Provenance c={c} tier="demonstration" />
      <p className="op-eyebrow">
        {c.text.title} · {s.cat}
      </p>
      <h1 className="op-h1">{s.title}</h1>
      <p className="op-lead">{c.text.lead}</p>
      <ol className="op-toc">
        {s.chapters.map((ch, i) => (
          <li key={ch} aria-current={i === s.at ? "true" : undefined}>
            {String(i + 1).padStart(2, "0")} · {ch}
          </li>
        ))}
      </ol>
      <section aria-labelledby="op-t3">
        <h2 id="op-t3" className="op-h2">
          {c.player.chapter} {s.at + 1} · {s.chapters[s.at]}
        </h2>
        <p>{iso(s.caption)}</p>
        <Points s={s} />
        <h3 className="op-h3">{c.text.values}</h3>
        <div className="op-table-scroll" tabIndex={0} role="region" aria-label={c.text.values}>
          <table className="op-pkts">
            <thead>
              <tr>
                {(["no", "time", "src", "dst", "proto", "len", "info"] as const).map((k) => (
                  <th key={k}>{s.labels[k]}</th>
                ))}
              </tr>
            </thead>
            <tbody dir="ltr">
              {net.packets
                .filter((p) => p.no >= 3 && p.no <= 5)
                .map((p) => (
                  <tr key={p.no}>
                    <td>{p.no}</td>
                    <td>{p.t}</td>
                    <td>{p.src}</td>
                    <td>{p.dst}</td>
                    <td>{p.proto}</td>
                    <td>{p.len}</td>
                    <td>{p.info}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
      <section aria-labelledby="op-refs">
        <h2 id="op-refs" className="op-h3">
          {c.text.refs}
        </h2>
        <ul className="op-refs" dir="ltr">
          {c.text.refList.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <Link href={href("net")} className="op-tbtn">
        {c.text.back}
      </Link>
      <p className="op-disclosure">{c.disclosure}</p>
    </article>
  );
}

/* ------------------------------------------------------- home integration */

function HomeFrame({ c }: { c: OpsCopy }) {
  return (
    <div className="op-home">
      {/* In the real home the page heading is the hero; the mockup shows only the chapter. */}
      <h1 className="sr-only">{c.frameNames.home}</h1>
      <section className="op-home-chapter" aria-labelledby="op-home-t">
        <p className="op-rule">
          <span className="op-v">05</span> · {c.home.chapter}
        </p>
        <h2 id="op-home-t" className="op-h1">
          {c.home.title}
        </h2>
        <p className="op-lead">{c.home.lead}</p>
        <ul className="op-tiles">
          {storyOrder.map((id) => (
            <li key={id}>
              <Link href={href(id)} className="op-tile">
                <Glyph id={id} />
                <span className="op-tile-name">{c.hub.cats[id].name}</span>
                <TierLabel c={c} tier={storyTier[id]} />
              </Link>
            </li>
          ))}
        </ul>
        <Link href={href("hub")} className="op-cta">
          {c.home.cta}
        </Link>
      </section>
      <aside className="op-brief" aria-labelledby="op-brief-t">
        <h2 id="op-brief-t" className="op-h3">
          {c.home.briefTitle}
        </h2>
        <dl>
          {c.home.brief.map(([k, v], i) => (
            <div key={k}>
              <dt>
                <TierMark tier={(["verified", "demonstration", "simulation"] as const)[i]!} />
                {k}
              </dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ page */

export function OpsMockup({ locale, frame }: { locale: Locale; frame: Frame }) {
  const c = opsCopy[locale];
  return (
    <div className="op">
      <nav className="op-banner" aria-label={c.banner}>
        <p>{c.banner}</p>
        <ul>
          {frames.map((f) => (
            <li key={f}>
              <Link href={href(f)} aria-current={f === frame ? "page" : undefined}>
                {c.frameNames[f]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="site-wrap op-wrap">
        {frame === "hub" && <Hub c={c} />}
        {storyFrames.includes(frame as StoryId) && <StoryFrame c={c} id={frame as StoryId} />}
        {frame === "text" && <TextVersion c={c} />}
        {frame === "home" && <HomeFrame c={c} />}
      </div>
    </div>
  );
}
