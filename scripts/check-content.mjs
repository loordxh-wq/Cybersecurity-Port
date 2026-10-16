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

// CV privacy: the CV is shared personally and must never ship with the site.
// No document files anywhere in the project, and no route that could serve one.
const root = new URL("../", import.meta.url);
const docExt = /\.(pdf|docx?|odt|rtf|pages)$/i;
const skip = new Set(["node_modules", ".next", ".git", "test-results", "playwright-report", "private"]);
function walk(dir, rel = "") {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = new URL(`${name}`, dir.href.endsWith("/") ? dir : new URL(`${dir.href}/`));
    const r = rel ? `${rel}/${name}` : name;
    if (statSync(path).isDirectory()) walk(new URL(`${path.href}/`), r);
    else if (docExt.test(name)) fail(`document file must not be in the project (share CVs privately): ${r}`);
    if (r.startsWith("src/app/") && /(^|\/)(cv|resume|curriculum)(\.|\/|$)/i.test(r)) fail(`no CV route may exist: ${r}`);
  }
}
walk(root);

if (errors) {
  console.error(`\ncontent check failed with ${errors} problem(s).`);
  process.exit(1);
}
const pub = projects.filter((p) => p.status === "approved").length;
console.log(`content check passed: ${projects.length} projects (${pub} public, ${projects.length - pub} preview-only).`);
