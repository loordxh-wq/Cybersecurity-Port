import type { CSSProperties } from "react";
import { brush, histogram, results, selected } from "@/components/lab-mockup/data";
import type { SceneProps } from "./MotionStudy";

/**
 * Chapter 2 · Log examination. Static markup; every movement is driven by CSS variables the
 * timeline sets on the study root (--rows, --hlTime, --sel, --insp …), so a frame depends only
 * on the playhead. Technical values are isolated left to right.
 */

const v = (s: string | number) => <bdi dir="ltr">{s}</bdi>;
const idx = (i: number) => ({ "--i": i }) as CSSProperties;

function Histo() {
  const max = 5;
  return (
    <div className="d2-hist" data-cam="d-hist" dir="ltr">
      <div className="d2-bars">
        {histogram.map(([other, fail, ok], i) => (
          <span key={i} style={{ "--bi": i } as CSSProperties}>
            {ok ? <i className="ok" style={{ height: `${(ok / max) * 100}%` }} /> : null}
            {fail ? <i className="fail" style={{ height: `${(fail / max) * 100}%` }} /> : null}
            {other ? <i className="other" style={{ height: `${(other / max) * 100}%` }} /> : null}
          </span>
        ))}
        <b className="d2-brush" style={{ insetInlineStart: `${(brush[0] / 60) * 100}%`, width: `${((brush[1] - brush[0] + 1) / 60) * 100}%` }} />
      </div>
      <div className="d2-ticks">
        {["01:45", "02:00", "02:15", "02:30", "02:45"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function Query({ typed, count, lab, prefix }: Pick<SceneProps, "typed" | "count" | "lab"> & { prefix: "d" | "m" }) {
  return (
    <div className={`ms-query ms-query--${prefix}`} data-cam={`${prefix}-query`}>
      <span className="ms-query-lab">{lab.query}</span>
      <code dir="ltr">
        {typed}
        <span aria-hidden="true" className="ms-caret" />
      </code>
      <span className="ms-query-range" dir="ltr">
        01:45–02:45 UTC
      </span>
      <span className="ms-query-count">{lab.results.replace("19", String(count))}</span>
    </div>
  );
}

function Facets({ lab, prefix }: Pick<SceneProps, "lab"> & { prefix: "d" | "m" }) {
  return (
    <div className="ms-facets" data-cam={`${prefix}-facets`}>
      <span>
        <em>{lab.facets.event}</em> {v("4625 ×17")} · {v("4624 ×2")}
      </span>
      <span>
        <em>{lab.facets.account}</em> {v(18)}
      </span>
      <span>
        <em>{lab.facets.result}</em> {lab.outcome.fail} {v(17)} · {lab.outcome.ok} {v(2)}
      </span>
    </div>
  );
}

const Mark = ({ n, k }: { n: number; k: string }) => (
  <span aria-hidden="true" className="ms-mark" style={{ "--mk": `var(--${k})` } as CSSProperties}>
    {n}
  </span>
);

export function Ch2Desk({ m, lab, typed, count }: SceneProps) {
  return (
    <div className="d2">
      <div className="d2-top" data-cam="d-top">
        <div className="d2-qf">
          <Query typed={typed} count={count} lab={lab} prefix="d" />
          <Facets lab={lab} prefix="d" />
        </div>
        <Histo />
      </div>
      <div className="d2-main">
        <table className="d2-table" data-cam="d-table">
          <thead>
            <tr>
              <th className="c-time" data-cam="d-th-time">
                {lab.cols.time}
              </th>
              <th className="c-evt">{lab.cols.event}</th>
              <th className="c-acct" data-cam="d-th-acct">
                {lab.cols.account}
              </th>
              <th className="c-ip" data-cam="d-th-ip">
                {lab.cols.source}
              </th>
              <th>{lab.cols.type}</th>
              <th>{lab.cols.auth}</th>
              <th className="c-res" data-cam="d-th-res">
                {lab.cols.status}
                <Mark n={1} k="m1" />
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const ok = r.eventId === 4624;
              const id = r.id === "e-0193" ? "d-e0193" : r.id === "e-0194" ? "d-e0194" : undefined;
              return (
                <tr key={r.id} style={idx(i)} data-cam={id} data-ok={ok || undefined} data-key={r.id === "e-0193" ? "sel" : r.id === "e-0194" ? "rdp" : undefined}>
                  <td className="c-time">
                    {v(r.time.slice(0, 8))}
                    <span className="ms-ms">{r.time.slice(8)}</span>
                    {r.id === "e-0194" ? <span className="d2-gap">{v("+15 s")}</span> : null}
                  </td>
                  <td className="c-evt">{v(r.eventId)}</td>
                  <td className="c-acct">{v(r.user)}</td>
                  <td className="c-ip">{v(r.ip)}</td>
                  <td className="c-type">{v(r.logonType)}</td>
                  <td className="c-auth">{v(r.auth)}</td>
                  <td className="c-res">
                    <span className="ms-out" data-ok={ok || undefined}>
                      <span aria-hidden="true">{ok ? "✓" : "✕"}</span>
                      {ok ? lab.outcome.ok : lab.outcome.fail}
                    </span>
                    {r.sub ? <span className="ms-sub">{v(r.sub)}</span> : null}
                    {r.id === "e-0193" ? <Mark n={2} k="m2" /> : null}
                    {r.id === "e-0194" ? <Mark n={3} k="m3" /> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <aside className="d2-insp" data-cam="d-insp">
          <p className="d2-insp-id">{v(`4624 · ${selected.id}`)}</p>
          <p className="d2-insp-name">{lab.eventName}</p>
          <p className="d2-insp-ts">{v(`${selected.ts} UTC`)}</p>
          <dl className="d2-fields">
            <div>
              <dt>{lab.fields.account}</dt>
              <dd>{v("j.morgan")}</dd>
            </div>
            <div>
              <dt>{lab.fields.computer}</dt>
              <dd>{v("JMP01")}</dd>
            </div>
            <div data-f="type">
              <dt>{lab.fields.logonType}</dt>
              <dd>
                {v(3)} · {lab.network}
              </dd>
            </div>
            <div data-f="src">
              <dt>{lab.fields.source}</dt>
              <dd>{v("203.0.113.45")}</dd>
            </div>
            <div>
              <dt>{lab.fields.client}</dt>
              <dd>{v("DESKTOP-7Q2M4")}</dd>
            </div>
            <div data-f="auth">
              <dt>{lab.fields.auth}</dt>
              <dd>{v("NTLM")}</dd>
            </div>
            <div>
              <dt>{lab.fields.process}</dt>
              <dd>{v("NtLmSsp")}</dd>
            </div>
          </dl>
          <BaseCard m={m} />
        </aside>
      </div>
    </div>
  );
}

function BaseCard({ m }: Pick<SceneProps, "m">) {
  return (
    <div className="d2-base" data-cam="d-base">
      <p className="d2-base-head">
        <span>{m.ch2.baseTitle}</span>
        {v("e-0071 · 10 Mar 16:58:12 · SRV-FILE01")}
      </p>
      <Contrast m={m} />
    </div>
  );
}

export function Contrast({ m }: Pick<SceneProps, "m">) {
  const c = m.ch2.contrast;
  return (
    <dl className="ms-contrast">
      <div data-k="1">
        <dt>{c.auth}</dt>
        <dd>
          <span data-now>{v("NTLM")}</span>
          <span aria-hidden="true">≠</span>
          <span>{v("Kerberos")}</span>
        </dd>
      </div>
      <div data-k="2">
        <dt>{c.source}</dt>
        <dd>
          <span data-now>
            {v("203.0.113.45")} {m.ch2.external}
          </span>
          <span aria-hidden="true">≠</span>
          <span>
            {v("198.51.100.142")} {m.ch2.internal}
          </span>
        </dd>
      </div>
      <div data-k="3">
        <dt>{c.time}</dt>
        <dd>
          <span data-now>{v("02:14")}</span>
          <span aria-hidden="true">≠</span>
          <span>{v("12:04–17:34")}</span>
        </dd>
      </div>
    </dl>
  );
}

export function Ch2Mobile({ lab, typed, count }: SceneProps) {
  return (
    <div className="m2">
      <Query typed={typed} count={count} lab={lab} prefix="m" />
      <Facets lab={lab} prefix="m" />
      <ol className="m2-rows">
        {results.map((r, i) => {
          const ok = r.eventId === 4624;
          const id = r.id === "e-0193" ? "m-e0193" : r.id === "e-0194" ? "m-e0194" : `m-r${i}`;
          return (
            <li key={r.id} style={idx(i)} data-cam={id} data-ok={ok || undefined} data-key={r.id === "e-0193" ? "sel" : r.id === "e-0194" ? "rdp" : undefined}>
              <span className="m2-l1">
                <span className="c-time">
                  {v(r.time.slice(0, 8))}
                  <span className="ms-ms">{r.time.slice(8)}</span>
                </span>
                <span className="c-evt">{v(r.eventId)}</span>
                <span className="c-res ms-out" data-ok={ok || undefined}>
                  <span aria-hidden="true">{ok ? "✓" : "✕"}</span>
                  {ok ? lab.outcome.ok : lab.outcome.fail}
                </span>
                {r.id === "e-0194" ? <span className="d2-gap">{v("+15 s")}</span> : null}
              </span>
              <span className="m2-l2">
                <span className="c-acct">{v(r.user)}</span>
                <span className="c-ip">{v(r.ip)}</span>
                {r.sub ? <span className="c-res ms-sub">{v(r.sub)}</span> : <span className="ms-sub">
                    {lab.cols.type} {v(`${r.logonType} · ${r.auth}`)}
                  </span>}
              </span>
              {i === 11 ? <Mark n={1} k="m1" /> : null}
              {r.id === "e-0193" ? <Mark n={2} k="m2" /> : null}
              {r.id === "e-0194" ? <Mark n={3} k="m3" /> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
