import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChapterRule } from "@/components/cc/ChapterRule";
import "@/components/case-files/case-files.css";
import { approvedEvidence, caseMetadata, indexIsPublic } from "@/components/case-files/data";
import { CasePlate, CaseStatus, EvidenceMeter, Tools } from "@/components/case-files/parts";
import { statusKey, visibleCases } from "@/content/case-files";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { resolveLocale, type LocaleParams } from "@/lib/locale";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = (await resolveLocale(params)) as Locale;
  const t = await getTranslations({ locale, namespace: "caseFiles" });
  return caseMetadata(locale, "/case-files", t("meta.title"), t("meta.description"), indexIsPublic());
}

const statuses = ["awaiting", "inProgress", "documented"] as const;
const statusOf = { awaiting: "placeholder", inProgress: "draft", documented: "approved" } as const;

/**
 * Case Files index. Lists the cases this build may show: documented ones on the
 * public site (the page 404s until the first one is approved), everything in the
 * protected preview.
 */
export default async function CaseFilesPage({ params }: LocaleParams) {
  const locale = (await resolveLocale(params)) as Locale;
  setRequestLocale(locale);
  if (!visibleCases.length) notFound();
  const t = await getTranslations("caseFiles");
  // What this build actually holds, e.g. "3 planned investigations" or
  // "1 documented case · 2 planned investigations"; empty states are left out.
  const counts = (["documented", "inProgress", "awaiting"] as const)
    .map((s) => ({ s, n: visibleCases.filter((c) => c.status === statusOf[s]).length }))
    .filter(({ n }) => n > 0);

  return (
    <div className="cf">
      <div className="site-wrap cf-index">
        <header className="cf-index-head">
          <ChapterRule index="CF" as="p">
            {t("kicker")}
          </ChapterRule>
          <h1 className="cf-index-title cc-display">{t("title")}</h1>
          <p className="cf-index-lead">{t("lead")}</p>

          <div className="cf-legend">
            <p className="cf-tally">
              {counts.map(({ s, n }, i) => (
                <span key={s}>
                  {i > 0 ? <span aria-hidden="true"> · </span> : null}
                  {t(`count.${s}`, { count: n })}
                </span>
              ))}
            </p>
            <ul className="cf-legend-row" aria-label={t("legendTitle")}>
              {statuses.map((s) => (
                <li key={s}>
                  <CaseStatus status={statusOf[s]} label={t(`status.${s}`)} />
                </li>
              ))}
            </ul>
            <details className="cf-verify">
              <summary>{t("verifyTitle")}</summary>
              <dl className="cf-verify-list">
                {statuses.map((s) => (
                  <div key={s}>
                    <dt>{t(`status.${s}`)}</dt>
                    <dd>{t(`statusHelp.${s}`)}</dd>
                  </div>
                ))}
              </dl>
              <p>{t("verifyNote")}</p>
              <p>{t("publicNote")}</p>
            </details>
          </div>
        </header>

        <ol className="cf-grid">
          {visibleCases.map((c) => {
            const approved = approvedEvidence(c).length;
            return (
              <li key={c.id}>
                <article className="cf-card" aria-labelledby={`cf-${c.id}-title`}>
                  <span aria-hidden="true" className="cf-card-ticks" />
                  <CasePlate number={c.number} category={c.category} status={<CaseStatus status={c.status} label={t(`status.${statusKey[c.status]}`)} quiet={c.status === "placeholder"} />} />
                  <p className="cf-card-cat">{t(`category.${c.category}`)}</p>
                  <h2 id={`cf-${c.id}-title`} className="cf-card-title">
                    <Link href={`/case-files/${c.slug}`} className="cf-card-link">
                      {t(`items.${c.id}.title`)}
                    </Link>
                  </h2>
                  <p className="cf-card-objective">{t(`items.${c.id}.objective`)}</p>
                  <div className="cf-card-meta">
                    <p className="cf-card-prov">{t("provenance")}</p>
                    <Tools tools={c.tools} />
                    {approved > 0 ? <EvidenceMeter approved={approved} planned={approved} label={t("label.evidenceItems", { count: approved })} /> : null}
                  </div>
                  <p aria-hidden="true" className="cf-card-open">
                    {t("label.open")}
                    <span className="cf-arrow">→</span>
                  </p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
