# ELI SAAD — CYBER OPERATIONS
## Creative, UX and implementation proposal (draft for Eli's review)

Branch: `proposal/cyber-operations`, created from `proposal/phase3-soc-showcase` at `f06ef36`.
Status: proposal only. Nothing has been merged or deployed, and Vercel is unchanged. The mockups
render only in a `SITE_STAGE=preview` build at `/[locale]/operations?frame=…`. They are never
indexed, and the public build returns 404 there.

---

## 0. Summary

The portfolio already has a strong recruiter-facing base: the Cyber Command home, the recruiter
brief, the certificates, the private CV request flow and an evidence model that keeps unapproved
content off the public site. This proposal adds one section, **Cyber Operations**: guided visual
stories that show how security data is read. It does not restart the portfolio or replace
approved components.

The core decision is a three-tier **provenance model** that every story carries visibly:

| Tier | Mark | Meaning | Today |
|---|---|---|---|
| **Verified lab work** | ● green circle | Eli's own lab work, shown with his sanitized evidence and approved by him | **None published.** CF-01, CF-02 and CF-03 are still placeholders. |
| **Training demonstration** | ◆ violet diamond | Explains a method with synthetic, technically validated data. Created with AI assistance; it is not a record of work performed. | Three proposed: Network, SIEM, AD |
| **Training simulation** | ■ amber square | A fictional incident, walked through as an investigation | SOC-01 (existing) |

The shape tells the tiers apart even without colour. Every story also shows two review flags:
**Technical check** and **Eli's review**. Neither is shown as complete until it actually is.

A code-driven presentation can explain methods well. It cannot create verified work. §11.4 proposes
a low-effort way to fill the verified tier without screenshots or videos: Eli exports text data
from his own labs, and the same scenes render it.

---

## 1. Audit of the existing portfolio

### 1.1 Inventory and verdict

| Area | What exists | Verdict |
|---|---|---|
| Home (Cyber Command V4.1) | `CommandHero`, chapters with `ChapterRule`, `CareerTrajectory`, `CredentialExhibit`, `CaseStudiesPreview`, `OpenToWorkBand`, `CvRequest`, `ChapterRail` | **Keep.** In P6, one chapter, "Technical work", replaces `CaseStudiesPreview` (frame `home`). Chapter numbering is already computed. |
| Recruiter brief `/recruiter` | Brief page, print styles, `BriefActions` | **Keep.** Add a "Technical work" block that counts stories by tier (frame `home`, right). |
| Certifications | `CredentialExhibit`, `CertificateGallery`, `EvidencePlate`, sanitized images | **Keep untouched.** |
| CV | `CvRequest`, `CvRequestDialog`, `DocumentLock`, the CV guard in `check-content` | **Keep untouched.** Phone number only in the dialog; no CV in the repo or the bundle. |
| Evidence model | `evidence.ts` (`placeholder` / `draft` / `approved`, `isVisible`), `stage.ts` | **Reuse** as the publication status of every story. |
| Case Files (Phase 2) | `/case-files`, `[slug]`, `CaseDiagram`, `EvidenceGallery`, `case-files.json` with guard rules, CF-01–03 all `placeholder` | **Keep as the verified-tier engine.** Each Operations category links to its case file; nothing is duplicated. |
| Skills model | `skills.ts` evidence types (employment, certification, course, project); "Demonstrated" reserved | **Reuse unchanged.** Demonstrations never count as evidence of a skill. |
| `cc` primitives | `SimTag` / `SimLabel`, `ChapterRule`, `PendingSlot`, `EvidencePlate`, `SignalLine`, `LatticeGlyph` | **Reuse.** The simulation tier uses the existing amber `SimTag`. |
| Phase 3 lab `/lab/soc-01` (M1.2) | Interactive workspace where the visitor investigates and submits a verdict; answer gating | **Retire from the roadmap** as a visitor exercise, which conflicts with the new direction. Code and the protected M1.2 Preview stay untouched. **Reuse** the dataset (`lab-mockup/data.ts`), the histogram and the entity-graph parts. |
| Phase 3 static mockup `/showcase` | Eight static frames of the SOC-01 walkthrough | **Superseded** by `/operations`. Remove in P6. |
| Phase 3 motion study `/showcase/motion` | `timeline.ts` engine (pure function of time), `MotionStudy` player, chapters 2–3, capture mode, measured performance work (§21–§26 of the Phase 3 doc) | **Reuse.** Extract the engine and player into a shared story player (P1). Chapters 2–3 become SOC-01 chapters 2–3. |
| `projects.json` | Four placeholder projects (socLab, wireshark, activeDirectory, aiPortfolio) | **Redundant.** It overlaps with the case files and with Operations. Fold it into those two in P6, after Eli decides (D9). |
| `/concepts/a`, `b`, `c`, `v4` | Earlier design explorations | Out of scope. Candidates for removal later. |
| `check-content.mjs` | IP guard (RFC 5737 / lab.local only), CV, secrets, video and metadata guards | **Extend** with story rules (§11.3). |

