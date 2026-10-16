# Phase 3: Interactive SOC Investigation Lab — architecture and visual proposal

Status: **direction approved (M0). M1 visual mockups in review (§10). No Phase 3 lab code has been written.**
Branch: `proposal/phase3-soc-lab` (from `feature/case-files-cf01-03` at `94a4ca3`). Phase 1 and Phase 2 code is unchanged.
Rules carried over:
- Fully synthetic data. Every IP comes from the documentation ranges, every account and host is fictional, and there are no personal data or credentials.
- The lab is labelled once, clearly, as an **Interactive Training Simulation**. It is never presented as a real incident or as employment experience.
- EN/HE/AR with full RTL. Preview-only until Eli approves. No production deployment without explicit approval.

Contents:
1. Product architecture
2. User journey
3. Scenario SOC-01
4. Desktop interface
5. Mobile interface
6. Component and data architecture
7. Milestones and acceptance criteria
8. Risks and limitations
9. Decisions for Eli

---

## 1. Product architecture

### 1.1 What it is

A browser-only SOC analyst workspace. The visitor picks an alert from a queue, investigates the underlying Windows authentication logs, builds an evidence timeline, correlates entities, maps the activity to MITRE ATT&CK, and submits a verdict with reasoning. The lab then explains, claim by claim, which parts of the reasoning the pinned evidence supports. It produces a one-page investigation report that can be printed or saved as PDF.

What it demonstrates about Eli:
- He can design an investigation, not just describe one.
- The dataset, the noise and the decoys mirror real SOC triage: most alerts are not attacks, and the work is telling them apart.
- He understands Windows authentication telemetry (event IDs 4624, 4625 and 4740, logon types, NTLM vs Kerberos, status codes).

It is labelled as Eli's **personal project** (the evidence type already used in the recruiter brief), not as work experience.

### 1.2 Principles

| Principle | Consequence |
| --- | --- |
| Functional, not decorative | Every chart is computed from the dataset and filters the logs when used: an event histogram with brushing, and an entity graph whose nodes are pivots. There are no random numbers, live counters or "threat maps". |
| Evidence over answers | A verdict is judged by the evidence pinned to support it, not by picking the right option. |
| Realistic ambiguity | Two of the four alerts are benign. Failed logons alone are never treated as malicious. |
| Honest scope | The dataset holds authentication logs only. The model answer says what cannot be concluded from them, for example which files were accessed. |
| No backend | Everything runs in the visitor's browser. Nothing they type or choose is sent anywhere. |
| One identity | Cyber Command V4.1 tokens, type and hairline language. The workspace is a denser register of the same system, not a new theme. |

### 1.3 Where it lives

| Route | Content |
| --- | --- |
| `/{locale}/lab` | Lab index: what the simulation is, how it works (four lines), and scenario cards. SOC-01 is available; future scenarios appear only once built. |
| `/{locale}/lab/soc-01` | The investigation workspace. |
| `/{locale}/lab/soc-01?view=report` | The printable summary report, built from the visitor's own investigation state. |

These match the `/{locale}/lab` route reserved in the Phase 2 plan. The home page's "SOC investigation lab" placeholder card (`projects.items.socLab`) links here once the lab is approved.

**Visibility.**
- **Gate:** the lab uses the existing build-stage gate. It is visible in the protected preview only, until Eli approves it.
- **Production lock:** it holds as is. With `VERCEL_ENV=production` the stage is always public, so an unapproved lab cannot appear in production.
- **Content record:** a `labs.json` content record (status `placeholder` / `draft` / `approved`) plays the same role `case-files.json` plays for Case Files. The nav item, sitemap entry and home-card link appear only for an approved lab.

---

## 2. User journey

### 2.1 Personas

- **Recruiter (2 minutes).** Lands from the recruiter brief or home card. Reads the lab index, opens SOC-01, sees a credible workspace, skims the report preview, and leaves knowing what Eli built. No investigation required.
- **Hiring manager or SOC lead (10–20 minutes).** Runs the investigation, judges the realism of the data and the quality of the debrief.
- **Peer or learner.** Plays it as an exercise.

### 2.2 Journey

```
Lab index ──► Briefing ──► Alert queue ──► Investigate ──► Verdict ──► Debrief ──► Report
              (30 s)        (choose)        (logs, inspector,          (claims vs    (print / PDF)
                                             entities, timeline,        evidence)
                                             MITRE context)
```

1. **Lab index.**
   - Header: "Interactive Training Simulation" with the amber sim mark, the single label for the whole lab.
   - One paragraph on what the visitor will do, and one card: *SOC-01 — Suspicious Windows Login Activity*, with difficulty, estimated time (15 min) and the data in scope ("Windows Security log: 4624, 4625, 4740").
2. **Briefing** (first open of SOC-01 only; dismissible, and re-openable from the header):
   - the fictional organisation and its environment (four facts);
   - the analyst's shift ("You start your morning shift at 08:00 UTC. Four alerts fired overnight.");
   - how the workspace works (three numbered hints).
3. **Alert queue.** Four alerts with severity, rule name, entity, time and status (New / In review / Closed). Opening an alert scopes the Log Explorer to it: its time window, its entities and a pre-filled query the visitor can edit.
4. **Investigate.**
   - **Log Explorer:** query, facets and histogram brushing.
   - **Event Inspector:** fields, the raw XML-style record, and "related events" pivots.
   - **Entities:** IPs, accounts and hosts, with a correlation graph and a table alternative.
   - **Timeline:** events the visitor pins as evidence, with a note on each.
   - **MITRE context:** techniques the visitor tags, with what each would look like in these logs.
5. **Verdict.** For each alert, a disposition:
   - *True positive (malicious)*;
   - *Benign — expected activity*;
   - *Benign — misconfiguration*;
   - *False positive (rule logic)*.

   Related alerts can be linked into one incident. For the incident the visitor adds:
   - **claims**, chosen from structured statements such as "One external source tried many accounts with one attempt each", each linked to pinned evidence;
   - **scope**: affected accounts, sources and hosts;
   - **recommended actions** (multi-select);
   - **free-text reasoning**, never scored and never sent anywhere.
