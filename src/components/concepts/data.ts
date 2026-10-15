import { getLocale, getTranslations } from "next-intl/server";
import { credentials, linkedin } from "@/content/facts";
import type { Locale } from "@/i18n/routing";
import { directionFor } from "@/i18n/routing";

/**
 * Everything a hero prototype may show, taken only from the verified messages
 * and facts. Prototypes never introduce their own claims.
 */
export async function getConceptData() {
  const locale = (await getLocale()) as Locale;
  const hero = await getTranslations("hero");
  const nav = await getTranslations("nav");
  const tl = await getTranslations("timeline");
  const otw = await getTranslations("openToWork");
  const c = await getTranslations("concepts");
  const names = await getTranslations("localeNames");
  const csa = credentials.find((x) => x.id === "csa")!;

  return {
    locale,
    dir: directionFor(locale),
    name: hero("name"),
    role: hero("role"),
    focus: hero("focus")
      .split("·")
      .map((s) => s.trim())
      .filter(Boolean),
    tagline: hero("tagline"),
    status: hero("status"),
    ctaContact: hero("ctaContact"),
    ctaCertifications: hero("ctaCertifications"),
    portraitAlt: hero("portraitAlt"),
    linkedin: linkedin.href,
    nav: {
      primary: nav("primary"),
      open: nav("openMenu"),
      close: nav("closeMenu"),
      language: nav("language"),
      items: [
        { href: "/", label: nav("home") },
        { href: "/about", label: nav("about") },
        { href: "/certifications", label: nav("certifications") },
        { href: "/contact", label: nav("contact") },
      ] as const,
    },
    localeNames: { en: names("en"), he: names("he"), ar: names("ar") } as Record<Locale, string>,
    csa: { title: csa.title, issuer: csa.issuer, year: csa.date.slice(0, 4), short: "C|SA" },
    path: [
      { role: tl("cellcom.role"), org: tl("cellcom.org"), period: "2026" },
      { role: tl("cyberGain.role"), org: tl("cyberGain.org"), period: "2026" },
      { role: csa.title, org: csa.issuer, period: csa.date.slice(0, 4) },
    ],
    nextRole: otw("roles.socTrainee"),
    labels: {
      credential: c("labels.credential"),
      training: c("labels.training"),
      experience: c("labels.experience"),
      index: c("labels.index"),
      caseFile: c("labels.caseFile"),
      exhibit: c("labels.exhibit"),
      profile: c("labels.profile"),
      discipline: c("labels.discipline"),
      status: c("labels.status"),
      trace: c("labels.trace"),
      next: c("labels.next"),
    },
  };
}

export type ConceptData = Awaited<ReturnType<typeof getConceptData>>;
