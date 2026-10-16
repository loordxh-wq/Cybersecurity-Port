import data from "./projects.json";
import { isVisible, type EvidenceStatus } from "./evidence";

export type ProjectId = "socLab" | "wireshark" | "activeDirectory" | "aiPortfolio";

export interface Project {
  id: ProjectId;
  kind: "lab" | "web";
  status: EvidenceStatus;
  /** Uses simulated data: always rendered with the simulated-training label. */
  simulated: boolean;
  evidence: string[];
}

export const projects = data.projects as Project[];

/** Projects this build may render: approved ones everywhere, everything in the protected preview. */
export const visibleProjects = projects.filter((p) => isVisible(p.status));

/**
 * True once at least one project is approved for the public site. Decides content
 * that may only appear when real, reviewed work is published (the footer's evidence
 * statement). Uses "approved" in every build, so the protected preview shows exactly
 * what the public site will.
 */
export const hasPublishedProject = projects.some((p) => p.status === "approved");
