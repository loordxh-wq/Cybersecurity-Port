import { getTranslations } from "next-intl/server";
import { linkedin, publicCv, publicEmail, targetCities, targetRoles } from "@/content/facts";
import { ui } from "@/lib/ui";
import { CheckIcon, LinkedInIcon, PinIcon } from "./icons";
import { StatusChip } from "./StatusChip";

/** Hire-me panel. Used on the home page and the contact page. */
export async function OpenToWork({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const t = await getTranslations("openToWork");
  const tSocial = await getTranslations("social");
  const tHero = await getTranslations("hero");
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const SubHeading = headingLevel === 1 ? "h2" : "h3";
  const hasCv = Boolean(publicCv.en || publicCv.he || publicCv.ar);

  return (
    <section id="open-to-work" data-section aria-labelledby="otw-title" className="scroll-mt-24">
      <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <div
          aria-hidden="true"
          className="absolute -end-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(74_222_128/0.14),transparent)]"
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <StatusChip tone="ok" live>
              {tHero("status")}
            </StatusChip>
            <Heading id="otw-title" className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("title")}
            </Heading>
            <p className="measure mt-4 text-lg text-fg/90">{t("lead")}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className={ui.buttonPrimary}>
                <LinkedInIcon />
                {t("cta")}
                <span className="sr-only">({tSocial("newTab")})</span>
              </a>
              {publicEmail ? (
                <a href={`mailto:${publicEmail}`} className={ui.buttonSecondary} dir="ltr">
                  {publicEmail}
                </a>
              ) : null}
            </div>
            <p className="mt-4 text-sm text-fg-muted">{t("recruiterNote")}</p>
            {!hasCv ? <p className="mt-2 text-sm text-fg-muted">{t("cvPending")}</p> : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <SubHeading className="text-sm font-semibold text-fg-muted">{t("rolesTitle")}</SubHeading>
              <ul className="mt-3 space-y-2">
                {targetRoles.map((role) => (
                  <li key={role} className="flex items-start gap-3 rounded-xl border border-line bg-ink/40 px-4 py-3">
                    <CheckIcon className="mt-1 shrink-0 text-ice" />
                    <span dir="auto" className="font-medium text-fg">
                      {t(`roles.${role}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SubHeading className="text-sm font-semibold text-fg-muted">{t("locationTitle")}</SubHeading>
              <p className="mt-3 flex items-center gap-2 text-lg font-medium text-fg">
                <PinIcon className="text-ice" />
                {t("location")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {targetCities.map((city) => (
                  <li key={city} className="rounded-full border border-line px-3 py-1 text-sm text-fg-muted">
                    {t(`cities.${city}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
