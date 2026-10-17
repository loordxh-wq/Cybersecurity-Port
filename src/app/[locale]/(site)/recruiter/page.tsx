import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CvRequestDialog } from "@/components/cv/CvRequestDialog";
import { getCvDialogLabels } from "@/components/cv/labels";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { BriefActions } from "@/components/recruiter/BriefActions";
import "@/components/recruiter/recruiter.css";
import { credentials, linkedin, targetRoles, timeline } from "@/content/facts";
import { visibleProjects } from "@/content/projects";
import { skills } from "@/content/skills";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { localizedUrl, pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "recruiter");
}

const points = {
  cellcom: ["cellcom.p1", "cellcom.p2", "cellcom.p3"],
  cyberGain: ["cyberGain.p1", "cyberGain.p2", "cyberGain.p3", "cyberGain.p4"],
} as const;

/** One fact group: mono index and label, then content. Calm, no motion. */
function Block({ index, id, title, children }: { index: string; id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="rb-block">
      <h2 id={id} className="rb-block-title">
        <span aria-hidden="true" className="rb-index">
          {index}
        </span>
        {title}
      </h2>
      <div className="rb-block-body">{children}</div>
    </section>
  );
}

/**
 * Recruiter brief: the calm, editorial counterpart to the cinematic home page.
 * Everything a recruiter needs, in the order they need it, readable in 30 seconds
 * and printable on one A4 page. Built only from verified facts and approved items.
 * No WebGL, no animated backgrounds; the phone number lives only in the CV dialog.
 */
