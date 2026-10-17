# Network Forensics: visual and motion prototype proposal
## Cyber Operations · story 1 · "From a name to an encrypted session"

Branch: `proposal/network-forensics-prototype`, created from `proposal/cyber-operations` at `b19e31e`.
Status: **proposal for approval.**
- Static design frames only; the animated prototype has not been built.
- Nothing has been merged or deployed, and Vercel is unchanged.
- No approved Phase 1–3 branch was modified.

**Design frames:** `/[locale]/operations/network-forensics?frame=<frame>`, in a `SITE_STAGE=preview`
build only. They are never indexed, and the public build returns 404.

| Frame | Shows |
|---|---|
| `preview` | Executive preview, beat 2 of 4 |
| `preview-end` | Executive preview end card |
| `ch1`–`ch5` | One paused moment of each technical walkthrough chapter |

---

## 1. Decisions and refinements applied

| Item | How this prototype applies it |
|---|---|
| D1 | Lives under `/operations`. The "Operations" nav item is not added until a story is approved for publication. |
| D2 | Narration is neutral throughout ("the client sends…"). A test fails on first-person words. |
| D4 | Network Forensics is the first story. |
| D5 | The technical canvas (`.nf-stage`) is always `dir="ltr"`, tested in all three languages. Captions and panels follow the page direction, and technical values inside Hebrew and Arabic sentences are isolated. |
| D6 | Everything is drawn in code from a synthetic dataset (§4). No screenshots or recordings are needed from you. |
| D7 | Preview-only. "Technical check: pending" and "Eli's review: pending" are shown until they actually happen. |
| D8 | The animated prototype reuses the SOC-01 motion engine (`showcase-motion/timeline.ts`) by import. The SOC-01 study files and recordings are not modified. |
| D9 | Nothing in Case Files, `projects.json` or the existing routes is touched. |
| R1 Identity | The player carries its own masthead: "ELI SAAD · Aspiring SOC Analyst \| Blue Team & IT Support · Cyber Operations · Network Forensics · <chapter>". It stays visible if the player is shared or shown full screen. The role line is your approved `hero.role` wording, read from the existing messages in each language. The end card repeats your name and role. |
| R2 Executive preview | 20 s, 4 beats of 5 s, followed by an end card that offers the 2:26 technical walkthrough or the text version. |
| R3 Two audiences | **Recruiter:** preview, then the end card ("what the walkthrough covers"). **Technical reviewer:** walkthrough with packet tables, filters, ladder diagrams, typed statements and the text version. Both modes sit side by side at the top of the story. |
| R4 Distinction | The provenance strip (◆ Training demonstration · Synthetic data · Custom illustration, not Wireshark, Splunk or Microsoft software · review flags) and the AI disclosure appear on every frame. |
| R5 | Motion is purposeful (§7). Data stays legible at reading size, and every protocol value is checked (§5). The phone layout is designed separately, not shrunk (§6.3). |
| R6 | No application screenshots or imitation of real tool interfaces. No results attributed to you. Commands and filters are labelled with their syntax ("Wireshark syntax"), not presented as output from a real tool. |

---

## 2. Audience design

**Recruiter (about 30 s).** The page opens in **Executive preview** mode.
1. One press of Play. Four beats, each one sentence with one visual: a name resolves, a
   handshake opens, the session is encrypted, the limits are stated.
2. The end card restates the story in one line, lists four things the walkthrough covers, and
   offers the walkthrough or the text version. Your name and role close the card.

**Technical hiring manager (3–5 min).** **Technical walkthrough**: five chapters, 2:26.
- Every chapter shows a display filter and exactly the packets it matches, a sequence diagram
  where useful, and three typed statements: observed, interpretation, limitation.
- The text version holds every value in tables, plus the references.

---

## 3. Storyboard

Durations come from the caption timings in `copy.ts`. The unit test keeps every caption at or
below 16.5 characters per second in all three languages. Motion uses the vocabulary in §7.
"Reduced" is what a reduced-motion visitor sees.

### 3.1 Executive preview (0:00–0:20)

The stage holds four cards in a row on desktop and four rows on a phone. Cards not yet reached
are empty dashed frames: they appear on their beat, never as dim text.

