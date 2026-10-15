import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Timeline } from "@/components/Timeline";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { ui } from "@/lib/ui";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "about");
}

const approach = ["troubleshoot", "document", "learn"] as const;

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className={`${ui.container} py-12 sm:py-20`}>
      <header id="intro" data-section className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-5 text-xl leading-relaxed text-fg/90">{t("lead")}</p>
      </header>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <section id="story" data-section aria-label={t("title")} className="scroll-mt-24 space-y-5 text-lg leading-relaxed text-fg/90">
          <p className="measure">{t("story1")}</p>
          <p className="measure">{t("story2")}</p>
          <p className="measure">{t("story3")}</p>
        </section>

        <aside aria-labelledby="approach-title" className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-2xl p-6">
            <h2 id="approach-title" className="text-lg font-semibold">
              {t("approachTitle")}
            </h2>
            <dl className="mt-4 space-y-5">
              {approach.map((key) => (
                <div key={key}>
                  <dt className="font-medium text-ice-soft">{t(`approach.${key}.title`)}</dt>
                  <dd className="mt-1 text-fg-muted">{t(`approach.${key}.body`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <section id="experience" data-section aria-labelledby="experience-title" className="mt-20 scroll-mt-24">
        <h2 id="experience-title" className={ui.sectionTitle}>
          {t("timelineTitle")}
        </h2>
        <div className="mt-10">
          <Timeline />
        </div>
      </section>

      <section id="languages" data-section aria-labelledby="languages-title" className="mt-20 scroll-mt-24">
        <h2 id="languages-title" className={ui.sectionTitle}>
          {t("languagesTitle")}
        </h2>
        <dl className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
          {(
            [
              ["arabic", "native"],
              ["hebrew", "veryHigh"],
              ["english", "veryHigh"],
            ] as const
          ).map(([name, level]) => (
            <div key={name} className="rounded-xl border border-line bg-deep/60 px-4 py-3">
              <dt className="font-semibold text-fg">{t(`languages.${name}`)}</dt>
              <dd className="text-sm text-fg-muted">{t(`languages.${level}`)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