### 1.2 Integrity issues found

1. **First-person wording in the SOC-01 storyboard.** Phase 3 §15 is built on "What I examined",
   "What I observed" and "Eli's workflow". Under the new rule ("no first-person claims without
   verified evidence"), this must become neutral: "Examined", "Observed". P5 migrates it.
2. **The lab positions the visitor as the analyst** (verdict submission). The new direction rules
   this out, so the lab is retired from the roadmap as described above.
3. **No verified work exists yet.** All case files and projects are placeholders. The site must not
   suggest demonstrated skills. `skills.ts` already prevents this, and the hub mockup says so in
   plain words ("Not published yet").
4. **Three overlapping containers for "work"**: projects, case files and the showcase. Without
   consolidation, Operations would become a fourth. Operations is the presentation layer, the case
   files remain the evidence layer, and projects are folded into them (D9).

---

## 2. Creative concept: an analyst presenting

**Feeling:** a calm technical briefing. A competent analyst walks a hiring manager through how a
piece of evidence is read, one claim at a time. It should not feel like a hacker landing page, a
game or a course.

**Principles**
1. **Data is the hero.** Packet rows, event fields, an OU tree and a rule. Real structures,
   legible at reading size. Decoration exists only where it carries meaning.
2. **One idea per beat.** Each chapter makes one point. Motion moves attention to the evidence
   behind that point, then stops.
3. **Claims show their weight.** Every statement is typed as observed, interpretation or
   limitation. Investigation stories use "supported / unconfirmed / not in these logs". These are
   shown with line style as well as colour (solid green, amber, dashed grey).
4. **Honest framing everywhere.** The provenance strip sits above every stage, and "custom
   illustration, not Wireshark, Splunk or Microsoft software" is always visible.
5. **Restraint.** Graphite surfaces, hairline borders, one cyan accent for "look here". No glow,
   no blur, no 3D, no fake terminals, no typing effects except where a query is actually being
   explained.

**Visual language** (extends the existing tokens; see `operations-mockup.css`)
- Surfaces `#08111f` / `#0c1828` / `#112137`, hairlines at 14% / 26%, text `#e8f0f9` / `#9aabc1`.
- **Accent `#42d5f6`** is used only for the current focus: the highlighted rows, the arrows and
  the focused OU.
- Semantic colours: green for supported, amber for unconfirmed or needs review, red for attack
  traffic, violet for the demonstration tier, grey for normal traffic.
- Type: IBM Plex (sans) for narration; JetBrains Mono for values, with ligatures off so `==` and
  `>=` show exactly as typed.
- Hebrew and Arabic labels use the sans face with no tracking or capitals, which preserves Arabic
  letter joining.

**Motion language** (reuses the motion-study engine)
- Entrances: 180–320 ms, ease-out, opacity plus a translate of at most 8 px.
- Focus changes use light, not zoom: the rest dims to about 35% and the focus stays at full
  strength. This approach measured fastest in the motion study (§26 there).
- Connections draw once along their path (stroke-dashoffset on short paths only).
- The stage never zooms or pans on desktop. Phones reflow the scene instead of shrinking it.
- Reduced motion: every change becomes a cut, and no in-between frames are rendered.

**Voice rules**
- Demonstrations explain in neutral voice ("the rule counts…", "the handshake takes…") and never
  say "I investigated" or "I configured".
- First person appears only in the verified tier, tied to an approved case file.
- No invented employers, incidents, metrics or outcomes.
- Captions run at or below 16.5 characters per second, the same unit-tested limit as the motion
  study.

---

## 3. Provenance model

```
Story
 ├─ tier: verified | demonstration | simulation
 ├─ status: placeholder | draft | approved            (existing evidence model)
 ├─ review: { technical: pending | done (date, notes), eli: pending | done (date) }
 ├─ provenance: { aiAssisted: boolean, synthetic: boolean, sources: CaseFile id | null }
 └─ references: RFCs and Microsoft documentation used to validate the values
```

Rules (enforced by `check-content`, §11.3):
- `verified` requires an approved case file with Eli's sanitized evidence. It is never synthetic,
  and the AI-assistance disclosure is shown only if AI was used for the text.
- `demonstration` and `simulation` require `synthetic: true`, the AI disclosure, the
  "custom illustration" line, and no first-person sentences in any locale.
- `simulation` also always shows "Fictional company and data. Not a real incident.", which keeps
  SOC-01 labelled as a training simulation.
- **Public only when** `status: approved` **and** `review.eli: done` (D7). Until then a story is
  preview-only.

---

## 4. The four showcase categories

Each category starts with one story. More can be added later without changing the structure.

| # | Category | First story | Tier | Length | Case file link |
|---|---|---|---|---|---|
| 01 | SOC Investigation Stories | SOC-01 · From a password spray to a file server | Simulation | 2:40 | — |
| 02 | Network Forensics | From a name to an encrypted session (DNS → TCP → TLS) | Demonstration | 2:10 | CF-01 (verified slot) |
| 03 | SIEM & Windows Security | Telling a password spray from a brute-force attack | Demonstration | 2:20 | CF-02 (verified slot) |
| 04 | Active Directory & IT Infrastructure | Designing and verifying OUs and Group Policy | Demonstration | 2:30 | CF-03 (verified slot) |

Possible later stories, only after Eli's approval: an HTTP and cleartext-credential capture, a
DNS tunnelling indicator, account lockout root-cause analysis (4740 + 4625 0xC0000234),
privileged group change monitoring (4728 / 4732 / 4756), and delegation of OU control.

---

## 5. Visitor journeys

**Recruiter (about 2 minutes, often on a phone)**
1. Home, chapter "Technical work": sees four categories, each with its tier label.
2. Opens Cyber Operations. "How to read this page" explains the three labels in one line each.
3. Opens one story, plays one chapter (about 25 s), and reads the caption and the three typed
   statements.
4. The hub's two-minute route points to Verified lab work and the certifications.
5. Recruiter brief: a "Technical work" block with honest counts (verified: none yet;
   demonstrations: 3; simulation: 1).

**Hiring manager / technical reviewer (10–15 minutes, desktop)**
1. Starts at a category relevant to the role (for example SIEM).
2. Watches a full story. The reasoning panel shows observed / interpretation / limitation for
   each chapter.
3. Opens the **text version** to check values: the packet table, the rule, the commands, and
   references to RFCs and Microsoft documentation.
4. Looks for verified lab work in the same category (CF-0x). Today it says plainly that none is
   published.
5. Leaves through Contact or the CV request.

**Screen-reader and keyboard users:** every story has a server-rendered text version at the same
level as the visual story (§13). The player is fully keyboard operable.

---

## 6. Information architecture and page structure

```
/[locale]/operations                    hub (frame "hub")
/[locale]/operations/[story]            story player (frames "soc", "net", "siem", "ad")
/[locale]/operations/[story]/text       text version (frame "text")
/[locale]/case-files/[slug]             verified tier (existing, unchanged)
```

Nav: one item, "Operations" (D1). It is added only when the first story is public, following the
existing "add a route only once its page exists and is approved" rule in `nav.ts`.

**Hub anatomy** (frame `hub`)
1. Eyebrow "Eli Saad — Cyber Operations", title, one-sentence lead.
2. "How to read this page": three tier cards.
3. Four category rows. Each row has a number, a name, a one-line scope, the story card (code-drawn
   glyph, tier, title, summary, chapters, length, review state), and the verified slot for that
   category. The verified slot is preview-only until a case file is approved, and is absent
   publicly.
4. Aside: "Two-minute route for recruiters".

**Story anatomy** (frames `soc`, `net`, `siem`, `ad`)
1. Provenance strip: tier · synthetic data · (fictional, for simulations) · custom illustration ·
   review flags.
2. Category eyebrow and title.
3. Stage: a technical canvas, always left-to-right, with the chapter label in the corner.
4. Caption: large narration text under the stage.
5. Chapter rail: five named segments with progress.
6. Transport: replay chapter, play/pause, next chapter, chapter count and length, captions toggle,
   text version link.
7. Reasoning panel: the three typed statements for the current chapter. For SOC-01 chapter 5,
   where the stage already shows them, the panel shows the next steps instead.
8. AI-assistance disclosure.

**Home and recruiter integration** (frame `home`): the "Technical work" chapter, with four tiles
and a call to action, plus the recruiter brief block.

---

## 7. Storyboards

Times are for the authored timeline. As in the motion study, a single `PACE` factor may stretch
them to keep captions at or below 16.5 characters per second. "Reduced" means what a
reduced-motion visitor sees.

### 7.1 Network Forensics · From a name to an encrypted session (2:10)

| Ch | Time | Scene and motion | Observed | Interpretation | Limitation | Reduced |
|---|---|---|---|---|---|---|
| 1 Capture scope | 0:00–0:20 | Packet list rows settle in (40 ms stagger); capture-point badge on the client | 7 packets in 69 ms from one client, 192.0.2.24 | The capture point is the client, so this is the client's view | Other hosts' traffic is not in this capture | List complete |
| 2 DNS resolution | 0:20–0:45 | Filter `dns.qry.name == "updates.example.com"`; rows 1–2 light; ladder client↔resolver draws | Query 0x3f2a, A answer 198.51.100.40, TTL 300, 18.4 ms | The resolver answered; whether it came from its cache is not visible | Encrypted DNS (DoH/DoT) would not appear as UDP 53 | Cut to rows 1–2 lit |
| 3 TCP handshake (**mockup**) | 0:45–1:15 | Filter `tcp.flags.syn == 1 && tcp.port == 443`; rows 3–5 light; SYN, SYN-ACK, ACK arrows draw in turn; RTT bracket | Handshake in 24.1 ms, MSS 1460, window scaling both ways, no retransmission | Likely the connection for updates.example.com: same address, 1.5 ms after the answer | A matching IP does not prove the intended name | Ladder complete |
| 4 TLS Client Hello | 1:15–1:40 | Filter `tls.handshake.type == 1`; row 6 expands to SNI and supported versions; row 7 Server Hello | SNI updates.example.com; the server selects TLS 1.3 | SNI matches the DNS name, which strengthens chapter 3 | SNI is client-supplied; ECH would hide it; the TLS 1.3 certificate is encrypted | Cut |
| 5 What the capture cannot show | 1:40–2:10 | Board: shown / interpreted / not visible; packet 7 onward greyed | Session established; payload encrypted | — | No URL, path, content or user identity is visible in this capture | Board complete |

### 7.2 SIEM & Windows Security · Spray vs brute force (2:20)

| Ch | Time | Scene and motion | Observed | Interpretation | Limitation | Reduced |
|---|---|---|---|---|---|---|
| 1 What a failed logon records | 0:00–0:25 | One 4625 event; fields light in reading order | TargetUserName, IpAddress, LogonType 3, Status 0xC000006D, SubStatus 0xC000006A (wrong password) vs 0xC0000064 (no such user) | SubStatus tells a guessed name from a guessed password | 4625 is logged on the target host; DC-side failures are 4771 (Kerberos) and 4776 (NTLM) | Fields outlined |
| 2 Two patterns | 0:25–0:55 | Two timelines: 198.51.100.61 (14 accounts × 1) and 198.51.100.62 (1 account × 38) | After 10 failures the lab lockout policy logs 4740; later attempts fail with 0xC0000234 | Many accounts and few tries is a spray; one account and many tries is brute force | Patterns, not intent | Cut |
| 3 Detection logic (**mockup**) | 0:55–1:25 | Scatter (accounts × failures per account, log scale) with the threshold line; the SPL logic appears line by line | .61 inside the spray zone; .10 also crosses the threshold | .10 is the shared lab gateway | Thresholds are dataset-specific | Chart and rule complete |
| 4 Testing against noise | 1:25–1:50 | .10 highlighted; follow-up 4624s appear for 9 of its 11 accounts within 5 minutes; rule revision shows a success-ratio condition | 9/11 accounts succeed shortly after | Mistyped passwords behind NAT, not a spray | An allowlist hides attacks from that egress; the ratio is better than an exclusion | Cut |
| 5 Limits of the rule | 1:50–2:20 | Three blind spots drawn as dashed cases | — | — | A slow spray over hours; a spray spread across many sources; Kerberos failures that appear only on DCs as 4771 | Board complete |

### 7.3 Active Directory · OUs and Group Policy (2:30)

| Ch | Time | Scene and motion | In the design | Expected effect | Must be verified | Reduced |
|---|---|---|---|---|---|---|
| 1 Domain and OU design | 0:00–0:30 | OU tree grows from lab.local; the default `Users` / `Computers` containers are shown greyed | OUs by object type and delegation: Corp > Users, Computers, Admin | GPOs can be linked to OUs, never to the default containers | New objects land in the containers unless redirected (`redircmp` / `redirusr`) | Tree complete |
| 2 Accounts and groups | 0:30–1:00 | AGDLP chain: account → global group → domain local group → permission | Finance users in GG-Finance, nested in DL-FinanceShare-RW | Permissions follow group membership | Creation and membership changes appear as 4720 and 4728 when auditing is enabled | Cut |
| 3 Group Policy links (**mockup**) | 1:00–1:30 | WS-Baseline link lights on Workstations; processing order ladder (Local → Site → Domain → OU chain) | WS-Baseline on OU=Workstations: 600 s inactivity limit | Computers in Workstations receive it; Finance users do not | Security filtering, blocked inheritance and replication can change the result | Cut |
| 4 Verification | 1:30–2:00 | Checklist cards: `gpresult /r /scope computer`, `Get-GPInheritance`, "what to look for" | Expected: WS-Baseline listed under applied GPOs; link order as designed | — | Shown as a check procedure, not as fabricated command output | Cut |
| 5 Common pitfalls | 2:00–2:30 | Three amber cards | — | — | (1) An OU-linked password policy does not affect domain accounts: use the domain policy or a PSO. (2) Since MS16-072, removing Authenticated Users read access breaks user GPOs unless Domain Computers keep read. (3) Loopback processing changes the user settings on a computer. | Cards complete |

### 7.4 SOC-01 · From a password spray to a file server (2:40)

This uses the approved five-chapter storyboard (Phase 3 §15) and the existing motion-study
chapters 2–3, with two changes:
1. Neutral voice: "Examined / Why / Observed / Supports / Uncertain", with no "I" and no
   "Eli's workflow".
2. The SOC findings board (frame `soc`) carries the three statement types; the panel carries the
   next steps.

The dataset, the order of events, the uncertainty statements and the AI disclosure are unchanged.

---

## 8. Mockups

Static, code-rendered frames at `/[locale]/operations?frame=<frame>` in a preview build, in
EN/HE/AR, responsive from 360 px up. Nothing animates. Each frame stands for a paused moment of
the storyboard above.

| Frame | Shows |
|---|---|
| `hub` | Hub: tiers, four categories, story cards with code-drawn glyphs, verified slots (preview-only), recruiter route |
| `soc` | SOC-01 chapter 5: findings board, kept events, next steps |
| `net` | Network chapter 3: packet list with display filter, handshake ladder, RTT bracket |
| `siem` | SIEM chapter 3: spray/brute-force scatter with threshold zone, SPL logic, fields read |
| `ad` | AD chapter 3: OU tree with linked GPOs, processing order, setting, pitfall, verification commands |
| `text` | Text version of the Network story: chapters, statements, the values table, references |
| `home` | Home "Technical work" chapter and the recruiter brief block |

Phone layout decisions (390 px captures):
- The packet table collapses to the three packets in focus, and the ladder moves above it.
- The rail keeps numbers only, because the stage label names the chapter.
- The reasoning panel follows the transport.
- Transport targets are at least 44 px.
- The page never scrolls horizontally.

---

## 9. Technical accuracy notes for the synthetic data

Every value was chosen to be internally consistent and correct by specification.

- **Addressing:** RFC 5737 documentation ranges only (192.0.2.0/24, 198.51.100.0/24,
  203.0.113.0/24), as already enforced by `check-content`. Names use `lab.local` and
  `example.com` (RFC 2606). There are no real IPs, hosts or people.
- **DNS:** query and response share transaction ID 0x3f2a. Frame lengths: 79 bytes for the query
  (14 Ethernet + 20 IP + 8 UDP + 12 header + 25 question) and 95 bytes for the response (+16 for
  one compressed A answer). TTL 300.
- **TCP (RFC 9293, RFC 7323):**
  - The Windows-style SYN has Win 64240, MSS 1460, WS 256 and SACK_PERM in a 66-byte frame
    (12 option bytes, no timestamps).
  - The Linux-style SYN-ACK has Win 65160, MSS 1460, SACK_PERM and WS 128, also 66 bytes, with
    no timestamps because the client offered none.
  - The ACK is 54 bytes, and its Win 262656 = 1026 × 256.
  - Relative sequence numbers are 0, then 1.
  - The RTT of 24.1 ms equals 0.043961 − 0.019873.
- **TLS (RFC 8446):** the Client Hello is a 571-byte frame (517-byte payload) carrying SNI. The
  Server Hello selects TLS 1.3, so the certificate is encrypted.
- **Windows authentication:**
  - 4625 on the target host. LogonType 3 (network) and 10 (remote interactive).
  - Status 0xC000006D with SubStatus 0xC000006A (bad password) or 0xC0000064 (unknown user);
    0xC0000234 for a locked account. 4740 records the lockout.
  - On domain controllers, Kerberos pre-authentication failures are 4771 and NTLM validation is
    4776. Field names follow the XML event schema (TargetUserName, IpAddress, LogonType).
- **SPL:** `bin _time span=10m`, `stats dc() … count … BY`, `eval`, `where`. The index name
  `lab_wineventlog` is shown explicitly as synthetic.
- **Active Directory:**
  - GPO processing order is Local → Site → Domain → OU (parent to child). The later setting wins,
    an enforced link overrides it, and Block Inheritance stops non-enforced parent links.
  - Domain account password policy comes only from a domain-linked GPO or a fine-grained policy
    (PSO).
  - "Interactive logon: Machine inactivity limit" is a computer setting.
  - 4720 records user creation and 4728 records membership in a global security group.
- **Before any story is public**, a technical check records each value against its reference in
  the story file (`review.technical`), so the claim "technically validated" is itself traceable.

---

## 10. Authenticity and technical accuracy checklist

Run for every story before `review.eli` can be set, and again before publication.

**Provenance and voice**
- [ ] The tier is set and shown in the provenance strip, in all three locales.
- [ ] Demonstrations and simulations show "Synthetic data", the "Custom illustration, not
      Wireshark, Splunk or Microsoft software" line, and the AI-assistance disclosure.
- [ ] Simulations also show "Fictional company and data. Not a real incident."
- [ ] No first-person claims ("I", "my", or the Hebrew and Arabic equivalents) outside the
      verified tier. Checked by the guard and by a human read.
- [ ] No employer, client or real-incident names. No metrics about Eli's performance.
- [ ] The review flags show "pending" until the review has actually happened.

**Interface honesty**
- [ ] No product logos, colour schemes or window chrome that imitate Splunk, Wireshark or Windows
      tools. Product names appear only as "(Wireshark syntax)" or "(SPL syntax)" labels or in the
      references.
- [ ] Commands are shown as procedures ("what to look for"), never as fabricated terminal output
      presented as real.
- [ ] Nothing in a demonstration is called evidence, a finding or a result of Eli's work.

**Data validity**
- [ ] Only documentation IPs, `lab.local` or `example.com` names, and synthetic usernames.
- [ ] Every protocol field, event ID, status code and command is checked against the reference
      listed in the story file.
- [ ] Numbers are internally consistent: times, deltas, counts, frame lengths and window maths.
- [ ] Each chapter separates observed, interpretation and limitation, with at least one limitation
      per story.
- [ ] A shared attribute (name, IP, client name) is never presented as proof of identity.

**Verified tier**
- [ ] Evidence comes from Eli's own lab, is sanitized (no real IPs, hostnames, usernames,
      certificate IDs or metadata) and is approved in the case-file manifest.
