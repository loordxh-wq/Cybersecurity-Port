import { getTranslations } from "next-intl/server";
import { ui } from "@/lib/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NavLinks } from "./NavLinks";
import { getLocaleLabels, getNavItems } from "./SiteHeader";
import { SocialLinks } from "./SocialLinks";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tHero = await getTranslations("hero");
  const items = await getNavItems();
  const localeLabels = await getLocaleLabels();
  const year = String(new Date().getFullYear()); // string: avoids "2,026" grouping

  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-b from-deep/40 to-ink">
      <div aria-hidden="true" className="beam opacity-60" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.14),transparent)]"
      />
      <div className={`${ui.container} relative grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1.1fr]`}>
        <div className="space-y-4">
          <p className="flex items-center gap-3 text-xl font-semibold tracking-tight text-fg">
            <span
              aria-hidden="true"
              dir="ltr"
              className="grid size-9 place-items-center rounded-xl border border-ice/40 bg-gradient-to-br from-ice/20 via-cobalt/10 to-violet/20 font-mono text-[0.78rem] text-ice-soft"
            >
              ES
            </span>
            {tHero("name")}
          </p>
          <p className="max-w-sm text-fg-muted">{t("tagline")}</p>
          <p className="max-w-md rounded-xl border border-line bg-ink/40 px-4 py-3 text-sm text-fg-muted">
            {t("simulatedNote")}
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-mono text-xs font-medium text-ice">{t("navTitle")}</h2>
          <nav aria-label={t("navTitle")}>
            <NavLinks
              items={items}
              className="flex flex-col"
              linkClassName="inline-flex min-h-10 items-center transition-colors"
            />
          </nav>
        </div>
        <div className="space-y-7">
          <div>
            <h2 className="mb-3 font-mono text-xs font-medium text-ice">{t("socialTitle")}</h2>
            <SocialLinks label={t("socialTitle")} />
          </div>
          <div>
            <h2 className="mb-3 font-mono text-xs font-medium text-ice">{t("languageTitle")}</h2>
            <LocaleSwitcher {...localeLabels} compact landmark={false} />
          </div>
        </div>
      </div>
      <div className={`${ui.container} relative`}>
        <div className="flex flex-col gap-2 border-t border-line py-6 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights", { year })}</p>
          <p aria-hidden="true" dir="ltr" className="font-mono text-xs text-fg-muted/60">
            SOC · Blue Team · IT Support
          </p>
        </div>
      </div>
    </footer>
  );
}
