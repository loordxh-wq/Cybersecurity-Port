# Phase 2: design and implementation plan

Status: **plan for approval. No Phase 2 code has been written.**
Base: Cyber Command V4.1 (`design/cyber-command-v4.1`), approved as the visual foundation.
Rules carried over: no invented projects, experience, metrics or credentials. Simulated data is always labelled. No deployment without Eli's approval. EN/HE/AR with full RTL.

---

## 1. What exists today, and what is missing

| Area | Evidence in the repo now | Gap |
| --- | --- | --- |
| Identity, hero | V4.1 prototype at `/concepts/v4` | Not yet the real home page |
| Career | Cellcom Tier 1 support; CyberGain Blue Team SOC-track course (Splunk, QRadar, Wireshark, FortiGate, AD, Windows, Linux, PowerShell, Python); national service 2022 | Cellcom figures hidden (`cellcomMetrics.approved = false`) |
| Credentials | C\|SA (EC-Council, certification); Cisco Ethical Hacker and Networking Basics (course completions); redacted images | No verification URLs |
| Projects, labs | None | Every case study and lab needs Eli's own material |
| CV | `publicCv` is null for all languages | Redacted, approved PDFs per language |
| Contact | LinkedIn, Instagram, Facebook | `publicEmail` is null |
| Journal, roadmap | None | Eli's entries and confirmed goals |

Everything in the "Gap" column ships as a **placeholder slot**, never as made-up content (see §4).

---

## 2. Information architecture

```
/{locale}                      Home: V4.1 hero → Mission → Career signal → Featured work → Credentials strip → Open to Work band
/{locale}/about                Story, career roadmap (done / now / next), languages
/{locale}/lab                  SOC Investigation Lab (simulated, labelled)
/{locale}/projects             Case-study index (security labs + AI-assisted web development)
/{locale}/projects/[slug]      Case study: Wireshark lab, Active Directory lab, this portfolio, future items
/{locale}/certifications       Certification gallery (certifications separated from course completions)
/{locale}/journal              Learning journal index
/{locale}/journal/[slug]       Journal entry
/{locale}/contact              Open to Work, recruiter brief, CV download, contact
```

- **Navigation:** seven destinations. On desktop the command bar shows them with numbered indices. Below about 1280 px it shows Home, Lab, Projects and Contact, plus an "Index" control that opens the full-screen menu (the V4 mobile menu, reused). Mobile always uses the full-screen index.
- **Removed before any production release:** `/concepts/*`, `PrototypeBadge`, and the A/B/C prototype code.

---

## 3. Cyber Command design system (applies to every section)

**One visual axis.** The hero's signal horizon (a hairline with a travelling pulse) becomes the rule that opens every chapter: `0N — Chapter name`, drawing in on scroll. This is the thread through the site.

### Primitives to replace generic cards

| Primitive | Use | Not this |
| --- | --- | --- |
| **ChapterRule** | Section opener: mono index, localized label, drawing hairline | Big centered headings with gradients |
| **SignalLine** | Career, roadmap, journal timelines. Solid for done, dashed for next. Node fill shows type (experience, training, credential, goal) | Vertical card stacks |
| **Readout rows** | Key facts as hairline-separated rows (label + value) | Stat tiles with glows |
| **EvidencePlate** | Certificates, lab screenshots, packet views. A graphite plate with a hairline edge; a scan sweep passes over it on hover or focus; caption and provenance below | Glowing glass cards |
| **HorizonBand** | Full-bleed band for Open to Work and the lab entry: one statement, one action | Hero repeats |
| **LatticeGlyph** | Small static SVG of the core: a project's identity mark | Stock icons, random cubes |
| **SimTag** | Amber square plus "Simulated" or "Training data", always next to simulated content, localized | Hidden footnotes |
| **PendingSlot** | Placeholder for missing evidence: a dashed plate, "Evidence pending", and what will go there | Lorem ipsum, fake screenshots |

### Rules
- **One glow per viewport at most:** the WebGL core in the hero, or a scan sweep on the focused plate. Everything else stays flat type on graphite.
- **Rhythm:** alternate full-bleed bands with text columns, so two card grids never sit back to back. Section spacing uses a fixed scale (desktop 8rem / 5rem / 3rem; mobile 5rem / 3rem / 2rem), which removes the excessive empty space.
- **Type:**
  - Archivo extended for display (Latin), IBM Plex Sans Hebrew/Arabic bold for localized display.
  - Plex Sans for body.
  - JetBrains Mono for micro-labels; Arabic falls back to Plex Sans.
  - Minimum text size 12 px.
