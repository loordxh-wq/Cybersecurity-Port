import { expect, test } from "@playwright/test";
import { pages, viewports } from "./helpers";

const wrong = /אילי(?!א)/;

test.describe("Hebrew name: איליא סעד everywhere it is shown", () => {
  test.use(viewports.mobile);

  for (const [name, path] of pages) {
    test(`he ${name}: text, title, social and structured data`, async ({ page }) => {
      await page.goto(`/he${path}`);
      const html = await page.content(); // includes <title>, meta, Open Graph and JSON-LD
      expect(html).not.toMatch(wrong);
      await expect(page).toHaveTitle(/איליא סעד/);
      await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "איליא סעד");
    });
  }

  test("hero, CV dialog and printable brief", async ({ page }) => {
    await page.goto("/he");
    // The hero sets each word on its own line, so compare the rendered text (words separated).
    expect(await page.locator("h1#hero-title").innerText()).toMatch(/^איליא\s+סעד$/);
    await page.locator("button.hero-cv-trigger").click();
    const dialog = page.locator("dialog.cv-dialog[open]");
    await expect(dialog.locator(".cv-dlg-name")).toHaveText("איליא סעד");
    await expect(dialog.locator('a[href^="tel:"]')).toHaveAttribute("aria-label", /לאיליא סעד/);
    await expect(dialog.locator('a[href^="sms:"]')).toHaveAttribute("href", new RegExp(encodeURIComponent("שלום איליא")));
    expect(await dialog.innerHTML()).not.toMatch(wrong);

    await page.goto("/he/recruiter");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".rb-print-foot")).toContainText("איליא סעד");
  });

  test("English and Arabic names are unchanged", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1#hero-title .sr-only")).toHaveText("Eli Saad");
    await page.goto("/ar");
    expect(await page.locator("h1#hero-title").innerText()).toMatch(/^إيلي\s+سعد$/);
    expect(await page.content()).not.toMatch(wrong); // the Hebrew name may appear only as JSON-LD alternateName, correctly spelled
  });
});
