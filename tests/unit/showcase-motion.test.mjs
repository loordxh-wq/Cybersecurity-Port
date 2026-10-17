// Phase 3 motion study: the timeline engine is deterministic and reduced motion becomes cuts;
// every caption stays on screen long enough to read in EN/HE/AR; every number the captions
// state matches the synthetic dataset. Run: npm run test:guard
import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

// The study's modules use the app's "@/" alias and extensionless imports; resolve them here.
const src = new URL("../../src/", import.meta.url).href;
register(
  "data:text/javascript," +
    encodeURIComponent(`
      export async function resolve(spec, ctx, next) {
        if (spec.startsWith("@/")) return next(${JSON.stringify(src)} + spec.slice(2) + ".ts", ctx);
        if ((spec.startsWith("./") || spec.startsWith("../")) && !/\\.[cm]?[jt]sx?$/.test(spec)) return next(spec + ".ts", ctx);
        return next(spec, ctx);
      }`),
);

const tl = await import("../../src/components/showcase-motion/timeline.ts");
const sc = await import("../../src/components/showcase-motion/script.ts");
const { motionCopy } = await import("../../src/components/showcase-motion/copy.ts");
const d = await import("../../src/components/lab-mockup/data.ts");

test("tracks are pure functions of time; reduced motion jumps to the end state", () => {
  const track = tl.pulse(1, 0.5, 3, 0.5);
  assert.equal(tl.valueAt(track, 0.99), 0);
  assert.ok(tl.valueAt(track, 1.25) > 0 && tl.valueAt(track, 1.25) < 1);
  assert.equal(tl.valueAt(track, 2), 1);
  assert.equal(tl.valueAt(track, 3.6), 0);
  assert.equal(tl.valueAt(track, 1.01, true), 1, "reduced: a cut, no in-between value");
  assert.equal(tl.valueAt(track, 1.25), tl.valueAt(track, 1.25), "same time, same value");
});

test("the camera never shows empty space beyond the content", () => {
  const cam = tl.frame({ x: 0, y: 0, w: 100, h: 50 }, 800, 400, 1600, 1200, { k: 1.5 });
  assert.ok(cam.x <= 0 && cam.y <= 0, "pinned to the top-left edge");
  const end = tl.frame({ x: 1500, y: 1150, w: 100, h: 50 }, 800, 400, 1600, 1200, { k: 1 });
  assert.equal(end.x, 800 - 1600);
  assert.equal(end.y, 400 - 1200);
});

test("captions: in order, and on screen long enough to read in every language", () => {
  for (const [name, script, key] of [
    ["ch2", sc.ch2, "ch2"],
    ["ch3", sc.ch3, "ch3"],
  ]) {
    const caps = script.captions;
    for (let i = 0; i < caps.length; i++) {
      const end = caps[i + 1]?.at ?? script.duration;
      const shown = end - caps[i].at;
      for (const l of ["en", "he", "ar"]) {
        const text = motionCopy[l][key].captions[caps[i].key];
        assert.ok(text, `${name} ${caps[i].key} ${l} exists`);
        const need = Math.max(2.5, text.length / 20);
        assert.ok(shown >= need, `${name} ${caps[i].key} ${l}: ${shown.toFixed(1)} s shown, needs ${need.toFixed(1)} s (${text.length} chars)`);
      }
    }
  }
});

test("every number in the captions matches the synthetic dataset", () => {
  const spray = d.results;
  const fails = spray.filter((e) => e.eventId === 4625);
  const oks = spray.filter((e) => e.eventId === 4624);
  assert.equal(spray.length, 19);
  assert.equal(fails.length, 17);
  assert.equal(oks.length, 2);
  assert.equal(new Set(spray.map((e) => e.user)).size, 18, "18 different accounts");
  assert.ok(
    spray.every((e) => e.ip === "203.0.113.45"),
    "one source address",
  );
  assert.equal(fails.filter((e) => e.sub === "0xC000006A").length, 12, "wrong password ×12");
  assert.equal(fails.filter((e) => e.sub === "0xC0000064").length, 5, "no such account ×5");
  const sec = (t) => Number(t.slice(0, 2)) * 3600 + Number(t.slice(3, 5)) * 60 + Number(t.slice(6, 8));
  const span = sec(spray.at(-1).time) - sec(spray[0].time);
  assert.equal(span, 6 * 60 + 35, "6 min 35 s");
  assert.equal(Math.round(span / (spray.length - 1)), 22, "on average one every 22 seconds");
  const e193 = spray.find((e) => e.id === "e-0193");
  const e194 = spray.find((e) => e.id === "e-0194");
  assert.equal(sec(e194.time) - sec(e193.time), 15, "+15 s");
  assert.deepEqual([e193.logonType, e193.auth, e194.logonType, e194.auth], [3, "NTLM", 10, "Negotiate"]);
  const second = d.windowEvents.filter((e) => e.ip === "203.0.113.77");
  assert.equal(second.length, 7);
  assert.ok(second.some((e) => e.user === "administrator"));
  assert.ok(second.every((e) => e.client === "DESKTOP-7Q2M4" && e.eventId === 4625));
  const lateral = d.windowEvents.find((e) => e.id === "e-0201");
  assert.deepEqual([lateral.time.slice(0, 8), lateral.ip, lateral.computer, lateral.auth], ["02:21:13", "198.51.100.10", "SRV-FILE01", "Kerberos"]);
});

test("chapter 3 counters follow the playhead and end at the dataset totals", () => {
  assert.deepEqual([sc.failedSoFar(0, false).s45, sc.failedSoFar(0, false).s77], [0, 0]);
  const end = sc.failedSoFar(sc.ch3.duration, false);
  assert.equal(end.s45, 17);
  assert.equal(end.s77, 7);
  assert.equal(sc.axisTime(sc.axisPos("02:21:13")), "02:21:13");
});

test("the study claims nothing beyond authentication events", () => {
  for (const l of ["en", "he", "ar"]) {
    const c = motionCopy[l];
    assert.ok(c.ch3.captions.gap.length > 0 && c.ch3.uncertain.length > 0);
  }
  assert.match(motionCopy.en.ch3.captions.gap, /not file access/);
  assert.match(motionCopy.en.ch3.captions.indicator, /not attribution/);
  assert.match(motionCopy.en.ch2.captions.uncertain, /not the person/);
});
