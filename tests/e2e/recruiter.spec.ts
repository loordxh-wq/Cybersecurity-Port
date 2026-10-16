import { expect, test, type Page } from "@playwright/test";
import { locales, settle, viewports } from "./helpers";

const names = { en: "Eli Saad", he: "איליא סעד", ar: "إيلي سعد" } as const;
const status = {
  en: "Open to Work | Flexible Location",
  he: "פתוח להצעות עבודה | גמישות במיקום",
  ar: "متاح للعمل | مرونة في موقع العمل",
} as const;

/** WCAG contrast of an element's text against the page background, blending alpha. */
async function contrast(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => {
    const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
    const [r, g, b, a = 1] = parse(getComputedStyle(el).color);
    const bg = [4, 6, 11]; // graphite page background
    const mix = (fg: number, back: number) => fg * a + back * (1 - a);
    const lum = (rgb: number[]) =>
      rgb
        .map((v) => v / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i]!, 0);
    const L1 = lum([mix(r!, bg[0]!), mix(g!, bg[1]!), mix(b!, bg[2]!)]);
    const L2 = lum(bg);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  });
}

for (const vpName of ["mobile360", "mobile", "desktop"] as const) {
  test.describe(`recruiter brief ${vpName}`, () => {
    test.use({ ...viewports[vpName], permissions: ["clipboard-read", "clipboard-write"] });
    for (const locale of locales) {
      test(`${locale}: 30-second structure, contact always reachable`, async ({ page }) => {
        await page.goto(`/${locale}/recruiter`);
        await settle(page);
        await expect(page.locator("h1")).toHaveText(names[locale]);
        await expect(page.locator(".rb-status")).toHaveText(status[locale]);
        const ids = await page.locator(".rb-main > section").evaluateAll((els) => els.map((e) => e.getAttribute("aria-labelledby")));
        expect(ids).toEqual(["rb-direction", "rb-experience", "rb-training", "rb-credentials", "rb-skills"]);

        const vh = page.viewportSize()!.height;
        // Identity and direction start on the first screen.
        expect(await page.locator("#rb-direction").evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(vh);
        // Request My CV is visible on the first screen: the sticky bar on phones, the contact column on desktop.
        const cv = vpName === "desktop" ? page.locator(".rb-aside button.rb-cv") : page.locator(".rb-bar button.rb-bar-cv");
        await expect(cv).toBeInViewport();
        if (vpName !== "desktop") {
          // The bar never covers content: the page reserves at least its height.
          const barH = await page.locator(".rb-bar").evaluate((el) => el.getBoundingClientRect().height);
          const pad = await page.locator(".rb").evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));
          expect(pad).toBeGreaterThanOrEqual(barH);
        }

        await cv.click();
        const dialog = page.locator("dialog.cv-dialog[open]");
        await expect(dialog.locator('a[href="tel:+972523440833"]')).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(cv).toBeFocused();
      });
    }
  });
}

