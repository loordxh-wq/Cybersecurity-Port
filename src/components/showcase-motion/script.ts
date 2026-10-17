/**
 * Timed scripts for the motion study (chapters 2 and 3). Times are seconds. Captions are
 * spaced for reading at about 17 characters per second (never less than 2.5 s); the visual
 * beats follow the caption they illustrate. Desktop and iPhone share one clock and one set
 * of tracks; only the camera framing and the pointer differ per layout.
 */
import { results, windowEvents } from "@/components/lab-mockup/data";
import type { Ch2Caption, Ch2Label, Ch3Caption, Ch3Label } from "./copy";
import { pulse, valueAt, type CamKey, type CursorKey, type Track } from "./timeline";

export type Layout = "desk" | "mobile";

export type ChapterScript<C extends string, L extends string> = {
  duration: number;
  tracks: Record<string, Track>;
  captions: { at: number; key: C }[];
  labels: { at: number; key: L | null }[];
  camera: Record<Layout, CamKey[]>;
  cursor: Record<Layout, CursorKey[]>;
  typing?: { at: number; text: string; perChar: number };
  count?: { at: number; dur: number; to: number };
};

/* ------------------------------------------------------------------ chapter 2 */

const ch2Base: ChapterScript<Ch2Caption, Ch2Label> = {
  duration: 53.5,
  typing: { at: 1.5, text: "ip:203.0.113.45", perChar: 0.06 },
  count: { at: 2.6, dur: 0.6, to: 19 },
  captions: [
    { at: 0.3, key: "pivot" },
    { at: 5.1, key: "results" },
    { at: 8.1, key: "time" },
    { at: 13.1, key: "ip" },
    { at: 16.1, key: "acct" },
    { at: 18.9, key: "evt" },
    { at: 22.9, key: "pick" },
    { at: 25.9, key: "fields" },
    { at: 30.2, key: "base" },
    { at: 35.8, key: "rdp" },
    { at: 41.4, key: "supports" },
    { at: 46.9, key: "uncertain" },
  ],
  labels: [
    { at: 0.3, key: "query" },
    { at: 8.1, key: "time" },
    { at: 13.1, key: "ip" },
    { at: 16.1, key: "acct" },
    { at: 18.9, key: "evt" },
    { at: 22.9, key: "e0193" },
    { at: 30.2, key: "base" },
    { at: 35.8, key: "rdp" },
    { at: 41.4, key: "sum" },
  ],
  tracks: {
    q: pulse(1.45, 0.2, 2.7),
    hist: pulse(2.7, 1.0, undefined, 0.28, "emphasized"),
    brush: pulse(3.6, 0.4),
    facets: pulse(3.9, 0.4),
    rows: [{ at: 3.3, to: 1, dur: 1.6, ease: "linear" }],
    hlTime: pulse(8.2, 0.3, 13.0),
    hlIp: pulse(13.2, 0.3, 16.0),
    hlAcct: pulse(16.2, 0.3, 18.8),
    hlEvt: pulse(19.0, 0.3, 22.8),
    m1: pulse(19.4, 0.2),
    sel: pulse(23.9, 0.4),
    dim: pulse(24.0, 0.5, 41.4, 0.6),
    m2: pulse(24.2, 0.2),
    insp: pulse(25.9, 0.6),
    sheet: pulse(25.9, 0.5, 35.8, 0.45),
    fType: pulse(26.8),
    fAuth: pulse(27.6),
    fSrc: pulse(28.4),
    base: pulse(30.3, 0.6),
    k1: pulse(31.0),
    k2: pulse(31.6),
    k3: pulse(32.2),
    rdp: pulse(36.2, 0.4),
    gap: pulse(36.6, 0.4),
    m3: pulse(36.9, 0.2),
    lt: pulse(41.8, 0.5),
    ltU: pulse(47.0, 0.5),
  },
  camera: {
    desk: [
      { at: 0, dur: 0, target: "d-top", k: 1.15, ay: 0.3 },
      { at: 3.0, dur: 1.4, target: "d-top", k: 1, ay: 0.18 },
      { at: 5.1, dur: 1.1, target: "d-table", k: 0.96, ay: 0.5 },
      { at: 8.1, dur: 0.9, target: "d-th-time", k: 1.28, ay: 0.16 },
      { at: 13.1, dur: 0.9, target: "d-th-ip", k: 1.28, ay: 0.16 },
      { at: 16.1, dur: 0.9, target: "d-th-acct", k: 1.28, ay: 0.16 },
      { at: 18.9, dur: 0.9, target: "d-th-res", k: 1.22, ay: 0.16 },
      { at: 22.9, dur: 1.0, target: "d-e0193", k: 1.45, ay: 0.45 },
      { at: 26.2, dur: 1.0, target: "d-insp", k: 1.3, ay: 0.42 },
      { at: 30.4, dur: 0.9, target: "d-base", maxK: 1.4 },
      { at: 35.8, dur: 1.0, target: "d-e0193+d-e0194", k: 1.4, ay: 0.42 },
      { at: 41.4, dur: 1.3, target: "d-e0193+d-e0194+d-insp", k: 1.02, ay: 0.3 },
    ],
    mobile: [
      { at: 0, dur: 0, target: "m-query", k: 1, ay: 0.32 },
      { at: 5.1, dur: 0.9, target: "m-facets", k: 1, ay: 0.22 },
      { at: 8.1, dur: 0.9, target: "m-r2", k: 1, ay: 0.3 },
      { at: 13.1, dur: 0.9, target: "m-r5", k: 1, ay: 0.4 },
      { at: 16.1, dur: 0.9, target: "m-r8", k: 1, ay: 0.4 },
      { at: 18.9, dur: 0.9, target: "m-r11", k: 1, ay: 0.4 },
      { at: 22.9, dur: 1.0, target: "m-e0193", k: 1, ay: 0.2 },
      { at: 35.8, dur: 1.0, target: "m-e0193+m-e0194", k: 1, ay: 0.38 },
      { at: 41.4, dur: 1.0, target: "m-e0193+m-e0194", k: 1, ay: 0.22 },
    ],
  },
  cursor: {
    desk: [
      { at: 0.4, dur: 0, target: "d-hist", dx: 120, dy: 20 },
      { at: 0.6, dur: 0.8, target: "d-query", dx: 160, click: true },
      { at: 22.95, dur: 0.85, target: "d-e0193", dx: 80, click: true },
      { at: 35.9, dur: 0.9, target: "d-e0194", dx: 80 },
      { at: 41.2, target: null },
    ],
    mobile: [
      { at: 1.0, dur: 0, target: "m-query", dx: 120, click: true },
      { at: 23.0, dur: 0, target: "m-e0193", click: true },
      { at: 24.0, target: null },
    ],
  },
};

