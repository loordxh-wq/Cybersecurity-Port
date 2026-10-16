import { SimLabel } from "@/components/cc/SimTag";
import type { Copy } from "./copy";
import { alerts, draftFindings, findingIds, linkedEvidence, results, selectedId, stageState, type Stage } from "./data";
import { BriefingBody, DebriefBody, dispOrder, FilterChips, FindingTag, InspectorBody, ObservedList, stageOf, Stepper, WorkingHypotheses } from "./Desktop";
import { EntityCards, EntityDetail } from "./Entities";
import { fill, Histogram, Outcome, Sev, V } from "./parts";

export type MobileView = "briefing" | "queue" | "logs" | "filters" | "event" | "entities" | "entity" | "evidence" | "verdict" | "findings" | "debrief";

const bar = [
  ["queue", "alerts"],
  ["logs", "logs"],
  ["entities", "entities"],
  ["evidence", "evidence"],
  ["verdict", "verdict"],
] as const;
const tabOf: Record<MobileView, (typeof bar)[number][0] | null> = { briefing: null, queue: "queue", logs: "logs", filters: "logs", event: "logs", entities: "entities", entity: "entities", evidence: "evidence", verdict: "verdict", findings: "verdict", debrief: "verdict" };

function TabBar({ t, view, pinned }: { t: Copy; view: MobileView; pinned: number }) {
  const active = tabOf[view];
  return (
    <nav className="lm-m-tabbar" aria-label={t.sim}>
      {bar.map(([v, k]) => (
        <a key={v} href={`?view=${v}`} aria-current={active === v ? "page" : undefined}>
          <span aria-hidden="true" className="lm-m-tabicon" data-k={k} />
          <span>{t.tabs[k]}</span>
          {k === "evidence" && pinned ? <V className="lm-m-badge">{pinned}</V> : null}
        </a>
      ))}
    </nav>
  );
}

/** Sticky workspace bar: back, title, and the pin counter (derived from the visitor's pins in the real lab). */
function TopBar({ t, title, back, pinned }: { t: Copy; title: string; back?: string; pinned: number }) {
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
        <h1 className="lm-m-top-title">{title}</h1>
      </div>
      <span className="lm-m-pins" aria-label={fill(t.ev.count, { n: pinned })}>
        <span aria-hidden="true">◆</span> <V>{pinned}</V>
      </span>
    </div>
  );
}

function BriefingScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.scenario} pinned={0} />
      <h2 className="lm-m-title">{t.brief.title}</h2>
      <p className="lm-m-shift">{t.shift}</p>
      <BriefingBody t={t} />
      <a className="lm-btn lm-btn--solid lm-btn--wide lm-btn--tall" href="?view=queue">
        {t.brief.start}
        <span aria-hidden="true" className="lm-arrow">
          →
        </span>
      </a>
    </>
  );
}

