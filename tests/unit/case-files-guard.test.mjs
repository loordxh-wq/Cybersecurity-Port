// Proves the case-file rules in scripts/check-content.mjs: a case reaches the public
// site only with real, reviewed evidence, and case text never carries real identifiers.
// Each case runs the real script against a temporary copy of the content it reads.
// Run: npm run test:guard
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

const repo = new URL("../../", import.meta.url).pathname;
const locales = ["en", "he", "ar"];

function sandbox(setup) {
  const dir = mkdtempSync(join(tmpdir(), "cases-"));
  for (const p of ["scripts", "messages", "src/content", "src/assets/evidence", ".gitignore"]) cpSync(join(repo, p), join(dir, p), { recursive: true });
  setup?.(dir);
  execFileSync("git", ["init", "-q"], { cwd: dir });
  execFileSync("git", ["add", "-A"], { cwd: dir });
  const r = spawnSync("node", ["scripts/check-content.mjs"], { cwd: dir, encoding: "utf8" });
  rmSync(dir, { recursive: true, force: true });
  return { ok: r.status === 0, out: r.stdout + r.stderr };
}
const json = (dir, path) => JSON.parse(readFileSync(join(dir, path), "utf8"));
const save = (dir, path, data) => writeFileSync(join(dir, path), JSON.stringify(data, null, 2));
const editCase = (dir, fn) => {
  const data = json(dir, "src/content/case-files.json");
  fn(data.cases[0]);
  save(dir, "src/content/case-files.json", data);
};
const editMessages = (dir, fn) => {
  for (const l of locales) {
    const m = json(dir, `messages/${l}.json`);
    fn(m.caseFiles.items.wireshark, l);
    save(dir, `messages/${l}.json`, m);
  }
};
// A minimal valid PNG (1x1, no metadata chunks).
const png = Buffer.from("89504e470d0a1a0a0000000d4948445200000001000000010806000000" + "1f15c4890000000d49444154789c6360000002000154a24f5f0000000049454e44ae426082", "hex");

/** A fully documented CF-01 (fixture only): evidence file, manifest, registry, messages, dates. */
function documented(dir, { file = "cf01-e01.png", body = png } = {}) {
  mkdirSync(join(dir, "src/assets/evidence"), { recursive: true });
  writeFileSync(join(dir, "src/assets/evidence", file), body);
  save(dir, "src/assets/evidence/manifest.json", { files: [{ file, source: "own-lab", sanitizedOn: "2026-11-02", approvedOn: "2026-11-03" }] });
  writeFileSync(join(dir, "src/content/evidence-images.ts"), `import a from "@/assets/evidence/${file}";\nexport const evidenceImages = { "${file}": a };\n`);
  editCase(dir, (c) => {
    c.status = "approved";
    c.evidence = [{ id: "E-01", file }];
    c.findings = [{ key: "f1", evidence: ["E-01"] }];
    c.updatedOn = "2026-11-03";
    c.approvedOn = "2026-11-03";
  });
  editMessages(dir, (it, l) => {
    it.summary = { did: `did (${l})`, shows: `shows (${l})` };
    it.findings = { f1: `finding (${l})` };
    it.lessons = `lessons (${l})`;
    it.evidence = { "E-01": { alt: `alt (${l})`, caption: `caption (${l})` } };
  });
}

test("the current project passes (CF-01 awaiting evidence, preview only)", () => {
  const r = sandbox();
  assert.equal(r.ok, true, r.out);
  assert.match(r.out, /1 case files \(0 public, 1 preview-only\)/);
});

test("a fully documented case with reviewed evidence passes", () => {
  const r = sandbox((d) => documented(d));
  assert.equal(r.ok, true, r.out);
});

test("approval without evidence, findings or dates is blocked", () => {
  const r = sandbox((d) => editCase(d, (c) => (c.status = "approved")));
  assert.equal(r.ok, false);
  assert.match(r.out, /approved without evidence files/);
  assert.match(r.out, /approved without findings/);
  assert.match(r.out, /approved without updatedOn and approvedOn/);
});

test("evidence must be sanitized, approved and registered", () => {
  const notApproved = sandbox((d) => {
    documented(d);
    save(d, "src/assets/evidence/manifest.json", { files: [{ file: "cf01-e01.png", source: "own-lab", sanitizedOn: "2026-11-02" }] });
  });
  assert.equal(notApproved.ok, false);
  assert.match(notApproved.out, /not recorded as sanitized and approved/);
  const notRegistered = sandbox((d) => {
    documented(d);
    writeFileSync(join(d, "src/content/evidence-images.ts"), "export const evidenceImages = {};\n");
  });
  assert.equal(notRegistered.ok, false);
  assert.match(notRegistered.out, /not registered/);
});

test("images that still carry metadata are blocked", () => {
  const withText = Buffer.concat([png.subarray(0, 33), Buffer.from("0000000c74455874436f6d6d656e7400686f7374", "hex"), png.subarray(33)]);
  const r = sandbox((d) => documented(d, { body: withText }));
  assert.equal(r.ok, false);
  assert.match(r.out, /metadata/);
});

test("a documented case needs every message in all three languages", () => {
  const r = sandbox((d) => {
    documented(d);
    const m = json(d, "messages/ar.json");
    delete m.caseFiles.items.wireshark.lessons;
    save(d, "messages/ar.json", m);
  });
  assert.equal(r.ok, false);
  assert.match(r.out, /missing ar message caseFiles\.items\.wireshark\.lessons/);
});

test("findings must cite evidence that exists", () => {
  const r = sandbox((d) => {
    documented(d);
    editCase(d, (c) => (c.findings = [{ key: "f1", evidence: ["E-09"] }]));
  });
  assert.equal(r.ok, false);
  assert.match(r.out, /cites unknown evidence E-09/);
});

test("case text never carries real IPs, MAC or email addresses; documentation IPs are fine", () => {
  const ip = sandbox((d) => editMessages(d, (it) => (it.environment = "Capture host 192.168.56.20 on the lab network.")));
  assert.equal(ip.ok, false);
  assert.match(ip.out, /real IP address \(192\.168\.56\.20\)/);
  const macAddr = sandbox((d) => editMessages(d, (it) => (it.environment = "Gateway 52:54:00:12:35:00.")));
  assert.match(macAddr.out, /MAC address/);
  const mail = sandbox((d) => editMessages(d, (it) => (it.environment = "Licence owner someone@example.com.")));
  assert.match(mail.out, /email address/);
  const doc = sandbox((d) => editMessages(d, (it) => (it.environment = "Example host 192.0.2.10 in lab.local.")));
  assert.equal(doc.ok, true, doc.out);
});

test("provenance is always a personal lab; video must be an own recording with three caption tracks", () => {
  assert.match(sandbox((d) => editCase(d, (c) => (c.provenance = "employment"))).out, /provenance must be "personal-lab"/);
  const thirdParty = sandbox((d) => editCase(d, (c) => (c.video = { provenance: "third-party", src: "x", poster: "y", captions: { en: "a" } })));
  assert.match(thirdParty.out, /video must be an own recording/);
  assert.match(thirdParty.out, /video needs he captions/);
});

test("video files are never committed to Git", () => {
  const r = sandbox((d) => {
    mkdirSync(join(d, "public/media"), { recursive: true });
    writeFileSync(join(d, "public/media/wireshark-preview.mp4"), "x");
  });
  assert.equal(r.ok, false);
  assert.match(r.out, /video files are hosted outside Git/);
});
