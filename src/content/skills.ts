/**
 * Skills, each tied to the kind of evidence behind it. Wording lives in messages
 * under `recruiter.skill.<id>`.
 *
 * Evidence types, kept strictly apart:
 *  - employment:    paid work (Cellcom Tier 1)
 *  - certification: passed an exam (EC-Council C|SA)
 *  - course:        completed course training (Cyber Gain Center SOC track, Cisco NetAcad)
 *  - project:       Eli's own documented work (this portfolio)
 * "Demonstrated" is reserved for skills backed by an approved case file; none exists yet,
 * so it is not a type here. No proficiency levels or percentages, by design.
 *
 * Validated 2026-10-16 against src/content/facts.ts and messages (timeline, credentials).
 * DHCP (confirmed by Eli 2026-10-16) is listed under networking as course knowledge only
 * (Cisco Networking Basics: IP addressing and DHCP fundamentals), never as production
 * DHCP administration. The detail text keeps "At work" and "Course" apart.
 */
export type EvidenceType = "employment" | "certification" | "course" | "project";

export const skills: readonly { id: "support" | "network" | "blueTeam" | "windowsAd" | "wiresharkSiem" | "aiWeb"; evidence: readonly EvidenceType[] }[] = [
  { id: "support", evidence: ["employment"] },
  { id: "network", evidence: ["employment", "course"] },
  { id: "blueTeam", evidence: ["course", "certification"] },
  { id: "windowsAd", evidence: ["course"] },
  { id: "wiresharkSiem", evidence: ["course"] },
  { id: "aiWeb", evidence: ["project"] },
];

export type SkillId = (typeof skills)[number]["id"];
