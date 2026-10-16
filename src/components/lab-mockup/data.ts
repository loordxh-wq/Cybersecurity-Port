/**
 * M1 mockup data: a consistent slice of the synthetic SOC-01 dataset described in
 * docs/phase3-soc-lab-proposal.md §3. Fictional organisation (northwind.example),
 * RFC 5737 documentation addresses only, fictional accounts. Static, for review.
 */

export type AlertId = "ALR-0418" | "ALR-0419" | "ALR-0417" | "ALR-0420";
export type Severity = "high" | "medium" | "low";

export const alerts: { id: AlertId; severity: Severity; entity: string; fired: string; status: "new" | "review" | "closed" }[] = [
  { id: "ALR-0418", severity: "high", entity: "j.morgan · JMP01", fired: "02:15", status: "review" },
  { id: "ALR-0419", severity: "medium", entity: "203.0.113.45", fired: "02:16", status: "new" },
  { id: "ALR-0417", severity: "medium", entity: "svc-backup", fired: "00:01", status: "closed" },
  { id: "ALR-0420", severity: "low", entity: "n.katz · WS-0117", fired: "08:43", status: "new" },
];

export type LogEvent = {
  id: string;
  time: string; // HH:MM:SS.mmm, UTC, 11 Mar 2026 unless `date` is set
  date?: string;
  eventId: 4624 | 4625 | 4740;
  user: string;
  ip: string;
  computer: string;
  client: string;
  logonType: 2 | 3 | 4 | 5 | 7 | 10;
  auth: "NTLM" | "Kerberos";
  sub?: string;
};

const spray = (time: string, user: string, sub: string, n: number): LogEvent => ({
  id: `e-${String(180 + n).padStart(4, "0")}`,
  time,
  eventId: 4625,
  user,
  ip: "203.0.113.45",
  computer: "JMP01",
  client: "DESKTOP-7Q2M4",
  logonType: 3,
  auth: "NTLM",
  sub,
});

const BAD = "0xC000006A";
const NOUSER = "0xC0000064";

/** Result of the query `ip:203.0.113.45`: 17 failures and 2 successes, oldest first. */
export const results: LogEvent[] = [
  spray("02:10:05.318", "administrator", NOUSER, 1),
  spray("02:10:29.044", "admin", NOUSER, 2),
  spray("02:10:53.771", "a.haddad", BAD, 3),
  spray("02:11:17.209", "b.levi", BAD, 4),
  spray("02:11:41.836", "c.nguyen", BAD, 5),
  spray("02:12:05.402", "test", NOUSER, 6),
  spray("02:12:29.117", "d.romano", BAD, 7),
  spray("02:12:53.650", "e.shapiro", BAD, 8),
  spray("02:13:17.093", "f.mansour", BAD, 9),
  spray("02:13:41.528", "g.weber", BAD, 10),
  spray("02:14:05.842", "k.ahmed", BAD, 11),
  spray("02:14:21.090", "l.ortiz", BAD, 12),
  { id: "e-0193", time: "02:14:37.412", eventId: 4624, user: "j.morgan", ip: "203.0.113.45", computer: "JMP01", client: "DESKTOP-7Q2M4", logonType: 3, auth: "NTLM" },
  { id: "e-0194", time: "02:14:52.706", eventId: 4624, user: "j.morgan", ip: "203.0.113.45", computer: "JMP01", client: "DESKTOP-7Q2M4", logonType: 10, auth: "NTLM" },
  spray("02:15:01.377", "h.tanaka", BAD, 15),
  spray("02:15:26.960", "scanner", NOUSER, 16),
  spray("02:15:50.214", "i.costa", BAD, 17),
  spray("02:16:15.588", "m.dahan", BAD, 18),
  spray("02:16:40.031", "backup", NOUSER, 19),
];

export const selectedId = "e-0193";
export const totalEvents = 482;

/** Events per minute, 01:45–02:44 UTC: [other events, matching failures, matching successes]. */
export const histogram: [number, number, number][] = Array.from({ length: 60 }, (_, i) => {
  const minute = 105 + i; // minutes after midnight
  const other = minute === 120 ? 3 : (i * 7) % 5 === 0 ? 1 : (i * 3) % 11 === 0 ? 1 : 0; // svc-backup retries at 02:00, service logons
  const perMinute: Record<number, [number, number]> = { 130: [3, 0], 131: [2, 0], 132: [3, 0], 133: [2, 0], 134: [2, 2], 135: [3, 0], 136: [2, 0] };
  const [fail, ok] = perMinute[minute] ?? [0, 0];
  return [other, fail, ok];
});
export const brush: [number, number] = [24, 33]; // 02:09–02:18