- [ ] Every finding is linked to its evidence, and the date of the lab work is shown.
- [ ] No third-party training videos or screenshots are presented as Eli's work.

**Privacy (unchanged rules)**
- [ ] No CV, certificate IDs, private documents, secrets or contact data beyond what is approved.
      The phone number appears only in the CV dialog.

---

## 11. Architecture

### 11.1 One source per story
`src/content/operations/<story>.ts` declares the tier, status, review, references and chapters.
Each chapter holds its scene id, timeline keys, caption key, typed statements and a values table.
Wording lives in `messages/*.json` under `operations.<story>`. The **player and the text version
render from the same object**, so they cannot drift apart.

### 11.2 Shared story player (extracted from the motion study)
`src/components/story-player/`:
- `timeline.ts`, moved without behaviour change: tracks, `valueAt`, `pulse`, `paced`, cuts for
  reduced motion.
- `Player.tsx`, the generalised `MotionStudy` transport: chapters, scoped CSS variables, capture
  mode for frame-exact QA.
- Scene components per story (`NetLadder`, `PacketList`, `AuthScatter`, `RuleCard`, `OuTree`,
  `GpoOrder`, the SOC-01 `Ch2`/`Ch3`).

SOC-01's motion study becomes the first consumer. Its recordings must stay identical, which the
existing determinism test checks.

