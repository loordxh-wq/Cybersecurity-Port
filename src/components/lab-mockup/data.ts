/**
 * M1.1 mockup data: a consistent slice of the synthetic SOC-01 dataset described in
 * docs/phase3-soc-lab-proposal.md §3 (audited in §11). Fictional organisation
 * (northwind.example), RFC 5737 documentation addresses only, fictional accounts.
 * Static, for review; tests/unit/lab-mockup-data.test.mjs checks its consistency.
 */

export type AlertId = "ALR-0418" | "ALR-0419" | "ALR-0417" | "ALR-0420";
export type Severity = "high" | "medium" | "low";
export type AlertStatus = "new" | "review" | "closed";

export const alerts: { id: AlertId; severity: Severity; entity: string; fired: string }[] = [
  { id: "ALR-0418", severity: "high", entity: "j.morgan · JMP01", fired: "02:15" },
  { id: "ALR-0419", severity: "medium", entity: "203.0.113.45", fired: "02:16" },
  { id: "ALR-0417", severity: "medium", entity: "svc-backup", fired: "00:01" },
  { id: "ALR-0420", severity: "low", entity: "n.katz · WS-0117", fired: "08:43" },
];

/**
 * The visitor's progress in each mockup screen. In the real lab every number here is
 * derived from the investigation state (pins the visitor made), never hard-coded.
 */
export type Stage = "fresh" | "progress" | "submitted";
export const stageState: Record<Stage, { pinned: number; statuses: Record<AlertId, AlertStatus>; closed: number }> = {
  fresh: { pinned: 0, statuses: { "ALR-0418": "new", "ALR-0419": "new", "ALR-0417": "new", "ALR-0420": "new" }, closed: 0 },
  progress: { pinned: 7, statuses: { "ALR-0418": "review", "ALR-0419": "review", "ALR-0417": "new", "ALR-0420": "new" }, closed: 0 },
  submitted: { pinned: 11, statuses: { "ALR-0418": "closed", "ALR-0419": "closed", "ALR-0417": "closed", "ALR-0420": "closed" }, closed: 4 },
};

export type LogEvent = {
  id: string;
  time: string; // HH:MM:SS.mmm UTC, 11 Mar 2026
  eventId: 4624 | 4625 | 4740;
  user: string;
  ip: string;
  computer: string;
  client: string;
  logonType: 2 | 3 | 4 | 5 | 7 | 10;
  auth: "NTLM" | "Kerberos" | "Negotiate";
  status?: string;
  sub?: string;
};

const BAD = "0xC000006A"; // SubStatus: wrong password (Status 0xC000006D)
const NOUSER = "0xC0000064"; // SubStatus: user name does not exist (Status 0xC000006D)

const attempt = (id: number, time: string, user: string, sub: string, ip = "203.0.113.45"): LogEvent => ({
  id: `e-${String(id).padStart(4, "0")}`,
  time,
  eventId: 4625,
  user,
  ip,
  computer: "JMP01",
  client: "DESKTOP-7Q2M4",
  logonType: 3,
  auth: "NTLM",
  status: "0xC000006D",
  sub,
});

/** Result of the query `ip:203.0.113.45`: 17 failures and 2 successes, oldest first. */
export const results: LogEvent[] = [
  attempt(181, "02:10:05.318", "administrator", NOUSER),
  attempt(182, "02:10:29.044", "admin", NOUSER),
  attempt(183, "02:10:53.771", "a.haddad", BAD),
  attempt(184, "02:11:17.209", "b.levi", BAD),
  attempt(185, "02:11:41.836", "c.nguyen", BAD),
  attempt(186, "02:12:05.402", "test", NOUSER),
  attempt(187, "02:12:29.117", "d.romano", BAD),
  attempt(188, "02:12:53.650", "e.shapiro", BAD),
  attempt(189, "02:13:17.093", "f.mansour", BAD),
  attempt(190, "02:13:41.528", "g.weber", BAD),
  attempt(191, "02:14:05.842", "k.ahmed", BAD),
  attempt(192, "02:14:21.090", "l.ortiz", BAD),
  { id: "e-0193", time: "02:14:37.412", eventId: 4624, user: "j.morgan", ip: "203.0.113.45", computer: "JMP01", client: "DESKTOP-7Q2M4", logonType: 3, auth: "NTLM" },
  // RDP session logon after NLA: logon type 10 is recorded with Negotiate / User32.
  { id: "e-0194", time: "02:14:52.706", eventId: 4624, user: "j.morgan", ip: "203.0.113.45", computer: "JMP01", client: "DESKTOP-7Q2M4", logonType: 10, auth: "Negotiate" },
  attempt(195, "02:15:01.377", "h.tanaka", BAD),
  attempt(196, "02:15:26.960", "scanner", NOUSER),
  attempt(197, "02:15:50.214", "i.costa", BAD),
  attempt(198, "02:16:15.588", "m.dahan", BAD),
  attempt(199, "02:16:40.031", "backup", NOUSER),
];

