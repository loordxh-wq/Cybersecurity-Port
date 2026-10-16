import { SimLabel } from "@/components/cc/SimTag";
import type { Copy } from "./copy";
import { alerts, facets, hypotheses, results, selectedId } from "./data";
import { FindingsList, HypothesisList, InspectorBody, ObservedList } from "./Desktop";
import { fill, Histogram, Outcome, Sev, V } from "./parts";

export type MobileView = "queue" | "logs" | "event" | "timeline" | "verdict" | "debrief";

const bar = [
  ["queue", "alerts"],
  ["logs", "logs"],
  ["entities", "entities"],
  ["timeline", "timeline"],
  ["verdict", "verdict"],
] as const;

function TabBar({ t, view }: { t: Copy; view: MobileView }) {
  const active = view === "event" ? "logs" : view === "debrief" ? "verdict" : view;
  return (
    <nav className="lm-m-tabbar" aria-label={t.sim}>
      {bar.map(([v, k]) => (
        <a key={v} href={v === "entities" ? undefined : `?view=${v}`} aria-current={active === v ? "page" : undefined} aria-disabled={v === "entities" || undefined}>
          <span aria-hidden="true" className="lm-m-tabicon" data-k={k} />
          <span>{t.tabs[k]}</span>
          {k === "timeline" ? <V className="lm-m-badge">11</V> : null}
        </a>
      ))}
    </nav>
  );
}

function TopBar({ t, title, back }: { t: Copy; title: string; back?: string }) {
  return (
    <div className="lm-m-top">
      {back ? (
        <a className="lm-m-back" href={`?view=${back}`}>
          <span aria-hidden="true" className="lm-arrow-back">
            ‹
          </span>
          <span className="sr-only">{t.verdict.back}</span>
        </a>
      ) : null}
      <div className="lm-m-top-id">
        <SimLabel className="lm-sim">{t.sim}</SimLabel>
        <p className="lm-m-top-title">{title}</p>
      </div>
    </div>
  );
}

function QueueScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.scenario} />
      <p className="lm-m-shift">{t.shift}</p>
      <h2 className="lm-m-h">{t.queue.title}</h2>
      <ul className="lm-m-alerts">
        {alerts.map((a) => (
          <li key={a.id}>
            <a href="?view=logs" className="lm-alert" data-status={a.status}>
              <span className="lm-alert-top">
                <Sev level={a.severity} label={t.queue.sev[a.severity]} />
                <V className="lm-alert-id">{a.id}</V>
              </span>
              <span className="lm-alert-rule">{t.queue.rule[a.id]}</span>
              <span className="lm-alert-meta">
                <V>{a.entity}</V>
                <span>
                  <V>{a.fired}</V> UTC · {t.queue.status[a.status]}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <section className="lm-m-brief" aria-labelledby="lm-m-brief-title">
        <h2 id="lm-m-brief-title" className="lm-m-h">
          {t.brief.title}
        </h2>
        <ul>
          {t.brief.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

function LogsScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={`ALR-0418 · ${t.logs.title}`} back="queue" />
      <div className="lm-query lm-query--m">
        <span aria-hidden="true" className="lm-query-icon">
          ⌕
        </span>
        <span className="lm-query-text" dir="ltr">
          <span className="lm-q-field">ip:</span>
          <span className="lm-q-value">203.0.113.45</span>
        </span>
      </div>
      <div className="lm-m-chips" role="group" aria-label={t.logs.filters} tabIndex={0}>
        <span className="lm-chip lm-chip--btn">{t.logs.filters}</span>
        {facets.event.map(([v, n]) => (
          <span key={v} className="lm-chip">
            <V>{v}</V>
            <V className="lm-chip-n">{n}</V>
          </span>
        ))}
        {facets.type.map(([v, n]) => (
          <span key={`t${v}`} className="lm-chip">
            {t.logs.cols.type} <V>{v}</V>
            <V className="lm-chip-n">{n}</V>
          </span>
        ))}
      </div>
      <Histogram t={t} compact />
      <p className="lm-m-count" role="status">
        {t.logs.results} · <V>{t.logs.range}</V>
      </p>
      <ol className="lm-m-cards">
        {results.slice(9, 16).map((e) => (
          <li key={e.id}>
            <a href="?view=event" className="lm-m-card" data-ok={e.eventId === 4624 || undefined} aria-current={e.id === selectedId || undefined}>
              <span className="lm-m-card-top">
                <V>{e.time}</V>
                <span>
                  <V>{e.eventId}</V> <Outcome ok={e.eventId === 4624} label={e.eventId === 4624 ? t.logs.outcome.ok : t.logs.outcome.fail} />
                </span>
              </span>
              <span className="lm-m-card-user">
                <V>{e.user}</V>
              </span>
              <span className="lm-m-card-meta">
                <V>{e.ip}</V> · {t.logs.cols.type} <V>{e.logonType}</V> · <V>{e.auth}</V>
              </span>
            </a>
          </li>
        ))}
      </ol>
      <p className="lm-m-more">{t.mobile.viewAll}</p>
    </>
  );
}

function EventSheet({ t }: { t: Copy }) {
  return (
    <div className="lm-m-sheet-layer">
      <div className="lm-m-under" aria-hidden="true">
        <LogsScreen t={t} />
      </div>
      <section className="lm-m-sheet" role="dialog" aria-modal="true" aria-labelledby="lm-m-sheet-title">
        <span aria-hidden="true" className="lm-m-grab" />
        <p className="sr-only">{t.mobile.sheetHint}</p>
        <h2 id="lm-m-sheet-title" className="sr-only">
          {t.insp.title}
        </h2>
        <div className="lm-m-sheet-body" tabIndex={0} aria-label={t.insp.title}>
          <InspectorBody t={t} />
        </div>
        <div className="lm-m-sheet-foot">
          <span className="lm-btn lm-btn--wide lm-btn--solid">
            <span aria-hidden="true">◆</span> {t.insp.pin}
          </span>
        </div>
      </section>
    </div>
  );
}

function TimelineScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.tl.title} />
      <p className="lm-m-shift">{t.tl.scope}</p>
      <h2 className="lm-m-h">{t.tl.hypTitle}</h2>
      <HypothesisList t={t} />
      <h2 className="lm-m-h">{t.tl.observedTitle}</h2>
      <ObservedList t={t} />
    </>
  );
}

function VerdictScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.verdict.title} back="timeline" />
      <div className="lm-m-stepper" aria-label={t.verdict.step}>
        <span className="lm-m-step-label">{t.verdict.step}</span>
        <span className="lm-m-steps" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((n) => (
            <i key={n} data-on={n <= 3 || undefined} />
          ))}
        </span>
      </div>
      <h2 className="lm-m-h">{t.verdict.findTitle}</h2>
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
      <div className="lm-m-stepnav">
        <span className="lm-btn lm-btn--ghost">{t.verdict.back}</span>
        <a className="lm-btn lm-btn--solid" href="?view=debrief">
          {t.verdict.next}
        </a>
      </div>
    </>
  );
}

function DebriefScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.debrief.title} back="verdict" />
      <p className="lm-debrief-summary">{t.debrief.summary}</p>
      <p className="lm-debrief-line">
        <span aria-hidden="true" className="lm-ok-mark">
          ✓
        </span>
        {t.debrief.dispLine}
      </p>
      <FindingsList t={t} debrief />
      <p className="lm-debrief-line">
        <span aria-hidden="true" className="lm-ok-mark">
          ✓
        </span>
        {t.debrief.hypLine}
      </p>
      <section className="lm-limits">
        <h2 className="lm-m-h">{t.debrief.limitsTitle}</h2>
        <ul>
          {t.debrief.limits.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function MobileFlow({ t, view }: { t: Copy; view: MobileView }) {
  return (
    <div className="lm-mobile" data-view={view}>
      <div className="lm-m-screen">
        {view === "queue" ? <QueueScreen t={t} /> : view === "logs" ? <LogsScreen t={t} /> : view === "event" ? <EventSheet t={t} /> : view === "timeline" ? <TimelineScreen t={t} /> : view === "verdict" ? <VerdictScreen t={t} /> : <DebriefScreen t={t} />}
      </div>
      <TabBar t={t} view={view} />
      <p className="sr-only">{fill(t.closed, { n: 1 })}</p>
    </div>
  );
}
