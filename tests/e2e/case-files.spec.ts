import { expect, test } from "@playwright/test";
import { locales, viewports } from "./helpers";

/**
 * Public build: Case Files stay invisible until a case is documented and approved.
 * Today CF-01 awaits Eli's own Wireshark evidence, so every Case Files URL is a 404,
 * nothing links to them, the sitemap omits them and the footer has no statement.
 */
test.skip(process.env.E2E_STAGE === "preview", "public-build checks");
test.use(viewports.mobile);

for (const locale of locales) {
  test(`${locale}: no Case Files page, link or sitemap entry while nothing is documented`, async ({ page, request }) => {
    for (const path of ["/case-files", "/case-files/network-traffic-investigation"]) {
      const res = await request.get(`/${locale}${path}`);
      expect(res.status(), path).toBe(404);
    }
    await page.goto(`/${locale}`);
    await expect(page.locator('a[href*="/case-files"]')).toHaveCount(0);
    await page.locator("header button[aria-controls]").click();
    await expect(page.locator('#site-menu a[href*="/case-files"]')).toHaveCount(0);
  });
}

test("the sitemap lists no case file", async ({ request }) => {
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("case-files");
});
