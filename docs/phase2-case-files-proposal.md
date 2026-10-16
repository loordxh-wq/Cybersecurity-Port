# Phase 2: Technical Case Files — design proposal

Status: **proposal; P1, P2, P4, P5 approved, P3 pending iPhone review.** Nothing here is implemented on the approved site.
Baseline: Phase 1 is preserved on the branch `baseline/phase1-approved` at commit `246f2ac`.
Prototype: `/{en|he|ar}/concepts/case-files`, only on the branch `proposal/phase2-case-files`. The prototype is never indexed, never linked from the site and not in the sitemap.

---

## 0. What exists today (inspected)

| Piece | Where | Reused in Phase 2 |
|---|---|---|
| Evidence model `placeholder → draft → approved` | `src/content/evidence.ts` | Yes. It drives case status and public visibility. |
| Build stage gate (`SITE_STAGE=preview`, fixed at build time) | `src/content/stage.ts`, `next.config.ts` | Yes. Non-approved cases exist only in the protected preview build. |
| Four planned projects (`socLab`, `wireshark`, `activeDirectory`, `aiPortfolio`) | `src/content/projects.json` | Replaced by `case-files.json`. `socLab` stays reserved for the future Interactive SOC Lab. |
| Sanitized evidence manifest (empty) | `src/assets/evidence/manifest.json` | Yes. Every screenshot is registered here with `sanitizedOn` / `approvedOn`. |
| Content guard (CVs, secrets, unapproved documents) | `scripts/check-content.mjs` | Extended for case files, screenshots and video (§6.4). |
| Home "Case studies in preparation" chapter (renders nothing publicly) | `CaseStudiesPreview.tsx` | Becomes a "Case Files" chapter with up to three documented cases. |
| Recruiter Brief "Verified projects" block (hidden until approved) | `recruiter/page.tsx` | Lists documented cases as text lines only. No video, no motion. |
| Design primitives: `ChapterRule`, `EvidencePlate`, `PendingSlot`, corner ticks | `src/components/cc/*` | Yes. Same hairlines, ticks and mono catalogue numbers. |

---

## 1. Page structure and information architecture

```
/{locale}/case-files                     Case Files index (new top-level page)
/{locale}/case-files/{slug}              One case file
   e.g. /en/case-files/network-traffic-investigation
/{locale}/lab                            Reserved for the future Interactive SOC Lab
```

**Navigation**
- When at least one case is documented, the header nav gains a fifth item, "Case files", between Certifications and Open to work. The recruiter pill stays as it is. If no case is documented, the item does not render.
- On the home page, the existing Case Studies chapter becomes "Case Files". It shows up to three documented cases as cards and links to the index. If no case is documented, it renders nothing, as today.
- The Recruiter Brief's "Verified projects" block lists documented cases as one line each (number, title, status), linking to the case page.
- Each case page links to its related skills on the brief, and to the previous and next cases.

**Reading layers: "recruiter first, depth on demand"**
1. **Card** (10 seconds): number, category, title, one-line objective, tools, status, evidence count.
2. **Recruiter summary** at the top of the case (30 seconds): what I did, what it shows, skills used.
3. **Full case** (3–5 minutes): objective, environment, steps (technical detail behind a disclosure), findings tied to evidence, gallery, optional video, lessons.

---

## 2. Visual direction: "Dark Forensic Editorial"

The cinematic home page is unchanged. Case Files are its calm, documentary counterpart. Think of a case dossier on a graphite desk, not a hacker movie.

| Element | Treatment |
|---|---|
| Palette | Cyber Command V4.1: graphite `#04060b`, navy wash at the top, hairlines `rgb(148 180 220 / .16)`, a cyan label colour. |
| Status colour | One accent per status, used only on the status mark and the card spine: amber = awaiting evidence, cyan = in progress, green = documented. |
| Type | Archivo display for titles (system sans in HE/AR, as today); IBM Plex body at least 15 px; JetBrains Mono for catalogue numbers (CF-01, E-01, S1) and labels. |
| Ornament | Corner registration ticks, ruled metadata rows, outlined case number. No glow, neon, scanlines, fake terminals or floating cards. |
| Motion | None on reading surfaces. Focus and hover only: border tone and a 3 px arrow nudge. Reduced-motion users see the same page. |
| Contrast | Body text at AAA (≥ 7:1), as on the Recruiter Brief. |

**Desktop.** Index: a header with a status legend, then a three-column card grid. Case page: a dossier header across the full width, then a sticky "On this page" index (15 rem) beside a 46 rem reading column.

**Mobile (iPhone Safari first).** Single column, 20 px gutters. The contents list is a collapsed disclosure. Cards stack. Gallery plates are full width. All targets are at least 44 px. The safe-area insets from Phase 1 apply. No horizontal scroll at 360 px; this is now a test.

