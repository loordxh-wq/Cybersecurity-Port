import { SimLabel } from "@/components/cc/SimTag";
import type { Copy } from "./copy";
import { alerts, facets, findingIds, findingResults, hypotheses, linkedEvidence, pins, results, selected, selectedId, stageState, type AlertId, type Disposition, type FindingId, type Stage } from "./data";
import { EntityDetail, EntityGraph, EntityTable } from "./Entities";
import { fill, Histogram, Outcome, Sev, V } from "./parts";

export type View = "briefing" | "logs" | "entities" | "timeline" | "verdict" | "debrief";
export const stageOf = (view: string): Stage => (view === "briefing" || view === "queue" ? "fresh" : view === "debrief" ? "submitted" : "progress");

const tabs = [
  ["logs", "logs"],
  ["entities", "entities"],
  ["timeline", "timeline"],
  ["mitre", null],
  ["verdict", "verdict"],
] as const;

export function WorkspaceBar({ t, stage }: { t: Copy; stage: Stage }) {
  const s = stageState[stage];
  return (
    <div className="lm-bar">
      <div className="lm-bar-id">
        <SimLabel className="lm-sim">{t.sim}</SimLabel>
        <h1 className="lm-bar-title">{t.scenario}</h1>
      </div>
      <dl className="lm-bar-meta">
        <div>
          <dt className="sr-only">UTC</dt>
          <dd>{t.shift}</dd>
        </div>
        <div>
          <dt className="sr-only">{t.ev.title}</dt>
          <dd>
            <span aria-hidden="true" className="lm-pin-glyph">
              ◆
            </span>{" "}
            <V>{s.pinned}</V> {t.pinned}
          </dd>
        </div>
        <div>
          <dt className="sr-only">{t.queue.title}</dt>
          <dd>{fill(t.closed, { n: s.closed })}</dd>
        </div>
      </dl>
      <div className="lm-bar-actions">
        <a className="lm-btn lm-btn--ghost" href="?view=briefing">
          {t.briefingBtn}
        </a>
        <a className="lm-btn" href="?view=verdict">
          {t.toVerdict}
          <span aria-hidden="true" className="lm-arrow">
            →
          </span>
        </a>
      </div>
    </div>
  );
}

function Queue({ t, stage }: { t: Copy; stage: Stage }) {
  const statuses = stageState[stage].statuses;
  return (
    <section className="lm-panel lm-queue" aria-labelledby="lm-queue-title">
      <header className="lm-panel-head">
        <h2 id="lm-queue-title">{t.queue.title}</h2>
        <span>{t.queue.sorted}</span>
      </header>
      <ul className="lm-alerts">
        {alerts.map((a) => (
          <li key={a.id}>
            <a href="?view=logs" className="lm-alert" aria-current={stage !== "fresh" && a.id === "ALR-0418" ? "true" : undefined} data-status={statuses[a.id]}>
              <span className="lm-alert-top">
                <Sev level={a.severity} label={t.queue.sev[a.severity]} />
                <V className="lm-alert-id">{a.id}</V>
              </span>
              <span className="lm-alert-rule">{t.queue.rule[a.id]}</span>
              <span className="lm-alert-meta">
                <V>{a.entity}</V>
                <span>
                  {t.queue.fired} <V>{a.fired}</V> UTC
                </span>
              </span>
              <span className="lm-alert-status">{t.queue.status[statuses[a.id]]}</span>
            </a>
          </li>
        ))}
      </ul>
      {stage === "fresh" ? null : (
        <div className="lm-rule">
          <p className="lm-label">{t.queue.context}</p>
          <p>{t.queue.contextBody}</p>
        </div>
      )}
    </section>
  );
}

