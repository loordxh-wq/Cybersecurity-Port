import type { ReactNode } from "react";
import { Icon, iso, Provenance, TierLabel } from "@/components/operations-mockup/Ops";
import { opsCopy } from "@/components/operations-mockup/copy";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { chapterTimes, clock, nfCopy, nfFrames, type Chapter, type NfCopy, type NfFrame } from "./copy";
import { byNo, clientHello, filters, hosts, ms, packets, serverHello, summary, timing, type Packet } from "./data";

/**
 * Network Forensics prototype: static design frames rendered from code (protected
 * preview only). Each frame is one paused moment of the storyboard in
 * docs/network-forensics-prototype.md: two frames of the 20-second executive preview,
 * then one per chapter of the technical walkthrough. The technical canvas is always
 * left-to-right (D5); captions and panels follow the page direction.
 */
const href = (f: NfFrame) => `/operations/network-forensics?frame=${f}`;

/** The caption each walkthrough frame is paused on. */
const pausedOn: Record<Chapter["id"], number> = { ch1: 0, ch2: 1, ch3: 1, ch4: 3, ch5: 2 };
/** Packets a chapter's display filter matches (checked against Wireshark filter semantics in the doc). */
const matches: Record<Chapter["id"], number[]> = { ch1: packets.map((p) => p.no), ch2: [1, 2, 3, 4], ch3: [5, 6, 7], ch4: [8, 9], ch5: [5, 6, 7, 8, 9, 10, 11, 12] };

const V = ({ children }: { children: ReactNode }) => (
  <bdi dir="ltr" className="op-v">
    {children}
  </bdi>
);

/* ------------------------------------------------------------- identity */

function Masthead({ c, role, where }: { c: NfCopy; role: string; where: string }) {
  return (
    <div className="nf-mast">
      <span className="nf-mast-id">
        <svg aria-hidden="true" viewBox="0 0 20 20" className="nf-mast-mark">
          <circle cx="10" cy="10" r="8.5" />
          <circle cx="10" cy="10" r="2.6" />
          <path d="M0 10h5.5M14.5 10H20" />
        </svg>
        <span className="nf-mast-name">Eli Saad</span>
        <span className="nf-mast-role">{role}</span>
      </span>
      <span className="nf-mast-where">
        {c.series} · {where}
      </span>
    </div>
  );
}

function Modes({ c, mode }: { c: NfCopy; mode: "preview" | "walkthrough" }) {
  const t = chapterTimes(c);
  return (
    <nav className="nf-modes" aria-label={`${c.modes.preview} / ${c.modes.walkthrough}`}>
      <Link href={href("preview")} aria-current={mode === "preview" ? "page" : undefined} className="nf-mode">
        <span className="nf-mode-name">{c.modes.preview}</span>
        <span className="nf-mode-hint">
          <V>{clock(t.preview)}</V> · {c.modes.previewHint}
        </span>
      </Link>
      <Link href={href("ch1")} aria-current={mode === "walkthrough" ? "page" : undefined} className="nf-mode">
        <span className="nf-mode-name">{c.modes.walkthrough}</span>
        <span className="nf-mode-hint">
          <V>{clock(t.total)}</V> · {c.modes.walkthroughHint}
        </span>
      </Link>
      <span className="nf-mode nf-mode--text">
        <Icon name="text" />
        {c.modes.text}
      </span>
    </nav>
  );
}

/* --------------------------------------------------------------- ladder */

interface Msg {
  dir: "out" | "in";
  y1: number;
  y2: number;
  label: string;
  detail?: string;
  t?: string;
  enc?: boolean;
  dim?: boolean;
}