function QueueScreen({ t, stage }: { t: Copy; stage: Stage }) {
  const statuses = stageState[stage].statuses;
  return (
    <>
      <TopBar t={t} title={t.scenario} pinned={stageState[stage].pinned} />
      <div className="lm-m-row">
        <p className="lm-m-shift">{t.shift}</p>
        <a className="lm-link" href="?view=briefing">
          {t.briefingBtn}
        </a>
      </div>
      <h2 className="lm-m-h">
        {t.queue.title} · {t.queue.sorted}
      </h2>
      <ul className="lm-m-alerts">
        {alerts.map((a) => (
          <li key={a.id}>
            <a href="?view=logs" className="lm-alert" data-status={statuses[a.id]} data-sev={a.severity}>
              <span className="lm-alert-top">
                <Sev level={a.severity} label={t.queue.sev[a.severity]} />
                <V className="lm-alert-id">{a.id}</V>
              </span>
              <span className="lm-alert-rule">{t.queue.rule[a.id]}</span>
              <span className="lm-alert-meta">
                <V>{a.entity}</V>
                <span>
                  <V>{a.fired}</V> UTC · {t.queue.status[statuses[a.id]]}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

function LogCards({ t }: { t: Copy }) {
  return (
    <ol className="lm-m-cards">
      {results.slice(9, 16).map((e) => (
        <li key={e.id}>
          <a href="?view=event" className="lm-m-card" data-ok={e.eventId === 4624 || undefined} aria-current={e.id === selectedId || undefined}>
            <span className="lm-m-card-top">
              <V className="lm-m-card-time">{e.time}</V>
              <span className="lm-m-card-ev">
                <V className="lm-evbadge">{e.eventId}</V>
                <Outcome ok={e.eventId === 4624} label={e.eventId === 4624 ? t.logs.outcome.ok : t.logs.outcome.fail} />
              </span>
            </span>
            <span className="lm-m-card-user">
              <V>{`${e.user} → ${e.computer}`}</V>
            </span>
            <span className="lm-m-card-meta">
              <V>{e.ip}</V> · {t.logs.cols.type} <V>{e.logonType}</V> · <V>{e.auth}</V>
              {e.sub ? (
                <>
                  {" "}
                  · <V>{e.sub}</V>
                </>
              ) : null}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function LogsScreen({ t, pinned }: { t: Copy; pinned: number }) {
  return (
    <>
      <TopBar t={t} title={`ALR-0418 · ${t.logs.title}`} back="queue" pinned={pinned} />
      <div className="lm-m-search">
        <div className="lm-query lm-query--m">
          <span aria-hidden="true" className="lm-query-icon">
            ⌕
          </span>
          <span className="lm-query-text" dir="ltr">
            <span className="lm-q-field">ip:</span>203.0.113.45
          </span>
        </div>
        <a className="lm-btn lm-m-fbtn" href="?view=filters">
          {t.flt.title} <V className="lm-m-fcount">3</V>
        </a>
      </div>
      <div className="lm-m-chips-row" role="group" aria-label={t.flt.active} tabIndex={0}>
        <FilterChips t={t} />
      </div>
      <div className="lm-seg lm-seg--m" role="radiogroup" aria-label={t.flt.result}>
        <span role="radio" aria-checked="true">
          {t.flt.res.all} <V className="lm-chip-n">19</V>
        </span>
        <span role="radio" aria-checked="false">
          {t.flt.res.failure} <V className="lm-chip-n">17</V>
        </span>
        <span role="radio" aria-checked="false">
          {t.flt.res.success} <V className="lm-chip-n">2</V>
        </span>
      </div>
      <Histogram t={t} compact />
      <div className="lm-range lm-range--m">
        <span className="lm-range-k">{t.flt.rangeLabel}</span>
        <V className="lm-range-v">02:09–02:18 UTC</V>
        <span className="lm-link">{t.flt.clearRange}</span>
      </div>
      <p className="lm-m-count" role="status">
        {t.logs.results} · {t.logs.sorted}
      </p>
      <LogCards t={t} />
      <p className="lm-m-more">{t.mobile.viewAll}</p>
    </>
  );
}

function FiltersSheet({ t }: { t: Copy }) {
  return (
    <div className="lm-m-sheet-layer">
      <div className="lm-m-under" aria-hidden="true">
        <LogsScreen t={t} pinned={7} />
      </div>
      <section className="lm-m-sheet lm-m-sheet--form" role="dialog" aria-modal="true" aria-labelledby="lm-m-flt-title">
        <span aria-hidden="true" className="lm-m-grab" />
        <div className="lm-m-sheet-head">
          <h2 id="lm-m-flt-title" className="lm-m-title">
            {t.flt.title}
          </h2>
          <span className="lm-link">{t.flt.clear}</span>
        </div>
        <div className="lm-m-sheet-body" tabIndex={0} aria-label={t.flt.title}>
          <label className="lm-field">
            <span className="lm-field-k">{t.flt.ip}</span>
            <span className="lm-input" dir="ltr">
              203.0.113.45
            </span>
          </label>
          <label className="lm-field">
            <span className="lm-field-k">{t.flt.account}</span>
            <span className="lm-input lm-input--ph">{t.flt.any}</span>
          </label>
          <fieldset className="lm-field">
            <legend className="lm-field-k">{t.flt.event}</legend>
            <span className="lm-toggles">
              {[
                ["4624", true],
                ["4625", true],
                ["4740", false],
              ].map(([id, on]) => (
                <span key={String(id)} className="lm-toggle" role="checkbox" aria-checked={Boolean(on)}>
                  <V>{id}</V>
                </span>
              ))}
            </span>
          </fieldset>
          <fieldset className="lm-field">
            <legend className="lm-field-k">{t.flt.result}</legend>
            <span className="lm-seg lm-seg--m" role="radiogroup" aria-label={t.flt.result}>
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
          </fieldset>
          <fieldset className="lm-field">
            <legend className="lm-field-k">{t.flt.time}</legend>
            <Histogram t={t} compact />
            <span className="lm-timepair">
              <label>
                <span className="lm-field-k">{t.flt.from}</span>
                <span className="lm-input" dir="ltr">
                  02:09:00
                </span>
              </label>
              <label>
                <span className="lm-field-k">{t.flt.to}</span>
                <span className="lm-input" dir="ltr">
                  02:18:00
                </span>
              </label>
            </span>
          </fieldset>
        </div>
        <div className="lm-m-sheet-foot">
          <span className="lm-btn lm-btn--wide lm-btn--solid lm-btn--tall">{t.flt.apply}</span>
        </div>
      </section>
    </div>
  );
}

function EventSheet({ t }: { t: Copy }) {
  return (
    <div className="lm-m-sheet-layer">
      <div className="lm-m-under" aria-hidden="true">
        <LogsScreen t={t} pinned={6} />
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
          <span className="lm-btn lm-btn--wide lm-btn--solid lm-btn--tall">
            <span aria-hidden="true">◆</span> {t.insp.pin}
          </span>
          <p className="lm-col-hint lm-center-text">{fill(t.ev.count, { n: 6 })}</p>
        </div>
      </section>
    </div>
  );
}

function EntitiesScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.ent.title} pinned={7} />
      <p className="lm-m-shift">
        <V>{t.ent.scope}</V>
      </p>
      <span className="lm-btn lm-btn--wide">{t.ent.viewMap}</span>
      <EntityCards t={t} />
    </>
  );
}

function EntityScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.ent.title} back="entities" pinned={7} />
      <EntityDetail t={t} />
    </>
  );
}

function EvidenceScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.ev.title} pinned={7} />
      <p className="lm-m-shift">
        {fill(t.ev.count, { n: 7 })} · {t.ev.countNote}
      </p>
      <div className="lm-seg lm-seg--m" role="tablist" aria-label={t.ev.title}>
        <span role="tab" aria-selected="true">
          {t.ev.seg.timeline}
        </span>
        <span role="tab" aria-selected="false">
          {t.ev.seg.hypotheses}
        </span>
      </div>
      <ObservedList t={t} manage />
      <h2 className="lm-m-h">{t.tl.hypTitle}</h2>
      <WorkingHypotheses t={t} />
    </>
  );
}

function VerdictStep1({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.verdict.title} pinned={7} />
      <Stepper t={t} step={1} />
      <h2 className="lm-m-title">{t.verdict.steps[0]}</h2>
      <p className="lm-col-hint">{t.verdict.hints[0]}</p>
      <ul className="lm-m-disp">
        {alerts.map((a) => (
          <li key={a.id}>
            <fieldset className="lm-m-dispcard">
              <legend>
                <Sev level={a.severity} label={t.queue.sev[a.severity]} /> <V>{a.id}</V>
                <span className="lm-m-disp-rule">{t.queue.rule[a.id]}</span>
              </legend>
              <span className="lm-m-options" role="radiogroup" aria-label={a.id}>
                {dispOrder.map((d) => (
                  <span key={d} role="radio" aria-checked="false" className="lm-m-option">
                    <span aria-hidden="true" className="lm-radio" />
                    {t.verdict.disp[d]}
                  </span>
                ))}
              </span>
            </fieldset>
          </li>
        ))}
      </ul>
      <p className="lm-progress-line">{fill(t.verdict.classified, { n: 0 })}</p>
      <p className="lm-gate">
        <span aria-hidden="true" className="lm-gate-mark" />
        {t.verdict.gate}
      </p>
      <div className="lm-m-stepnav">
        <span className="lm-btn lm-btn--ghost lm-btn--tall" aria-disabled="true">
          {t.verdict.back}
        </span>
        <span className="lm-btn lm-btn--solid lm-btn--tall" aria-disabled="true">
          {t.verdict.next}
        </span>
      </div>
    </>
  );
}

