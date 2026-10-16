# Cyber Command: next-level proposal

Status: **design proposal for approval. No feature code has been written.**
Base: `feature/recruitment-flexible-location-cv` (Cyber Command V4.1 plus milestone 2.0 plus the recruitment update). This proposal lives on `proposal/next-level-recruiter-experience` (documentation only).

**Goal:** keep the approved identity and make the site *read* as well as it *looks*. A recruiter gets the facts in 30 seconds. A technical reviewer finds evidence, not adjectives. Every line on the site is true and traceable to a fact, a certificate or an approved file.

---

## 0. Ground rules this proposal follows

1. **No invented content.** Today the real evidence is:
   - Tier 1 support at Cellcom.
   - The Cyber Gain Center Blue Team course (SOC track).
   - The EC-Council C|SA certification.
   - Two Cisco Networking Academy course completions.
   - The tool list from the course.
   - This portfolio itself (an AI-assisted build with a real review history).

   Wireshark and Active Directory case files need your material. Until it exists they are not shown publicly; the evidence model from milestone 2.0 already enforces this.
2. **Simulations are always labelled.** Every simulated item carries the amber "Simulated training lab" label at the top and next to every artefact, in all three languages.
3. **The identity is preserved.** Graphite and navy, cyan signal, the horizon rule, Archivo display type and the WebGL core on the home page stay. Nothing is redesigned from scratch.
4. **Readability wins conflicts.** Where an effect competes with text, the effect moves or goes.

---

## 1. Information architecture

```
Home ─────────────── the V4.1 experience (identity, story, proof, contact)
│
├─ Recruiter brief ── /{locale}/recruiter          NEW · the 30-second page
├─ Case files ─────── /{locale}/projects           NEW · index (only when ≥1 approved)
│   └─ Case file ──── /{locale}/projects/[slug]    NEW · one investigation-style write-up
├─ Skills ─────────── /{locale}/skills             NEW · skills with evidence
├─ Credentials ────── /{locale}/certifications     REFINED · exhibition
├─ About ──────────── /{locale}/about              unchanged now; roadmap later
└─ Open to work ───── /{locale}/contact            existing · flexible location + CV request
```

### Navigation
- **Desktop bar:** 01 Home · 02 Case files* · 03 Skills · 04 Credentials · 05 About, then the language links and a **"For recruiters"** button (outlined, always visible).
  - The "Open to work" page moves into the recruiter flow: it stays reachable from the brief, the footer and the CV dialog. This keeps the bar to five items plus one clear action.
- **Mobile header:** the brand mark, a compact **"Recruiters"** pill and the menu button. The full-screen index lists every destination, and the CV request sits at its foot.
- \* **Case files** appears in navigation only once at least one case file is approved. Until then the link is absent: no empty page, no "coming soon".

### Recruiter path, three ways in, all on the first screen
1. The header button **"For recruiters"**.
2. A hero action: **"Recruiter brief"** next to **"Request My CV"** (see §2.1, decision D1).
3. A shareable link: `/{locale}/recruiter` works when sent directly, and it prints cleanly.

---

## 2. Section-by-section design

Wireframes use `▓` for display type, `—` for the horizon rule, `[ ]` for actions and `▢` for evidence plates. LTR is shown; RTL mirrors every layout through logical properties.

### 2.1 Home (refined, not redesigned)

**Hero changes**
- Actions become: primary **Request My CV**, which opens the existing dialog, and secondary **Recruiter brief**, which goes to the 30-second page. "See my certificates" moves to the credentials chapter, where it belongs.
- The status pill stays: "Open to Work | Flexible Location".

**Chapters after the hero**
- Order: Mission → Career trajectory → **Proof** → Credentials → Open to work → CV.
- **Proof** is new. It is one row, not a card grid, linking to Skills (always) and Case files (only when approved).

**Readability fixes** (see §4 for the measures)
- The Open to Work band's moving grid floor no longer runs behind text. It sits beneath the content as a closing horizon.
- Headline white is softened from `#fff` to `#F2F5FA`.

