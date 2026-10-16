/**
 * Build stage. "public" is the default for every build, including production.
 * Drafts and evidence placeholders render only when a build is explicitly
 * marked as the protected development preview with SITE_STAGE=preview.
 * The value is fixed at build time (next.config.ts inlines it), so a public build
 * stays public whatever the runtime environment says.
 * Never set SITE_STAGE=preview on a deployment without access protection.
 */
export type SiteStage = "public" | "preview";

export const siteStage: SiteStage = process.env.SITE_STAGE === "preview" ? "preview" : "public";
export const isPreview = siteStage === "preview";
