import { getTranslations } from "next-intl/server";
import { linkedin, publicCv, publicEmail, targetCities, targetRoles } from "@/content/facts";
import { ui } from "@/lib/ui";
import { ArrowIcon, CheckIcon, InfoIcon, LinkedInIcon, PinIcon } from "./icons";
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
    <section id="open-to-work" data-section aria-labelledby="otw-title" className="reveal scroll-mt-24">
      <div className="panel edge relative overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-12">
        {/* Accent glows and a faint grid in the panel corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-32 -top-32 size-96 rounded-full bg-[radial-gradient(closest-side,rgb(74_222_128/0.13),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -start-24 size-96 rounded-full bg-[radial-gradient(closest-side,rgb(139_124_255/0.14),transparent)]"
        />
        <div
          aria-hidden="true"
          className="grid-faint pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_50%_60%_at_100%_0%,#000,transparent)] rtl:[mask-image:radial-gradient(ellipse_50%_60%_at_0%_0%,#000,transparent)]"
        />

        <div className="relative grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="flex flex-col">
            <StatusChip tone="ok" live className="self-start">
              {tHero("status")}
            </StatusChip>
            <Heading
              id="otw-title"
              className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl"
            >
              <span className="text-gradient inline-block">{t("title")}</span>
            </Heading>
            <p className="measure mt-5 text-lg leading-relaxed text-fg/90 sm:text-xl">{t("lead")}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ui.buttonPrimary} min-h-14 w-full px-7 text-[1.05rem] sm:w-auto`}
              >
                <LinkedInIcon />
                {t("cta")}
                <ArrowIcon className="flip-rtl" width={18} height={18} />
                <span className="sr-only">({tSocial("newTab")})</span>
              </a>
              {publicEmail ? (
                <a href={`mailto:${publicEmail}`} className={ui.buttonSecondary} dir="ltr">
                  {publicEmail}
                </a>
              ) : null}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-ink/40 px-4 py-3 text-sm text-fg-muted">
              <InfoIcon className="mt-0.5 shrink-0 text-ice" width={18} height={18} />
              <div className="space-y-1">
                <p>{t("recruiterNote")}</p>
                {!hasCv ? <p>{t("cvPending")}</p> : null}
              </div>
            </div>
          </div>

          <div className="grid content-start gap-8">
            <div>
              <SubHeading className="text-sm font-semibold text-fg-muted">{t("rolesTitle")}</SubHeading>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {targetRoles.map((role, i) => (
                  <li
                    key={role}
                    className="group relative flex items-start gap-3 rounded-2xl border border-line bg-gradient-to-b from-raised/50 to-deep/70 px-4 py-4 transition-colors hover:border-ice/40"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-ice/30 bg-ice/10 text-ice">
                      <CheckIcon width={16} height={16} />
                    </span>
                    <span dir="auto" className="flex-1 pt-1 font-semibold leading-snug text-fg">
                      {t(`roles.${role}`)}
                    </span>
                    <span aria-hidden="true" className="pt-1.5 font-mono text-[0.7rem] text-fg-muted/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-ink/40 p-5">
              <SubHeading className="text-sm font-semibold text-fg-muted">{t("locationTitle")}</SubHeading>
              <p className="mt-3 flex items-center gap-2.5 text-xl font-semibold text-fg">
                <PinIcon className="text-ice" />
                {t("location")}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {targetCities.map((city) => (
                  <li key={city} className="rounded-full border border-line-strong bg-deep/60 px-3.5 py-1 text-sm text-fg/80">
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
