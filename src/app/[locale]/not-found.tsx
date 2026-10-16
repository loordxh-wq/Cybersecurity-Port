import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { ui } from "@/lib/ui";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  const meta = await getTranslations("meta");
  return (
    <SiteChrome>
      {/* React hoists these into <head>; not-found pages cannot use generateMetadata. */}
      <title>{meta("notFound.title")}</title>
      <meta name="robots" content="noindex" />
      <section className={`${ui.container} py-24`}>
        <h1 className="text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <p className="measure mt-4 text-fg-muted">{t("body")}</p>
        <Link href="/" className={`${ui.buttonPrimary} mt-8`}>
          {t("cta")}
        </Link>
      </section>
    </SiteChrome>
  );
}