function VerdictStep3({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.verdict.title} back="verdict" pinned={7} />
      <Stepper t={t} step={3} />
      <h2 className="lm-m-title">{t.verdict.steps[2]}</h2>
      <p className="lm-col-hint">{t.verdict.hints[2]}</p>
      <ul className="lm-findings lm-findings--draft">
        {findingIds.map((f) => {
          const ev = linkedEvidence(f);
          return (
            <li key={f}>
              <span aria-hidden="true" className="lm-check" data-on={draftFindings[f] || undefined} />
              <span className="lm-finding-text">
                <FindingTag t={t} id={f} /> {t.verdict.f[f]}
              </span>
              <span className="lm-pins" data-none={!ev.length || undefined}>
                {ev.length ? (
                  <>
                    {fill(t.verdict.linked, { n: ev.length })}:{" "}
                    {ev.map((id) => (
                      <V key={id} className="lm-evchip">
                        {id}
                      </V>
                    ))}
                  </>
                ) : (
                  t.verdict.noLinked
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="lm-gate">
        <span aria-hidden="true" className="lm-gate-mark" />
        {t.verdict.gate}
      </p>
      <div className="lm-m-stepnav">
        <a className="lm-btn lm-btn--ghost lm-btn--tall" href="?view=verdict">
          {t.verdict.back}
        </a>
        <span className="lm-btn lm-btn--solid lm-btn--tall">{t.verdict.next}</span>
      </div>
    </>
  );
}

function DebriefScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.debrief.title} back="verdict" pinned={11} />
      <DebriefBody t={t} level={2} />
      <div className="lm-m-stepnav">
        <a className="lm-btn lm-btn--ghost lm-btn--tall" href="?view=logs">
          {t.debrief.revise}
        </a>
        <span className="lm-btn lm-btn--solid lm-btn--tall">{t.debrief.report}</span>
      </div>
    </>
  );
}

export function MobileFlow({ t, view }: { t: Copy; view: MobileView }) {
  const stage = stageOf(view);
  const pinned = view === "event" ? 6 : stageState[stage].pinned;
  return (
    <div className="lm-mobile" data-view={view}>
      <div className="lm-m-screen">
        {view === "briefing" ? (
          <BriefingScreen t={t} />
        ) : view === "queue" ? (
          <QueueScreen t={t} stage={stage} />
        ) : view === "logs" ? (
          <LogsScreen t={t} pinned={pinned} />
        ) : view === "filters" ? (
          <FiltersSheet t={t} />
        ) : view === "event" ? (
          <EventSheet t={t} />
        ) : view === "entities" ? (
          <EntitiesScreen t={t} />
        ) : view === "entity" ? (
          <EntityScreen t={t} />
        ) : view === "evidence" ? (
          <EvidenceScreen t={t} />
        ) : view === "verdict" ? (
          <VerdictStep1 t={t} />
        ) : view === "findings" ? (
          <VerdictStep3 t={t} />
        ) : (
          <DebriefScreen t={t} />
        )}
      </div>
      {view === "briefing" ? null : <TabBar t={t} view={view} pinned={pinned} />}
    </div>
  );
}
