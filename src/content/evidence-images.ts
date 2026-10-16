import type { StaticImageData } from "next/image";

/**
 * Sanitized evidence images, registered by file name so pages can render them with
 * next/image (static import: dimensions known, no layout shift, blur placeholder).
 * Add an entry only after the file is recorded as sanitized and approved in
 * src/assets/evidence/manifest.json; npm run check:content enforces both.
 * Empty until Eli's own lab evidence is reviewed.
 */
export const evidenceImages: Record<string, StaticImageData> = {};