| Time | Beat | Caption (EN) | Motion | Reduced |
|---|---|---|---|---|
| 0:00 | 01 A name | "A name is looked up: updates.example.com resolves to 198.51.100.40." | Card 1 fills; the name types in (no cursor, 24 ms/char); "→" draws; the address fades up; "DNS · 18.4 ms" ticks in | Card 1 complete |
| 0:05 | 02 A connection | "A TCP handshake opens the connection in 24.1 milliseconds." | Connector 1→2 draws (240 ms); card 2 outlines; three handshake strokes draw in turn (180 ms each, 80 ms apart) | Cut |
| 0:10 | 03 An encrypted session | "TLS 1.3 encrypts the session. From here, the content is not visible." | Card 3 fills; "TLS 1.3" and the cipher suite settle; a violet hairline sweeps once across the card | Cut |
| 0:15 | 04 The limits | "Each statement is marked as observed, interpreted or not visible." | Three chips stack (green, amber, dashed), 120 ms apart | Cut |
| 0:20 | End card | — | Stage crossfades to the end card (320 ms) | Cut |

### 3.2 Technical walkthrough (0:00–2:26)

**Chapter 1 · Capture scope (0:00–0:24)**, filter `ip.addr == 192.0.2.24` (12/12)

| Time | Caption | Scene and motion |
|---|---|---|
| 0:00 | "Twelve packets in 71.5 milliseconds, captured on the client, 192.0.2.24." | Timeline axis draws left to right (480 ms). Packet ticks rise in time order (30 ms stagger); client-sent ticks are tall, received ticks short. |
| 0:06 | "A capture taken here shows one machine's view: every packet starts or ends at the client." | "Capture point: 192.0.2.24" badge fades in. Rows of the packet list settle (40 ms stagger). |
| 0:13 | "Four DNS packets, three for the TCP handshake, five for TLS." | Ticks tint by protocol group in sequence (DNS, TCP, TLS); the legend counts appear. |
| 0:18 | "Each chapter filters down to one part of this exchange." | The three round-trip brackets draw under the axis. |

Observed: 12 packets, 0–71.5 ms (4 DNS, 3 TCP, 5 TLS). · Interpretation: the client is the
capture point. · Limitation: other devices' traffic is not captured.

**Chapter 2 · DNS resolution (0:24–0:54)**, filter `dns.qry.name == "updates.example.com"` (4/12)

| Time | Caption | Scene and motion |
|---|---|---|
| 0:24 | "The client sends two lookups at once: A for an IPv4 address, AAAA for IPv6." | The filter text replaces the previous one (no typing effect: a crossfade of the field). Non-matching rows collapse (220 ms). Two query arrows draw on the client↔resolver ladder, 6 px apart. |
| 0:30 | "18.4 ms later the A answer arrives: 198.51.100.40, cacheable for 300 seconds (TTL 300)." | Response arrow draws; row 3 highlights; A-answer card fills; RTT bracket draws. |
| 0:37 | "The AAAA answer holds no address, only the zone's SOA record: the name has no IPv6 address." | Row 4 highlights briefly; the AAAA card fills with "No address · SOA only". |
| 0:44 | "So the connection that follows will use IPv4." | The A card keeps its accent; the AAAA card dims to 60%. |
| 0:48 | "Whether the resolver answered from its cache cannot be seen from the client side." | Limitation line in the panel gains its dashed rule. |

Observed: A answer 198.51.100.40 (TTL 300) at 18.4 ms; AAAA answer has an SOA record and no
address. · Interpretation: the connection will use IPv4. · Limitation: resolver caching and DNS
over HTTPS are not visible here.

**Chapter 3 · TCP handshake (0:54–1:24)**, filter `tcp.port == 443 && tcp.len == 0` (3/12)

| Time | Caption | Scene and motion |
|---|---|---|
| 0:54 | "0.9 ms after the last DNS reply, the client sends a SYN to 198.51.100.40, port 443." | Filter crossfades; rows 5–7 remain. SYN arrow draws (180 ms); its options appear along the arrow. |
| 1:01 | "The server answers SYN-ACK, and the client's ACK completes the handshake in 24.1 ms." | SYN-ACK draws, then ACK; RTT bracket spans SYN → SYN-ACK. |
| 1:08 | "Both sides offer a 1460-byte segment size, selective acknowledgement and window scaling." | MSS, SACK_PERM and WS values in rows 5–6 light in turn. |
| 1:14 | "No retransmission, no reset: the port accepted the connection." | Hold. |
| 1:18 | "The address matches the A answer, but that alone does not prove which name was meant." | Limitation emphasised in the panel. |

