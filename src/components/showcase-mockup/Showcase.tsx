import type { ReactNode } from "react";
import { SimLabel } from "@/components/cc/SimTag";
import { copyFor } from "@/components/lab-mockup/copy";
import { alerts, pins, results, selected } from "@/components/lab-mockup/data";
import { EntityGraph } from "@/components/lab-mockup/Entities";
import { fill, Histogram, Outcome, Sev, V } from "@/components/lab-mockup/parts";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { showcaseCopy, type Frame, type ShowcaseCopy } from "./copy";

type Lab = (typeof copyFor)["en"];
type P = { s: ShowcaseCopy; l: Lab };

export const frames: Frame[] = ["hub", "c1", "c2", "c3", "c4", "c5", "end", "text"];
const chapterFrames = ["c1", "c2", "c3", "c4", "c5"] as const;
/** Playhead per frame for the static mockup, in seconds of the 2:40 walkthrough. */
const playhead: Record<(typeof chapterFrames)[number] | "end", number> = {
  c1: 11,
  c2: 47,
  c3: 84,
  c4: 121,
  c5: 148,
  end: 160,
};
const starts = [0, 25, 65, 100, 130];
const total = 160;
const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

/** Numbered marker tying a highlighted element on the screen to its line in "What I observed". */
function Mark({ n }: { n: number }) {
  return (
    <span aria-hidden="true" className="sc-mark">
      {n}
    </span>
  );
}

function Icon({ name }: { name: "play" | "pause" | "prev" | "next" | "replay" | "cc" | "text" }) {
  const d = {
    play: "M7 4.5v15l12-7.5z",
    pause: "M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z",
    prev: "M6 5h2.4v14H6zM9.4 12 19 5v14z",
    next: "M15.6 5H18v14h-2.4zM14.6 12 5 19V5z",
    replay: "M12 5V2L7 6.5 12 11V7.5a5.5 5.5 0 1 1-5.5 5.5H4a8 8 0 1 0 8-8z",
    cc: "M3 6h18v12H3zM5 8v8h14V8zm2.2 2h3v1.4H8.6v1.2h1.6V14h-3zm6 0h3v1.4h-1.6v1.2h1.6V14h-3z",
    text: "M4 5h16v2H4zm0 4h16v2H4zm0 4h10v2H4zm0 4h13v2H4z",
  }[name];
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d={d} />
    </svg>
  );
}

/* ------------------------------------------------------------------ scenes */

function SceneAlert({ s, l }: P) {
  return (
    <div className="sc-s1">
      <ol className="sc-alerts">
        {alerts.map((a) => {
          const hl = a.id === "ALR-0418" ? 1 : a.id === "ALR-0419" ? 2 : 0;
          return (
            <li key={a.id} data-hl={hl || undefined} data-dim={!hl || undefined}>
              <Sev level={a.severity} label={l.queue.sev[a.severity]} />
              <V className="sc-a-id">{a.id}</V>
              <span className="sc-a-rule">{l.queue.rule[a.id]}</span>
              <V className="sc-a-ent">{a.entity}</V>
              <span className="sc-a-time">{fill(s.scene.alertFired, { t: a.fired })}</span>
              {hl ? <Mark n={hl} /> : null}
            </li>
          );
        })}
      </ol>
      <div className="sc-rulecard" data-hl>
        <span className="lm-label">
          {s.scene.rule} · <V>ALR-0418</V>
        </span>
        <p>{l.queue.contextBody}</p>
        <Mark n={3} />
      </div>
    </div>
  );
}

