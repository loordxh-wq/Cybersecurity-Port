import { getTranslations } from "next-intl/server";
import { ChapterRule } from "@/components/cc/ChapterRule";
import { linkedin, targetRoles } from "@/content/facts";

/**
 * Final chapter: Open to Work as a full-bleed horizon band. A perspective grid
 * floor and the signal horizon converge on LinkedIn. The CV request chapter that
 * follows carries the phone contact. No email or form until Eli approves one.
 */
export async function OpenToWorkBand({ index }: { index: string }) {
  const t = await getTranslations("openToWork");
  const about = await getTranslations("about");
  const social = await getTranslations("social");
  const cv = await getTranslations("cv");

  return (
    <section id="open-to-work" data-section aria-labelledby="otw-band-title" className="home-band">
      <div aria-hidden="true" className="home-band-floor" />
      <div aria-hidden="true" className="home-band-horizon">
        <span />
        <span />
        <span />
      </div>
      <div className="site-wrap relative">
        <ChapterRule index={index} as="h2" id="otw-band-title">
          {t("title")}
        </ChapterRule>
        <div className="home-band-grid">
          <div className="cc-rise">
            <p className="home-band-statement cc-display">{t("lead")}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="cc-btn home-band-cta">
                <span>{t("cta")}</span>
                <span aria-hidden="true" className="cc-arrow">
                  →
                </span>
                <span className="sr-only">({social("newTab")})</span>
              </a>
              <a href="#cv" className="cc-textlink">
                {cv("cta")}
                <span aria-hidden="true" className="cc-arrow">
                  →
                </span>
              </a>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/68">
              {t("recruiterNote")}
            </p>
          </div>
          <dl className="cc-readouts home-band-readouts">
            <div>
              <dt>{t("rolesTitle")}</dt>
              <dd>
                <ul className="home-band-roles">
                  {targetRoles.map((r) => (
                    <li key={r}>{t(`roles.${r}`)}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>{t("locationTitle")}</dt>
              <dd>
                {t("location")}
                <span className="block text-sm text-white/62">{t("locationDetail")}</span>
              </dd>
            </div>
            <div>
              <dt>{about("languagesTitle")}</dt>
              <dd>
                {about("languages.arabic")} ({about("languages.native")}) · {about("languages.hebrew")} · {about("languages.english")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
