import { expect, test, type Page } from "@playwright/test";
import { locales, settle, viewports } from "./helpers";

/** Wait until smooth scrolling has started (if it will) and come to rest. */
async function scrollRest(page: Page) {
  await page.waitForTimeout(400);
  await page.waitForFunction(
    () =>
      new Promise<boolean>((resolve) => {
        const y = scrollY;
        setTimeout(() => resolve(scrollY === y), 300);
      }),
    null,
    { timeout: 10_000 },
  );
}

async function headerBottom(page: Page) {
  return page.locator("header.site-header").evaluate((el) => el.getBoundingClientRect().bottom);
}

for (const vpName of ["mobile360", "mobile", "desktop"] as const) {
  test.describe(`anchors clear the fixed header ${vpName}`, () => {
    test.use(viewports[vpName]);
    for (const locale of locales) {
      test(`${locale}: section titles land below the header`, async ({ page }) => {
        await page.goto(`/${locale}`);
        await settle(page);
        // In-page links: the hero scroll cue (desktop only) and the Open to Work band's CV link.
        for (const [link, title] of [
          ["a.cc-scroll[href='#mission']", "#mission-title"],
          ["#open-to-work a[href='#cv']", "#cv-title"],
        ] as const) {
          if (!(await page.locator(link).first().isVisible())) continue;
          await page.locator(link).first().click();
          await scrollRest(page);
          const top = await page.locator(title).evaluate((el) => el.getBoundingClientRect().top);
          expect(top, `${link} → ${title}`).toBeGreaterThanOrEqual((await headerBottom(page)) + 8);
        }
        // Deep links into the home page.
        await page.goto(`/${locale}#cv`);
        await scrollRest(page);
        expect(await page.locator("#cv-title").evaluate((el) => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual((await headerBottom(page)) + 8);
        // Deep links from other pages: certificate cards.
        // (Next.js scrolls to the fragment after hydration, so poll for the final position.)
        await page.goto(`/${locale}/certifications#csa`);
        const hb = await headerBottom(page);
        const cardTop = () => page.locator("li#csa").evaluate((el) => el.getBoundingClientRect().top);
        await expect.poll(cardTop, { timeout: 8_000 }).toBeLessThanOrEqual(hb + 48); // close under the header
        await scrollRest(page);
        expect(await cardTop()).toBeGreaterThanOrEqual(hb + 8); // never under it
      });
    }
  });
}

test.describe("phone header and layout", () => {
  test.use(viewports.mobile360);

  test("Recruiters pill: lighter 36px pill, 44px touch target", async ({ page }) => {
    for (const locale of locales) {
      await page.goto(`/${locale}/certifications`);
      const pill = page.locator("header a.site-recruiter");
      const box = (await pill.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(35);
      expect(box.height).toBeLessThanOrEqual(38);
      // Taps just above and below the drawn pill still hit it.
      const x = box.x + box.width / 2;
      for (const y of [box.y - 3, box.y + box.height + 3]) {
        expect(await page.evaluate(([px, py]) => !!document.elementFromPoint(px!, py!)?.closest("a.site-recruiter"), [x, y])).toBe(true);
      }
    }
  });

  test("the band's moving floor stays below the Open to Work text on phones", async ({ page }) => {
    await page.goto("/he");
    await page.locator("#open-to-work").scrollIntoViewIfNeeded();
    const floorTop = await page.locator(".home-band-floor").evaluate((el) => el.getBoundingClientRect().top);
    const textBottom = await page.locator(".home-band-grid").evaluate((el) => el.getBoundingClientRect().bottom);
    expect(floorTop).toBeGreaterThanOrEqual(textBottom);
  });

  test("edge-to-edge viewport for iPhone safe areas", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /viewport-fit=cover/);
  });
});

test.describe("CV modal on a short phone screen", () => {
  // iPhone SE-like height with browser bars: the bottom sheet must scroll inside itself.
  test.use({ ...viewports.mobile360, viewport: { width: 360, height: 560 } });

  for (const locale of locales) {
    test(`${locale}: fits, scrolls inside, keeps focus, closes three ways`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await settle(page);
      const trigger = page.locator("button.hero-cv-trigger");
      await trigger.click();
      const dialog = page.locator("dialog.cv-dialog[open]");
      await expect(dialog).toBeVisible();

      // Inside the screen, anchored to the bottom (once the sheet has slid in), with the page behind locked.
      await expect.poll(async () => Math.round(((await dialog.boundingBox())!.y + (await dialog.boundingBox())!.height))).toBe(560);
      expect((await dialog.boundingBox())!.y).toBeGreaterThanOrEqual(0);
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");
      expect(await dialog.evaluate((el) => getComputedStyle(el).overscrollBehaviorY)).toBe("contain");

      // Taller than the screen: it scrolls on its own and the last link becomes reachable.
      const pageY = await page.evaluate(() => scrollY);
      expect(await dialog.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
      await dialog.hover();
      await page.mouse.wheel(0, 2000);
      await expect(dialog.locator(".cv-dlg-foot a")).toBeInViewport();
      expect(await page.evaluate(() => scrollY)).toBe(pageY);

      // Keyboard: Tab never leaves the dialog.
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press("Tab");
        expect(await page.evaluate(() => !!document.activeElement?.closest("dialog[open]") || document.activeElement === document.body)).toBe(true);
      }

      // Close button returns focus to the trigger.
      await dialog.locator("button.cv-dlg-close").click();
      await expect(page.locator("dialog.cv-dialog[open]")).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe("hidden");

      // A tap on the backdrop above the sheet closes it.
      await trigger.click();
      await expect(dialog).toBeVisible();
      const top = (await dialog.boundingBox())!.y;
      if (top > 4) {
        await page.mouse.click(180, top / 2);
        await expect(page.locator("dialog.cv-dialog[open]")).toHaveCount(0);
      } else {
        await page.keyboard.press("Escape");
      }

      // Escape closes it too.
      await trigger.click();
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator("dialog.cv-dialog[open]")).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }
});
