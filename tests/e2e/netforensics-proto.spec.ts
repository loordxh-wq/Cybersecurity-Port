import { expect, test } from "@playwright/test";
import { nfCopy, nfFrames } from "../../src/components/netforensics-proto/copy";
import { opsCopy } from "../../src/components/operations-mockup/copy";
import { axe, dirOf, locales, viewports } from "./helpers";

/**
 * Network Forensics prototype design frames (proposal branch). Public build: the route does
 * not exist. Preview build: every frame renders in EN/HE/AR, is never indexed, carries the
 * demonstration labels and Eli's identity masthead, keeps the technical canvas left-to-right,
 * has no horizontal overflow on desktop or a 360 px phone and no axe violations.
 */
const preview = process.env.E2E_STAGE === "preview";
const path = "/operations/network-forensics";

test.describe("network forensics prototype · public build", () => {
  test.skip(preview, "runs against a public build");
  test("the prototype does not exist publicly", async ({ request }) => {
    for (const l of locales) for (const q of ["", "?frame=ch3"]) expect((await request.get(`/${l}${path}${q}`)).status(), q).toBe(404);
  });
});

test.describe("network forensics prototype · protected preview", () => {
  test.skip(!preview, "runs against a SITE_STAGE=preview build");

  for (const [layout, vp] of [
    ["desktop", viewports.desktop],
    ["mobile", viewports.mobile360],
  ] as const) {
    test.describe(layout, () => {
      test.use(vp);
      for (const l of locales) {
        test(`${l}: every frame renders, labelled, identified, without overflow or axe violations`, async ({ page }) => {
          for (const f of nfFrames) {
            expect((await page.goto(`/${l}${path}?frame=${f}`))?.status()).toBe(200);
            await expect(page.locator("html")).toHaveAttribute("dir", dirOf(l));
            await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
            await expect(page.locator(".op-prov")).toContainText(opsCopy[l].tiers.demonstration.label);
            await expect(page.locator(".op-prov")).toContainText(opsCopy[l].notSoftware);
            await expect(page.locator(".nf-mast-name").first()).toHaveText("Eli Saad");
            if (f !== "preview-end") await expect(page.locator(".nf-stage")).toHaveAttribute("dir", "ltr");
            const ow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            expect(ow, `${l} ${f}`).toBeLessThanOrEqual(0);
            expect(await axe(page), `${l} ${layout} ${f}`).toEqual([]);
          }
        });
      }
    });
  }

  test("each display filter shows exactly the packets it matches", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [f, rows] of [
      ["ch1", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]],
      ["ch2", ["1", "2", "3", "4"]],
      ["ch3", ["5", "6", "7"]],
      ["ch4", ["8", "9"]],
    ] as const) {
      await page.goto(`/en${path}?frame=${f}`);
      expect(await page.locator(".nf-pkts tbody tr td:first-child").allInnerTexts(), f).toEqual([...rows]);
    }
  });

  test("narration is neutral: no first-person claims in the demonstration", async ({ page }) => {
    for (const f of nfFrames) {
      await page.goto(`/en${path}?frame=${f}`);
      expect(await page.locator(".op-wrap").innerText(), f).not.toMatch(/\b(I|my|me|I've|I'm)\b/);
    }
    for (const ch of nfCopy.en.chapters) for (const cap of ch.captions) expect(cap.text).not.toMatch(/\b(I|my)\b/);
  });
});
