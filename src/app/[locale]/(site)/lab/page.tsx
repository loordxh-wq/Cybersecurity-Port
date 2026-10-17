import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ChapterRule } from "@/components/cc/ChapterRule";
import { SimLabel } from "@/components/cc/SimTag";
import { copyFor } from "@/components/lab-mockup/copy";
import "@/components/lab-mockup/lab-mockup.css";
import { V } from "@/components/lab-mockup/parts";
import { isPreview } from "@/content/stage";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { resolveLocale, type LocaleParams } from "@/lib/locale";

// Phase 3 M1 mockup (proposal branch only): protected preview, never indexed.
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = (await resolveLocale(params)) as Locale;
  return { title: `${copyFor[locale].index.title} | Eli Saad`, robots: { index: false, follow: false } };
}

export default async function LabIndexMockup({ params }: LocaleParams) {
  const locale = (await resolveLocale(params)) as Locale;
  setRequestLocale(locale);
  if (!isPreview) notFound();
  const t = copyFor[locale];
  return (
    <div className="lm lm-index">
      <div className="site-wrap">
        <p className="lm-review">{t.review}</p>
        <ChapterRule index="LAB" as="p">
          <SimLabel className="lm-sim">{t.sim}</SimLabel>
        </ChapterRule>
        <h1 className="lm-index-title cc-display">{t.index.title}</h1>
        <p className="lm-index-lead">{t.index.lead}</p>

        <article className="lm-scn">
          <span aria-hidden="true" className="lm-ticks" />
          <div className="lm-scn-main">
            <p className="lm-scn-code">
              <V>SOC-01</V>
            </p>
            <h2 className="lm-scn-title">{t.scenario.replace(/^SOC-01 · /, "")}</h2>
            <dl className="lm-scn-meta">
              {t.index.meta.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/lab/soc-01" className="lm-btn lm-btn--solid lm-scn-open">
              {t.index.open}
              <span aria-hidden="true" className="lm-arrow">
                →
              </span>
            </Link>
          </div>
          <div className="lm-scn-how">
            <h3 className="lm-label">{t.index.howTitle}</h3>
            <ol>
              {t.index.how.map((s, i) => (
                <li key={s}>
                  <V className="lm-how-n">{String(i + 1).padStart(2, "0")}</V>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </article>
        <p className="lm-index-foot">
          {t.index.data} {t.index.credit}
        </p>
      </div>
    </div>
  );
}
