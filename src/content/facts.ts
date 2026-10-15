/**
 * Shared, language-independent facts. Every claim on the site traces back to
 * this file (or to messages/*.json for wording). Sources:
 *  - Eli's Hebrew CV (private, not in repo)
 *  - Certificate images supplied by Eli
 *  - Social links supplied by Eli
 *
 * Anything that needs Eli's sign-off before publishing carries `approved: false`
 * and is NOT rendered until switched to true.
 */
import type { StaticImageData } from "next/image";
import csaImage from "@/assets/certificates/ec-council-csa.jpg";
import ciscoEthicalHackerImage from "@/assets/certificates/cisco-ethical-hacker.png";
import ciscoNetworkingBasicsImage from "@/assets/certificates/cisco-networking-basics.png";
import portraitImage from "@/assets/portrait/eli-saad-portrait.jpg";

export const person = {
  nameLatin: "Eli Saad",
  portrait: portraitImage,
  region: "Northern Israel",
} as const;

export type SocialId = "linkedin" | "instagram" | "facebook";

export const socials: ReadonlyArray<{ id: SocialId; href: string; handle: string }> = [
  { id: "linkedin", href: "https://www.linkedin.com/in/elisaad", handle: "elisaad" },
  { id: "instagram", href: "https://www.instagram.com/_elisaad_11", handle: "_elisaad_11" },
  { id: "facebook", href: "https://www.facebook.com/share/18S23dXAAi/?mibextid=wwXIfr", handle: "Eli Saad" },
];

export const linkedin = socials[0]!;

/**
 * Credentials. Certificate numbers are intentionally not stored here, and the
 * public images have the ID removed. Add `verificationUrl` only if Eli supplies one.
 */
export type CredentialKind = "certification" | "courseCompletion";

export interface Credential {
  id: "csa" | "ciscoEthicalHacker" | "ciscoNetworkingBasics";
  /** Official credential name, kept in English in every locale. */
  title: string;
  issuer: string;
  kind: CredentialKind;
  /** ISO date (issued for certifications, completed for courses). */
  date: string;
  image: StaticImageData;
  verificationUrl?: string;
}

export const credentials: readonly Credential[] = [
  {
    id: "csa",
    title: "Certified SOC Analyst (C|SA)",
    issuer: "EC-Council",
    kind: "certification",
    date: "2026-10-02",
    image: csaImage,
  },
  {
    id: "ciscoEthicalHacker",
    title: "Ethical Hacker",
    issuer: "Cisco Networking Academy",
    kind: "courseCompletion",
    date: "2026-06-22",
    image: ciscoEthicalHackerImage,
  },
  {
    id: "ciscoNetworkingBasics",
    title: "Networking Basics",
    issuer: "Cisco Networking Academy",
    kind: "courseCompletion",
    date: "2026-06-24",
    image: ciscoNetworkingBasicsImage,
  },
];

/** Timeline entries. Text lives in messages under `timeline.<id>`. */
export interface TimelineEntry {
  id: "cellcom" | "cyberGain" | "nationalService";
  period: string;
  tools?: readonly string[];
}

export const timeline: readonly TimelineEntry[] = [
  {
    id: "cyberGain",
    period: "2026",
    tools: ["Splunk", "QRadar", "Wireshark", "FortiGate", "Active Directory", "Windows", "Linux", "PowerShell", "Python"],
  },
  {
    id: "cellcom",
    period: "2026",
    tools: ["TCP/IP", "DNS", "Wi-Fi", "Ticket documentation", "Escalation"],
  },
  { id: "nationalService", period: "2022" },
];

/**
 * Self-reported CV figures (Cellcom). Hidden until Eli approves them.
 * Wording lives in messages under `timeline.cellcom.metrics`.
 */
export const cellcomMetrics = { approved: false } as const;

/** Roles Eli is open to. Labels live in messages under `openToWork.roles`. */
export const targetRoles = ["socTrainee", "helpDesk", "desktopSupport", "noc"] as const;
export const targetCities = ["haifa", "nahariya", "karmiel"] as const;

/**
 * Public CV file. Stays null until Eli approves a redacted version and which
 * contact fields it shows. While null, no "Download CV" button is rendered.
 */
export const publicCv: { en: string | null; he: string | null; ar: string | null } = {
  en: null,
  he: null,
  ar: null,
};

/** Public email for a mailto link. Null until Eli confirms which address to publish. */
export const publicEmail: string | null = null;
