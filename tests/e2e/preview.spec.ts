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

const tally = { en: "3 planned investigations", he: "3 חקירות מתוכננות", ar: "3 تحقيقات مخطّطة" } as const;

const cases = [
  { slug: "network-traffic-investigation", stages: 5, steps: 4, checks: 4, category: "network" },
  { slug: "soc-alert-investigation", stages: 5, steps: 4, checks: 4, category: "siem" },
  { slug: "active-directory-operations", stages: 5, steps: 4, checks: 3, category: "identity" },
] as const;

test.describe("case files in the protected preview", () => {
  for (const vpName of ["mobile360", "desktop"] as const) {
    test.describe(vpName, () => {
      test.use(viewports[vpName]);
      for (const locale of locales) {
        test(`${locale}: CF-01 to CF-03 are visible, planned, and invent nothing`, async ({ page }) => {
          await page.goto(`/${locale}/case-files`);
          await expect(page.locator("html")).toHaveAttribute("dir", dirOf(locale));
          await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
          await expect(page.locator(".cf-card")).toHaveCount(3);
          await expect(page.locator(".cf-card .cf-status[data-status=awaiting]")).toHaveCount(3);
          // The planned state is stated once ("3 planned investigations"); the cards repeat it
          // quietly, with no empty evidence meters.
          await expect(page.locator(".cf-tally")).toHaveText(tally[locale]);
          await expect(page.locator(".cf-card .cf-status--quiet")).toHaveCount(3);
          await expect(page.locator(".cf-card .cf-meter, .cf-meter-cell[data-filled]")).toHaveCount(0);
          // The status key sits on one line on a phone.
          const rows = await page.locator(".cf-legend-row > li").evaluateAll((els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size);
          expect(rows).toBe(1);
          expect(await axe(page)).toEqual([]);

          for (const c of cases) {
            await page.goto(`/${locale}/case-files/${c.slug}`);
            await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
            // Planned cases stay quiet: no notice, no placeholder boxes, one "Planned" marker
            // on the steps heading and a single compact evidence panel.
            await expect(page.locator(".cf-notice, .cf-slot, .cf-figure-empty")).toHaveCount(0);
            await expect(page.locator("#cf-summary, #cf-findings, #cf-lessons")).toHaveCount(0);
            await expect(page.locator(".cf-evidence-pending")).toHaveCount(1);
            // No empty facts: no "0 of 3" meter and no "Not yet recorded" date on a planned case.
            await expect(page.locator(".cf-meter")).toHaveCount(0);
            await expect(page.locator(".cf-facts > div")).toHaveCount(1);
            await expect(page.locator("details.cf-toc--mob .cf-toc-list li")).toHaveCount(7);
            await expect(page.locator(".cf-section-tag")).toHaveCount(1);
            await expect(page.locator("#cf-steps .cf-section-tag")).toHaveCount(1);
            await expect(page.locator(".cf-step")).toHaveCount(c.steps);
            // Method content: diagram described by its caption, five stages, technical checks.
            const svg = page.locator(`.cf-diagram-svg[data-category=${c.category}]`);
            await expect(svg).toHaveAttribute("role", "img");
            const captionId = await svg.getAttribute("aria-labelledby");
            await expect(page.locator(`#${captionId}`)).not.toBeEmpty();
            await expect(page.locator(".cf-flow > li")).toHaveCount(c.stages);
            await expect(page.locator(".cf-checks > li")).toHaveCount(c.checks);
            // No results claimed: no screenshots, findings or video.
            await expect(page.locator(".cf-gallery img, video, #cf-video, .cf-findings")).toHaveCount(0);
            const width = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
            expect(width.sw, c.slug).toBeLessThanOrEqual(width.cw);
            expect(await axe(page), c.slug).toEqual([]);
          }
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

  test("keyboard: the stage flow and contents work in RTL; technical detail opens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/he/case-files/soc-alert-investigation");
    const first = page.locator(".cf-flow > li").first();
    const last = page.locator(".cf-flow > li").last();
    // Vertical on phones: stage 01 is above stage 05.
    expect((await first.boundingBox())!.y).toBeLessThan((await last.boundingBox())!.y);
    const detail = page.locator(".cf-detail").first();
    await detail.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(detail).toHaveAttribute("open", "");
  });
});
