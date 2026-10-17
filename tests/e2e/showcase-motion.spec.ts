import { expect, test, type Page } from "@playwright/test";
import { copyFor } from "../../src/components/lab-mockup/copy";
import { motionCopy } from "../../src/components/showcase-motion/copy";
import { showcaseCopy } from "../../src/components/showcase-mockup/copy";
import { axe, dirOf, locales, viewports } from "./helpers";

/**
 * Phase 3 motion study (proposal branch, local prototype). Public build: it does not exist.
 * Preview build: no autoplay, labelled as a training simulation, accessible controls, the
 * iPhone composition keeps a fixed viewport with the transport on screen at 360/390/430,
 * reduced motion turns every movement into a cut, and no lab answer content is delivered.
 */
const preview = process.env.E2E_STAGE === "preview";

async function seek(page: Page, t: number) {
  await page.waitForFunction(() => !!window.__motion);
  await page.evaluate((s) => window.__motion!.seek(s), t);
}

test.describe("motion study · public build", () => {
  test.skip(preview, "runs against a public build");
  test("the motion study does not exist publicly", async ({ request }) => {
    for (const l of locales) for (const q of ["", "?chapter=3", "?chapter=2&capture=1"]) expect((await request.get(`/${l}/showcase/motion${q}`)).status(), q).toBe(404);
  });
});

test.describe("motion study · protected preview", () => {
  test.skip(!preview, "runs against a SITE_STAGE=preview build");

  for (const [layout, vp] of [
    ["desktop", viewports.desktop],
    ["mobile", viewports.mobile360],
  ] as const) {
    test.describe(layout, () => {
      test.use(vp);
      for (const l of locales) {
        test(`${l}: both chapters load paused, labelled and accessible`, async ({ page }) => {
          for (const ch of [2, 3]) {
            const res = await page.goto(`/${l}/showcase/motion?chapter=${ch}`);
            expect(res?.status()).toBe(200);
            await expect(page.locator("html")).toHaveAttribute("dir", dirOf(l));
            await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
            await expect(page.locator(".ms-simline")).toContainText(showcaseCopy[l].sim);
            await expect(page.locator(".ms-simline")).toContainText(showcaseCopy[l].notReal);
            await expect(page.locator(".ms").getByText(showcaseCopy[l].credit)).toBeVisible();
            // No autoplay: the start control is shown and the clock does not move.
            await expect(page.locator(".ms-start")).toBeVisible();
            await page.waitForTimeout(800);
            await expect(page.locator(".ms-bar")).toHaveAttribute("aria-valuenow", "0");
            const ow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            expect(ow).toBeLessThanOrEqual(0);
            expect(await axe(page), `${l} ${layout} chapter ${ch}`).toEqual([]);
            // Lab answer content is never delivered with the study.
            const html = await page.content();
            for (const s of [copyFor[l].debrief.notes[0], copyFor[l].debrief.summary]) expect(html).not.toContain(s);
          }
        });
      }
    });
  }

  test("play and pause are real controls; the clock advances only while playing", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/showcase/motion?chapter=2");
    await page.getByRole("button", { name: "Play" }).first().click();
    await expect.poll(async () => Number(await page.locator(".ms-bar").getAttribute("aria-valuenow")), { timeout: 5000 }).toBeGreaterThanOrEqual(1);
    await page.locator(".ms-transport").getByRole("button", { name: "Pause" }).click();
    const at = await page.locator(".ms-bar").getAttribute("aria-valuenow");
    await page.waitForTimeout(1500);
    await expect(page.locator(".ms-bar")).toHaveAttribute("aria-valuenow", at!);
    for (const name of ["Restart", "Play"]) await expect(page.locator(".ms-transport").getByRole("button", { name })).toBeVisible();
    expect(await page.locator(".ms-transport").evaluate((el) => getComputedStyle(el).direction)).toBe("ltr");
  });

  for (const [w, h] of [
    [360, 800],
    [390, 844],
    [430, 932],
  ]) {
    test(`iPhone ${w}: fixed viewport, transport on screen, nothing overflows through either chapter`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      for (const ch of [2, 3]) {
        await page.goto(`/en/showcase/motion?chapter=${ch}&capture=1`);
        const heights = new Set<number>();
        for (const t of [0, 5, 12, 20, 27, 33, 38, 45, 52, 60]) {
          await seek(page, t);
          heights.add(await page.locator(".ms-vp--mobile").evaluate((el) => el.clientHeight));
          const ow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          expect(ow, `chapter ${ch} at ${t}s`).toBeLessThanOrEqual(0);
        }
        expect(heights.size, "the viewport height never changes").toBe(1);
        const bar = (await page.locator(".ms-transport").boundingBox())!;
        expect(bar.y + bar.height, "transport visible without scrolling").toBeLessThanOrEqual(h);
        for (const b of await page.locator(".ms-transport button").all()) {
          const r = (await b.boundingBox())!;
          expect(Math.min(r.width, r.height)).toBeGreaterThanOrEqual(44);
        }
      }
    });
  }

  test("the closing frames state what the evidence supports and what remains uncertain", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [ch, k] of [
      [2, "ch2"],
      [3, "ch3"],
    ] as const) {
      await page.goto(`/en/showcase/motion?chapter=${ch}&capture=1`);
      await seek(page, ch === 2 ? 53 : 63);
      const lower = page.locator(".ms-vp--desk .ms-lower");
      await expect(lower).toContainText(motionCopy.en[k].supports);
      await expect(lower).toContainText(motionCopy.en[k].uncertain);
      expect(Number(await lower.locator("[data-kind=uncertain]").evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.95);
    }
  });

  test("reduced motion: no autoplay, and every change is a cut with no in-between frames", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/en/showcase/motion?chapter=2");
    await expect(page.locator(".ms-start-hint")).toHaveText(motionCopy.en.reduced);
    await page.goto("/en/showcase/motion?chapter=2&capture=1");
    await seek(page, 26.0); // 0.1 s into the inspector's entrance
    const insp = await page.locator(".ms").evaluate((el) => getComputedStyle(el).getPropertyValue("--insp").trim());
    expect(insp).toBe("1.0000");
    await expect(page.locator(".ms-vp--desk .ms-cursor")).toHaveCSS("opacity", "0");
    await ctx.close();
  });
});
