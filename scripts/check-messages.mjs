// Fails if he.json or ar.json is missing any key from en.json (or has extras),
// or contains an empty string. This is how "100% translated" is enforced.
import { readFileSync } from "node:fs";

const locales = ["en", "he", "ar"];
const load = (l) => JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8"));

function flatten(obj, prefix = "", out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out.set(key, v);
  }
  return out;
}

const [base, ...rest] = locales.map((l) => ({ l, keys: flatten(load(l)) }));
let errors = 0;
for (const { l, keys } of [base, ...rest]) {
  for (const [k, v] of keys) {
    if (typeof v !== "string" || v.trim() === "") {
      console.error(`[${l}] empty or non-string value: ${k}`);
      errors++;
    }
  }
}
for (const { l, keys } of rest) {
  for (const k of base.keys.keys()) if (!keys.has(k)) { console.error(`[${l}] missing: ${k}`); errors++; }
  for (const k of keys.keys()) if (!base.keys.has(k)) { console.error(`[${l}] extra: ${k}`); errors++; }
}
if (errors) {
  console.error(`\ni18n check failed with ${errors} problem(s).`);
  process.exit(1);
}
console.log(`i18n check passed: ${base.keys.size} keys × ${locales.length} locales, no gaps.`);
