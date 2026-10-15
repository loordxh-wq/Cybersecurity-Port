import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, ogLocale, type Locale } from "@/i18n/routing";
import { siteUrl } from "./site";

export type PageKey = "home" | "about" | "certifications" | "contact";

export const pagePaths: Record<PageKey, string> = {
  home: "",
  about: "/about",
  certifications: "/certifications",
  contact: "/contact",
};

export function localizedUrl(locale: Locale, path: string): string {
  return `${siteUrl}/${locale}${path}`;
}

export async function pageMetadata(locale: Locale, page: PageKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const path = pagePaths[page];
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const languages = Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)]));

  return {
    title,
    description,
    alternates: {
      canonical: localizedUrl(locale, path),
      languages: { ...languages, "x-default": localizedUrl("en", path) },
    },
    openGraph: {
      type: page === "home" ? "profile" : "website",
      siteName: t("siteName"),
      title,
      description,
      url: localizedUrl(locale, path),
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: { card: "summary", title, description },
  };
}
