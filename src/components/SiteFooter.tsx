import { getTranslations } from "next-intl/server";
import { hasPublishedProject } from "@/content/projects";
import { isPreview } from "@/content/stage";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { getLocaleLabels, getNavItems } from "./SiteHeader";
import { TextSocialLinks } from "./site/TextSocialLinks";

/**
 * Closing composition: the signal horizon returns as the footer's top rule, the
 * name is set large in outline chrome, and the page index, profiles and language
 * sit on one hairline grid.
 */
export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tHero = await getTranslations("hero");
  const tCommon = await getTranslations("common");
  const items = await getNavItems();
  const localeLabels = await getLocaleLabels();
  const year = String(new Date().getFullYear()); // string: avoids "2,026" grouping

  return (
    <footer className="site-footer">
      <div aria-hidden="true" className="site-footer-horizon" />
      <div className="site-wrap relative">
        <p aria-hidden="true" dir="ltr" className="site-footer-giant cc-display">
          ELI SAAD
        </p>
        <div className="site-footer-grid">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-white">{tHero("name")}</p>
            <p className="max-w-sm text-white/70">{t("tagline")}</p>
            {/* Evidence statement: only once reviewed lab work is actually published. */}
            {hasPublishedProject ? (
              <p className="site-footer-labnote max-w-md text-sm leading-relaxed text-white/62">{t("labNote")}</p>
            ) : null}
          </div>
          <div>
            <h2 className="site-footer-title">{t("navTitle")}</h2>
            <nav aria-label={t("navTitle")}>
              <ul>
                {items.map((item, i) => (
                  <li key={item.href}>
                    <Link href={item.href} className="site-footer-link">
                      <span aria-hidden="true" className="site-navlink-index">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="site-footer-title">{t("socialTitle")}</h2>
              <TextSocialLinks label={t("socialTitle")} className="flex-col !gap-0" />
            </div>
            <div>
              <h2 className="site-footer-title">{t("languageTitle")}</h2>
              <LocaleSwitcher {...localeLabels} appearance="command" landmark={false} />
            </div>
          </div>
        </div>
        <div className="site-footer-base">
          <p>{t("rights", { year })}</p>
          {isPreview ? <p className="text-[#f5c46b]">{tCommon("previewBuild")}</p> : null}
          <p aria-hidden="true" dir="ltr" className="font-mono text-xs text-white/60">
            SOC · BLUE TEAM · IT SUPPORT
          </p>
        </div>
      </div>
    </footer>
  );
}
