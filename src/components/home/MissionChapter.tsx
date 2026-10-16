import { getTranslations } from "next-intl/server";
import { ChapterRule } from "@/components/cc/ChapterRule";
import { Link } from "@/i18n/navigation";

/** Chapter 02: the mission statement, set editorially, with the key facts as readouts. */
export async function MissionChapter({ index }: { index: string }) {
  const t = await getTranslations("homeAbout");
  const h = await getTranslations("home");
  const otw = await getTranslations("openToWork");
  const about = await getTranslations("about");

  return (
    <section id="mission" data-section aria-labelledby="mission-title" className="home-chapter">
      <div className="site-wrap">
        <ChapterRule index={index}>{h("chapters.mission")}</ChapterRule>
        <div className="home-mission cc-rise">
          <h2 id="mission-title" className="cc-title cc-display home-mission-title">
            {t("title")}
          </h2>
          <div className="home-mission-body">
            <p className="cc-lead">{t("body")}</p>
            <Link href="/about" className="cc-textlink mt-6">
              {t("link")}
              <span aria-hidden="true" className="cc-arrow">
                →
              </span>
            </Link>
            <dl className="cc-readouts mt-10">
              <div>
                <dt>{otw("locationTitle")}</dt>
                <dd>{otw("location")}</dd>
              </div>
              <div>
                <dt>{about("languagesTitle")}</dt>
                <dd>
                  {about("languages.arabic")} · {about("languages.hebrew")} · {about("languages.english")}
                </dd>
              </div>
              <div>
                <dt>{otw("rolesTitle")}</dt>
                <dd>{otw("roles.socTrainee")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