function SceneLogs({ s, l }: P) {
  const rows = results.slice(9, 16);
  const show = ["account", "computer", "logonType", "source", "client", "auth"] as const;
  return (
    <div className="sc-s2">
      <div className="sc-query">
        <span className="lm-label">{l.flt.query}</span>
        <code dir="ltr">
          {s.scene.query}
          <span aria-hidden="true" className="sc-caret" />
        </code>
        <span className="sc-count">{l.logs.results}</span>
      </div>
      <Histogram t={l} compact />
      <div className="sc-s2-body">
        <table className="sc-table">
          <thead>
            <tr>
              <th scope="col">{l.logs.cols.time}</th>
              <th scope="col">{l.logs.cols.event}</th>
              <th scope="col">{l.logs.cols.account}</th>
              <th scope="col" className="sc-col-wide">
                {l.logs.cols.type}
              </th>
              <th scope="col" className="sc-col-wide">
                {l.logs.cols.auth}
              </th>
              <th scope="col">{l.logs.cols.status}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const hl = r.id === "e-0193" ? 2 : r.id === "e-0194" ? 3 : 0;
              return (
                <tr key={r.id} data-hl={hl || undefined}>
                  <td>
                    <V>{r.time.slice(0, 8)}</V>
                  </td>
                  <td>
                    <V>{r.eventId}</V>
                  </td>
                  <td>
                    <V>{r.user}</V>
                  </td>
                  <td className="sc-col-wide">
                    <V>{r.logonType}</V>
                  </td>
                  <td className="sc-col-wide">
                    <V>{r.auth}</V>
                  </td>
                  <td>
                    <span className="sc-res">
                      <Outcome ok={r.eventId === 4624} label={l.logs.outcome[r.eventId === 4624 ? "ok" : "fail"]} />
                      {r.sub ? <V className="sc-sub">{r.sub}</V> : null}
                      {r.id === "e-0191" ? <Mark n={1} /> : null}
                      {hl ? <Mark n={hl} /> : null}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="sc-fields" data-hl>
          <p className="sc-fields-head">
            <V>4624</V> · <V>{selected.id}</V>
          </p>
          <p className="sc-fields-name">{l.insp.name[4624]}</p>
          <dl>
            {selected.fields
              .filter(([k]) => (show as readonly string[]).includes(k))
              .map(([k, v]) => (
                <div key={k} data-hl={k === "logonType" || k === "auth" || undefined}>
                  <dt>{l.insp.field[k]}</dt>
                  <dd>
                    <V>{v}</V>
                    {k === "logonType" ? <span className="sc-dd-note"> · {l.insp.logonType["3"]}</span> : null}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

function SceneCorrelate({ s, l }: P) {
  // Positions on a 02:08–02:36 axis, left to right in every language like the histogram.
  const at = (hhmm: string) => ((Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5)) + Number(hhmm.slice(6, 8)) / 60 - 128) / 28) * 100;
  const points: {
    t: string;
    label: ReactNode;
    kind: "fail" | "ok" | "ind";
    mark?: number;
  }[] = [
    { t: "02:10:05", label: <V>4625 ×17</V>, kind: "fail" },
    {
      t: "02:14:37",
      label: (
        <>
          {l.insp.field.logonType} <V>3</V>
        </>
      ),
      kind: "ok",
    },
    {
      t: "02:14:52",
      label: (
        <>
          {l.insp.field.logonType} <V>10</V>
        </>
      ),
      kind: "ok",
    },
    { t: "02:21:13", label: <V>{s.scene.lateral}</V>, kind: "ok", mark: 1 },
    { t: "02:31:08", label: <V>203.0.113.77</V>, kind: "ind", mark: 2 },
  ];
  return (
    <div className="sc-s3">
      <div className="sc-graph-scroll" tabIndex={0} aria-label={l.ent.viewMap}>
        <EntityGraph t={l} compact />
      </div>
      {/* Phones: the same relationships as one vertical path; the full map stays available on wider screens. */}
      <ol className="sc-path" aria-label={l.ent.viewMap}>
        <li>
          <V>203.0.113.45</V>
          <span>{s.scene.spray}</span>
        </li>
        <li data-hl>
          <V>j.morgan</V>
          <span className="sc-path-note">
            {l.insp.field.logonType} <V>3 → 10</V>
          </span>
        </li>
        <li>
          <V>JMP01</V>
        </li>
        <li data-hl>
          <V>SRV-FILE01</V>
          <V className="sc-path-note">02:21 · Kerberos</V>
          <Mark n={1} />
        </li>
      </ol>
      <p className="sc-path-ind">
        <V>203.0.113.77</V> · {s.scene.second}
        <Mark n={2} />
      </p>
      <p className="sc-explained">
        <V>ALR-0417</V> · {s.chapters[2].observed[2]}
        <Mark n={3} />
      </p>
      <div className="sc-tl">
        <span className="lm-label">{s.scene.timeline}</span>
        <ol className="sc-tl-axis" dir="ltr">
          {points.map((p, i) => (
            <li key={p.t} style={{ insetInlineStart: `${at(p.t)}%` }} data-kind={p.kind} data-row={i % 2 || undefined}>
              <V className="sc-tl-time">{p.t.slice(0, 5)}</V>
              <span className="sc-tl-label">{p.label}</span>
              {p.mark ? <Mark n={p.mark} /> : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function SceneEvidence({ s, l }: P) {
  return (
    <div className="sc-s4">
      <p className="sc-ev-head">
        <span className="lm-label">{s.scene.evidenceTitle}</span>
        <span className="sc-count">
          {s.scene.evidenceCount}
          <Mark n={2} />
        </span>
      </p>
      <ol className="sc-ev">
        {pins.map((p, i) => (
          <li key={p.id} data-arriving={i === pins.length - 1 || undefined} data-hl={i === 0 || undefined}>
            <span className="sc-ev-when">
              <span>{l.day[p.day]}</span>
              <V>{p.time.slice(0, 8)}</V>
            </span>
            <span className="sc-ev-what">
              <V>
                {p.eventId} · {p.user} · {p.ip}
              </V>
              <span className="sc-ev-why">{l.tl.notes[p.note]}</span>
            </span>
            {i === 0 ? <Mark n={1} /> : null}
          </li>
        ))}
      </ol>
      <p className="sc-ev-foot">
        {s.chapters[3].observed[2]}
        <Mark n={3} />
      </p>
    </div>
  );
}

function SceneFindings({ s, l }: P) {
  const d = l.debrief;
  return (
    <div className="sc-s5">
      <section data-cat="observed">
        <p className="sc-cat">
          {d.cats.observed}
          <Mark n={1} />
        </p>
        <ul>
          {(["f1", "f2", "f4", "f5"] as const).map((f) => (
            <li key={f}>{l.verdict.f[f]}</li>
          ))}
        </ul>
      </section>
      <section data-cat="supported">
        <p className="sc-cat">{d.cats.supported}</p>
        <p className="sc-claim">{l.tl.h.h1.claim}</p>
        <p>{d.hWhy.h1}</p>
      </section>
      <section data-cat="unconfirmed">
        <p className="sc-cat">
          {d.cats.unconfirmed}
          <Mark n={2} />
        </p>
        <p className="sc-claim">{l.tl.h.h2.claim}</p>
        <p>{s.scene.h2why}</p>
      </section>
      <section data-cat="undetermined">
        <p className="sc-cat">
          {d.cats.undetermined}
          <Mark n={3} />
        </p>
        <p className="sc-claim">{l.tl.h.h3.claim}</p>
        <p>{d.hWhy.h3}</p>
      </section>
      <section data-cat="next" className="sc-wide">
        <p className="sc-cat">{s.scene.next}</p>
        <ul>
          {(["a1", "a4", "a6"] as const).map((a) => (
            <li key={a}>{l.verdict.a[a]}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const scenes = [SceneAlert, SceneLogs, SceneCorrelate, SceneEvidence, SceneFindings] as const;
type ChapterIndex = 0 | 1 | 2 | 3 | 4;

/**
 * The five questions every chapter answers about the workflow: examined, why, observed
 * (one line per marker on the screen), what the evidence supports, what remains uncertain.
 */
function AnalystLog({ s, c, marks = false }: { s: ShowcaseCopy; c: ShowcaseCopy["chapters"][number]; marks?: boolean }) {
  const q = s.player.q;
  return (
    <dl className="sc-log">
      <div>
        <dt>{q.examined}</dt>
        <dd>{c.examined}</dd>
      </div>
      <div>
        <dt>{q.why}</dt>
        <dd>{c.why}</dd>
      </div>
      <div>
        <dt>{q.observed}</dt>
        <dd>
          <ol className="sc-notice">
            {c.observed.map((t, i) => (
              <li key={t}>
                {marks ? <Mark n={i + 1} /> : <V className="sc-notice-n">{i + 1}</V>}
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </dd>
      </div>
      <div data-q="supports">
        <dt>{q.supports}</dt>
        <dd>{c.supports}</dd>
      </div>
      <div data-q="uncertain">
        <dt>{q.uncertain}</dt>
        <dd>{c.uncertain}</dd>
      </div>
    </dl>
  );
}

/* ------------------------------------------------------------------ player chrome */

function Screen({ s, children, label }: { s: ShowcaseCopy; children: ReactNode; label: string }) {
  return (
    <figure className="sc-screen" aria-label={label}>
      <div className="sc-screen-bar">
        <span aria-hidden="true" className="sc-dots" />
        <SimLabel className="sc-screen-tag">{s.screenTag}</SimLabel>
      </div>
      <div className="sc-screen-body">{children}</div>
    </figure>
  );
}

function Transport({ s, at, playing }: { s: ShowcaseCopy; at: number; playing: boolean }) {
  const p = s.player;
  return (
    // Media transport stays left to right in every language, like the time axes.
    <div className="sc-transport" dir="ltr">
      <button type="button" className="sc-tbtn" aria-label={p.replay}>
        <Icon name="replay" />
      </button>
      <button type="button" className="sc-tbtn" aria-label={p.prev}>
        <Icon name="prev" />
      </button>
      <button type="button" className="sc-tbtn sc-tbtn--main" aria-label={playing ? p.pause : p.play}>
        <Icon name={playing ? "pause" : "play"} />
      </button>
      <button type="button" className="sc-tbtn" aria-label={p.next}>
        <Icon name="next" />
      </button>
      <div className="sc-progress" role="img" aria-label={`${p.progress}: ${clock(at)} / ${clock(total)}`}>
        {starts.map((st, i) => {
          const end = starts[i + 1] ?? total;
          const pct = Math.max(0, Math.min(1, (at - st) / (end - st)));
          return (
            <span key={st} style={{ flexGrow: end - st }}>
              <i style={{ width: `${pct * 100}%` }} />
            </span>
          );
        })}
      </div>
      <V className="sc-clock">
        {clock(at)} / {clock(total)}
      </V>
      <button type="button" className="sc-tbtn sc-desk" aria-label={p.captions} aria-pressed="true">
        <Icon name="cc" />
      </button>
    </div>
  );
}

function ChapterRail({ s, current }: { s: ShowcaseCopy; current: number }) {
  return (
    <nav className="sc-rail" aria-label={s.player.chapters}>
      <ol>
        {s.chapters.map((c, i) => (
          <li key={c.key}>
            <Link href={`/showcase?frame=${chapterFrames[i]}`} aria-current={i === current ? "step" : undefined} data-done={i < current || undefined}>
              <V className="sc-rail-n">{String(i + 1).padStart(2, "0")}</V>
              <span className="sc-rail-t">{c.title}</span>
              <V className="sc-rail-time">{c.time}</V>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function PlayerHead({ s }: { s: ShowcaseCopy }) {
  return (
    <header className="sc-head">
      <p className="sc-simline">
        <SimLabel className="lm-sim">{s.sim}</SimLabel>
        <span>{s.notReal}</span>
      </p>
      <h1 className="sc-title">{s.hub.flagTitle}</h1>
    </header>
  );
}

function Player({ s, l, n }: P & { n: ChapterIndex }) {
  const c = s.chapters[n];
  const Scene = scenes[n];
  const at = playhead[chapterFrames[n]];
  return (
    <section className="sc-player">
      <PlayerHead s={s} />
      <ChapterRail s={s} current={n} />
      <div className="sc-grid">
        <div className="sc-main">
          <Screen s={s} label={c.still}>
            <Scene s={s} l={l} />
          </Screen>
          <p className="sc-captionline" aria-live="off">
            {c.narration}
          </p>
          <div className="sc-controls">
            <Transport s={s} at={at} playing />
          </div>
          <div className="sc-links">
            <Link href="/showcase?frame=text" className="sc-link">
              <Icon name="text" />
              {s.player.text}
            </Link>
            {n < 4 ? (
              <Link href="/showcase?frame=c5" className="sc-link">
                {s.player.skip}
                <span aria-hidden="true" className="lm-arrow">
                  →
                </span>
              </Link>
            ) : null}
          </div>
        </div>
        <div className="sc-notes">
          <p className="lm-label">{fill(s.player.chapterOf, { n: n + 1 })}</p>
          <h2 className="sc-notes-title">{c.title}</h2>
          <AnalystLog s={s} c={c} marks />
          <h3 className="sc-notes-sub">{s.player.skills}</h3>
          <ul className="sc-skills">
            {c.skills.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <p className="sc-draft">{s.draft}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ hub, end, text */

function Hub({ s, l }: P) {
  const h = s.hub;
  return (
    <div className="sc-hub">
      <p className="lm-label">{h.kicker}</p>
      <h1 className="sc-hub-title cc-display">{h.title}</h1>
      <p className="sc-hub-lead">{h.lead}</p>
      <p className="sc-hub-observer">{h.observer}</p>

      <article className="sc-feature">
        <div className="sc-poster">
          <Screen s={s} label={s.chapters[1].still}>
            <SceneLogs s={s} l={l} />
          </Screen>
          <Link href="/showcase?frame=c1" className="sc-poster-play">
            <span className="sc-poster-btn" aria-hidden="true">
              <Icon name="play" />
            </span>
            <span>{h.watch}</span>
            <V className="sc-poster-len">2:40</V>
          </Link>
        </div>
        <div className="sc-feature-body">
          <p className="sc-simline">
            <SimLabel className="lm-sim">{s.sim}</SimLabel>
            <span>{s.notReal}</span>
          </p>
          <p className="lm-label">{h.featured}</p>
          <h2 className="sc-feature-title">{h.flagTitle}</h2>
          <dl className="sc-meta">
            {h.meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="sc-notes-sub">{h.showsTitle}</h3>
          <ul className="sc-skills">
            {h.shows.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <p className="sc-credit">{s.credit}</p>
          <div className="sc-feature-actions">
            <Link href="/showcase?frame=c1" className="lm-btn lm-btn--solid">
              {h.watch}
            </Link>
            <Link href="/showcase?frame=text" className="lm-btn">
              {h.read}
            </Link>
          </div>
        </div>
        <div className="sc-feature-chapters">
          <h3 className="sc-notes-sub">{h.chaptersTitle}</h3>
          <ol>
            {s.chapters.map((c, i) => (
              <li key={c.key}>
                <V className="sc-rail-n">{String(i + 1).padStart(2, "0")}</V>
                <span>{c.title}</span>
                <V className="sc-rail-time">{c.time}</V>
              </li>
            ))}
          </ol>
        </div>
      </article>

      <section className="sc-more" aria-labelledby="sc-more-title">
        <h2 id="sc-more-title" className="sc-more-title">
          {h.moreTitle}
        </h2>
        <p className="lm-review">{h.moreNote}</p>
        <ul>
          {h.more.map((m) => (
            <li key={m.code}>
              <V className="sc-more-code">{m.code}</V>
              <span className="sc-more-name">{m.title}</span>
              <span className="sc-more-tools">{m.tools}</span>
              <span className="sc-more-status">{h.planned}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function End({ s }: { s: ShowcaseCopy }) {
  return (
    <section className="sc-player">
      <PlayerHead s={s} />
      <ChapterRail s={s} current={5} />
      <div className="sc-endcard">
        <h2 className="sc-end-title">{s.end.title}</h2>
        <ul className="sc-end-points">
          {s.end.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="sc-feature-actions">
          <Link href="/case-files" className="lm-btn lm-btn--solid">
            {s.end.cases}
          </Link>
          <Link href="/recruiter" className="lm-btn">
            {s.end.cv}
          </Link>
          <Link href="/showcase?frame=c1" className="lm-btn lm-btn--ghost">
            <Icon name="replay" />
            {s.end.again}
          </Link>
        </div>
        <p className="sc-end-data">{s.end.data}</p>
        <p className="sc-credit">{s.credit}</p>
      </div>
      <div className="sc-controls">
        <Transport s={s} at={playhead.end} playing={false} />
      </div>
    </section>
  );
}

function TextVersion({ s }: { s: ShowcaseCopy }) {
  return (
    <section className="sc-player sc-textv">
      <PlayerHead s={s} />
      <h2 className="sc-textv-title">{s.text.title}</h2>
      <p className="sc-hub-lead">{s.text.intro}</p>
      <ol className="sc-textv-list">
        {s.chapters.map((c, i) => (
          <li key={c.key}>
            <p className="lm-label">
              <V>{String(i + 1).padStart(2, "0")}</V> · <V>{c.time}</V>
            </p>
            <h3 className="sc-notes-title">{c.title}</h3>
            <p>{c.narration}</p>
            <AnalystLog s={s} c={c} />
            <p className="sc-textv-still">
              <span className="lm-label">{s.text.still}</span> {c.still}
            </p>
          </li>
        ))}
      </ol>
      <p className="sc-end-data">{s.end.data}</p>
      <p className="sc-credit">{s.credit}</p>
      <p className="sc-draft">{s.draft}</p>
    </section>
  );
}

export function ShowcaseMockup({ locale, frame }: { locale: Locale; frame: Frame }) {
  const s = showcaseCopy[locale];
  const l = copyFor[locale];
  const n = chapterFrames.indexOf(frame as (typeof chapterFrames)[number]) as ChapterIndex;
  return (
    <div className="lm sc">
      <p className="lm-review lm-review--ws">
        {s.review} · {fill(s.frame, { s: s.frames[frame] })}
      </p>
      <div className="site-wrap sc-wrap">
        {frame === "hub" ? <Hub s={s} l={l} /> : frame === "end" ? <End s={s} /> : frame === "text" ? <TextVersion s={s} /> : <Player s={s} l={l} n={n} />}
      </div>
    </div>
  );
}
