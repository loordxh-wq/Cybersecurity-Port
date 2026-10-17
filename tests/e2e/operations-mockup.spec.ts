import { expect, test } from "@playwright/test";
import { frames, opsCopy } from "../../src/components/operations-mockup/copy";
import { axe, dirOf, locales, viewports } from "./helpers";

/**
 * Cyber Operations proposal mockups (proposal branch). Public build: the route does not
 * exist. Preview build: every frame renders in EN/HE/AR, is never indexed, carries its
 * provenance labels, has no horizontal overflow on desktop or a 360 px phone and no axe
 * violations, and demonstration copy never makes first-person claims.
 */
const preview = process.env.E2E_STAGE === "preview";

test.describe("operations mockup · public build", () => {
  test.skip(preview, "runs against a public build");
  test("the mockup does not exist publicly", async ({ request }) => {
    for (const l of locales) for (const q of ["", "?frame=net", "?frame=text"]) expect((await request.get(`/${l}/operations${q}`)).status(), q).toBe(404);
  });
});

test.describe("operations mockup · protected preview", () => {
  test.skip(!preview, "runs against a SITE_STAGE=preview build");

  for (const [layout, vp] of [
    ["desktop", viewports.desktop],
    ["mobile", viewports.mobile360],
  ] as const) {
    test.describe(layout, () => {
      test.use(vp);
      for (const l of locales) {
        test(`${l}: every frame renders, labelled, without overflow or axe violations`, async ({ page }) => {
          const c = opsCopy[l];
          for (const f of frames) {
            const res = await page.goto(`/${l}/operations?frame=${f}`);
            expect(res?.status()).toBe(200);
            await expect(page.locator("html")).toHaveAttribute("dir", dirOf(l));
            await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
            await expect(page.locator(".op-banner")).toContainText(c.banner);
            if (["net", "siem", "ad", "text"].includes(f)) {
              await expect(page.locator(".op-prov")).toContainText(c.tiers.demonstration.label);
              await expect(page.locator(".op-prov")).toContainText(c.notSoftware);
              await expect(page.locator(".op-disclosure")).toHaveText(c.disclosure);
            }
            if (f === "soc") await expect(page.locator(".op-prov")).toContainText(c.simNote);
            const ow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            expect(ow, `${l} ${f}`).toBeLessThanOrEqual(0);
            expect(await axe(page), `${l} ${layout} ${f}`).toEqual([]);
          }
        });
      }
    });
  }

  test("demonstration copy makes no first-person claims and verified work is never shown as present", async ({ page }) => {
    for (const f of ["net", "siem", "ad", "text"]) {
      await page.goto(`/en/operations?frame=${f}`);
      const text = await page.locator(".op-wrap").innerText();
      expect(text, f).not.toMatch(/\b(I|my|me|I've|I'm)\b/);
    }
    await page.goto("/en/operations?frame=hub");
    for (const slot of await page.locator(".op-verified").all()) await expect(slot).toContainText(opsCopy.en.hub.awaiting);
  });

  test("technical values keep left-to-right order inside Hebrew and Arabic sentences", async ({ page }) => {
    for (const l of ["he", "ar"] as const) {
      await page.goto(`/${l}/operations?frame=net`);
      const isolated = await page.locator(".op-caption bdi[dir=ltr]").allInnerTexts();
      expect(isolated, l).toContain("24.1 ms");
    }
  });
});
