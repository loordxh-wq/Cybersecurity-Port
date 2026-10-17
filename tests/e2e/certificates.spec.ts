import { expect, test } from "@playwright/test";
import { axe, settle, viewports } from "./helpers";

for (const [vpName, locale] of [["desktop", "en"], ["mobile", "ar"], ["desktop", "he"]] as const) {
  test.describe(`certificate viewer ${vpName}/${locale}`, () => {
    test.use(viewports[vpName]);
    test("every certificate opens, loads, traps focus and closes with Escape or backdrop", async ({ page }) => {
      await page.goto(`/${locale}/certifications`);
      await settle(page);
      const cards = page.locator("main li > button");
      await expect(cards).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        await cards.nth(i).click();
        await page.waitForFunction(() => {
          const d = document.querySelector("dialog");
          const img = d?.querySelector("img");
          return !!d?.open && !!img?.complete && (img?.naturalWidth ?? 0) > 0;
        });
        expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
        if (i === 0) expect(await axe(page)).toEqual([]);
        await page.keyboard.press("Escape");
        await expect(page.locator("dialog[open]")).toHaveCount(0);
        expect(await page.evaluate(() => document.activeElement?.matches("main li > button") ?? false)).toBe(true);
      }
      await cards.nth(0).click();
      await expect(page.locator("dialog[open]")).toHaveCount(1);
      await page.mouse.click(3, 3);
      await expect(page.locator("dialog[open]")).toHaveCount(0);
    });
  });
}
