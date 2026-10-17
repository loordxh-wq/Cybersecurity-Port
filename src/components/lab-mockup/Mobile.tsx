import { SimLabel } from "@/components/cc/SimTag";
import type { Copy } from "./copy";
import { alerts, draftFindings, findingIds, linkedEvidence, results, selectedId, stageState, type Stage } from "./data";
import { BriefingBody, DebriefBody, dispOrder, FilterChips, FindingTag, InspectorBody, ObservedList, stageOf, Stepper, WorkingHypotheses } from "./Desktop";
import { EntityCards, EntityDetail, EntityGraph } from "./Entities";
import { fill, Histogram, Outcome, Sev, V } from "./parts";

export type MobileView =
  | "briefing"
  | "queue"
  | "logs"
  | "filters"
  | "event"
  | "event-pinned"
  | "event-linked"
  | "unpin"
  | "entities"
  | "entity"
  | "map"
  | "evidence"
  | "evidence-empty"
  | "verdict"
  | "findings"
  | "debrief";

/** Review-strip label for each screen: which example state the static mockup shows. */
export const mobileState: Record<MobileView, keyof Copy["m12"]["state"]> = {
  briefing: "initial",
  queue: "initial",
  logs: "returned",
  filters: "example",
  event: "beforePin",
  "event-pinned": "justPinned",
  "event-linked": "linked",
  unpin: "confirmUnpin",
  entities: "example",
  entity: "example",
  map: "map",
  evidence: "example",
  "evidence-empty": "empty",
  verdict: "example",
  findings: "example",
  debrief: "submitted",
};

const bar = [
  ["queue", "alerts"],
  ["logs", "logs"],
  ["entities", "entities"],
  ["evidence", "evidence"],
  ["verdict", "verdict"],
] as const;
const tabOf = (v: MobileView) => (v === "briefing" ? null : v === "queue" ? "queue" : v.startsWith("event") || v === "filters" || v === "unpin" || v === "logs" ? "logs" : v === "entity" || v === "map" || v === "entities" ? "entities" : v.startsWith("evidence") ? "evidence" : "verdict");
const pinnedFor = (v: MobileView, stage: Stage) => (v === "event" ? 6 : v === "evidence-empty" ? 0 : stageState[stage].pinned);

function TabBar({ t, view, pinned }: { t: Copy; view: MobileView; pinned: number }) {
  const active = tabOf(view);
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

/** One compact row: back, simulation label over the screen title, and the pin counter. */
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
      <span className="lm-m-pins" role="img" aria-label={fill(t.ev.count, { n: pinned })}>
        <span aria-hidden="true">◆</span> <V>{pinned}</V>
      </span>
    </div>
  );
}

const Intro = ({ children }: { children: string }) => <p className="lm-m-intro">{children}</p>;

function NextStep({ label, href }: { label: string; href: string }) {
  return (
    <a className="lm-btn lm-btn--wide lm-btn--tall lm-m-next" href={href}>
      {label}
      <span aria-hidden="true" className="lm-arrow">
        →
      </span>
    </a>
  );
}

function BriefingScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.brief.title} pinned={0} />
      <p className="lm-m-shift">
        <V>SOC-01</V> · {t.shift}
      </p>
      <BriefingBody t={t} level={2} />
      <details className="lm-m-ref">
        <summary>{t.m12.reference}</summary>
        <ul>
          {(["e4624", "e4625", "lt3", "lt10"] as const).map((k) => (
            <li key={k}>
              <p className="lm-m-ref-title">{t.m12.learn[k].title}</p>
              <p>{t.m12.learn[k].body}</p>
            </li>
          ))}
        </ul>
        <p className="lm-learn-src">{t.m12.learnSource}</p>
      </details>
      <NextStep label={t.brief.start} href="?view=queue" />
    </>
  );
}

