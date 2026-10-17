import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CertificateGallery, type GalleryItem } from "@/components/CertificateGallery";
import { ShieldIcon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
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
      kind: c.kind,
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
      <PageHeader index="02" title={t("title")} lead={t("lead")} />

      <section id="gallery" data-section aria-label={t("title")} className="mt-14 scroll-mt-24">
        <CertificateGallery
          items={items}
          labels={{ view: t("view"), close: t("close"), verify: t("verify"), newTab: tSocial("newTab") }}
        />
      </section>

      <p className="measure mt-10 flex items-start gap-3 rounded-xl border border-line bg-ink/40 px-4 py-3 text-sm text-fg-muted">
        <ShieldIcon width={18} height={18} className="mt-0.5 shrink-0 text-ice" />
        {t("privacyNote")}
      </p>
    </div>
  );
}