- **Colour:** graphite, navy, cyan, cobalt and violet as in V4.1. Amber is reserved for "simulated" and "pending". Green is reserved for the Open to Work status.
- **Motion:**
  - WebGL only in the home hero.
  - Everything else uses CSS or SVG, transform-only reveals (never hiding content, as in the V4.1 entrance fix), and scroll-driven drawing as progressive enhancement.
  - Reduced motion gives complete static layouts.
- **RTL:** logical properties only. Arrows and timelines mirror; the SignalLine runs right to left in HE/AR. Code, IPs, timestamps and tool names stay LTR inside `<bdi>`.

---

## 4. Evidence model (keeps everything truthful)

Every piece of content gets an explicit status in a typed content layer (`src/content/*`):

```ts
type Evidence = "placeholder" | "draft" | "approved";
```

- **approved:** rendered everywhere.
- **draft:** rendered only in protected preview builds, with a visible "Draft" tag.
- **placeholder:** rendered as a `PendingSlot` describing the evidence still needed. Whether placeholders appear in production is **Eli's decision** (D1).

A CI check fails the build if:
- an approved item lacks any of its three translations;
- an item marked `simulated` lacks its SimTag;
- a screenshot is not in the sanitized assets folder (see §6).

---

## 5. Sections in detail

### 5.1 Interactive SOC Investigation Lab (`/lab`), the flagship
- **What it is:** a guided, browser-only investigation of a **fictional** incident. Every screen carries "Training scenario · simulated data", localized.
- **Data rules:**
  - Hand-written JSON dataset.
  - IPs only from the documentation ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24).
  - Hosts and users under `example` domains.
  - No real organisations, victims or threat feeds.
  - The page never suggests Eli handled this incident.
- **Flow:** five steps, each a chapter on mobile and a two-pane workspace on desktop:
  1. **Alert:** one triggered detection (e.g. many failed logins followed by a success on a VPN account).
  2. **Triage:** severity and scope questions, answered by choosing options.
  3. **Investigate:** a filterable log table (auth, firewall, endpoint). The visitor pins evidence rows. Queries are prebuilt filters, not a fake terminal.
  4. **Timeline:** pinned events assemble on a SignalLine, with MITRE ATT&CK technique tags (public framework).
  5. **Verdict and report:** pick a verdict and recommended actions. Feedback explains the reasoning. A summary "analyst note" can be copied or printed.
- **Scope:** one scenario first (brute force → valid account → suspicious login). Two more (phishing attachment, DNS tunnelling indicators) only after Eli approves the first (D3).
- **Engineering:**
  - Client component loaded on demand; dataset fetched lazily.
  - State lives in the URL (shareable step).
  - Fully keyboard operable. Tables use real `<table>` markup with sortable headers announced to screen readers.
  - Budget: under 60 kB of JS for the lab chunk. No WebGL.
- **Visual:** not a dashboard. An editorial workspace: a large step title, a hairline-ruled log table, evidence pins as cyan ticks, and a SignalLine timeline. One focused panel at a time.

### 5.2 Security lab showcases: Wireshark and Active Directory (`/projects/[slug]`)
- **Template:** context and goal → lab setup → method (steps) → findings → what I learned → tools.
- **Wireshark:**
  - The case study is built around Eli's own captures from his lab or course.
  - Annotated packet views appear as EvidencePlates (sanitized screenshots, or a re-drawn packet table from a sanitized export).
  - Protocol focus: DNS, TCP handshake, HTTP vs TLS, ARP.
- **Active Directory:** OU and GPO design, user and group management, password policy, event IDs (4624/4625/4740), Eli's own screenshots from a lab domain (`lab.example`).
- **Until Eli supplies material,** each step shows a PendingSlot such as "Screenshot of the capture filter you used". No sample screenshots are faked.

### 5.3 AI-assisted website development (`/projects/eli-saad-portfolio` and others)
- **Authentic case study:** this portfolio itself. It covers:
  - the brief;
  - the three-language, RTL architecture;
  - design iterations (Phase 1 → 1.5 → A/B/C → V4 → V4.1), using the real screenshots from these reviews;
  - the accessibility, performance and privacy decisions (redacted certificate IDs, no private documents in the repo);
  - how AI assistance was used and what Eli directed and approved.
- **Wording to be approved by Eli** (D4), so it neither overstates nor understates his role.
- Further web projects appear only when Eli provides them.

### 5.4 Premium certification gallery (`/certifications`)
- **Two groups:** "Certifications" (C|SA) and "Course completions" (Cisco Ethical Hacker, Cisco Networking Basics), with a visible note that Cisco Ethical Hacker is a course completion, not EC-Council CEH.
- **EvidencePlate** for each: redacted image, issuer, date, kind. A lightbox with focus trap, Escape and arrow keys. "Verify" appears only when a verification URL is supplied.
- **Home strip:** one row of plates with a horizontal scan, not a card grid.

