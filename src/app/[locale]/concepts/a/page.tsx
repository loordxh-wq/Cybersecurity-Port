import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ObservatoryCore } from "@/components/concepts/a/ObservatoryCore";
import { ObservatoryNav } from "@/components/concepts/a/ObservatoryNav";
import { getConceptData } from "@/components/concepts/data";
import { PrototypeBadge } from "@/components/concepts/PrototypeBadge";
import { person } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type LocaleParams } from "@/lib/locale";

/**
 * Concept A — Threat Observatory.
 * A deep-space security observatory: the 3D intelligence core dominates the
 * composition, Eli sits at its centre, and the identity reads beside it like a
 * mission caption. Below, three true facts as instrument readouts.
 */
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "concepts" });
  return { title: `${t("prototype", { letter: "A" })} · ${t("names.a")} | Eli Saad` };
}

export default async function ConceptA({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const d = await getConceptData();

  const readouts = [
    { label: d.labels.credential, value: d.csa.title, sub: `${d.csa.issuer} · ${d.csa.year}` },
    { label: d.labels.training, value: d.path[1]!.role, sub: d.path[1]!.org },
    { label: d.labels.experience, value: d.path[0]!.role, sub: d.path[0]!.org },
  ];

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#030712] text-white">
      {/* Atmosphere: deep-space falloff, a planetary horizon and a soft light column behind the core. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_70%_42%,rgb(29_58_138/0.55),transparent_70%)] rtl:bg-[radial-gradient(ellipse_60%_55%_at_30%_42%,rgb(29_58_138/0.55),transparent_70%)] max-lg:bg-[radial-gradient(ellipse_90%_45%_at_50%_26%,rgb(29_58_138/0.6),transparent_70%)]" />
        <div className="absolute -bottom-[62vw] left-1/2 h-[80vw] w-[160vw] -translate-x-1/2 rounded-[50%] border-t border-cyan-200/25 bg-[radial-gradient(ellipse_at_50%_0%,rgb(47_107_255/0.28),transparent_60%)] shadow-[0_-30px_120px_-20px_rgb(66_213_246/0.35)] lg:-bottom-[64vw]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_40%,transparent_60%,rgb(0_0_0/0.6))]" />
      </div>

      <ObservatoryNav
        name={d.name}
        items={d.nav.items}
        labels={{ primary: d.nav.primary, open: d.nav.open, close: d.nav.close, language: d.nav.language }}
        localeNames={d.localeNames}
        contactLabel={d.nav.items[3].label}
      />

      <main id="main" tabIndex={-1} className="relative z-10 flex flex-1 flex-col outline-none">
        <section
          aria-labelledby="a-title"
          className="mx-auto grid w-full max-w-[90rem] flex-1 items-center px-5 pb-10 sm:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:pb-4"
        >
          <div className="relative order-1 mx-auto -mt-4 w-full max-w-[23rem] lg:order-2 lg:-my-10 lg:max-w-[44rem]">
            <ObservatoryCore portrait={person.portrait} alt={d.portraitAlt} />
          </div>

          <div className="order-2 -mt-6 lg:order-1 lg:mt-0">
            <p className="inline-flex items-center gap-2.5 text-[0.8rem] text-cyan-100/80">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-emerald-400" />
              </span>
              {d.status}
            </p>
            <h1
              id="a-title"
              className="mt-4 bg-gradient-to-b from-white via-white to-cyan-200/80 bg-clip-text pb-[0.12em] text-[clamp(3.1rem,13vw,6.6rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-transparent [:lang(ar)_&]:pb-[0.35em]"
            >
              {d.name}
            </h1>
            <p className="mt-3 text-lg font-medium text-white/90 sm:text-[1.35rem]">{d.role}</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
              {d.focus.map((f, i) => (
                <li key={f} className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className={`size-1 rounded-full ${i === 1 ? "bg-violet-300" : "bg-cyan-300"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-white/70 sm:text-lg">{d.tagline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/contact"
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-7 font-semibold text-[#030712] shadow-[0_0_40px_-8px_rgb(165_235_251/0.7)] transition-shadow hover:shadow-[0_0_60px_-6px_rgb(165_235_251/0.95)]"
              >
                {d.ctaContact}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/certifications"
                className="inline-flex min-h-12 items-center text-[0.95rem] font-medium text-white/80 underline decoration-white/25 underline-offset-[7px] transition-colors hover:text-white hover:decoration-cyan-200"
              >
                {d.ctaCertifications}
              </Link>
            </div>
          </div>
        </section>

        {/* Instrument readouts: three verified facts, separated by hairlines rather than boxed. */}
        <dl className="mx-auto grid w-full max-w-[90rem] gap-0 border-t border-white/10 px-5 pb-16 sm:px-10 lg:grid-cols-3 lg:pb-0">
          {readouts.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-baseline gap-4 py-4 lg:block lg:py-7 ${i > 0 ? "border-t border-white/10 lg:border-s lg:border-t-0 lg:ps-8" : ""}`}
            >
              <dt className="w-24 shrink-0 font-mono text-xs text-cyan-200/75 lg:w-auto">{r.label}</dt>
              <dd className="min-w-0 lg:mt-2">
                <span className="block font-medium leading-snug text-white/90">
                  <bdi>{r.value}</bdi>
                </span>
                <span className="block text-sm text-white/60">
                  <bdi>{r.sub}</bdi>
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <PrototypeBadge letter="a" />
      </main>
    </div>
  );
}
