// Review branch only: runs inside the real Vercel build, before `npm run build`.
// It fails the deployment unless Vercel itself reports a Preview build of the review
// branch, so a READY deployment is proof that the environment was detected correctly.
// Prints only Vercel's public system values (no secrets).
import { REVIEW_BRANCH, resolveStage } from "./site-stage.mjs";

const env = process.env;
const seen = {
  VERCEL: env.VERCEL ?? "(unset)",
  VERCEL_ENV: env.VERCEL_ENV ?? "(unset)",
  VERCEL_TARGET_ENV: env.VERCEL_TARGET_ENV ?? "(unset)",
  VERCEL_GIT_COMMIT_REF: env.VERCEL_GIT_COMMIT_REF ?? "(unset)",
  VERCEL_GIT_COMMIT_SHA: env.VERCEL_GIT_COMMIT_SHA ? env.VERCEL_GIT_COMMIT_SHA.slice(0, 7) : "(unset)",
  SITE_STAGE: env.SITE_STAGE ?? "(unset)",
};
console.log("preview build check:", JSON.stringify(seen));

const problems = [];
if (env.VERCEL !== "1") problems.push("not running on Vercel");
if (env.VERCEL_ENV !== "preview") problems.push(`VERCEL_ENV is "${env.VERCEL_ENV ?? "unset"}", expected "preview"`);
if (env.VERCEL_TARGET_ENV && env.VERCEL_TARGET_ENV !== "preview") problems.push(`VERCEL_TARGET_ENV is "${env.VERCEL_TARGET_ENV}", expected "preview"`);
if (env.VERCEL_GIT_COMMIT_REF !== REVIEW_BRANCH) problems.push(`branch is "${env.VERCEL_GIT_COMMIT_REF ?? "unset"}", expected "${REVIEW_BRANCH}"`);
const { stage, reason } = resolveStage(env);
if (stage !== "preview") problems.push(`stage resolved to "${stage}" (${reason})`);

if (problems.length) {
  console.error("preview build check FAILED, refusing to build a preview-mode site:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log(`preview build check passed: stage=preview (${reason}) on ${REVIEW_BRANCH}`);
