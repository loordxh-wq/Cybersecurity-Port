import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { frames, opsCopy, type Frame } from "@/components/operations-mockup/copy";
import { OpsMockup } from "@/components/operations-mockup/Ops";
import "@/components/operations-mockup/operations-mockup.css";
import { isPreview } from "@/content/stage";
import type { Locale } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ frame?: string }>;
};

// Cyber Operations proposal mockup (proposal branch only): static frames, protected preview, never indexed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await resolveLocale(params)) as Locale;
  return {
    title: `${opsCopy[locale].hub.title} | Eli Saad`,
    robots: { index: false, follow: false },
  };
}

export default async function OperationsMockupPage({ params, searchParams }: Props) {
  const locale = (await resolveLocale(params)) as Locale;
  setRequestLocale(locale);
  if (!isPreview) notFound();
  const requested = (await searchParams).frame ?? "";
  const frame: Frame = frames.find((f) => f === requested) ?? "hub";
  return <OpsMockup locale={locale} frame={frame} />;
}