function Tabs({ t, view }: { t: Copy; view: View }) {
  return (
    <nav className="lm-tabs" aria-label={t.sim}>
      {tabs.map(([k, v]) => {
        const current = v === view || (view === "debrief" && v === "verdict");
        return v ? (
          <a key={k} href={`?view=${v}`} aria-current={current ? "page" : undefined}>
            {t.tabs[k]}
          </a>
        ) : (
          <span key={k} className="lm-tab-off" aria-disabled="true">
            {t.tabs[k]}
          </span>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ briefing */

export function BriefingBody({ t }: { t: Copy }) {
  return (
    <div className="lm-brief">
      <p className="lm-brief-mission">{t.brief.mission}</p>
      <div className="lm-brief-grid">
        <section aria-labelledby="lm-b-obj">
          <h3 id="lm-b-obj" className="lm-label">
            {t.brief.objectivesTitle}
          </h3>
          <ol className="lm-brief-list">
            {t.brief.objectives.map((o, i) => (
              <li key={o}>
                <V className="lm-how-n">{String(i + 1).padStart(2, "0")}</V>
                <span>{o}</span>
              </li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="lm-b-ctl">
          <h3 id="lm-b-ctl" className="lm-label">
            {t.brief.controlsTitle}
          </h3>
          <ul className="lm-brief-list lm-brief-list--plain">
            {t.brief.controls.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="lm-brief-data" aria-labelledby="lm-b-data">
        <h3 id="lm-b-data" className="lm-label">
          {t.brief.dataTitle}
        </h3>
        <p>{t.brief.data}</p>
      </section>
      <p className="lm-gate">
        <span aria-hidden="true" className="lm-gate-mark" />
        {t.brief.gate}
      </p>
    </div>
  );
}

function BriefingView({ t }: { t: Copy }) {
  return (
    <section className="lm-briefing-view" aria-labelledby="lm-brief-title">
      <header className="lm-panel-head">
        <h2 id="lm-brief-title">{t.brief.title}</h2>
      </header>
      <BriefingBody t={t} />
      <a className="lm-btn lm-btn--solid lm-brief-start" href="?view=logs">
        {t.brief.start}
        <span aria-hidden="true" className="lm-arrow">
          →
        </span>
      </a>
    </section>
  );
}

/* ------------------------------------------------------------------ log explorer */

export function FilterChips({ t, removable = true }: { t: Copy; removable?: boolean }) {
  const chips = [
    [t.flt.ip, "203.0.113.45", true],
    [t.flt.event, "4624, 4625", false],
    [t.flt.time, "02:09–02:18", true],
  ] as const;
  return (
    <ul className="lm-fchips" aria-label={t.flt.active}>
      {chips.map(([k, v, rm]) => (
        <li key={k} className="lm-fchip">
          <span className="lm-fchip-k">{k}</span>
          <V className="lm-fchip-v">{v}</V>
          {removable && rm ? (
            <button type="button" className="lm-fchip-x" aria-label={`${t.flt.remove}: ${k}`}>
              ×
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function Explorer({ t }: { t: Copy }) {
  return (
    <section className="lm-explorer" aria-labelledby="lm-logs-title">
      <header className="lm-panel-head">
        <h2 id="lm-logs-title">{t.logs.title}</h2>
        <span className="lm-pivot">{t.logs.pivot}</span>
      </header>
      <div className="lm-filterbar">
        <FilterChips t={t} />
        <span className="lm-fbtn">
          <span aria-hidden="true">＋</span> {t.flt.add}
        </span>
        <span className="lm-fselect">
          {t.flt.account}: {t.flt.any}
          <span aria-hidden="true"> ▾</span>
        </span>
        <span className="lm-seg" role="radiogroup" aria-label={t.flt.result}>
          <span role="radio" aria-checked="true">
            {t.flt.res.all}
          </span>
          <span role="radio" aria-checked="false">
            {t.flt.res.failure}
          </span>
          <span role="radio" aria-checked="false">
            {t.flt.res.success}
          </span>
        </span>
      </div>
      <details className="lm-querybox">
        <summary>
          {t.flt.query}{" "}
          <span className="lm-query-text" dir="ltr">
            <span className="lm-q-field">ip:</span>203.0.113.45 <span className="lm-q-field">event:</span>4624,4625 <span className="lm-q-field">time:</span>02:09..02:18
          </span>
        </summary>
      </details>
      <Histogram t={t} />
      <div className="lm-range">
        <span className="lm-range-k">{t.flt.rangeLabel}</span>
        <V className="lm-range-v">02:09:00 – 02:18:00 UTC</V>
        <span className="lm-link">{t.flt.clearRange}</span>
      </div>
      <div className="lm-facets">
        <Facet label={t.logs.facets.event} items={facets.event} />
        <Facet label={t.logs.facets.result} items={facets.result.map(([k, n]) => [t.flt.res[k], n] as const)} />
        <Facet label={t.logs.facets.type} items={facets.type} />
        <Facet label={t.logs.facets.sub} items={facets.sub} />
      </div>
      <div className="lm-results-bar">
        <span role="status">{t.logs.results}</span>
        <span>{t.logs.sorted}</span>
      </div>
      <div className="lm-table-wrap">
        <table className="lm-table">
          <thead>
            <tr>
              <th scope="col" aria-sort="ascending">
                {t.logs.cols.time}
              </th>
              <th scope="col">{t.logs.cols.event}</th>
              <th scope="col">{t.logs.cols.status}</th>
              <th scope="col">{t.logs.cols.account}</th>
              <th scope="col">{t.logs.cols.source}</th>
              <th scope="col">{t.logs.cols.client}</th>
              <th scope="col">{t.logs.cols.type}</th>
              <th scope="col">{t.logs.cols.auth}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((e) => {
              const pinned = pins.some((p) => p.id === e.id);
              return (
                <tr key={e.id} aria-selected={e.id === selectedId || undefined} data-ok={e.eventId === 4624 || undefined}>
                  <td>
                    {pinned ? (
                      <span className="lm-row-pin" aria-label={t.insp.pinnedState}>
                        ◆
                      </span>
                    ) : null}
                    <V>{e.time}</V>
                  </td>
                  <td>
                    <V>{e.eventId}</V>
                  </td>
                  <td>
                    <Outcome ok={e.eventId === 4624} label={e.eventId === 4624 ? t.logs.outcome.ok : t.logs.outcome.fail} />
                  </td>
                  <td>
                    <V>{e.user}</V>
                  </td>
                  <td>
                    <V>{e.ip}</V>
                  </td>
                  <td>
                    <V>{e.client}</V>
                  </td>
                  <td>
                    <V>{e.logonType}</V>
                  </td>
                  <td>
                    <V>{e.auth}</V>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Facet({ label, items }: { label: string; items: readonly (readonly [string, number])[] }) {
  return (
    <div className="lm-facet">
      <span className="lm-label">{label}</span>
      <span className="lm-facet-items">
        {items.map(([v, n]) => (
          <span key={v} className="lm-chip">
            <V>{v}</V>
            <V className="lm-chip-n">{n}</V>
          </span>
        ))}
      </span>
    </div>
  );
}

export function InspectorBody({ t }: { t: Copy }) {
  return (
    <>
      <div className="lm-insp-head">
        <p className="lm-insp-kicker">
          <V>4624</V> · <Outcome ok label={t.logs.outcome.ok} />
        </p>
        <h3 className="lm-insp-name">{t.insp.name[4624]}</h3>
        <p className="lm-insp-ts">
          <V>{selected.ts}</V> UTC · <V>{selected.id}</V>
        </p>
      </div>
      <div className="lm-subtabs" role="presentation">
        <span aria-current="true">{t.insp.tabs.fields}</span>
        <span>{t.insp.tabs.raw}</span>
        <span>{t.insp.tabs.related}</span>
      </div>
      <dl className="lm-fields">
        {selected.fields.map(([k, v]) => (
          <div key={k} data-k={k}>
            <dt>{t.insp.field[k]}</dt>
            <dd>
              {k === "elevated" ? t.insp.elevatedNo : <V>{v}</V>}
              {k === "logonType" ? <span className="lm-gloss"> · {t.insp.logonType["3"]}</span> : null}
              {k === "client" ? <span className="lm-client-note">{t.insp.clientNote}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
      <section className="lm-observed" aria-labelledby="lm-obs-title">
        <h4 id="lm-obs-title" className="lm-label">
          {t.insp.observedTitle}
        </h4>
        <ul>
          {t.insp.observed.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>
      <div className="lm-related">
        <p className="lm-label">{t.insp.relatedTitle}</p>
        <ul>
          {t.insp.related.map((r, i) => (
            <li key={r}>
              <span>{r}</span>
              <V className="lm-chip-n">{[19, 16, 26][i]}</V>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Inspector({ t }: { t: Copy }) {
  return (
    <section className="lm-panel lm-inspector" aria-labelledby="lm-insp-title">
      <header className="lm-panel-head">
        <h2 id="lm-insp-title">{t.insp.title}</h2>
      </header>
      <InspectorBody t={t} />
      <div className="lm-insp-foot">
        <div className="lm-pinrow">
          <span className="lm-pinstate">
            <span aria-hidden="true">◆</span> {t.insp.pinnedState}
          </span>
          <button type="button" className="lm-btn lm-btn--ghost">
            {t.insp.unpin}
            <kbd>P</kbd>
          </button>
        </div>
        <p className="lm-col-hint">
          {fill(t.ev.count, { n: 7 })} · {t.ev.countNote}
        </p>
      </div>
    </section>
  );
}

function Dock({ t }: { t: Copy }) {
  return (
    <section className="lm-dock" aria-labelledby="lm-dock-title">
      <h2 id="lm-dock-title" className="lm-label">
        {t.tl.dock} · <V>{pins.length}</V>
      </h2>
      <ol className="lm-dock-list">
        {pins.map((p) => (
          <li key={p.id} data-ok={p.eventId === 4624 || undefined} aria-current={p.id === selectedId || undefined}>
            <V className="lm-dock-time">{p.time.slice(0, 8)}</V>
            <span className="lm-dock-what">
              <V>{p.eventId}</V> · <V>{p.user}</V>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ evidence + timeline */

export function FindingTag({ t, id }: { t: Copy; id: FindingId }) {
  return (
    <span className="lm-ftag" title={t.verdict.f[id]}>
      <V>{id.toUpperCase()}</V>
    </span>
  );
}

export function ObservedList({ t, manage = false }: { t: Copy; manage?: boolean }) {
  return (
    <ol className="lm-obs-list">
      {pins.map((p, i) => (
        <li key={p.id} data-ok={p.eventId === 4624 || undefined}>
          {i === 1 ? <p className="lm-gap">{fill(t.tl.gap, { t: t.gaps[0] })}</p> : null}
          {i === 6 ? <p className="lm-gap">{fill(t.tl.gap, { t: t.gaps[1] })}</p> : null}
          <div className="lm-obs-card">
            <p className="lm-obs-time">
              {t.day[p.day]} · <V>{p.time}</V> UTC · <V>{p.id}</V>
            </p>
            <p className="lm-obs-event">
              <V>{p.eventId}</V> <Outcome ok={p.eventId === 4624} label={p.eventId === 4624 ? t.logs.outcome.ok : t.logs.outcome.fail} /> · <V>{p.user}</V> · <V>{`${p.ip} → ${p.host}`}</V>
            </p>
            <p className="lm-obs-detail">
              <V>{p.auth}</V> · {t.logs.cols.type} <V>{p.type}</V>
              {p.extra ? (
                <>
                  {" "}
                  · <V>{p.extra}</V>
                </>
              ) : null}
            </p>
            <p className="lm-obs-note">
              <span className="lm-obs-note-k">{t.ev.note}</span> {t.tl.notes[p.note]}
            </p>
            <p className="lm-obs-links">
              {p.links.length ? (
                <>
                  <span className="lm-obs-links-k">{t.ev.supports}</span>
                  {p.links.map((f) => (
                    <FindingTag key={f} t={t} id={f} />
                  ))}
                </>
              ) : (
                <span className="lm-unlinked">{t.ev.unlinked}</span>
              )}
            </p>
            {manage ? (
              <p className="lm-obs-actions">
                <span className="lm-btn lm-btn--small">{t.ev.link}</span>
                <span className="lm-btn lm-btn--small lm-btn--ghost">{t.ev.unpin}</span>
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Before submission: only the claim, the visitor's own working status and the evidence they linked. */
const workingStatus = { h1: "supported", h2: "unconfirmed", h3: null } as const;
export function WorkingHypotheses({ t }: { t: Copy }) {
  const linked = { h1: 4, h2: 1, h3: 1 } as const;
  return (
    <ul className="lm-hyps">
      {(["h1", "h2", "h3"] as const).map((h) => {
        const s = workingStatus[h];
        return (
          <li key={h} className="lm-hyp" data-status={s ?? "unset"}>
            <p className="lm-hyp-status">
              <span aria-hidden="true" className="lm-hyp-mark" />
              {s ? t.tl.status[s] : t.verdict.choose}
              <span className="lm-hyp-n">{fill(t.tl.evidence, { n: linked[h] })}</span>
            </p>
            <p className="lm-hyp-claim">{t.tl.h[h].claim}</p>
          </li>
        );
      })}
    </ul>
  );
}

function TimelineView({ t }: { t: Copy }) {
  return (
    <section className="lm-tl" aria-labelledby="lm-tl-title">
      <header className="lm-panel-head">
        <h2 id="lm-tl-title">{t.tl.title}</h2>
        <span>{t.tl.scope}</span>
      </header>
      <p className="lm-col-hint">{t.ev.countNote}</p>
      <ObservedList t={t} manage />
    </section>
  );
}

function HypothesesPanel({ t }: { t: Copy }) {
  return (
    <section className="lm-panel lm-inspector" aria-labelledby="lm-hyp-title" tabIndex={0}>
      <header className="lm-panel-head">
        <h2 id="lm-hyp-title">{t.tl.hypTitle}</h2>
      </header>
      <p className="lm-col-hint">{t.tl.hypHint}</p>
      <WorkingHypotheses t={t} />
    </section>
  );
}

/* ------------------------------------------------------------------ entities */

function EntitiesView({ t }: { t: Copy }) {
  return (
    <section className="lm-ents" aria-labelledby="lm-ent-title">
      <header className="lm-panel-head">
        <h2 id="lm-ent-title">{t.ent.title}</h2>
        <span>
          <V>{t.ent.scope}</V>
        </span>
      </header>
      <EntityGraph t={t} />
      <EntityTable t={t} />
    </section>
  );
}

function EntityPanel({ t }: { t: Copy }) {
  return (
    <section className="lm-panel lm-inspector" aria-labelledby="lm-entd-title" tabIndex={0}>
      <header className="lm-panel-head">
        <h2 id="lm-entd-title">{t.ent.selected}</h2>
      </header>
      <EntityDetail t={t} />
    </section>
  );
}

/* ------------------------------------------------------------------ verdict */

export const dispOrder: Disposition[] = ["tp", "misconfig", "expected", "fp"];

export function Stepper({ t, step }: { t: Copy; step: number }) {
  return (
    <ol className="lm-stepper" aria-label={fill(t.verdict.stepOf, { n: step })}>
      {t.verdict.steps.map((s, i) => (
        <li key={s} aria-current={i + 1 === step ? "step" : undefined} data-done={i + 1 < step || undefined}>
          <V className="lm-step-n">{i + 1}</V>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

export function DispositionTable({ t, answers }: { t: Copy; answers?: Record<AlertId, Disposition> }) {
  return (
    <table className="lm-disp">
      <thead>
        <tr>
          <th scope="col">{t.queue.title}</th>
          {dispOrder.map((d) => (
            <th key={d} scope="col">
              {t.verdict.disp[d]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {alerts.map((a) => (
          <tr key={a.id}>
            <th scope="row">
              <V>{a.id}</V>
              <span className="lm-disp-rule">{t.queue.rule[a.id]}</span>
            </th>
            {dispOrder.map((d) => (
              <td key={d}>
                <span className="lm-radio" aria-checked={answers?.[a.id] === d} role="radio" aria-label={`${a.id}: ${t.verdict.disp[d]}`} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VerdictView({ t }: { t: Copy }) {
  return (
    <section className="lm-verdict" aria-labelledby="lm-verdict-title">
      <header className="lm-panel-head">
        <h2 id="lm-verdict-title">{t.verdict.title}</h2>
        <span>{fill(t.verdict.stepOf, { n: 1 })}</span>
      </header>
      <Stepper t={t} step={1} />
      <div className="lm-verdict-body">
        <section>
          <h3 className="lm-col-title">
            <V>1</V> {t.verdict.steps[0]}
          </h3>
          <p className="lm-col-hint">{t.verdict.hints[0]}</p>
          <DispositionTable t={t} />
          <p className="lm-progress-line">{fill(t.verdict.classified, { n: 0 })}</p>
        </section>
        <ol className="lm-next-steps">
          {t.verdict.steps.slice(1).map((s, i) => (
            <li key={s}>
              <V className="lm-step-n">{i + 2}</V>
              <span>
                <span className="lm-next-title">{s}</span>
                <span className="lm-col-hint">{t.verdict.hints[i + 1]}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="lm-step-nav">
          <span className="lm-btn lm-btn--ghost" aria-disabled="true">
            {t.verdict.back}
          </span>
          <span className="lm-btn lm-btn--solid" aria-disabled="true">
            {t.verdict.next}
          </span>
        </div>
      </div>
    </section>
  );
}

function ProgressPanel({ t, submitted = false }: { t: Copy; submitted?: boolean }) {
  const rows = submitted
    ? [
        [t.ev.title, 11],
        [t.verdict.steps[0], "4/4"],
        [t.verdict.steps[2], "8/8"],
        [t.verdict.steps[3], "3/3"],
      ]
    : [
        [t.ev.title, 7],
        [t.verdict.steps[0], "0/4"],
        [t.verdict.steps[2], "0/8"],
        [t.verdict.steps[3], "0/3"],
      ];
  return (
    <section className="lm-panel lm-inspector" aria-labelledby="lm-sum-title">
      <header className="lm-panel-head">
        <h2 id="lm-sum-title">{t.verdict.summaryTitle}</h2>
      </header>
      <dl className="lm-sum">
        {rows.map(([k, v]) => (
          <div key={String(k)}>
            <dt>{k}</dt>
            <dd>
              <V>{v}</V>
            </dd>
          </div>
        ))}
      </dl>
      {submitted ? null : (
        <p className="lm-gate lm-gate--panel">
          <span aria-hidden="true" className="lm-gate-mark" />
          {t.verdict.gate}
        </p>
      )}
      <div className="lm-insp-foot">
        {submitted ? (
          <a className="lm-btn lm-btn--wide" href="?view=logs">
            {t.debrief.revise}
          </a>
        ) : (
          <>
            <span className="lm-btn lm-btn--wide lm-btn--solid" aria-disabled="true">
              {t.verdict.submit}
            </span>
            <p className="lm-col-hint">{t.verdict.submitBlocked}</p>
          </>
        )}
        <p className="lm-col-hint">{t.verdict.local}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ debrief (submitted only) */

export function DebriefBody({ t, level = 3 }: { t: Copy; level?: 2 | 3 }) {
  const H = level === 2 ? "h2" : "h3";
  const cat = { supported: "supported", unconfirmed: "unconfirmed", undetermined: "undetermined" } as const;
  return (
    <div className="lm-verdict-body">
      <p className="lm-debrief-summary">{t.debrief.summary}</p>
      <p className="lm-debrief-summary lm-debrief-summary--2">{t.debrief.summary2}</p>
      <p className="lm-debrief-line">
        <span aria-hidden="true" className="lm-ok-mark">
          ✓
        </span>
        {t.debrief.dispLine}
      </p>
      <section>
        <H className="lm-col-title">
          <span aria-hidden="true" className="lm-cat-mark" data-cat="observed" />
          {t.debrief.cats.observed}
        </H>
        <ul className="lm-findings">
          {findingIds.map((f) => (
            <li key={f} data-result={findingResults[f]}>
              <span aria-hidden="true" className="lm-check" />
              <span className="lm-finding-text">
                <FindingTag t={t} id={f} /> {t.verdict.f[f]}
              </span>
              <span className="lm-result" data-result={findingResults[f]}>
                {t.debrief.result[findingResults[f]]}
              </span>
              {f === "f3" || f === "f5" ? <span className="lm-why">{t.debrief.why[f]}</span> : null}
            </li>
          ))}
        </ul>
      </section>
      {hypotheses.map((h) => {
        const ok = h.submitted === h.expected;
        return (
          <section key={h.id} className="lm-hyp-result" data-status={h.expected}>
            <H className="lm-col-title">
              <span aria-hidden="true" className="lm-cat-mark" data-cat={cat[h.expected]} />
              {t.debrief.cats[cat[h.expected]]}
            </H>
            <p className="lm-hyp-claim">{t.tl.h[h.id].claim}</p>
            <p className="lm-hyp-verdict">
              <span>{fill(t.debrief.yourStatus, { s: t.tl.status[h.submitted] })}</span>
              <span className="lm-result" data-result={ok ? "supported" : "overstated"}>
                {ok ? t.debrief.match : t.debrief.overstated}
              </span>
            </p>
            <p className="lm-why">{t.debrief.hWhy[h.id]}</p>
          </section>
        );
      })}
      <section className="lm-limits">
        <H className="lm-col-title">{t.debrief.limitsTitle}</H>
        <ul>
          {t.debrief.limits.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>
      <details className="lm-notes" open>
        <summary>{t.debrief.notesTitle}</summary>
        <ol>
          {t.debrief.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}

function DebriefView({ t }: { t: Copy }) {
  return (
    <section className="lm-verdict" aria-labelledby="lm-debrief-title">
      <header className="lm-panel-head">
        <h2 id="lm-debrief-title">{t.debrief.title}</h2>
      </header>
      <DebriefBody t={t} />
      <div className="lm-debrief-actions">
        <a className="lm-btn lm-btn--ghost" href="?view=logs">
          {t.debrief.revise}
        </a>
        <span className="lm-btn lm-btn--solid">{t.debrief.report}</span>
      </div>
    </section>
  );
}

export function DesktopWorkspace({ t, view }: { t: Copy; view: View }) {
  const stage = stageOf(view);
  return (
    <div className="lm-desk">
      <WorkspaceBar t={t} stage={stage} />
      <div className="lm-grid" data-view={view}>
        <Queue t={t} stage={stage} />
        {view === "briefing" ? (
          <div className="lm-center lm-center--wide">
            <BriefingView t={t} />
          </div>
        ) : (
          <>
            <div className="lm-center">
              <Tabs t={t} view={view} />
              {view === "logs" ? <Explorer t={t} /> : view === "entities" ? <EntitiesView t={t} /> : view === "timeline" ? <TimelineView t={t} /> : view === "verdict" ? <VerdictView t={t} /> : <DebriefView t={t} />}
            </div>
            {view === "logs" ? <Inspector t={t} /> : view === "entities" ? <EntityPanel t={t} /> : view === "timeline" ? <HypothesesPanel t={t} /> : <ProgressPanel t={t} submitted={view === "debrief"} />}
          </>
        )}
      </div>
      {view === "logs" || view === "entities" ? <Dock t={t} /> : null}
    </div>
  );
}

export { linkedEvidence };
