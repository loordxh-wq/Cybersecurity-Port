import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { archivo } from "@/components/concepts/b/fonts";
import { Monolith } from "@/components/concepts/b/Monolith";
import "@/components/concepts/b/monolith.css";
import { MonolithNav } from "@/components/concepts/b/MonolithNav";
import { getConceptData } from "@/components/concepts/data";
import { PrototypeBadge } from "@/components/concepts/PrototypeBadge";
import { person } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type LocaleParams } from "@/lib/locale";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Concept B — Cybernetic Monolith.
 * Editorial black, graphite and chrome. A giant expanded name carries the page;
 * the monolith stands in front of it, cut by an electric-blue laser horizon.
 * Asymmetric, with deliberate negative space.
 */
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "concepts" });
  return { title: `${t("prototype", { letter: "B" })} · ${t("names.b")} | Eli Saad` };
}

export default async function ConceptB({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const d = await getConceptData();
  const isEn = locale === "en";

  const giant = (
    <span dir="ltr" className="block font-[family-name:var(--font-archivo)] font-extrabold leading-[0.8] tracking-[-0.03em] [font-stretch:125%]">
      <span className="cm-reveal cm-chrome block" style={step(0)}>
        ELI
      </span>
      <span className="cm-reveal cm-outline block" style={step(1)}>
        SAAD
      </span>
    </span>
  );

  return (
    <div className={`${archivo.variable} relative min-h-[100svh] overflow-hidden bg-[#060708] text-white`}>
      {/* Graphite light: one cold key light from above the monolith, a floor falloff and grain-free vignette. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_72%_30%,rgb(60_72_92/0.45),transparent_70%)] rtl:bg-[radial-gradient(ellipse_45%_60%_at_28%_30%,rgb(60_72_92/0.45),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgb(10_14_24/0.9))]" />
      </div>

      <MonolithNav
        name={d.name}
        items={d.nav.items}
        labels={{ primary: d.nav.primary, open: d.nav.open, close: d.nav.close, language: d.nav.language, index: d.labels.index }}
        localeNames={d.localeNames}
      />

      <main id="main" tabIndex={-1} className="relative outline-none">
        <section aria-labelledby="b-title" className="relative min-h-[calc(100svh-4rem)] px-5 pb-20 sm:px-[5vw] lg:min-h-[calc(100svh-5rem)]">
          {/* Giant name: the real h1 in English; a decorative Latin mark above the localized h1 in Hebrew and Arabic. */}
          <div className="relative z-0 flex min-h-[25rem] lg:min-h-0">
            {isEn ? (
              <h1 id="b-title" className="text-[25vw] lg:text-[16.5vw]">
                <span className="sr-only">{d.name}</span>
                <span aria-hidden="true">{giant}</span>
              </h1>
            ) : (
              <div aria-hidden="true" className="text-[25vw] lg:text-[16.5vw]">
                {giant}
              </div>
            )}
          </div>

          {/* Monolith in front of the name, laser horizon behind it. */}
          <div aria-hidden="true" className={`cm-laser absolute inset-x-0 top-[23.5rem] z-10 ${isEn ? "lg:top-[57%]" : "lg:top-[51%]"}`} />
          <p
            aria-hidden="true"
            dir="ltr"
            className={`absolute start-5 top-[22rem] z-10 font-mono text-xs tracking-[0.04em] text-[#7aa5ff] sm:start-auto sm:end-[5vw] sm:tracking-[0.2em] ${isEn ? "lg:top-[calc(57%-1.75rem)]" : "lg:top-[calc(51%-1.75rem)]"}`}
          >
            {d.csa.short} — {d.csa.issuer.toUpperCase()} — {d.csa.year}
          </p>
          <div className="absolute end-6 top-[7.5rem] z-20 lg:end-[21vw] lg:top-[6vh]">
            <Monolith portrait={person.portrait} alt={d.portraitAlt} engraving={d.csa.short} caption={`${d.csa.issuer} ${d.csa.year}`} />
          </div>

          <div className="relative z-30 mt-8 max-w-[34rem] lg:absolute lg:bottom-[9vh] lg:start-[5vw] lg:mt-0">
            {!isEn ? (
              <h1 id="b-title" className="mb-4 text-[2.6rem] font-bold leading-[1.1] tracking-tight lg:text-6xl [:lang(ar)_&]:leading-[1.3]">
                {d.name}
              </h1>
            ) : null}
            <p className="text-xl font-semibold text-white lg:text-2xl">{d.role}</p>
            <p className="mt-3 font-mono text-xs text-white/60" dir="auto">
              {d.focus.join("  /  ")}
            </p>
            <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-relaxed text-white/65">{d.tagline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className="group inline-flex min-h-13 items-center gap-6 bg-[#2257e6] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#1c48c4]"
              >
                {d.ctaContact}
                <span aria-hidden="true" className="font-mono transition-transform group-hover:translate-x-1 rtl:-scale-x-100">
                  →
                </span>
              </Link>
              <Link
                href="/certifications"
                className="inline-flex min-h-12 items-center border-b border-white/30 font-medium text-white/80 transition-colors hover:border-white hover:text-white"
              >
                {d.ctaCertifications}
              </Link>
            </div>
          </div>

          <p className="relative z-30 mt-10 flex items-center gap-3 text-sm text-white/55 lg:absolute lg:bottom-[9vh] lg:end-[5vw] lg:mt-0">
            <span aria-hidden="true" className="font-mono text-xs text-white/60">
              (01)
            </span>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
            {d.status}
          </p>
        </section>
        <PrototypeBadge letter="b" />
      </main>
    </div>
  );
}