/* ------------------------------------------------------------------ chapter 3 */

/** The time axis runs 02:08 → 02:36 UTC (28 minutes); the playhead value is the fraction of it. */
const AXIS_START = 2 * 60 + 8;
const AXIS_MIN = 28;
export const axisPos = (hhmmss: string) => {
  const [h, m, s] = hhmmss.split(":").map(Number);
  return (h! * 60 + m! + (s ?? 0) / 60 - AXIS_START) / AXIS_MIN;
};
export const axisTime = (pos: number) => {
  const total = Math.round((AXIS_START + pos * AXIS_MIN) * 60);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const ch3Playhead: Track = [
  { at: 0, to: 0, dur: 0 },
  { at: 1.6, to: axisPos("02:10:00"), dur: 2.8, ease: "inOut" },
  { at: 4.8, to: axisPos("02:14:30"), dur: 4.4, ease: "linear" },
  { at: 9.4, to: axisPos("02:14:37"), dur: 0.6, ease: "inOut" },
  { at: 13.9, to: axisPos("02:14:52"), dur: 0.6, ease: "inOut" },
  { at: 18.8, to: axisPos("02:16:40"), dur: 1.8, ease: "linear" },
  { at: 21.3, to: axisPos("02:21:13"), dur: 2.2, ease: "inOut" },
  { at: 32.2, to: axisPos("02:31:08"), dur: 2.2, ease: "inOut" },
  { at: 34.6, to: axisPos("02:34:02"), dur: 2.6, ease: "linear" },
];

/** Failed logons seen so far by the playhead, per source (counts come from the dataset). */
const failTimes = (ip: string) => [...results, ...windowEvents].filter((e) => e.eventId === 4625 && e.ip === ip).map((e) => axisPos(e.time.slice(0, 8)));
const spray45 = failTimes("203.0.113.45");
const spray77 = failTimes("203.0.113.77");
export const failedSoFar = (t: number, reduced: boolean) => {
  const ph = valueAt(ch3.tracks.ph!, t, reduced);
  return { s45: spray45.filter((p) => p <= ph + 1e-6).length, s77: spray77.filter((p) => p <= ph + 1e-6).length, ph };
};

const ch3Base: ChapterScript<Ch3Caption, Ch3Label> = {
  duration: 63.7,
  captions: [
    { at: 0.3, key: "intro" },
    { at: 4.8, key: "spray" },
    { at: 9.4, key: "success" },
    { at: 13.9, key: "rdp" },
    { at: 18.8, key: "stop" },
    { at: 21.3, key: "lateral" },
    { at: 25.7, key: "inventory" },
    { at: 32.2, key: "second" },
    { at: 37.5, key: "indicator" },
    { at: 45.0, key: "gap" },
    { at: 51.9, key: "supports" },
    { at: 56.6, key: "uncertain" },
  ],
  labels: [
    { at: 0.3, key: null },
    { at: 4.8, key: "spray" },
    { at: 9.4, key: "success" },
    { at: 13.9, key: "rdp" },
    { at: 18.8, key: "spray" },
    { at: 21.3, key: "lateral" },
    { at: 32.2, key: "second" },
    { at: 37.5, key: "indicator" },
    { at: 45.0, key: "gap" },
    { at: 51.9, key: "sum" },
  ],
  tracks: {
    ph: ch3Playhead,
    legend: pulse(1.0, 0.5),
    cols: pulse(0.4, 0.6),
    nS45: pulse(0.8, 0.5),
    nA17: pulse(5.3),
    nJMP: pulse(5.6),
    e1: pulse(5.2, 1.1, undefined, 0.28, "emphasized"),
    nAJM: pulse(9.6),
    e2: pulse(9.8, 1.0, undefined, 0.28, "emphasized"),
    e3: pulse(14.1, 1.0, undefined, 0.28, "emphasized"),
    nSRV: pulse(21.5),
    e4: pulse(21.8, 1.2, undefined, 0.28, "emphasized"),
    inv: pulse(25.9, 0.8),
    nS77: pulse(32.4),
    nA7: pulse(32.8),
    e5: pulse(33.0, 1.1, undefined, 0.28, "emphasized"),
    e6: pulse(37.8, 0.8),
    ghost: pulse(45.3, 0.5),
    e7: pulse(45.5, 0.6),
    // Desktop focus (no camera): one group in focus per beat, the rest dims. The summary keeps the
    // supported path and the open questions in focus.
    focusOn: pulse(4.8, 0.4),
    fSpray: [
      { at: 4.8, to: 1, dur: 0.4 },
      { at: 9.4, to: 0, dur: 0.4 },
      { at: 18.8, to: 1, dur: 0.4 },
      { at: 21.3, to: 0, dur: 0.4 },
    ],
    fSuccess: [
      { at: 9.4, to: 1, dur: 0.4 },
      { at: 13.9, to: 0, dur: 0.4 },
      { at: 51.9, to: 1, dur: 0.6 },
    ],
    fRdp: [
      { at: 13.9, to: 1, dur: 0.4 },
      { at: 18.8, to: 0, dur: 0.4 },
      { at: 51.9, to: 1, dur: 0.6 },
    ],
    fLateral: [
      { at: 21.3, to: 1, dur: 0.4 },
      { at: 32.2, to: 0, dur: 0.4 },
      { at: 51.9, to: 1, dur: 0.6 },
    ],
    fSecond: pulse(32.2, 0.4, 37.5, 0.4),
    fInd: [
      { at: 37.5, to: 1, dur: 0.4 },
      { at: 45.0, to: 0, dur: 0.4 },
      { at: 51.9, to: 1, dur: 0.6 },
    ],
    fGap: [
      { at: 45.0, to: 1, dur: 0.4 },
      { at: 51.9, to: 1, dur: 0 },
    ],
    // Close-up panels beside the graph (desktop), crossfading per beat.
    pStart: pulse(0.8, 0.5, 4.8, 0.3),
    pSpray: [
      { at: 4.9, to: 1, dur: 0.4 },
      { at: 9.4, to: 0, dur: 0.3 },
      { at: 18.9, to: 1, dur: 0.4 },
      { at: 21.3, to: 0, dur: 0.3 },
    ],
    pSuccess: pulse(9.5, 0.4, 13.9, 0.3),
    pRdp: pulse(14.0, 0.4, 18.8, 0.3),
    pLateral: pulse(21.4, 0.4, 32.2, 0.3),
    pSecond: pulse(32.3, 0.4, 37.5, 0.3),
    pInd: pulse(37.6, 0.4, 45.0, 0.3),
    pGap: pulse(45.1, 0.4, 51.9, 0.3),
    lt: pulse(52.1, 0.5),
    ltU: pulse(56.8, 0.5),
  },
  camera: {
    // Fixed scale on desktop: focus comes from light and the close-up panel, not from zooming the graph.
    desk: [{ at: 0, dur: 0, target: null }],
    mobile: [
      { at: 0, dur: 0, target: "m3-start", k: 1, ay: 0.3 },
      { at: 4.8, dur: 0.9, target: "m3-a", k: 1, ay: 0.52 },
      { at: 9.4, dur: 0.9, target: "m3-b", k: 1, ay: 0.52 },
      { at: 13.9, dur: 0.9, target: "m3-c", k: 1, ay: 0.52 },
      { at: 21.3, dur: 0.9, target: "m3-d", k: 1, ay: 0.52 },
      { at: 32.2, dur: 0.9, target: "m3-e", k: 1, ay: 0.52 },
      { at: 37.5, dur: 0.9, target: "m3-f", k: 1, ay: 0.52 },
      { at: 45.0, dur: 0.9, target: "m3-g", k: 1, ay: 0.52 },
      { at: 51.9, dur: 1.0, target: "m3-d", k: 1, ay: 0.34 },
    ],
  },
  cursor: { desk: [], mobile: [] },
};

/* ------------------------------------------------------------------ pacing */

/**
 * Reading pace: every time in a script is scaled by this factor, so captions stay at or below about
 * 16 characters per second in all three languages (tested). Motion slows by the same factor.
 */
export const PACE = 1.07;

function paced<C extends string, L extends string>(sc: ChapterScript<C, L>, f: number): ChapterScript<C, L> {
  const key = <T extends { at: number; dur?: number }>(k: T): T => ({ ...k, at: k.at * f, ...(k.dur !== undefined ? { dur: k.dur * f } : {}) });
  return {
    duration: sc.duration * f,
    tracks: Object.fromEntries(Object.entries(sc.tracks).map(([n, tr]) => [n, tr.map(key)])),
    captions: sc.captions.map((c) => ({ ...c, at: c.at * f })),
    labels: sc.labels.map((c) => ({ ...c, at: c.at * f })),
    camera: { desk: sc.camera.desk.map(key), mobile: sc.camera.mobile.map(key) },
    cursor: { desk: sc.cursor.desk.map(key), mobile: sc.cursor.mobile.map(key) },
    ...(sc.typing ? { typing: { ...sc.typing, at: sc.typing.at * f, perChar: sc.typing.perChar * f } } : {}),
    ...(sc.count ? { count: { ...sc.count, at: sc.count.at * f, dur: sc.count.dur * f } } : {}),
  };
}

export const ch2 = paced(ch2Base, PACE);
export const ch3 = paced(ch3Base, PACE);