function QueueScreen({ t, stage }: { t: Copy; stage: Stage }) {
  const statuses = stageState[stage].statuses;
  return (
    <>
      <TopBar t={t} title={t.queue.title} pinned={stageState[stage].pinned} />
      <div className="lm-m-row">
        <Intro>{t.m12.intro.queue}</Intro>
        <a className="lm-link" href="?view=briefing">
          {t.briefingBtn}
        </a>
      </div>
      <p className="lm-m-shift">
        {t.queue.sorted} · {t.shift}
      </p>
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

function LogCards({ t, lastViewed }: { t: Copy; lastViewed?: boolean }) {
  return (
    <ol className="lm-m-cards">
      {results.slice(9, 16).map((e) => (
        <li key={e.id}>
          <a href="?view=event" className="lm-m-card" data-ok={e.eventId === 4624 || undefined} aria-current={lastViewed && e.id === selectedId ? "true" : undefined}>
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
            {lastViewed && e.id === selectedId ? <span className="lm-m-lastviewed">{t.m12.lastViewed}</span> : null}
          </a>
        </li>
      ))}
    </ol>
  );
}

function LogsScreen({ t, pinned, lastViewed = false }: { t: Copy; pinned: number; lastViewed?: boolean }) {
  return (
    <>
      <TopBar t={t} title={`${t.logs.title} · ALR-0418`} back="queue" pinned={pinned} />
      <Intro>{t.m12.intro.logs}</Intro>
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
      <LogCards t={t} lastViewed={lastViewed} />
      <p className="lm-m-more">{t.mobile.viewAll}</p>
    </>
  );
}

function FiltersSheet({ t }: { t: Copy }) {
  return (
    <div className="lm-m-sheet-layer">
      <div className="lm-m-under" aria-hidden="true" inert>
        <LogsScreen t={t} pinned={7} />
      </div>
      <div className="lm-m-scrim" aria-hidden="true" />
      <section className="lm-m-sheet lm-m-sheet--form" role="dialog" aria-modal="true" aria-labelledby="lm-m-flt-title">
        <span aria-hidden="true" className="lm-m-grab" />
        <div className="lm-m-sheet-head">
          <h2 id="lm-m-flt-title" className="lm-m-title">
            {t.flt.title}
          </h2>
          <span className="lm-link">{t.flt.clear}</span>
          <a className="lm-m-iconbtn" href="?view=logs" aria-label={t.m12.nav.close} autoFocus>
            <span aria-hidden="true">×</span>
          </a>
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
          <a className="lm-btn lm-btn--wide lm-btn--solid lm-btn--tall" href="?view=logs">
            {t.flt.apply}
          </a>
        </div>
      </section>
    </div>
  );
}

type PinState = "before" | "pinned" | "linked" | "unpin";

function SheetNav({ t }: { t: Copy }) {
  const pos = results.findIndex((e) => e.id === selectedId) + 1;
  return (
    <div className="lm-m-sheetnav">
      <a className="lm-m-textbtn" href="?view=logs">
        <span aria-hidden="true" className="lm-arrow-back">
          ‹
        </span>{" "}
        {t.m12.nav.results}
      </a>
      <span className="lm-m-pos">{fill(t.m12.nav.pos, { i: pos, n: results.length })}</span>
      <span className="lm-m-navbtns">
        <a className="lm-m-iconbtn" href="?view=event" aria-label={t.m12.nav.prev}>
          <span aria-hidden="true">▲</span>
        </a>
        <a className="lm-m-iconbtn" href="?view=event" aria-label={t.m12.nav.next}>
          <span aria-hidden="true">▼</span>
        </a>
        <a className="lm-m-iconbtn" href="?view=logs" aria-label={t.m12.nav.close} autoFocus>
          <span aria-hidden="true">×</span>
        </a>
      </span>
    </div>
  );
}

function PinFooter({ t, state }: { t: Copy; state: PinState }) {
  if (state === "before")
    return (
      <div className="lm-m-sheet-foot">
        <a className="lm-btn lm-btn--wide lm-btn--tall lm-pinbtn" href="?view=event-pinned">
          <span aria-hidden="true">◇</span> {t.insp.pin}
        </a>
        <p className="lm-col-hint lm-center-text">{fill(t.ev.count, { n: 6 })}</p>
      </div>
    );
  return (
    <div className="lm-m-sheet-foot">
      {state === "pinned" ? (
        <p className="lm-toast" role="status">
          <span aria-hidden="true" className="lm-toast-mark">
            ◆
          </span>
          <span>{fill(t.m12.toastPinned, { n: 7 })}</span>
          <a className="lm-toast-undo" href="?view=event">
            {t.m12.undo}
          </a>
        </p>
      ) : null}
      <div className="lm-pinrow lm-pinrow--m">
        <span className="lm-pinstate">
          <span aria-hidden="true">◆</span> {t.insp.pinnedState}
        </span>
        {state !== "pinned" ? (
          <span className="lm-pin-links">
            {t.m12.linkedTo} <FindingTag t={t} id="f2" /> <FindingTag t={t} id="f3" />
          </span>
        ) : null}
        <a className="lm-btn lm-btn--ghost lm-btn--tall" href={state === "pinned" ? "?view=event" : "?view=unpin"}>
          {t.insp.unpin}
        </a>
      </div>
    </div>
  );
}

function EventSheet({ t, state }: { t: Copy; state: PinState }) {
  return (
    <div className="lm-m-sheet-layer">
      <div className="lm-m-under" aria-hidden="true" inert>
        <LogsScreen t={t} pinned={state === "before" ? 6 : 7} />
      </div>
      <div className="lm-m-scrim" aria-hidden="true" />
      <section className="lm-m-sheet" role="dialog" aria-modal="true" aria-labelledby="lm-m-sheet-title" inert={state === "unpin" || undefined}>
        <span aria-hidden="true" className="lm-m-grab" />
        <h2 id="lm-m-sheet-title" className="sr-only">
          {t.insp.title}
        </h2>
        <SheetNav t={t} />
        <div className="lm-m-sheet-body" tabIndex={0} aria-label={t.insp.title}>
          <InspectorBody t={t} />
        </div>
        <PinFooter t={t} state={state} />
      </section>
      {state === "unpin" ? (
        <section className="lm-m-confirm" role="alertdialog" aria-modal="true" aria-labelledby="lm-m-unpin-title" aria-describedby="lm-m-unpin-body">
          <h2 id="lm-m-unpin-title" className="lm-m-title">
            {t.m12.unpinTitle}
          </h2>
          <p id="lm-m-unpin-body">{fill(t.m12.unpinBody, { id: selectedId, f: "F2, F3" })}</p>
          <div className="lm-m-confirm-actions">
            <a className="lm-btn lm-btn--solid lm-btn--tall" href="?view=event-linked" autoFocus>
              {t.m12.keep}
            </a>
            <a className="lm-btn lm-btn--tall lm-btn--danger" href="?view=event">
              {t.m12.unpinConfirm}
            </a>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EntitiesScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.ent.title} pinned={7} />
      <Intro>{t.m12.intro.entities}</Intro>
      <p className="lm-m-shift">
        <V>{t.ent.scope}</V>
      </p>
      <a className="lm-btn lm-btn--wide lm-btn--tall" href="?view=map">
        {t.ent.viewMap}
      </a>
      <EntityCards t={t} />
    </>
  );
}

function MapScreen({ t }: { t: Copy }) {
  return (
    <div className="lm-m-sheet-layer">
      <div className="lm-m-under" aria-hidden="true" inert>
        <EntitiesScreen t={t} />
      </div>
      <div className="lm-m-scrim" aria-hidden="true" />
      <section className="lm-m-sheet lm-m-sheet--map" role="dialog" aria-modal="true" aria-labelledby="lm-m-map-title">
        <span aria-hidden="true" className="lm-m-grab" />
        <div className="lm-m-sheet-head">
          <h2 id="lm-m-map-title" className="lm-m-title">
            {t.m12.mapTitle}
          </h2>
          <a className="lm-m-iconbtn" href="?view=entities" aria-label={t.m12.nav.close} autoFocus>
            <span aria-hidden="true">×</span>
          </a>
        </div>
        <div className="lm-m-sheet-body">
          <p className="lm-col-hint lm-pad">{t.m12.mapHint}</p>
          <div className="lm-m-mapscroll" tabIndex={0} role="region" aria-label={t.m12.mapTitle}>
            <EntityGraph t={t} />
          </div>
        </div>
      </section>
    </div>
  );
}

function EntityScreen({ t }: { t: Copy }) {
  return (
    <>
      <TopBar t={t} title={t.ent.title} back="entities" pinned={7} />
      <Intro>{t.m12.intro.entity}</Intro>
      <EntityDetail t={t} />
    </>
  );
}

function EvidenceScreen({ t, empty }: { t: Copy; empty: boolean }) {
  return (
    <>
      <TopBar t={t} title={t.ev.title} pinned={empty ? 0 : 7} />
      <Intro>{t.m12.intro.evidence}</Intro>
      <p className="lm-m-shift">
        {fill(t.ev.count, { n: empty ? 0 : 7 })} · {t.ev.countNote}
      </p>
      {empty ? (
        <div className="lm-m-empty">
          <span aria-hidden="true" className="lm-m-empty-mark">
            ◇
          </span>
          <p>{t.ev.empty}</p>
          <a className="lm-btn lm-btn--tall" href="?view=logs">
            {t.tabs.logs}
          </a>
        </div>
      ) : (
        <>
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
          <NextStep label={t.m12.goVerdict} href="?view=verdict" />
        </>
      )}
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
  const pinned = pinnedFor(view, stage);
  const screen = (() => {
    switch (view) {
      case "briefing":
        return <BriefingScreen t={t} />;
      case "queue":
        return <QueueScreen t={t} stage={stage} />;
      case "logs":
        return <LogsScreen t={t} pinned={pinned} lastViewed />;
      case "filters":
        return <FiltersSheet t={t} />;
      case "event":
        return <EventSheet t={t} state="before" />;
      case "event-pinned":
        return <EventSheet t={t} state="pinned" />;
      case "event-linked":
        return <EventSheet t={t} state="linked" />;
      case "unpin":
        return <EventSheet t={t} state="unpin" />;
      case "entities":
        return <EntitiesScreen t={t} />;
      case "entity":
        return <EntityScreen t={t} />;
      case "map":
        return <MapScreen t={t} />;
      case "evidence":
        return <EvidenceScreen t={t} empty={false} />;
      case "evidence-empty":
        return <EvidenceScreen t={t} empty />;
      case "verdict":
        return <VerdictStep1 t={t} />;
      case "findings":
        return <VerdictStep3 t={t} />;
      default:
        return <DebriefScreen t={t} />;
    }
  })();
  return (
    <div className="lm-mobile" data-view={view}>
      <div className="lm-m-screen">{screen}</div>
      {view === "briefing" ? null : <TabBar t={t} view={view} pinned={pinned} />}
    </div>
  );
}
