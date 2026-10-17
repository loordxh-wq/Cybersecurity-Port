import { expect, test } from "@playwright/test";
import { axe, dirOf, locales, pages, settle, viewports, watchErrors } from "./helpers";

/**
 * Every page × language × viewport: language and direction, one h1, logo on the
 * start side, no horizontal scroll, images load with alt text, safe external links,
 * text at least 12 px, no console errors, and zero axe violations.
 */
for (const [vpName, vp] of Object.entries(viewports)) {
  test.describe(`${vpName}`, () => {
    test.use(vp);
    for (const locale of locales) {
      for (const [name, suffix] of pages) {
        test(`${locale} ${name}`, async ({ page }) => {
          const errors = watchErrors(page);
          const resp = await page.goto(`/${locale}${suffix}`);
          expect(resp?.status()).toBe(200);
          await settle(page);

          const info = await page.evaluate(() => {
            const de = document.documentElement;
            const logo = document.querySelector("header a")?.getBoundingClientRect();
            const texts = Array.from(document.querySelectorAll("main *, header *, footer *")).filter(
              (el) =>
                Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent?.trim()) &&
                el.getClientRects().length > 0 &&
                !el.closest("[aria-hidden=true], .sr-only"),
            );
            return {
              lang: de.lang,
              dir: de.dir,
              h1: document.querySelectorAll("h1").length,
              hScroll: de.scrollWidth > de.clientWidth,
              logoSide: logo ? (logo.left + logo.width / 2 < de.clientWidth / 2 ? "left" : "right") : null,
              brokenImages: Array.from(document.images).filter((i) => !(i.complete && i.naturalWidth > 0)).length,
              imagesWithoutAlt: Array.from(document.images).filter((i) => i.getAttribute("alt") === null).length,
              unsafeBlank: Array.from(document.querySelectorAll('a[target="_blank"]')).filter((a) => !/noopener/.test((a as HTMLAnchorElement).rel)).length,
              minFont: Math.min(...texts.map((el) => parseFloat(getComputedStyle(el).fontSize))),
            };
          });

          expect(info.lang).toBe(locale);
          expect(info.dir).toBe(dirOf(locale));
          expect(info.logoSide).toBe(dirOf(locale) === "ltr" ? "left" : "right");
          expect(info.h1).toBe(1);
          expect(info.hScroll, "horizontal scroll").toBe(false);
          expect(info.brokenImages).toBe(0);
          expect(info.imagesWithoutAlt).toBe(0);
          expect(info.unsafeBlank).toBe(0);
          expect(info.minFont).toBeGreaterThanOrEqual(12);
          expect(await axe(page)).toEqual([]);
          expect(errors).toEqual([]);
        });
      }
    }
  });
}

test("localized 404 page", async ({ page }) => {
  const r = await page.goto("/he/does-not-exist");
  expect(r?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await axe(page)).toEqual([]);
});

test("prototype routes stay out of search engines", async ({ page }) => {
  await page.goto("/en/concepts/v4");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