/** Sequence diagram: client on the left, peer on the right, time flowing down. */
function Ladder({ title, left, right, msgs, h, rtt, divider, phoneHide }: { title: string; left: [string, string]; right: [string, string]; msgs: Msg[]; h: number; rtt?: { y1: number; y2: number; label: string }; divider?: { y: number; label: string }; phoneHide?: boolean }) {
  const L = 118;
  const R = 300;
  return (
    <figure className={`nf-ladder${phoneHide ? " nf-m-hide" : ""}`}>
      <figcaption className="op-scene-label">{title}</figcaption>
      <svg viewBox={`0 0 360 ${h}`} role="img" aria-label={`${title}: ${msgs.map((m) => m.label).join(", ")}`}>
        <text x={L} y="18" className="op-l-head">{left[0]}</text>
        <text x={L} y="33" className="op-l-addr">{left[1]}</text>
        <text x={R} y="18" className="op-l-head">{right[0]}</text>
        <text x={R} y="33" className="op-l-addr">{right[1]}</text>
        <path d={`M${L} 44V${h - 6}M${R} 44V${h - 6}`} className="op-l-life" />
        {divider && (
          <g>
            <path d={`M${L} ${divider.y}H${R}`} className="nf-l-div" />
            <text x={(L + R) / 2} y={divider.y - 5} className="nf-l-div-t">{divider.label}</text>
          </g>
        )}
        {msgs.map((m, i) => {
          const [x1, x2] = m.dir === "out" ? [L, R] : [R, L];
          const mx = (x1 + x2) / 2;
          const my = (m.y1 + m.y2) / 2;
          let ang = (Math.atan2(m.y2 - m.y1, x2 - x1) * 180) / Math.PI;
          if (ang > 90) ang -= 180;
          return (
            <g key={i} className={m.enc ? "nf-l-enc" : m.dim ? "nf-l-dim" : undefined}>
              <path d={`M${x1} ${m.y1} L${x2} ${m.y2}`} className="op-l-msg" markerEnd="url(#nf-arrow)" />
              <text x={mx} y={my - 6} transform={`rotate(${ang} ${mx} ${my})`} className="op-l-label">
                {m.label}
              </text>
              {m.detail && (
                <text x={mx} y={my + 13} transform={`rotate(${ang} ${mx} ${my})`} className="op-l-detail">
                  {m.detail}
                </text>
              )}
              {m.t && (
                <text x={L - 8} y={(m.dir === "out" ? m.y1 : m.y2) + 3} className="op-l-time">
                  {m.t}
                </text>
              )}
            </g>
          );
        })}
        {rtt && (
          <g>
            <path d={`M30 ${rtt.y1}V${rtt.y2}M26 ${rtt.y1}h8M26 ${rtt.y2}h8`} className="op-l-rtt" />
            <text x="20" y={(rtt.y1 + rtt.y2) / 2} className="op-l-rtt-t" transform={`rotate(-90 20 ${(rtt.y1 + rtt.y2) / 2})`}>
              {rtt.label}
            </text>
          </g>
        )}
        <defs>
          <marker id="nf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" className="op-l-head-arrow" />
          </marker>
        </defs>
      </svg>
    </figure>
  );
}

const sec = (p: Packet) => p.t.toFixed(6);

/* ---------------------------------------------------------- packet list */

