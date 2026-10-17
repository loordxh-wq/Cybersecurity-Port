// Eli's names are fixed per language: EN "Eli Saad", HE "איליא סעד", AR "إيلي سعد".
// The earlier Hebrew spelling "אילי" (without the final alef) must never come back.
// Run: npm run test:guard
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

const repo = new URL("../../", import.meta.url).pathname;
const wrongHebrew = /אילי(?!א)/;

function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : /\.(json|tsx?|mjs|md|css)$/.test(n) ? [p] : [];
  });
}

test("no source or translation file uses the old Hebrew spelling", () => {
  const hits = [...files(join(repo, "messages")), ...files(join(repo, "src"))]
    .flatMap((p) => readFileSync(p, "utf8").split("\n").map((line, i) => [relative(repo, p), i + 1, line]))
    .filter(([, , line]) => wrongHebrew.test(line))
    .map(([p, n]) => `${p}:${n}`);
  assert.deepEqual(hits, []);
});

test("each language names Eli correctly in the hero and site name", () => {
  const expected = { en: "Eli Saad", he: "איליא סעד", ar: "إيلي سعد" };
  for (const [locale, name] of Object.entries(expected)) {
    const m = JSON.parse(readFileSync(join(repo, "messages", `${locale}.json`), "utf8"));
    assert.equal(m.hero.name, name, `${locale} hero.name`);
    assert.equal(m.meta.siteName, name, `${locale} meta.siteName`);
  }
});
