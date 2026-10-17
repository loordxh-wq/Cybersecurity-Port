import type { ReactNode } from "react";

/**
 * The amber square that accompanies every simulated or pending item. Decorative:
 * the words next to it carry the meaning, so it is hidden from assistive tech.
 */
export function SimTag({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`cc-simtag ${className}`} />;
}

/** Label form: amber square plus text, e.g. "Simulated training lab". */
export function SimLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`cc-simlabel ${className}`}>
      <SimTag />
      {children}
    </span>
  );
}
