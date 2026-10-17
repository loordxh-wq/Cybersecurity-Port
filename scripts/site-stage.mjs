// Single source of truth for the build stage. Used by next.config.ts (which inlines
// the result into the bundle) and by the review-branch pre-build check.
//
// Rules:
//  - Nothing requested                                   → public
//  - SITE_STAGE=preview on Vercel, VERCEL_ENV=preview    → preview
//  - SITE_STAGE=preview on Vercel, any other VERCEL_ENV  → public  (production lock:
//    a production build can never show drafts or unfinished cases, even if preview
//    mode is requested by mistake)
//  - SITE_STAGE=preview off Vercel (local builds, tests) → preview, unless
//    VERCEL_ENV=production is set, which always wins
export const REVIEW_BRANCH = "review/case-files-preview";

/** @param {Record<string, string | undefined>} env */
export function resolveStage(env) {
  const requested = env.SITE_STAGE === "preview";
  if (!requested) return { stage: "public", reason: "not requested" };
  if (env.VERCEL_ENV === "production") return { stage: "public", reason: "production lock: VERCEL_ENV=production" };
  if (env.VERCEL === "1" && env.VERCEL_ENV !== "preview") return { stage: "public", reason: `on Vercel but VERCEL_ENV=${env.VERCEL_ENV ?? "unset"}` };
  return { stage: "preview", reason: env.VERCEL === "1" ? "Vercel Preview build" : "local build" };
}
