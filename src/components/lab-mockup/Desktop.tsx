import { SimLabel } from "@/components/cc/SimTag";
import type { Copy } from "./copy";
import { actions, alerts, dispositions, facets, findings, hypotheses, pins, results, selected, selectedId, type AlertId, type Disposition } from "./data";
import { fill, Histogram, Outcome, Sev, V } from "./parts";

export type View = "logs" | "timeline" | "verdict" | "debrief";
const tabs = ["alerts", "logs", "entities", "timeline", "mitre", "verdict"] as const;
const tabView: Partial<Record<(typeof tabs)[number], View>> = { logs: "logs", timeline: "timeline", verdict: "verdict" };

export function WorkspaceBar({ t }: { t: Copy }) {
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
          <dt className="sr-only">{t.pinned}</dt>
          <dd>
            <V>11</V> {t.pinned}
          </dd>
        </div>
        <div>
          <dt className="sr-only">{t.queue.title}</dt>
          <dd>{fill(t.closed, { n: 1 })}</dd>
        </div>
      </dl>
      <div className="lm-bar-actions">
        <a className="lm-btn lm-btn--ghost" href="?view=logs">
          {t.briefing}
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

function Queue({ t, active }: { t: Copy; active: AlertId }) {
  return (
    <section className="lm-panel lm-queue" aria-labelledby="lm-queue-title">
      <header className="lm-panel-head">
        <h2 id="lm-queue-title">{t.queue.title}</h2>
        <span>{t.queue.sorted}</span>
      </header>
      <ul className="lm-alerts">
        {alerts.map((a) => (
          <li key={a.id}>
            <a href="?view=logs" className="lm-alert" aria-current={a.id === active ? "true" : undefined} data-status={a.status}>
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
              <span className="lm-alert-status">{t.queue.status[a.status]}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="lm-rule">
        <p className="lm-label">{t.queue.context}</p>
        <p>{t.queue.contextBody}</p>
      </div>
    </section>
  );
}

function Tabs({ t, view }: { t: Copy; view: View }) {
  return (
    <nav className="lm-tabs" aria-label={t.sim}>
      {tabs.map((k) => {
        const v = tabView[k];
        const current = v === view || (view === "debrief" && k === "verdict");
        return v ? (
          <a key={k} href={`?view=${v}`} aria-current={current ? "page" : undefined}>
            {t.tabs[k]}
          </a>
        ) : (
          <span key={k} className="lm-tab-off">
            {t.tabs[k]}
          </span>
        );
      })}
    </nav>
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

function Explorer({ t }: { t: Copy }) {
  return (
    <section className="lm-explorer" aria-labelledby="lm-logs-title">
      <header className="lm-panel-head">
        <h2 id="lm-logs-title">{t.logs.title}</h2>
        <span className="lm-pivot">{t.logs.pivot}</span>
      </header>
      <div className="lm-query">
        <span aria-hidden="true" className="lm-query-icon">
          ⌕
        </span>
        <span className="lm-query-text" dir="ltr">
          <span className="lm-q-field">ip:</span>
          <span className="lm-q-value">203.0.113.45</span>
        </span>
        <span className="lm-query-range">
          <V>{t.logs.range}</V>
        </span>
      </div>
      <p className="lm-query-help" dir="ltr">
        {t.logs.help}
      </p>
      <div className="lm-facets">
        <Facet label={t.logs.facets.event} items={facets.event} />
        <Facet label={t.logs.facets.type} items={facets.type} />
        <Facet label={t.logs.facets.sub} items={facets.sub} />
        <Facet label={t.logs.facets.account} items={facets.account} />
      </div>
      <Histogram t={t} />
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
            {results.map((e) => (
              <tr key={e.id} aria-selected={e.id === selectedId || undefined} data-ok={e.eventId === 4624 || undefined}>
                <td>
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
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
        <button type="button" className="lm-btn lm-btn--wide" aria-pressed="true">
          <span aria-hidden="true">◆</span> {t.insp.pinnedState}
          <kbd>P</kbd>
        </button>
      </div>
    </section>
  );
}

function Dock({ t }: { t: Copy }) {
  return (
    <section className="lm-dock" aria-labelledby="lm-dock-title">
      <h2 id="lm-dock-title" className="lm-label">
        {t.tl.dock}
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

export function ObservedList({ t }: { t: Copy }) {
  return (
    <ol className="lm-obs-list">
      {pins.map((p, i) => (
        <li key={p.id} data-ok={p.eventId === 4624 || undefined}>
          {i === 1 ? <p className="lm-gap">{fill(t.tl.gap, { t: t.gaps[0] })}</p> : null}
          {i === 6 ? <p className="lm-gap">{fill(t.tl.gap, { t: t.gaps[1] })}</p> : null}
          <div className="lm-obs-card">
            <p className="lm-obs-time">
              {t.day[p.day]} · <V>{p.time}</V> UTC
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
            <p className="lm-obs-note">{t.tl.notes[p.note]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function HypothesisList({ t }: { t: Copy }) {
  return (
    <ul className="lm-hyps">
      {hypotheses.map((h) => (
        <li key={h.id} className="lm-hyp" data-status={h.status}>
          <p className="lm-hyp-status">
            <span aria-hidden="true" className="lm-hyp-mark" />
            {t.tl.status[h.status]}
            <span className="lm-hyp-n">{fill(t.tl.evidence, { n: h.evidence.length })}</span>
          </p>
          <p className="lm-hyp-claim">{t.tl.h[h.id].claim}</p>
          <p className="lm-hyp-line">
            <span className="lm-label">{t.tl.forLabel}</span>
            {t.tl.h[h.id].for}
          </p>
          <p className="lm-hyp-line">
            <span className="lm-label">{t.tl.limitsLabel}</span>
            {t.tl.h[h.id].limits}
          </p>
        </li>
      ))}
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
      <div className="lm-tl-cols">
        <div>
          <h3 className="lm-col-title">{t.tl.observedTitle}</h3>
          <p className="lm-col-hint">{t.tl.observedHint}</p>
          <ObservedList t={t} />
        </div>
      </div>
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
      <HypothesisList t={t} />
    </section>
  );
}

const dispOrder: Disposition[] = ["tp", "misconfig", "expected", "fp"];

export function DispositionTable({ t }: { t: Copy }) {
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
                <span className="lm-radio" aria-checked={dispositions[a.id] === d} role="radio" aria-label={`${a.id}: ${t.verdict.disp[d]}`} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function FindingsList({ t, debrief = false }: { t: Copy; debrief?: boolean }) {
  return (
    <ul className="lm-findings">
      {findings.map((f) => (
        <li key={f.id} data-result={debrief ? f.result : undefined}>
          <span aria-hidden="true" className="lm-check" data-on={!debrief || undefined} />
          <span className="lm-finding-text">{t.verdict.f[f.id]}</span>
          {debrief ? (
            <span className="lm-result" data-result={f.result}>
              {t.debrief.result[f.result]}
            </span>
          ) : (
            <span className="lm-pins" data-none={f.pinned === 0 || undefined}>
              {f.pinned ? fill(t.verdict.pinnedCount, { n: f.pinned }) : t.verdict.noPins}
            </span>
          )}
          {debrief && (f.id === "f3" || f.id === "f5") ? <span className="lm-why">{t.debrief.why[f.id]}</span> : null}
        </li>
      ))}
    </ul>
  );
}

function VerdictView({ t }: { t: Copy }) {
  return (
    <section className="lm-verdict" aria-labelledby="lm-verdict-title">
      <header className="lm-panel-head">
        <h2 id="lm-verdict-title">{t.verdict.title}</h2>
      </header>
      <div className="lm-verdict-body">
        <section>
          <h3 className="lm-col-title">
            <V>1</V> {t.verdict.dispTitle}
          </h3>
          <DispositionTable t={t} />
          <p className="lm-incident">
            <span aria-hidden="true" className="lm-check" data-on />
            {t.verdict.incBody}
          </p>
        </section>
        <section>
          <h3 className="lm-col-title">
            <V>2</V> {t.verdict.findTitle}
          </h3>
          <p className="lm-col-hint">{t.verdict.findHint}</p>
          <p className="lm-group">{t.verdict.observedGroup}</p>
          <FindingsList t={t} />
          <p className="lm-group">{t.verdict.analysisGroup}</p>
          <ul className="lm-conclusions">
            {hypotheses.map((h) => (
              <li key={h.id} data-status={h.status}>
                <span className="lm-hyp-claim">{t.tl.h[h.id].claim}</span>
                <span className="lm-hyp-status">
                  <span aria-hidden="true" className="lm-hyp-mark" />
                  {t.tl.status[h.status]}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="lm-col-title">
            <V>3</V> {t.verdict.scopeTitle}
          </h3>
          <div className="lm-scope">
            <div>
              <p className="lm-group">{t.verdict.confirmed}</p>
              <dl className="lm-scope-list">
                <div>
                  <dt>{t.verdict.scopeLabels.accounts}</dt>
                  <dd>
                    <V className="lm-token">j.morgan</V>
                  </dd>
                </div>
                <div>
                  <dt>{t.verdict.scopeLabels.sources}</dt>
                  <dd>
                    <V className="lm-token">203.0.113.45</V>
                  </dd>
                </div>
                <div>
                  <dt>{t.verdict.scopeLabels.hosts}</dt>
                  <dd>
                    <V className="lm-token">JMP01</V> <V className="lm-token">SRV-FILE01</V>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="lm-scope-possible">
              <p className="lm-group">{t.verdict.possible}</p>
              <dl className="lm-scope-list">
                <div>
                  <dt>{t.verdict.scopeLabels.sources}</dt>
                  <dd>
                    <V className="lm-token lm-token--dashed">203.0.113.77</V>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        <section>
          <h3 className="lm-col-title">
            <V>4</V> {t.verdict.actTitle}
          </h3>
          <ul className="lm-actions">
            {actions.map((a) => (
              <li key={a.id}>
                <span aria-hidden="true" className="lm-check" data-on={a.checked || undefined} />
                {t.verdict.a[a.id]}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="lm-col-title">
            <V>5</V> {t.verdict.reasoning}
          </h3>
          <div className="lm-textarea">{t.verdict.reasoningPh}</div>
          <p className="lm-col-hint">{t.verdict.local}</p>
        </section>
      </div>
    </section>
  );
}

function EvidenceSummary({ t, submitted = false }: { t: Copy; submitted?: boolean }) {
  return (
    <section className="lm-panel lm-inspector" aria-labelledby="lm-sum-title">
      <header className="lm-panel-head">
        <h2 id="lm-sum-title">{t.verdict.summaryTitle}</h2>
      </header>
      <dl className="lm-sum">
        <div>
          <dt>{t.tl.observedTitle}</dt>
          <dd>
            <V>11</V>
          </dd>
        </div>
        <div>
          <dt>{t.tl.hypTitle}</dt>
          <dd>
            <V>3</V>
          </dd>
        </div>
      </dl>
      <HypothesisList t={t} />
      <div className="lm-insp-foot">
        {submitted ? (
          <a className="lm-btn lm-btn--wide" href="?view=logs">
            {t.debrief.revise}
          </a>
        ) : (
          <a className="lm-btn lm-btn--wide lm-btn--solid" href="?view=debrief">
            {t.verdict.submit}
          </a>
        )}
        <p className="lm-col-hint">{t.verdict.local}</p>
      </div>
    </section>
  );
}

function DebriefView({ t }: { t: Copy }) {
  return (
    <section className="lm-verdict" aria-labelledby="lm-debrief-title">
      <header className="lm-panel-head">
        <h2 id="lm-debrief-title">{t.debrief.title}</h2>
      </header>
      <div className="lm-verdict-body">
        <p className="lm-debrief-summary">{t.debrief.summary}</p>
        <p className="lm-debrief-line">
          <span aria-hidden="true" className="lm-ok-mark">
            ✓
          </span>
          {t.debrief.dispLine}
        </p>
        <section>
          <h3 className="lm-col-title">{t.verdict.observedGroup}</h3>
          <FindingsList t={t} debrief />
        </section>
        <section>
          <h3 className="lm-col-title">{t.verdict.analysisGroup}</h3>
          <p className="lm-debrief-line">
            <span aria-hidden="true" className="lm-ok-mark">
              ✓
            </span>
            {t.debrief.hypLine}
          </p>
        </section>
        <section className="lm-limits">
          <h3 className="lm-col-title">{t.debrief.limitsTitle}</h3>
          <ul>
            {t.debrief.limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
        <details className="lm-notes">
          <summary>{t.debrief.notes}</summary>
        </details>
        <div className="lm-debrief-actions">
          <a className="lm-btn lm-btn--ghost" href="?view=logs">
            {t.debrief.revise}
          </a>
          <span className="lm-btn lm-btn--solid">{t.debrief.report}</span>
        </div>
      </div>
    </section>
  );
}

export function DesktopWorkspace({ t, view }: { t: Copy; view: View }) {
  return (
    <div className="lm-desk">
      <WorkspaceBar t={t} />
      <div className="lm-grid" data-view={view}>
        <Queue t={t} active="ALR-0418" />
        <div className="lm-center">
          <Tabs t={t} view={view} />
          {view === "logs" ? <Explorer t={t} /> : view === "timeline" ? <TimelineView t={t} /> : view === "verdict" ? <VerdictView t={t} /> : <DebriefView t={t} />}
        </div>
        {view === "logs" ? <Inspector t={t} /> : view === "timeline" ? <HypothesesPanel t={t} /> : <EvidenceSummary t={t} submitted={view === "debrief"} />}
      </div>
      {view === "logs" ? <Dock t={t} /> : null}
    </div>
  );
}
