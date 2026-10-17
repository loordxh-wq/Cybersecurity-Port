import { expect, test } from "@playwright/test";
import { showcaseCopy } from "../../src/components/showcase-mockup/copy";
import { axe, dirOf, locales, viewports } from "./helpers";

/**
 * Revised Phase 3 proposal mockup: SOC Investigation Showcase (static frames).
 * Preview build: every frame renders in three languages at desktop and phone width, is
 * labelled as a training simulation, passes axe, does not overflow and asks the visitor
 * to solve nothing. Public build: the route does not exist.
 */
const preview = process.env.E2E_STAGE === "preview";
const frames = ["hub", "c1", "c2", "c3", "c4", "c5", "end", "text"] as const;

test.describe("showcase mockup · public build", () => {
  test.skip(preview, "runs against a public build");
  test("the showcase route does not exist publicly and is not linked", async ({ page, request }) => {
    for (const l of locales) {
      for (const f of ["", "?frame=c2", "?frame=text"]) expect((await request.get(`/${l}/showcase${f}`)).status(), f).toBe(404);
    }
    await page.goto("/en");
    await expect(page.locator('a[href*="/showcase"]')).toHaveCount(0);
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/showcase");
  });
});

test.describe("showcase mockup · protected preview", () => {
  test.skip(!preview, "runs against a SITE_STAGE=preview build");

  for (const [layout, vp] of [
    ["desktop", viewports.desktop],
    ["mobile", viewports.mobile360],
  ] as const) {
    test.describe(layout, () => {
      test.use(vp);
      for (const l of locales) {
        test(`${l}: every frame renders, is labelled as a simulation and is accessible`, async ({ page }) => {
          const s = showcaseCopy[l];
          for (const f of frames) {
            const res = await page.goto(`/${l}/showcase?frame=${f}`);
            expect(res?.status(), f).toBe(200);
            await expect(page.locator("html")).toHaveAttribute("dir", dirOf(l));
            await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
            await expect(page.locator(".sc").getByText(s.sim, { exact: true }).first()).toBeVisible();
            await expect(page.locator(".sc").getByText(s.notReal).first()).toBeVisible();
            // The visitor observes: no answer controls, pins, forms or verdicts.
            await expect(page.locator('.sc form, .sc [role="radio"], .sc input, .sc textarea, .sc select')).toHaveCount(0);
            const ow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            expect(ow, `${f} overflow`).toBeLessThanOrEqual(0);
            expect(await axe(page), `${l} ${layout} ${f}`).toEqual([]);
          }
        });
      }
    });
  }

  test("authorship: AI assistance is disclosed; no claim that Eli designed or validated the material", async ({ page }) => {
    for (const l of locales) {
      for (const f of ["hub", "end", "text"]) {
        await page.goto(`/${l}/showcase?frame=${f}`);
        await expect(page.locator(".sc").getByText(showcaseCopy[l].credit)).toBeVisible();
      }
      await page.goto(`/${l}/lab`);
      await expect(page.locator(".lm-index-foot")).toContainText(showcaseCopy[l].credit);
    }
    await page.goto("/en/lab");
    await expect(page.locator("body")).not.toContainText("designed by Eli Saad");
  });

  test("every chapter states what was examined, why, what was observed, what is supported and what remains uncertain", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [i, f] of (["c1", "c2", "c3", "c4", "c5"] as const).entries()) {
      await page.goto(`/en/showcase?frame=${f}`);
      const c = showcaseCopy.en.chapters[i]!;
      for (const t of [c.examined, c.why, c.supports, c.uncertain]) await expect(page.locator(".sc-notes .sc-log")).toContainText(t);
    }
  });

  test("chapters: every marker on the screen has a matching line of text; controls are named", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [i, f] of (["c1", "c2", "c3", "c4", "c5"] as const).entries()) {
      await page.goto(`/en/showcase?frame=${f}`);
      const marks = await page.locator(".sc-screen .sc-mark").allTextContents();
      const notes = page.locator(".sc-notice li");
      await expect(notes).toHaveCount(showcaseCopy.en.chapters[i]!.observed.length);
      for (const m of new Set(marks)) expect(Number(m)).toBeLessThanOrEqual(await notes.count());
      await expect(page.locator('.sc-rail [aria-current="step"]')).toContainText(showcaseCopy.en.chapters[i]!.title);
      for (const name of ["Replay chapter", "Previous chapter", "Pause", "Next chapter"]) await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
    }
  });

  test("phones: the transport bar stays at the bottom, at most 64px tall, with 44px targets", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/he/showcase?frame=c2");
    const bar = page.locator(".sc-controls");
    const box = (await bar.boundingBox())!;
    expect(box.height).toBeLessThanOrEqual(64);
    expect(box.y + box.height).toBeLessThanOrEqual(844 + 1);
    for (const b of await page.locator(".sc-controls button:visible").all()) {
      const r = (await b.boundingBox())!;
      expect(r.width).toBeGreaterThanOrEqual(44);
      expect(r.height).toBeGreaterThanOrEqual(44);
    }
    // Media transport and time values stay left to right in RTL.
    expect(await page.locator(".sc-transport").evaluate((el) => getComputedStyle(el).direction)).toBe("ltr");
  });
});