### 11.3 Guard extensions (`check-content`)
- Each tier has its required labels in every locale.
- First-person patterns (EN `\bI\b|\bmy\b`; HE `אני|שלי|ביצעתי`; AR `أنا|قمتُ|عملي`) fail outside
  `verified`.
- RFC 5737 addresses only. This already exists, and is extended to story data files.
- A public build fails if a story is `approved` while `review.eli` is pending.
- `verified` must reference an approved case file.

### 11.4 Verified tier without screenshots: evidence-driven rendering (recommended)
Eli exports **text data** from his own lab, and the same scenes render it, labelled
"Rendered from Eli's lab export, <date>":
- Network: `tshark -r capture.pcapng -T fields …` gives a CSV of a few packets.
- SIEM: his own SPL search, with the result table exported as CSV.
- AD: `Get-ADOrganizationalUnit` / `Get-GPInheritance` output, saved as text or JSON.

The exports go through the existing sanitize-and-approve pipeline (`private/` intake, manifest,
guard). No screenshots or videos are needed, and the content is genuinely his. This is the
highest-value step for credibility with hiring managers.

---

## 12. Performance strategy

Lessons from the motion study (Phase 3 doc §23–§26) become rules:
- **Compositor-friendly only:** animate opacity and transform. No SVG masks or filters, no blur,
  no box-shadow animation. Give large SVG stages `will-change: transform` (their own layer). Use
  fixed scale on desktop and reflow on phones instead of zooming.
