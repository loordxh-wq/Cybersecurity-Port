import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getConceptData } from "@/components/concepts/data";
import { Exhibit } from "@/components/concepts/c/Exhibit";
import "@/components/concepts/c/forensics.css";
import { ForensicsNav } from "@/components/concepts/c/ForensicsNav";
import { PrototypeBadge } from "@/components/concepts/PrototypeBadge";
import { person } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type LocaleParams } from "@/lib/locale";

/**
 * Concept C — Digital Forensics.
 * The hero is a case file: identity on one side, Eli's photo as Exhibit A with
 * factual annotations, and his real career path as a network trace underneath.
 */
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "concepts" });
  return { title: `${t("prototype", { letter: "C" })} · ${t("names.c")} | Eli Saad` };
}

export default async function ConceptC({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const d = await getConceptData();

  const annotations = [
    { k: d.labels.profile, v: d.name },
    { k: d.labels.discipline, v: d.role },
    { k: d.labels.status, v: d.status },
    { k: d.labels.credential, v: `${d.csa.short} · ${d.csa.issuer} · ${d.csa.year}` },
  ];
  const trace = [
    ...d.path.map((p) => ({ ...p, next: false })),
    { role: d.nextRole, org: d.labels.next, period: "→", next: true },
  ];

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#0a0a0d] text-[#f2efe8]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_62%_40%,rgb(109_77_255/0.16),transparent_70%)] rtl:bg-[radial-gradient(ellipse_50%_55%_at_38%_40%,rgb(109_77_255/0.16),transparent_70%)]" />
        <div className="df-grain absolute inset-0" />
      </div>

      <ForensicsNav
        name={d.name}
        caseFile={d.labels.caseFile}
        index={d.labels.index}
        items={d.nav.items}
        labels={{ primary: d.nav.primary, open: d.nav.open, close: d.nav.close, language: d.nav.language }}
        localeNames={d.localeNames}
      />

      <main id="main" tabIndex={-1} className="relative outline-none">
        <section aria-labelledby="c-title" className="mx-auto max-w-[88rem] px-5 pb-20 pt-7 sm:px-10 lg:pt-12">
          {/*
            One grid, two compositions. Phone: name and exhibit share the opening row, the rest follows.
            Desktop: identity | exhibit | annotations across twelve columns.
          */}
          <div className="grid grid-cols-[minmax(0,1fr)_8.5rem] gap-x-5 gap-y-7 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-center lg:gap-x-8 lg:gap-y-0">
            <div className="self-center lg:col-span-5 lg:row-start-1 lg:self-end">
              <p className="font-mono text-xs text-[#ffb547]">
                {d.labels.caseFile} — {d.labels.exhibit}
              </p>
              <h1 id="c-title" className="mt-3 text-[clamp(2.7rem,11vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em] lg:mt-4 [:lang(ar)_&]:leading-[1.2]">
                {d.name}
              </h1>
            </div>

            <div className="row-span-1 self-start pt-1 lg:col-span-4 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center lg:px-4 lg:pt-0">
              <div className="-rotate-[2deg] rtl:rotate-[2deg] lg:-rotate-[1.2deg] rtl:lg:rotate-[1.2deg]">
                <Exhibit portrait={person.portrait} alt={d.portraitAlt} label={d.labels.exhibit} />
              </div>
            </div>

            <div className="col-span-2 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-5">
              <p className="text-lg font-medium text-[#d9d0ff] sm:text-xl">{d.role}</p>
              <ul className="mt-4 flex flex-wrap gap-2 font-mono text-xs text-[#f2efe8]/60">
                {d.focus.map((f) => (
                  <li key={f} className="border border-[#f2efe8]/15 px-2 py-1">
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-[32rem] text-[1.05rem] leading-relaxed text-[#f2efe8]/70">{d.tagline}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link
                  href="/contact"
                  className="group inline-flex min-h-12 items-center gap-4 bg-[#ffb547] px-6 font-semibold text-[#0a0a0d] transition-colors hover:bg-[#ffc670]"
                >
                  {d.ctaContact}
                  <span aria-hidden="true" className="font-mono rtl:-scale-x-100">
                    →
                  </span>
                </Link>
                <Link
                  href="/certifications"
                  className="inline-flex min-h-12 items-center font-medium text-[#f2efe8]/80 underline decoration-[#a48bff]/60 underline-offset-[7px] hover:text-[#f2efe8]"
                >
                  {d.ctaCertifications}
                </Link>
              </div>
            </div>

            <dl className="col-span-2 grid grid-cols-2 gap-x-5 gap-y-5 border-t border-[#f2efe8]/10 pt-6 lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-1 lg:grid-cols-1 lg:gap-y-6 lg:self-center lg:border-t-0 lg:pt-0">
              {annotations.map((a) => (
                <div key={a.k} className="relative lg:ps-12">
                  <span aria-hidden="true" className="absolute start-0 top-2.5 hidden h-px w-9 bg-[#a48bff]/50 lg:block" />
                  <span aria-hidden="true" className="absolute start-0 top-[7px] hidden size-[7px] -translate-x-1/2 rounded-full bg-[#a48bff] rtl:translate-x-1/2 lg:block" />
                  <dt className="font-mono text-xs text-[#a48bff]">{a.k}</dt>
                  <dd className="mt-1 text-[0.95rem] font-medium leading-snug text-[#f2efe8]/90">
                    <bdi>{a.v}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Career trace */}
          <div className="mt-14 border-t border-[#f2efe8]/10 pt-8 lg:mt-16">
            <h2 className="font-mono text-xs text-[#ffb547]">{d.labels.trace}</h2>
            {/* Horizontal on desktop */}
            <div className="relative mt-7 hidden lg:block">
              <span aria-hidden="true" className="absolute start-[12.5%] top-[9px] h-px w-[50%] bg-gradient-to-r from-[#ffb547] to-[#a48bff] rtl:bg-gradient-to-l" />
              <span aria-hidden="true" className="absolute start-[62.5%] top-[9px] h-px w-[25%] border-t border-dashed border-[#f2efe8]/30" />
              <span
                aria-hidden="true"
                className="df-packet absolute top-[6px] size-[7px] rounded-full bg-[#fff1d6] shadow-[0_0_12px_3px_rgb(255_181_71/0.8)]"
                style={{ "--from": "12.5%", "--to": "62.5%" } as CSSProperties}
              />
              <ol className="grid grid-cols-4">
                {trace.map((n) => (
                  <li key={n.role} className="flex flex-col items-center px-3 text-center text-balance">
                    <span
                      aria-hidden="true"
                      className={`relative z-10 size-[19px] rounded-full border ${
                        n.next ? "border-dashed border-[#f2efe8]/40 bg-[#0a0a0d]" : "border-[#ffb547]/80 bg-[#0a0a0d] shadow-[0_0_0_4px_rgb(255_181_71/0.08)]"
                      }`}
                    >
                      {!n.next ? <span className="absolute inset-[5px] rounded-full bg-[#ffb547]" /> : null}
                    </span>
                    <span className="mt-4 font-mono text-xs text-[#f2efe8]/60">{n.next ? n.org : n.period}</span>
                    <span className={`mt-1 font-medium leading-snug ${n.next ? "text-[#f2efe8]/60" : "text-[#f2efe8]"}`}>
                      <bdi>{n.role}</bdi>
                    </span>
                    {!n.next ? (
                      <span className="mt-0.5 text-sm text-[#f2efe8]/60">
                        <bdi>{n.org}</bdi>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
            {/* Vertical on mobile */}
            <div className="relative mt-6 lg:hidden">
              <span aria-hidden="true" className="absolute start-[9px] top-2 h-[66%] w-px bg-gradient-to-b from-[#ffb547] to-[#a48bff]" />
              <span aria-hidden="true" className="absolute start-[9px] top-[68%] h-[24%] border-s border-dashed border-[#f2efe8]/30" />
              <span
                aria-hidden="true"
                className="df-packet-v absolute start-[6px] size-[7px] rounded-full bg-[#fff1d6] shadow-[0_0_12px_3px_rgb(255_181_71/0.8)]"
                style={{ "--from": "4%", "--to": "64%" } as CSSProperties}
              />
              <ol className="space-y-5">
                {trace.map((n) => (
                  <li key={n.role} className="relative ps-9">
                    <span
                      aria-hidden="true"
                      className={`absolute start-0 top-1 size-[19px] rounded-full border ${
                        n.next ? "border-dashed border-[#f2efe8]/40 bg-[#0a0a0d]" : "border-[#ffb547]/80 bg-[#0a0a0d]"
                      }`}
                    >
                      {!n.next ? <span className="absolute inset-[5px] rounded-full bg-[#ffb547]" /> : null}
                    </span>
                    <span className="block font-mono text-xs text-[#f2efe8]/60">{n.next ? n.org : n.period}</span>
                    <span className={`block font-medium leading-snug ${n.next ? "text-[#f2efe8]/60" : "text-[#f2efe8]"}`}>
                      <bdi>{n.role}</bdi>
                    </span>
                    {!n.next ? (
                      <span className="block text-sm text-[#f2efe8]/60">
                        <bdi>{n.org}</bdi>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
        <PrototypeBadge letter="c" />
      </main>
    </div>
  );
}
