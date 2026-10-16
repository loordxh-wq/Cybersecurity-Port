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
