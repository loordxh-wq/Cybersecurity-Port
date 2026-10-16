import { expect, test } from "@playwright/test";
import { axe, locales, settle, viewports } from "./helpers";

test.describe("mobile menu", () => {
  test.use(viewports.mobile);
  for (const locale of locales) {
    test(`${locale}: opens, focuses first link, Escape closes and returns focus, links navigate`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await settle(page);
      const button = page.locator("header button[aria-controls]");
      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");
      const menu = page.locator("#site-menu");
      await expect(menu).toBeVisible();
      await page.waitForTimeout(700);
      expect(await page.evaluate(() => document.activeElement?.closest("#site-menu") !== null && document.activeElement?.tagName === "A")).toBe(true);
      expect(await axe(page)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

      await page.keyboard.press("Escape");
      await expect(button).toHaveAttribute("aria-expanded", "false");
      expect(await page.evaluate(() => document.activeElement?.getAttribute("aria-controls"))).toBe("site-menu");

      await button.click();
      await menu.locator(`nav a[href="/${locale}/certifications"]`).click();
      await page.waitForURL(`**/${locale}/certifications`);
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await expect(menu).toHaveCount(0);
    });
  }
});

test.describe("desktop", () => {
  test.use(viewports.desktop);

  test("header navigation visits every page and marks the current one", async ({ page }) => {
    await page.goto("/he");
    for (const p of ["about", "certifications", "contact", ""]) {
      const href = `/he${p ? `/${p}` : ""}`;
      await page.locator(`header nav a[href="${href}"]`).first().click();
      await page.waitForURL(`**${href}`);
      await expect(page.locator('header nav a[aria-current="page"]')).toHaveAttribute("href", href);
    }
    await expect(page.locator("header button[aria-controls]")).toBeHidden();
  });

  test("language switcher keeps the page and flips direction", async ({ page }) => {
    await page.goto("/en/about");
    await settle(page);
    for (const [l, dir] of [["he", "rtl"], ["ar", "rtl"], ["en", "ltr"]] as const) {
      await page.locator(`header a[hreflang="${l}"]`).first().click();
      await page.waitForURL(`**/${l}/about`);
      await expect(page.locator("html")).toHaveAttribute("dir", dir);
    }
  });

  test("keyboard: skip link first, every stop shows a focus ring", async ({ page }) => {
    await page.goto("/en");
    await settle(page);
    const stops: { name: string; ring: boolean }[] = [];
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      stops.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          const s = getComputedStyle(el);
          return { name: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30), ring: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0 };
        }),
      );
    }
    expect(stops[0]?.name).toMatch(/skip/i);
    expect(stops.filter((s) => !s.ring)).toEqual([]);
  });
});
