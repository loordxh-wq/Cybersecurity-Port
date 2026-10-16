import type { CSSProperties } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { CommandScene } from "@/components/command/CommandScene";
import { TextSocialLinks } from "@/components/site/TextSocialLinks";
import { person } from "@/content/facts";
import { Link } from "@/i18n/navigation";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Chapter 01, identity: the approved Cyber Command V4.1 hero.
 * Zone A (identity) and Zone B (simulated intelligence scene) share one axis: the
 * core's equator continues as the signal horizon between the two lines of the name.
 */
export async function CommandHero() {
  const locale = await getLocale();
  const t = await getTranslations("hero");
  const h = await getTranslations("home");
  const isEn = locale === "en";
  const name = t("name");
  const words = isEn ? ["ELI", "SAAD"] : name.split(/\s+/);
  const lines = words.length > 1 ? [words[0]!, words.slice(1).join(" ")] : [name];
  const focus = t("focus")
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section id="identity" data-section aria-labelledby="hero-title" className="cc-hero home-hero">
      <CommandScene portrait={person.portrait} alt={t("portraitAlt")} simulatedLabel={h("sceneSimulated")} />
      <div aria-hidden="true" className="cc-horizon" />

      <div className="cc-identity">
        <div className="cc-upper">
          <p className="cc-kicker cc-in" style={step(0)}>
            <span aria-hidden="true" className="cc-dot" />
            {t("status")}
          </p>
          {!isEn ? (
            <p aria-hidden="true" dir="ltr" className="cc-latin cc-in hidden lg:block" style={step(1)}>
              ELI SAAD
            </p>
          ) : null}
        </div>

        <h1 id="hero-title" className="cc-name cc-display" data-scan-sync>
          {isEn ? <span className="sr-only">{name}</span> : null}
          <span className="cc-name-ink" aria-hidden={isEn ? true : undefined} dir={isEn ? "ltr" : undefined}>
            {lines.map((line, i) => (
              <span key={line} className="cc-name-line" style={step(i)}>
                {line}
              </span>
            ))}
          </span>
        </h1>

        <div className="cc-lower">
          <p className="cc-role cc-in" style={step(2)}>
            {t("role")}
          </p>
          <p className="cc-focus cc-in" style={step(3)} dir="auto">
            {focus.join("  /  ")}
          </p>
          <p className="cc-tagline cc-in" style={step(4)}>
            {t("tagline")}
          </p>
          <div className="cc-actions cc-in" style={step(5)}>
            <Link href="/contact" className="cc-cta">
              <span>{t("ctaContact")}</span>
              <span aria-hidden="true" className="cc-cta-arrow">
                →
              </span>
            </Link>
            <Link href="/certifications" className="cc-link">
              {t("ctaCertifications")}
            </Link>
          </div>
          <TextSocialLinks label={t("socialLabel")} className="cc-socials" />
        </div>
      </div>

      <ul className="cc-legend" aria-label={h("sceneSimulated")}>
        <li>
          <span aria-hidden="true" className="cc-glyph-node" />
          {h("legend.nodes")}
        </li>
        <li>
          <span aria-hidden="true" className="cc-glyph-link" />
          {h("legend.links")}
        </li>
        <li>
          <span aria-hidden="true" className="cc-glyph-scan" />
          {h("legend.scan")}
        </li>
      </ul>
      <a href="#mission" className="cc-scroll">
        <span aria-hidden="true" className="cc-scroll-line" />
        {h("scroll")}
      </a>
    </section>
  );
}
