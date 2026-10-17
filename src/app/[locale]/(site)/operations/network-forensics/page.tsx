import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { nfCopy, nfFrames, type NfFrame } from "@/components/netforensics-proto/copy";
import { NfProto } from "@/components/netforensics-proto/NfProto";
import "@/components/netforensics-proto/netforensics-proto.css";
import "@/components/operations-mockup/operations-mockup.css";
import { isPreview } from "@/content/stage";
import type { Locale } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ frame?: string }>;
};

// Network Forensics prototype design frames (proposal branch only): static, protected preview, never indexed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await resolveLocale(params)) as Locale;
  return {
    title: `${nfCopy[locale].title} | Eli Saad`,
    robots: { index: false, follow: false },
  };
}

export default async function NetworkForensicsPrototypePage({ params, searchParams }: Props) {
  const locale = (await resolveLocale(params)) as Locale;
  setRequestLocale(locale);
  if (!isPreview) notFound();
  const requested = (await searchParams).frame ?? "";
  const frame: NfFrame = nfFrames.find((f) => f === requested) ?? "preview";
  // Eli's role line is the approved hero wording, not new copy.
  const role = (await getTranslations("hero"))("role");
  return <NfProto locale={locale} frame={frame} role={role} />;
}