- **No per-frame React rendering:** the timeline writes scoped CSS custom properties, scenes are
  memoised, and the clock and progress update by direct DOM writes. Only properties that changed
  are written.
- **Load cost:** the hub and text versions are static, server-rendered HTML with no player JS. The
  player loads per story through `next/dynamic` on first play. The first frame is real DOM, not an
  image. Fonts stay as subset Plex and JetBrains Mono.
- **Pause when not watched:** `visibilitychange` and an IntersectionObserver stop the clock.
- **Budgets** (in CI and before publication):

| Metric | Budget |
|---|---|
| Story route JS beyond the shared bundle | ≤ 45 KB gzip |
| LCP (Moto G-class, 4G) | ≤ 2.0 s |
| CLS | ≤ 0.02 |
| INP | ≤ 200 ms |
| Playback, desktop (container, software rendering) | ≥ 45 fps; main thread ≤ 300 ms/s |
| Playback, phone viewport, 1× / 4× CPU | ≥ 50 / ≥ 40 fps |
| Real devices before public release | iPhone and a mid-range Android, recorded result |

---

## 13. Accessibility and multilingual strategy

- WCAG 2.2 AA. No autoplay. Play, pause, previous and next are real buttons with labels. Keyboard
  shortcuts: Space (play/pause), ← and → (chapter), T (text version), C (captions).
