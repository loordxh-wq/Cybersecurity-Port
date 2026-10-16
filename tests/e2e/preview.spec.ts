import { expect, test } from "@playwright/test";
import { axe, dirOf, locales, viewports } from "./helpers";

/**
 * Protected-preview build only (SITE_STAGE=preview npm run build, then
 * npm run test:e2e:preview). Placeholders appear, clearly marked, and the
 * preview banner is shown. Skipped in the normal public-build run.
 */
test.skip(process.env.E2E_STAGE !== "preview", "runs against a SITE_STAGE=preview build");
test.use(viewports.desktop);

test("case studies in preparation are visible and marked as pending", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("#work .cc-pending")).toHaveCount(4);
  await expect(page.locator("#work")).toContainText("Evidence pending");
  await expect(page.locator("#work")).toContainText("Simulated training lab");
  await expect(page.locator("footer")).toContainText("Protected preview build");
});

test.describe("case files in the protected preview", () => {
  for (const vpName of ["mobile360", "desktop"] as const) {
    test.describe(vpName, () => {
      test.use(viewports[vpName]);
      for (const locale of locales) {
        test(`${locale}: CF-01 is visible, marked awaiting evidence, invents nothing`, async ({ page }) => {
          await page.goto(`/${locale}/case-files`);
          await expect(page.locator("html")).toHaveAttribute("dir", dirOf(locale));
          await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
          await expect(page.locator(".cf-card")).toHaveCount(1);
          await expect(page.locator(".cf-card .cf-status[data-status=awaiting]")).toHaveCount(1);
          await expect(page.locator(".cf-meter-cell[data-filled]")).toHaveCount(0);
          expect(await axe(page)).toEqual([]);

          await page.locator(".cf-card-link").click();
          await page.waitForURL(`**/${locale}/case-files/network-traffic-investigation`);
          await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
          await expect(page.locator(".cf-notice")).toBeVisible();
          await expect(page.locator(".cf-step-tag")).toHaveCount(3);
          await expect(page.locator("#cf-findings .cf-slot, #cf-lessons .cf-slot")).toHaveCount(2);
          await expect(page.locator(".cf-gallery img, video, #cf-video")).toHaveCount(0);
          await expect(page.locator(".cf-figure-empty")).toHaveCount(3);
          const width = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
          expect(width.sw).toBeLessThanOrEqual(width.cw);
          expect(await axe(page)).toEqual([]);
        });
      }
    });
  }

  test("provenance reads Personal Lab; the nav item stays hidden until a case is public", async ({ page }) => {
    await page.goto("/en/case-files/network-traffic-investigation");
    await expect(page.locator(".cf-dossier .cf-card-prov")).toHaveText("Personal Lab");
    await expect(page.locator('header nav a[href="/en/case-files"]')).toHaveCount(0);
    await expect(page.locator("footer .site-footer-labnote")).toHaveCount(0);
  });
});