**Chapter 4 · TLS negotiation (1:24–1:56)**, filter `tls.handshake.type in {1 2}` (2/12)

| Time | Caption | Scene and motion |
|---|---|---|
| 1:24 | "The Client Hello is still readable: it names the server, updates.example.com, in the SNI field." | Row 8 highlights; the Client Hello card fills; the SNI row lights. |
| 1:31 | "It offers TLS 1.3 and 1.2 and the application protocols h2 and http/1.1." | Offered versions and ALPN rows light. |
| 1:37 | "The Server Hello's version field says 0x0303, TLS 1.2, for compatibility." | Row 9 highlights; the Server Hello card fills; "0x0303 (TLS 1.2)" lights. |
| 1:43 | "The real choice is in supported_versions: TLS 1.3, with TLS_AES_128_GCM_SHA256." | Selected version and cipher light in accent. |
| 1:49 | "From here on the handshake is encrypted, including the certificate and the chosen protocol." | The "Encrypted from here" divider draws across the ladder; packets 10–12 draw as dashed violet arrows labelled "encrypted". |

**Chapter 5 · What the capture cannot show (1:56–2:26)**, filter `tcp.stream == 0` (8/12)

| Time | Caption | Scene and motion |
|---|---|---|
| 1:56 | "What the capture shows: who connected to where, when, and with which protocols." | Timeline returns with packets 1–4 dimmed (outside the TCP stream). The "shows" card fills (green rule). |
| 2:02 | "What it suggests: the session is for updates.example.com, since the DNS answer and SNI agree." | Ticks 3 and 8 pulse once; the "suggests" card fills (amber rule). |
| 2:09 | "What it cannot show: URLs, the content, the server certificate or the user behind the client." | "Cannot show" card fills (dashed rule). |
| 2:16 | "Answering those needs other evidence, such as endpoint or proxy logs." | Panel lists the further evidence. |
| 2:21 | "Every claim in this story points back to numbered packets." | Hold, then the end card for the walkthrough (the same layout as the preview end card, with Replay). |

---

## 4. Proposed dataset

One synthetic connection from a Windows-style client to a Linux-style HTTPS server, through a
local resolver. Source: `src/components/netforensics-proto/data.ts`. Every summary line on screen
is generated from these fields, so the text cannot drift from the data.

| Role | Address | Port(s) |
|---|---|---|
| Client (capture point) | 192.0.2.24 | 53122, 61907 (DNS); 49712 (TCP) |
| Resolver | 192.0.2.53 | 53 |
| Server | 198.51.100.40 | 443 |
| Name | updates.example.com | — |

| No. | Time (s) | Src → Dst | Proto | Frame | Content |
|---|---|---|---|---|---|
| 1 | 0.000000 | client → resolver | DNS | 79 | Query 0x3f2a A updates.example.com |
| 2 | 0.000143 | client → resolver | DNS | 79 | Query 0x8c41 AAAA updates.example.com |
| 3 | 0.018412 | resolver → client | DNS | 95 | Response 0x3f2a A 198.51.100.40 TTL 300 |
| 4 | 0.018977 | resolver → client | DNS | 130 | Response 0x8c41 AAAA: no record, SOA ns1.example.com / hostmaster.example.com |
| 5 | 0.019873 | client → server | TCP | 66 | SYN Seq=0 Win=64240 MSS=1460 WS=256 SACK_PERM |
| 6 | 0.043961 | server → client | TCP | 66 | SYN, ACK Seq=0 Ack=1 Win=65160 MSS=1460 SACK_PERM WS=128 |
| 7 | 0.044102 | client → server | TCP | 54 | ACK Seq=1 Ack=1 Win=1026×256=262656 |
| 8 | 0.044655 | client → server | TLS | 571 | Client Hello (Len=517): SNI, versions TLS 1.3/1.2, ALPN h2/http/1.1, key share x25519 |
| 9 | 0.069320 | server → client | TLS | 1514 | Server Hello, Change Cipher Spec, encrypted records (Len=1460, Ack=518) |
| 10 | 0.069655 | server → client | TLS | 912 | Encrypted records (Seq=1461, Len=858) |
| 11 | 0.071203 | client → server | TLS | 118 | Change Cipher Spec + encrypted Finished (Seq=518, Ack=2319, Len=64) |
| 12 | 0.071530 | client → server | TLS | 300 | Encrypted application data (Seq=582, Len=246) |

