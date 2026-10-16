/**
 * Phase 2 design prototype data: Case Files. Structure only.
 *
 * Nothing here is evidence. Every case is "placeholder" (awaiting evidence): no
 * findings, screenshots, logs or dates exist yet, and the prototype never invents
 * them. Steps are the planned procedure (what will be done), shown as "Planned".
 * Wording lives in messages under caseProto.*; this file holds ids, tools and links.
 *
 * In Phase 2 proper this becomes src/content/case-files.json with the same shape,
 * gated by the evidence model (only "approved" renders on the public build).
 */
import type { EvidenceStatus } from "@/content/evidence";

export type CaseId = "wireshark" | "splunk" | "ad";
export type CaseCategory = "network" | "siem" | "identity";
export type SkillId = "support" | "network" | "blueTeam" | "windowsAd" | "wiresharkSiem" | "aiWeb";

export interface ProtoCase {
  id: CaseId;
  number: string;
  category: CaseCategory;
  status: EvidenceStatus;
  /** Always a personal lab: case files never describe employment work. */
  provenance: "personal-lab";
  tools: readonly string[];
  skills: readonly SkillId[];
  /** Planned steps; each has a title and a technical-detail line in messages. */
  steps: number;
  /** Evidence slots planned for the gallery (none filled yet). */
  evidencePlanned: number;
  /** Evidence items approved so far. Always 0 in the prototype. */
  evidenceApproved: number;
  video: "planned" | "none";
}

export const protoCases: readonly ProtoCase[] = [
  {
    id: "wireshark",
    number: "CF-01",
    category: "network",
    status: "placeholder",
    provenance: "personal-lab",
    tools: ["Wireshark", "Kali Linux", "VirtualBox"],
    skills: ["wiresharkSiem", "network"],
    steps: 3,
    evidencePlanned: 3,
    evidenceApproved: 0,
    video: "planned",
  },
  {
    id: "splunk",
    number: "CF-02",
    category: "siem",
    status: "placeholder",
    provenance: "personal-lab",
    tools: ["Splunk Enterprise", "Linux", "VMware"],
    skills: ["wiresharkSiem", "blueTeam"],
    steps: 3,
    evidencePlanned: 3,
    evidenceApproved: 0,
    video: "planned",
  },
  {
    id: "ad",
    number: "CF-03",
    category: "identity",
    status: "placeholder",
    provenance: "personal-lab",
    tools: ["Windows Server", "Active Directory", "PowerShell", "Group Policy"],
    skills: ["windowsAd", "support"],
    steps: 3,
    evidencePlanned: 3,
    evidenceApproved: 0,
    video: "planned",
  },
];

/** Evidence status → the three labels Eli asked for. */
export const statusKey = { placeholder: "awaiting", draft: "inProgress", approved: "documented" } as const;
