// Phase 3 M1.1: the mockup's sample data must be internally consistent and follow the
// accuracy rules audited in docs/phase3-soc-lab-proposal.md §11 before any interactive
// logic is built on it. Imports the TypeScript data directly (Node ≥ 22.18 strips types).
// Run: npm run test:guard
import { test } from "node:test";
import assert from "node:assert/strict";
import * as d from "../../src/components/lab-mockup/data.ts";
import { copyFor } from "../../src/components/lab-mockup/copy.ts";

const allEvents = [...d.results, ...d.windowEvents];
const byId = new Map(allEvents.map((e) => [e.id, e]));
const doc = /^(192\.0\.2|198\.51\.100|203\.0\.113)\.\d{1,3}$/;
const secs = (t) => Number(t.slice(0, 2)) * 3600 + Number(t.slice(3, 5)) * 60 + Number(t.slice(6, 12));

test("only RFC 5737 documentation addresses (or no address) appear anywhere", () => {
  for (const e of allEvents) assert.ok(e.ip === "-" || doc.test(e.ip), `${e.id}: ${e.ip}`);
  for (const p of d.pins) assert.match(p.ip, doc, p.id);
  for (const e of d.entities.filter((x) => x.kind === "source" && x.note !== "local")) assert.match(e.label, doc, e.id);
});

test("the spray: one source, 18 accounts, one attempt each, 02:10:05–02:16:40, 17 failures and 2 successes", () => {
  const fails = d.results.filter((e) => e.eventId === 4625);
  const oks = d.results.filter((e) => e.eventId === 4624);
  assert.equal(fails.length, 17);
  assert.equal(oks.length, 2);
  assert.ok(d.results.every((e) => e.ip === "203.0.113.45" && e.computer === "JMP01"));
  const attempts = d.results.filter((e) => e.logonType === 3);
  assert.equal(new Set(attempts.map((e) => e.user)).size, 18, "18 distinct accounts");
  assert.equal(attempts.length, 18, "one network attempt per account");
  assert.equal(secs(d.results.at(-1).time) - secs(d.results[0].time) > 394, true);
  const times = d.results.map((e) => secs(e.time));
  assert.deepEqual(times, [...times].sort((a, b) => a - b), "results sorted oldest first");
});

test("Windows semantics: status codes, logon types and authentication packages", () => {
  for (const e of allEvents.filter((x) => x.eventId === 4625)) {
    if (e.status === "0xC0000234") assert.equal(e.sub, "0x0", `${e.id}: locked-out logons carry SubStatus 0x0`);
    else {
      assert.equal(e.status, "0xC000006D", `${e.id}: logon failure status`);
      assert.ok(["0xC000006A", "0xC0000064"].includes(e.sub), `${e.id}: sub-status`);
    }
  }
  const rdp = byId.get("e-0194");
  assert.equal(rdp.logonType, 10);
  assert.equal(rdp.auth, "Negotiate", "RDP session logon (type 10) is recorded with Negotiate");
  assert.ok(secs(rdp.time) - secs(byId.get("e-0193").time) <= 30, "type 10 follows the NLA network logon within 30 s");
  const lateral = byId.get("e-0201");
  assert.equal(lateral.auth, "Kerberos", "domain-joined JMP01 → SRV-FILE01 uses Kerberos");
  assert.equal(lateral.client, "-", "Kerberos network logons record no workstation name");
  assert.ok(d.windowEvents.filter((e) => e.user === "svc-backup").every((e) => e.logonType === 4 && e.ip === "-"), "batch logons: type 4, no source address");
  assert.equal(d.facets.sub.reduce((n, [, c]) => n + c, 0), 17);
  assert.equal(d.results.filter((e) => e.sub === "0xC0000064").length, d.facets.sub.find(([k]) => k === "0xC0000064")[1]);
});

