import { isPreview } from "./stage";

/**
 * Every piece of portfolio content declares how far its evidence has come.
 *  - placeholder: nothing authentic yet; shown only as a pending slot in the preview
 *  - draft:       authentic material, not yet approved by Eli; preview only, tagged "Draft"
 *  - approved:    approved by Eli; rendered on the public site
 * Nothing that is not approved can reach the public site.
 */
export type EvidenceStatus = "placeholder" | "draft" | "approved";

export function isVisible(status: EvidenceStatus): boolean {
  return status === "approved" || isPreview;
}
