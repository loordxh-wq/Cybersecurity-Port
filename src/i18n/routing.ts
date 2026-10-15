import { defineRouting } from "next-intl/routing";

export const locales = ["en", "he", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export const rtlLocales: readonly Locale[] = ["he", "ar"];

export function directionFor(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  he: "he_IL",
  ar: "ar_AR",
};