- Captions are DOM text, on by default. During playback, only chapter changes are announced
  (polite). The stage is `role="img"` with a chapter summary. Every value in the stage also
  appears in the text version.
- The text version is server-rendered, has headings per chapter and real `<table>`s with
  keyboard-scrollable regions, and is linked from the player and the hub.
- Reduced motion: cuts only, verified by the existing "no in-between frames" test pattern.
- Nothing depends on colour alone: tiers use shapes and statements use line style. Contrast is at
  least 4.5:1 for text. Targets are at least 44 px. Focus rings are visible.
- **RTL:**
  - The page chrome, captions and panels mirror in Hebrew and Arabic.
  - **The technical canvas stays left-to-right** (time flows left to right, and packet tables,
    ladders and DNs read LTR), which matches how the tools present data (D5).
  - Technical values inside Hebrew and Arabic sentences are wrapped in `<bdi dir="ltr">`
    automatically (`iso()` in the mockup), so "24.1 ms" and "SYN, SYN-ACK, ACK" keep their order.
  - Labels in Hebrew and Arabic use the sans face with no letter-spacing.
  - Technical values use Western digits.

---

## 14. Phased implementation plan

Every phase stays on its own branch, is preview-only, and is not merged or deployed without Eli's
approval.

**P0 · Proposal and mockups (this branch).** Done when Eli has reviewed it and answered §16.