function PacketList({ c, rows, filter, hot = [], phoneHide }: { c: NfCopy; rows: number[]; filter: string; hot?: number[]; phoneHide?: boolean }) {
  const L = c.labels.cols;
  return (
    <div className={`nf-list${phoneHide ? " nf-m-hide" : ""}`}>
      <div className="op-filter">
        <span className="op-filter-k">{c.labels.filter}</span>
        <code>{filter}</code>
        <span className="nf-filter-n">
          {rows.length}/{packets.length}
        </span>
      </div>
      <table className="op-pkts nf-pkts">
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
          {rows.map((n) => {
            const p = byNo(n);
            return (
              <tr key={n} data-hot={hot.includes(n) || undefined} data-proto={p.proto} data-enc={p.encrypted || undefined}>
                <td>{p.no}</td>
                <td>{sec(p)}</td>
                <td>{p.src}</td>
                <td>{p.dst}</td>
                <td>
                  <span className="nf-proto">{p.proto}</span>
                </td>
                <td>{p.frame}</td>
                <td>{summary(p)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------------- scenes */

/** Packet groups labelled on the timeline, with a horizontal nudge so neighbouring labels never touch. */
const clusters: [number, number, number][] = [
  [1, 2, 0],
  [3, 4, -11],
  [5, 5, 9],
  [6, 8, 0],
  [9, 10, -10],
  [11, 12, 10],
];

function Timeline({ c, focus }: { c: NfCopy; focus?: number[] }) {
  const W = 760;
  const x = (t: number) => 24 + (t / 0.075) * (W - 48);
  return (
    <figure className="nf-timeline nf-m-hide">
      <figcaption className="op-scene-label">{c.labels.timeline}</figcaption>
      <svg viewBox={`0 0 ${W} 122`} role="img" aria-label={packets.map((p) => `${p.no} ${p.proto} ${ms(p.t)} ms`).join(", ")}>
        <path d={`M24 70H${W - 24}`} className="nf-t-axis" />
        {[0, 10, 20, 30, 40, 50, 60, 70].map((v) => (
          <g key={v}>
            <path d={`M${x(v / 1000)} 70v5`} className="nf-t-axis" />
            <text x={x(v / 1000)} y="87" className="nf-t-tick">
              {v}
            </text>
          </g>
        ))}
        {packets.map((p) => {
          const px = x(p.t);
          const up = p.src === hosts.client;
          return (
            <path
              key={p.no}
              d={up ? `M${px} 70V40` : `M${px} 70V54`}
              className={`nf-t-pk nf-t-pk--${p.proto.toLowerCase()}`}
              data-dim={focus && !focus.includes(p.no) ? "" : undefined}
            />
          );
        })}
        {/* Packets microseconds apart are labelled as one group. */}
        {clusters.map(([a, b, dx]) => (
          <text key={a} x={(x(byNo(a).t) + x(byNo(b).t)) / 2 + dx} y="32" className="nf-t-grp" data-dim={focus && !focus.includes(a) ? "" : undefined}>
            {a === b ? a : `${a}–${b}`}
          </text>
        ))}
        {[
          [byNo(1).t, byNo(3).t, `DNS ${ms(timing.dns)} ms`],
          [byNo(5).t, byNo(6).t, `TCP ${ms(timing.handshake)} ms`],
          [byNo(8).t, byNo(9).t, `TLS ${ms(timing.tlsFirstFlight)} ms`],
        ].map(([a, b, l]) => (
          <g key={l as string} className="nf-t-span">
            <path d={`M${x(a as number)} 96V100H${x(b as number)}V96`} />
            <text x={(x(a as number) + x(b as number)) / 2} y="114">
              {l}
            </text>
          </g>
        ))}
        <text x="24" y="12" className="nf-t-cap">{`${c.labels.capturePoint}: ${hosts.client}`}</text>
      </svg>
      <ul className="nf-keys">
        {(["DNS", "TCP", "TLS"] as const).map((p) => (
          <li key={p}>
            <span aria-hidden="true" className={`nf-key nf-key--${p.toLowerCase()}`} />
            {p} · {packets.filter((x) => x.proto === p).length}
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Phones: the timeline becomes three phases with their packet ranges and round trips. */
function PhaseBar({ c }: { c: NfCopy }) {
  const phases = [
    ["DNS", "1–4", `${ms(timing.dns)} ms`],
    ["TCP", "5–7", `${ms(timing.handshake)} ms`],
    ["TLS", "8–12", `${ms(timing.tlsFirstFlight)} ms`],
  ];
  return (
    <div className="nf-phases nf-m-only">
      <p className="op-scene-label">
        {c.labels.capturePoint}: <V>{hosts.client}</V> · <V>0–{ms(timing.total)} ms</V>
      </p>
      <ol>
        {phases.map(([p, r, t]) => (
          <li key={p} className={`nf-phase nf-phase--${p!.toLowerCase()}`}>
            <span className="nf-phase-p">{p}</span>
            <span className="op-v">#{r}</span>
            <span className="op-v">{t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Ch1({ c }: { c: NfCopy }) {
  return (
    <div className="nf-ch1">
      <Timeline c={c} />
      <PhaseBar c={c} />
      <PacketList c={c} rows={matches.ch1} filter={filters.ch1} />
    </div>
  );
}

function Ch2({ c }: { c: NfCopy }) {
  const L = c.labels;
  return (
    <div className="nf-split">
      <div>
        <PacketList c={c} rows={matches.ch2} filter={filters.ch2} hot={[3]} phoneHide />
        <div className="nf-answers">
          <div className="nf-answer" data-hot="">
            <span className="op-scene-label">
              {L.answer} · A · <V>0x3f2a</V>
            </span>
            <strong className="op-v">{hosts.server}</strong>
            <span className="op-v">TTL 300 · {ms(timing.dns)} ms</span>
          </div>
          <div className="nf-answer">
            <span className="op-scene-label">
              {L.answer} · AAAA · <V>0x8c41</V>
            </span>
            <strong>{L.noAddress}</strong>
            <span className="op-v">SOA ns1.example.com</span>
          </div>
        </div>
      </div>
      <Ladder
        title={L.lookups}
        left={[L.client, hosts.client]}
        right={[L.resolver, `${hosts.resolver}:53`]}
        h={250}
        msgs={[
          { dir: "out", y1: 56, y2: 88, label: "A ?  AAAA ?", detail: "0x3f2a  0x8c41", t: sec(byNo(1)), dim: true },
          { dir: "out", y1: 62, y2: 94, label: "", dim: true },
          { dir: "in", y1: 128, y2: 160, label: "A 198.51.100.40", detail: "TTL 300", t: sec(byNo(3)) },
          { dir: "in", y1: 196, y2: 228, label: "AAAA: SOA", detail: "no address", t: sec(byNo(4)), dim: true },
        ]}
        rtt={{ y1: 56, y2: 160, label: `${L.rtt} ${ms(timing.dns)} ms` }}
      />
    </div>
  );
}

function Ch3({ c }: { c: NfCopy }) {
  const L = c.labels;
  return (
    <div className="nf-split">
      <PacketList c={c} rows={matches.ch3} filter={filters.ch3} hot={[5, 6]} />
      <Ladder
        title={L.handshake}
        left={[L.client, `${hosts.client}:49712`]}
        right={[L.server, `${hosts.server}:443`]}
        h={270}
        msgs={[
          { dir: "out", y1: 64, y2: 100, label: "SYN", detail: "Seq=0  MSS=1460  WS=256", t: sec(byNo(5)) },
          { dir: "in", y1: 136, y2: 172, label: "SYN, ACK", detail: "Seq=0 Ack=1  MSS=1460  WS=128", t: sec(byNo(6)) },
          { dir: "out", y1: 206, y2: 242, label: "ACK", detail: "Seq=1 Ack=1", t: sec(byNo(7)), dim: true },
        ]}
        rtt={{ y1: 64, y2: 172, label: `${L.rtt} ${ms(timing.handshake)} ms` }}
      />
    </div>
  );
}

function Fields({ title, rows }: { title: string; rows: [string, ReactNode, boolean?][] }) {
  return (
    <div className="nf-fields">
      <p className="op-scene-label">{title}</p>
      <dl>
        {rows.map(([k, v, hot]) => (
          <div key={k} data-hot={hot || undefined}>
            <dt>{k}</dt>
            <dd className="op-v">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Ch4({ c }: { c: NfCopy }) {
  const L = c.labels;
  return (
    <div className="nf-split">
      <div>
        <PacketList c={c} rows={matches.ch4} filter={filters.ch4} hot={[9]} phoneHide />
        <div className="nf-hellos">
          <Fields
            title={L.clientHello}
            rows={[
              [L.sni, clientHello.sni],
              [L.offered, clientHello.supportedVersions.join(", ")],
              [L.alpn, clientHello.alpn.join(", ")],
              [L.keyShare, clientHello.keyShare],
            ]}
          />
          <Fields
            title={L.serverHello}
            rows={[
              [L.legacy, `${serverHello.legacyVersion} (TLS 1.2)`],
              [`${L.selected} · supported_versions`, serverHello.selectedVersion, true],
              [L.cipher, serverHello.cipher, true],
              [L.keyShare, serverHello.keyShare],
            ]}
          />
        </div>
        <p className="nf-enc-note">{L.alpnHidden}</p>
      </div>
      <Ladder
        title={L.tlsHandshake}
        left={[L.client, `${hosts.client}:49712`]}
        right={[L.server, `${hosts.server}:443`]}
        h={330}
        phoneHide
        divider={{ y: 184, label: L.encryptedFrom }}
        msgs={[
          { dir: "out", y1: 60, y2: 96, label: "Client Hello", detail: "SNI  TLS 1.3, 1.2", t: sec(byNo(8)), dim: true },
          { dir: "in", y1: 126, y2: 162, label: "Server Hello · CCS", detail: "TLS 1.3  AES_128_GCM", t: sec(byNo(9)) },
          { dir: "in", y1: 196, y2: 232, label: "encrypted", t: sec(byNo(10)), enc: true },
          { dir: "out", y1: 246, y2: 282, label: "CCS · encrypted", t: sec(byNo(11)), enc: true },
          { dir: "out", y1: 288, y2: 322, label: "encrypted", t: sec(byNo(12)), enc: true },
        ]}
        rtt={{ y1: 60, y2: 162, label: `${L.rtt} ${ms(timing.tlsFirstFlight)} ms` }}
      />
    </div>
  );
}

function Ch5({ c, ch }: { c: NfCopy; ch: Chapter }) {
  const B = c.board;
  const heads = { fact: B.shows, reasoning: B.suggests, limit: B.cannot };
  return (
    <div className="nf-ch5">
      <Timeline c={c} focus={matches.ch5} />
      <PhaseBar c={c} />
      <div className="op-board">
        {ch.points.map((p) => (
          <div key={p.k} className={`op-card op-card--${p.k}`}>
            <p className="op-card-k">{heads[p.k]}</p>
            <p>{iso(p.t)}</p>
          </div>
        ))}
      </div>
      <p className="nf-filter-line nf-m-hide">
        <span className="op-filter-k">{c.labels.filter}</span> <code>{filters.ch5}</code>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- preview */

const steps = [
  { k: "dns", top: `${hosts.name} → ${hosts.server}`, sub: `DNS · ${ms(timing.dns)} ms` },
  { k: "tcp", top: "TCP · port 443", sub: `${ms(timing.handshake)} ms` },
  { k: "tls", top: "TLS 1.3", sub: "TLS_AES_128_GCM_SHA256" },
] as const;

/** Executive preview: four cards, one per beat; cards before the current beat stay lit. */
function PreviewStage({ c, beat }: { c: NfCopy; beat: number }) {
  const state = (i: number) => (i < beat - 1 ? "done" : i === beat - 1 ? "now" : "next");
  return (
    <div className="nf-path">
      {steps.map((s, i) => (
        <div key={s.k} className="nf-step" data-state={state(i)}>
          <span className="nf-step-n">{String(i + 1).padStart(2, "0")}</span>
          <span className="nf-step-label">{c.preview.beats[i]!.label}</span>
          <span className="nf-step-top op-v">{s.top}</span>
          <span className="nf-step-sub op-v">{s.sub}</span>
          {s.k === "tcp" && (
            <svg aria-hidden="true" viewBox="0 0 120 46" className="nf-step-hs">
              <path d="M8 6 112 16M112 22 8 32M8 38 112 44" />
            </svg>
          )}
        </div>
      ))}
      <div className="nf-step nf-step--limits" data-state={state(3)}>
        <span className="nf-step-n">04</span>
        <span className="nf-step-label">{c.preview.beats[3]!.label}</span>
        <span className="nf-chips">
          <span data-k="fact">{c.kinds.fact}</span>
          <span data-k="reasoning">{c.kinds.reasoning}</span>
          <span data-k="limit">{c.board.cannot}</span>
        </span>
      </div>
    </div>
  );
}

function Transport({ c, locale, now, total, label }: { c: NfCopy; locale: Locale; now: number; total: number; label: string }) {
  const P = opsCopy[locale].player;
  return (
    <div className="op-transport">
      <button type="button" aria-label={P.replay}>
        <Icon name="prev" />
      </button>
      <button type="button" aria-label={P.play} className="op-play">
        <Icon name="play" />
      </button>
      <button type="button" aria-label={P.next}>
        <Icon name="next" />
      </button>
      <span className="op-count">
        {label} · <V>{`${clock(now)} / ${clock(total)}`}</V>
      </span>
      <span className="op-transport-end">
        <button type="button" aria-pressed="true" className="op-tbtn">
          <Icon name="cc" />
          {P.captions}
        </button>
        <span className="op-tbtn">
          <Icon name="text" />
          {c.modes.text}
        </span>
      </span>
    </div>
  );
}

/* --------------------------------------------------------------- frames */

function PreviewFrame({ c, locale, role }: { c: NfCopy; locale: Locale; role: string }) {
  const beat = 2;
  const b = c.preview.beats[beat - 1]!;
  const t = chapterTimes(c);
  return (
    <div className="nf-player">
        <Masthead c={c} role={role} where={`${c.cat} · ${c.modes.preview}`} />
        <div className="op-stage nf-stage nf-stage--preview" dir="ltr">
          <PreviewStage c={c} beat={beat} />
        </div>
        <p className="op-caption nf-caption">{iso(b.text)}</p>
        <ol className="op-rail nf-rail nf-rail--4" aria-label={c.modes.preview}>
          {c.preview.beats.map((x, i) => (
            <li key={x.label} aria-current={i === beat - 1 ? "step" : undefined} data-done={i < beat - 1 || undefined}>
              <span className="op-rail-bar">
                <span style={{ width: i < beat - 1 ? "100%" : i === beat - 1 ? "55%" : "0%" }} />
              </span>
              <span className="op-rail-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="op-rail-name">{x.label}</span>
            </li>
          ))}
        </ol>
        <Transport c={c} locale={locale} now={7.7} total={t.preview} label={c.modes.preview} />
    </div>
  );
}

function EndFrame({ c, role }: { c: NfCopy; role: string }) {
  const t = chapterTimes(c);
  return (
    <div className="nf-player">
      <Masthead c={c} role={role} where={`${c.cat} · ${c.modes.preview}`} />
      <div className="nf-end">
        <div className="nf-end-main">
          <p className="op-eyebrow">{c.preview.endEyebrow}</p>
          <h2 className="op-h1 op-h1--xl">{iso(c.preview.endTitle)}</h2>
          <p className="op-lead">{c.preview.endLead}</p>
          <div className="nf-end-actions">
            <Link href={href("ch1")} className="op-cta">
              {c.preview.watch} · <V>{clock(t.total)}</V>
            </Link>
            <span className="op-tbtn">
              <Icon name="text" />
              {c.modes.text}
            </span>
            <span className="op-tbtn">
              <Icon name="prev" />
              {c.preview.replay}
            </span>
          </div>
        </div>
        <div className="nf-end-side">
          <p className="op-scene-label">{c.preview.coversTitle}</p>
          <ol className="nf-covers">
            {c.preview.covers.map((x, i) => (
              <li key={x}>
                <span className="op-v">{String(i + 1).padStart(2, "0")}</span>
                {iso(x)}
              </li>
            ))}
          </ol>
          <div className="nf-end-id">
            <span className="nf-mast-name">Eli Saad</span>
            <span>{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChapterFrame({ c, locale, role, id }: { c: NfCopy; locale: Locale; role: string; id: Chapter["id"] }) {
  const t = chapterTimes(c);
  const i = c.chapters.findIndex((x) => x.id === id);
  const ch = c.chapters[i]!;
  const at = pausedOn[id];
  const chDur = ch.captions.reduce((a, x) => a + x.dur, 0);
  const into = ch.captions.slice(0, at).reduce((a, x) => a + x.dur, 0) + ch.captions[at]!.dur * 0.5;
  const scene = { ch1: <Ch1 c={c} />, ch2: <Ch2 c={c} />, ch3: <Ch3 c={c} />, ch4: <Ch4 c={c} />, ch5: <Ch5 c={c} ch={ch} /> }[id];
  return (
    <div className="op-player nf-walk">
      <div className="nf-player">
        <Masthead c={c} role={role} where={`${c.cat} · ${String(i + 1).padStart(2, "0")} ${ch.title}`} />
        <div className="op-stage nf-stage" dir="ltr">
          {scene}
        </div>
        <p className="op-caption nf-caption">{iso(ch.captions[at]!.text)}</p>
        <ol className="op-rail nf-rail" aria-label={c.modes.walkthrough}>
          {c.chapters.map((x, k) => (
            <li key={x.id} aria-current={k === i ? "step" : undefined} data-done={k < i || undefined}>
              <span className="op-rail-bar">
                <span style={{ width: k < i ? "100%" : k === i ? `${Math.round((into / chDur) * 100)}%` : "0%" }} />
              </span>
              <span className="op-rail-n">{String(k + 1).padStart(2, "0")}</span>
              <span className="op-rail-name">{x.title}</span>
            </li>
          ))}
        </ol>
        <Transport c={c} locale={locale} now={t.starts[i]! + into} total={t.total} label={c.modes.walkthrough} />
      </div>
      <aside className="op-reason" aria-label={c.kinds.reasoning}>
        {id === "ch5" ? (
          <>
            <p className="op-scene-label">{c.board.further}</p>
            <ul className="nf-further">
              {c.board.furtherList.map((x) => (
                <li key={x}>{iso(x)}</li>
              ))}
            </ul>
          </>
        ) : (
          <ul className="op-points">
            {ch.points.map((p) => (
              <li key={p.k} data-k={p.k}>
                <span className="op-points-k">{c.kinds[p.k]}</span>
                {iso(p.t)}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ page */

export function NfProto({ locale, frame, role }: { locale: Locale; frame: NfFrame; role: string }) {
  const c = nfCopy[locale];
  const o = opsCopy[locale];
  const mode = frame.startsWith("preview") ? "preview" : "walkthrough";
  return (
    <div className="op nf">
      <nav className="op-banner" aria-label={c.banner}>
        <p>{c.banner}</p>
        <ul>
          {nfFrames.map((f) => (
            <li key={f}>
              <Link href={href(f)} aria-current={f === frame ? "page" : undefined}>
                {c.frameNames[f]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="site-wrap op-wrap">
        <Provenance c={o} tier="demonstration" />
        <header className="op-story-head nf-head">
          <div>
            <p className="op-eyebrow">{c.cat}</p>
            <h1 className="op-h1">{iso(c.title)}</h1>
          </div>
          <Modes c={c} mode={mode} />
        </header>
        {frame === "preview" && <PreviewFrame c={c} locale={locale} role={role} />}
        {frame === "preview-end" && <EndFrame c={c} role={role} />}
        {mode === "walkthrough" && <ChapterFrame c={c} locale={locale} role={role} id={frame as Chapter["id"]} />}
        <p className="op-disclosure">
          <TierLabel c={o} tier="demonstration" /> {o.disclosure}
        </p>
      </div>
    </div>
  );
}
