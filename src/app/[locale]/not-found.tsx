import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ui } from "@/lib/ui";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className={`${ui.container} py-24`}>
      <h1 className="text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
      <p className="measure mt-4 text-fg-muted">{t("body")}</p>
      <Link href="/" className={`${ui.buttonPrimary} mt-8`}>
        {t("cta")}
      </Link>
    </section>
  );
}
