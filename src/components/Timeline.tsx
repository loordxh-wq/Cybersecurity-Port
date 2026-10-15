import { getTranslations } from "next-intl/server";
import { cellcomMetrics, timeline } from "@/content/facts";
import { ui } from "@/lib/ui";

// Full keys per entry, so every key is checked against messages/en.json at compile time.
const pointKeys = {
  cellcom: ["cellcom.p1", "cellcom.p2", "cellcom.p3"],
  cyberGain: ["cyberGain.p1", "cyberGain.p2", "cyberGain.p3", "cyberGain.p4"],
  nationalService: ["nationalService.p1"],
} as const;

export async function Timeline() {
  const t = await getTranslations("timeline");

  return (
    <ol className="relative space-y-8 ps-8 sm:ps-12">
      {timeline.map((entry, index) => (
        <li key={entry.id} className="relative">
          {/* Rail segment and glowing node; the rail stops at the last entry. */}
          {index < timeline.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute -start-[calc(1.25rem+0.5px)] top-4 h-[calc(100%+2rem)] w-px bg-gradient-to-b from-ice/60 to-line sm:-start-[calc(1.75rem+0.5px)]"
            />
          ) : null}
          <span
            aria-hidden="true"
            className="absolute -start-[calc(1.25rem+6px)] top-2.5 size-3 rounded-full border-2 border-ink bg-ice shadow-[0_0_0_4px_rgb(66_213_246/0.15),0_0_14px_rgb(66_213_246/0.8)] sm:-start-[calc(1.75rem+6px)]"
          />
          <div className="panel rounded-2xl p-5 transition-colors hover:border-ice/30 sm:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-xl font-semibold text-fg">{t(`${entry.id}.role`)}</h3>
              <p className="rounded-full border border-ice/30 bg-ice/10 px-2.5 py-0.5 font-mono text-xs text-ice-soft">
                <bdi>{entry.period}</bdi>
              </p>
            </div>
            <p className="mt-1 text-fg-muted">{t(`${entry.id}.org`)}</p>
            <ul className="measure mt-5 space-y-2.5">
              {pointKeys[entry.id].map((k) => (
                <li key={k} className="flex gap-3 text-fg/90">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ice/70" />
                  <span>{t(k)}</span>
                </li>
              ))}
              {entry.id === "cellcom" && cellcomMetrics.approved ? (
                <li className="flex gap-3 text-fg/90">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ice/70" />
                  <span>{t("cellcom.metrics")}</span>
                </li>
              ) : null}
            </ul>
            {entry.tools ? (
              <div className="mt-5 border-t border-line pt-5">
                <p className="sr-only">{t("toolsLabel")}</p>
                <ul className="flex flex-wrap gap-1.5" lang="en">
                  {entry.tools.map((tool) => (
                    <li key={tool} className={ui.chip}>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
