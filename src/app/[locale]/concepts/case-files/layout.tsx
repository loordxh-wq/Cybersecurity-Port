import type { ReactNode } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import "@/components/concepts/case-files/case-files.css";

/**
 * Phase 2 design prototype, shown inside the real site chrome so it can be judged
 * in context. Under /concepts: never indexed, not in the sitemap, not linked.
 */
export default function CaseFilesPrototypeLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
