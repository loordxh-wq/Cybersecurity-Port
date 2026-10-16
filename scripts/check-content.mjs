// Content integrity: fails the build if portfolio content could reach the public
// site without its evidence, its translations or its simulated-data label.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const locales = ["en", "he", "ar"];
const messages = Object.fromEntries(locales.map((l) => [l, read(`messages/${l}.json`)]));
const { projects } = read("src/content/projects.json");
const manifest = read("src/assets/evidence/manifest.json");
const statuses = new Set(["placeholder", "draft", "approved"]);
const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

let errors = 0;
const fail = (msg) => {
  console.error(msg);
  errors++;
};

const ids = new Set();
for (const p of projects) {
  if (ids.has(p.id)) fail(`duplicate project id: ${p.id}`);
  ids.add(p.id);
  if (!statuses.has(p.status)) fail(`${p.id}: unknown status "${p.status}"`);
  if (typeof p.simulated !== "boolean") fail(`${p.id}: "simulated" must be true or false`);
  for (const l of locales) {
    for (const key of [`projects.items.${p.id}.title`, `projects.items.${p.id}.summary`, `projects.items.${p.id}.needed`]) {
      const v = get(messages[l], key);
      if (typeof v !== "string" || !v.trim()) fail(`${p.id}: missing ${l} message ${key}`);
    }
  }
  if (p.status === "approved") {
    if (!p.evidence.length) fail(`${p.id}: approved without evidence files`);
    for (const file of p.evidence) {
      if (!existsSync(new URL(`../src/assets/evidence/${file}`, import.meta.url))) fail(`${p.id}: evidence file not found: ${file}`);
      const entry = manifest.files.find((f) => f.file === file);
      if (!entry?.sanitizedOn || !entry?.approvedOn) fail(`${p.id}: ${file} is not recorded as sanitized and approved in the manifest`);
    }
  }
}
for (const l of locales) {
  if (!get(messages[l], "common.simulatedTraining")) fail(`missing ${l} message common.simulatedTraining`);
}

// ---------------------------------------------------------------- documents, CV and secrets
// 1. A CV never ships: any document or image whose name looks like a CV fails,
//    approved or not, and no route may be named like one.
// 2. Other documents (PDF, Word, ...) may ship only when Eli has approved a sanitized
//    copy: it must live in public/documents/ or src/assets/evidence/ and be listed in
//    src/content/public-documents.json with sanitizedOn and approvedOn dates.
// 3. Secrets never ship: tracked env files, private keys and keystores fail, and so
//    does private-key or token text in source and content files.
// private/ (gitignored, local only) is never scanned or shipped.
const root = new URL("../", import.meta.url);
const { documents: approvedDocs } = read("src/content/public-documents.json");
const docExt = /\.(pdf|docx?|odt|rtf|pages|xlsx?|pptx?)$/i;
const cvLikeExt = /\.(pdf|docx?|odt|rtf|pages|png|jpe?g|webp|gif|zip)$/i;
const cvLikeName = /(^|[^a-z])(cv|resume|résumé|curriculum[-_ ]?vitae)([^a-z]|$)|קורות[-_ ]?חיים|سيرة[-_ ]?ذاتية/i;
const docDirs = ["public/documents/", "src/assets/evidence/"];
const secretFile = /(^|\/)(\.env(\..+)?|id_(rsa|dsa|ecdsa|ed25519)(\.pub)?|.+\.(pem|key|p12|pfx|jks|keystore|kdbx))$/i;
const allowedSecretLike = new Set([".env.example"]);
const secretText = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key"],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}\b/, "GitHub token"],
  [/\bxox[abprs]-[A-Za-z0-9-]{10,}\b/, "Slack token"],
];
const textExt = /\.(ts|tsx|js|mjs|cjs|json|css|md|mdx|txt|html|svg|ya?ml)$/i;
const skip = new Set(["node_modules", ".next", ".git", "test-results", "playwright-report", "private", ".vercel"]);

// Tracked files, when git is available: an ignored local .env is fine, a tracked one is not.
let tracked = null;
try {
  const { execSync } = await import("node:child_process");
  tracked = new Set(execSync("git ls-files", { cwd: new URL(".", root), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n").filter(Boolean));
} catch {
  tracked = null; // no git (e.g. a build from an upload): treat every file as shippable
}
const ships = (r) => tracked === null || tracked.has(r);

for (const d of approvedDocs) {
  if (!d.path || !docDirs.some((dir) => d.path.startsWith(dir))) fail(`approved document must live in ${docDirs.join(" or ")}: ${d.path}`);
  if (!d.sanitizedOn || !d.approvedOn) fail(`approved document needs sanitizedOn and approvedOn: ${d.path}`);
  if (!existsSync(new URL(d.path, root))) fail(`approved document not found: ${d.path}`);
}

function walk(dir, rel = "") {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const url = new URL(name, dir);
    const r = rel ? `${rel}/${name}` : name;
    if (statSync(url).isDirectory()) {
      walk(new URL(`${url.href}/`), r);
      continue;
    }
    if (cvLikeExt.test(name) && cvLikeName.test(name.replace(/\.[^.]+$/, ""))) fail(`CV-like file must never be in the project (share CVs privately): ${r}`);
    else if (docExt.test(name) && !approvedDocs.some((d) => d.path === r)) fail(`document not approved for publication (list a sanitized copy in src/content/public-documents.json): ${r}`);
    if (r.startsWith("src/app/") && /(^|\/)(cv|resume|curriculum)(\.|\/|$)/i.test(r)) fail(`no CV route may exist: ${r}`);
    if (secretFile.test(r) && !allowedSecretLike.has(name) && ships(r)) fail(`secret or key file must not be committed: ${r}`);
    if (textExt.test(name) && ships(r) && statSync(url).size < 2_000_000) {
      const text = readFileSync(url, "utf8");
      for (const [re, label] of secretText) if (re.test(text)) fail(`${label} found in ${r}`);
    }
  }
}
walk(root);
if (!/^\/?private\/?$/m.test(readFileSync(new URL(".gitignore", root), "utf8"))) fail(".gitignore must keep private/ out of the repository");

if (errors) {
  console.error(`\ncontent check failed with ${errors} problem(s).`);
  process.exit(1);
}
const pub = projects.filter((p) => p.status === "approved").length;
console.log(`content check passed: ${projects.length} projects (${pub} public, ${projects.length - pub} preview-only).`);
