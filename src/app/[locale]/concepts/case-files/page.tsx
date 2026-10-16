import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChapterRule } from "@/components/cc/ChapterRule";
import { protoCases, statusKey } from "@/components/concepts/case-files/data";
import { CasePlate, CaseStatus, EvidenceMeter, Tools } from "@/components/concepts/case-files/parts";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type LocaleParams } from "@/lib/locale";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "caseProto" });
  const meta = await getTranslations({ locale, namespace: "meta" });
  return { title: `${t("metaTitle")} | ${meta("siteName")}` };
}

/**
 * Phase 2 prototype: the Case Files index. Three planned cases, all awaiting evidence,
 * shown exactly as they are. In the public build this page lists approved cases only.
 */
export default async function CaseFilesPrototype({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const t = await getTranslations("caseProto");
  const statuses = ["awaiting", "inProgress", "documented"] as const;
  const statusOf = { awaiting: "placeholder", inProgress: "draft", documented: "approved" } as const;

  return (
    <div className="cf">
      <p className="cf-proto" role="note">
        <span aria-hidden="true" className="cf-proto-dot" />
        {t("badge")}
      </p>

      <div className="site-wrap cf-index">
        <header className="cf-index-head">
          <ChapterRule index="CF" as="p">
            {t("kicker")}
          </ChapterRule>
          <h1 className="cf-index-title cc-display">{t("title")}</h1>
          <p className="cf-index-lead">{t("lead")}</p>

          {/* Status stays visible as three marks; the full explanation is one tap away. */}
          <div className="cf-legend">
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
              <p>{t("label.publicNote")}</p>
            </details>
          </div>
        </header>

        <ol className="cf-grid">
          {protoCases.map((c) => (
            <li key={c.id}>
              <article className="cf-card" aria-labelledby={`cf-${c.id}-title`}>
                <span aria-hidden="true" className="cf-card-ticks" />
                <CasePlate number={c.number} category={c.category} status={<CaseStatus status={c.status} label={t(`status.${statusKey[c.status]}`)} />} />
                <p className="cf-card-cat">{t(`category.${c.category}`)}</p>
                <h2 id={`cf-${c.id}-title`} className="cf-card-title">
                  <Link href={`/concepts/case-files/${c.id}`} className="cf-card-link">
                    {t(`cases.${c.id}.title`)}
                  </Link>
                </h2>
                <p className="cf-card-objective">{t(`cases.${c.id}.objective`)}</p>
                <div className="cf-card-meta">
                  <p className="cf-card-prov">{t("provenance")}</p>
                  <Tools tools={c.tools} />
                  <EvidenceMeter
                    approved={c.evidenceApproved}
                    planned={c.evidencePlanned}
                    label={t("label.evidenceCount", { approved: c.evidenceApproved, planned: c.evidencePlanned })}
                  />
                </div>
                <p aria-hidden="true" className="cf-card-open">
                  {t("label.open")}
                  <span className="cf-arrow">→</span>
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

