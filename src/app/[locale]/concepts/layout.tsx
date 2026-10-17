import type { Metadata } from "next";
import type { ReactNode } from "react";

// Design prototypes: reachable for review, never indexed, not in the sitemap.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ConceptsLayout({ children }: { children: ReactNode }) {
  return children;
}
