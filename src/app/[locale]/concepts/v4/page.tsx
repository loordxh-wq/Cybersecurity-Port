import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CommandNav } from "@/components/command/CommandNav";
import { CommandScene } from "@/components/command/CommandScene";
import "@/components/command/command.css";
import { archivo } from "@/components/concepts/b/fonts";
import { getConceptData } from "@/components/concepts/data";
import { PrototypeBadge } from "@/components/concepts/PrototypeBadge";
import { person, socials } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type LocaleParams } from "@/lib/locale";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Prototype V4 — Cyber Command.
 * Zone A (identity) and Zone B (a simulated intelligence scene) share one axis:
 * the core's equator continues as a signal horizon that runs between the two
 * lines of Eli's name. Below, the first chapter shows how the next section opens.
 */
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "concepts" });
  return { title: `${t("prototype", { letter: "V4" })} · ${t("names.v4")} | Eli Saad` };
}

export default async function ConceptV4({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const d = await getConceptData();
  const v4 = await getTranslations("concepts.v4");
  const about = await getTranslations("homeAbout");
  const social = await getTranslations("social");
  const hero = await getTranslations("hero");
  const isEn = locale === "en";

  // Two lines in every language: the horizon runs between them.
  const words = isEn ? ["ELI", "SAAD"] : d.name.split(/\s+/);
  const lines = words.length > 1 ? [words[0]!, words.slice(1).join(" ")] : [d.name];

  const stops = [
    { kind: "experience", label: d.labels.experience, role: d.path[0]!.role, org: d.path[0]!.org },
    { kind: "training", label: d.labels.training, role: d.path[1]!.role, org: d.path[1]!.org },
    { kind: "credential", label: d.labels.credential, role: d.path[2]!.role, org: d.path[2]!.org },
    { kind: "next", label: d.labels.next, role: d.nextRole, org: null },
  ] as const;

  return (
    <div className={`${archivo.variable} cc-root relative min-h-[100svh]`}>
      <CommandNav
        name={d.name}
        items={d.nav.items}
        labels={{ primary: d.nav.primary, open: d.nav.open, close: d.nav.close, language: d.nav.language, menu: v4("menu") }}
        localeNames={d.localeNames}
      />

      <main id="main" tabIndex={-1} className="relative outline-none">
        <section aria-labelledby="v4-title" className="cc-hero">
          <CommandScene portrait={person.portrait} alt={d.portraitAlt} simulatedLabel={v4("simulated")} />
          <div aria-hidden="true" className="cc-horizon" />

          <div className="cc-identity">
            <div className="cc-upper">
              <p className="cc-kicker cc-in" style={step(0)}>
                <span aria-hidden="true" className="cc-dot" />
                {d.status}
              </p>
              {!isEn ? (
                <p aria-hidden="true" dir="ltr" className="cc-latin cc-in hidden lg:block" style={step(1)}>
                  ELI SAAD
                </p>
              ) : null}
            </div>

            <h1 id="v4-title" className="cc-name cc-display" data-scan-sync>
              {isEn ? <span className="sr-only">{d.name}</span> : null}
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
                {d.role}
              </p>
              <p className="cc-focus cc-in" style={step(3)} dir="auto">
                {d.focus.join("  /  ")}
              </p>
              <p className="cc-tagline cc-in" style={step(4)}>
                {d.tagline}
              </p>
              <div className="cc-actions cc-in" style={step(5)}>
                <Link href="/contact" className="cc-cta">
                  <span>{d.ctaContact}</span>
                  <span aria-hidden="true" className="cc-cta-arrow">
                    →
                  </span>
                </Link>
                <Link href="/certifications" className="cc-link">
                  {d.ctaCertifications}
                </Link>
              </div>
              <ul className="cc-socials cc-in" style={step(6)} aria-label={hero("socialLabel")}>
                {socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social("profileOn", { network: social(s.id) })} (${social("newTab")})`}
                    >
                      {social(s.id)}
                      <span aria-hidden="true" className="rtl:-scale-x-100">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="cc-legend" aria-label={v4("simulated")}>
            <li>
              <span aria-hidden="true" className="cc-glyph-node" />
              {v4("legendNodes")}
            </li>
            <li>
              <span aria-hidden="true" className="cc-glyph-link" />
              {v4("legendLinks")}
            </li>
            <li>
              <span aria-hidden="true" className="cc-glyph-scan" />
              {v4("legendScan")}
            </li>
          </ul>
          <a href="#v4-mission-title" className="cc-scroll">
            <span aria-hidden="true" className="cc-scroll-line" />
            {v4("scroll")}
          </a>
        </section>

        {/* Next chapter: how the story continues once the scene recedes. */}
        <section aria-labelledby="v4-mission-title" className="v4-next">
          <div className="mx-auto max-w-[90rem]">
            <p className="v4-chapter">
              <span aria-hidden="true">02</span>
              <span>{v4("chapterMission")}</span>
              <span aria-hidden="true" className="v4-chapter-rule" />
            </p>
            <div className="v4-next-grid v4-next-reveal">
              <h2 id="v4-mission-title" className="v4-next-title cc-display">
                {about("title")}
              </h2>
              <div className="v4-next-body">
                <p className="measure text-[1.0625rem] leading-relaxed text-white/72">{about("body")}</p>
                <Link href="/about" className="cc-link mt-6">
                  {about("link")}
                </Link>
              </div>
            </div>

            <h3 className="v4-chapter mt-16 lg:mt-24">
              <span aria-hidden="true">03</span>
              <span>{v4("chapterCareer")}</span>
              <span aria-hidden="true" className="v4-chapter-rule" />
            </h3>
            <ol className="v4-signal">
              {stops.map((s) => (
                <li key={s.kind} className="v4-stop" data-kind={s.kind}>
                  <p className="v4-stop-label">{s.label}</p>
                  <p className="mt-2 font-semibold leading-snug text-white">
                    <bdi>{s.role}</bdi>
                  </p>
                  {s.org ? (
                    <p className="mt-1 text-sm text-white/62">
                      <bdi>{s.org}</bdi>
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
        <PrototypeBadge letter="v4" inline />
      </main>
    </div>
  );
}
