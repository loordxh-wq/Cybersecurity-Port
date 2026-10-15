import { getLocale, getTranslations } from "next-intl/server";
import type { CSSProperties, ReactNode } from "react";
import { credentials } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import { ui } from "@/lib/ui";
import { ArrowIcon, HeadsetIcon, ShieldIcon, TerminalIcon } from "./icons";
import { ParticleField } from "./ParticleField";
import { PortraitFrame } from "./PortraitFrame";
import { SocialLinks } from "./SocialLinks";
import { StatusChip } from "./StatusChip";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export async function Hero() {
  const t = await getTranslations("hero");
  const tl = await getTranslations("timeline");
  const locale = await getLocale();
  const csa = credentials.find((c) => c.id === "csa")!;
  // The focus line is one translated string ("A · B · C"); shown as separate tags.
  const focus = t("focus")
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section id="top" data-section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <ParticleField anchorId="portrait-frame" />
      {/* Spotlight behind the portrait side, plus a faint grid that fades out. */}
      <div
        aria-hidden="true"
        className="breathe pointer-events-none absolute -top-40 end-[-20%] -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.22),rgb(66_213_246/0.08)_55%,transparent)] lg:end-[-6%]"
      />
      <div
        aria-hidden="true"
        className="grid-faint pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_35%,#000,transparent_75%)] rtl:[mask-image:radial-gradient(ellipse_70%_60%_at_30%_35%,#000,transparent_75%)]"
      />

      <div className={`${ui.container} pb-12 pt-10 sm:pt-14 lg:pb-16 lg:pt-20`}>
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <div className="order-2 lg:order-1">
            <StatusChip tone="ok" live className="rise" style={step(0)}>
              {t("status")}
            </StatusChip>

            <h1
              id="hero-title"
              className="mt-5 text-[clamp(2.9rem,11vw,5.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            >
              <span className="text-gradient inline-block">{t("name")}</span>
              {locale !== "en" ? (
                // The block inherits the page direction so it aligns under the name; only the inner text is LTR.
                // Arabic descenders (the dots under ي) need extra room above the subtitle.
                <span
                  className={`${locale === "ar" ? "mt-[0.7em]" : "mt-2"} block text-[0.36em] font-medium leading-tight tracking-normal text-fg-muted`}
                >
                  <span lang="en" dir="ltr">
                    Eli Saad
                  </span>
                </span>
              ) : null}
            </h1>

            <p className="rise mt-5 text-lg font-semibold text-fg sm:text-[1.35rem]" style={step(1)}>
              {t("role")}
            </p>

            <ul className="rise mt-4 flex flex-wrap gap-2" style={step(2)}>
              {focus.map((item, i) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-deep/60 px-3 py-1 text-sm text-fg-muted"
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${i === 1 ? "bg-violet" : i === 2 ? "bg-cobalt" : "bg-ice"}`}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <p className="rise measure mt-6 text-lg leading-relaxed text-fg/85 sm:text-xl" style={step(3)}>
              {t("tagline")}
            </p>

            <div className="rise mt-9 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap" style={step(4)}>
              <Link href="/contact" className={ui.buttonPrimary}>
                {t("ctaContact")}
                <ArrowIcon className="flip-rtl" width={18} height={18} />
              </Link>
              <Link href="/certifications" className={ui.buttonSecondary}>
                <ShieldIcon width={18} height={18} className="text-ice" />
                {t("ctaCertifications")}
              </Link>
            </div>

            <div className="rise mt-8 flex items-center gap-4" style={step(5)}>
              <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-ice/60 to-transparent rtl:bg-gradient-to-l" />
              <SocialLinks label={t("socialLabel")} />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <PortraitFrame id="portrait-frame" alt={t("portraitAlt")} caption={`${csa.issuer} · C|SA`} />
          </div>
        </div>

        {/* Highlights strip: three real facts from the CV, no new claims. */}
        <ul className="panel edge rise mt-14 grid overflow-hidden rounded-2xl sm:grid-cols-3" style={step(6)}>
          <Highlight icon={<ShieldIcon />} title={<bdi>{csa.title}</bdi>} sub={<bdi>{csa.issuer}</bdi>} />
          <Highlight icon={<TerminalIcon />} title={tl("cyberGain.role")} sub={tl("cyberGain.org")} />
          <Highlight icon={<HeadsetIcon />} title={tl("cellcom.role")} sub={tl("cellcom.org")} />
        </ul>
      </div>
    </section>
  );
}

function Highlight({ icon, title, sub }: { icon: ReactNode; title: ReactNode; sub: ReactNode }) {
  return (
    <li className="flex items-start gap-4 border-line px-5 py-5 not-first:border-t sm:not-first:border-t-0 sm:not-first:border-s sm:px-6">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-ice/25 bg-ice/[0.07] text-ice">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold leading-snug text-fg">{title}</span>
        <span className="mt-0.5 block text-sm text-fg-muted">{sub}</span>
      </span>
    </li>
  );
}
