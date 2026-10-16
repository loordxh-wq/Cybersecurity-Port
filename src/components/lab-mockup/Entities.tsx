import type { Copy } from "./copy";
import { backgroundCount, entities, hostEdges, relations, selectedEntity, type Entity, type EntityKind, type Relation } from "./data";
import { fill, V } from "./parts";

const kinds: EntityKind[] = ["source", "account", "host"];

/** Display label: technical identifiers stay as data; grouped or annotated nodes get translated words. */
export function entityLabel(t: Copy, e: Entity) {
  if (e.note === "group16") return t.ent.group16;
  if (e.note === "group6") return t.ent.group6;
  return e.label;
}
function entityNote(t: Copy, e: Entity) {
  if (e.note === "inventory") return t.ent.inventory;
  if (e.note === "local") return t.ent.local;
  return null;
}
const byId = (id: string) => entities.find((e) => e.id === id)!;

/** Supporting events as compact, LTR-isolated chips; a range is shown as first … last with a count. */
export function EvidenceChips({ t, rel }: { t: Copy; rel: Relation }) {
  if (!rel.events.length) return <p className="lm-rel-none">{t.ent.noEvents}</p>;
  const isRange = rel.count > rel.events.length;
  return (
    <p className="lm-ev-chips">
      <span className="lm-ev-chips-label">{t.ent.evidence}</span>
      {isRange ? (
        <span className="lm-evchip">
          <V>{`${rel.events[0]} … ${rel.events[1]}`}</V>
          <span className="lm-chip-n">{fill(t.ent.range, { n: rel.count })}</span>
        </span>
      ) : (
        rel.events.map((id) => (
          <span key={id} className="lm-evchip">
            <V>{id}</V>
          </span>
        ))
      )}
    </p>
  );
}

/**
 * Relationship map: sources → accounts → hosts, drawn only from events in the alert
 * window. Edge colour = outcome, width = event count; the dashed arc is a shared
 * attribute (indicator), never attribution. Diagram geometry stays left-to-right in
 * every language (like the histogram); the table and detail panel follow the reading
 * direction and are the accessible equivalent.
 */
