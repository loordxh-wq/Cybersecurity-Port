/** Shared class recipes, kept in one place so buttons and links stay consistent. */
export const ui = {
  container: "mx-auto w-full max-w-6xl px-5 sm:px-8",
  buttonPrimary:
    "btn-primary inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl px-6 font-semibold",
  buttonSecondary:
    "btn-ghost inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl px-6 font-medium",
  textLink:
    "group inline-flex min-h-11 items-center gap-2 font-medium text-ice underline decoration-ice/30 underline-offset-[6px] transition-colors hover:decoration-ice",
  sectionTitle: "text-[1.75rem] font-semibold leading-tight tracking-tight text-fg sm:text-4xl",
  chip: "rounded-lg border border-ice/20 bg-ice/[0.06] px-2.5 py-1 font-mono text-[0.78rem] text-ice-soft",
} as const;
