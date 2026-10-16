import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { copyFor } from "@/components/lab-mockup/copy";
import { DesktopWorkspace, type View } from "@/components/lab-mockup/Desktop";
import "@/components/lab-mockup/lab-mockup.css";
import { MobileFlow, type MobileView } from "@/components/lab-mockup/Mobile";
import { isPreview } from "@/content/stage";
import type { Locale } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ view?: string }> };

const desktopViews: View[] = ["briefing", "logs", "entities", "timeline", "verdict", "debrief"];
const mobileViews: MobileView[] = ["briefing", "queue", "logs", "filters", "event", "entities", "entity", "evidence", "verdict", "findings", "debrief"];

const deskAlias: Record<string, View> = { queue: "logs", filters: "logs", event: "logs", entity: "entities", evidence: "timeline", findings: "verdict" };
const mobileAlias: Record<string, MobileView> = { timeline: "evidence" };

// Phase 3 M1.1 mockup (proposal branch only): static sample data, protected preview, never indexed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await resolveLocale(params)) as Locale;
  return { title: `${copyFor[locale].scenario} | Eli Saad`, robots: { index: false, follow: false } };
}

export default async function Soc01Mockup({ params, searchParams }: Props) {
  const locale = (await resolveLocale(params)) as Locale;
  setRequestLocale(locale);
  if (!isPreview) notFound();
  const t = copyFor[locale];
  const requested = (await searchParams).view ?? "";
  // Each layout maps the requested screen to its own closest view; a first visit opens the briefing.
  const desk = desktopViews.find((v) => v === requested) ?? deskAlias[requested] ?? "briefing";
  const mobile = mobileViews.find((v) => v === requested) ?? mobileAlias[requested] ?? "briefing";
  return (
    <div className="lm">
      <p className="lm-review lm-review--ws">{t.review}</p>
      <DesktopWorkspace t={t} view={desk} />
      <MobileFlow t={t} view={mobile} />
    </div>
  );
}