6. **Debrief.**
   - Per alert: the expected disposition and why.
   - Per claim: whether the visitor's pinned evidence supports it, with the qualifying events named.
   - What the visitor missed.
   - What the logs cannot tell us.
   - The model analyst notes, written by Eli and approved by him.

   The visitor can return and revise; nothing is locked.
7. **Report.** A one-page summary of the visitor's investigation:
   - alerts and dispositions;
   - incident summary, timeline and entities;
   - MITRE techniques and recommended actions;
   - the simulation label and the line "Scenario designed by Eli Saad".

   Print-optimised, with Latin digits and per-language layout.

Progress is kept in `sessionStorage` (per tab, cleared with "Reset investigation"), so a refresh does not lose work. Nothing persists beyond the tab.

---

## 3. Scenario SOC-01 — Suspicious Windows Login Activity

### 3.1 Setting (all fictional)

| Item | Value |
| --- | --- |
| Organisation | Northwind Analytics, domain `NORTHWIND`, DNS `northwind.example` (`.example` is reserved) |
| Internal network | `198.51.100.0/24` (RFC 5737 documentation range, used as the "internal" subnet in the story) |
| External sources | `203.0.113.0/24` (RFC 5737) |
| Hosts | `DC01` (198.51.100.2), `JMP01` jump host with RDP published to the internet by mistake (external 192.0.2.10, internal 198.51.100.10), `SRV-FILE01` (198.51.100.21), `SRV-BKP01` (198.51.100.20), workstations `WS-0101`…`WS-0160` (198.51.100.101–160) |
| Accounts | ~30 fictional users (`first-initial.surname`, generic names), `svc-backup`, `adm-it01`; non-existent names that attackers try: `administrator`, `admin`, `test`, `scanner`, `backup` |
| Time span | 10 Mar 2026 12:00 → 11 Mar 2026 09:00 UTC (21 h), so j.morgan's working-hours baseline on 10 Mar is inside the data. All times shown in UTC, labelled. |
| Volume | ≈ 480 events: ≈ 410 background (normal logons, screen unlocks, service logons) and ≈ 70 story events |

### 3.2 The story behind the data

Four threads are interleaved. Only one is an attack.

**Thread A — stale service credential (benign: misconfiguration).**
- Context: the alert enrichment shows change ticket `CHG-2291`, which rotated the `svc-backup` password on 10 Mar at 17:30.
- From 18:00, `SRV-BKP01`'s scheduled job logs **4625**:
  - logon type 4 (batch), `Status 0xC000006D`, `SubStatus 0xC000006A` (bad password);
  - three attempts at each hourly run.
- At the 00:00 run, the job's retry policy fires six attempts within 40 s. **4740** "account locked out" on `DC01` at 00:00:41.
- Later attempts fail with `Status 0xC0000234` (account locked out; SubStatus `0x0`).
- **Alert ALR-0417 (Medium, 00:01): "Account lockout — svc-backup".**
- Expected disposition: *Benign — misconfiguration*.
- Evidence: a single internal source, a fixed schedule, batch logon type, starting right after the rotation.
- Action: update the stored credential (ticket), unlock the account. No compromise.

**Thread B — password spray from the internet (malicious).**
- 02:10:05–02:16:40, source **`203.0.113.45`**, against `JMP01` (RDP with NLA, so failures appear as **4625** logon type 3, NTLM):
  - 18 different account names, **one attempt each**, about 20 s apart;
  - `SubStatus 0xC000006A` for real accounts and `0xC0000064` (no such user) for `administrator`, `admin`, `test`, `scanner` and `backup`;
  - workstation name **`DESKTOP-7Q2M4`**, which doesn't follow Northwind's `WS-` naming.
- At **02:14:37** the attempt against `j.morgan` **succeeds**:
  - **4624** logon type 3, NTLM, from 203.0.113.45;
  - then **4624 logon type 10** (RemoteInteractive) at 02:14:52, an RDP session on `JMP01`.
