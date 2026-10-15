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
    <footer className="mt-24 border-t border-line bg-deep/60">
      <div className={`${ui.container} grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]`}>
        <div className="space-y-3">
          <p className="text-lg font-semibold text-fg">{tHero("name")}</p>
          <p className="max-w-sm text-fg-muted">{t("tagline")}</p>
          <p className="max-w-md text-sm text-fg-muted">{t("simulatedNote")}</p>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-fg">{t("navTitle")}</h2>
          <nav aria-label={t("navTitle")}>
            <NavLinks items={items} className="flex flex-col" linkClassName="inline-flex min-h-10 items-center" />
          </nav>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-fg">{t("socialTitle")}</h2>
            <SocialLinks label={t("socialTitle")} />
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-fg">{t("languageTitle")}</h2>
            <LocaleSwitcher {...localeLabels} compact landmark={false} />
          </div>
        </div>
      </div>
      <div className={`${ui.container} border-t border-line py-5 text-sm text-fg-muted`}>
        <p>{t("rights", { year })}</p>
      </div>
    </footer>
  );
}
