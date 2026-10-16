import { expect, test } from "@playwright/test";
import { axe, locales, settle, viewports } from "./helpers";

const status = {
  en: "Open to Work | Flexible Location",
  he: "פתוח להצעות עבודה | גמישות במיקום",
  ar: "متاح للعمل | مرونة في موقع العمل",
} as const;
const phoneFragments = ["0523440833", "344-0833", "523440833"];

for (const vpName of ["desktop", "mobile", "mobile360"] as const) {
  test.describe(`CV request ${vpName}`, () => {
    test.use({ ...viewports[vpName], permissions: ["clipboard-read", "clipboard-write"] });
    for (const locale of locales) {
      for (const path of ["", "/contact"]) {
        test(`${locale}${path || " home"}: dialog opens, actions work, focus is managed`, async ({ page }) => {
          await page.goto(`/${locale}${path}`);
          await settle(page);
          const section = page.locator("#cv");
          await expect(section.locator("h2#cv-title")).toBeVisible();
          expect(await page.locator("body").innerText()).not.toMatch(/0523440833|344-0833/);

          const trigger = section.locator("button.cv-trigger");
          await trigger.scrollIntoViewIfNeeded();
          await trigger.click();
          const dialog = page.locator("dialog.cv-dialog[open]");
          await expect(dialog).toBeVisible();
          await page.waitForTimeout(450);
          expect(await page.evaluate(() => !!document.activeElement?.closest("dialog[open]"))).toBe(true);
          await expect(dialog.locator('a[href="tel:+972523440833"]')).toBeVisible();
          await expect(dialog.locator('a[href^="sms:+972523440833"]')).toBeVisible();
          await expect(dialog).toContainText("0523440833");
          await expect(dialog).toContainText("+972 52-344-0833");
          expect(await axe(page)).toEqual([]);

          await dialog.locator("button.cv-act").click();
          await expect(dialog.locator('[role="status"]')).not.toBeEmpty();
          expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("0523440833");

          await page.keyboard.press("Escape");
          await expect(page.locator("dialog.cv-dialog[open]")).toHaveCount(0);
          await expect(trigger).toBeFocused();

          await trigger.click();
          await expect(dialog).toBeVisible();
          await dialog.locator("button.cv-dlg-close").click();
          await expect(page.locator("dialog.cv-dialog[open]")).toHaveCount(0);
          await expect(trigger).toBeFocused();

          if (vpName === "desktop") {
            await trigger.click();
            await expect(dialog).toBeVisible();
            await page.mouse.click(5, 5);
            await expect(page.locator("dialog.cv-dialog[open]")).toHaveCount(0);
          }
        });
      }
    }
  });
}

test.describe("recruitment content", () => {
  test.use(viewports.desktop);

  test("the phone number is not in any server-rendered page", async ({ request }) => {
    for (const l of locales) {
      for (const path of ["", "/about", "/certifications", "/contact"]) {
        const html = await (await request.get(`/${l}${path}`)).text();
        for (const f of phoneFragments) expect(html, `${l}${path}`).not.toContain(f);
      }
    }
  });

  test("no CV file or CV endpoint is exposed", async ({ page, request }) => {
    for (const l of locales) {
      for (const path of ["", "/contact"]) {
        await page.goto(`/${l}${path}`);
        await expect(page.locator('a[href$=".pdf"], a[download]')).toHaveCount(0);
      }
    }
    for (const url of ["/cv", "/cv.pdf", "/en/cv", "/resume.pdf", "/eli-saad-cv.pdf"]) {
      expect((await request.get(url)).status(), url).toBe(404);
    }
  });

  for (const l of locales) {
    test(`${l}: flexible-location status, no regional job-search limits, metadata updated`, async ({ page }) => {
      await page.goto(`/${l}`);
      await expect(page.locator(".cc-kicker")).toHaveText(status[l]);
      for (const path of ["", "/contact"]) {
        await page.goto(`/${l}${path}`);
        const text = await page.locator("main").innerText();
        expect(text).not.toMatch(/Northern Israel|Haifa|Nahariya|Karmiel|אזור הצפון|חיפה|נהריה|כרמיאל|منطقة الشمال|حيفا|نهاريا|كرميئيل/);
        const description = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
        expect(description).not.toMatch(/Northern|צפון|الشمال/);
      }
      await page.goto(`/${l}`);
      const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
      expect(ld.address).toEqual({ "@type": "PostalAddress", addressCountry: "IL" });
    });
  }

  test("all target roles are listed, including Blue Team / Security Operations", async ({ page }) => {
    await page.goto("/en/contact");
    const main = page.locator("main");
    for (const role of ["Junior SOC Analyst / SOC Trainee", "Blue Team / Security Operations", "Help Desk / IT Support", "Desktop Support", "Junior NOC"]) {
      await expect(main).toContainText(role);
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ ...viewports.mobile, contextOptions: { reducedMotion: "reduce" } });
  test("the CV dialog opens without animation", async ({ page }) => {
    await page.goto("/he/contact");
    await page.locator("button.cv-trigger").click();
    const name = await page.locator("dialog.cv-dialog[open]").evaluate((d) => getComputedStyle(d).animationName);
    expect(name).toBe("none");
  });
});