test.describe("recruiter brief content and comfort", () => {
  test.use({ ...viewports.desktop, permissions: ["clipboard-read", "clipboard-write"] });

  test("body text meets AAA contrast (≥ 7:1)", async ({ page }) => {
    await page.goto("/en/recruiter");
    for (const sel of [".rb-lead", ".rb-points li", ".rb-intro", ".rb-skill-detail", ".rb-item-meta", ".rb-legend", ".rb-contact-note"]) {
      expect(await contrast(page, sel), sel).toBeGreaterThanOrEqual(7);
    }
  });

  test("content text is at least 15 px; only micro-labels are smaller", async ({ page }) => {
    await page.goto("/en/recruiter");
    const small = await page.locator(".rb-wrap").evaluate((root) =>
      Array.from(root.querySelectorAll("*"))
        .filter((el) => Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent?.trim()))
        .filter((el) => !el.closest(".rb-index, .rb-kicker, .rb-label, .rb-facts dt, .rb-latin, .rb-evidence, .rb-cred-kind, .rb-tool-status, .rb-print-foot, .sr-only, [aria-hidden=true]"))
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 15)
        .map((el) => `${el.tagName}.${el.className}`),
    );
    expect(small).toEqual([]);
  });

  test("nothing animates on the brief", async ({ page }) => {
    await page.goto("/en/recruiter");
    await page.waitForTimeout(1500);
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && (a.effect as KeyframeEffect | null)?.target?.closest?.(".rb"))
        .map((a) => ((a.effect as KeyframeEffect).target as Element).className),
    );
    expect(running).toEqual([]);
    await expect(page.locator(".rb canvas")).toHaveCount(0);
  });

  test("skills name their evidence honestly: no levels, no percentages, no unearned 'Demonstrated'", async ({ page }) => {
    await page.goto("/en/recruiter");
    const text = await page.locator("#rb-skills").locator("..").innerText();
    expect(text).not.toMatch(/%|Demonstrated|expert|advanced|years? of/i);
    await expect(page.locator(".rb-skills > li")).toHaveCount(6);
    await expect(page.locator(".rb-skills > li").first().locator(".rb-evidence")).toHaveText(["Employment"]);
    // DHCP is course knowledge (Cisco Networking Basics), kept apart from work experience.
    const network = page.locator(".rb-skills > li").nth(1);
    await expect(network.locator(".rb-evidence")).toHaveText(["Employment", "Course training"]);
    await expect(network.locator(".rb-skill-detail")).toContainText("Course: Cisco Networking Basics, including IP addressing and DHCP fundamentals");
    expect(await network.innerText()).not.toMatch(/DHCP (server )?administration|managed DHCP/i);
    await expect(page.locator("#rb-projects")).toHaveCount(0); // no approved case file yet
    await expect(page.locator(".rb-creds li[data-kind=certification]")).toHaveCount(1);
    await expect(page.locator(".rb-creds li[data-kind=courseCompletion]")).toHaveCount(2);
  });

  test("copy link copies the brief URL in the current language", async ({ page }) => {
    await page.goto("/he/recruiter");
    await page.locator(".rb-tool").first().click();
    await expect(page.locator(".rb-tool-status")).not.toBeEmpty();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/he\/recruiter$/);
  });

  test("indexable page with localized canonical, alternates and sitemap entry", async ({ page, request }) => {
    await page.goto("/ar/recruiter");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/ar\/recruiter$/);
    await expect(page.locator('link[rel="alternate"][hreflang="he"]')).toHaveAttribute("href", /\/he\/recruiter$/);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const l of locales) expect(sitemap).toContain(`/${l}/recruiter`);
  });

  for (const locale of locales) {
    test(`${locale}: prints on exactly one A4 page, without the phone number or controls`, async ({ page }) => {
      await page.goto(`/${locale}/recruiter`);
      await page.emulateMedia({ media: "print" });
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
      expect(pages).toBe(1);
      for (const sel of [".site-header", ".site-footer", ".rb-bar", ".rb-aside"]) await expect(page.locator(sel)).toBeHidden();
      await expect(page.locator(".rb-print-foot")).toBeVisible();
      await expect(page.locator(".rb-print-foot")).toContainText("linkedin.com/in/elisaad");
      expect(await page.locator("body").innerText()).not.toMatch(/0523440833|344-0833/);
    });
  }
});

test.describe("recruiter entry points", () => {
  test.describe("desktop", () => {
    test.use(viewports.desktop);
    test("the header offers For recruiters on every page", async ({ page }) => {
      for (const path of ["/en", "/en/about", "/en/certifications", "/en/contact", "/he", "/ar/recruiter"]) {
        await page.goto(path);
        await expect(page.locator("header a.site-recruiter")).toBeVisible();
        await expect(page.locator("header a.site-recruiter")).toHaveAttribute("href", /\/(en|he|ar)\/recruiter$/);
      }
      await expect(page.locator("header a.site-recruiter")).toHaveAttribute("aria-current", "page");
    });

    test("hero: primary opens the CV dialog, secondary opens the brief, certificates and LinkedIn stay one tap away", async ({ page }) => {
      await page.goto("/en");
      await page.locator("button.hero-cv-trigger").click();
      await expect(page.locator("dialog.cv-dialog[open]")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator(".hero-links a[href='/en/certifications']")).toBeVisible();
      await expect(page.locator(".hero-links a[href*='linkedin.com']")).toBeVisible();
      await page.locator(".cc-actions a[href='/en/recruiter']").click();
      await page.waitForURL("**/en/recruiter");
    });

    test("no moving background sits behind the Open to Work text", async ({ page }) => {
      await page.goto("/en");
      await page.locator("#open-to-work").scrollIntoViewIfNeeded();
      const floorTop = await page.locator(".home-band-floor").evaluate((el) => el.getBoundingClientRect().top);
      const textBottom = await page.locator(".home-band-grid").evaluate((el) => el.getBoundingClientRect().bottom);
      expect(floorTop).toBeGreaterThanOrEqual(textBottom);
    });
  });

  test.describe("phone", () => {
    test.use(viewports.mobile360);
    test("pill and menu entry; the scene has faded out before the hero text begins", async ({ page }) => {
      await page.goto("/ar");
      await settle(page);
      await expect(page.locator("header a.site-recruiter")).toBeVisible();
      // The brand stays on one line beside the pill (two lines would be at least twice the font size tall).
      const brand = await page.locator(".site-brand-latin").evaluate((el) => ({ h: el.getBoundingClientRect().height, fs: parseFloat(getComputedStyle(el).fontSize) }));
      expect(brand.h).toBeLessThan(brand.fs * 2);
      const scene = await page.locator(".cc-scene").evaluate((el) => el.getBoundingClientRect());
      const kickerTop = await page.locator(".cc-kicker").evaluate((el) => el.getBoundingClientRect().top);
      expect(scene.top + scene.height * 0.83).toBeLessThanOrEqual(kickerTop);
      await page.locator("header button[aria-controls]").click();
      await expect(page.locator("#site-menu a.site-menu-recruiter")).toBeVisible();
    });
  });
});
