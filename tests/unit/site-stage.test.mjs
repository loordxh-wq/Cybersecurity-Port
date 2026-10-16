// Proves the preview-mode isolation:
//  1. resolveStage(): production is locked to the public site, preview mode only for a
//     Vercel Preview build (or an explicit local build).
//  2. verify-preview-build.mjs: the review-branch pre-build check refuses anything but a
//     Vercel Preview build of review/case-files-preview.
//  3. The content guard blocks preview-mode configuration leaking to any other branch.
// Run: npm run test:guard
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import { REVIEW_BRANCH, resolveStage } from "../../scripts/site-stage.mjs";

const repo = new URL("../../", import.meta.url).pathname;

test("production is locked to the public site, even when preview mode is requested", () => {
  assert.equal(resolveStage({ SITE_STAGE: "preview", VERCEL: "1", VERCEL_ENV: "production" }).stage, "public");
  assert.equal(resolveStage({ SITE_STAGE: "preview", VERCEL_ENV: "production" }).stage, "public");
  assert.equal(resolveStage({ SITE_STAGE: "preview", VERCEL: "1", VERCEL_ENV: "development" }).stage, "public");
  assert.equal(resolveStage({ SITE_STAGE: "preview", VERCEL: "1" }).stage, "public");
});

test("preview mode only for a Vercel Preview build or an explicit local build", () => {
  assert.equal(resolveStage({ SITE_STAGE: "preview", VERCEL: "1", VERCEL_ENV: "preview" }).stage, "preview");
  assert.equal(resolveStage({ SITE_STAGE: "preview" }).stage, "preview");
  assert.equal(resolveStage({}).stage, "public");
  assert.equal(resolveStage({ VERCEL: "1", VERCEL_ENV: "preview" }).stage, "public");
  assert.equal(resolveStage({ SITE_STAGE: "PREVIEW" }).stage, "public");
});

function verify(env) {
  const clean = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("VERCEL") && k !== "SITE_STAGE"));
  return spawnSync("node", ["scripts/verify-preview-build.mjs"], { cwd: repo, env: { ...clean, ...env }, encoding: "utf8" });
}
const good = { VERCEL: "1", VERCEL_ENV: "preview", VERCEL_TARGET_ENV: "preview", VERCEL_GIT_COMMIT_REF: REVIEW_BRANCH, SITE_STAGE: "preview" };

test("the review-branch pre-build check passes only for a Vercel Preview build of the review branch", () => {
  assert.equal(verify(good).status, 0, verify(good).stderr);
  const cases = [
    [{ ...good, VERCEL_ENV: "production" }, /VERCEL_ENV is "production"/],
    [{ ...good, VERCEL_TARGET_ENV: "production" }, /VERCEL_TARGET_ENV is "production"/],
    [{ ...good, VERCEL_GIT_COMMIT_REF: "feature/case-files-cf01-03" }, /branch is "feature\/case-files-cf01-03"/],
    [{ ...good, VERCEL_GIT_COMMIT_REF: undefined }, /branch is "unset"/],
    [{ ...good, VERCEL: undefined }, /not running on Vercel/],
    [{ ...good, SITE_STAGE: undefined }, /stage resolved to "public"/],
  ];
  for (const [env, message] of cases) {
    const r = verify(Object.fromEntries(Object.entries(env).filter(([, v]) => v !== undefined)));
    assert.notEqual(r.status, 0, JSON.stringify(env));
    assert.match(r.stderr, message);
  }
});

function guardOnBranch(branch, setup) {
  const dir = mkdtempSync(join(tmpdir(), "stage-"));
  for (const p of ["scripts", "messages", "src/content", "src/assets/evidence", ".gitignore", "package.json"]) cpSync(join(repo, p), join(dir, p), { recursive: true });
  setup?.(dir);
  execFileSync("git", ["init", "-q", "-b", branch], { cwd: dir });
  execFileSync("git", ["add", "-A"], { cwd: dir });
  const clean = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("VERCEL") && k !== "SITE_STAGE"));
  const r = spawnSync("node", ["scripts/check-content.mjs"], { cwd: dir, env: clean, encoding: "utf8" });
  rmSync(dir, { recursive: true, force: true });
  return { ok: r.status === 0, out: r.stdout + r.stderr };
}
const reviewConfig = (d) => writeFileSync(join(d, "vercel.json"), JSON.stringify({ buildCommand: "node scripts/verify-preview-build.mjs && SITE_STAGE=preview npm run build" }));

test("preview-mode build configuration cannot leak beyond the review branch", () => {
  assert.equal(guardOnBranch(REVIEW_BRANCH, reviewConfig).ok, true);
  for (const branch of ["feature/case-files-cf01-03", "feature/recruiter-experience-phase1", "main"]) {
    const r = guardOnBranch(branch, reviewConfig);
    assert.equal(r.ok, false, branch);
    assert.match(r.out, /vercel\.json requests preview mode/);
  }
  const pkg = guardOnBranch("feature/case-files-cf01-03", (d) => {
    const p = join(d, "package.json");
    const json = JSON.parse(execFileSync("cat", [p], { encoding: "utf8" }));
    json.scripts.build = "SITE_STAGE=preview next build";
    writeFileSync(p, JSON.stringify(json));
  });
  assert.equal(pkg.ok, false);
  assert.match(pkg.out, /package\.json script "build" must never request preview mode/);
});