Derived values the narration quotes:
- DNS round trip: 18.4 ms (packets 1 → 3).
- Handshake round trip: 24.1 ms (5 → 6).
- TLS first flight: 24.7 ms (8 → 9).
- Last DNS reply to SYN: 0.9 ms (4 → 5).
- Total: 71.5 ms.

**Display filters and what they match** (Wireshark display-filter semantics):

| Chapter | Filter | Matches |
|---|---|---|
| 1 | `ip.addr == 192.0.2.24` | 1–12 (every packet involves the client) |
| 2 | `dns.qry.name == "updates.example.com"` | 1–4 (responses repeat the question) |
| 3 | `tcp.port == 443 && tcp.len == 0` | 5–7 (the only zero-payload segments) |
| 4 | `tls.handshake.type in {1 2}` | 8 (Client Hello = 1), 9 (Server Hello = 2) |
| 5 | `tcp.stream == 0` | 5–12 (the only TCP stream) |

**Correction to my earlier mockup:** the Cyber Operations mockup used
`tcp.flags.syn == 1 && tcp.port == 443` and showed three packets. That filter matches only the
SYN and SYN-ACK. The final ACK has no SYN flag, so it would not appear. The prototype uses a
filter that matches exactly the three handshake packets.

---

## 5. Accuracy checks

### 5.1 Automated (`tests/unit/netforensics-data.test.mjs`, part of `npm run test:guard`)
1. **DNS frame lengths are recomputed from the message structure:**
   - name encoding: `updates.example.com` takes 21 bytes;
   - question: 25 bytes;
   - A answer: 16 bytes, using a compression pointer;
   - negative AAAA answer: an SOA authority record of 51 bytes (MNAME `\3ns1` + pointer, RNAME
     `\10hostmaster` + pointer, five 32-bit fields).

   The resulting lengths are 79, 79, 95 and 130 bytes. Queries and responses also pair by ID,
   port and type.
2. **TCP:**
   - every frame length = 54 + option bytes + payload;
   - every sequence number = the previous sequence number + payload (+1 for SYN);
   - every acknowledgement covers only bytes already sent;
   - packet 11 acknowledges all 2318 server bytes.
3. **Window scaling:** each scaled window equals the raw window × the shift negotiated in that
   side's SYN (256 for the client, 128 for the server). The SYN options take 12 bytes.
4. **TLS 1.3:**
   - the client's CCS and Finished total 64 bytes (6 + 58, with a 32-byte verify_data for SHA-256
     and a 16-byte AEAD tag);
   - packet 9 is a full 1460-byte segment;
   - everything after packet 9 is marked encrypted;
   - `legacy_version` is 0x0303, and the selected version is one the client offered.
5. **Times and figures:** times strictly increase, and the quoted round trips equal the packet
   differences.
6. **Addresses:** only RFC 5737 documentation addresses and `example.com` names appear.
7. **Copy consistency:** every number the copy quotes appears in all three languages, and values
   from the earlier 7-packet mockup cannot reappear.
8. **Reading speed:** at most 16.5 characters per second for every caption, in every language.

### 5.2 Manual checks against references (recorded before `review.technical` can be set)

| Statement | Reference |
|---|---|
| Message format, header, compression pointers | RFC 1035 §4.1, §4.1.4 |
| Negative answers carry the SOA in the authority section | RFC 2308 §2.2 |
| Three-way handshake, sequence/ack semantics | RFC 9293 §3.5 |
| Window scale option, shift applied to non-SYN segments | RFC 7323 §2 |
| `legacy_version` 0x0303 with `supported_versions` | RFC 8446 §4.1.2, §4.2.1 |
| Certificate and EncryptedExtensions (which carries the chosen ALPN) are encrypted | RFC 8446 §2, §4.3.1 |
| The middlebox-compatibility CCS record | RFC 8446 Appendix D.4 |
| SNI in the Client Hello | RFC 6066 §3 |
| Encrypted Client Hello can hide the SNI | IETF TLS Encrypted Client Hello specification (draft-ietf-tls-esni) |
| Display-filter fields and set syntax (`tls.handshake.type in {1 2}`) | Wireshark display-filter reference (current stable) |

