import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import "@/components/lab-mockup/lab-mockup.css";
import { showcaseCopy, type Frame } from "@/components/showcase-mockup/copy";
import { frames, ShowcaseMockup } from "@/components/showcase-mockup/Showcase";
import "@/components/showcase-mockup/showcase-mockup.css";
import { isPreview } from "@/content/stage";
import type { Locale } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ frame?: string }>;
};

// Revised Phase 3 proposal mockup (proposal branch only): static frames, protected preview, never indexed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await resolveLocale(params)) as Locale;
  return {
    title: `${showcaseCopy[locale].hub.title} | Eli Saad`,
    robots: { index: false, follow: false },
  };
}

export default async function ShowcaseMockupPage({ params, searchParams }: Props) {
  const locale = (await resolveLocale(params)) as Locale;
  setRequestLocale(locale);
  if (!isPreview) notFound();
  const requested = (await searchParams).frame ?? "";
  const frame: Frame = frames.find((f) => f === requested) ?? "hub";
  return <ShowcaseMockup locale={locale} frame={frame} />;
}
