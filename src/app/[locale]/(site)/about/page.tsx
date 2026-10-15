import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
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
      <PageHeader index="01" title={t("title")} lead={t("lead")} />

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <section
          id="story"
          data-section
          aria-label={t("title")}
          className="reveal scroll-mt-24 space-y-6 text-lg leading-relaxed text-fg/85"
        >
          <p className="measure border-s-2 border-ice/60 ps-5 text-xl leading-relaxed text-fg sm:text-[1.35rem]">
            {t("story1")}
          </p>
          <p className="measure">{t("story2")}</p>
          <p className="measure">{t("story3")}</p>
        </section>

        <aside aria-labelledby="approach-title" className="lg:sticky lg:top-24 lg:self-start">
          <div className="panel edge rounded-3xl p-6 sm:p-7">
            <h2 id="approach-title" className="text-lg font-semibold">
              {t("approachTitle")}
            </h2>
            <dl className="mt-5 space-y-5">
              {approach.map((key, i) => (
                <div key={key} className="relative ps-12">
                  <dt className="font-semibold text-ice-soft">
                    <span
                      aria-hidden="true"
                      className="absolute start-0 top-0 grid size-8 place-items-center rounded-lg border border-ice/30 bg-ice/10 font-mono text-xs text-ice"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t(`approach.${key}.title`)}
                  </dt>
                  <dd className="mt-1 text-fg-muted">{t(`approach.${key}.body`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <section id="experience" data-section aria-labelledby="experience-title" className="reveal mt-24 scroll-mt-24">
        <SectionHeading index="02" id="experience-title">
          {t("timelineTitle")}
        </SectionHeading>
        <div className="mt-12">
          <Timeline />
        </div>
      </section>

      <section id="languages" data-section aria-labelledby="languages-title" className="reveal mt-24 scroll-mt-24">
        <SectionHeading index="03" id="languages-title">
          {t("languagesTitle")}
        </SectionHeading>
        <dl className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {(
            [
              ["arabic", "native"],
              ["hebrew", "veryHigh"],
              ["english", "veryHigh"],
            ] as const
          ).map(([name, level]) => (
            <div key={name} className="panel rounded-2xl px-5 py-4">
              <dt className="text-lg font-semibold text-fg">{t(`languages.${name}`)}</dt>
              <dd className="mt-1 flex items-center gap-2 text-sm text-fg-muted">
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${level === "native" ? "bg-ice" : "bg-violet"}`}
                />
                {t(`languages.${level}`)}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