```
DESKTOP 1440                                   MOBILE 390
┌──────────────────────────────────────────┐   ┌──────────────────┐
│ ● ELI SAAD  01 02 03 04 05   EN HE AR [For recruiters] │ ● ELI SAAD [Rec.]≡│
│                                          │   │   (core + face)  │
│ ● Open to Work | Flexible Location   ◯   │   │ ● Open to Work…  │
│ ▓▓▓ ELI ────────────────────────── (core)│   │ ▓▓ ELI           │
│ ▓▓▓ SAAD                                 │   │ ▓▓ SAAD          │
│ Aspiring SOC Analyst | Blue Team & IT    │   │ Aspiring SOC…    │
│ [Request My CV]  Recruiter brief →       │   │ [Request My CV]  │
│                                          │   │ Recruiter brief →│
└──────────────────────────────────────────┘   └──────────────────┘
 … 02 Mission · 03 Career · 04 Proof · 05 Credentials · 06 Open to work · 07 CV
```

**Proof chapter** (new, compact)
```
— 04 Proof ———————————————————————————————————————————
 Skills with evidence →    9 skills · each linked to a course, certificate or case file
 Case files →              (row hidden until a case file is approved)
```

### 2.2 Recruiter brief (Recruiter Focus Mode)

**Purpose:** everything a recruiter needs, in the order they need it, readable in 30 seconds and printable on one A4 page.

**Mode, not a different site**
- The same header and footer, but **no WebGL, no animated backgrounds and no decorative glow**.
- One cyan hairline per section, with a 68-character reading width.
- It reads like a dossier: calm, dense and scannable.

**Content blocks, in order (all from existing, verified facts)**

| # | Block | Content | Source |
|---|---|---|---|
| 1 | Identity | Name (localized + Latin), role line, status pill "Open to Work · Flexible Location", languages | hero, about |
| 2 | Direction | One sentence: entry-level SOC / Blue Team, help desk, IT support, desktop support, NOC | openToWork.roles |
| 3 | Experience | Cellcom Tier 1 support: 3 bullets, each with its skill tag (troubleshooting, DNS/TCP-IP, documentation and escalation) | timeline.cellcom |
| 4 | Training | Cyber Gain Center Blue Team SOC-track course: 4 bullets and the tool line | timeline.cyberGain |
| 5 | Credentials | C\|SA (certification, issued date) and two course completions, each labelled with its type | facts.credentials |
| 6 | Verified projects | Approved case files only, one line each (title · type · "Simulated" label if any). **The block is omitted** while none are approved | projects.json |
| 7 | Contact | [Request My CV] (the existing dialog) · [LinkedIn] · the note "CV shared personally on request" | cv, social |

**30-second guarantee, measured**
- At 390×844, blocks 1 and 2 plus the CV action are on the first screen.
- Blocks 3 to 5 fit within the next two screens.
- Block 7 is always one tap away through a slim **sticky action bar** at the bottom of the screen on mobile (Request My CV · LinkedIn). It appears only on this page and does not cover content; the page reserves space for it.

```
MOBILE 390 (screen 1)                 DESKTOP 1440
┌──────────────────────┐              ┌──────────────────────────────────────────┐
│ — Recruiter brief    │              │ — Recruiter brief                         │
│ ▓ Eli Saad           │              │ ▓ Eli Saad          │ Contact             │
│ Aspiring SOC Analyst │              │ Aspiring SOC …      │ [Request My CV]     │
│ ● Open to Work ·     │              │ ● Open to Work …    │ [LinkedIn]          │
│   Flexible Location  │              │ AR · HE · EN        │ CV shared personally│
│ AR · HE · EN         │              │─────────────────────│ (sticky on desktop) │
│──────────────────────│              │ Direction           │                     │
│ Direction            │              │ Experience          │                     │
│ SOC · Blue Team · …  │              │ Training            │                     │
│──────────────────────│              │ Credentials         │                     │
│ Experience …         │              │ Verified projects*  │                     │
├──────────────────────┤              └──────────────────────────────────────────┘
│[Request My CV][in]   │ ← sticky bar
└──────────────────────┘
```

