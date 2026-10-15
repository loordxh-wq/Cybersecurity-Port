/** Shared class recipes, kept in one place so buttons and links stay consistent. */
export const ui = {
  container: "mx-auto w-full max-w-6xl px-5 sm:px-8",
  buttonPrimary:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ice px-5 font-semibold text-ink shadow-[0_8px_30px_-12px_rgb(66_213_246/0.7)] transition-colors hover:bg-ice-soft",
  buttonSecondary:
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line-strong px-5 font-medium text-fg transition-colors hover:border-ice/60 hover:bg-white/5",
  textLink:
    "inline-flex min-h-11 items-center gap-1.5 font-medium text-ice underline decoration-ice/30 underline-offset-4 transition-colors hover:decoration-ice",
  sectionTitle: "text-2xl font-semibold tracking-tight text-fg sm:text-3xl",
} as const;
