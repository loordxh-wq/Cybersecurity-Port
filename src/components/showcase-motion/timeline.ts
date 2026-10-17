/**
 * Motion study timeline engine (Phase 3, proposal branch). Every visual value is a pure
 * function of the playhead time, so the walkthrough can be played, paused, sought and
 * recorded frame by frame with identical results. With reduced motion every change becomes
 * a cut: values jump to their end state at the moment the change starts.
 */

export type EaseName = "standard" | "emphasized" | "inOut" | "linear";

/** cubic-bezier(x1, y1, x2, y2) as a function of x in [0, 1]. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sx(t) - x;
      const d = dx(t);
      if (Math.abs(err) < 1e-5 || Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}

export const ease: Record<EaseName, (x: number) => number> = {
  standard: bezier(0.2, 0, 0, 1),
  emphasized: bezier(0.3, 0, 0, 1),
  inOut: bezier(0.4, 0, 0.2, 1),
  linear: (x) => x,
};

/** One change of a value: from whatever it was, to `to`, starting at `at` seconds, over `dur`. */
export type Key = { at: number; to: number; dur?: number; ease?: EaseName };
export type Track = Key[];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Value of a track at time t (seconds). Tracks start at 0 unless the first key is at time 0 with dur 0. */
export function valueAt(track: Track, t: number, reduced = false): number {
  let v = 0;
  for (const k of track) {
    if (t < k.at) break;
    const dur = k.dur ?? 0.28;
    const p = reduced || dur === 0 ? 1 : ease[k.ease ?? "standard"](clamp01((t - k.at) / dur));
    v = v + (k.to - v) * p;
  }
  return v;
}

/** Shorthand: rise 0 → 1 at `at`, optionally fall back to 0 at `off`. */
export function pulse(at: number, dur = 0.28, off?: number, offDur = 0.28, e: EaseName = "standard"): Track {
  const t: Track = [{ at, to: 1, dur, ease: e }];
  if (off !== undefined) t.push({ at: off, to: 0, dur: offDur, ease: e });
  return t;
}

/** The latest entry whose time has been reached, or undefined before the first. */
export function latest<T extends { at: number }>(list: T[], t: number): T | undefined {
  let found: T | undefined;
  for (const item of list) {
    if (item.at <= t) found = item;
    else break;
  }
  return found;
}

/* ------------------------------------------------------------------ camera */

export type Rect = { x: number; y: number; w: number; h: number };
export type Cam = { x: number; y: number; k: number };
/** Move the camera to frame `target` (null: the whole scene) at zoom `k` (fit when omitted). */
export type CamKey = { at: number; dur?: number; target: string | null; k?: number; ax?: number; ay?: number; maxK?: number };

/** Camera transform (translate x, y then scale k, origin top-left) that frames rect r in a vw × vh viewport over content cw × ch. */
export function frame(r: Rect | null, vw: number, vh: number, cw: number, ch: number, key: Pick<CamKey, "k" | "ax" | "ay" | "maxK">): Cam {
  const fitAll = Math.min(vw / cw, vh / ch, 1);
  if (!r) return { k: fitAll, x: (vw - cw * fitAll) / 2, y: (vh - ch * fitAll) / 2 };
  const k = key.k ?? Math.min(key.maxK ?? 1.6, (vw * 0.86) / r.w, (vh * 0.8) / r.h);
  const ax = key.ax ?? 0.5;
  const ay = key.ay ?? 0.5;
  let x = vw * ax - k * (r.x + r.w / 2);
  let y = vh * ay - k * (r.y + r.h / 2);
  // Never show empty space beyond the content edges.
  x = cw * k <= vw ? (vw - cw * k) / 2 : Math.min(0, Math.max(vw - cw * k, x));
  y = ch * k <= vh ? (vh - ch * k) / 2 : Math.min(0, Math.max(vh - ch * k, y));
  return { x, y, k };
}

/** Camera at time t, easing from each framing to the next. */
export function cameraAt(keys: CamKey[], t: number, measure: (id: string) => Rect | null, vw: number, vh: number, cw: number, ch: number, reduced = false): Cam {
  let cam = frame(null, vw, vh, cw, ch, {});
  for (const k of keys) {
    if (t < k.at) break;
    const next = frame(k.target ? measure(k.target) : null, vw, vh, cw, ch, k);
    const dur = k.dur ?? 0.9;
    const p = reduced || dur === 0 ? 1 : ease.inOut(clamp01((t - k.at) / dur));
    cam = { x: cam.x + (next.x - cam.x) * p, y: cam.y + (next.y - cam.y) * p, k: cam.k + (next.k - cam.k) * p };
  }
  return cam;
}

/* ------------------------------------------------------------------ cursor */

/** The pointer glides to a target (in content coordinates) and may click on arrival. */
export type CursorKey = { at: number; dur?: number; target: string | null; dx?: number; dy?: number; click?: boolean };

export function cursorAt(keys: CursorKey[], t: number, measure: (id: string) => Rect | null) {
  let pos: { x: number; y: number } | null = null;
  let click = 0;
  for (const k of keys) {
    if (t < k.at) break;
    if (!k.target) {
      pos = null;
      continue;
    }
    const r = measure(k.target);
    if (!r) continue;
    const to = { x: r.x + (k.dx ?? r.w / 2), y: r.y + (k.dy ?? r.h / 2) };
    const dur = k.dur ?? 0.7;
    const p = ease.inOut(clamp01((t - k.at) / dur));
    pos = pos ? { x: pos.x + (to.x - pos.x) * p, y: pos.y + (to.y - pos.y) * p } : to;
    if (k.click) {
      const since = t - (k.at + dur);
      click = since >= 0 && since < 0.45 ? 1 - since / 0.45 : 0;
    }
  }
  return { pos, click };
}
