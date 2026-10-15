import type { CredentialKind } from "@/content/facts";
import { BookIcon, ShieldIcon } from "./icons";

/**
 * Distinguishes a certification (solid cyan, shield) from a course completion
 * (outlined violet, book) by colour, icon and text, never colour alone.
 */
export function CredentialBadge({ kind, label }: { kind: CredentialKind; label: string }) {
  const isCert = kind === "certification";
  const Icon = isCert ? ShieldIcon : BookIcon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.8rem] font-semibold ${
        isCert
          ? "bg-ice/15 text-ice-soft ring-1 ring-ice/45 shadow-[0_0_18px_-6px_rgb(66_213_246/0.8)]"
          : "bg-violet/[0.08] text-violet-soft ring-1 ring-violet/35"
      }`}
    >
      <Icon width={14} height={14} />
      {label}
    </span>
  );
}
