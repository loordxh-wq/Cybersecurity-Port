import { getLocale, getTranslations } from "next-intl/server";
import { ChapterRule } from "@/components/cc/ChapterRule";
import { SignalLine, type SignalStop } from "@/components/cc/SignalLine";
import { credentials, linkedin, targetRoles, timeline } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";

const points = {
  cellcom: ["cellcom.p1", "cellcom.p2", "cellcom.p3"],
  cyberGain: ["cyberGain.p1", "cyberGain.p2", "cyberGain.p3", "cyberGain.p4"],
} as const;

/**
 * Chapter 03: Eli's real progression from IT support toward the SOC, as an
 * interactive signal line. Every stage comes from verified facts and messages.
 */
export async function CareerTrajectory({ index }: { index: string }) {
  const locale = (await getLocale()) as Locale;
  const h = await getTranslations("home");
  const tl = await getTranslations("timeline");
  const cert = await getTranslations("certifications");
  const otw = await getTranslations("openToWork");
  const social = await getTranslations("social");
  const csa = credentials.find((c) => c.id === "csa")!;
  const tools = (id: "cellcom" | "cyberGain") => timeline.find((e) => e.id === id)?.tools ?? [];

  const stops: SignalStop[] = [
    { id: "cellcom", kind: "experience", kindLabel: h("career.kind.experience"), title: tl("cellcom.role"), org: tl("cellcom.org") },
    { id: "cyberGain", kind: "training", kindLabel: h("career.kind.training"), title: tl("cyberGain.role"), org: tl("cyberGain.org") },
    { id: "csa", kind: "certification", kindLabel: h("career.kind.certification"), title: csa.title, org: csa.issuer },
    { id: "next", kind: "next", kindLabel: h("career.kind.next"), title: otw("roles.socTrainee") },
  ];

  const experiencePanel = (id: "cellcom" | "cyberGain") => (
    <div className="home-stage">
      <div>
        <p className="home-stage-kind">{id === "cellcom" ? h("career.kind.experience") : h("career.kind.training")}</p>
        <h3 className="home-stage-title">{tl(`${id}.role`)}</h3>
        <p className="home-stage-org">{tl(`${id}.org`)}</p>
      </div>
      <ul className="home-stage-points">
        {points[id].map((p) => (
          <li key={p}>{tl(p)}</li>
        ))}
      </ul>
      <div className="home-stage-tools">
        <p className="home-stage-kind">{tl("toolsLabel")}</p>
        <ul dir="ltr">
          {tools(id).map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const panels = [
    experiencePanel("cellcom"),
    experiencePanel("cyberGain"),
    <div key="csa" className="home-stage">
      <div>
        <p className="home-stage-kind">{h("career.kind.certification")}</p>
        <h3 className="home-stage-title">
          <bdi>{csa.title}</bdi>
        </h3>
        <p className="home-stage-org">
          <bdi>{csa.issuer}</bdi> · {cert("issued", { date: formatDate(locale, csa.date) })}
        </p>
      </div>
      <p className="home-stage-text">{cert("description.csa")}</p>
      <div className="home-stage-tools">
        <Link href="/certifications#csa" className="cc-textlink">
          {cert("view")}
          <span aria-hidden="true" className="cc-arrow">
            →
          </span>
        </Link>
      </div>
    </div>,
    <div key="next" className="home-stage">
      <div>
        <p className="home-stage-kind">{h("career.kind.next")}</p>
        <h3 className="home-stage-title">{otw("rolesTitle")}</h3>
        <p className="home-stage-org">{otw("location")}</p>
      </div>
      <div>
        <p className="home-stage-text">{h("career.nextBody")}</p>
        <ul className="home-stage-roles">
          {targetRoles.map((r) => (
            <li key={r}>{otw(`roles.${r}`)}</li>
          ))}
        </ul>
      </div>
      <div className="home-stage-tools">
        <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="cc-btn">
          <span>{otw("cta")}</span>
          <span aria-hidden="true" className="cc-arrow">
            →
          </span>
          <span className="sr-only">({social("newTab")})</span>
        </a>
      </div>
    </div>,
  ];

  return (
    <section id="career" data-section aria-labelledby="career-title" className="home-chapter home-career">
      <div className="site-wrap">
        <ChapterRule index={index}>{h("chapters.career")}</ChapterRule>
        <div className="home-head cc-rise">
          <h2 id="career-title" className="cc-title cc-display">
            {h("career.title")}
          </h2>
          <p className="cc-lead">{h("career.lead")}</p>
        </div>
        <SignalLine label={h("career.stagesLabel")} stops={stops} panels={panels} initial={2} progressTemplate={h("career.progress")} />
      </div>
    </section>
  );
}
