import data from "./case-files.json";
import { isVisible, type EvidenceStatus } from "./evidence";
import { projects } from "./projects";
import type { SkillId } from "./skills";

export type CaseCategory = "network" | "siem" | "identity";

export interface CaseEvidence {
  /** Figure id shown on the page, e.g. "E-01". */
  id: string;
  /** File name in src/assets/evidence/, registered in evidence-images.ts. */
  file: string;
}

export interface CaseFinding {
  /** Message key under caseFiles.items.<id>.findings. */
  key: string;
  /** Evidence ids this observation is based on (each must exist in `evidence`). */
  evidence: string[];
}

export interface CaseVideo {
  provenance: "own-recording";
  src: string;
  poster: string;
  captions: Record<"en" | "he" | "ar", string>;
}

export interface CaseFile {
  id: "wireshark";
  number: string;
  slug: string;
  category: CaseCategory;
  status: EvidenceStatus;
  /** Case files describe personal lab work only, never employment. */
  provenance: "personal-lab";
  tools: string[];
  skills: SkillId[];
  /** Step keys under caseFiles.items.<id>.steps; planned until the case is documented. */
  steps: string[];
  /** Evidence slots the write-up plans for (shown as empty frames while awaiting evidence). */
  evidencePlanned: number;
  evidence: CaseEvidence[];
  findings: CaseFinding[];
  /** Optional: a case can be published with screenshots and findings only. */
  video: CaseVideo | null;
  updatedOn: string | null;
  approvedOn: string | null;
}

export const caseFiles = data.cases as CaseFile[];

/** Cases this build may render: approved ones everywhere, everything in the protected preview. */
export const visibleCases = caseFiles.filter((c) => isVisible(c.status));

/** Cases on the public site. Drives the nav item, the sitemap and the footer statement. */
export const publishedCases = caseFiles.filter((c) => c.status === "approved");

export const caseBySlug = (slug: string) => visibleCases.find((c) => c.slug === slug);

/**
 * True once reviewed lab work is public: an approved case file or an approved
 * project. The footer's evidence statement depends on it.
 */
export const hasPublishedWork = publishedCases.length > 0 || projects.some((p) => p.status === "approved");

/** Evidence status → the three labels Eli approved. */
export const statusKey = { placeholder: "awaiting", draft: "inProgress", approved: "documented" } as const;
