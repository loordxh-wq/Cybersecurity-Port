import { getTranslations } from "next-intl/server";
import { cellcomMetrics, timeline } from "@/content/facts";

const pointKeys = {
  cellcom: ["p1", "p2", "p3"],
  cyberGain: ["p1", "p2", "p3", "p4"],
  nationalService: ["p1"],
} as const;

export async function Timeline() {
  const t = await getTranslations("timeline");

  return (
    <ol className="relative space-y-10 border-s border-line ps-7 sm:ps-9">
      {timeline.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -start-[calc(1.75rem+5px)] top-1.5 size-2.5 rounded-full bg-ice shadow-[0_0_0_4px_rgb(66_213_246/0.15)] sm:-start-[calc(2.25rem+5px)]"
          />
          <p className="text-sm font-medium text-ice">
            <bdi>{entry.period}</bdi>
          </p>
          <h3 className="mt-1 text-xl font-semibold text-fg">{t(`${entry.id}.role`)}</h3>
          <p className="text-fg-muted">{t(`${entry.id}.org`)}</p>
          <ul className="measure mt-4 space-y-2">
            {pointKeys[entry.id].map((k) => (
              <li key={k} className="flex gap-3 text-fg/90">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-fg-muted" />
                <span>{t(`${entry.id}.${k}`)}</span>
              </li>
            ))}
            {entry.id === "cellcom" && cellcomMetrics.approved ? (
              <li className="flex gap-3 text-fg/90">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-fg-muted" />
                <span>{t("cellcom.metrics")}</span>
              </li>
            ) : null}
          </ul>
          {entry.tools ? (
            <div className="mt-4">
              <p className="sr-only">{t("toolsLabel")}</p>
              <ul className="flex flex-wrap gap-1.5" lang="en">
                {entry.tools.map((tool) => (
                  <li key={tool} className="rounded-md border border-line bg-ink/50 px-2 py-0.5 font-mono text-[0.78rem] text-ice-soft">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
