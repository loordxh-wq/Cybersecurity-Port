import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { copyFor } from "@/components/lab-mockup/copy";
import "@/components/lab-mockup/lab-mockup.css";
import { motionCopy } from "@/components/showcase-motion/copy";
import "@/components/showcase-motion/motion.css";
import { MotionStudy, type LabStrings } from "@/components/showcase-motion/MotionStudy";
import { showcaseCopy } from "@/components/showcase-mockup/copy";
import { isPreview } from "@/content/stage";
import type { Locale } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ chapter?: string; capture?: string }> };

// Phase 3 motion study (proposal branch only): local prototype, protected preview build, never indexed or linked.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await resolveLocale(params)) as Locale;
  return { title: `${motionCopy[locale].study} | Eli Saad`, robots: { index: false, follow: false } };
}

export default async function MotionStudyPage({ params, searchParams }: Props) {
  const locale = (await resolveLocale(params)) as Locale;
  setRequestLocale(locale);
  if (!isPreview) notFound();
  const q = await searchParams;
  const chapter = q.chapter === "3" ? 3 : 2;
  const t = copyFor[locale];
  const s = showcaseCopy[locale];
  // Only these lab labels reach the client bundle; the lab's debrief and notes never do.
  const lab: LabStrings = {
    query: t.flt.query,
    results: t.logs.results,
    cols: { time: t.logs.cols.time, event: t.logs.cols.event, account: t.logs.cols.account, source: t.logs.cols.source, type: t.logs.cols.type, auth: t.logs.cols.auth, status: t.logs.cols.status },
    facets: { event: t.logs.facets.event, account: t.logs.facets.account, result: t.logs.facets.result },
    outcome: t.logs.outcome,
    eventName: t.insp.name[4624],
    fields: { account: t.insp.field.account, computer: t.insp.field.computer, logonType: t.insp.field.logonType, source: t.insp.field.source, client: t.insp.field.client, auth: t.insp.field.auth, process: t.insp.field.process },
    network: t.insp.logonType["3"],
    sim: s.sim,
    notReal: s.notReal,
    disclosure: s.credit,
    draft: s.draft,
    supportsTitle: s.player.q.supports,
    uncertainTitle: s.player.q.uncertain,
    chapterTitles: [s.chapters[1].title, s.chapters[2].title],
    chapterOf: [s.player.chapterOf.replace("{n}", "2"), s.player.chapterOf.replace("{n}", "3")],
  };
  return <MotionStudy key={chapter} chapter={chapter} m={motionCopy[locale]} lab={lab} capture={q.capture === "1"} />;
}
