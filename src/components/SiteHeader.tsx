import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { ui } from "@/lib/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { NavLinks, type NavItem } from "./NavLinks";
import { SocialLinks } from "./SocialLinks";

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
    <header className="sticky top-0 z-40 bg-ink/70 backdrop-blur-xl">
      <div className={`${ui.container} relative flex h-16 items-center justify-between gap-4`}>
        <Link href="/" className="group flex min-h-11 items-center gap-3 rounded-lg font-semibold text-fg">
          <LogoMark />
          <span className="tracking-tight">{tHero("name")}</span>
          {locale !== "en" ? (
            <span lang="en" dir="ltr" className="hidden text-sm font-normal text-fg-muted sm:inline">
              Eli Saad
            </span>
          ) : null}
        </Link>

        <nav aria-label={t("primary")} className="hidden md:block">
          <NavLinks
            items={items}
            className="flex items-center gap-1 rounded-2xl border border-line bg-deep/50 p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]"
            linkClassName="relative inline-flex min-h-10 items-center rounded-xl px-3.5 text-[0.93rem] transition-colors data-[current]:bg-white/[0.06] data-[current]:after:absolute data-[current]:after:inset-x-4 data-[current]:after:-bottom-[5px] data-[current]:after:h-px data-[current]:after:bg-ice data-[current]:after:shadow-[0_0_10px_rgb(66_213_246)]"
          />
        </nav>

        <div className="hidden md:block">
          <LocaleSwitcher {...localeLabels} />
        </div>

        <MobileNav
          items={items}
          openLabel={t("openMenu")}
          closeLabel={t("closeMenu")}
          navLabel={t("primary")}
          languageLabel={localeLabels.label}
          language={<LocaleSwitcher {...localeLabels} compact stretch />}
          social={<SocialLinks label={tHero("socialLabel")} />}
        />
      </div>
      <div aria-hidden="true" className="beam opacity-60" />
    </header>
  );
}

/** "ES" monogram in a glowing cut-corner tile. Decorative: the name next to it is the link text. */
function LogoMark() {
  return (
    <span
      aria-hidden="true"
      dir="ltr"
      className="relative grid size-9 place-items-center rounded-xl border border-ice/40 bg-gradient-to-br from-ice/20 via-cobalt/10 to-violet/20 font-mono text-[0.78rem] font-semibold text-ice-soft shadow-[0_0_20px_-6px_rgb(66_213_246/0.8),inset_0_1px_0_rgb(255_255_255/0.12)] transition-shadow group-hover:shadow-[0_0_26px_-4px_rgb(66_213_246/0.9),inset_0_1px_0_rgb(255_255_255/0.12)]"
    >
      ES
      <span className="absolute -end-0.5 -top-0.5 size-1.5 rounded-full bg-ice shadow-[0_0_8px_rgb(66_213_246)]" />
    </span>
  );
}