export default async function RecruiterPage({ params }: LocaleParams) {
  const locale = (await resolveLocale(params)) as Locale;
  setRequestLocale(locale);
  const r = await getTranslations("recruiter");
  const hero = await getTranslations("hero");
  const tl = await getTranslations("timeline");
  const otw = await getTranslations("openToWork");
  const about = await getTranslations("about");
  const cert = await getTranslations("certifications");
  const homeCred = await getTranslations("homeCredentials");
  const social = await getTranslations("social");
  const nav = await getTranslations("nav");
  const p = await getTranslations("projects");
  const common = await getTranslations("common");
  const cvLabels = await getCvDialogLabels();
  const isEn = locale === "en";
  const period = (id: "cellcom" | "cyberGain") => timeline.find((e) => e.id === id)?.period ?? "";
  const tools = timeline.find((e) => e.id === "cyberGain")?.tools ?? [];
  const approvedProjects = visibleProjects.filter((pr) => pr.status === "approved");
  const linkedinText = linkedin.href.replace(/^https?:\/\/(www\.)?/, "");
  let n = 0;
  const idx = () => String(++n).padStart(2, "0");

  return (
    <div className="rb">
      <PersonJsonLd url={localizedUrl(locale, "/recruiter")} />
      <article className="rb-wrap" aria-labelledby="rb-title">
        <header className="rb-head">
          <span aria-hidden="true" className="rb-ticks" />
          <p className="rb-kicker">
            <span aria-hidden="true" className="rb-kicker-node" />
            {r("kicker")}
          </p>
          <h1 id="rb-title" className="rb-name cc-display">
            {hero("name")}
          </h1>
          {!isEn ? (
            <p className="rb-latin" lang="en" dir="ltr">
              Eli Saad
            </p>
          ) : null}
          <p className="rb-role">{hero("role")}</p>
          <p className="rb-status">
            <span aria-hidden="true" className="rb-dot" />
            {hero("status")}
          </p>
          <dl className="rb-facts">
            <div>
              <dt>{otw("locationTitle")}</dt>
              <dd>{otw("locationDetail")}</dd>
            </div>
            <div>
              <dt>{about("languagesTitle")}</dt>
              <dd>
                {about("languages.arabic")} ({about("languages.native")}) · {about("languages.hebrew")} · {about("languages.english")}
              </dd>
            </div>
          </dl>
          <p className="rb-intro">{r("intro")}</p>
        </header>

        <div className="rb-layout">
          <div className="rb-main">
            <Block index={idx()} id="rb-direction" title={r("direction")}>
              <p className="rb-lead">{r("directionBody")}</p>
              <ul className="rb-roles">
                {targetRoles.map((role) => (
                  <li key={role}>{otw(`roles.${role}`)}</li>
                ))}
              </ul>
            </Block>

            <Block index={idx()} id="rb-experience" title={r("experience")}>
              <h3 className="rb-item-title">{tl("cellcom.role")}</h3>
              <p className="rb-item-meta">
                {tl("cellcom.org")} · <span dir="ltr">{period("cellcom")}</span> · {r("evidence.employment")}
              </p>
              <ul className="rb-points">
                {points.cellcom.map((k) => (
                  <li key={k}>{tl(k)}</li>
                ))}
              </ul>
            </Block>

            <Block index={idx()} id="rb-training" title={r("training")}>
              <h3 className="rb-item-title">{tl("cyberGain.role")}</h3>
              <p className="rb-item-meta">
                {tl("cyberGain.org")} · <span dir="ltr">{period("cyberGain")}</span> · {r("evidence.course")}
              </p>
              <ul className="rb-points">
                {points.cyberGain.map((k) => (
                  <li key={k}>{tl(k)}</li>
                ))}
              </ul>
              <p className="rb-tools-line">
                <span className="rb-label">{tl("toolsLabel")}</span>
                <span dir="ltr">{tools.join(" · ")}</span>
              </p>
            </Block>

            <Block index={idx()} id="rb-credentials" title={r("credentials")}>
              <ul className="rb-creds">
                {credentials.map((c) => {
                  const date = formatDate(locale, c.date);
                  const isCert = c.kind === "certification";
                  return (
                    <li key={c.id} data-kind={c.kind}>
                      <span className="rb-cred-kind">{cert(`kind.${c.kind}`)}</span>
                      <span className="rb-cred-title">
                        <bdi>{c.title}</bdi>
                      </span>
                      <span className="rb-cred-meta">
                        <bdi>{c.issuer}</bdi> · {isCert ? r("issued", { date }) : r("completed", { date })}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Link href="/certifications" className="rb-more">
                {homeCred("link")}
                <span aria-hidden="true" className="cc-arrow">
                  →
                </span>
              </Link>
            </Block>

            <Block index={idx()} id="rb-skills" title={r("skills")}>
              <p className="rb-note">{r("skillsNote")}</p>
              <ul className="rb-skills">
                {skills.map((s) => (
                  <li key={s.id}>
                    <span className="rb-skill-title">{r(`skill.${s.id}.title`)}</span>
                    <span className="rb-skill-evidence">
                      {s.evidence.map((e) => (
                        <span key={e} className="rb-evidence" data-type={e}>
                          {r(`evidence.${e}`)}
                        </span>
                      ))}
                    </span>
                    <span className="rb-skill-detail">{r(`skill.${s.id}.detail`)}</span>
                  </li>
                ))}
              </ul>
              <p className="rb-legend">{r("evidenceLegend")}</p>
            </Block>

            {approvedProjects.length ? (
              <Block index={idx()} id="rb-projects" title={r("projects")}>
                <ul className="rb-projects">
                  {approvedProjects.map((pr) => (
                    <li key={pr.id}>
                      <span className="rb-skill-title">{p(`items.${pr.id}.title`)}</span>
                      {pr.simulated ? (
                        <span className="rb-sim">{common("simulatedTraining")}</span>
                      ) : pr.kind === "lab" ? (
                        <span className="rb-sim rb-lab">{common("personalLab")}</span>
                      ) : null}
                      <span className="rb-skill-detail">{p(`items.${pr.id}.summary`)}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            ) : null}
          </div>

          <aside className="rb-aside" aria-labelledby="rb-contact">
            <div className="rb-aside-inner">
              <h2 id="rb-contact" className="rb-block-title">
                <span aria-hidden="true" className="rb-index">
                  {idx()}
                </span>
                {r("contact")}
              </h2>
              <div className="rb-contact-actions">
                <CvRequestDialog labels={cvLabels} triggerClassName="cc-btn rb-cv" showArrow={false} />
                <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="rb-linkedin">
                  {social("linkedin")}
                  <span aria-hidden="true" className="cmd-socials-arrow">
                    ↗
                  </span>
                  <span className="sr-only">({social("newTab")})</span>
                </a>
              </div>
              <p className="rb-contact-note">{r("contactNote")}</p>
              <ul className="rb-contact-links">
                <li>
                  <Link href="/contact">{r("openToWorkPage")}</Link>
                </li>
                <li>
                  <Link href="/certifications">{nav("certifications")}</Link>
                </li>
              </ul>
              <BriefActions labels={{ copy: r("copyLink"), copied: r("linkCopied"), failed: r("linkCopyFailed"), print: r("print") }} />
            </div>
          </aside>
        </div>

        {/* Print only: the contact line on paper. No phone number, no CV. */}
        <p className="rb-print-foot">
          {r("printNote")} <span dir="ltr">LinkedIn: {linkedinText}</span>
        </p>
      </article>

      <aside className="rb-bar" aria-label={r("contactBar")}>
        <CvRequestDialog labels={cvLabels} triggerClassName="cc-btn rb-bar-cv" showArrow={false} />
        <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="rb-bar-link">
          {social("linkedin")}
          <span className="sr-only">({social("newTab")})</span>
        </a>
      </aside>
    </div>
  );
}
