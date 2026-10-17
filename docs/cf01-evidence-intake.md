# CF-01 Network Traffic Investigation — evidence intake

CF-01 is built and waiting for evidence: status **Planned** (internally `placeholder`), visible only in the protected preview, absent from the public site (404, no nav item, no sitemap entry, no footer statement). Nothing in it is written until Eli's own lab material arrives.

## 1. What Eli sends (privately, never through Git)
Upload a ZIP to the session containing:

| Item | Required | Notes |
|---|---|---|
| 3–6 screenshots from your own Wireshark lab | yes | PNG, full resolution. Suggested set: capture running on the lab interface; a display filter applied to one conversation; packet details with protocol layers expanded; Follow → TCP Stream; Statistics → Conversations. |
| Your step log | yes | For each step: what you did, the filter or menu used, and why. Plain notes in any language are fine. |
| What you observed | yes | One line per observation, in your own words, each pointing at a screenshot ("in shot 3 the SYN, SYN-ACK and ACK are visible"). These become the findings. |
| What you would do differently / learn next | yes | Two or three lines; become "Lessons learned". |
| The .pcapng capture | optional | Helps me check that the screenshots and findings match. Stays private; never published. |
| Walkthrough video | optional | Not needed for CF-01 (decision P5). If sent: your own recording, per the recording guide. |

Follow the recording guide's privacy checklist when capturing: host-only network, neutral hostname, no personal accounts, no bookmarks, notifications, email addresses or licence banners on screen.

## 2. What I do with it
1. **Review every screenshot** for personal data, real or internal IP addresses, MAC addresses, hostnames, usernames, email addresses, tokens and watermarks. Anything sensitive is cropped or blurred, never edited to show something different.
2. **Strip metadata** and export PNG (and AVIF when smaller), at most about 200 KB each at 1600 px. The guard rejects any image that still carries EXIF/XMP/text metadata.
3. **Register** each file in `src/assets/evidence/manifest.json` (`source: own-lab`, `sanitizedOn`) and in `src/content/evidence-images.ts`.
4. **Draft the write-up from your notes only**, in English, Hebrew and Arabic: recruiter summary (what you did / what it shows), steps (the planned steps become your actual steps, with your filters), findings (each tied to E-01, E-02…), lessons. No finding without a screenshot behind it, and no claim beyond what the screenshots show.
5. **Case text check**: the guard rejects real IPs, MAC addresses and email addresses in any language. Example addresses, where needed, use RFC 5737 ranges (192.0.2.x) or lab.local.
6. Set CF-01 to **In progress** (draft) and show you everything in a protected Preview, with screenshots of the page on phone and desktop in all three languages.

## 3. What Eli approves
- Each sanitized screenshot and its caption.
- The write-up in all three languages.
- Only then: `approvedOn` is recorded in the manifest and on the case, the status becomes **Documented**, and in that same build:
  - CF-01 appears at `/case-files` and `/case-files/network-traffic-investigation`;
  - "Case Files" joins the main navigation;
  - the sitemap lists the pages;
  - the footer shows the evidence statement.
- Publishing to production remains a separate step that needs your explicit approval.

## 4. What the build refuses, automatically
- An approved case without evidence files, without findings, without dates, or with any message missing in English, Hebrew or Arabic.
- Evidence not recorded as sanitized and approved, not registered, or still carrying metadata.
- A finding that cites evidence that does not exist.
- Any provenance other than personal lab; any video that is not your own recording with captions in all three languages; any video file committed to Git.