**Extras that earn their place**
- **Print / save as PDF:** a print stylesheet producing one clean A4 page, with no phone number (the number stays inside the dialog). This is a printable *brief*, not your CV.
- **Copy link:** copies the brief's URL in the current language, so a recruiter can forward it internally.
- **No tracking and no analytics** on this page.

### 2.3 Case files (investigation-style projects)

**Index** (`/projects`, public only once at least one case file is approved)
- A ledger, not a card grid: each row shows a case ID, title, type, status, the skills demonstrated and its date.
- Filter chips by skill (Wireshark, Active Directory, Windows, SOC/SIEM) are plain links that filter the list. They don't animate the layout.

```
— Case files ————————————————————————————————————————————
CF-01  AI-assisted portfolio build      Web · Real project        Next.js · i18n/RTL · a11y   2026-10
CF-02  Wireshark traffic analysis       Lab · Own capture         Wireshark · DNS · TCP/TLS   (when approved)
CF-03  Suspicious authentication        ■ Simulated training lab  SOC/SIEM · Auth logs        (milestone 2.4)
```

**Case file page:** one fixed structure every time, so reviewers learn it once.

| Section | Content | Rules |
|---|---|---|
| Header | Case ID, title, type, status, date, skills demonstrated | A simulated case shows the amber **SIMULATED TRAINING LAB** banner at the top, before any content |
| 01 Objective | What question the work answers, in 2–3 sentences | |
| 02 Environment & tools | Readout rows: environment, OS, tools, data source | A data source that is fictional says so |
| 03 Methodology | A numbered step line (the career signal line, vertical) with what was done and why at each step | |
| 04 Evidence | Evidence plates: sanitized screenshots or redrawn tables, each with caption, provenance ("own lab capture" or "simulated dataset"), sanitized date, and redaction marks shown honestly as black bars labelled "redacted" | Only files listed in the evidence manifest |
| 05 Findings | What the evidence shows, each finding linked to the plate that supports it | No claim without a plate |
| 06 Lessons learned | 2–4 points: what you would do differently, what you learned | |
| Footer | "Skills demonstrated" links to Skills; previous/next case | |

```
MOBILE 390                            DESKTOP 1440
┌──────────────────────┐              ┌──────────────────────────────────────────┐
│ CF-02 · Lab          │              │ CF-02 · Lab · Own capture   2026-10       │
│ ▓ Wireshark traffic  │              │ ▓ Wireshark traffic analysis              │
│   analysis           │              │ ─────────────────────────────────────── │
│ [01][02][03][04]…    │ ← jump links │ On this case │ 01 Objective                │
│ — 01 Objective       │   (no hijack)│ 01 Objective │ …                           │
│ …                    │              │ 02 Env       │ 02 Environment & tools      │
│ — 04 Evidence        │              │ 03 Method    │ ▢ Evidence plate · caption  │
│ ▢ plate              │              │ 04 Evidence  │   provenance · redacted bars│
│ caption · provenance │              │ 05 Findings  │                             │
└──────────────────────┘              └──────────────────────────────────────────┘
```

**First case files, in honest order**
1. **CF-01 AI-assisted portfolio build** (real; evidence already exists: review screenshots, branch history, test results). It separates clearly **"Directed by Eli"** (brief, design decisions, approvals, content truth) from **"Generated with AI"** (code, tests). Wording needs your approval (decision D4, already agreed in principle).
2. **CF-02 Wireshark** and **CF-03 Active Directory:** only when you provide sanitized captures or screenshots.
3. **SOC investigation lab** (milestone 2.4): a simulated case file with the interactive workstation inside its Evidence section.

### 2.4 Premium credentials gallery (`/certifications`, refined)

