import { expect, test } from "@playwright/test";
import { locales, viewports } from "./helpers";

/**
 * Footer evidence statement. It appears only once a reviewed project is published
 * (status "approved"). While none is (today), the footer carries no lab or
 * simulated-data note at all. The wording itself is pinned in tests/unit.
 */
const statement = {
  en: "Technical investigations and hands-on projects are documented using personal lab environments. Evidence is reviewed before publication.",
  he: "חקירות טכניות ופרויקטים מעשיים מתועדים בסביבות מעבדה אישיות. הראיות נבדקות לפני פרסום.",
  ar: "تُوثَّق التحقيقات التقنية والمشاريع العملية في بيئات مختبر شخصية، وتُراجَع الأدلة قبل النشر.",
} as const;

test.describe("footer evidence statement (no approved project yet)", () => {
  test.use(viewports.mobile);
  for (const locale of locales) {
    test(`${locale}: no statement and no simulated-data note while nothing is published`, async ({ page }) => {
      for (const path of ["", "/about", "/recruiter"]) {
        await page.goto(`/${locale}${path}`);
        const footer = page.locator("footer.site-footer");
        await expect(footer.locator(".site-footer-labnote")).toHaveCount(0);
        await expect(footer).not.toContainText(statement[locale]);
        await expect(footer).not.toContainText(/simulated|demo/i);
        await expect(footer.locator(".cc-simtag")).toHaveCount(0);
      }
    });
  }
});
