# Phase 3 (revised): SOC Investigation Showcase — See How I Investigate

Product concept, visitor journey, storyboard and mockups. **Proposal only.** Creative direction
approved as a proposal on 2026-10-17 with decisions D1–D8 (§14); the checkpoint deliverables
requested before the full player are §15–§20. Nothing here is
merged, deployed or implemented beyond static, preview-only mockup frames on the proposal branch
`proposal/phase3-soc-showcase`. That branch starts from the M1.2 lab (`proposal/phase3-soc-lab`
at `0e555cf`), which is preserved unchanged.

Supersedes the visitor-driven direction of `docs/phase3-soc-lab-proposal.md` (§1–§15). That
document stays as research: its dataset, accuracy audit, component work and test patterns are
reused below (§8).

---

## 0. The correction in one paragraph

This is Eli Saad's portfolio, built to **show recruiters how Eli works**. The visitor is an
**observer, not the analyst**. Nobody is asked to triage alerts, pin evidence, classify anything
or submit a verdict. The site demonstrates Eli's method through guided, cinematic walkthroughs:
- **First**, Eli's own work: real Wireshark investigations, Splunk and Windows Event Log work,
  Active Directory and IT projects, tools and scripts.
- **Second**, clearly labelled training simulations, where the SOC-01 dataset fits.

Motion exists to explain (where to look, what changed, what follows from what), never to decorate.

## 1. Product concept

**SOC Investigation Showcase.** A short, chaptered walkthrough of one investigation that
visitors can play, pause, replay, skip and read as text. Each walkthrough follows Eli's method in
five chapters:

| # | Chapter | What the visitor sees |
|---|---|---|
| 1 | Alert detection | The alert that fired, the rule behind it, what the rule does and does not claim |
| 2 | Log examination | The pivot query, the results, the one event opened and the fields that matter |
| 3 | Event correlation | Sources, accounts and hosts connected over time; indicators kept apart from proof |
| 4 | Evidence selection | The events the analyst keeps, each with the reason it was kept |
| 5 | Findings and limitations | Observed facts, supported conclusions, unconfirmed claims, what the data cannot show, next steps |

The walkthrough has three layers:
- **Analyst screen.** A screen frame with the workspace. Numbered cyan markers point at the
  elements the narration is about.
- **Narration as captions.** One or two sentences per beat, in Eli's voice: "I pivot…", "I keep
  only…".
- **What to notice.** One text line per marker, plus "Skills shown" tags. A recruiter who never
  presses Play still gets the point.

### Two kinds of walkthrough, one player

| Kind | Source | Provenance label | When |
|---|---|---|---|
| **Replay** | The analyst screen is rendered live from a synthetic dataset, animated step by step. Not video: crisp text, translated, accessible, a few KB | **Training simulation · Fictional company and data. Not a real incident.** | Phase 3: SOC-01 |
| **Recording** | Eli's own screen recording from his own lab, with captions and chapters | **My lab recording**, plus the lab and tools, and "simulated training data" when the data is synthetic | Phase 4: Wireshark, Splunk, AD, scripts |

Both kinds share the chapter rail, transport controls, captions, notes panel, text version and
end card. That means:
- the visitor learns one interface;
- a recording can replace or join a replay later without a redesign.

## 2. Principles

1. **Observer, not analyst.** Nothing to solve, score or submit. The only interactions are
   play, pause, replay, previous and next chapter, captions, the text version and "Skip to
   findings".
2. **Authentic first.** Eli's own recordings and verified work take priority over simulations. A
   simulation is always labelled as one on the entry card, player header, analyst screen, text
   version and end card.
3. **Never imply a real incident.** SOC-01 is a fictional company (`northwind.example`),
   documentation-range IP addresses (RFC 5737) and fictional accounts.
   - The narration describes a **method** ("I check what the rule claims").
   - It never describes an employer, a client or a real event.
4. **Observed ≠ concluded ≠ unknown.** Chapter 5 keeps four groups apart:
   - observed facts;
   - supported conclusions;
   - unconfirmed claims, including the shared client name: an indicator, not attribution;
   - not determinable from this data.
5. **Recruiter-first.** The entry card says what the walkthrough shows and how long it takes. The
   text version and "What to notice" carry the content without video or motion.
6. **Motion explains.** Every movement points at something the narration mentions: typing a
   query, rows arriving, a highlight sweeping a field, an edge drawing between two entities. With
   reduced motion, the same beats arrive as calm cuts.
7. **Eli's words.** The narration in the mockups is a **draft**. Before approval, Eli rewrites it
   in his own words, and the Hebrew and Arabic are reviewed. Every frame says so.

## 3. Honesty model

- **Provenance per walkthrough:** `simulated-demo` (replay) or `own-recording` (recording). This
  matches the media model already recorded in `docs/next-level-proposal.md` §8. There is no
  third value: stock footage, generated scenes or someone else's video can never appear as Eli's
  work.
- **Labels, everywhere visible:**
  - the entry card: label plus "Not a real incident";
  - the player header;
  - the analyst screen's title bar: "Simulated SIEM interface · fictional data";
  - the text version and the end card's data line.

  The simulated interface is **not Splunk**, and the entry card says "Shown in: a simulated SIEM
  interface". Real Splunk appears only in Eli's own recordings (Phase 4).
- **Who wrote what.** The SOC-01 scenario, dataset and draft narration were drafted with AI
  assistance during these sessions, under Eli's direction and review. The M1 lab index said
  "Scenario and dataset designed by Eli Saad." **Resolved by D7 (§14):** that line is replaced
  everywhere with an AI-assistance disclosure, and nothing claims Eli designed or validated the
  material until he has.
- **Strongest authenticity upgrade (recommended, D4).** Eli loads the SOC-01 synthetic dataset
  into his own Splunk lab and records himself working the case.
  - The walkthrough then becomes an `own-recording` of simulated data: real tool, real hands, a
    fictional incident, all labelled.
  - It needs the full ~482-event dataset generated and validated first. Per the earlier rule, no
    dataset change goes in without documenting the reason and checking the Windows event
    semantics.
- **No voice cloning.** Captions only in v1. Narration audio, if ever added, is Eli's own
  recorded voice, never a synthetic voice presented as Eli.

## 4. Visitor journey

**Entry points** (all blocked until approved; D6 of the earlier proposal still applies to Home
and Recruiter links):
- **Home:** a short "See how I investigate" band with the poster and one button.
- **Recruiter brief:** one line ("Watch a 2-minute walkthrough of how I investigate an alert"),
  plus the text version link for skimmers.
- **Case files:** each case links to its walkthrough when one exists (Phase 4).

**Recruiter, about 60 seconds.**
1. Entry card: title, simulation label, format and length, "What it shows" tags.
2. Either "Read it as text" (30 s), or Play and then "Skip to findings" (chapter 5).
3. End card: what it demonstrates → "See my case files" / "Request my CV".

**Technical reviewer, about 3 minutes.** Plays all five chapters, pauses on chapter 2 to read
the event fields, replays chapter 3, and reads the limitations in chapter 5.

