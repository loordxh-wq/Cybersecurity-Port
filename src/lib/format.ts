import type { Locale } from "@/i18n/routing";

/** Long date in the visitor's language, always with Western digits. */
export function formatDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(`${locale}-u-nu-latn`, {
    dateStyle: "long",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(`${iso}T12:00:00Z`));
}
