import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "@/components/command/command.css";
import { CareerTrajectory } from "@/components/home/CareerTrajectory";
import { CaseStudiesPreview } from "@/components/home/CaseStudiesPreview";
import { ChapterRail } from "@/components/home/ChapterRail";
import { CommandHero } from "@/components/home/CommandHero";
import { CvRequest } from "@/components/cv/CvRequest";
import { CredentialExhibit } from "@/components/home/CredentialExhibit";
import "@/components/home/home.css";
import { MissionChapter } from "@/components/home/MissionChapter";
import { OpenToWorkBand } from "@/components/home/OpenToWorkBand";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { visibleProjects } from "@/content/projects";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { localizedUrl, pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata(locale, "home");
}

/**
 * Home: the Cyber Command V4.1 hero followed by chapters, each opened by the
 * signal-horizon rule. Chapter numbers are computed, so a chapter hidden by the
 * evidence model (case studies on the public build) leaves no gap in the count.
 */
export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const h = await getTranslations("home");
  const credentials = await getTranslations("homeCredentials");
  const otw = await getTranslations("openToWork");

  const chapters = [
    { id: "identity", label: h("chapters.identity") },
    { id: "mission", label: h("chapters.mission") },
    { id: "career", label: h("chapters.career") },
    { id: "credentials", label: credentials("title") },
    ...(visibleProjects.length ? [{ id: "work", label: h("chapters.work") }] : []),
    { id: "open-to-work", label: otw("title") },
    { id: "cv", label: h("chapters.cv") },
  ].map((c, i) => ({ ...c, index: String(i + 1).padStart(2, "0") }));
  const idx = (id: string) => chapters.find((c) => c.id === id)?.index ?? "";

  return (
    <>
      <PersonJsonLd url={localizedUrl(locale, "")} />
      <CommandHero />
      <MissionChapter index={idx("mission")} />
      <CareerTrajectory index={idx("career")} />
      <CredentialExhibit index={idx("credentials")} />
      <CaseStudiesPreview index={idx("work")} />
      <OpenToWorkBand index={idx("open-to-work")} />
      <CvRequest index={idx("cv")} />
      <ChapterRail label={h("chapters.label")} items={chapters} />
    </>
  );
}
