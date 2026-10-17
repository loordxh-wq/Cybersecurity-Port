import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { copyFor } from "../../src/components/lab-mockup/copy";
import { axe, dirOf, locales, viewports } from "./helpers";

/**
 * Phase 3 M1.1/M1.2 mockups (proposal branch). Preview build: every screen renders in three
 * languages and two layouts, passes axe, does not overflow, isolates technical values
 * left-to-right, and never shows the answer key, debrief or model notes before the
 * debrief (submitted) screen. Public build: the lab does not exist.
 */
const preview = process.env.E2E_STAGE === "preview";
const deskViews = ["briefing", "logs", "entities", "timeline", "verdict", "debrief"] as const;
const mobileViews = ["briefing", "queue", "logs", "filters", "event", "event-pinned", "event-linked", "unpin", "entities", "entity", "map", "evidence", "evidence-empty", "verdict", "findings", "debrief"] as const;
const sheetViews = ["filters", "event", "event-pinned", "event-linked", "unpin", "map"] as const;

/** Text that may only exist after submission. */
const answerText = (l: (typeof locales)[number]) => [copyFor[l].debrief.notes[0], copyFor[l].debrief.hWhy.h2, copyFor[l].debrief.summary, copyFor[l].debrief.limits[0]];

test.describe("lab mockup · public build", () => {
  test.skip(preview, "runs against a public build");
  test("the lab routes do not exist publicly and are not linked", async ({ page, request }) => {
    for (const l of locales) {
      for (const path of ["lab", "lab/soc-01", "lab/soc-01?view=debrief"]) expect((await request.get(`/${l}/${path}`)).status(), path).toBe(404);
    }
    await page.goto("/en");
    await expect(page.locator('a[href*="/lab"]')).toHaveCount(0);
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/lab");
  });
});

