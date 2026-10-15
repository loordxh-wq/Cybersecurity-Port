# Cyber Command — prototype V4

Route: `/{en|he|ar}/concepts/v4` (noindex, not linked from the public site).
Status: prototype for review. Phase 2 is not implemented.

## The idea

One axis ties the page together: the **signal horizon**.

- The intelligence core's equator continues as a hairline across the page.
- The hairline runs between the two lines of Eli's name: ELI sits above the horizon, SAAD below it.
- A pulse travels along it into the core.
- When the scene runs a scan, the name gets the same sweep at the same moment. The scene writes `--scan` onto `[data-scan-sync]`.
- The typography and the visualization therefore behave as one instrument, not as a photo placed next to some text.

## The scene, in four beats

The scene tells a short story rather than looping noise.

1. **Assemble.** About 2,800 points (1,500 on small or low-power devices) converge from scattered positions into a lattice sphere.
2. **Identify.** Eli's real portrait decrypts at the centre, in coarse blocks that resolve to full resolution.
   - Its rim dissolves into fine cells, so the portrait reads as part of the lattice, not a framed photo.
   - Points in front of the face thin out so the face stays readable.
3. **Connect.** A simulated topology establishes links on bezier paths. Packets travel along them, the receiving node flashes, then the links terminate and re-form elsewhere.
4. **Scan.** Every 7 s a scan field sweeps the core from top to bottom. Points light up as it passes, and the name receives the same sweep.

Supporting elements:
- three dashed orbital rings with flowing dashes;
- a counter-rotating violet icosahedron shell;
- a slowly turning tick crown;
- core-only light sprites; the wide navy wash is plain CSS, so it costs no overdraw.

The scene is explicitly simulated:
- The caption "Simulated topology · demo visual, not live data" is always visible with it, in all three languages.
- The legend names what the shapes are.
- There are no counters, IP addresses, alerts or claims.

## Engineering

| Concern | Behaviour |
| --- | --- |
| Loading | Server HTML is a CSS poster (rings, dot lattice, real portrait `<img>`). `three` is imported only after mount, in its own chunk. The canvas fades in, and the poster portrait cross-fades out while the WebGL portrait decrypts. |
| Fallback | No WebGL, or any error: the poster stays as the complete hero. |
| Reduced motion | One composed still frame (assembled, decrypted, links shown). No animation loop and no pointer parallax. CSS entrance animations are disabled. |
| Off-screen | `IntersectionObserver` and `visibilitychange` stop the render loop. |
| Resolution | DPR capped at 2, or 1.5 on small and low-power devices. Adaptive: if frames average more than 28 ms after the entrance, the pixel ratio drops to 1, then to 0.75. |
| Geometry sync | The camera is fixed (fov 35, distance about 7.2), so the portrait is always 34.4% of the scene height. CSS uses the same ratio for the poster and for the horizon length. The core's x position comes from `--cx`, set per breakpoint and mirrored for RTL. |
| RTL | Mirrored layout, scene side, horizon, CTA arrow and menu. Arabic never uses the mono face, because the fallback breaks letter joining. |
| Accessibility | One `h1` (sr-only Latin plus a decorative giant in EN; the localized name is the real heading in HE/AR), skip link, keyboard-reachable menu (focus moves in, Escape restores focus), visible focus rings, text at least 12 px, axe clean. |

## Visual system for later sections (ideas only, not built)

Rules for every section:
- Each section opens with the chapter rule (`02 — Mission overview`): a mono index, a localized label and a hairline that draws as it enters.
- The core recedes as you scroll. Later sections reuse its vocabulary: lattice dots, dashed orbits, the horizon line and the scan sweep. Glowing cards are never used.

**A. Mission.**
- The hero's horizon becomes the section's top rule.
- One editorial statement, a short paragraph, and a single "read my story" link.
- Built in this prototype.

**B. Career evolution.**
- A horizontal signal line (vertical on mobile): solid through what is done, dashed toward the next step.
- Nodes are typed by colour and fill: experience (hollow), training (hollow), credential (filled with glow), next step (dashed).
- Built in this prototype as the career signal.

**C. Credentials.**
- An "evidence wall": redacted certificate images on graphite plates.
- A scan sweep passes over the plate on hover or focus.
- Certifications are visibly separated from course completions, with the label on each plate. Cisco Ethical Hacker is a course completion and is not the EC-Council CEH.

**D. Skills.**
- Skills as orbits around a small lattice: tools (Splunk, QRadar, Wireshark) on the inner ring, domains on the outer.
- No percentages or skill bars.

**E. Open to Work.**
- A full-width horizon band carrying the role sought, the region and one action.
- The green status dot is the only "live" indicator on the site, and it describes Eli, not infrastructure.

**F. SOC Lab (Phase 2).**
- A sandboxed walkthrough of a sample investigation, using fabricated sample logs labelled "TRAINING DATA" in every language.
- The same simulated caption and amber hatch tag as the hero.

**G. AI projects.**
- Case-study rows with the lattice reduced to a thumbnail glyph per project.
- Only real projects with real links.

**H. Journal / Roadmap.**
- An index of dated entries on the horizon line.
- Future items are drawn dashed, matching "Next step" in the career signal.

**I. CV center.**
- One graphite plate showing the document language variants (EN/HE/AR), file size and last-updated date.
- A download only when Eli supplies a public version.
- No private documents in the repository.

## Palette and type

- Graphite `#04060b`, midnight navy `#081226`/`#1d3a8a`, electric cyan `#42d5f6` with `#a5f0ff` highlight, cobalt `#2f6bff`, controlled violet `#8b7cff`, white type, chrome gradient `#fff → #9eabbf → #f6f9ff`.
- Amber `#f5b544` is reserved for the "simulated" disclosure.
- Display: Archivo extended 800 (Latin); IBM Plex Sans Hebrew and Arabic bold for localized names and headings.
- Body: IBM Plex Sans.
- Micro-labels: JetBrains Mono (Latin and Hebrew), Plex Sans for Arabic.
