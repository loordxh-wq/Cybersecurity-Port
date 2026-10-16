import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "@/components/case-files/case-files.css";
import { approvedEvidence, caseMetadata, sanitizedOn } from "@/components/case-files/data";
import { CaseDiagram } from "@/components/case-files/CaseDiagram";
import { EvidenceGallery } from "@/components/case-files/EvidenceGallery";
import { CasePlate, CaseStatus, EvidenceMeter, Facts, Slot, Tools } from "@/components/case-files/parts";
import { caseBySlug, statusKey, visibleCases } from "@/content/case-files";
import { evidenceImages } from "@/content/evidence-images";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { resolveLocale } from "@/lib/locale";

type Params = { params: Promise<{ locale: string; slug: string }> };

/** Only cases this build may show get a page; any other slug is a 404. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => visibleCases.map((c) => ({ locale, slug: c.slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = (await resolveLocale(params)) as Locale;
  const { slug } = await params;
  const c = caseBySlug(slug);
  if (!c) return {};
  const t = await getTranslations({ locale, namespace: "caseFiles" });
  const meta = await getTranslations({ locale, namespace: "meta" });
  return caseMetadata(locale, `/case-files/${c.slug}`, `${c.number} · ${t(`items.${c.id}.title`)} | ${meta("siteName")}`, t(`items.${c.id}.objective`), c.status === "approved");
}

const sections = ["summary", "objective", "environment", "workflow", "steps", "checks", "findings", "evidence", "video", "lessons", "skills"] as const;

/**
 * One case file. Every section of the approved template is present. Where content can
 * only come from Eli's own reviewed evidence (summary, findings, lessons, screenshots),
 * the page shows it when it exists and otherwise a slot that says what will go there:
 * nothing is invented. On the public site only documented, approved cases reach here.
 */
