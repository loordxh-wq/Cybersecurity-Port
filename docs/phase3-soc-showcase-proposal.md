# Phase 3 (revised): SOC Investigation Showcase — See How I Investigate

Product concept, visitor journey, storyboard and mockups. **Proposal only.** Nothing here is
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
  "Scenario and dataset designed by Eli Saad." Before anything goes public, Eli chooses a credit
  line that is accurate (decision D7). The page will not overstate authorship.
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

## 5. Storyboard (SOC-01, about 2 min 40 s)

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