---

## 3. Case File card

```
┌ CF-01 ─────────────────────── [▢ Awaiting evidence] ┐  ← mono number + status
│ NETWORK TRAFFIC ANALYSIS                            │  ← category (mono label)
│ Network Traffic Investigation                       │  ← title = the link
│ Planned: follow DNS lookups, the TCP handshake…     │  ← one-line objective
│ ─────────────────────────────────────────────────── │
│ – Personal home lab · not employment                │  ← provenance, always
│ [Wireshark] [Kali Linux] [VirtualBox]               │  ← tools
│ ▭▭▭ 0 of 3 evidence items                           │  ← honest evidence meter
│ Open case file →                                    │
└─────────────────────────────────────────────────────┘
  ↑ 2 px spine in the status colour
```

- The whole card is one link: the title link stretches over the card. There is one tab stop and one screen-reader name.
- The objective of a planned case always starts with "Planned:". A documented case states what was done.
- The evidence meter counts only approved, sanitized items. It never shows more than the manifest holds.

---

## 4. Individual case page layout

1. **Breadcrumb**: All case files / CF-01.
2. **Dossier header**: outlined case number, status, category, title, provenance line, then ruled facts (lab environment, tools, evidence meter, last updated).
3. **Status notice**: shown whenever the case is not documented (preview only).
4. **On this page**: sticky on desktop, a disclosure on phones.
5. **Sections**, numbered 01–09:
   - 01 **Recruiter summary**: what I did / what it shows / skills used.
   - 02 **Objective**: the question the investigation answers.
   - 03 **Lab environment and tools**: VMs, network isolation, versions.
   - 04 **Investigation or implementation steps**: S1…Sn. Each step has a title, one sentence of reasoning, and a "Technical detail" disclosure for the filter, query or console used. Inline code only, never pasted terminal output.
   - 05 **Findings and observations**: one sentence per observation, each citing an evidence item ("see E-02").
   - 06 **Evidence gallery**: figures E-01…En with caption and sanitization date. They open full size in the accessible dialog used for certificates.
   - 07 **Walkthrough video** (optional): poster frame. It plays only when pressed, has captions in three languages and a transcript below.
   - 08 **Lessons learned**: what I'd do differently and what's next.
   - 09 **Related skills**: links to the skill entries on the Recruiter Brief.
6. **Pager**: previous and next case.

In the prototype, every section that needs real evidence shows a dashed slot that says what will go there. It is never filler text.

---

## 5. Evidence and video integration

**Screenshots (the evidence gallery)**
1. Eli sends the raw captures privately. They never go into Git as raw files.
2. I review each frame for personal data, internal IPs, MACs, hostnames, usernames, emails, tokens, licence banners and watermarks. Then I crop or blur, strip metadata and export AVIF plus a JPEG fallback (≤ 200 KB at 1600 px).
3. The sanitized file goes in `src/assets/evidence/` with a manifest entry: `{ file, source: "own-lab", sanitizedOn, approvedOn }`.
4. Rendered with `next/image` (responsive sizes, blur placeholder, explicit dimensions, no layout shift).

**Video (optional per case)** — this follows the approved Technical Operations Showcase plan:
- Provenance is limited to `own-recording` or `simulated-demo`. Third-party footage cannot be registered at all. The three earlier sample clips stay storyboards only.
- **8 s preview**: AV1/WebM (≤ 150 KB) plus an H.264 fallback, muted, `preload="none"`. It plays only in view, and not at all with reduced motion, Save-Data or a slow connection, where the poster shows instead.
- **30–60 s walkthrough**: user-started, native controls, captions (EN/HE/AR) on by default, transcript below.
- Hosting stays outside Git and `public/`. Vercel Blob is provisionally approved, after a review of pricing, privacy, storage and bandwidth. The CSP `media-src` is added at that point.
- Never autoplays on the Recruiter Brief, the home page or in print.

---

## 6. Data model and content status controls

### 6.1 `src/content/case-files.json` (structure; all wording lives in messages)

```jsonc
{
  "cases": [
    {
      "id": "wireshark",
      "number": "CF-01",
      "slug": "network-traffic-investigation",
      "category": "network",              // network | siem | identity | …
      "status": "placeholder",            // placeholder | draft | approved
      "provenance": "personal-lab",       // the only allowed value: never employment
      "tools": ["Wireshark", "Kali Linux", "VirtualBox"],
      "skills": ["wiresharkSiem", "network"],   // ids from src/content/skills.ts
      "steps": ["capture", "filter", "stream"], // keys under caseFiles.<id>.steps
      "evidence": ["cf01-e01.avif"],      // must exist in the evidence manifest, approved
      "video": null,                      // or a media.json id (own-recording only)
      "updatedOn": null,                  // set when the write-up is approved
      "approvedOn": null
    }
  ]
}
```

