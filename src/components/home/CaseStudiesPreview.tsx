import { getTranslations } from "next-intl/server";
import { ChapterRule } from "@/components/cc/ChapterRule";
import { LatticeGlyph } from "@/components/cc/LatticeGlyph";
import { PendingSlot } from "@/components/cc/PendingSlot";
import { SimLabel } from "@/components/cc/SimTag";
import { visibleProjects } from "@/content/projects";

/**
 * Case studies in preparation. Placeholders are filtered by the evidence model, so
 * on the public build this renders nothing until a case study is approved.
 */
export async function CaseStudiesPreview({ index }: { index: string }) {
  const h = await getTranslations("home");
  const p = await getTranslations("projects");
  const common = await getTranslations("common");
  if (!visibleProjects.length) return null;

  return (
    <section id="work" data-section aria-labelledby="work-title" className="home-chapter">
      <div className="site-wrap">
        <ChapterRule index={index}>{h("chapters.work")}</ChapterRule>
        <div className="home-head cc-rise">
          <h2 id="work-title" className="cc-title cc-display">
            {h("work.title")}
          </h2>
          <p className="cc-lead">{h("work.lead")}</p>
        </div>
        <ul className="home-work-grid">
          {visibleProjects.map((proj, i) => (
            <li key={proj.id}>
              <PendingSlot
                status={proj.status === "draft" ? common("draft") : `${common("pending")} · ${common("previewOnly")}`}
                title={p(`items.${proj.id}.title`)}
                summary={p(`items.${proj.id}.summary`)}
                neededLabel={common("evidenceNeeded")}
                needed={p(`items.${proj.id}.needed`)}
                tags={proj.simulated ? <SimLabel>{common("simulatedTraining")}</SimLabel> : null}
                glyph={<LatticeGlyph seed={i + 1} />}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
