import { expect, test } from "@playwright/test";
import { viewports } from "./helpers";

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
