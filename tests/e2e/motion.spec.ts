import { expect, test } from "@playwright/test";
import { viewports } from "./helpers";

test.describe("motion", () => {
  test.use(viewports.desktop);

  test("the scene animates with normal motion", async ({ page }) => {
    await page.goto("/en");
    const scene = page.locator(".cc-scene");
    await expect(scene).toHaveAttribute("data-live", "true", { timeout: 20_000 });
    await page.waitForTimeout(1500);
    const a = await scene.screenshot();
    await page.waitForTimeout(900);
    const b = await scene.screenshot();
    expect(a.equals(b)).toBe(false);
  });
});

test.describe("reduced motion", () => {
  test.use({ ...viewports.desktop, contextOptions: { reducedMotion: "reduce" } });

  test("the scene renders one still frame and all text is visible", async ({ page }) => {
    await page.goto("/en");
    const scene = page.locator(".cc-scene");
    await expect(scene).toHaveAttribute("data-live", "true", { timeout: 20_000 });
    await page.waitForTimeout(1500);
    const a = await page.locator(".cc-hero").screenshot();
    await page.waitForTimeout(1500);
    const b = await page.locator(".cc-hero").screenshot();
    expect(a.equals(b)).toBe(true);
    for (const sel of [".cc-name-line", ".cc-role", ".cc-cta"]) {
      await expect(page.locator(sel).first()).toBeVisible();
    }
  });

  test("career line is fully drawn without animation", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#career").scrollIntoViewIfNeeded();
    const transform = await page.locator("#career .cc-signal-stop").first().evaluate((el) => getComputedStyle(el, "::before").transform);
    expect(transform).toBe("none");
  });
});