- At **02:21:13**, **4624** type 3 NTLM for `j.morgan` on **`SRV-FILE01`** from `198.51.100.10` (JMP01's internal address), workstation `JMP01`. This is access from the jump host to the file server.
- 02:31–02:34, a second source **`203.0.113.77`** with the **same workstation name `DESKTOP-7Q2M4`** tries 7 more accounts, all failing.
  - These are **indicators, not proof** of a common actor. The client name is supplied by the connecting device, so it can be a tool default or spoofed. Neighbouring addresses can belong to one hosting provider used by unrelated parties.
  - The scenario treats .77 as **possibly related (unconfirmed)**: blocked as a precaution, kept out of the confirmed scope.
- **Alert ALR-0418 (High, 02:15): "Successful logon after multiple failures — j.morgan on JMP01".**
- **Alert ALR-0419 (Medium, 02:16): "Many accounts failed from one source — 203.0.113.45".**
- Expected:
  - both alerts are *True positive* and belong to **one incident**;
  - the technique is password spraying, not brute force: many accounts, one try each, from one source.

**Thread C — the real j.morgan (baseline).**
- On 10 Mar until 17:34, and again from **07:52** on 11 Mar, `j.morgan` logs on from `WS-0142` (198.51.100.142):
  - **Kerberos**, logon types 2, 3 and 7, office hours.
- This baseline is what makes 02:14 anomalous on four counts at once:
  - time;
  - source (external);
  - auth package (NTLM instead of Kerberos);
  - workstation name.

**Thread D — a mistyped unlock (benign: expected activity).**
- 08:41–08:42, `n.katz` on `WS-0117` logs four **4625** failures:
  - logon type 7 (unlock), `SubStatus 0xC000006A`, local source;
  - then **4624** type 7 at 08:42:30.
- **Alert ALR-0420 (Low, 08:43): "Repeated failed logons — n.katz".**
- Expected disposition: *Benign — expected activity* (user error at their own workstation).
- This is the decoy that tests whether "failures then success" alone is treated as compromise.

**Background noise.** Normal Kerberos logons and unlocks for about 30 users across the span, service logons (type 5), a few single mistyped passwords, and DC01 activity, at realistic densities: quiet at night, a rise from 07:30.

### 3.3 The conclusion the evidence supports

> Password spraying from 203.0.113.45 against the internet-exposed jump host JMP01 (18 accounts, one attempt each, 02:10–02:16 UTC) produced one valid credential: **j.morgan**. The attacker opened an RDP session on JMP01 at 02:14 and authenticated from JMP01 to SRV-FILE01 at 02:21. A second source, 203.0.113.77, made seven failed attempts from 02:31 with the same client name. This suggests a connection but does not prove a common actor, so it is recorded as possibly related, not confirmed. ALR-0418 and ALR-0419 are one incident. ALR-0417 (svc-backup lockout) is an unrelated misconfiguration after a password rotation, and ALR-0420 is a user mistyping their unlock password.
>
> **What these logs cannot show:** what was done on SRV-FILE01 (file access needs 5140/5145 or EDR data), and whether the RDP session is still active (logoff 4634/4647 is not in the dataset). The scope statement must say so.

Expected recommendations:
1. Disable `j.morgan` and reset the password, terminating the sessions on JMP01 and SRV-FILE01.
2. Block 203.0.113.45. Block 203.0.113.77 as a precaution, recorded as unconfirmed.
3. Remove the RDP exposure on JMP01 or put it behind a VPN or gateway with MFA.
4. Review SRV-FILE01 access by `j.morgan` from 02:21 onward with file-audit or EDR data.
5. Check the other 17 sprayed accounts for success elsewhere. There is none in this dataset.
6. svc-backup: update the stored credential (change ticket), unlock the account. No incident.

Over-reactions the debrief flags, without penalty, as unnecessary:
- resetting all 18 sprayed accounts;
- treating n.katz or svc-backup as compromised.

### 3.4 Verdict validation (deterministic, explainable)

**What is scored.**
- **Dispositions:** each alert's disposition is compared with the scenario key.
- **Incident grouping:** ALR-0418 and ALR-0419 linked into one incident, and ALR-0417 and ALR-0420 kept out.
- **Observed facts vs analytical conclusions.** The verdict keeps two kinds of statement apart, and so do the timeline and the report.
  - **Observed facts** are things the logs record, such as "203.0.113.77 made 7 failed attempts with client name DESKTOP-7Q2M4". Each needs at least one pinned event that satisfies its evidence predicate. A fact without supporting evidence is reported as "asserted, not supported".
  - **Analytical conclusions** are hypotheses with a status the visitor chooses: *supported*, *unconfirmed* or *not determinable from these logs*. They are judged on whether the chosen status matches the evidence. A conclusion marked stronger than the evidence allows (for example "203.0.113.77 is the same actor: confirmed") is reported as **overstated**.

| Claim (visitor selects) | Supported by pinned events matching |
| --- | --- |
| One external source tried many accounts with one attempt each | ≥ 5 events with `event=4625` and `ip=203.0.113.45`, with ≥ 5 distinct users |
| The spray produced a successful logon | `4624` with `ip=203.0.113.45` (user `j.morgan`) |
| The successful logon is anomalous for this user | the 02:14 `4624`, plus any baseline `4624` for `j.morgan` from `WS-0142` |
| The attacker obtained an interactive session | `4624` with `logonType=10` on `JMP01` |
| The account was used to reach another host | `4624` on `SRV-FILE01` with `ip=198.51.100.10` |
| A second source made failed attempts with the same client name *(observed fact)* | any `4625` from `203.0.113.77` |
| The svc-backup lockout follows a password change | `4740` for `svc-backup`, plus any batch `4625` from `SRV-BKP01` |
| The n.katz failures are user error | `4625` type 7 from `WS-0117`, plus the `4624` type 7 that follows |

| Analytical conclusion | Expected status, and why |
| --- | --- |
| H1 j.morgan's password was guessed during the spray | *Supported*: failures across 18 accounts, then a success for j.morgan from the same source in the same window |
| H2 203.0.113.77 is operated by the same actor as 203.0.113.45 | *Unconfirmed*: shared client name, same /24, same target and pattern are indicators only. "Confirmed" is overstated. |
| H3 Files on SRV-FILE01 were accessed with j.morgan's account | *Not determinable*: the dataset holds authentication only (no 5140/5145 or endpoint data) |

**Scope and actions.**
- Affected accounts, sources and hosts are compared as sets, in two groups: **confirmed** and **possibly related (unconfirmed)**. 203.0.113.77 belongs in the second group.
- Recommended actions are matched against expected, optional and unnecessary lists.

**Feedback, not a grade.**
- The debrief shows a checklist: supported / partly supported / missed / overstated.
- One summary line, e.g. "6 of 8 findings supported by evidence".
- The visitor can revise and resubmit any number of times.

**Integrity.** The scenario key lives in the client bundle, which is unavoidable without a backend, so a determined visitor can read it. That is acceptable for a training simulation, and the key is loaded only when the visitor submits.

### 3.5 Event schema and sample

```ts
type WinAuthEvent = {
  id: string;              // "e-0187" (stable, used by pins, URLs and tests)
  ts: string;              // ISO 8601 UTC, "2026-03-11T02:14:37.412Z"
  eventId: 4624 | 4625 | 4740;
  channel: "Security";
  computer: string;        // "JMP01.northwind.example"
  targetUser: string;      // "j.morgan"
  targetDomain: string;    // "NORTHWIND"
  logonType?: 2 | 3 | 4 | 5 | 7 | 10 | 11;
  ip?: string;             // RFC 5737 only (guarded)
  port?: number;
  workstation?: string;    // client-reported name, e.g. "DESKTOP-7Q2M4"
  authPackage?: "Kerberos" | "NTLM" | "Negotiate";
  logonProcess?: string;   // "NtLmSsp", "Kerberos", "User32", "Advapi"
  status?: string;         // 4625: "0xC000006D" (logon failure) | "0xC0000234" (account locked out)
  subStatus?: string;      // 4625: "0xC000006A" | "0xC0000064" | "0x0" (with status 0xC0000234, locked out) | …
  failureReason?: string;  // 4625: "%%2313" rendered as "Unknown user name or bad password."
  logonId?: string;        // 4624: "0x3E7A21C"
  elevated?: boolean;      // 4624: elevated token
  callerComputer?: string; // 4740: "SRV-BKP01"
};
```

Sample (story events):

```json
{ "id": "e-0201", "ts": "2026-03-11T02:14:21.090Z", "eventId": 4625, "channel": "Security",
  "computer": "JMP01.northwind.example", "targetUser": "l.ortiz", "targetDomain": "NORTHWIND",
  "logonType": 3, "ip": "203.0.113.45", "port": 50433, "workstation": "DESKTOP-7Q2M4",
  "authPackage": "NTLM", "logonProcess": "NtLmSsp", "status": "0xC000006D", "subStatus": "0xC000006A",
  "failureReason": "Unknown user name or bad password." }
{ "id": "e-0202", "ts": "2026-03-11T02:14:37.412Z", "eventId": 4624, "channel": "Security",
  "computer": "JMP01.northwind.example", "targetUser": "j.morgan", "targetDomain": "NORTHWIND",
  "logonType": 3, "ip": "203.0.113.45", "port": 50461, "workstation": "DESKTOP-7Q2M4",
  "authPackage": "NTLM", "logonProcess": "NtLmSsp", "logonId": "0x3E7A21C", "elevated": false }
```

**How the dataset is produced.**
- `scripts/soc-lab/generate-soc01.mjs` builds it deterministically: story events written by hand plus seeded background noise, so the same seed always gives the same file.
- The generated `events.json` is committed, so reviewers can read the exact data.
- A consistency suite (§6.6) proves the story holds: every claim's predicate matches, decoys exist, the baseline exists, and there are no impossible sequences.

---

## 4. Desktop interface (≥ 1180 px)

### 4.1 Layout

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ ELI SAAD   (site header, compact)                                    EN HE AR  Brief  │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ ▢ Interactive Training Simulation · SOC-01 Suspicious Windows Login Activity          │
│   Shift 11 Mar 08:00 UTC     Pinned 6   Alerts 1/4 closed   [Briefing] [Verdict →]    │
├──────────────┬────────────────────────────────────────────────┬───────────────────────┤
│ ALERT QUEUE  │ LOG EXPLORER                                   │ EVENT INSPECTOR       │
│ ■ High       │ [ ip:203.0.113.45 event:4625              ⌕ ]  │ 4625 · Failed logon   │
│ ALR-0418     │ Facets: event 4625 ×17 · 4624 ×2 │ user (18) … │ 02:14:21.090 UTC      │
│ j.morgan     │ ▁▁▁▂▁▁▁▁▁▁▁▃█▅▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▂▃  (histogram,   │ ── Fields ─ Raw ─ ↔ ─ │
│ 02:15 · New  │                                    brushable)  │ Account   l.ortiz     │
│──────────────│ Time (UTC)    ID   User      Source IP    Type │ Source    203.0.113.45│
│ ■ Med        │ 02:14:05.8   4625 k.ahmed   203.0.113.45  3   │ Workst.   DESKTOP-7Q2M4│
│ ALR-0419     │ 02:14:21.0   4625 l.ortiz   203.0.113.45  3 ◀ │ Logon     3 Network   │
│ 203.0.113.45 │ 02:14:37.4   4624 j.morgan  203.0.113.45  3   │ Auth      NTLM        │
│──────────────│ 02:14:52.7   4624 j.morgan  203.0.113.45  10  │ SubStatus 0xC000006A  │
│ ■ Med  0417  │ …                                              │  bad password         │
│ □ Low  0420  │ 19 of 482 events · sorted by time ▲            │ [Pin to timeline  P]  │
├──────────────┴────────────────────────────────────────────────┴───────────────────────┤
│ TIMELINE (pinned)  02:10 ●──●───●●──────●──── 02:21 ●   02:31 ●     [Entities][MITRE] │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

- **Three columns:**
  - queue: 16 rem, collapsible to an icon rail;
  - explorer: fluid;
  - inspector: 22 rem.
- **Bottom dock:** the investigation timeline, resizable.
- **Workspace tabs** above the explorer: *Logs* · *Entities* · *Timeline* (full view) · *MITRE* · *Verdict*. Entities and MITRE replace the centre column. The inspector stays.
- **Height:** the workspace fills the viewport below the header (`100dvh` minus the header). The site footer sits below it.

### 4.2 Visual language (Cyber Command V4.1, workspace register)

- **Surfaces:** `--cc-bg` / `--cc-navy` with 1 px hairline rules (`--cf-rule`). Panels are separated by rules, not cards or shadows. The dossier corner ticks are used only on the workspace frame.
- **Typography:**
  - mono for all log values (IPs, IDs, hex, timestamps), tabular figures;
  - the display face only for the scenario title;
  - 13–14 px table text, 1.45 line height, a 32 px row height for density with legibility.
- **Colour carries meaning only:**
  - **Severity:** High is coral `#ff6b6b` at reduced chroma, Medium amber (the existing `--cf-awaiting`), Low steel.
  - **Event outcome:** 4625 failure in a muted coral text tint; 4624 success in the documented green; 4740 lockout in amber.
  - **Accents:** cyan is reserved for focus, selection and links.
  - **Sim label:** the amber sim mark (`SimLabel`), shown once in the workspace bar.
- **Motion:** 120–180 ms opacity and transform transitions on panel changes and row selection; the histogram brush follows the pointer directly. No looping animation, glow pulses or typing effects. `prefers-reduced-motion` removes transitions.
- **Not used:** neon glows, world maps, fake live tickers, gauge dials, 3D, or decorative charts.

### 4.3 Module details

| Module | Behaviour |
| --- | --- |
| Alert queue | Severity mark, rule name, primary entity, fired time, status. Opening an alert sets the time window (±30 min around the alert) and a starter query, and moves its status to *In review*. Each alert has a "context" disclosure: rule logic in one line, plus enrichment such as `CHG-2291`. |
| Log Explorer | Query bar with syntax (`field:value`, quotes, `-` for exclude, `AND` implicit, `OR`, ranges `time:02:10..02:20`), autocomplete for fields and values, a parse-error message inline. Facet strip: event ID, user, source IP, host, logon type, auth package, sub-status, each with counts; click to add, Alt-click to exclude. Histogram: 5-minute buckets stacked by outcome; drag to set the time range. Table: sortable columns, configurable visible columns, row count, failure rows tinted. |
| Event Inspector | Header: event ID and plain-language name ("An account failed to log on"). **Fields** tab with each field translated into analyst language (logon type 3 → "Network"; 0xC0000064 → "User name does not exist"). **Raw** tab: an XML-style rendering (LTR, copyable). **Related** tab: pivots such as "Other events from this IP", "This user's last 10 logons", "Same workstation name". *Pin to timeline* with an optional note. |
| Entities | IPs, users and hosts derived from the current filter or all data. A bipartite graph (sources → accounts → hosts) laid out deterministically in columns, edge thickness = event count, edge colour = outcome mix. Clicking a node pivots the explorer. A sortable **table view** with the same data (also the accessible alternative): first and last seen, success / failure counts, distinct counterparts. |
| Timeline | Pinned events in time order with notes. Gaps over 10 minutes are compressed and marked. Grouping by alert or incident. Reorder is not allowed (time is the order); notes are editable. |
| MITRE context | A short list of relevant techniques: T1110.003 Password Spraying, T1110.001 Password Guessing, T1078 Valid Accounts, T1021.001 Remote Desktop Protocol, T1133 External Remote Services. Each card gives a summary in our own words, "what it looks like in these logs", and a link to attack.mitre.org (opens externally; attribution shown). The visitor tags techniques to the incident; tags flow into the verdict and report. |
| Verdict | Per-alert disposition (radio group), incident linking (checkboxes), claims (checklist; each shows its pinned support or "no evidence pinned"), scope fields (entity pickers from Entities), actions (checklist), and free-text reasoning (local only). Submit leads to the debrief. |
| Report | A one-page A4/Letter layout: header with the simulation label and scenario, the visitor's dispositions, incident summary (claims supported), compressed timeline, entity table, MITRE tags, actions, and a "what the logs cannot show" section. Print stylesheet; the browser's "Save as PDF". |

---

## 5. Mobile interface (< 760 px): a purpose-built flow

Not the desktop panels shrunk. One task per screen, a persistent progress bar and bottom sheets for detail.

```
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│ ▢ Training simulation│ │ ‹ ALR-0418     ⋯     │ │ ‹ Logs  19 of 482    │ │ Event 4624           │
│ SOC-01               │ │ ■ High · j.morgan    │ │ [ip:203.0.113.45   ⌕]│ │ Successful logon     │
│ Suspicious Windows   │ │ Successful logon     │ │ ⟨4625 ×17⟩⟨4624 ×2⟩ →│ │ 02:14:37.412 UTC     │
│ Login Activity       │ │ after failures       │ │ ▁▂▁▁▃█▅▁▂▁  (brush)  │ │ ──────────────────── │
│                      │ │ Fired 02:15 UTC      │ │ ┌──────────────────┐ │ │ Account  j.morgan    │
│ 4 alerts overnight   │ │ Rule: ≥3 failures    │ │ │02:14:21  4625    │ │ │ Source   203.0.113.45│
│ ┌──────────────────┐ │ │ then 1 success, 10 m │ │ │l.ortiz           │ │ │ Logon    3 · Network │
│ │■ High  ALR-0418  │ │ │                      │ │ │203.0.113.45 · T3 │ │ │ Auth     NTLM        │
│ │j.morgan · 02:15  │ │ │ Start with:          │ │ ├──────────────────┤ │ │ Workst.  DESKTOP-7Q2M4│
│ ├──────────────────┤ │ │ [Logs for this alert]│ │ │02:14:37  4624 ✓  │ │ │ ──────────────────── │
│ │■ Med   ALR-0419  │ │ │ [Entities involved ] │ │ │j.morgan          │ │ │ Related              │
│ │203.0.113.45      │ │ │ [Context: rule, CHG] │ │ │203.0.113.45 · T3 │ │ │ › Same IP (19)       │
│ ├──────────────────┤ │ │                      │ │ └──────────────────┘ │ │ › j.morgan logons    │
│ │□ Low   ALR-0420  │ │ │                      │ │                      │ │                      │
│ └──────────────────┘ │ │                      │ │                      │ │ [ Pin as evidence ]  │
├──────────────────────┤ ├──────────────────────┤ ├──────────────────────┤ ├──────────────────────┤
│ Alerts Logs Entities │ │ Alerts Logs Entities │ │ Alerts Logs Entities │ │   (bottom sheet,     │
│ Timeline(3) Verdict  │ │ Timeline(3) Verdict  │ │ Timeline(3) Verdict  │ │    swipe to close)   │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘
    1 Queue                  2 Alert brief            3 Logs (cards)           4 Event sheet
```

- **Step navigation:** a bottom tab bar (*Alerts · Logs · Entities · Timeline · Verdict*) with a pinned-evidence count. Each step is a URL state (`?view=logs`), so the iOS back gesture works.
- **Logs as cards, not a table.**
  - Each row is a two-line card: time and event ID on top, then the user, and source IP with logon type.
  - Facets are horizontally scrollable chips.
  - The query bar collapses into a search field; a filter sheet holds the facets.
- **Event detail in a bottom sheet:**
  - at half height it shows key fields; full height shows raw and related;
  - "Pin as evidence" is a full-width button within thumb reach;
  - the sheet respects safe areas.
- **Entities** on mobile is the table view, grouped by type and sorted by event count. The graph is available as a "View map" sheet, scrollable both ways.
- **Verdict** is a short stepper: dispositions, then incident, then claims, then actions, then review. Each step fits one screen.
- **Touch and type:** all targets ≥ 44 px, text ≥ 16 px in inputs (no iOS zoom), no hover-only affordances.

**Tablet (760–1179 px):** two columns, explorer and inspector. The queue becomes a drawer; the timeline is a tab.

---

## 6. Component and data architecture

### 6.1 Fit with the current codebase

| Existing | Use in Phase 3 |
| --- | --- |
| Next.js 15 App Router, `[locale]` segment, `(site)` group | New routes under `(site)/lab/…` with the site header. The workspace page uses a full-width, full-height container. |
| next-intl, server-side messages, root `NextIntlClientProvider messages={{}}` | The lab route wraps its client island in a nested provider that receives **only** the `lab` namespace (≈ 12–15 KB per locale), so other pages' bundles don't grow. |
| Build-stage gate (`siteStage`), production lock, `check-content.mjs` | `labs.json` status record and the same gating. The guard is extended for the dataset (§6.7). |
| Cyber Command tokens (`command.css`, `case-files.css`) | A new `lab.css` reusing `--cc-*` / `--cf-*` tokens. No new fonts. |
| Playwright + axe, `node:test` guard tests | E2E and accessibility for the workspace. Engine unit tests run in the Playwright runner, which handles TypeScript natively, as a browserless project, so no new dependency. |
| No state library, `motion` and `three` already present | Phase 3 uses React `useReducer` + context, CSS transitions, SVG. **No new runtime dependencies**, and no `three` or `motion` on lab routes. |

### 6.2 File layout

```
src/app/[locale]/(site)/lab/
  page.tsx                       server: lab index (metadata, gate, scenario cards)
  [scenario]/page.tsx            server: gate, metadata (noindex in preview), message subset, <LabWorkspace/>
src/components/lab/
  LabWorkspace.tsx               client root: provider, layout switch, keyboard map
  state/
    investigation.ts             reducer, actions, initial state
    selectors.ts                 memoised derived data (filtered events, facets, entities)
    persistence.ts               sessionStorage load/save (try/catch, versioned)
    url.ts                       view/alert/event ↔ URL sync
  engine/                        pure TypeScript, no React, fully unit-tested
    query.ts                     tokenizer + parser → AST; errors with positions
    filter.ts                    AST → predicate; time ranges; index-backed lookups
    facets.ts                    counts per field for the current result set
    correlate.ts                 entity graph (nodes, edges, counts, first/last seen)
    patterns.ts                  helpers shown in the inspector ("1 attempt per account", "first time from this source")
    explain.ts                   field explanations (logon types, status codes)
    verdict.ts                   rubric evaluation → per-claim results (loads key lazily)
  modules/
    AlertQueue.tsx  LogExplorer/{QueryBar,FacetStrip,Histogram,LogTable,LogCards}.tsx
    EventInspector.tsx  Timeline.tsx  Entities/{EntityGraph,EntityTable}.tsx
    MitrePanel.tsx  Verdict/{Dispositions,Claims,Scope,Actions,Review}.tsx
    Debrief.tsx  SummaryReport.tsx  Briefing.tsx
  ui/  BottomSheet.tsx  TabBar.tsx  Kbd.tsx  ShortcutsDialog.tsx  SeverityMark.tsx
  lab.css
src/content/lab/
  labs.json                      { id, status, approvedOn } (publication gate)
  soc-01/events.json             generated, committed (≈ 480 events)
  soc-01/scenario.json           org facts, alerts, enrichment, MITRE ids, claims (ids only)
  soc-01/key.json                expected dispositions, predicates, actions (lazy-loaded at submit)
scripts/soc-lab/generate-soc01.mjs
messages/{en,he,ar}.json         new "lab" namespace (UI ≈ 170 keys, scenario narrative ≈ 90 keys)
```

### 6.3 Investigation state

```ts
type InvestigationState = {
  version: 1;
  scenario: "soc-01";
  briefingSeen: boolean;
  view: "alerts" | "logs" | "entities" | "timeline" | "mitre" | "verdict" | "debrief" | "report";
  alerts: Record<AlertId, { status: "new" | "review" | "closed"; disposition?: Disposition }>;
  activeAlert?: AlertId;
  query: string;                      // source of truth; AST derived
  timeRange?: [string, string];       // from histogram brush or query
  sort: { field: SortField; dir: "asc" | "desc" };
  selectedEvent?: EventId;
  pins: Record<EventId, { note: string; pinnedAt: number }>;
  mitreTags: TechniqueId[];
  incident: { alerts: AlertId[]; claims: ClaimId[]; scope: { users: string[]; ips: string[]; hosts: string[] }; actions: ActionId[]; reasoning: string };
  submitted?: { at: number; result: VerdictResult };
};
```

- **Reducer and context:**
  - one reducer, pure actions such as `openAlert`, `setQuery`, `brush`, `selectEvent`, `pin`, `unpin`, `tagTechnique`, `setDisposition` and `submit`;
  - each action is unit-testable without React;
  - context is split into a **state** context and a **dispatch** context, so modules subscribe only to what they need.
- **Derived data:** filtered events, facets and the entity graph are memoised selectors keyed on `(query AST, timeRange)`. The query input uses `useDeferredValue`, so typing stays responsive.
- **URL holds:** `view`, `alert` and `event`, for the back button and deep links. Everything else stays local.
- **Persistence:** `sessionStorage` under `lab:soc-01:v1`, throttled. A version mismatch or parse error resets cleanly, and "Reset investigation" clears it.

### 6.4 Query, filtering and correlation

**Grammar:**

```
expr  := term (("OR") term)*
term  := ["-"] (field ":" value | value)
value := word | "quoted text" | range
```

- Fields: `event`, `user`, `ip`, `host`, `type`, `auth`, `status`, `sub`, `ws`, `time`.
- `ip:203.0.113.*` is a prefix match. `time:02:10..02:20` is UTC on the scenario date.
- Unknown fields produce an inline error with a suggestion.

**Execution:**
- At load, build inverted indexes (`Map<field, Map<value, Set<idx>>>`) and a time-sorted array.
- Filter by intersecting the index sets, then apply residual predicates.
- With ≈ 480 events every interaction is well under 5 ms; the design holds to about 50k events if later scenarios grow.

**Correlation:**
- `correlate(events)` yields nodes (IP / user / host) with counts and first/last seen, and edges (IP→user, user→host) with success and failure counts.
- The graph layout uses fixed columns, ordered by first-seen, so it is stable and testable (no force simulation).

**Pattern helpers** (shown as facts, never as verdicts):
- "18 distinct accounts from this IP in 6 min, 1 attempt each";
- "first logon for j.morgan from this source in the dataset";
- "auth package differs from this user's baseline (Kerberos → NTLM)".

They point; the visitor decides.

### 6.5 Accessibility and keyboard

- **Landmarks:**
  - the workspace is a `main` region;
  - panels are labelled `section`s;
  - the queue is a list of buttons (`aria-current` on the open alert);
  - the log table is a real `<table>` with `aria-sort`.
- **Keyboard model:**
  - roving focus on table rows: ↑/↓ moves, Enter opens the inspector, `P` pins, `/` focuses the query, `Esc` closes sheets and dialogs;
  - `G` then `A` / `L` / `E` / `T` / `M` / `V` jumps between modules;
  - `?` opens the shortcuts dialog.
- **Shortcut safety:** single-key shortcuts are active only when focus is in the workspace and not in a text field, and can be turned off in the shortcuts dialog (WCAG 2.1.4). Everything is also reachable without shortcuts.
- **Announcements:** filter results are announced in a polite live region ("19 of 482 events"). Pin and unpin confirmations are announced too.
- **Charts:**
  - the histogram has a text summary and keyboard brush (arrows move, Shift + arrows resize);
  - the entity graph has the equivalent sortable table (default on mobile).
- **Colour and sheets:**
  - no meaning is carried by colour alone: severity has a shape plus a word; outcome has ✓/✗ plus the event ID;
  - contrast is ≥ 4.5:1 for text, including failure-row tints;
  - bottom sheets and dialogs trap focus and return it on close.
- **Testing:** axe on every view and every locale; a keyboard-only end-to-end investigation.

### 6.6 RTL (Hebrew and Arabic)

- **Workspace chrome mirrors:** the queue sits on the right, the inspector on the left, and tab order follows the reading direction (logical CSS properties throughout).
- **Log data stays LTR:** timestamps, IPs, usernames, hex codes and the raw view are isolated with `dir="ltr"` / `<bdi>`. Table columns follow the reading direction; values are isolated inside cells.
- **Time axes:** the histogram axis runs left to right in all languages, as the Phase 2 protocol diagrams do, with translated labels. The pinned timeline is vertical (direction-neutral) and the mobile cards are direction-neutral.
- **Query syntax** is language-neutral (`ip:`, `user:`). The query field is `dir="ltr"`; the placeholder and errors are translated.
- **Fonts:** the mono face has no Arabic glyphs, so Arabic UI text uses the sans face (existing rule) and only Latin log values use mono.
- **Translation:** technical terms are translated where a standard term exists, otherwise kept in English with a translated gloss. Eli reviews all three languages before publication.

### 6.7 Performance budget

| Metric | Budget (iPhone-class device, 4G) |
| --- | --- |
| Lab route JS (first load, gzip) | ≤ 70 KB beyond the shared site bundle |
| Dataset | `events.json` ≈ 90 KB raw, ≈ 14 KB gzip, fetched on workspace mount (not in the HTML) |
| LCP | ≤ 2.5 s (the workspace bar and queue are server-rendered; the data fills in) |
| INP | ≤ 200 ms for filter, brush and pin (engine work is under 5 ms; rendering is bounded) |
| CLS | ≤ 0.02 (fixed panel geometry, skeleton rows) |

- No chart libraries: the histogram and graph are hand-written SVG (a few hundred lines).
- The table renders up to 500 rows directly and windows above that, which is unused for SOC-01 but ready for later scenarios.
- `key.json` and the report view are code-split and loaded on demand.
- Lighthouse runs on each milestone's preview.

### 6.8 Privacy and security boundaries

- **Data:**
  - the dataset is synthetic and generated in-repo;
  - the guard rejects any IP outside 192.0.2.0/24, 198.51.100.0/24 and 203.0.113.0/24;
  - any domain outside `.example`, any email address, any MAC address, and any string matching token or password patterns.
  - Account names come from a fixed fictional list in the generator.
- **Runtime:**
  - no network requests besides the static dataset file;
  - no analytics, cookies or third-party scripts;
  - free text (notes, reasoning) never leaves the browser and is stored only in `sessionStorage` for the tab;
  - rendered as text, never as HTML (no `dangerouslySetInnerHTML`).
- **Content:** MITRE ATT&CK names and IDs are used with attribution; the summaries are written in our own words. No third-party screenshots or datasets.
- **Labelling:**
  - "Interactive Training Simulation" appears in the workspace bar, the lab index header and the report footer;
  - nowhere else, so there are no repetitive disclaimers;
  - the report says "Scenario designed by Eli Saad", never "Investigation by Eli Saad".
- **Gating:** preview-only until approved, with the production lock unchanged.

### 6.9 Automated tests

| Layer | Coverage |
| --- | --- |
| Dataset consistency (unit) | Seeded generation reproduces the committed file. Every event validates against the schema. Times are within the span and sorted per host. Every 4625 has status and sub-status; every 4624 has a logon type. Logon type 10 is preceded by a type 3 from the same IP within 30 s. The 4740 is preceded by ≥ 5 failures for that account. j.morgan has a Kerberos baseline from WS-0142 on both days. Each claim predicate matches ≥ 1 event and each decoy exists. |
| Privacy guard (unit, also in `check-content`) | Only RFC 5737 addresses, only `.example` domains, no emails, MACs or secrets, no real-looking UPNs. |
| Engine (unit) | Query parser: valid, invalid with error positions, quoting, negation, OR, ranges, prefix IP. Filter equivalence with brute force on random queries (property-style, seeded). Facet counts. Correlation counts. Verdict scoring for the model answer, empty answer, over-reaction answer and partially supported answer. |
| Reducer (unit) | Every action; persistence round-trip; version reset. |
| E2E desktop (EN/HE/AR) | Full investigation: open alerts, query, brush, pin evidence, tag MITRE, submit the model verdict, see "8 of 8 supported", open the report. Over-reaction path flagged. Partial path shows "missed" items. |
| E2E mobile 360 / 390 (EN/HE/AR) | The same journey through the tab flow and bottom sheets. The back gesture restores views. No horizontal overflow. Targets ≥ 44 px. |
| Keyboard-only | Whole journey without a pointer; shortcuts can be disabled. |
| Accessibility | axe on every view × locale × viewport. |
| RTL | Chrome mirrored; LTR isolation of log values (e.g. `203.0.113.45` renders in order); histogram axis LTR. |
| Gating | Public build: `/lab` and `/lab/soc-01` return 404, there is no nav item, sitemap entry or home-card link, and a forced-preview production build stays public. Preview build: visible and noindex. |
| Performance | Bundle-size check for the lab route in CI (fails over budget). Lighthouse at milestone reviews. |

---

## 7. Milestones and acceptance criteria

Each milestone ends with tests green, screenshots, and Eli's approval before the next starts. Nothing merges or deploys without approval.

| # | Milestone | Acceptance criteria |
| --- | --- | --- |
| M0 | **This proposal approved**, with decisions D1–D8 (§9) | Eli's written approval |
| M1 | **Visual mockups**: a static concept route on the proposal branch with realistic sample rows; desktop workspace, mobile queue / logs / event sheet / verdict, EN/HE/AR. Protected Preview only, with approval before deploying. | The visual direction is approved at 360, 390 and 1440. The V4.1 identity is recognisable. No decorative charts. |
| M2 | **Dataset and engine**: generator, `events.json`, scenario and key files, query / filter / facets / correlate / verdict modules, consistency and privacy guards. No UI. | All unit tests pass. The model answer scores 8/8 and the decoy paths behave as specified. Eli reviews the story and data table (§3). |
| M3 | **Desktop workspace I**: shell, alert queue, Log Explorer (query, facets, histogram, table), Event Inspector, pinning, keyboard model | E2E for the explore → pin flow in 3 languages. axe clean. Lab route JS within budget. |
| M4 | **Desktop workspace II**: timeline, entities (graph + table), MITRE panel, verdict, debrief, report (print) | Full desktop journey E2E in 3 languages. The report prints on one page in each language. |
| M5 | **Mobile flow**: tab bar, cards, bottom sheets, verdict stepper, tablet layout | Mobile E2E at 360 and 390 in 3 languages. No overflow. Targets ≥ 44 px. The iOS back gesture works. |
| M6 | **Hardening**: translations reviewed, RTL pass, accessibility audit, keyboard-only run, Lighthouse, gating tests; protected Preview for iPhone review | All tests pass. Performance budgets met. Eli approves on iPhone. |
| M7 | **Publication** (separate approval): `labs.json` → approved, nav and home-card link appear. Production remains a further explicit approval. | Public build shows the lab; preview-only items stay hidden. |

Rough effort: M1 about 1 session; M2 1–2; M3 2; M4 2; M5 1–2; M6 1.

---

## 8. Risks and limitations

| Risk | Mitigation |
| --- | --- |
| **Technical inaccuracy** in Windows event semantics (logon types, status codes, NLA behaviour) would undermine credibility with SOC reviewers | A reference table in the generator with a source note for every code. Consistency tests. Eli reviews the data table at M2. Event fields are limited to those 4624, 4625 and 4740 actually carry. |
| Mistaken for a real incident or real experience | A single clear simulation label, a fictional org on a `.example` domain, RFC 5737 IPs, "Scenario designed by Eli Saad" wording, and personal-project classification. |
| **Verdict rubric** too strict (rejects good reasoning) or too lenient | Evidence predicates accept any qualifying event, not one specific row. "Partly supported" exists. Free text is never scored. Retry is unlimited. |
| Feels like a toy or a quiz | Real query syntax, realistic noise, decoys, and a debrief that names the limits of the data, which is exactly the judgement a SOC lead looks for. |
| Mobile complexity | A purpose-built flow (M5) with its own tests; the desktop layout is never squeezed. |
| Translation volume and quality (≈ 260 keys × 3), technical terms in Hebrew and Arabic | A glossary file for consistent terms, English kept for standard technical tokens, and Eli's review of HE/AR before publication. |
| Scope creep (more log sources, more scenarios) | SOC-01 is authentication only. The engine and schema allow later scenarios, but none are built without a new approval. |
| Bundle growth on other pages | The lab code and messages are route-scoped; a bundle check fails CI if shared chunks grow. |
| Answer key readable in the bundle | Accepted for a training simulation. The key loads only at submit. Noted in the report's "about this simulation". |
| MITRE content | IDs and names only, with attribution and our own summaries; links open the official site. |

**Limitations to state openly:**
- Authentication logs only: no process, file or network-flow data. The debrief says what this prevents us from concluding.
- No saving across devices, and progress is lost when the tab closes (by design: no backend, no personal data).
- One scenario at launch.
- The visitor's investigation is theirs. The lab demonstrates Eli's design and analysis skills, not a real incident he handled.

---

## 9. Decisions for Eli

| # | Decision | Recommendation | Status |
| --- | --- | --- | --- |
| D1 | Route name | `/{locale}/lab` and `/{locale}/lab/soc-01` (as reserved in the Phase 2 plan) | **Approved** |
| D2 | Debrief style | Claim-by-claim checklist with a "6 of 8 supported" line, no percentage score | **Approved** |
| D3 | Model analyst notes in the debrief | Yes, written from §3.3 and approved by Eli in all three languages | Open |
| D4 | Fictional names | Generic fictional names (§3.1) on `northwind.example`; Eli can veto any name | Open |
| D5 | Display time zone | UTC everywhere, labelled (the SOC convention) | **Approved** |
| D6 | Home and recruiter links after approval | The home card "SOC investigation lab" links to the lab; the recruiter brief adds one "Personal project" line | Open |
| D7 | Workspace header | Keep the compact site header (identity, language switch, recruiter button) above the workspace | **Approved** |
| D8 | Mockups (M1) | A static concept route on this proposal branch, shown in a protected Preview after your approval to deploy | Mockups **approved and built** (§10). Protected Preview deployment: open, needs a separate approval |

---

## 10. M1 visual mockups

Built on `proposal/phase3-soc-lab` only. Phase 1 and Phase 2 files are unchanged.

- **Routes:** `/{locale}/lab` (lab index) and `/{locale}/lab/soc-01?view=…`, inside the site layout, so the real header is kept.
  - Preview build only: a public build returns 404 for both.
  - Always noindex; not in the navigation or the sitemap.
- **Views:**
  - desktop: `logs` (queue, explorer, inspector, timeline dock), `timeline` (observed evidence and hypotheses), `verdict` and `debrief`;
  - mobile: `queue`, `logs`, `event` (bottom sheet), `timeline`, `verdict` (stepper) and `debrief`.
- **Static:** server-rendered with sample data from §3 (`src/components/lab-mockup/data.ts`). There is no query engine, state or interactivity; links only switch views.
- **Copy:** EN/HE/AR kept in `src/components/lab-mockup/copy.ts`. The real lab moves it to a `lab` message namespace.
- **Not mocked yet:** the Entities and MITRE views (tabs shown, disabled) and the tablet layout; they come in M4 and M5.
