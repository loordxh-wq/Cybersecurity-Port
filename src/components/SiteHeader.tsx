import { getLocale, getTranslations } from "next-intl/server";
import { publishedCases } from "@/content/case-files";
import { locales, type Locale } from "@/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";
import type { NavItem } from "./site/nav";
import { CommandHeader } from "./site/CommandHeader";
import { TextSocialLinks } from "./site/TextSocialLinks";

export async function getNavItems(): Promise<NavItem[]> {
  const t = await getTranslations("nav");
  return [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/certifications", label: t("certifications") },
    // Case files join the navigation only once a documented case is public (decision P2).
    ...(publishedCases.length ? [{ href: "/case-files" as const, label: t("caseFiles") }] : []),
    { href: "/contact", label: t("contact") },
  ];
}

export async function getLocaleLabels() {
  const tNames = await getTranslations("localeNames");
  const tNav = await getTranslations("nav");
  const names = Object.fromEntries(locales.map((l) => [l, tNames(l)])) as Record<Locale, string>;
  const switchLabels = Object.fromEntries(
    locales.map((l) => [l, tNav("switchTo", { language: names[l] })]),
  ) as Record<Locale, string>;
  return { names, switchLabels, label: tNav("language") };
}

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const tHero = await getTranslations("hero");
  const locale = await getLocale();
  const items = await getNavItems();
  const localeLabels = await getLocaleLabels();

  return (
    <CommandHeader
      name={tHero("name")}
      localName={locale === "en" ? null : tHero("name")}
      items={items}
      labels={{ primary: t("primary"), menu: t("menu"), close: t("closeMenu"), forRecruiters: t("forRecruiters"), recruitersShort: t("recruitersShort") }}
      localeBar={<LocaleSwitcher {...localeLabels} appearance="command" short />}
      localeMenu={<LocaleSwitcher {...localeLabels} appearance="command" landmark={false} />}
      social={<TextSocialLinks label={tHero("socialLabel")} />}
    />
  );
}