**Phone.** Chapters are a sideways strip of chips under the header. The analyst screen is
portrait-adapted, not a shrunk desktop:
- chapter 2 hides the histogram and secondary columns;
- chapter 3 swaps the relationship map for a vertical path view.

The narration reads below the screen, and the transport bar is pinned to the bottom above the
home indicator: one row, 56 px, 44 px targets.

**Reduced motion.** No autoplay and no movement. The walkthrough opens in the text version, and
each chapter shows its key screen as a still with markers.

## 5. Storyboard (SOC-01, about 2 min 40 s) — superseded by the final storyboard in §15

Times are cue points. Each "beat" is one caption. *Motion* names what moves; *reduced motion*
says what replaces it.

| Time | Chapter · beat | Screen | Motion | Highlights / markers | Reduced motion |
|---|---|---|---|---|---|
| 0:00 | 1 · Alert fires | Alert queue, 4 alerts, overnight | ALR-0418 slides in at the top; severity pulse once | ① ALR-0418 j.morgan · JMP01 | Queue shown, ① outlined |
| 0:09 | 1 · Second alert | Same | ALR-0419 arrives one row below | ② ALR-0419 203.0.113.45 | Cut |
| 0:16 | 1 · Read the rule | Rule card opens under the queue | Card expands; other alerts dim | ③ "3 or more failed logons, then a success…" | Cut, dimmed |
| 0:25 | 2 · Pivot | Log search | Query types `ip:203.0.113.45` at 30 ms/char; histogram bars rise; brush settles on 02:09–02:18 | Count "19 of 482 events" | Query and chart shown complete |
| 0:37 | 2 · Pattern | Results table | Rows stagger in (40 ms); failures tinted | ① sub-status 0xC000006A / 0xC0000064 | Table complete |
| 0:47 | 2 · The success | Table + field panel | Highlight sweeps to e-0193; field panel slides in; Logon type and Authentication light up | ② logon type 3, NTLM vs Kerberos baseline | Panel shown, fields outlined |
| 0:58 | 2 · RDP | Table | e-0194 row highlights 15 s later on the time axis | ③ type 10, same source | Cut |
| 1:05 | 3 · Map | Relationship map | Nodes fade in by column; edges draw from source → accounts → host | 203.0.113.45 selected | Map complete |
| 1:17 | 3 · Lateral step | Map + timeline | Edge JMP01 → SRV-FILE01 draws; timeline cursor runs to 02:21 | ① 02:21 Kerberos from JMP01's internal address | Cut, ① outlined |
| 1:28 | 3 · Indicator only | Map + timeline | Dashed arc between the two sources; amber dashed tick at 02:31 | ② shared client name, not attribution | Dashed arc shown |
| 1:35 | 3 · Explained noise | Map | svc-backup row briefly highlights, then dims | ③ scheduled job after the password change | Cut |
| 1:40 | 4 · Baseline first | Selected evidence | First card settles (the analyst pins it: M1.2's "Pinned" feedback reused as an animation beat, not a visitor control) | ① baseline Kerberos logon, 10 Mar | List shown complete |
| 1:52 | 4 · The story | Same | Cards 2–7 settle in time order, each reason line fading in | ② "7 events" | Cut |
| 2:04 | 4 · Only logs | Same | Footnote appears | ③ nothing outside the logs is evidence | Cut |
| 2:10 | 5 · Observed | Findings board | Observed facts column fills first | ① stated without interpretation | Board complete |
| 2:18 | 5 · Conclusions | Same | Supported (green rule), then Unconfirmed (amber) | ② shared client name stays unconfirmed | Cut |
| 2:26 | 5 · Limits | Same | Not determinable (dashed rule), then Next steps | ③ file access cannot be determined from logon events | Cut |
| 2:40 | End card | — | Fade to end card | — | End card |

The technical content is the audited SOC-01 slice from `docs/phase3-soc-lab-proposal.md` §3 and
§11. No dataset change is proposed here.

## 6. Player and interaction spec (for implementation, after approval)

- **Controls:** replay chapter, previous chapter, play/pause (primary), next chapter, progress bar
  (five segments, one per chapter), time, captions toggle. Below the player sit "Text version"
  and "Skip to findings". The chapter rail is a list of links, and the current chapter has
  `aria-current="step"`.
- **No autoplay** (D5). The walkthrough starts when the visitor presses Play. It pauses when the
  tab is hidden or the player scrolls out of view, and it never loops.
- **Keyboard:**
  - Space or K to play/pause; J and L for the previous and next chapter; R to replay the
    chapter; C for captions; T for the text version;
  - every control is a real button with a visible focus ring and a 44 × 44 px target.
- **Captions:** on by default; the caption text is the narration. Screen readers get the
  narration of the current beat when the visitor moves chapters, not on every timed cue.
- **Reduced motion:** opens the text version (§4). If the visitor still chooses to play, beats
  change as cuts with no transforms or transitions, and the highlights still appear.
- **RTL:**
  - The chrome, rail, narration and notes mirror.
  - The transport controls and progress bar stay left to right (the media convention), like
    the time axes in the histogram and timeline (D6).
  - IPs, IDs and times are isolated left to right.
- **Phones:** the transport bar is sticky at the bottom with `env(safe-area-inset-bottom)`, one
  row, at most 64 px (tested). There is no tab bar and no sheets. The page scrolls normally, and
  sticky elements never cover headings or controls (the M1.2 rules).
- **Performance:**
  - the replay is server-rendered HTML plus one small client player, with cues as JSON;
  - target ≤ 15 KB of player script (gzipped), no video for replays;
  - LCP ≤ 2.5 s on the entry page, and the poster reserves its space.
- **Recordings (Phase 4):** `<video controls>` with WebVTT captions in en/he/ar and a chapters
  track that drives the same rail and notes panel.
  - Posters are stills from the actual recording.
  - Each recording is checked frame by frame for sanitization.
  - Hosting is decided then, with Eli's approval (`next-level-proposal.md` §8).
- **Content model (proposed):** `src/content/showcases.json` holds per walkthrough:
  - `id`, `kind` (`replay` | `recording`), `provenance` (`simulated-demo` | `own-recording`), `status`;
  - `chapters[]` with start times, optional `caseId`, and `approvedOn`.

  `check:content` makes only approved walkthroughs public, and it requires the simulation label
  and approved narration in all three languages.

## 7. Mockups (static frames, preview only)

Route `/[locale]/showcase?frame=…`. It is `notFound()` on public builds, never indexed and not
linked from anywhere.

| Frame | Shows |
|---|---|
| `hub` | Entry: "See how I investigate", observer line, featured walkthrough card with poster, meta, "What it shows", chapters. "From my own lab" (CF-01–03) appears in a review-only box: it stays hidden publicly until recordings are approved |
| `c1`–`c5` | Player at each chapter, mid-play: analyst screen with markers, caption, transport, rail, "What to notice", "Skills shown", draft note |
| `end` | End card: what the walkthrough demonstrates, links to case files and the CV request, watch again |
| `text` | Text version; also what reduced-motion visitors get first |

Screenshots (in the review message): entry (desktop); chapters 1–5 (desktop); end card and text
version; iPhone 390 for every frame, first screen and scrolled; Hebrew and Arabic on desktop and
iPhone; widths 360, 390 and 430.

**Reused in the mockups:** the lab's histogram, relationship map, severity and outcome marks,
left-to-right value isolation, the SOC-01 data slice, and the technical labels and findings copy
in all three languages.

## 8. Reuse, adapt, retire

| M1–M1.2 work | Decision | Where it goes |
|---|---|---|
| SOC-01 dataset slice (`data.ts`) and its 9 consistency tests | **Reuse as is** | Replay data |
| Accuracy audit (§11: logon types, auth packages, lockout timing, 4625 status codes) | **Reuse** | Storyboard facts; narration review checklist |
| Histogram, relationship map, `V`/`Sev`/`Outcome`, field grouping | **Reuse** | Chapters 2–3 |
| Learn panels (neutral 4624 / 4625 / logon types 3 and 10) | **Adapt** | Optional "Terms" disclosure under chapter 2's notes |
| Evidence list and notes (`tl.notes`) | **Adapt** | Chapter 4, selected by the analyst, not by the visitor |
| Debrief categories, `hWhy`, limits, actions | **Adapt** | Chapter 5; grading phrases ("Correct to keep it unconfirmed") rewritten as neutral statements |
| M1.2 "Pinned" feedback, highlight styles | **Adapt** | Animation beats in chapter 4 |
| M1.2 phone lessons (compact chrome, safe areas, sticky rules, 44 px targets) | **Reuse** | Player chrome on phones |
| Tests: overflow, axe, RTL isolation, layout budgets, public 404 | **Reuse** | Showcase specs |
| Preview gating, build guards, review-branch isolation | **Reuse** | Unchanged |
| Alert-queue triage by the visitor, filters sheet, query input | **Retire from the public experience** | Kept as research only |
| Pin / unpin / undo / confirm, evidence counts | **Retire** | Research only |
| Five-step verdict, dispositions, scoring, debrief gate | **Retire** | Research only |
| Answer-protection architecture (nothing to hide before submission) | **Retire** for the showcase | Kept with the lab tests; the showcase has no secret content |
| Workspace tab bar, event sheet navigation | **Retire** | Research only |

**The lab itself:**
- The `/lab` and `/lab/soc-01` mockups stay preview-only on their branches, unchanged. They are
  never published.
- The protected Preview still shows M1.2. Whether to switch it to these showcase mockups is a
  separate approval (D8).

## 9. How this fits Phase 4

**Phase 3 builds the showcase format and its first walkthrough. Phase 4 fills it with Eli's own
work.**

- **Phase 3 (this):**
  - the player (replay and recording kinds);
  - the five-chapter method;
  - the entry page;
  - SOC-01 as a labelled training simulation, published only after Eli approves the narration
    and the credit line.
- **Phase 4, authentic work** (proposed; needs Eli's material):
  - **CF-01 Network traffic investigation** (Wireshark, Kali): Eli's recording plus sanitized
    captures, through the same five chapters (capture → filter → inspect → follow → summarise,
    which are already the case-file workflow).
  - **CF-02 SOC alert investigation** (Splunk, Windows Event Logs): ideally SOC-01 run in Eli's
    own Splunk (D4), which turns the simulation into Eli's own recording.
  - **CF-03 Active Directory operations** (Windows Server, PowerShell, Group Policy): an
    operations walkthrough, with chapters adapted (build → structure → accounts → policy →
    verify).
  - **Tools and scripts:** short recordings of Eli's own scripts running, with the code linked.
- Each case file gains a "Watch the walkthrough" link. The entry page lists the approved
  walkthroughs, and planned ones stay hidden, under the existing rule.

If Eli's recordings are ready before the SOC-01 narration is approved, the first public
walkthrough can be a recording instead. The player supports both from day one.

## 10. Integrity rules and the checks that enforce them

1. **Simulation label:** every frame of a `simulated-demo` walkthrough shows "Training
   simulation" and "Not a real incident" (tested on all 8 frames × 3 languages × 2 layouts).
2. **Nothing to solve:** no forms, radios, inputs, pins or verdicts (tested).
3. **Markers match text:** every marker on the screen has a matching line in "What to notice"
   (tested), so the meaning never lives in colour or motion alone.
4. **Public lock:** `/showcase` is 404 on public builds, not linked and not in the sitemap
   (tested). Publication needs `status: approved` in the content model (to be added at
   implementation).
5. **Narration:** a draft until Eli approves it. It describes a method, never a real incident,
   employer, client, metric or timeframe. Hebrew and Arabic are reviewed before approval.
6. **Dataset:** unchanged. Any change is documented, with its Windows event semantics checked
   against Microsoft's documentation first.

## 11. Milestones

| Milestone | Scope | Exit |
|---|---|---|
| **S1 (this)** | Concept, journey, storyboard, static mockups | Eli's review and decisions D1–D8 |
| **S2** | Player engine and the animated SOC-01 replay (preview only): controls, chapters, captions, keyboard, reduced motion, text version, RTL, phone bar | Tests green; screenshots and screen recordings of the motion; review |
| **S3** | Content approval: Eli's narration in EN/HE/AR, credit line, accessibility and performance pass | Eli's approval |
| **S4** | Entry points: Home band, Recruiter line, case-file links | Separate approval (Home and Recruiter links stay inactive until then) |
| **Phase 4** | Recordings: CF-01, CF-02, CF-03, tools | Per recording: sanitization review, captions, approval |

## 12. Risks and limitations

- **Static mockups.** Nothing moves yet. The motion is specified in §5 and will be shown with
  screen recordings in S2.
- **Draft narration.** It was written for review, and the Hebrew and Arabic still need native
  review once Eli has written the English in his own words.
- **Simulation versus authenticity.** A replay shows method, not hands-on tool use. That is why
  Phase 4 recordings, and recording SOC-01 in Splunk (D4), matter more than polish.
- **Phone screens are adapted, not identical.** The phone hides some columns and swaps the map
  for a path. The text version and notes carry everything that is hidden.
- **Testing.** Chromium emulation only; a real iPhone review is still needed at S2.
- **Earlier limits still apply.** Microsoft documentation was checked through search results
  (the container cannot reach `learn.microsoft.com`).

## 13. Decisions for Eli

- **D1 · Location.** A dedicated page (working name `/investigations`, "See how I investigate")
  linked from Home, the Recruiter brief and case files *(recommended)*, or walkthroughs only
  inside case files?
- **D2 · First walkthrough.** Build the player with the SOC-01 replay now *(recommended)*, or
  wait for an own recording?
- **D3 · Narration.** Will you rewrite the narration in your own words, or edit the drafts?
  Captions only in v1 *(recommended)*, or record your own voice later?
- **D4 · Record SOC-01 in your Splunk lab?** *(Recommended:* it makes the flagship your own
  recording.) It requires generating and validating the full dataset first.
- **D5 · Autoplay.** None *(recommended)*, or muted autoplay when the player is visible (never
  with reduced motion)?
- **D6 · RTL transport.** Media controls and progress stay left to right in Hebrew and Arabic
  *(recommended, the media convention)*, or mirror them?
- **D7 · Credit line.** How should the SOC-01 scenario and dataset be credited, given they were
  drafted with AI assistance under your direction?
- **D8 · Protected Preview.** Keep it on the M1.2 lab, or switch it to these showcase mockups
  (same safeguards, only with your go-ahead)?

---

# Checkpoint before the full player (2026-10-17)

## 14. Decisions recorded

| | Decision | Effect on this proposal |
|---|---|---|
| D1 | A dedicated "See How I Investigate" page, linked to the relevant case files | Working route `/investigations` at implementation; the mockup stays at `/showcase` (preview only) |
| D2 | SOC-01 is the first walkthrough, clearly labelled as a training simulation, for the player prototype; Eli's own recordings come later | §15 storyboard; §18 recording plan |
| D3 | Captions first. All narration is draft material that Eli personally reviews and corrects; voice may come later | Every frame carries "Draft text for Eli to review and correct before approval" |
| D4 | Plan to reproduce and analyse SOC-01 in Eli's own Splunk lab with validated synthetic data, and record it. **Not presented as completed work** | §18 is a plan; nothing on any page says it has been done |
| D5 | No autoplay | §6, §17 |
| D6 | Conventional left-to-right playback controls in all three languages; RTL page layouts stay correct | Transport and progress bar `dir="ltr"` (tested); everything else mirrors |
| D7 | Replace the overstated authorship claim with an accurate AI-assistance disclosure; claim nothing as designed or validated by Eli until it is | Lab index line replaced; showcase entry, end card and text version carry the disclosure (tested in all three languages) |
| D8 | Keep the protected M1.2 lab Preview; propose a separate protected Showcase Preview | §20 |

**Disclosure text (EN; HE and AR in the copy files):** "Scenario, synthetic data and draft text were
created with AI assistance for this portfolio. Eli Saad's review and validation are in progress."
The deployed M1.2 lab Preview (`dpl_EjkqbLRoU9E573mWsQBXYmMhWAoe`) still shows the old line until it
is redeployed; that needs your approval and is not part of this checkpoint.

**Accuracy correction found during this checkpoint.** ALR-0418's rule text said "3 or more failed
logons, then a success **for the same account**, within 10 minutes". In the dataset, j.morgan has
no failed logons: the 17 failures are for 17 *other* accounts from 203.0.113.45. A per-account rule
could not have fired. The rule is corrected to what the events support: **"3 or more failed logons
from one source address, then a successful logon from the same source, within 10 minutes."**
- Changed: the rule text in the lab copy and the showcase copy (EN/HE/AR).
- Not changed: any event, time, field or count in the dataset.
- Windows semantics are unaffected: this is the scenario's detection logic, not event content.

## 15. Final five-chapter storyboard

Each chapter answers five questions about **Eli's workflow**, not a generic tutorial:
- **What I examined**;
- **Why**;
- **What I observed**, with one line per numbered marker on the screen;
- **What the evidence supports**;
- **What remains uncertain**.

The panel beside the analyst screen shows exactly these five, and so does the text version. All
wording is draft (D3).

### Chapter 1 · Alert detection (0:00–0:25)
| | |
|---|---|
| Examined | ALR-0418, the overnight queue around it, and the detection rule that fired |
| Why | The rule's logic sets the limits of the alert and decides where to look first |
| Observed | ① ALR-0418 matched j.morgan on JMP01, a jump server reachable over Remote Desktop · ② ALR-0419 fired a minute later for one source, 203.0.113.45 · ③ the rule: 3+ failed logons from one source, then a success from the same source, within 10 min |
| Supports | Enough to open an investigation into this source and account; an alert alone shows a pattern, not a compromise |
| Uncertain | Whether the success was the account owner; whether both alerts describe the same activity |

| Time | Beat | Screen and motion | Marker | Reduced motion |
|---|---|---|---|---|
| 0:00 | Alert fires | Queue settles; ALR-0418 slides in at the top (280 ms), one severity pulse | ① | Queue complete, ① outlined |
| 0:09 | Second alert | ALR-0419 arrives below | ② | Cut |
| 0:16 | Read the rule | Rule card expands under the queue; other alerts dim to 45 % | ③ | Cut |

### Chapter 2 · Log examination (0:25–1:05)
| | |
|---|---|
| Examined | All events from 203.0.113.45 in the alert window, then the successful logon e-0193, field by field |
| Why | To test the alert against raw events and compare the success with the account's usual behaviour |
| Observed | ① 17 failures, one per account, on average one every 22 s; sub-status 0xC000006A or 0xC0000064 · ② e-0193: type 3, NTLM; j.morgan's earlier logons used Kerberos from 198.51.100.142 · ③ 15 s later, e-0194: type 10, Remote Desktop, same source |
| Supports | A password spray from one source, during which a logon as j.morgan succeeded and was followed by an RDP session |
| Uncertain | Who was at the keyboard: logs identify the account, not the person |

| Time | Beat | Screen and motion | Marker | Reduced motion |
|---|---|---|---|---|
| 0:25 | Pivot | Query types `ip:203.0.113.45` (30 ms/char); histogram bars rise; brush settles on 02:09–02:18 | — | Query and chart complete |
| 0:37 | Pattern | Rows stagger in (40 ms); failure sub-statuses tint | ① | Table complete |
| 0:47 | The success | Highlight sweeps to e-0193; field panel slides in; Logon type and Authentication light up | ② | Panel shown, fields outlined |
| 0:58 | RDP | e-0194 highlights | ③ | Cut |

### Chapter 3 · Event correlation (1:05–1:40)
| | |
|---|---|
| Examined | Relationships between sources, accounts and hosts across the window, and what j.morgan's account did next |
| Why | To set the scope: which hosts were reached after the success, and which activity is unrelated noise |
| Observed | ① 02:21: j.morgan authenticated to SRV-FILE01 from JMP01's internal address (Kerberos) · ② 203.0.113.77: 7 failures from 02:31, same client name DESKTOP-7Q2M4 · ③ svc-backup failures come from its scheduled job after a password change |
| Supports | Activity moved from JMP01 to SRV-FILE01 under j.morgan's account; the svc-backup lockout is unrelated |
| Uncertain | Whether 203.0.113.77 is the same actor: a shared client name is an indicator, not attribution |

| Time | Beat | Screen and motion | Marker | Reduced motion |
|---|---|---|---|---|
| 1:05 | Map | Nodes fade in by column; edges draw source → accounts → host (stroke, 480 ms) | — | Map complete |
| 1:17 | Lateral step | Edge JMP01 → SRV-FILE01 draws; timeline cursor runs to 02:21 | ① | Cut |
| 1:28 | Indicator only | Dashed arc between the sources; amber dashed tick at 02:31 | ② | Dashed arc shown |
| 1:35 | Explained noise | svc-backup highlights briefly, then dims | ③ | Cut |

Phones: a vertical path (203.0.113.45 → j.morgan → JMP01 → SRV-FILE01) replaces the map.

### Chapter 4 · Evidence selection (1:40–2:10)
| | |
|---|---|
| Examined | Which events each finding needs, and which events are noise |
| Why | A finding is only as strong as the events behind it; a reviewer must be able to retrace it |
| Observed | ① a baseline logon from 10 March comes first · ② seven events in time order, each with a one-line reason · ③ only events from the logs; no assumption as evidence |
| Supports | Every finding in chapter 5 points to at least one kept event |
| Uncertain | What happened inside the RDP session: authentication events do not record actions |

| Time | Beat | Screen and motion | Marker | Reduced motion |
|---|---|---|---|---|
| 1:40 | Baseline first | First card settles, with the analyst's "Pinned" feedback (reused from M1.2 as an animation beat; not a visitor control) | ① | List complete |
| 1:52 | The story | Cards 2–7 settle in time order; each reason fades in | ② | Cut |
| 2:04 | Only logs | Footnote appears | ③ | Cut |

### Chapter 5 · Findings and limitations (2:10–2:40)
| | |
|---|---|
| Examined | The kept evidence against each claim that could be made |
| Why | To state only what the data supports, and make the limits clear to whoever acts next |
| Observed | ① observed facts stated without interpretation · ② the shared client name stays unconfirmed · ③ file access on SRV-FILE01 cannot be determined from logon events |
| Supports | j.morgan's password was guessed during the spray and then used for RDP and a logon to SRV-FILE01; contain the account and the RDP exposure first |
| Uncertain | Which files, if any, were accessed on SRV-FILE01; whether the session is still open; whether 203.0.113.77 is linked |

| Time | Beat | Screen and motion | Marker | Reduced motion |
|---|---|---|---|---|
| 2:10 | Observed | Observed-facts card fills first | ① | Board complete |
| 2:18 | Conclusions | Supported (green rule), then Unconfirmed (amber) | ② | Cut |
| 2:26 | Limits | Not determinable (dashed), then Next steps | ③ | Cut |
| 2:40 | End | Fade to the end card | — | End card |

## 16. Desktop and iPhone presentation review

Measured on the static frames (Chromium; desktop 1440 × 900, iPhone 390 × 844 and 360 × 800). The
"Proposal mockup" strip (about 36 px on phones) exists only in the mockup.

**Desktop — what works**
- The three-layer hierarchy reads in order: the analyst screen (focus), the caption, then the
  five-question panel. The cyan markers tie screen and text together without colour-only meaning.
- Labels are always visible: the simulation label above the title and in the screen's title bar.
- RTL: chrome, rail, caption and panel mirror; IPs, IDs, times, the histogram, timeline and
  transport stay left to right (D6).

**Desktop — to refine in S2**
- The panel (764–862 px) is taller than the screen in chapters 1, 2 and 5 (372–570 px). Proposal:
  "Examined" and "Why" collapse to a two-line header once the chapter has played for 5 s, and
  "Skills shown" moves under the transport. This keeps the panel no taller than the screen.
- Long hostnames wrap in the field panel (`JMP01.northwind.example`); widen the value column or
  use the short name with the FQDN in a tooltip-free second line.

**iPhone — what works**
- No horizontal overflow at 360, 390 or 430 in any frame or language (tested).
- The transport bar is one row, 56 px, with 44 px targets, and stays pinned from the screen to the
  end of the chapter notes, then settles (fixed in this checkpoint).
- Chapter 3 uses a vertical path instead of a shrunken map (readable at 360).
- Chapter 4 rows are one line each; the reason shows on the highlighted and the arriving event.
  Chapter 5 shows category and claim; the reasoning lives in the panel (fixed in this checkpoint).

**iPhone — measured and still open**
| Chapter | Screen height (390) | Fits the space between header block and bar (≈ 531 px)? |
|---|---|---|
| 1 | 548 px | Nearly |
| 2 | 582 px | No (by ~50 px) |
| 3 | 543 px | Nearly |
| 4 | 725 px | No |
| 5 | 633 px | No |

Proposed fix for S2 (needs motion, so it is not faked in a static frame): a **fixed-height phone
screen**, `min(31rem, 100svh − header − bar − 5.5rem)`, whose content **pans to the active beat**
like a camera, eased over 480 ms, so the part the caption talks about is always in view. Reduced
motion: the pan becomes a cut. Also on the showcase page only, the site header compacts to 52 px,
as on the lab workspace (`body:has(...)`, with the same `@supports` fallback).

## 17. Motion preview plan

**Goal:** show you real motion on desktop and iPhone **before** the full player is built, so the
choreography is approved on evidence, not on description.

**Deliverable: a motion study (S2a), preview only.**
- Chapters 2 and 3 (the most technical motion: typing, row stagger, field highlight, edge drawing,
  timeline cursor, chapter transition).
- Driven by a minimal cue runner: a JSON list of `{ t, action, target }`, with play/pause and
  restart only.
- Rendered on a new preview-only frame (`/showcase/motion?chapter=2`), never linked.
- Recorded automatically with Playwright video at 1440 × 900 and 390 × 844 (2×), plus a
  reduced-motion run. You receive the MP4s; nothing is deployed unless you approve §20.
- A short page of frame-by-frame stills accompanies each video for review on any device.

**Motion tokens**
| Token | Duration | Easing | Use |
|---|---|---|---|
| `quick` | 160 ms | `cubic-bezier(.2,0,0,1)` | Highlight on, marker appear |
| `base` | 280 ms | `cubic-bezier(.2,0,0,1)` | Panel slide, row settle, card settle |
| `draw` | 480 ms | `cubic-bezier(.3,0,0,1)` | Graph edges (stroke-dashoffset), timeline cursor, phone camera pan |
| `scene` | 400 ms out + 320 ms in | `cubic-bezier(.4,0,.2,1)` | Chapter change: outgoing scene fades with 4 px drift, incoming fades in |
| `type` | 30 ms per character | linear | Query typing |
| `stagger` | 40 ms per row | — | Result rows, evidence cards |

**Choreography rules**
1. One focal motion at a time; the marker appears 150 ms before its caption line.
2. A caption stays at least 2.5 s and at reading speed (about 15 characters per second); the
   next beat waits for it.
3. Only `transform` and `opacity` (and SVG stroke) animate: no layout animation, no blur, no
   parallax, no particles, no glitch or "hacker" effects, no sound.
4. Motion direction: content-level slides follow the reading direction; time-based motion
   (typing, timeline cursor, progress) is always left to right.
5. The player pauses when the tab is hidden or the player leaves the viewport; it never loops.

**Quality bar:** 60 fps on a mid-range phone profile (Chrome, 4× CPU throttle), no layout shift,
checked on your iPhone in Safari. Accessibility: a pause control at all times (WCAG 2.2.2), no
flashing (2.3.1), and reduced motion replaces every movement with a cut (2.3.3).

## 18. Splunk recording workflow and media requirements (plan only, D4)

**Status: planned.** Nothing here has been done, and no page will say it has until you have
recorded and approved it.

**A. Lab**
- Your own Splunk Enterprise instance on your lab VM (the tools listed for CF-02: Splunk,
  Linux, VMware).
- A dedicated index `soc01`. The server and user display names are set to neutral values (for
  example `soc-lab` and `analyst`) before recording, so no personal or machine names appear.

**B. Synthetic data: generate, then validate, then ingest**
1. **Generate** the full SOC-01 dataset (about 482 events, 10 Mar 12:00 → 11 Mar 09:00 UTC) from
   the scenario specification (lab proposal §3), as JSON lines whose field names follow the
   Windows Security event schema: `EventID`, `TimeCreated`, `Computer`, `TargetUserName`,
   `TargetDomainName`, `LogonType`, `IpAddress`, `IpPort`, `WorkstationName`,
   `AuthenticationPackageName`, `LogonProcessName`, `Status`, `SubStatus`, `TargetLogonId`.
   - The generator and dataset would live in the repo (synthetic, no personal data), reviewed
     like code. It is written only after you approve this plan.
2. **Validate**, before ingest, with automated checks plus your review:
   - 4624 / 4625 / 4740 fields as documented by Microsoft;
   - logon type 3 + NTLM + `NtLmSsp` for the network logon, logon type 10 + `Negotiate` + `User32`
     for the RDP session (lab proposal §11);
   - `Status 0xC000006D` with `SubStatus 0xC000006A` (wrong password) or `0xC0000064` (no such
     account);
   - 4740 caller computer recorded in `TargetDomainName`;
   - the counts the walkthrough states: 18 accounts, 17 failures, 2 successes, 7 from .77,
     02:10:05–02:16:40.
   - **Optional, strongest:** generate a few genuine reference events in your lab domain (a wrong
     password, an RDP logon) and compare their field layout with the synthetic ones. The references
     stay private.
3. **Ingest** with `sourcetype=_json`, `TIME_PREFIX`/`TIME_FORMAT` on `TimeCreated`. The
   recording says on screen that the data is synthetic and JSON-formatted with Windows field names,
   not a live Windows event feed.

**C. Searches per chapter (drafts for you to run and correct)**
```spl
# Ch1 · ALR-0418 logic (10-minute tumbling window; a production rule would use a sliding window)
index=soc01 EventID IN (4624, 4625) IpAddress!="-"
| bin _time span=10m
| stats count(eval(EventID=4625)) AS failures, count(eval(EventID=4624)) AS successes,
        values(eval(if(EventID=4624, TargetUserName, null()))) AS succeeded_as BY _time, IpAddress, Computer
| where failures>=3 AND successes>=1

# Ch1 · ALR-0419 logic
index=soc01 EventID=4625 IpAddress!="-"
| bin _time span=10m
| stats dc(TargetUserName) AS accounts, count AS failures BY _time, IpAddress
| where accounts>=10

# Ch2 · pivot on the source
index=soc01 IpAddress="203.0.113.45" earliest="03/11/2026:01:45:00" latest="03/11/2026:02:45:00"
| sort 0 _time
| table _time EventID TargetUserName Computer LogonType AuthenticationPackageName LogonProcessName SubStatus WorkstationName

# Ch2 · baseline for the account
index=soc01 EventID=4624 TargetUserName="j.morgan"
| stats count, min(_time) AS first, max(_time) AS last, values(IpAddress) AS sources,
        values(AuthenticationPackageName) AS auth, values(LogonType) AS types BY Computer
| convert ctime(first) ctime(last)

# Ch3 · where the account went next
index=soc01 EventID=4624 TargetUserName="j.morgan" earliest="03/11/2026:02:00:00" latest="03/11/2026:03:00:00"
| table _time Computer IpAddress LogonType AuthenticationPackageName

# Ch3 · the shared client name (indicator only)
index=soc01 WorkstationName="DESKTOP-7Q2M4"
| stats count, dc(TargetUserName) AS accounts, min(_time) AS first, max(_time) AS last BY IpAddress
| convert ctime(first) ctime(last)

# Ch3 · explain the lockout
index=soc01 (EventID=4740 OR TargetUserName="svc-backup")
| table _time EventID TargetUserName Computer LogonType Status SubStatus
```
Chapter 4: the kept events are tagged in Splunk (an event tag such as `soc01_evidence`) and listed
with `index=soc01 tag=soc01_evidence | sort 0 _time`. Chapter 5: your written findings (observed /
supported / unconfirmed / not determinable / next steps), in your words.

**D. Recording**
- OBS Studio, 1920 × 1080 canvas, 30 fps, high-quality master (CRF ≈ 18). Browser zoom 125–150 %
  so SPL and field values stay legible at 720p.
- A clean browser profile (no bookmarks bar, extensions or history), OS notifications off,
  Splunk dark theme, cursor highlight on, no microphone (captions first, D3).
- One take per chapter (2–5 min raw each), following §15; retakes are normal.

**E. Sanitization and approval (frame by frame)**
- No real IP addresses, hostnames, usernames, emails, licence or serial numbers, tokens or
  personal data on screen. Only the synthetic `northwind.example` values and RFC 5737 addresses.
- The raw masters stay private, on your machine, **never in the repo, `public/` or the bundle**.

**F. Media deliverables (per `docs/next-level-proposal.md` §8)**
| Asset | Spec |
|---|---|
| Walkthrough | ≤ 3 min; MP4 H.264 1080p (target ≤ 25 MB) + WebM AV1 (≤ 15 MB); 720p fallback |
| Preview clip | 6–10 s, muted, no audio track, ≤ 1.5 MB |
| Poster | AVIF + WebP still taken **from the recording** |
| Captions | WebVTT in en, he, ar, your wording, reviewed |
| Chapters | WebVTT chapters matching §15 |
| Transcript | Text in en, he, ar |
| Provenance | `own-recording` of **simulated training data**, labelled on the player |

Hosting (for example Vercel Blob) is decided only with your approval. Video files stay out of Git
history.

## 19. Exact reusable components

**Reused as is**
| File | Exports | Used for |
|---|---|---|
| `src/components/lab-mockup/data.ts` | `alerts`, `results`, `selected`, `pins` (and through `EntityGraph`: `entities`, `relations`, `hostEdges`, `selectedEntity`, `backgroundCount`; through `Histogram`: `histogram`, `brush`) | All five chapters' screen data |
| `src/components/lab-mockup/parts.tsx` | `V`, `Sev`, `Outcome`, `fill`, `Histogram` | LTR value isolation, severity and outcome marks, template fill, ch2 histogram |
| `src/components/lab-mockup/Entities.tsx` | `EntityGraph` (with internal `entityLabel`) | Ch3 relationship map (desktop and tablet) |
| `src/components/cc/SimTag.tsx` | `SimLabel` | Simulation labels (header, screen bar, entry card) |
| `src/components/lab-mockup/lab-mockup.css` | `.lm` tokens; `.lm-btn`, `.lm-label`, `.lm-review`, `.lm-sim`, `.lm-arrow`, `.lm-v`; `.lm-sev*`, `.lm-outcome`; `.lm-histo*`, `.lm-bar-*`, `.lm-key*`; `.lm-graph*`, `.lm-g-*` | Visual tokens and the reused components' styles |
| `src/content/stage.ts` | `isPreview` | Preview-only gate on the route |
| `scripts/site-stage.mjs`, `scripts/verify-preview-build.mjs`, `scripts/check-content.mjs` (leak guard) | `resolveStage`, `REVIEW_BRANCH`, pre-build check | Preview isolation (§20) |
| `tests/e2e/helpers.ts` | `axe`, `dirOf`, `locales`, `viewports` | Showcase tests |
| `tests/unit/lab-mockup-data.test.mjs` | 9 consistency tests | Guard the reused data slice |

**Lab copy keys reused** (`src/components/lab-mockup/copy.ts`; at implementation they move to a
`showcase` namespace, renamed away from retired features such as `verdict.*`):
`queue.sev`, `queue.rule`, `queue.contextBody`; `logs.cols`, `logs.outcome`, `logs.results`,
`logs.histo`, `logs.legend`, `logs.brush`; `flt.query`; `insp.name`, `insp.field`,
`insp.logonType`; `ent.groups`, `ent.legend`, `ent.mapNote`, `ent.viewMap`, `ent.group16`,
`ent.group6`; `tl.notes`, `tl.h.*.claim`; `debrief.cats`, `debrief.hWhy.h1`, `debrief.hWhy.h3`;
`verdict.f.f1/f2/f4/f5`, `verdict.a.a1/a4/a6`; `day`; `index.credit` (D7).

**Adapted (pattern reused, code rewritten)**
- `Desktop.tsx` `Learn`: optional neutral "Terms" disclosure under chapter 2.
- `Mobile.tsx` `PinFooter` "Pinned" toast style: an animation beat in chapter 4, played by the analyst.
- M1.2 phone rules (`lab-mockup.css` §M1.2): 44 px targets, safe areas, sticky rules, compact header pattern.

**Not reused (retired from the public experience; kept as research)**
- `Desktop.tsx`: `DesktopWorkspace`, `WorkspaceBar`, `Queue`, `Tabs`, `BriefingView`, `Explorer`,
  `FilterChips`, `Inspector`, `InspectorBody`, `Dock`, `ObservedList`, `WorkingHypotheses`,
  `TimelineView`, `HypothesesPanel`, `EntitiesView`, `EntityPanel`, `Stepper`, `DispositionTable`,
  `VerdictView`, `ProgressPanel`, `DebriefBody`, `DebriefView`.
- `Mobile.tsx`: all views (`MobileFlow`, sheets, pin footer, verdict, findings).
- `Entities.tsx`: `EntityTable`, `EntityDetail`, `EntityCards`, `EvidenceChips`.
- `data.ts`: `stageState`, `submittedDispositions`, `draftFindings`, `findingResults`,
  `hypotheses.submitted`.
- The answer-delivery test (it stays with the lab; the showcase has no hidden content).

**New for the showcase** (`src/components/showcase-mockup/`): `Showcase.tsx` (`ShowcaseMockup`,
scenes, `AnalystLog`, `Screen`, `Transport`, `ChapterRail`, `PlayerHead`, `Hub`, `End`,
`TextVersion`), `copy.ts`, `showcase-mockup.css`.

## 20. Safe, isolated Showcase Preview deployment plan (for approval; nothing deployed)

The existing M1.2 lab Preview (`review/phase3-lab-preview`, `dpl_EjkqbLRoU9E573mWsQBXYmMhWAoe`)
stays exactly as it is (D8).

1. **Branch:** create `review/phase3-showcase-preview` from the approved showcase commit. It is
   only ever updated by merging approved commits (no force-push).
2. **Review-only files, on that branch only:**
   - `scripts/site-stage.mjs`: `REVIEW_BRANCH = "review/phase3-showcase-preview"`;
   - `vercel.json` with the same guarded command
     (`export SITE_STAGE=preview && node scripts/verify-preview-build.mjs && npm run build`);
   - the unit test's branch list updated.

   The leak guard keeps rejecting a preview `vercel.json` on every other branch.
3. **Same project, nothing changed in it:** `eli-saad-cyber-portfolio`
   (`prj_AC18Y1OYYqgp7Hkf6BFIYhLFjJGZ`).
   - Vercel Authentication stays enabled for all deployments except custom domains.
   - 0 environment variables, no domain changes, no setting changes, GitHub not connected.
4. **Before deploying:**
   - confirm the exact commit SHA, project, protection, environment variables and domains;
   - run lint, typecheck, unit tests, the local Vercel-like build (`VERCEL=1`, `VERCEL_ENV=preview`,
     branch ref) and the preview tests;
   - run the production lock (a forced preview under `VERCEL_ENV=production` resolves to public) and
     the wrong-branch refusal;
   - run the full public-build regression, including `/showcase` and `/lab` returning 404.
5. **Deploy:** `create_deployment` from `gitSource` (org `loordxh-wq`, repo `Cybersecurity-Port`,
   `ref` = the review branch, `sha` = the exact commit), **no target** (Preview), `forceNew`.
6. **After READY:**
   - verify `target: null`, protection unchanged, the production list unchanged, and every earlier
     deployment present;
   - report the deployment URL and the branch alias. The alias name is long, so Vercel may shorten
     it with a hash; the exact alias is reported as Vercel returns it.
   - send direct EN/HE/AR links to `/showcase` frames.
7. **Contents:** the preview build of that branch also contains the preview-only `/lab` mockups and
   case files, all behind Vercel Authentication. Nothing becomes public.
8. **Stop conditions:** if the branch name is not detected, protection differs, or the pre-build
   check fails, stop and report; never bypass. The failed deployment is left as is for inspection.
9. **Withdrawal:** nothing touches Production. On request, the Showcase Preview deployment can be
   deleted without affecting the M1.2 Preview.

**Needs your explicit approval before any of this runs.**

---

# Motion study (approved 2026-10-17 as a local, isolated prototype)

Scope: chapters 2 and 3 only, on the showcase proposal branch. Preview-only route
`/[locale]/showcase/motion?chapter=2|3`; it returns 404 on public builds and is never linked. Nothing
was deployed or merged. This is not the full player.

## 21. What was built

- **A deterministic timeline engine** (`src/components/showcase-motion/timeline.ts`). Every visual
  value is a pure function of the playhead, so the study can play, pause, restart and be recorded
  frame by frame with identical results.
  - Tracks: value keyframes with easing.
  - Camera: frames named evidence areas with controlled zoom, clamped so empty space never shows.
  - Pointer: glides to targets and clicks on arrival.
  - Reduced motion uses the same engine: every change becomes a cut.
- **One clock, two compositions.**
  - Desktop shows the analyst's screen in a cinematic viewport with camera moves.
  - iPhone has its own composition: a fixed-height viewport, two-line records, an event sheet that
    rises inside the viewport, a pinned path strip for chapter 3, and a chronological card sequence.
    It is not a shrunk desktop.
- **Rendering:** the timeline writes CSS custom properties on the study root. The browser
  animates only `transform` and `opacity` (and SVG stroke reveal), with no layout animation, so
  each frame is cheap.
- **Captions** are the draft narration in EN/HE/AR. A focus label names the evidence the camera is
  on, with its technical value; it sits outside the camera, so it never scales.
- **Closing lower third** in both chapters: *What the evidence supports* and *What remains
  uncertain*.
- **No autoplay** (D5): a Play control with "Nothing plays automatically". Transport controls stay
  left to right in all languages (D6). The AI-assistance disclosure and the draft note sit under
  the player (D7, D3).
- **Answer protection:** the client receives only the lab labels it needs, picked on the server.
  The lab's debrief and model notes never reach the client bundle (checked in the build output and
  by a test).

## 22. Timing and visual decisions

| Decision | Why |
|---|---|
| Caption-led pacing: each beat lasts as long as its caption takes to read (target 17 characters/s, minimum 2.5 s) | Reading the technical point matters more than speed. Chapter 2 runs 53.5 s and chapter 3 63.7 s, longer than the storyboard's 40 s and 35 s (see §24) |
| Typing at 60 ms/character | Slow enough to read the query being written, fast enough not to stall |
| Rows stagger in over 1.6 s (≈ 85 ms apart) | Shows the result set arriving as a set, without a "loading" feel |
| Column focus in turn: timestamps → source IP → accounts → event IDs and outcomes | The order an analyst reads a result set: when, from where, against whom, with what outcome |
| Camera moves of 0.9–1.4 s, `cubic-bezier(.4,0,.2,1)`; zoom 1.0–1.45 on desktop, pan only (k = 1) on iPhone | Camera-like and calm. Zooming on a phone would make text inconsistent in size, so the phone pans between evidence areas instead |
| Pointer only on desktop (moves 0.7–0.9 s, click ring 0.45 s); touch ring only on iPhone | A mouse pointer on a phone would be a fake interaction |
| Non-focused rows dim to 38 % while the success is examined | Depth of field without blur: the evidence stays readable, the rest steps back |
| Graph edges draw in chronological order, tied to a moving playhead on a 02:08–02:36 axis; counters ("failed ×12") follow the playhead | The order of events is the point of correlation |
| Line styles carry meaning, always with words beside them: solid = observed in events; dotted = asset inventory; dashed amber = indicator only; dashed grey = not in the data | Keeps observed relationships, enrichment, unconfirmed hypotheses and absent data visibly different |
| "File activity · not in these logs" shown as an explicit dashed node | Prevents any reading that a logon proves file access or data theft |
| Lighting: one soft vignette, no glow beyond a 2 px focus ring, no particles, no 3D, no parallax, no glitch, no fake terminal | Professional restraint, per your brief |

## 23. Performance and accessibility assessment

**Accessibility (tested)**
- No autoplay. Play, Pause and Restart are real buttons with names and 44 px targets. The progress
  bar exposes its value.
- Captions are always on screen, announced politely while playing. The animated stage is one
  labelled image (training simulation, not a real incident), so assistive technology is not
  walked through moving content.
- Reduced motion: no autoplay, and every change is a cut. Verified by a test: 0.1 s into an
  entrance the value is already final, and no pointer is shown.
- axe: no violations, chapters 2 and 3, EN/HE/AR, desktop and 360 px.
- RTL: chrome and captions mirror; times, IPs, IDs, the time axis and the transport stay left to
  right; Hebrew and Arabic labels render inside the graph.
- iPhone at 360, 390 and 430: fixed viewport height through both chapters, no horizontal overflow,
  transport visible without scrolling (tested).

**Performance (measured in this container: Chromium with software rendering, no GPU, 14 s of playback; a real iPhone in Safari still needs checking)**

| Run | Normal CPU | 4× slower CPU |
|---|---|---|
| Idle page, nothing animating (baseline) | 60 fps | — |
| Desktop, chapter 2 | 53 fps · p95 frame 33 ms · 2.9 % of frames over 33 ms · 0 long tasks | 44 fps · 10.6 % over 33 ms · 53 long tasks |
| Desktop, chapter 3 | **14 fps** · p95 133 ms · 83 % over 33 ms · 0 long tasks | 10 fps |
| iPhone 390, chapter 2 | 57 fps · 2 % over 33 ms · 2 long tasks | 46 fps · 9.8 % over 33 ms |
| iPhone 390, chapter 3 | 60 fps · 0 % over 33 ms | 54 fps · 2.9 % over 33 ms |

- **Fixed during measurement:** the first build re-styled the whole scene every frame (chapter 2
  spent 743 ms of every second on style recalculation; 915 ms on iPhone). The cause was two
  per-frame values (progress, playhead) written on the study root. They are now scoped to the
  one element that reads them. Chapter 2 desktop went from 32 → 53 fps; iPhone chapter 2 from 30 → 57 fps.
  No visual change.
- **Open — desktop chapter 3.** Main-thread work is small (≈ 66 ms per second), so the limit is
  painting.
  - A diagnostic run gave 12.8 fps as built, 20.2 fps without the SVG masks and 27 fps with the
    camera frozen.
  - So the cost is re-painting the large animated SVG while it is zoomed, made worse by the masks
    used for the dashed lines.
  - Software rendering exaggerates this; a GPU device will do better, but it must be fixed before
    the full player (§24, item 1).
- Layout shift during playback: ≤ 0.0045 (iPhone chapter 2), 0 elsewhere.
- The route adds about 12 kB of JavaScript (first load ≈ 115 kB shared with the site). No video,
  canvas or WebGL.
- **The recordings are unaffected by playback speed.** They are rendered frame by frame from the
  timeline at exactly 30 fps, with no dropped or duplicated frames.

## 24. Issues to fix before the full player

1. **Length.** Readable captions make chapter 2 ≈ 54 s and chapter 3 ≈ 64 s. Either accept about
   4 min 30 s for five chapters, or tighten the narration when you rewrite it (shorter captions at
   the same reading speed).
2. **Desktop chapter 3 paint cost** (§23): replace the SVG masks with plain dashed strokes revealed by opacity, and
   draw the graph at the zoomed scale or zoom with the SVG `viewBox` instead of a CSS scale. Target ≥ 50 fps
   on a mid-range laptop and in Safari on iPhone.
3. **Reading speed.** Five captions run above the 17 characters/s target:
   - chapter 2 "evt" (EN 17.3);
   - chapter 2 "base" (AR 17.1);
   - chapter 3 "spray" (AR 17.6);
   - chapter 3 "lateral" (EN 17.0, AR 18.9).

   All stay under 20 characters/s (the test limit). Fix by shortening when you rewrite the
   narration, or by adding 0.5–1 s.
4. **Chapter 3 opening.** The first 4.8 s show only the column titles, one node and the axis. Use
   that time to show the alert-window axis more prominently, or start the playhead sooner.
5. **Desktop overview scale.** Whole-scene shots are about 0.75–0.96 zoom, so table text in the
   overview is small. Detail always comes from zoomed shots; a denser table or a taller stage would
   help.
6. **Camera crop at the edges.** Some zoomed shots cut a label at the frame edge (for example the
   asset-inventory tag in the indicator shot). Tune the target rectangles.
7. **iPhone chapter 2:** while the event sheet is up, the rows behind are only partly visible
   (intended), but the sheet could show the event time more prominently.
8. **Technical labels in English inside the graph** ("type 3 · NTLM", "type 10 · RDP"): treated as
   technical values, but HE/AR readers may prefer localized "Logon type" labels.
9. **Text-version parity:** the full player must offer the same captions as a transcript and keep
   the static text version (§7) in sync.
10. **Real-device check:** Safari on iPhone (safe areas, the shrinking toolbar, performance).
11. **Narration review (D3):** every caption is draft text for you to correct, in all three
    languages.
12. **iPhone chapter 3 opening:** at the start, the legend line sits partly under the pinned path
    strip. Push the opening frame down, or fold the legend into the strip.