/** Other events in the alert window that the entity view draws on. */
export const windowEvents: LogEvent[] = [
  // svc-backup's scheduled job, account already locked out at 00:00:33 (batch logon has no source IP)
  { id: "e-0176", time: "02:00:00.412", eventId: 4625, user: "svc-backup", ip: "-", computer: "SRV-BKP01", client: "SRV-BKP01", logonType: 4, auth: "Negotiate", status: "0xC0000234", sub: "0x0" },
  { id: "e-0177", time: "02:00:12.097", eventId: 4625, user: "svc-backup", ip: "-", computer: "SRV-BKP01", client: "SRV-BKP01", logonType: 4, auth: "Negotiate", status: "0xC0000234", sub: "0x0" },
  { id: "e-0178", time: "02:00:24.530", eventId: 4625, user: "svc-backup", ip: "-", computer: "SRV-BKP01", client: "SRV-BKP01", logonType: 4, auth: "Negotiate", status: "0xC0000234", sub: "0x0" },
  // From the RDP session on JMP01 to the file server: Kerberos (domain-joined host), no workstation name recorded
  { id: "e-0201", time: "02:21:13.559", eventId: 4624, user: "j.morgan", ip: "198.51.100.10", computer: "SRV-FILE01", client: "-", logonType: 3, auth: "Kerberos" },
  attempt(214, "02:31:08.775", "o.peretz", BAD, "203.0.113.77"),
  attempt(215, "02:31:33.120", "p.silva", BAD, "203.0.113.77"),
  attempt(216, "02:31:57.904", "q.hassan", BAD, "203.0.113.77"),
  attempt(217, "02:32:22.316", "administrator", NOUSER, "203.0.113.77"),
  attempt(218, "02:32:46.551", "r.klein", BAD, "203.0.113.77"),
  attempt(219, "02:33:10.087", "s.moreau", BAD, "203.0.113.77"),
  attempt(220, "02:34:02.643", "t.yamamoto", BAD, "203.0.113.77"),
];

export const selectedId = "e-0193";
export const totalEvents = 482;

const minuteOf = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
/** Service logons by machine accounts in the window (background, not drawn as entities). */
const backgroundMinutes = [105, 110, 115, 116, 125, 126, 137, 140, 145, 148, 155, 158, 160, 162];

/** Events per minute, 01:45–02:44 UTC: [other events, matching failures, matching successes]. */
export const histogram: [number, number, number][] = Array.from({ length: 60 }, (_, i) => {
  const minute = 105 + i;
  const other = backgroundMinutes.filter((m) => m === minute).length + windowEvents.filter((e) => minuteOf(e.time) === minute).length;
  const fail = results.filter((e) => e.eventId === 4625 && minuteOf(e.time) === minute).length;
  const ok = results.filter((e) => e.eventId === 4624 && minuteOf(e.time) === minute).length;
  return [other, fail, ok];
});
export const backgroundCount = backgroundMinutes.length;
export const brush: [number, number] = [24, 33]; // 02:09–02:18

export const facets = {
  event: [
    ["4625", 17],
    ["4624", 2],
  ],
  result: [
    ["failure", 17],
    ["success", 2],
  ],
  account: [
    ["j.morgan", 2],
    ["administrator", 1],
    ["admin", 1],
    ["+15", 15],
  ],
  type: [
    ["3", 18],
    ["10", 1],
  ],
  sub: [
    [BAD, 12],
    [NOUSER, 5],
  ],
} as const;

/** The selected event (e-0193) as the inspector shows it. */
export const selected = {
  id: "e-0193",
  ts: "2026-03-11 02:14:37.412",
  eventId: 4624 as const,
  fields: [
    ["account", "j.morgan"],
    ["domain", "NORTHWIND"],
    ["computer", "JMP01.northwind.example"],
    ["logonType", "3"],
    ["source", "203.0.113.45"],
    ["port", "50461"],
    ["client", "DESKTOP-7Q2M4"],
    ["auth", "NTLM"],
    ["process", "NtLmSsp"],
    ["logonId", "0x3E7A21C"],
    ["elevated", "No"],
  ] as const,
};

