import type { CSSProperties, ReactNode } from "react";

const tones = {
  ok: "border-ok/35 bg-ok/[0.08] text-[#b8f5cd] shadow-[0_0_24px_-10px_rgb(74_222_128/0.8)]",
  ice: "border-ice/35 bg-ice/10 text-ice-soft",
  muted: "border-line-strong bg-white/5 text-fg-muted",
  pending: "border-pending/40 bg-pending/10 text-[#fbd99a]",
} as const;

const dots = { ok: "bg-ok", ice: "bg-ice", muted: "bg-fg-muted", pending: "bg-pending" } as const;

export function StatusChip({
  tone,
  live = false,
  className = "",
  style,
  children,
}: {
  tone: keyof typeof tones;
  live?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <span
      style={style}
      className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-sm font-medium backdrop-blur-sm ${tones[tone]} ${className}`}
    >
      <span aria-hidden="true" className={`size-2 rounded-full ${dots[tone]} ${live ? "live-dot" : ""}`} />
      {children}
    </span>
  );
}