test.describe("lab mockup · protected preview", () => {
  test.skip(!preview, "runs against a SITE_STAGE=preview build");

  for (const [layout, vp, views] of [
    ["desktop", viewports.desktop, deskViews],
    ["mobile", viewports.mobile360, mobileViews],
  ] as const) {
    test.describe(layout, () => {
      test.use(vp);
      for (const l of locales) {
        test(`${l}: every screen renders, is accessible and keeps the answer hidden until submission`, async ({ page }) => {
          for (const v of views) {
            const res = await page.goto(`/${l}/lab/soc-01?view=${v}`);
            expect(res?.status(), v).toBe(200);
            await expect(page.locator("html")).toHaveAttribute("dir", dirOf(l));
            await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
            const html = await page.content();
            for (const s of answerText(l)) {
              if (v === "debrief") expect(html, `${v} shows the debrief`).toContain(s);
              else expect(html, `${v} must not contain debrief text`).not.toContain(s);
            }
            const ow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            expect(ow, `${v} overflow`).toBeLessThanOrEqual(0);
            expect(await axe(page), `${l} ${layout} ${v}`).toEqual([]);
          }
        });
      }

      test("technical identifiers stay left-to-right inside RTL text", async ({ page }) => {
        await page.goto(`/ar/lab/soc-01?view=${layout === "desktop" ? "logs" : "entity"}`);
        const ip = page.locator(`${layout === "desktop" ? ".lm-desk" : ".lm-mobile"} bdi[dir="ltr"]`, { hasText: /^203\.0\.113\.45$/ }).first();
        await expect(ip).toBeVisible();
        expect(await ip.evaluate((el) => getComputedStyle(el).direction)).toBe("ltr");
      });
    });
  }

  test("a new investigation starts with no evidence; the verdict starts unanswered", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/lab/soc-01?view=queue");
    await expect(page.locator(".lm-mobile .lm-m-pins")).toHaveAccessibleName("0 pinned");
    await page.goto("/en/lab/soc-01?view=verdict");
    await expect(page.locator('.lm-mobile [role="radio"][aria-checked="true"]')).toHaveCount(0);
    await expect(page.locator(".lm-mobile")).toContainText("0 of 4 alerts classified");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/lab/soc-01?view=verdict");
    await expect(page.locator('.lm-desk .lm-radio[aria-checked="true"]')).toHaveCount(0);
    await expect(page.locator(".lm-desk")).toContainText("Complete all five steps to submit.");
  });

  test("entities: every relationship cites supporting events; shared attributes are labelled indicators", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/lab/soc-01?view=entities");
    const rels = page.locator(".lm-desk .lm-rel");
    await expect(rels).toHaveCount(5);
    for (const r of await rels.all()) await expect(r.locator(".lm-evchip").first()).toBeVisible();
    const ind = page.locator('.lm-desk .lm-rel[data-kind="indicator"]');
    await expect(ind).toHaveCount(2);
    await expect(page.locator('.lm-desk .lm-rel-group[data-kind="indicator"]')).toContainText("They do not establish who operated them.");
  });

  test("answer content is not delivered before submission: bundles, HTML, server payloads, prefetch and requests", async ({ page, request }) => {
    const markers: string[] = locales.flatMap((l) => [copyFor[l].debrief.notes[0] ?? "", copyFor[l].debrief.notes[3] ?? "", copyFor[l].debrief.hWhy.h3, copyFor[l].debrief.summary2]).filter(Boolean);
    // 1. Client bundles: nothing under .next/static (every file a browser can download) holds answer text.
    const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
    const assets = walk(".next/static").filter((f) => /\.(js|css|json)$/.test(f));
    expect(assets.length).toBeGreaterThan(10);
    for (const f of assets) {
      const body = readFileSync(f, "utf8");
      for (const m of markers) expect(body.includes(m), `${f} contains answer text`).toBe(false);
    }
    // 2. HTML and RSC payloads: absent on every pre-submission screen, present on the debrief (control).
    for (const l of locales) {
      for (const v of [...mobileViews.filter((x) => x !== "debrief"), "timeline"]) {
        for (const headers of [{} as Record<string, string>, { RSC: "1" }]) {
          const body = await (await request.get(`/${l}/lab/soc-01?view=${v}`, { headers })).text();
          for (const m of markers) expect(body.includes(m), `${l} ${v} ${headers.RSC ? "RSC" : "HTML"}`).toBe(false);
        }
      }
      const debrief = await (await request.get(`/${l}/lab/soc-01?view=debrief`, { headers: { RSC: "1" } })).text();
      expect(debrief).toContain(copyFor[l].debrief.notes[0] ?? "missing");
    }
    // 3 + 4. Navigation and prefetch: no response carries answer text and no request targets the debrief or report.
    const seen: string[] = [];
    page.on("response", async (res) => {
      seen.push(res.url());
      const type = res.headers()["content-type"] ?? "";
      if (!/text|javascript|json|x-component/.test(type)) return;
      const body = await res.text().catch(() => "");
      for (const m of markers) expect(body.includes(m), `${res.url()} delivered answer text`).toBe(false);
    });
    for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(vp);
      for (const path of ["/en/lab", "/he/lab/soc-01?view=briefing", "/ar/lab/soc-01?view=verdict", "/en/lab/soc-01?view=findings", "/en/lab/soc-01?view=logs"]) {
        await page.goto(path, { waitUntil: "networkidle" });
        for (const a of await page.locator("a[href]:visible").all()) await a.hover({ trial: false, force: true }).catch(() => undefined);
        await page.waitForLoadState("networkidle");
      }
    }
    expect(seen.length).toBeGreaterThan(5);
    expect(seen.filter((u) => /view=(debrief|report)/.test(u))).toEqual([]);
  });

  test.describe("M1.2 iPhone layout", () => {
    for (const width of [360, 390, 430] as const) {
      test(`${width}px: chrome budget, no overflow, sticky bars never cover content`, async ({ page }) => {
        await page.setViewportSize({ width, height: width === 430 ? 932 : 844 });
        for (const l of locales) {
          for (const v of mobileViews) {
            await page.goto(`/${l}/lab/soc-01?view=${v}`);
            const ow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
            expect(ow, `${l} ${v} overflow`).toBeLessThanOrEqual(0);
            if ((sheetViews as readonly string[]).includes(v)) continue;
            const m = await page.evaluate(async () => {
              const r = (s: string) => document.querySelector(s)?.getBoundingClientRect() ?? null;
              const top = r(".lm-mobile .lm-m-top")!;
              const header = r(".site-header")!;
              const firstContent = document.querySelector(".lm-mobile .lm-m-top")?.nextElementSibling?.getBoundingClientRect() ?? null;
              window.scrollTo({ top: 260, behavior: "instant" });
              await new Promise((res) => requestAnimationFrame(() => res(null)));
              const stuck = r(".lm-mobile .lm-m-top")!;
              window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
              await new Promise((res) => setTimeout(res, 50));
              const tab = r(".lm-mobile .lm-m-tabbar");
              const step = r(".lm-mobile .lm-m-stepnav");
              const links = [...document.querySelectorAll("footer a")].map((a) => a.getBoundingClientRect().bottom);
              return { header: header.height, top: top.height, topY: top.top, firstY: firstContent?.top ?? 9999, stuckY: stuck.top, headerBottom: header.bottom, tabTop: tab?.top ?? innerHeight, tabH: tab?.height ?? 0, stepBottom: step?.bottom ?? 0, lastLink: Math.max(...links) };
            });
            expect(m.header, "compact site header").toBeLessThanOrEqual(53);
            expect(m.top, "single-row workspace bar").toBeLessThanOrEqual(56);
            if (v !== "briefing") expect(m.tabH, "tab bar").toBeLessThanOrEqual(56);
            expect(m.firstY, `${l} ${v}: content starts below the workspace bar`).toBeGreaterThanOrEqual(m.topY + m.top - 0.5);
            expect(Math.abs(m.stuckY - m.headerBottom), `${l} ${v}: bar sticks directly under the site header`).toBeLessThanOrEqual(1);
            expect(m.lastLink, `${l} ${v}: footer links stay above the tab bar`).toBeLessThanOrEqual(m.tabTop + 0.5);
            if (m.stepBottom) expect(m.stepBottom, `${l} ${v}: step bar above the tab bar`).toBeLessThanOrEqual(m.tabTop + 0.5);
          }
        }
      });
    }

    test("sheets: modal, dismissible by a labelled control, focus starts inside, background inert", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      for (const l of locales) {
        for (const v of sheetViews) {
          await page.goto(`/${l}/lab/soc-01?view=${v}`);
          const dialog = page.locator('.lm-mobile [role="dialog"]');
          await expect(dialog).toHaveAttribute("aria-modal", "true");
          await expect(page.locator(".lm-mobile .lm-m-under")).toHaveAttribute("inert", "");
          if (v === "unpin") {
            await expect(page.locator('.lm-mobile [role="alertdialog"]')).toBeVisible();
            await expect(page.locator('.lm-mobile [role="alertdialog"] a:focus')).toHaveText(copyFor[l].m12.keep);
          } else {
            await expect(dialog.getByRole("link", { name: copyFor[l].m12.nav.close })).toBeVisible();
            await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')), { message: `${l} ${v} focus inside the sheet` }).toBe(true);
          }
        }
      }
    });

    test("event inspector: summary first, neutral Learn panels, pin states; mockup says nothing is saved", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/en/lab/soc-01?view=event");
      const sheet = page.locator(".lm-mobile .lm-m-sheet");
      await expect(sheet.locator(".lm-insp-summary h3")).toHaveText(copyFor.en.insp.name[4624]);
      await expect(sheet.locator(".lm-sumfacts")).toContainText("j.morgan");
      await expect(sheet.locator(".lm-learn details")).toHaveCount(2);
      await expect(sheet.getByRole("link", { name: /Pin as evidence/ })).toBeVisible();
      await expect(page.locator(".lm-review--ws")).toContainText("nothing is saved");
      await page.goto("/en/lab/soc-01?view=event-pinned");
      await expect(page.locator('.lm-mobile .lm-toast[role="status"]')).toContainText("7 pinned");
      await page.goto("/en/lab/soc-01?view=event-linked");
      await expect(page.locator(".lm-mobile .lm-pin-links .lm-ftag")).toHaveText(["F2", "F3"]);
      await page.goto("/en/lab/soc-01?view=evidence-empty");
      await expect(page.locator(".lm-mobile .lm-m-pins")).toHaveAccessibleName("0 pinned");
      await expect(page.locator(".lm-mobile .lm-obs-card")).toHaveCount(0);
    });

    test("reduced motion: the pin feedback does not animate", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto("/en/lab/soc-01?view=event-pinned");
      expect(await page.locator(".lm-mobile .lm-toast").evaluate((e) => getComputedStyle(e).animationName)).toBe("lm-toast-in");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.reload();
      expect(await page.locator(".lm-mobile .lm-toast").evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
      // the site-wide reduced-motion rule sets durations to 0.01 ms (effectively none)
      expect(parseFloat(await page.locator(".lm-mobile .lm-btn").first().evaluate((e) => getComputedStyle(e).transitionDuration))).toBeLessThan(0.001);
    });

    test("keyboard: the event sheet's controls are reachable in order and named", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/en/lab/soc-01?view=event-linked");
      const names: string[] = [];
      for (let i = 0; i < 6; i++) {
        names.push(await page.evaluate(() => { const e = document.activeElement as HTMLElement | null; return e?.getAttribute("aria-label") ?? e?.textContent?.trim() ?? ""; }));
        await page.keyboard.press("Tab");
      }
      expect(names[0]).toBe("Close");
      expect(names.join("|")).toContain("Unpin");
    });
  });

  test("the landing page renders in all languages", async ({ page }) => {
    for (const l of locales) {
      await page.goto(`/${l}/lab`);
      await expect(page.locator("h1")).toHaveText(copyFor[l].index.title);
      expect(await axe(page)).toEqual([]);
    }
  });
});