### 5.3 Deliberate simplifications (stated in the text version)
- No EDNS(0) OPT record in the DNS queries. Many resolvers add 11 bytes.
- No TCP timestamps, as on a default Windows client. The server therefore omits them too.
- The server's first flight (2318 bytes) assumes a short ECDSA certificate chain. Real sizes vary
  widely.
- The client does not try IPv6, which is consistent with the AAAA answer.
- The packet "Summary" column uses its own wording. It is not a copy of any tool's Info column.

---

## 6. Visual design

### 6.1 Identity and frame
- **Masthead** on the player: the mark, "ELI SAAD" in tracked mono, your approved role line, and
  on the far side "Cyber Operations · Network Forensics · <chapter>".
- **Header:** story title, plus the mode switch (Executive preview 0:20 · Technical walkthrough
  2:26 · Text version), visible before playing.
- **Provenance strip** above everything, and the AI disclosure under everything.

### 6.2 Desktop (1440 × 900)
- The stage and caption sit on the left, about 1000 px wide. The reasoning panel (19 rem) sits on
  the right with the three typed statements. In chapter 5 the stage already shows them, so the
  panel lists the further evidence instead.
- Chapters 2–4 use a split stage: the packet list with its filter on the left, and a sequence
  diagram (client left, peer right, time downward) in a 19 rem column.
- **Protocol coding:** DNS is blue (`#8fb8ff`), TCP is cyan (the accent), and TLS is violet.
  Every colour comes with a text label (a protocol column bar and a legend with counts).
  Encrypted packets show in italics in the list and as dashed violet arrows in the diagrams.
- **Type:** captions in Plex at 1.1875 rem, centred under the stage. Values in JetBrains Mono with
  ligatures off. Table text at 0.75 rem.

### 6.3 iPhone (390 × 844, also 360 and 430)
- **One primary visual per chapter**, chosen by the caption it pauses on:
  - chapter 1: the phase bar (DNS 1–4, TCP 5–7, TLS 8–12, with round trips) plus the 12 rows in
    compact form;
  - chapter 2: the answer cards and the ladder;
  - chapter 3: the three handshake rows plus the ladder;
  - chapter 4: the two Hello field cards;
  - chapter 5: the phase bar plus the board.

  Everything hidden on phones stays in the text version.
- Packet rows become two-line cards: number, time, protocol and length on the first line, the
  summary on the second.
- The mode switch splits into two equal buttons with the text version below. The transport
  targets are 44 px or larger.
- **For the animated prototype:** the stage gets a fixed height, so the transport never moves.
  This is the rule the SOC-01 motion study proved on iPhone. Scene changes inside the stage are
  crossfades, not scrolling.

### 6.4 Hebrew and Arabic
- Page chrome, captions, the panel, the mode switch and the rail mirror.
- The stage stays left-to-right (D5).
- Values inside sentences (`24.1 ms`, `198.51.100.40`, `TLS_AES_128_GCM_SHA256`) are wrapped in
  `<bdi dir="ltr">`, and a test checks this.
- Labels use the sans face without tracking. Only the "ELI SAAD" wordmark keeps its tracking,
  because it is Latin.

---

## 7. Motion design (for the animated prototype)

**Vocabulary** (no other movement is used):

| Token | Use | Spec |
|---|---|---|
| `enter` | Card, row or label appears | opacity 0→1, translateY 6→0 px, 220 ms, ease-out (0.2, 0.7, 0.2, 1) |
| `stagger` | Lists, ticks | 30–40 ms between items, capped at 400 ms in total |
| `draw` | Arrows, connectors, axis, brackets | stroke-dashoffset on paths under 400 px, 180–480 ms; arrowhead fades in during the last 60 ms |
| `focus` | Highlight a row or value | background 0→accent-soft and inline-start rule, 160 ms; previous focus releases at the same time |
| `swap` | Filter change | old rows collapse (height and opacity, 220 ms), then the filter text crossfades, then the new rows enter |
| `crossfade` | Scene or end card | 320 ms |