**P1 · Foundation (preview only)**
- Story schema and provenance model; guard rules from §11.3; shared story player extracted from
  the motion study; text-version renderer; hub at `/operations` (preview).
- Acceptance:
  - The SOC-01 motion study renders identically: the determinism test passes, and sampled frames
    differ by under 0.1% from the current recordings.
  - The guard rejects a demonstration with first-person text, a missing disclosure or a real IP
    (unit tests).
  - The hub shows the correct tiers in EN/HE/AR with no horizontal overflow at 360/390/430.
  - axe reports no violations.
  - The public build returns 404 for every `/operations` route.

**P2 · Network Forensics story**
- Acceptance:
  - All five chapters on desktop and phone, with a text version.
  - Captions at or below 16.5 characters per second.
  - The technical-check record lists every value against RFC 1035, 9293, 7323 and 8446.
  - The §12 budgets are met.
  - Reduced motion has no in-between frames.
  - RTL isolation passes, with a test that values keep their order in HE/AR.
  - Recordings are produced automatically through capture mode, for review only.

**P3 · SIEM & Windows Security story.** Same criteria, with event and status semantics checked
against Microsoft documentation (4625, 4740, 4771, 4776, the status codes).

**P4 · Active Directory story.** Same criteria. Commands are shown as procedures with no
fabricated output. GPO precedence, PSO and MS16-072 statements are checked against Microsoft
documentation.