export const facets = {
  event: [
    ["4625", 17],
    ["4624", 2],
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

/** Pinned evidence, in time order. `kind` marks what the visitor recorded it as. */
export const pins: { id: string; day: "d10" | "d11"; time: string; eventId: 4624 | 4625; user: string; ip: string; host: string; auth: "NTLM" | "Kerberos"; type: 3 | 10; extra?: string; note: "baseline" | "first" | "pattern" | "success" | "rdp" | "lateral" | "second" }[] = [
  { id: "e-0071", day: "d10", time: "16:58:12.204", eventId: 4624, user: "j.morgan", ip: "198.51.100.142", host: "SRV-FILE01", auth: "Kerberos", type: 3, extra: "WS-0142", note: "baseline" },
  { id: "e-0181", day: "d11", time: "02:10:05.318", eventId: 4625, user: "administrator", ip: "203.0.113.45", host: "JMP01", auth: "NTLM", type: 3, extra: "0xC0000064", note: "first" },
  { id: "e-0192", day: "d11", time: "02:14:21.090", eventId: 4625, user: "l.ortiz", ip: "203.0.113.45", host: "JMP01", auth: "NTLM", type: 3, extra: "0xC000006A", note: "pattern" },
  { id: "e-0193", day: "d11", time: "02:14:37.412", eventId: 4624, user: "j.morgan", ip: "203.0.113.45", host: "JMP01", auth: "NTLM", type: 3, extra: "DESKTOP-7Q2M4", note: "success" },
  { id: "e-0194", day: "d11", time: "02:14:52.706", eventId: 4624, user: "j.morgan", ip: "203.0.113.45", host: "JMP01", auth: "NTLM", type: 10, note: "rdp" },
  { id: "e-0201", day: "d11", time: "02:21:13.559", eventId: 4624, user: "j.morgan", ip: "198.51.100.10", host: "SRV-FILE01", auth: "NTLM", type: 3, extra: "JMP01", note: "lateral" },
  { id: "e-0214", day: "d11", time: "02:31:08.775", eventId: 4625, user: "o.peretz", ip: "203.0.113.77", host: "JMP01", auth: "NTLM", type: 3, extra: "DESKTOP-7Q2M4", note: "second" },
];

export const hypotheses: { id: "h1" | "h2" | "h3"; status: "supported" | "unconfirmed" | "undetermined"; evidence: string[] }[] = [
  { id: "h1", status: "supported", evidence: ["e-0181", "e-0192", "e-0193", "e-0194"] },
  { id: "h2", status: "unconfirmed", evidence: ["e-0214"] },
  { id: "h3", status: "undetermined", evidence: ["e-0201"] },
];

export type Disposition = "tp" | "misconfig" | "expected" | "fp";
export const dispositions: Record<AlertId, Disposition> = {
  "ALR-0418": "tp",
  "ALR-0419": "tp",
  "ALR-0417": "misconfig",
  "ALR-0420": "expected",
};

/** Observed findings (verifiable in the logs) with the visitor's pinned support. */
export const findings: { id: "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8"; pinned: number; result: "supported" | "partial" | "missed" }[] = [
  { id: "f1", pinned: 2, result: "supported" },
  { id: "f2", pinned: 1, result: "supported" },
  { id: "f3", pinned: 1, result: "partial" },
  { id: "f4", pinned: 1, result: "supported" },
  { id: "f5", pinned: 0, result: "missed" },
  { id: "f6", pinned: 1, result: "supported" },
  { id: "f7", pinned: 2, result: "supported" },
  { id: "f8", pinned: 2, result: "supported" },
];

export const actions: { id: "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7"; checked: boolean }[] = [
  { id: "a1", checked: true },
  { id: "a2", checked: true },
  { id: "a3", checked: true },
  { id: "a4", checked: true },
  { id: "a5", checked: false },
  { id: "a6", checked: true },
  { id: "a7", checked: false },
];
