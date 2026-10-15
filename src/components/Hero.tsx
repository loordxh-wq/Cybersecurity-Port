import { getLocale, getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { ui } from "@/lib/ui";
import { ParticleField } from "./ParticleField";
import { PortraitFrame } from "./PortraitFrame";
import { SocialLinks } from "./SocialLinks";
import { StatusChip } from "./StatusChip";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export async function Hero() {
  const t = await getTranslations("hero");
  const locale = await getLocale();

  return (
    <section id="top" data-section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <ParticleField anchorId="portrait-frame" />
      <div className={`${ui.container} grid items-center gap-12 pb-20 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pb-28 lg:pt-24`}>
        <div className="order-2 lg:order-1">
          <StatusChip tone="ok" live className="rise" style={step(0)}>
            {t("status")}
          </StatusChip>

          <h1 id="hero-title" className="mt-6 text-[clamp(2.6rem,9vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-fg">
            {t("name")}
            {locale !== "en" ? (
              <span lang="en" dir="ltr" className="mt-2 block text-[0.38em] font-medium leading-tight tracking-normal text-fg-muted">
                Eli Saad
              </span>
            ) : null}
          </h1>

          <p className="rise mt-5 text-lg font-medium text-fg sm:text-xl" style={step(1)}>
            {t("role")}
          </p>
          <p className="rise mt-2 text-fg-muted" style={step(2)}>
            {t("focus")}
          </p>
          <p className="rise measure mt-6 text-lg leading-relaxed text-fg/90 sm:text-xl" style={step(3)}>
            {t("tagline")}
          </p>

          <div className="rise mt-9 flex flex-wrap gap-3" style={step(4)}>
            <Link href="/contact" className={ui.buttonPrimary}>
              {t("ctaContact")}
            </Link>
            <Link href="/certifications" className={ui.buttonSecondary}>
              {t("ctaCertifications")}
            </Link>
          </div>

          <div className="rise mt-8" style={step(5)}>
            <SocialLinks label={t("socialLabel")} />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <PortraitFrame id="portrait-frame" alt={t("portraitAlt")} />
        </div>
      </div>
    </section>
  );
}