**Two tiers, explained in one sentence each**
- **Professional certification:** "Earned by passing the issuing body's certification exam." C|SA is shown as the main exhibit: large plate, issuer, issue date, what the exam covers, and verification status ("Verification details available on request", unless you supply a verification link).
- **Course completions:** "Awarded for completing a course; not an exam-based certification." The two Cisco plates are smaller, in a quiet row, each with its type label. Cisco Ethical Hacker carries the visible note "Course completion, not the EC-Council CEH certification".

**Interactions**
- The existing accessible viewer (focus trap, Escape, backdrop close) is reused, with arrow keys added to move between plates.
- A plate's scan sweep runs once on hover or focus, and never while you read.
- Certificate numbers remain redacted in the images.

```
— Credentials ———————————————————————————————————
 Professional certification
 ▢▢▢▢▢▢▢▢▢▢▢▢▢  EX-01 ● Certification
 ▢  C|SA plate ▢  Certified SOC Analyst (C|SA)
 ▢▢▢▢▢▢▢▢▢▢▢▢▢  EC-Council · Issued 2 Oct 2026
                Covers: SOC workflows, SIEM detection, triage
                Verification: details on request
 Course completions
 ▢ EX-02 ○ Ethical Hacker (Cisco NetAcad) · course, not CEH
 ▢ EX-03 ○ Networking Basics (Cisco NetAcad)
```

### 2.5 Skills with evidence (`/skills`)

**No percentages, no bars, no star ratings.** Each skill is described by the *kind* of evidence behind it. A reviewer can open every piece of evidence.

**Evidence levels** (shown as a small legend, in words, colour-independent)

| Level | Meaning | Example source |
|---|---|---|
| **Trained** | Covered in formal training | Cyber Gain Center course |
| **Certified** | Assessed by an exam | C\|SA |
| **Used at work** | Applied in a job | Cellcom Tier 1 |
| **Demonstrated** | Shown in an approved case file with evidence | Case files (when approved) |

**Layout:** an evidence map, not a card grid.
- Rows are grouped by domain: Network analysis · Identity & endpoint · SOC & detection · Support & communication.
- Each row shows the skill, evidence chips (one per real source, each a link) and a one-line "what I can do with it".

```
— Skills with evidence ————————————————————————————————————————
Network analysis
  Wireshark           Trained ↗ (Cyber Gain)                     Read captures, follow TCP/DNS conversations
  TCP/IP · DNS        Used at work ↗ (Cellcom) · Trained ↗        Troubleshoot connectivity layer by layer
Identity & endpoint
  Active Directory    Trained ↗ (Cyber Gain)                      Users, groups, policies in a lab domain
  Windows / Linux     Trained ↗                                   Admin and support tasks
SOC & detection
  SIEM (Splunk, QRadar) Trained ↗ · Certified ↗ (C|SA)            Monitor and triage security events
  Incident triage     Certified ↗ (C|SA)
Support & communication
  Ticket documentation · escalation   Used at work ↗ (Cellcom)
```

- **Rules:** a skill appears only with at least one real source. "Demonstrated" chips appear automatically when a case file listing that skill is approved. One data file (`skills.json`) maps each skill to sources, and the content check rejects a skill without a source.

### 2.6 Recruitment experience
- **Unchanged and kept:** flexible location across Israel; the private **Request My CV** workflow. The phone number is shown only inside the dialog, and the CV is never published.
- **More prominent:**
  - the header button "For recruiters" on every page;
  - the hero primary action "Request My CV";
  - the sticky contact bar on the brief (mobile) and a sticky contact column (desktop);
  - a "Request My CV" entry at the foot of the mobile menu.
- **No new personal details** are published: no email, no address, no form. LinkedIn stays.

---

## 3. Component and interaction specifications

