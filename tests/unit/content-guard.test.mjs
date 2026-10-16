// Proves the document / CV / secret guard in scripts/check-content.mjs.
// Each case runs the real script against a temporary copy of the content it reads.
// Run: npm run test:guard
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

const repo = new URL("../../", import.meta.url).pathname;

function sandbox(setup, forceAdd = []) {
  const dir = mkdtempSync(join(tmpdir(), "guard-"));
  for (const p of ["scripts", "messages", "src/content", "src/assets/evidence", ".gitignore"]) cpSync(join(repo, p), join(dir, p), { recursive: true });
  setup?.(dir);
  // A git repo so "tracked" is meaningful; everything present is committed unless the case says otherwise.
  execFileSync("git", ["init", "-q"], { cwd: dir });
  execFileSync("git", ["add", "-A"], { cwd: dir });
  for (const f of forceAdd) execFileSync("git", ["add", "-f", f], { cwd: dir }); // simulate committing an ignored file
  const r = spawnSync("node", ["scripts/check-content.mjs"], { cwd: dir, encoding: "utf8" });
  rmSync(dir, { recursive: true, force: true });
  return { ok: r.status === 0, out: r.stdout + r.stderr };
}
const put = (dir, path, body = "x") => {
  mkdirSync(join(dir, path, ".."), { recursive: true });
  writeFileSync(join(dir, path), body);
};
const approve = (dir, docs) =>
  writeFileSync(join(dir, "src/content/public-documents.json"), JSON.stringify({ documents: docs }));

test("the current project passes", () => assert.equal(sandbox().ok, true));

test("a CV is blocked anywhere, approved or not", () => {
  for (const path of ["public/eli-cv.pdf", "public/documents/Eli_Saad_Resume.docx", "src/assets/cv.png", "docs/קורות-חיים.pdf"]) {
    const r = sandbox((d) => put(d, path));
    assert.equal(r.ok, false, path);
    assert.match(r.out, /CV-like file/);
  }
  const listed = sandbox((d) => {
    put(d, "public/documents/eli-saad-cv.pdf");
    approve(d, [{ path: "public/documents/eli-saad-cv.pdf", sanitizedOn: "2026-10-16", approvedOn: "2026-10-16" }]);
  });
  assert.equal(listed.ok, false);
});

test("an unapproved document is blocked", () => {
  const r = sandbox((d) => put(d, "public/documents/wireshark-lab-report.pdf"));
  assert.equal(r.ok, false);
  assert.match(r.out, /not approved for publication/);
});

test("an approved, sanitized project document is allowed", () => {
  const r = sandbox((d) => {
    put(d, "public/documents/wireshark-lab-report.pdf");
    approve(d, [{ path: "public/documents/wireshark-lab-report.pdf", title: "Wireshark lab", sanitizedOn: "2026-10-20", approvedOn: "2026-10-21" }]);
  });
  assert.equal(r.ok, true, r.out);
});

test("approval needs dates and an allowed folder", () => {
  const noDates = sandbox((d) => {
    put(d, "public/documents/ad-lab.pdf");
    approve(d, [{ path: "public/documents/ad-lab.pdf" }]);
  });
  assert.equal(noDates.ok, false);
  const wrongFolder = sandbox((d) => {
    put(d, "public/ad-lab.pdf");
    approve(d, [{ path: "public/ad-lab.pdf", sanitizedOn: "2026-10-20", approvedOn: "2026-10-21" }]);
  });
  assert.equal(wrongFolder.ok, false);
});

test("committed secrets are blocked; ignored local env files are not", () => {
  assert.equal(sandbox((d) => put(d, ".env.production", "TOKEN=1"), [".env.production"]).ok, false);
  assert.equal(sandbox((d) => put(d, "certs/server.key")).ok, false);
  assert.equal(sandbox((d) => put(d, "src/content/notes.md", "-----BEGIN RSA PRIVATE KEY-----")).ok, false);
  assert.equal(sandbox((d) => put(d, "src/content/x.json", '{"k":"AKIAABCDEFGHIJKLMNOP"}')).ok, false);
  // .env* is gitignored in the real repo, so a local file is never tracked or shipped.
  assert.equal(sandbox((d) => put(d, ".env.local", "TOKEN=1")).ok, true);
  assert.equal(sandbox((d) => put(d, ".env.example", "TOKEN=")).ok, true);
});

test("a CV route is blocked", () => {
  const r = sandbox((d) => put(d, "src/app/[locale]/cv/page.tsx", "export default function P() {}"));
  assert.equal(r.ok, false);
});
