import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { copyFor } from "@/components/lab-mockup/copy";
import { DesktopWorkspace, type View } from "@/components/lab-mockup/Desktop";
import "@/components/lab-mockup/lab-mockup.css";
import { MobileFlow, mobileState, type MobileView } from "@/components/lab-mockup/Mobile";
import { fill } from "@/components/lab-mockup/parts";
import { isPreview } from "@/content/stage";
import type { Locale } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ view?: string }> };

const desktopViews: View[] = ["briefing", "logs", "entities", "timeline", "verdict", "debrief"];
const mobileViews = Object.keys(mobileState) as MobileView[];

const deskAlias: Record<string, View> = { queue: "logs", filters: "logs", event: "logs", "event-pinned": "logs", "event-linked": "logs", unpin: "logs", entity: "entities", map: "entities", evidence: "timeline", "evidence-empty": "timeline", findings: "verdict" };
const mobileAlias: Record<string, MobileView> = { timeline: "evidence" };

const deskState: Record<View, keyof (typeof copyFor)["en"]["m12"]["state"]> = { briefing: "initial", logs: "linked", entities: "example", timeline: "example", verdict: "example", debrief: "submitted" };

// Phase 3 M1.2 mockup (proposal branch only): static sample data, protected preview, never indexed.
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
      {/* Review-only strip: says which example state this static screen shows. */}
      <p className="lm-review lm-review--ws">
        {t.m12.review} · <span className="lm-only-desk">{fill(t.m12.showing, { s: t.m12.state[deskState[desk]] })}</span>
        <span className="lm-only-mobile">{fill(t.m12.showing, { s: t.m12.state[mobileState[mobile]] })}</span>
      </p>
      <DesktopWorkspace t={t} view={desk} />
      <MobileFlow t={t} view={mobile} />
    </div>
  );
}
