import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { protoCases, statusKey, type CaseId } from "@/components/concepts/case-files/data";
import { CasePlate, CaseStatus, EvidenceMeter, Facts, Slot, Tools } from "@/components/concepts/case-files/parts";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";

type Params = { params: Promise<{ locale: string; id: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => protoCases.map((c) => ({ locale, id: c.id })));
}
export const dynamicParams = false;

function findCase(id: string) {
  return protoCases.find((c) => c.id === (id as CaseId));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { id } = await params;
  const c = findCase(id);
  if (!c) return {};
  const t = await getTranslations({ locale, namespace: "caseProto" });
  const meta = await getTranslations({ locale, namespace: "meta" });
  return { title: `${c.number} · ${t(`cases.${c.id}.title`)} · ${t("metaTitle")} | ${meta("siteName")}` };
}

const stepKeys = ["1", "2", "3"] as const;
const sections = ["summary", "objective", "environment", "steps", "findings", "evidence", "video", "lessons", "skills"] as const;

/**
 * Phase 2 prototype: one case file. Every section of the final template is present;
 * where the content can only come from Eli's own evidence, a slot says so instead of
 * inventing it. Technical detail sits behind native disclosures (keyboard accessible).
 */
export default async function CaseFilePrototype({ params }: Params) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const { id } = await params;
  const c = findCase(id);
  if (!c) notFound();
  const t = await getTranslations("caseProto");
  const r = await getTranslations("recruiter");
  const idx = protoCases.indexOf(c);
  const prev = protoCases[idx - 1];
  const next = protoCases[idx + 1];
  const k = `cases.${c.id}` as const;
  const no = (i: number) => String(i + 1).padStart(2, "0");
  const status = t(`status.${statusKey[c.status]}`);

  return (
    <div className="cf">
      <p className="cf-proto" role="note">
        <span aria-hidden="true" className="cf-proto-dot" />
        {t("badge")}
      </p>

      <article className="site-wrap cf-case" aria-labelledby="cf-title">
        <nav aria-label={t("kicker")} className="cf-crumbs">
          <Link href="/concepts/case-files">{t("label.back")}</Link>
          <span aria-hidden="true">/</span>
          <span dir="ltr">{c.number}</span>
        </nav>

        <header className="cf-dossier">
          <span aria-hidden="true" className="cf-card-ticks" />
          <CasePlate number={c.number} category={c.category} size="dossier" numberHidden status={<CaseStatus status={c.status} label={status} />} />
          <p className="cf-card-cat">
            <span className="sr-only">
              {t("label.case")} {c.number} ·{" "}
            </span>
            {t(`category.${c.category}`)}
          </p>
          <h1 id="cf-title" className="cf-dossier-title cc-display">
            {t(`${k}.title`)}
          </h1>
          <p className="cf-card-prov">{t("provenance")}</p>
          <Facts
            rows={[
              { label: t("label.environment"), value: t(`${k}.environment`) },
              { label: t("label.tools"), value: <Tools tools={c.tools} /> },
              {
                label: t("label.evidence"),
                value: (
                  <EvidenceMeter
                    approved={c.evidenceApproved}
                    planned={c.evidencePlanned}
                    label={t("label.evidenceCount", { approved: c.evidenceApproved, planned: c.evidencePlanned })}
                  />
                ),
              },
              { label: t("label.updated"), value: t("label.notYet") },
            ]}
          />
        </header>

        {c.status !== "approved" ? (
          <p className="cf-notice" role="status">
            {t("notice")}
          </p>
        ) : null}

        <div className="cf-body">
          {/* Contents: a sticky index on desktop, a collapsed disclosure on phones. */}
          <div className="cf-toc-wrap">
            <nav aria-label={t("label.contents")} className="cf-toc cf-toc--desk">
              <p className="cf-toc-summary">{t("label.contents")}</p>
              <TocList items={sections.map((s, i) => ({ id: s, n: no(i), label: t(`section.${s}`) }))} />
            </nav>
            <details className="cf-toc cf-toc--mob">
              <summary className="cf-toc-summary">{t("label.contents")}</summary>
              <TocList items={sections.map((s, i) => ({ id: s, n: no(i), label: t(`section.${s}`) }))} />
            </details>
          </div>

          <div className="cf-sections">
            <Section id="summary" n={no(0)} title={t("section.summary")}>
              <dl className="cf-summary">
                <div>
                  <dt>{t("label.whatIDid")}</dt>
                  <dd>
                    <Slot note={t("label.slotNote")}>{t("slot.whatIDid")}</Slot>
                  </dd>
                </div>
                <div>
                  <dt>{t("label.whatItShows")}</dt>
                  <dd>
                    <Slot note={t("label.slotNote")}>{t("slot.whatItShows")}</Slot>
                  </dd>
                </div>
                <div>
                  <dt>{t("label.skills")}</dt>
                  <dd>
                    <ul className="cf-chips">
                      {c.skills.map((s) => (
                        <li key={s}>{r(`skill.${s}.title`)}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </Section>

            <Section id="objective" n={no(1)} title={t("section.objective")}>
              <p className="cf-lead">{t(`${k}.objective`)}</p>
            </Section>

            <Section id="environment" n={no(2)} title={t("section.environment")}>
              <p className="cf-text">{t(`${k}.environment`)}</p>
              <Tools tools={c.tools} />
            </Section>

            <Section id="steps" n={no(3)} title={t("section.steps")}>
              <ol className="cf-steps">
                {stepKeys.slice(0, c.steps).map((step, i) => (
                  <li key={step} className="cf-step">
                    <span aria-hidden="true" className="cf-step-no" dir="ltr">
                      S{i + 1}
                    </span>
                    <div className="cf-step-body">
                      <p className="cf-step-tag">{t("label.plannedStep")}</p>
                      <h3 className="cf-step-title">{t(`${k}.steps.${step}.title`)}</h3>
                      <details className="cf-detail">
                        <summary>{t("label.technical")}</summary>
                        <p>{t(`${k}.steps.${step}.detail`)}</p>
                      </details>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="findings" n={no(4)} title={t("section.findings")}>
              <Slot note={t("label.slotNote")}>{t("slot.findings")}</Slot>
            </Section>

            <Section id="evidence" n={no(5)} title={t("section.evidence")}>
              <p className="cf-text">{t("slot.evidence")}</p>
              <ul className="cf-gallery">
                {Array.from({ length: c.evidencePlanned }, (_, i) => (
                  <li key={i}>
                    <figure className="cf-figure">
                      <div className="cf-figure-frame">
                        <span aria-hidden="true" className="cf-card-ticks" />
                        <span className="cf-figure-empty">{t("label.evidenceSlot")}</span>
                      </div>
                      <figcaption>
                        <span className="cf-figure-id" dir="ltr">
                          E-{no(i)}
                        </span>
                        <span>{t("slot.caption")}</span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="video" n={no(6)} title={t("section.video")}>
              <div className="cf-video">
                <span aria-hidden="true" className="cf-card-ticks" />
                <span aria-hidden="true" className="cf-video-play" />
                <span className="cf-video-empty">{t("label.videoSlot")}</span>
                <span className="cf-video-meta">{t("label.videoMeta")}</span>
              </div>
            </Section>

            <Section id="lessons" n={no(7)} title={t("section.lessons")}>
              <Slot note={t("label.slotNote")}>{t("slot.lessons")}</Slot>
            </Section>

            <Section id="skills" n={no(8)} title={t("section.skills")}>
              <ul className="cf-skill-links">
                {c.skills.map((s) => (
                  <li key={s}>
                    <Link href="/recruiter">
                      <span className="cf-skill-name">{r(`skill.${s}.title`)}</span>
                      <span className="cf-skill-detail">{r(`skill.${s}.detail`)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        <nav aria-label={`${t("label.previous")} / ${t("label.next")}`} className="cf-pager">
          {prev ? (
            <Link href={`/concepts/case-files/${prev.id}`} className="cf-pager-link" rel="prev">
              <span className="cf-pager-label">{t("label.previous")}</span>
              <span className="cf-pager-title">
                <span dir="ltr">{prev.number}</span> · {t(`cases.${prev.id}.title`)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/concepts/case-files/${next.id}`} className="cf-pager-link cf-pager-link--next" rel="next">
              <span className="cf-pager-label">{t("label.next")}</span>
              <span className="cf-pager-title">
                <span dir="ltr">{next.number}</span> · {t(`cases.${next.id}.title`)}
              </span>
            </Link>
          ) : (
            <Link href="/concepts/case-files" className="cf-pager-link cf-pager-link--next">
              <span className="cf-pager-label">{t("kicker")}</span>
              <span className="cf-pager-title">{t("label.back")}</span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: ReactNode }) {
  return (
    <section id={`cf-${id}`} aria-labelledby={`cf-${id}-h`} className="cf-section">
      <h2 id={`cf-${id}-h`} className="cf-section-title">
        <span aria-hidden="true" className="cf-section-no">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TocList({ items }: { items: { id: string; n: string; label: string }[] }) {
  return (
    <ol className="cf-toc-list">
      {items.map((it) => (
        <li key={it.id}>
          <a href={`#cf-${it.id}`}>
            <span aria-hidden="true" className="cf-toc-no">
              {it.n}
            </span>
            {it.label}
          </a>
        </li>
      ))}
    </ol>
  );
}
