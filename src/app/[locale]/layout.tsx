import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { directionFor, routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";

export const viewport: Viewport = {
  themeColor: "#07101b",
  colorScheme: "dark",
  // Edge to edge on notched iPhones; content keeps clear of the notch and home
  // indicator through env(safe-area-inset-*) paddings (globals.css, header, bars, dialogs).
  viewportFit: "cover",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteUrl),
    applicationName: t("siteName"),
    authors: [{ name: "Eli Saad" }],
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html lang={locale} dir={directionFor(locale)} className={fontVariables}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-ice px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:start-3 focus:top-3"
        >
          {t("skip")}
        </a>
        {/* Site chrome (header, footer, atmosphere) lives in (site)/layout.tsx, so design prototypes can render their own. */}
        {/* No client component reads messages, so none are serialized into the page:
            wording for unpublished content never reaches the browser. */}
        <NextIntlClientProvider messages={{}}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