/* ------------------------------------------------------------------ entities */

export type EntityKind = "source" | "account" | "host";
export type Entity = { id: string; kind: EntityKind; label: string; events: number; fail: number; ok: number; first: string; last: string; note?: "inventory" | "local" | "group16" | "group6" };

/** Entities in the alert window (01:45–02:45 UTC), derived from results + windowEvents. */
export const entities: Entity[] = [
  { id: "s45", kind: "source", label: "203.0.113.45", events: 19, fail: 17, ok: 2, first: "02:10:05", last: "02:16:40" },
  { id: "s77", kind: "source", label: "203.0.113.77", events: 7, fail: 7, ok: 0, first: "02:31:08", last: "02:34:02" },
  { id: "s10", kind: "source", label: "198.51.100.10", events: 1, fail: 0, ok: 1, first: "02:21:13", last: "02:21:13", note: "inventory" },
  { id: "sbk", kind: "source", label: "SRV-BKP01", events: 3, fail: 3, ok: 0, first: "02:00:00", last: "02:00:24", note: "local" },
  { id: "ajm", kind: "account", label: "j.morgan", events: 3, fail: 0, ok: 3, first: "02:14:37", last: "02:21:13" },
  { id: "aad", kind: "account", label: "administrator", events: 2, fail: 2, ok: 0, first: "02:10:05", last: "02:32:22" },
  { id: "a16", kind: "account", label: "16", events: 16, fail: 16, ok: 0, first: "02:10:29", last: "02:16:40", note: "group16" },
  { id: "a06", kind: "account", label: "6", events: 6, fail: 6, ok: 0, first: "02:31:08", last: "02:34:02", note: "group6" },
  { id: "asb", kind: "account", label: "svc-backup", events: 3, fail: 3, ok: 0, first: "02:00:00", last: "02:00:24" },
  { id: "hjm", kind: "host", label: "JMP01", events: 26, fail: 24, ok: 2, first: "02:10:05", last: "02:34:02" },
  { id: "hfs", kind: "host", label: "SRV-FILE01", events: 1, fail: 0, ok: 1, first: "02:21:13", last: "02:21:13" },
  { id: "hbk", kind: "host", label: "SRV-BKP01", events: 3, fail: 3, ok: 0, first: "02:00:00", last: "02:00:24" },
];

/**
 * Relationships. "observed": an authentication recorded in the events listed.
 * "enrichment": from the scenario's asset inventory. "indicator": a shared attribute,
 * shown as a possible link only, never as attribution.
 */
export type Relation = { id: "r1" | "r2" | "r3" | "r4" | "r5" | "r6" | "r7" | "r8" | "r9" | "r10"; kind: "observed" | "enrichment" | "indicator"; from: string; to: string; outcome?: "ok" | "fail"; count: number; events: string[] };
export const relations: Relation[] = [
  { id: "r1", kind: "observed", from: "s45", to: "ajm", outcome: "ok", count: 2, events: ["e-0193", "e-0194"] },
  { id: "r2", kind: "observed", from: "s45", to: "a16", outcome: "fail", count: 16, events: ["e-0182", "e-0199"] },
  { id: "r3", kind: "observed", from: "s45", to: "aad", outcome: "fail", count: 1, events: ["e-0181"] },
  { id: "r4", kind: "observed", from: "s77", to: "aad", outcome: "fail", count: 1, events: ["e-0217"] },
  { id: "r5", kind: "observed", from: "s77", to: "a06", outcome: "fail", count: 6, events: ["e-0214", "e-0220"] },
  { id: "r6", kind: "observed", from: "s10", to: "ajm", outcome: "ok", count: 1, events: ["e-0201"] },
  { id: "r7", kind: "observed", from: "sbk", to: "asb", outcome: "fail", count: 3, events: ["e-0176", "e-0178"] },
  { id: "r8", kind: "enrichment", from: "s10", to: "hjm", count: 0, events: [] },
  { id: "r9", kind: "indicator", from: "s45", to: "s77", count: 2, events: ["e-0181", "e-0214"] },
  { id: "r10", kind: "indicator", from: "s45", to: "s77", count: 2, events: ["e-0181", "e-0217"] },
];
/** Account → host edges (target computer of the same events). */
export const hostEdges: { from: string; to: string; outcome: "ok" | "fail"; count: number }[] = [
  { from: "ajm", to: "hjm", outcome: "ok", count: 2 },
  { from: "ajm", to: "hfs", outcome: "ok", count: 1 },
  { from: "aad", to: "hjm", outcome: "fail", count: 2 },
  { from: "a16", to: "hjm", outcome: "fail", count: 16 },
  { from: "a06", to: "hjm", outcome: "fail", count: 6 },
  { from: "asb", to: "hbk", outcome: "fail", count: 3 },
];
export const selectedEntity = "s45";

