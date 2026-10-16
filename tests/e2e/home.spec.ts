import { expect, test } from "@playwright/test";
import { settle, viewports } from "./helpers";

test.describe("home, desktop", () => {
  test.use(viewports.desktop);

  test("hero: name, role and actions are visible from the first paint", async ({ page }) => {
    await page.goto("/en", { waitUntil: "commit" });
    await page.waitForSelector(".cc-cta");
    const hidden = await page.evaluate(() =>
      [".cc-name-line", ".cc-role", ".cc-cta", ".cc-kicker"].filter((sel) => {
        for (let n = document.querySelector(sel) as HTMLElement | null; n && n !== document.body; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (parseFloat(s.opacity) < 0.99) return true;
          if (s.clipPath !== "none" && /inset\(\s*\d*[1-9]/.test(s.clipPath)) return true;
        }
        return false;
      }),
    );
    expect(hidden).toEqual([]);
  });

  test("scene is labelled as a network visualization and nothing around it claims live monitoring", async ({ page }) => {
    const labels = { en: "Network Visualization", he: "ויזואליזציה של רשת", ar: "عرض مرئي للشبكة" } as const;
    for (const locale of ["en", "he", "ar"] as const) {
      await page.goto(`/${locale}`);
      await expect(page.locator(".cc-scene")).toHaveAttribute("data-live", "true", { timeout: 20_000 });
      await expect(page.locator(".cc-sim")).toHaveText(labels[locale]);
      // The indicator uses the V4.1 cyan accent (#42d5f6), not the amber pending mark.
      await expect(page.locator(".cc-sim-tag")).toHaveCSS("background-color", "rgb(66, 213, 246)");
    }
    // English wording check of the hero: no live, monitoring, scanning or real-time claims.
    await page.goto("/en");
    const hero = await page.locator("#identity").innerText();
    expect(hero).not.toMatch(/\blive\b|monitor|scan|real[- ]time|telemetry|feed/i);
  });

  test("career line: tabs switch by click and arrow keys", async ({ page }) => {
    await page.goto("/en");
    const tabs = page.locator('#career [role="tab"]');
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator('#career [role="tabpanel"]:visible')).toContainText("Cellcom");
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator('#career [role="tabpanel"]:visible a[href*="linkedin.com"]')).toHaveAttribute("rel", /noopener/);
    await page.keyboard.press("Home");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  });

  test("career line: arrow keys follow the visual direction in RTL", async ({ page }) => {
    await page.goto("/ar");
    const tabs = page.locator('#career [role="tab"]');
    await tabs.nth(0).click();
    await page.keyboard.press("ArrowLeft");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  });

  test("credentials exhibition links each plate to its certificate", async ({ page }) => {
    await page.goto("/en");
    const plates = page.locator("#credentials a.cc-plate");
    await expect(plates).toHaveCount(3);
    await expect(plates.nth(0)).toHaveAttribute("href", "/en/certifications#csa");
    await expect(plates.nth(0)).toContainText("Certification");
    await expect(plates.nth(1)).toContainText("Course completion");
  });

  test("open to work: LinkedIn is the only contact action; no email, no form", async ({ page }) => {
    await page.goto("/en");
    const band = page.locator("#open-to-work");
    await expect(band.locator('a[href*="linkedin.com"]')).toHaveAttribute("target", "_blank");
    await expect(band.locator('a[href^="mailto:"], form')).toHaveCount(0);
  });

  test("public build: no placeholder or pending content anywhere", async ({ page }) => {
    for (const path of ["/en", "/he", "/ar"]) {
      await page.goto(path);
      await expect(page.locator("#work, .cc-pending")).toHaveCount(0);
    }
  });

  test("chapter rail tracks the chapter in view", async ({ page }) => {
    await page.goto("/en");
    await settle(page);
    const rail = page.locator('nav.home-rail');
    await expect(rail).toBeVisible();
    await page.locator("#credentials").scrollIntoViewIfNeeded();
    await expect(rail.locator('a[aria-current="true"]')).toHaveAttribute("href", "#credentials");
  });
});

test.describe("home, phone", () => {
  test.use(viewports.mobile360);
  test("first screen holds the name, the role and the primary action", async ({ page }) => {
    await page.goto("/en");
    await settle(page);
    const bottom = await page.locator(".cc-cta").evaluate((el) => el.getBoundingClientRect().bottom);
    expect(bottom).toBeLessThanOrEqual(800);
    await expect(page.locator("nav.home-rail")).toBeHidden();
  });
});