| Component | Purpose | Behaviour | Accessibility |
|---|---|---|---|
| `RecruiterButton` (header) | One constant way in for recruiters | Link to `/recruiter`; outlined on desktop, a pill on mobile | Real link, visible focus, 44×44 target |
| `CvRequestDialog` (existing) | Private CV workflow | Reused everywhere; opened by hero, brief, menu and CV chapter | Native `<dialog>`, focus in and restored, Escape, already tested |
| `BriefBlock` | One recruiter fact group | Hairline rule, label and content; no motion | `<section>` with heading; reads in order |
| `StickyActionBar` (brief, mobile) | Contact always reachable | Bottom bar with 2 actions; page reserves its height; hides while the dialog is open | Inside `<aside>` landmark, labelled "Contact"; does not trap focus |
| `CaseLedger` | Case-file index | Rows; skill filter links change the URL (`?skill=wireshark`), so they work without JS | List semantics; the filter state is announced |
| `CaseHeader` | Case identity and simulation status | Amber banner for simulated cases, at the top | The banner is text, in the heading's region |
| `MethodLine` | Steps of the method | The vertical signal line from the career chapter; static | Ordered list |
| `EvidencePlate` (extended) | Real evidence | Caption, provenance, sanitized date; redactions as labelled bars | Meaningful alt text; redaction label read aloud |
| `FindingLink` | Ties findings to evidence | "See evidence EV-2" jumps to the plate and highlights it once | In-page link with a visible focus target |
| `CaseToc` | Navigation inside a long case | Desktop: sticky side list; mobile: a row of jump links at the top. Plain anchors, no scroll hijacking | `<nav aria-label>`; current section marked |
| `EvidenceMap` | Skills with evidence | Grouped rows; chips are links to the source | Table semantics on desktop, list on mobile; levels in words |
| `CredentialTier` | Certification vs completion | Two labelled groups with one-sentence definitions | Group headings; type label in text, not colour |
| `PrintBrief` | One-page A4 brief | `@media print`: no effects, black on white, links printed as text, phone excluded | — |

**Interaction principles:**
- No scroll hijacking, no parallax on text, no auto-playing carousels.
- Motion only runs on user action (hover, focus, opening) or as a one-off line drawing when a chapter enters.
- Every motion has a static reduced-motion equivalent.

---

## 4. Visual comfort system (applies site-wide)

| Token | Value | Why |
|---|---|---|
| Body text | 17 px; line-height 1.7 (EN), 1.75 (HE), 1.85 (AR) | Comfortable reading in all three scripts |
| Small text | 15 px minimum for content; 12 px only for mono micro-labels | Labels stay legible; content never small |
| Reading width | 68ch (EN/HE), 62ch (AR) | Line length for sustained reading |
| Text colours | Primary `#E8EEF6`; secondary `rgb(232 238 246 / 0.74)`; headings `#F2F5FA` | Strong contrast without pure-white glare |
| Contrast | Body ≥ 7:1 (AAA); secondary and labels ≥ 4.5:1; never measured against an effect | Strong without harsh |
| Background | Graphite `#05070C`; navy light only in hero, CV seal and the credential exhibit | Glow reserved for one place per screen |
| Spacing | Section rhythm 64 / 96 px (mobile / desktop); headings to content 24–32 px | No empty half-screens |
| Effects behind text | **None.** Scene, grid floor and glows never sit under paragraphs | Readability |
| Cards | Not used for content; plates only for real artefacts | No repetitive glowing cards |

Mobile at 360/390: single column, 20 px gutters, primary actions full-width when stacked, no horizontal scrolling anywhere (code and IPs wrap or scroll inside their own box).

---

## 5. Prioritized implementation plan

Each step ends with screenshots (360, 390, desktop × EN/HE/AR), recordings, the full test suite and a review stop. Each runs on its own branch from the approved base. Nothing is merged or deployed without your approval.