**Rules carried over from the SOC-01 study (§23–§26 there):**
- Animate opacity and transform only.
- No SVG masks or filters, and no blur.
- Fixed scale: no camera zoom on desktop.
- Give large SVGs `will-change: transform`.
- Per-frame values go in scoped CSS custom properties, written only when they change.
- Scenes are memoised, and there is no React render per frame.
- The clock pauses when the tab is hidden or the player is off screen.

**Engine reuse:** the prototype imports `timeline.ts` (`valueAt`, `pulse`, `paced`) and the
capture-mode pattern. Keys are authored per caption beat, so the storyboard times above are the
timeline. SOC-01 files are not changed (D8).

**Reduced motion:** every token becomes a cut at its start time. The executive preview shows
each beat's final state for its 5 s, and the test pattern "no in-between frames" from the motion
study is reused.

**Budgets** for the prototype:

| Measure | Target |
|---|---|
| Container, desktop | ≥ 45 fps; main thread ≤ 300 ms per second of playback |
| Container, iPhone viewport | ≥ 50 fps at 1×; ≥ 40 fps at 4× CPU |
| Prototype JS beyond the shared bundle | ≤ 45 KB gzip |
| Before any publication | A recorded check on a real iPhone and a mid-range Android |

---

## 8. Accessibility

- No autoplay. Play, pause, replay and next are real buttons with labels in each language.
- Captions are DOM text, on by default. The stage is `role="img"` with a one-line chapter summary.
- The text version (server-rendered) holds every value. Tables are real `<table>`s, and wide
  tables scroll inside a focusable region.
- Upcoming preview steps are empty frames, not dim text. This keeps contrast at 4.5:1 or higher.
  An axe run caught the dim text and it was fixed before delivery.
- Meaning never depends on colour alone: protocols carry labels, statements use line styles, and
  encrypted packets use dashes and italics.

---

## 9. Next checkpoint (only after your approval): the animated prototype

**Scope:** the executive preview (20 s) and the five chapters (2:26), animated, on desktop and
iPhone, in EN/HE/AR, at the same preview-only route. No Operations hub, nav or home changes.

**Deliverables:**
- Recordings produced automatically through capture mode (desktop, iPhone, reduced motion) for
  review only.
- Performance and accessibility measurements.
- A test report.

**Acceptance criteria:**
- The storyboard times are met within ±0.1 s.
- Captions are at or below 16.5 characters per second.
- Dataset tests pass.
- The §7 budgets are met in the container.
- axe reports no violations.
- No overflow at 360/390/430.
- The iPhone transport stays fixed on screen through both modes.
- Reduced motion produces cuts only.
- RTL isolation passes.
- The public build returns 404.

---

## 10. Decisions for you

| # | Question | Recommendation |
|---|---|---|
| N1 | Approve the dataset in §4: 12 packets, with an AAAA lookup that has no IPv6 address | Approve. The negative answer shows nuance without adding noise |
| N2 | Executive preview length: 20 s in 4 beats | 20 s |
| N3 | Walkthrough length: 2:26 in 5 chapters | Keep it |
| N4 | Narration: captions only, with no voice-over, for now | Captions only. A voice would need your own recording, so it stays a later option |
| N5 | Masthead identity line uses your approved role "Aspiring SOC Analyst \| Blue Team & IT Support" | Yes, until you change the role wording site-wide |
| N6 | Phone layout: one primary visual per chapter, with the rest in the text version | Yes |

---

## 11. Verification of this branch

- Lint, typecheck and unit tests pass: 49/49, including the 8 new dataset and caption checks.
- **Preview build:** new `netforensics-proto.spec.ts` checks:
  - every frame in EN/HE/AR, on desktop and a 360 px phone: status 200, `noindex`, provenance
    labels, the Eli Saad masthead, a left-to-right stage, no overflow, no axe violations;
  - each display filter lists exactly the packets it matches;
  - no first-person narration.

  Together with the Operations, motion-study and preview specs: **40 passed, 3 skipped**.
- **Public build:** `/[locale]/operations/network-forensics` returns 404, and no prototype
  wording or data appears in `.next/static`. Full public regression: **164 passed, 69 skipped,
  0 failed**.