test("histogram and selected range agree with the events", () => {
  const sum = (i) => d.histogram.reduce((n, b) => n + b[i], 0);
  assert.equal(sum(1), 17);
  assert.equal(sum(2), 2);
  assert.equal(sum(0), d.backgroundCount + d.windowEvents.length);
  const minuteIdx = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5)) - 105;
  for (const e of d.results) assert.ok(minuteIdx(e.time) >= d.brush[0] && minuteIdx(e.time) < d.brush[1], `${e.id} inside 02:09–02:18`);
});

test("entity counts are derived from the events in the window", () => {
  const ent = Object.fromEntries(d.entities.map((e) => [e.id, e]));
  const from = (ip) => allEvents.filter((e) => e.ip === ip);
  assert.equal(ent.s45.events, from("203.0.113.45").length);
  assert.equal(ent.s77.events, from("203.0.113.77").length);
  assert.equal(ent.hjm.events, allEvents.filter((e) => e.computer === "JMP01").length);
  assert.equal(ent.hjm.ok, allEvents.filter((e) => e.computer === "JMP01" && e.eventId === 4624).length);
  assert.equal(ent.ajm.events, allEvents.filter((e) => e.user === "j.morgan").length);
  assert.equal(ent.aad.events, allEvents.filter((e) => e.user === "administrator").length);
  const others45 = new Set(from("203.0.113.45").map((e) => e.user).filter((u) => u !== "j.morgan" && u !== "administrator"));
  const others77 = new Set(from("203.0.113.77").map((e) => e.user).filter((u) => u !== "administrator"));
  assert.equal(ent.a16.events, others45.size);
  assert.equal(ent.a06.events, others77.size);
});

test("every relationship links back to supporting events; indicators are never attribution", () => {
  for (const r of d.relations) {
    for (const id of r.events) assert.ok(byId.has(id), `${r.id}: ${id} exists`);
    if (r.kind === "observed") assert.ok(r.events.length > 0, `${r.id}: observed relations cite events`);
    if (r.kind === "indicator") {
      const ips = new Set(r.events.map((id) => byId.get(id).ip));
      assert.deepEqual([...ips].sort(), ["203.0.113.45", "203.0.113.77"], `${r.id}: cites one event from each source`);
    }
  }
  const h2 = d.hypotheses.find((h) => h.id === "h2");
  assert.equal(h2.expected, "unconfirmed", "a shared client name and neighbouring address do not confirm a common actor");
  assert.equal(d.hypotheses.find((h) => h.id === "h3").expected, "undetermined", "authentication logs cannot show file access");
});

test("evidence: pins exist, links point to real findings, counts match the progress state", () => {
  for (const p of d.pins) {
    assert.ok(byId.has(p.id) || p.note === "baseline", `${p.id} is a dataset event`);
    for (const f of p.links) assert.ok(d.findingIds.includes(f), `${p.id} → ${f}`);
  }
  assert.equal(d.stageState.fresh.pinned, 0, "a new investigation starts with no evidence");
  assert.equal(d.stageState.progress.pinned, d.pins.length);
  for (const f of d.findingIds) for (const id of d.linkedEvidence(f)) assert.ok(d.pins.some((p) => p.id === id));
});

test("copy: three locales with the same debrief structure; notes and answers only in the debrief block", () => {
  const { en, he, ar } = copyFor;
  for (const c of [he, ar]) {
    assert.equal(c.debrief.notes.length, en.debrief.notes.length);
    assert.equal(c.brief.objectives.length, en.brief.objectives.length);
    assert.deepEqual(Object.keys(c.ent.rel), Object.keys(en.ent.rel));
  }
  for (const c of [en, he, ar]) {
    assert.ok(!JSON.stringify(c.tl.h).includes("5140"), "no lab-written hypothesis rationale before submission");
    assert.ok(!/j\.morgan|203\.0\.113/.test(c.brief.mission + c.brief.objectives.join(" ")), "the briefing reveals no answer or scope");
  }
});