/* ------------------------------------------------------------------ evidence */

export type PinNote = "baseline" | "first" | "pattern" | "success" | "rdp" | "lateral" | "second";
/** Pinned evidence, in time order (progress stage: 7 pins). `links` are the findings the visitor linked. */
export const pins: { id: string; day: "d10" | "d11"; time: string; eventId: 4624 | 4625; user: string; ip: string; host: string; auth: "NTLM" | "Kerberos" | "Negotiate"; type: 3 | 10; extra?: string; note: PinNote; links: FindingId[] }[] = [
  { id: "e-0071", day: "d10", time: "16:58:12.204", eventId: 4624, user: "j.morgan", ip: "198.51.100.142", host: "SRV-FILE01", auth: "Kerberos", type: 3, note: "baseline", links: [] },
  { id: "e-0181", day: "d11", time: "02:10:05.318", eventId: 4625, user: "administrator", ip: "203.0.113.45", host: "JMP01", auth: "NTLM", type: 3, extra: "0xC0000064", note: "first", links: ["f1"] },
  { id: "e-0192", day: "d11", time: "02:14:21.090", eventId: 4625, user: "l.ortiz", ip: "203.0.113.45", host: "JMP01", auth: "NTLM", type: 3, extra: "0xC000006A", note: "pattern", links: ["f1"] },
  { id: "e-0193", day: "d11", time: "02:14:37.412", eventId: 4624, user: "j.morgan", ip: "203.0.113.45", host: "JMP01", auth: "NTLM", type: 3, extra: "DESKTOP-7Q2M4", note: "success", links: ["f2", "f3"] },
  { id: "e-0194", day: "d11", time: "02:14:52.706", eventId: 4624, user: "j.morgan", ip: "203.0.113.45", host: "JMP01", auth: "Negotiate", type: 10, note: "rdp", links: ["f4"] },
  { id: "e-0201", day: "d11", time: "02:21:13.559", eventId: 4624, user: "j.morgan", ip: "198.51.100.10", host: "SRV-FILE01", auth: "Kerberos", type: 3, note: "lateral", links: [] },
  { id: "e-0214", day: "d11", time: "02:31:08.775", eventId: 4625, user: "o.peretz", ip: "203.0.113.77", host: "JMP01", auth: "NTLM", type: 3, extra: "DESKTOP-7Q2M4", note: "second", links: ["f6"] },
];

/* ------------------------------------------------------------------ verdict */

export type Disposition = "tp" | "misconfig" | "expected" | "fp";
/** What the visitor submitted (debrief stage). Before submission nothing is selected. */
export const submittedDispositions: Record<AlertId, Disposition> = { "ALR-0418": "tp", "ALR-0419": "tp", "ALR-0417": "misconfig", "ALR-0420": "expected" };

export type FindingId = "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8";
export const findingIds: FindingId[] = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"];
/** In-progress verdict (step 3): what the visitor has asserted so far, and the evidence linked to each finding. */
export const draftFindings: Record<FindingId, boolean> = { f1: true, f2: true, f3: true, f4: true, f5: false, f6: true, f7: false, f8: false };
export const linkedEvidence = (f: FindingId) => pins.filter((p) => p.links.includes(f)).map((p) => p.id);

/** Debrief: evaluation of the submitted verdict against the pinned evidence. */
export const findingResults: Record<FindingId, "supported" | "partial" | "missed"> = { f1: "supported", f2: "supported", f3: "partial", f4: "supported", f5: "missed", f6: "supported", f7: "supported", f8: "supported" };

export type HypId = "h1" | "h2" | "h3";
export type HypStatus = "supported" | "unconfirmed" | "undetermined";
export const hypotheses: { id: HypId; expected: HypStatus; submitted: HypStatus }[] = [
  { id: "h1", expected: "supported", submitted: "supported" },
  { id: "h2", expected: "unconfirmed", submitted: "unconfirmed" },
  { id: "h3", expected: "undetermined", submitted: "supported" },
];

export const actionIds = ["a1", "a2", "a3", "a4", "a5", "a6", "a7"] as const;
