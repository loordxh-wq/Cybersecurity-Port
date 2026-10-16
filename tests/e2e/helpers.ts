import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

export const locales = ["en", "he", "ar"] as const;
export type Locale = (typeof locales)[number];
export const dirOf = (l: Locale) => (l === "en" ? "ltr" : "rtl");

export const viewports = {
  desktop: { viewport: { width: 1440, height: 900 } },
  tablet: { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  mobile360: { viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
} as const;

export const pages = [
  ["home", ""],
  ["about", "/about"],
  ["certifications", "/certifications"],
  ["contact", "/contact"],
] as const;

/** Load, scroll through once so lazy images and in-view effects run, return to the top. */
export async function settle(page: Page) {
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 350) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page
    .waitForFunction(() => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15_000 })
    .catch(() => {});
  await page.waitForTimeout(1200);
}

export async function axe(page: Page) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
  return r.violations.map((v) => `${v.id}(${v.impact}) x${v.nodes.length}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
}

/** Collect console errors, page errors and failed responses for a page. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}
