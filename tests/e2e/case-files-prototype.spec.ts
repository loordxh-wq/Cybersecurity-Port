import { expect, test } from "@playwright/test";
import { axe, dirOf, locales, viewports } from "./helpers";

/**
 * Phase 2 design prototype (/concepts/case-files). Checks that it is isolated
 * (noindex, unlinked, not in the sitemap), honest (every case awaiting evidence,
 * no images, video or findings invented, steps marked as planned), and that it
 * holds up on phones, in RTL and for keyboard and screen-reader users.
 */
const pages = ["/concepts/case-files", "/concepts/case-files/wireshark", "/concepts/case-files/splunk", "/concepts/case-files/ad"];

for (const vpName of ["mobile360", "mobile", "desktop"] as const) {
  test.describe(`case files prototype ${vpName}`, () => {
    test.use(viewports[vpName]);
    for (const locale of locales) {
      test(`${locale}: layout, accessibility, isolation`, async ({ page }) => {
        for (const path of pages) {
          await page.goto(`/${locale}${path}`);
          await expect(page.locator("html")).toHaveAttribute("dir", dirOf(locale));
          await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
          await expect(page.locator(".cf-proto")).toBeVisible();
          const width = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
          expect(width.sw, `${path} horizontal scroll`).toBeLessThanOrEqual(width.cw);
          expect(await axe(page), path).toEqual([]);
        }
      });
    }
  });
}

for (const vpName of ["mobile360", "mobile"] as const) {
  test.describe(`case files refinements ${vpName}`, () => {
    test.use(viewports[vpName]);
    for (const locale of locales) {
      test(`${locale}: status badges stay on one line, apart from the case number`, async ({ page }) => {
        for (const path of ["/concepts/case-files", "/concepts/case-files/wireshark"]) {
          await page.goto(`/${locale}${path}`);
          for (const plate of await page.locator(".cf-plate").all()) {
            const no = (await plate.locator(".cf-plate-no").boundingBox())!;
            const status = plate.locator(".cf-status");
            const box = (await status.boundingBox())!;
            // Below the number, never beside it; one line high; inside the plate.
            expect(box.y).toBeGreaterThanOrEqual(no.y + no.height);
            // The label renders on exactly one line (distinct line boxes of its text).
            const lines = await status.evaluate((el) => {
              const text = Array.from(el.childNodes).find((n) => n.nodeType === 3 && n.textContent?.trim())!;
              const range = document.createRange();
              range.selectNodeContents(text);
              return new Set(Array.from(range.getClientRects()).filter((r) => r.width > 0).map((r) => Math.round(r.top))).size;
            });
            expect(lines, `${path} status wraps`).toBe(1);
            const pb = (await plate.boundingBox())!;
            expect(box.x).toBeGreaterThanOrEqual(pb.x - 1);
            expect(box.x + box.width).toBeLessThanOrEqual(pb.x + pb.width + 1);
          }
        }
      });
    }
  });
}

test.describe("case files prototype: integrity and interaction", () => {
  test.use(viewports.mobile);

  test("every case is awaiting evidence and nothing is invented", async ({ page }) => {
    await page.goto("/en/concepts/case-files");
    await expect(page.locator(".cf-card")).toHaveCount(3);
    await expect(page.locator(".cf-card .cf-status[data-status=awaiting]")).toHaveCount(3);
    await expect(page.locator(".cf-meter-cell[data-filled]")).toHaveCount(0);
    for (const id of ["wireshark", "splunk", "ad"]) {
      await page.goto(`/en/concepts/case-files/${id}`);
      await expect(page.locator(".cf-notice")).toBeVisible();
      await expect(page.locator(".cf-card-prov").first()).toHaveText("Personal home lab · not employment");
      // No evidence images, no video element, no findings text: slots only.
      await expect(page.locator(".cf-gallery img, video")).toHaveCount(0);
      await expect(page.locator("#cf-findings .cf-slot")).toHaveCount(1);
      await expect(page.locator("#cf-lessons .cf-slot")).toHaveCount(1);
      // Every step is labelled as planned.
      await expect(page.locator(".cf-step")).toHaveCount(3);
      await expect(page.locator(".cf-step-tag")).toHaveText(Array(3).fill("Planned step"));
      await expect(page.locator(".cf-facts")).toContainText("Not yet recorded");
    }
  });

  test("status explanation sits in a closed disclosure; diagrams are decorative", async ({ page }) => {
    await page.goto("/en/concepts/case-files");
    const verify = page.locator("details.cf-verify");
    await expect(verify).not.toHaveAttribute("open", "");
    await expect(page.locator(".cf-legend-row .cf-status")).toHaveCount(3);
    await verify.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(verify.locator("dd")).toHaveCount(3);
    await expect(verify).toContainText("sanitized");
    // One abstract diagram per card, hidden from assistive technology, no images.
    await expect(page.locator(".cf-card svg.cf-glyph[aria-hidden=true]")).toHaveCount(3);
    await expect(page.locator(".cf-card img")).toHaveCount(0);
  });

  test("not linked from the site and not in the sitemap", async ({ page, request }) => {
    for (const path of ["/en", "/he/recruiter", "/ar/certifications"]) {
      await page.goto(path);
      await expect(page.locator('a[href*="/concepts/case-files"]')).toHaveCount(0);
    }
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("case-files");
  });

  test("keyboard: cards are single links, technical detail opens, contents jump to sections", async ({ page }) => {
    await page.goto("/he/concepts/case-files");
    const first = page.locator(".cf-card-link").first();
    await first.focus();
    await expect(first).toBeFocused();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/he/concepts/case-files/wireshark");

    const detail = page.locator(".cf-detail").first();
    await detail.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(detail).toHaveAttribute("open", "");
    await expect(detail.locator("p")).toBeVisible();

    const toc = page.locator("details.cf-toc--mob");
    await toc.locator("summary").click();
    await toc.locator('a[href="#cf-evidence"]').click();
    await expect.poll(() => page.locator("#cf-evidence-h").evaluate((el) => el.getBoundingClientRect().top), { timeout: 5000 }).toBeLessThan(200);
  });
});
