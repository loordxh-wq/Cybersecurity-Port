import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Atmosphere, header, main landmark and footer shared by the site pages and the 404 page. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="atmosphere" aria-hidden="true" />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