| Priority | Step | Why first | Depends on you for |
|---|---|---|---|
| **P1** | Comfort tokens site-wide (§4) and recruiter entry points: header button, hero actions, menu entry | Biggest readability and usability gain for everyone, small risk | — |
| **P2** | **Recruiter brief** with print page and sticky contact | The 30-second goal; uses only existing facts | — |
| **P3** | **Credentials gallery** refinement (two tiers, definitions, verification status) | Real evidence, high recruiter value | A C\|SA verification link, if you have one |
| **P4** | **Skills with evidence** (evidence map plus `skills.json` with checks) | Replaces adjectives with sources; works today with course, certificate and work evidence | Confirm the skill list and one-line descriptions |
| **P5** | **Case file system** plus **CF-01 AI-assisted portfolio build** | The template and the first real case file | Approve the CF-01 wording ("directed by Eli" vs "generated with AI") |
| **P6** | CF-02 Wireshark, CF-03 Active Directory | Only with your material | Sanitized captures and screenshots |
| **P7** | SOC investigation lab as a simulated case file (milestone 2.4) | Largest build; benefits from the case-file system | Scenario wording review |

The earlier milestone plan maps as follows: 2.1 becomes P1–P3, 2.2's roadmap and journal follow P5, and 2.4 becomes P7.

---

## 6. Acceptance criteria

### Recruiter experience
- At 390×844 and 360×800, the brief shows name, direction, status and **Request My CV** on the first screen. Experience, training and credentials fit within three screens.
- **Request My CV** is reachable in one tap from every page: header or menu, hero, brief bar and CV chapter.
- No PDF, no email address, no form and no new personal details. The phone number appears only inside the dialog (an existing test, extended to the new pages).

### Accessibility (all pages, EN/HE/AR, 360/390/1440)
- WCAG 2.2 AA throughout, with **AAA contrast (≥ 7:1) for body text**. axe reports zero violations.
- Keyboard: every action is reachable, focus is always visible, the dialog traps and restores focus, and there are no keyboard traps.
- Usable at 200% zoom and with the WCAG text-spacing override, with no loss of content.
- Targets are at least 24×24 px, and 44×44 px for primary actions.
- Reduced motion: no animation besides instant state changes, and all content is visible.
- RTL: mirrored layout. Numbers, IPs, code and tool names are isolated LTR. Arabic never uses the mono face.
- Screen reader: one `h1`, logical heading order, landmarks, simulation labels read before simulated content.

### Performance (mid-range phone, 4× CPU, 4G profile)
- **LCP ≤ 2.5 s** and **CLS ≤ 0.05** on every page. **INP ≤ 200 ms** for the dialog, filters and viewer.
- **First-load JS:**

  | Page | Budget |
  |---|---|
  | Recruiter brief | ≤ 120 kB |
  | Case file | ≤ 150 kB |
  | Home (excluding the lazy WebGL chunk) | ≤ 180 kB |

- **WebGL loads on the home page only.** The brief, skills, credentials and case files contain no canvas.
- Images: AVIF/WebP, sized per breakpoint, lazy below the fold. Evidence images at most 250 kB each.

### Truthfulness (automated where possible)
- **The content check fails the build if:**
  - a skill has no source;
  - a case file lacks an approved status or its evidence manifest entries;
  - a simulated case lacks its label;
  - a translation is missing.
- Every finding in a case file links to an evidence plate.

---

## 7. Decisions needed before implementation

- **D1 (hero actions):** primary **Request My CV** + secondary **Recruiter brief** (recommended), or keep **Contact me** as primary?
- **D2 (navigation):** five items plus a **For recruiters** button, with "Open to work" moved into the recruiter flow (recommended), or keep "Open to work" in the bar?
- **D3 (brief URL):** `/recruiter` (recommended) or `/brief`? Should the brief be indexed by search engines (recommended: yes; it contains only public facts)?
- **D4 (print brief):** include a print/save-as-PDF of the *brief* (public facts only, no phone, not your CV)? Recommended: yes.
- **D5 (skills list):** confirm the skills and their sources in §2.5, and add anything you have real evidence for.
- **D6 (start point):** begin with P1 + P2 together as the first reviewable step (recommended)?