export default async function CaseFilePage({ params }: Params) {
  const locale = (await resolveLocale(params)) as Locale;
  setRequestLocale(locale);
  const { slug } = await params;
  const c = caseBySlug(slug);
  if (!c) notFound();
  const t = await getTranslations("caseFiles");
  const r = await getTranslations("recruiter");
  const k = `items.${c.id}` as const;
  const idx = visibleCases.indexOf(c);
  const prev = visibleCases[idx - 1];
  const next = visibleCases[idx + 1];
  const documented = c.status === "approved";
  const planned = c.status === "placeholder";
  const shown = sections.filter((s) => s !== "video" || c.video);
  const no = (s: (typeof sections)[number]) => String(shown.indexOf(s) + 1).padStart(2, "0");
  const has = (key: string) => t.has(`${k}.${key}` as never);
  const text = (key: string) => t(`${k}.${key}` as never);

  const evidence = approvedEvidence(c).filter((e) => evidenceImages[e.file]);
  const galleryItems = evidence.map((e) => ({
    id: e.id,
    image: evidenceImages[e.file]!,
    alt: has(`evidence.${e.id}.alt`) ? text(`evidence.${e.id}.alt`) : "",
    caption: has(`evidence.${e.id}.caption`) ? text(`evidence.${e.id}.caption`) : "",
    meta: sanitizedOn(e.file) ? formatDate(locale, sanitizedOn(e.file)!) : "",
  }));
  const emptySlots = documented
    ? []
    : Array.from({ length: Math.max(0, c.evidencePlanned - galleryItems.length) }, (_, i) => ({
        id: `E-${String(galleryItems.length + i + 1).padStart(2, "0")}`,
        caption: t("slot.caption"),
      }));
  const approvedCount = approvedEvidence(c).length;

  return (
    <div className="cf">
      <article className="site-wrap cf-case" aria-labelledby="cf-title">
        <nav aria-label={t("kicker")} className="cf-crumbs">
          <Link href="/case-files">{t("label.back")}</Link>
          <span aria-hidden="true">/</span>
          <span dir="ltr">{c.number}</span>
        </nav>

        <header className="cf-dossier">
          <span aria-hidden="true" className="cf-card-ticks" />
          <CasePlate number={c.number} category={c.category} size="dossier" numberHidden status={<CaseStatus status={c.status} label={t(`status.${statusKey[c.status]}`)} />} />
          <p className="cf-card-cat">
            <span className="sr-only">
              {t("label.case")} {c.number} ·{" "}
            </span>
            {t(`category.${c.category}`)}
          </p>
          <h1 id="cf-title" className="cf-dossier-title cc-display">
            {text("title")}
          </h1>
          <p className="cf-card-prov">{t("provenance")}</p>
          <Facts
            rows={[
              { label: t("label.environment"), value: text("environment") },
              { label: t("label.tools"), value: <Tools tools={c.tools} /> },
              {
                label: t("label.evidence"),
                value: (
                  <EvidenceMeter
                    approved={approvedCount}
                    planned={Math.max(c.evidencePlanned, approvedCount)}
                    label={t("label.evidenceCount", { approved: approvedCount, planned: Math.max(c.evidencePlanned, approvedCount) })}
                  />
                ),
              },
              { label: t("label.updated"), value: c.updatedOn ? formatDate(locale, c.updatedOn) : t("label.notYet") },
            ]}
          />
        </header>

        {!documented ? (
          <p className="cf-notice" role="status">
            {t("notice")}
          </p>
        ) : null}

        <div className="cf-body">
          {/* Contents: a sticky index on desktop, a collapsed disclosure on phones. */}
          <div className="cf-toc-wrap">
            <nav aria-label={t("label.contents")} className="cf-toc cf-toc--desk">
              <p className="cf-toc-summary">{t("label.contents")}</p>
              <TocList items={shown.map((s) => ({ id: s, n: no(s), label: t(`section.${s}`) }))} />
            </nav>
            <details className="cf-toc cf-toc--mob">
              <summary className="cf-toc-summary">{t("label.contents")}</summary>
              <TocList items={shown.map((s) => ({ id: s, n: no(s), label: t(`section.${s}`) }))} />
            </details>
          </div>

          <div className="cf-sections">
            <Section id="summary" n={no("summary")} title={t("section.summary")}>
              <dl className="cf-summary">
                <div>
                  <dt>{t("label.whatIDid")}</dt>
                  <dd>{has("summary.did") ? <p className="cf-text cf-text--strong">{text("summary.did")}</p> : <Slot>{t("slot.whatIDid")}</Slot>}</dd>
                </div>
                <div>
                  <dt>{t("label.whatItShows")}</dt>
                  <dd>{has("summary.shows") ? <p className="cf-text cf-text--strong">{text("summary.shows")}</p> : <Slot>{t("slot.whatItShows")}</Slot>}</dd>
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

            <Section id="objective" n={no("objective")} title={t("section.objective")}>
              <p className="cf-lead">{text("objective")}</p>
            </Section>

            <Section id="environment" n={no("environment")} title={t("section.environment")}>
              <p className="cf-text">{text("environment")}</p>
              <Tools tools={c.tools} />
            </Section>

            <Section id="workflow" n={no("workflow")} title={t("section.workflow")}>
              <CaseDiagram
                id={c.id}
                category={c.category}
                caption={text("diagram.caption")}
                stages={c.workflow.map((w) => ({ key: w, label: text(`workflow.${w}`) }))}
                lanes={
                  c.category === "network"
                    ? { client: text("diagram.client"), resolver: text("diagram.resolver"), server: text("diagram.server"), query: text("diagram.query"), response: text("diagram.response") }
                    : undefined
                }
              />
            </Section>

            <Section id="steps" n={no("steps")} title={t("section.steps")} tag={planned ? t("label.planned") : undefined}>
              <ol className="cf-steps">
                {c.steps.map((step, i) => (
                  <li key={step} className="cf-step">
                    <span aria-hidden="true" className="cf-step-no" dir="ltr">
                      S{i + 1}
                    </span>
                    <div className="cf-step-body">
                      <h3 className="cf-step-title">{text(`steps.${step}.title`)}</h3>
                      <details className="cf-detail">
                        <summary>{t("label.technical")}</summary>
                        <p>{text(`steps.${step}.detail`)}</p>
                      </details>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="checks" n={no("checks")} title={t("section.checks")}>
              <ul className="cf-checks">
                {c.checks.map((key) => (
                  <li key={key}>{text(`checks.${key}`)}</li>
                ))}
              </ul>
            </Section>

            <Section id="findings" n={no("findings")} title={t("section.findings")}>
              {c.findings.length ? (
                <ol className="cf-findings">
                  {c.findings.map((f) => (
                    <li key={f.key}>
                      <p>{text(`findings.${f.key}`)}</p>
                      <p className="cf-finding-refs">
                        <span>{t("label.findingRef")}</span>
                        {f.evidence.map((id) => (
                          <a key={id} href={`#cf-${id}`} dir="ltr">
                            {id}
                          </a>
                        ))}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <Slot>{t("slot.findings")}</Slot>
              )}
            </Section>

            <Section id="evidence" n={no("evidence")} title={t("section.evidence")}>
              <p className="cf-text">{t("slot.evidence")}</p>
              <EvidenceGallery items={galleryItems} emptySlots={emptySlots} labels={{ viewFull: t("label.viewFull"), close: t("label.close"), evidenceSlot: t("label.evidenceSlot") }} />
            </Section>

            {c.video ? (
              <Section id="video" n={no("video")} title={t("section.video")}>
                <figure className="cf-video-real">
                  <video controls preload="none" playsInline poster={c.video.poster} className="cf-video-el">
                    <source src={c.video.src} />
                    <track kind="captions" srcLang={locale} src={c.video.captions[locale]} label={t("section.video")} default />
                  </video>
                  <figcaption className="cf-text">{t("label.videoMeta")}</figcaption>
                </figure>
              </Section>
            ) : null}

            <Section id="lessons" n={no("lessons")} title={t("section.lessons")}>
              {has("lessons") ? <p className="cf-text cf-text--strong">{text("lessons")}</p> : <Slot>{t("slot.lessons")}</Slot>}
            </Section>

            <Section id="skills" n={no("skills")} title={t("section.skills")}>
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
            <Link href={`/case-files/${prev.slug}`} className="cf-pager-link" rel="prev">
              <span className="cf-pager-label">{t("label.previous")}</span>
              <span className="cf-pager-title">
                <span dir="ltr">{prev.number}</span> · {t(`items.${prev.id}.title`)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/case-files/${next.slug}`} className="cf-pager-link cf-pager-link--next" rel="next">
              <span className="cf-pager-label">{t("label.next")}</span>
              <span className="cf-pager-title">
                <span dir="ltr">{next.number}</span> · {t(`items.${next.id}.title`)}
              </span>
            </Link>
          ) : (
            <Link href="/case-files" className="cf-pager-link cf-pager-link--next">
              <span className="cf-pager-label">{t("kicker")}</span>
              <span className="cf-pager-title">{t("label.back")}</span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}

function Section({ id, n, title, tag, children }: { id: string; n: string; title: string; tag?: string; children: ReactNode }) {
  return (
    <section id={`cf-${id}`} aria-labelledby={`cf-${id}-h`} className="cf-section">
      <h2 id={`cf-${id}-h`} className="cf-section-title">
        <span aria-hidden="true" className="cf-section-no">
          {n}
        </span>
        {title}
        {tag ? <span className="cf-section-tag">{tag}</span> : null}
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