**P5 · SOC-01 completion.** Chapters 1, 4 and 5 are added to the existing 2–3, and the wording
moves to neutral voice. The dataset, chronology and uncertainty statements are unchanged (test:
dataset numbers unchanged).

**P6 · Integration**
- The home "Technical work" chapter replaces `CaseStudiesPreview`. The recruiter brief gains its
  "Technical work" block. The "Operations" nav item and sitemap entry appear only when a story is
  public.
- `/showcase` is retired. `projects.json` is folded in (D9).
- Acceptance: the full public regression passes; no draft content appears in the public build
  (leak test); Lighthouse budgets are met on home, hub and one story.

**P7 · Release gate (per story)**
- Eli completes his review, the review flags are set, the status becomes `approved`, and a
  protected Preview is deployed **only after Eli approves its protection settings**. Production
  needs a separate explicit approval.

**V · Verified track (parallel, when Eli supplies exports)**
- V1 CF-01 network, V2 CF-02 SIEM, V3 CF-03 AD, through §11.4.
- Acceptance: the case-file guard passes; the exports are sanitized and approved in the manifest;
  findings are linked to evidence; the date is shown; the category's verified slot shows the real
  case file.

---

## 15. Risks and limitations

- **Demonstrations are not proof of skill.** Hiring managers will value the verified tier most.
  Without Eli's own exports, Operations stays explanatory. This is honest, but less persuasive.
- **AI assistance.** The stories and text are AI-assisted. "Eli's review" must mean that Eli can
  explain every statement himself, or the flag stays "pending".
- **Accuracy drift.** Protocol and event details are easy to get subtly wrong. The technical-check
  record and the references are the safeguard, and they must be redone whenever data changes.
- **Performance claims** in this container come from software rendering. A real-device check is
  required before release.
- **Scope.** Four stories of about 2.5 minutes each is significant work. P2 alone should prove the
  pipeline before P3 and P4 start.

---

## 16. Decisions for Eli

| # | Decision | Recommendation |
|---|---|---|
| D1 | Route and nav label: `/operations` "Operations", or "Technical work" | `/operations`, labelled "Operations" |
| D2 | Voice in demonstrations | Neutral voice only; first person only in the verified tier |
| D3 | Retire the interactive SOC-01 lab as a visitor exercise (code and the M1.2 Preview untouched) | Retire |
| D4 | First story to build after P1 | Network Forensics: the most self-contained and the easiest to validate against RFCs |
| D5 | Technical canvas direction in HE/AR | Always LTR, with mirrored chrome and isolated values |
| D6 | Verified tier through text exports from Eli's labs (§11.4) | Yes: no screenshots or videos needed |
| D7 | Publication rule for demonstrations | Public only after Eli's review is done |
| D8 | The SOC-01 motion study becomes the first consumer of the shared player | Yes, gated by the determinism and frame-difference tests |
| D9 | Fold `projects.json` into case files and Operations | Yes, in P6 |
