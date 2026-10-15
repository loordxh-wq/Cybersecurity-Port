import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { ui } from "@/lib/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { NavLinks, type NavItem } from "./NavLinks";

export async function getNavItems(): Promise<NavItem[]> {
  const t = await getTranslations("nav");
  return [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/certifications", label: t("certifications") },
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
    <header className="sticky top-0 z-40 border-b border-line bg-ink/75 backdrop-blur-md">
      <div className={`${ui.container} relative flex h-16 items-center justify-between gap-4`}>
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-lg font-semibold text-fg">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg border border-ice/40 bg-ice/10 font-mono text-[0.8rem] text-ice"
            dir="ltr"
          >
            ES
          </span>
          <span>{tHero("name")}</span>
          {locale !== "en" ? (
            <span lang="en" dir="ltr" className="hidden text-sm font-normal text-fg-muted sm:inline">
              Eli Saad
            </span>
          ) : null}
        </Link>

        <nav aria-label={t("primary")} className="hidden md:block">
          <NavLinks
            items={items}
            className="flex items-center gap-1"
            linkClassName="inline-flex min-h-11 items-center rounded-lg px-3 text-[0.95rem] transition-colors"
          />
        </nav>

        <div className="hidden md:block">
          <LocaleSwitcher {...localeLabels} />
        </div>

        <MobileNav items={items} openLabel={t("openMenu")} closeLabel={t("closeMenu")} navLabel={t("primary")}>
          <LocaleSwitcher {...localeLabels} />
        </MobileNav>
      </div>
    </header>
  );
}
