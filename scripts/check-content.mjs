// Content integrity: fails the build if portfolio content could reach the public
// site without its evidence, its translations or its simulated-data label, or if a
// case file could be published without reviewed evidence.
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

// ---------------------------------------------------------------- case files (Phase 2)
// A case reaches the public site only when it is approved, and approval needs real,
// reviewed evidence: sanitized and approved files, registered for rendering, findings
// tied to that evidence, every message in en/he/ar and approval dates. Provenance is
// always a personal lab. Video is optional; when present it must be an own recording
// with captions in all three languages. Case text never carries real addresses or
// identifiers (only RFC 5737 documentation IPs and lab.local are allowed).
const { cases } = read("src/content/case-files.json");
const registry = readFileSync(new URL("../src/content/evidence-images.ts", import.meta.url), "utf8");
const ipv4 = /\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/g;
const docIp = /^(192\.0\.2|198\.51\.100|203\.0\.113)\./;
const mac = /\b[0-9a-f]{2}(?:[:-][0-9a-f]{2}){5}\b/i;
const email = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const strings = (o) => (typeof o === "string" ? [o] : o && typeof o === "object" ? Object.values(o).flatMap(strings) : []);
const hasMetadata = (buf, file) => {
  const hay = buf.toString("latin1");
  if (/\.jpe?g$/i.test(file)) return hay.includes("Exif\0\0") || hay.includes("http://ns.adobe.com/xap/");
  if (/\.png$/i.test(file)) return /eXIf|tEXt|iTXt|zTXt/.test(hay);
  return hay.includes("Exif") || hay.includes("http://ns.adobe.com/xap/");
};
const caseIds = new Set();
for (const c of cases) {
  const name = c.number || c.id;
  if (caseIds.has(c.id)) fail(`duplicate case id: ${c.id}`);
  caseIds.add(c.id);
  if (!statuses.has(c.status)) fail(`${name}: unknown status "${c.status}"`);
  if (c.provenance !== "personal-lab") fail(`${name}: provenance must be "personal-lab"`);
  const base = `caseFiles.items.${c.id}`;
  const required = ["title", "objective", "environment", ...c.steps.flatMap((s) => [`steps.${s}.title`, `steps.${s}.detail`])];
  for (const l of locales) {
    for (const key of required) {
      const v = get(messages[l], `${base}.${key}`);
      if (typeof v !== "string" || !v.trim()) fail(`${name}: missing ${l} message ${base}.${key}`);
    }
    for (const text of strings(get(messages[l], base))) {
      for (const ip of text.match(ipv4) ?? []) if (!docIp.test(ip)) fail(`${name}: ${l} text contains a real IP address (${ip}); use an RFC 5737 example or redact it`);
      if (mac.test(text)) fail(`${name}: ${l} text contains a MAC address`);
      if (email.test(text)) fail(`${name}: ${l} text contains an email address`);
    }
  }
  if (c.video) {
    if (c.video.provenance !== "own-recording") fail(`${name}: video must be an own recording`);
    for (const l of locales) if (!c.video.captions?.[l]) fail(`${name}: video needs ${l} captions`);
  }
  const evidenceIds = new Set(c.evidence.map((e) => e.id));
  for (const f of c.findings) for (const id of f.evidence) if (!evidenceIds.has(id)) fail(`${name}: finding ${f.key} cites unknown evidence ${id}`);
  if (c.status === "approved") {
    if (!c.evidence.length) fail(`${name}: approved without evidence files`);
    if (!c.findings.length) fail(`${name}: approved without findings tied to evidence`);
    if (!c.updatedOn || !c.approvedOn) fail(`${name}: approved without updatedOn and approvedOn`);
    for (const l of locales) {
      for (const key of ["summary.did", "summary.shows", "lessons", ...c.findings.map((f) => `findings.${f.key}`), ...c.evidence.flatMap((e) => [`evidence.${e.id}.alt`, `evidence.${e.id}.caption`])]) {
        const v = get(messages[l], `${base}.${key}`);
        if (typeof v !== "string" || !v.trim()) fail(`${name}: missing ${l} message ${base}.${key}`);
      }
    }
    for (const e of c.evidence) {
      const url = new URL(`../src/assets/evidence/${e.file}`, import.meta.url);
      if (!existsSync(url)) {
        fail(`${name}: evidence file not found: ${e.file}`);
        continue;
      }
      const entry = manifest.files.find((f) => f.file === e.file);
      if (!entry?.sanitizedOn || !entry?.approvedOn) fail(`${name}: ${e.file} is not recorded as sanitized and approved in the manifest`);
      if (!registry.includes(`"${e.file}"`)) fail(`${name}: ${e.file} is not registered in src/content/evidence-images.ts`);
      if (hasMetadata(readFileSync(url), e.file)) fail(`${name}: ${e.file} still carries EXIF/XMP/text metadata; strip it before publishing`);
    }
  }
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
    if (/\.(mp4|webm|mov|mkv|m4v)$/i.test(name) && ships(r)) fail(`video files are hosted outside Git, never committed: ${r}`);
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
const pubCases = cases.filter((c) => c.status === "approved").length;
console.log(`content check passed: ${projects.length} projects (${pub} public), ${cases.length} case files (${pubCases} public, ${cases.length - pubCases} preview-only).`);