### 5.5 Career roadmap and learning journal
- **Roadmap (on `/about`):**
  - a SignalLine with "Done" (verified items only), "Now" (current study, Eli to confirm) and "Next" (goals Eli confirms, labelled "Planned");
  - target roles from `targetRoles`.
- **Journal (`/journal`):**
  - entries written by Eli (MDX per locale), each with date, tags, reading time and an optional lab link;
  - the empty state is one quiet line, not filler posts;
  - Eli is offered an entry template.

### 5.6 Approved downloadable CV
- **CV center** on `/contact` (also linked from the hero once approved).
- One PDF per language. Eli approves which contact fields appear.
- Files go through metadata stripping before commit; the procedure is documented in `docs/`.
- Until `publicCv` is set, no download button is rendered (current behaviour is kept).

### 5.7 Open to Work and recruiter contact (`/contact`)
- **HorizonBand:** "Open to: SOC trainee · Help desk · Desktop support · NOC". Region: Haifa, Nahariya, Karmiel / Northern Israel. Languages: from `about.languages`.
- **Recruiter brief:** one printable screen with name, target roles, region, languages, verified credential, course completions, tools from the course, links. Generated only from approved facts.
- **Contact:** LinkedIn now. A mailto link once Eli publishes an address. A form only if Eli wants one (D2); that would need a serverless endpoint, an email provider, spam protection and a privacy note.

### 5.8 Languages and RTL
- All UI strings live in `messages/{en,he,ar}.json`. Long-form content uses MDX per locale.
- Publishing requires all three translations; the CI check is extended.
- Native-speaker review of the HE and AR copy before production (D5).
- Per-locale metadata, `hreflang` and sitemap entries.

---

## 6. Privacy and safety rules for lab material
- **Sanitized screenshots only:** public IPs, MACs, hostnames, usernames, emails, serial numbers and certificate IDs are replaced or blurred. EXIF and metadata are removed.
- **No PCAP files are published.** Only sanitized excerpts or re-drawn tables.
- **Assets** live in `src/assets/evidence/` with a manifest recording source, sanitization date and approval.

---

## 7. Quality bars (every milestone)
- **Accessibility:** axe clean in EN/HE/AR at 360, 390 and 1440; keyboard paths for every interaction; visible focus; reduced motion complete.
- **Performance (mid-range phone):** LCP under 2.5 s, CLS under 0.05, INP under 200 ms; first-load JS per route at or under 180 kB; WebGL only on home.
- **Tests moved into the repo:** the Playwright, axe and RTL suites currently run from a scratch folder. They move into `tests/` with an `npm run test:e2e` script, so every change can rerun them.
- **No regressions:** the existing 57 site checks plus the new section checks.

---

## 8. Milestones (each ends with screenshots, recordings and a review stop)

| # | Milestone | Size | Depends on Eli for |
| --- | --- | --- | --- |
| **2.0** | Foundation: V4.1 becomes the real home; design primitives; evidence model; nav for 7 destinations; tests moved into the repo | M | — |
| **2.1** | Certifications gallery, Open to Work, recruiter brief, CV slot | S–M | CV files, email (optional) |
| **2.2** | About + career roadmap; journal shell with empty state | S | "Now" and "Next" goals, first entries |
| **2.3** | Projects framework; AI-assisted portfolio case study; Wireshark and AD showcases with PendingSlots | M | Case-study wording approval, lab screenshots |
| **2.4** | SOC Investigation Lab, scenario 1 | L | Scenario approval |
| **2.5** | Hardening: performance, accessibility, native RTL review, SEO; remove `/concepts`; **protected preview → Eli approves → production only with explicit approval** | M | Final approval |

---

## 9. Decisions and inputs needed from Eli

- **D1:** In production, should placeholders (PendingSlots) be visible ("Evidence pending") or hidden until evidence arrives?
- **D2:** Contact: mailto only (recommended, nothing stored) or also a form?
- **D3:** SOC lab: approve scenario 1 (brute force → valid account) as the first.
- **D4:** Approve the wording of the AI-assisted development case study.
- **D5:** Who reviews the Hebrew and Arabic copy?
- **Evidence:** Wireshark and AD screenshots or notes (unsanitized originals stay private; I sanitize copies), CV PDFs per language, public email, C|SA verification URL if one exists, roadmap goals, journal entries, a decision on the Cellcom figures.
