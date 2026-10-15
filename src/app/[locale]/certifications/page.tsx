import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CertificateGallery, type GalleryItem } from "@/components/CertificateGallery";
import { credentials } from "@/content/facts";
import { formatDate } from "@/lib/format";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { ui } from "@/lib/ui";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "certifications");
}

export default async function CertificationsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const t = await getTranslations("certifications");
  const tSocial = await getTranslations("social");

  const items: GalleryItem[] = credentials.map((c) => {
    const date = formatDate(locale, c.date);
    const isCertification = c.kind === "certification";
    return {
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      isCertification,
      kindLabel: t(`kind.${c.kind}`),
      dateLabel: isCertification ? t("issued", { date }) : t("completed", { date }),
      description: t(`description.${c.id}`),
      imageAlt: t("imageAlt", { title: c.title, issuer: c.issuer }),
      image: c.image,
      verificationUrl: c.verificationUrl,
    };
  });

  return (
    <div className={`${ui.container} py-12 sm:py-20`}>
      <header id="intro" data-section className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-5 text-xl leading-relaxed text-fg/90">{t("lead")}</p>
      </header>

      <section id="gallery" data-section aria-label={t("title")} className="mt-12 scroll-mt-24">
        <CertificateGallery
          items={items}
          labels={{ view: t("view"), close: t("close"), verify: t("verify"), newTab: tSocial("newTab") }}
        />
      </section>

      <p className="measure mt-10 text-sm text-fg-muted">{t("privacyNote")}</p>
    </div>
  );
}
