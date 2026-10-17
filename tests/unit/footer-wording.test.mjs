// Pins the approved footer evidence statement and the scene label in all three languages,
// and makes sure the old simulated-data note cannot come back.
// Run: npm run test:guard
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";

const repo = new URL("../../", import.meta.url).pathname;
const read = (loc) => JSON.parse(readFileSync(join(repo, "messages", `${loc}.json`), "utf8"));

const approved = {
  en: {
    labNote: "Technical investigations and hands-on projects are documented using personal lab environments. Evidence is reviewed before publication.",
    sceneLabel: "Network Visualization",
    personalLab: "Personal Lab",
  },
  he: {
    labNote: "חקירות טכניות ופרויקטים מעשיים מתועדים בסביבות מעבדה אישיות. הראיות נבדקות לפני פרסום.",
    sceneLabel: "ויזואליזציה של רשת",
    personalLab: "מעבדה אישית",
  },
  ar: {
    labNote: "تُوثَّق التحقيقات التقنية والمشاريع العملية في بيئات مختبر شخصية، وتُراجَع الأدلة قبل النشر.",
    sceneLabel: "عرض مرئي للشبكة",
    personalLab: "مختبر شخصي",
  },
};

test("approved wording in every language", () => {
  for (const [loc, w] of Object.entries(approved)) {
    const m = read(loc);
    assert.equal(m.footer.labNote, w.labNote, `${loc} footer.labNote`);
    assert.equal(m.home.sceneLabel, w.sceneLabel, `${loc} home.sceneLabel`);
    assert.equal(m.common.personalLab, w.personalLab, `${loc} common.personalLab`);
    assert.equal(m.footer.simulatedNote, undefined, `${loc}: old simulated-data note removed`);
    assert.equal(m.home.sceneSimulated, undefined, `${loc}: old scene label removed`);
  }
});

test("the footer shows the statement only when a project is approved", () => {
  const footer = readFileSync(join(repo, "src/components/SiteFooter.tsx"), "utf8");
  assert.match(footer, /hasPublishedWork \? \(\s*<p className="site-footer-labnote[^>]*>\{t\("labNote"\)\}<\/p>\s*\) : null/);
  const cases = readFileSync(join(repo, "src/content/case-files.ts"), "utf8");
  assert.match(cases, /publishedCases = caseFiles\.filter\(\(c\) => c\.status === "approved"\)/);
  assert.match(cases, /hasPublishedWork = publishedCases\.length > 0 \|\| projects\.some\(\(p\) => p\.status === "approved"\)/);
});