export function EntityGraph({ t, compact = false }: { t: Copy; compact?: boolean }) {
  const x = { source: 96, account: 330, host: 556 } as const;
  const y = { s45: 54, s77: 150, s10: 214, sbk: 268, ajm: 34, aad: 96, a16: 150, a06: 204, asb: 268, hfs: 34, hjm: 128, hbk: 268 } as const satisfies Record<string, number>;
  const pos = (id: string) => ({ x: x[byId(id).kind], y: y[id as keyof typeof y] });
  const width = (n: number) => 1.2 + Math.log2(n + 1) * 1.1;
  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2;
    return `M${a.x + 56} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 56} ${b.y}`;
  };
  const sel = selectedEntity;
  const observed = relations.filter((r) => r.kind === "observed");
  return (
    <figure className="lm-graph" data-compact={compact || undefined}>
      <svg viewBox="0 0 652 300" role="img" aria-label={`${t.ent.viewMap}. ${t.ent.mapNote}`} direction="ltr">
        {kinds.map((k) => (
          <text key={k} x={x[k]} y={12} textAnchor="middle" className="lm-g-col">
            {t.ent.groups[k]}
          </text>
        ))}
        {observed.map((r) => {
          const active = r.from === sel || r.to === sel;
          return <path key={r.id} d={curve(pos(r.from), pos(r.to))} className="lm-g-edge" data-outcome={r.outcome} data-dim={!active || undefined} strokeWidth={width(r.count)} fill="none" />;
        })}
        {hostEdges.map((h) => (
          <path key={h.from + h.to} d={curve(pos(h.from), pos(h.to))} className="lm-g-edge" data-outcome={h.outcome} data-dim={(h.from !== "ajm" && h.from !== "aad" && h.from !== "a16") || undefined} strokeWidth={width(h.count)} fill="none" />
        ))}
        {/* asset inventory: 198.51.100.10 is JMP01's internal address */}
        <path d={`M${x.source + 52} ${y.s10} C 470 ${y.s10 + 26}, 520 ${y.hjm + 70}, ${x.host} ${y.hjm + 14}`} className="lm-g-enrich" fill="none" />
        {/* shared attribute between the two external sources: indicator only */}
        <path d={`M${x.source - 52} ${y.s45 + 6} C 6 ${y.s45 + 30}, 6 ${y.s77 - 30}, ${x.source - 52} ${y.s77 - 6}`} className="lm-g-indicator" fill="none" />
        {entities.map((e) => {
          const p = pos(e.id);
          return (
            <g key={e.id} className="lm-g-node" data-kind={e.kind} data-selected={e.id === sel || undefined} data-ok={e.ok > 0 || undefined}>
              <rect x={p.x - 56} y={p.y - 13} width={112} height={26} rx={2} />
              <text x={p.x} y={p.y + 4} textAnchor="middle">
                {entityLabel(t, e)}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="lm-graph-cap">
        <span>
          <i className="lm-key lm-key-ok" aria-hidden="true" />
          {t.ent.legend.ok}
        </span>
        <span>
          <i className="lm-key lm-key-fail" aria-hidden="true" />
          {t.ent.legend.fail}
        </span>
        <span>
          <i className="lm-key lm-key-ind" aria-hidden="true" />
          {t.ent.legend.indicator}
        </span>
        <span className="lm-graph-note">{t.ent.mapNote}</span>
      </figcaption>
    </figure>
  );
}

export function EntityTable({ t }: { t: Copy }) {
  return (
    <div className="lm-table-wrap">
      <table className="lm-table lm-ent-table">
        <thead>
          <tr>
            <th scope="col">{t.ent.cols.entity}</th>
            <th scope="col">{t.ent.cols.events}</th>
            <th scope="col">{t.ent.cols.fail}</th>
            <th scope="col">{t.ent.cols.ok}</th>
            <th scope="col">{t.ent.cols.first}</th>
            <th scope="col">{t.ent.cols.last}</th>
          </tr>
        </thead>
        {kinds.map((k) => (
          <tbody key={k}>
            <tr className="lm-ent-group">
              <th scope="rowgroup" colSpan={6}>
                {t.ent.groups[k]}
              </th>
            </tr>
            {entities
              .filter((e) => e.kind === k)
              .map((e) => (
                <tr key={e.id} aria-selected={e.id === selectedEntity || undefined}>
                  <th scope="row">
                    {e.note === "group16" || e.note === "group6" ? entityLabel(t, e) : <V>{e.label}</V>}
                    {entityNote(t, e) ? <span className="lm-ent-note"> · {entityNote(t, e)}</span> : null}
                  </th>
                  <td>
                    <V>{e.events}</V>
                  </td>
                  <td className="lm-num-fail">
                    <V>{e.fail}</V>
                  </td>
                  <td className="lm-num-ok">
                    <V>{e.ok}</V>
                  </td>
                  <td>
                    <V>{e.first}</V>
                  </td>
                  <td>
                    <V>{e.last}</V>
                  </td>
                </tr>
              ))}
          </tbody>
        ))}
      </table>
      <p className="lm-col-hint lm-pad">{fill(t.ent.background, { n: backgroundCount })}</p>
    </div>
  );
}

/** Relationships of the selected entity, grouped by how they are known. */
export function EntityDetail({ t }: { t: Copy }) {
  const e = byId(selectedEntity);
  const rels = relations.filter((r) => r.from === e.id || r.to === e.id);
  const groups = (["observed", "indicator"] as const).map((k) => [k, rels.filter((r) => r.kind === k)] as const);
  return (
    <div className="lm-ent-detail">
      <div className="lm-insp-head">
        <p className="lm-label">{t.ent.groups.source}</p>
        <h2 className="lm-ent-title">
          <V>{e.label}</V>
        </h2>
      </div>
      <dl className="lm-ent-facts">
        <div>
          <dt>{t.ent.facts.events}</dt>
          <dd>
            <V>{e.events}</V>
          </dd>
        </div>
        <div>
          <dt>{t.ent.facts.accounts}</dt>
          <dd>
            <V>18</V>
          </dd>
        </div>
        <div>
          <dt>{t.ent.facts.hosts}</dt>
          <dd>
            <V>1</V>
          </dd>
        </div>
        <div>
          <dt>{t.ent.facts.first}</dt>
          <dd>
            <V>{e.first}</V>
          </dd>
        </div>
        <div>
          <dt>{t.ent.facts.last}</dt>
          <dd>
            <V>{e.last}</V>
          </dd>
        </div>
      </dl>
      <h3 className="lm-ent-sub">{t.ent.relTitle}</h3>
      {groups.map(([k, list]) => (
        <section key={k} className="lm-rel-group" data-kind={k} aria-label={t.ent.kind[k]}>
          <p className="lm-rel-kind">{t.ent.kind[k]}</p>
          {k === "indicator" ? <p className="lm-rel-warn">{t.ent.indicatorNote}</p> : null}
          <ul className="lm-rels">
            {list.map((r) => {
              const other = byId(r.from === e.id ? r.to : r.from);
              return (
                <li key={r.id} className="lm-rel" data-kind={r.kind} data-outcome={r.outcome}>
                  <p className="lm-rel-title">
                    {r.outcome ? <span aria-hidden="true" className="lm-rel-glyph">{r.outcome === "ok" ? "✓" : "✕"}</span> : null}
                    {t.ent.rel[r.id]}
                  </p>
                  <p className="lm-rel-meta">
                    <V>{e.label}</V> {r.kind === "indicator" ? "↔" : "→"} {other.note === "group16" || other.note === "group6" ? entityLabel(t, other) : <V>{other.label}</V>}
                    {r.kind === "observed" ? (
                      <>
                        {" "}
                        · <V>{r.count}</V>
                      </>
                    ) : null}
                  </p>
                  <EvidenceChips t={t} rel={r} />
                  {r.kind === "observed" ? <span className="lm-link">{t.ent.open}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Mobile list: entity cards grouped by type. */
export function EntityCards({ t }: { t: Copy }) {
  return (
    <>
      {kinds.map((k) => (
        <section key={k} aria-labelledby={`lm-eg-${k}`}>
          <h2 id={`lm-eg-${k}`} className="lm-m-h">
            {t.ent.groups[k]}
          </h2>
          <ul className="lm-m-ents">
            {entities
              .filter((e) => e.kind === k)
              .map((e) => (
                <li key={e.id}>
                  <a href={e.id === selectedEntity ? "?view=entity" : undefined} className="lm-m-ent" aria-current={e.id === selectedEntity || undefined}>
                    <span className="lm-m-ent-top">
                      <span className="lm-m-ent-name">{e.note === "group16" || e.note === "group6" ? entityLabel(t, e) : <V>{e.label}</V>}</span>
                      <V className="lm-m-ent-n">{e.events}</V>
                    </span>
                    {entityNote(t, e) ? <span className="lm-ent-note">{entityNote(t, e)}</span> : null}
                    <span className="lm-m-ent-bar" aria-hidden="true">
                      <i className="lm-bar-f" style={{ flexGrow: e.fail }} />
                      <i className="lm-bar-s" style={{ flexGrow: e.ok }} />
                    </span>
                    <span className="lm-m-ent-meta">
                      <span>
                        <span aria-hidden="true">✕</span> {t.ent.cols.fail} <V>{e.fail}</V>
                      </span>
                      <span>
                        <span aria-hidden="true">✓</span> {t.ent.cols.ok} <V>{e.ok}</V>
                      </span>
                      <V>{e.first === e.last ? e.first : `${e.first}–${e.last}`}</V>
                    </span>
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ))}
      <p className="lm-col-hint">{fill(t.ent.background, { n: backgroundCount })}</p>
    </>
  );
}