Messages: `caseFiles.items.<id>.{title, objective, environment, summary.did, summary.shows, steps.<key>.{title, why, detail}, findings.<n>, lessons}` in en/he/ar.

### 6.2 Status in the interface

| Data | Label | Public build | Protected preview build |
|---|---|---|---|
| `placeholder` | Awaiting evidence | hidden (no card, no page, no route) | card + page with slots |
| `draft` | In progress | hidden | card + page, "In progress" notice |
| `approved` | Documented | shown | shown |

Hidden means the case is absent from the static output: `generateStaticParams` emits only visible cases and `dynamicParams = false`, so an unapproved slug returns 404 on the public site, not an empty page.

### 6.3 Extensibility for the Interactive SOC Lab (not built)
- Each case gets a `kind` field: `"case"` now, `"interactive"` later. The lab will be a case with `kind: "interactive"` and `simulated: true`. It is always labelled "Simulated training lab" and lives at `/lab`, with its scenario data in its own module.
- The status model, provenance rules, guard and status pill are shared, so the lab inherits the same integrity controls.

### 6.4 Guard extensions (`npm run check:content`, run on every build)
A build fails if:
- an `approved` case lists evidence that is missing from the manifest, or not approved there;
- an `approved` case lacks any message key in any of the three languages;
- a case has a provenance other than `personal-lab`, or a video whose provenance is not `own-recording` or `simulated-demo`;
- any `.mp4`, `.webm` or `.mov` file is tracked in Git;
- an evidence image carries EXIF/XMP metadata;
- a case's text contains an IPv4 or IPv6 address outside documentation ranges, a MAC address or an email address (pattern check with an allow-list for `lab.local` and RFC 5737 examples).

---

## 7. Implementation milestones (each one reviewed before the next)

| # | Milestone | Ships to public? |
|---|---|---|
| 2.1 | Data model, guard extensions, unit tests; routes `/case-files` and `/case-files/[slug]` (preview-only content) | No (nothing approved) |
| 2.2 | Case Files index + card, status legend, home chapter swap, nav item logic | No |
| 2.3 | Case page template (dossier header, contents, sections, steps disclosure, pager) | No |
| 2.4 | Evidence gallery: sanitization checklist, manifest, figures, full-size dialog | No |
| 2.5 | Video component (poster, preview rules, captions, transcript), after the Blob review | No |
| 2.6 | **CF-01 Wireshark**: first real case from Eli's own recordings and screenshots, in three languages | After Eli approves the content |
| 2.7 | CF-02 Splunk and CF-03 Active Directory, same process | After approval |
| 2.8 | Recruiter Brief "Verified projects" lines, sitemap and structured data for documented cases | With the first approved case |

Each milestone gets its own branch, a protected Preview only when Eli asks, and no merge without approval.

---

## 8. Test and accessibility strategy

**Unit (node:test)**: guard rules (§6.4), visibility rules, the three-language key completeness of approved cases.

**End to end (Playwright, extending the 152 Phase 1 tests)**
- Public build: no case route or card exists for non-approved cases; nav item and home chapter absent; sitemap free of case URLs.
- Preview build (`npm run test:e2e:preview`): placeholders visible and marked; every step of a planned case says "Planned"; no images or video on cases without evidence.
- Layout: 360 / 390 / desktop × EN / HE / AR, `scrollWidth ≤ clientWidth`. The prototype already caught and fixed one real overflow (aspect-ratio box with long HE/AR text).
- Accessibility: axe (WCAG 2.1 AA + best practice) on every case page in three languages; one link per card; disclosures open with Enter and Space; contents links land below the fixed header; dialog focus trap and return.
- Media: `preload="none"`, nothing plays with reduced motion, captions present in three languages, no autoplay on the brief.
- Performance: LCP and CLS budgets on the index and a case page (CLS ≤ 0.02), images ≤ 200 KB, no WebGL on Case Files.
- Integrity regression: a case page never renders a findings sentence without an evidence reference.

---

## 9. Decisions (Eli, 2026-10-16)

- **P1 — Approved:** route `/case-files`.
- **P2 — Approved:** "Case files" joins the main navigation only after the first case is documented, approved and publicly available.
- **P3 — Provisionally approved:** final design approval after Eli reviews the prototype on his iPhone (protected Preview of `proposal/phase2-case-files`).
- **P4 — Approved:** CF-01 Wireshark is the first case, built from Eli's own lab evidence.
- **P5 — Decided:** the architecture supports original video walkthroughs, but video is **optional** for publishing. CF-01 can ship with authentic, sanitized screenshots and well-documented findings only. The guard must not require a video; when a video is present, it must be `own-recording` with captions in all three languages.

Not started: full Phase 2 implementation, merge, production deployment.
