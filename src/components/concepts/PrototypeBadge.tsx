import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Small fixed label so reviewers always know which prototype they are looking at. */
export async function PrototypeBadge({ letter }: { letter: "a" | "b" | "c" }) {
  const t = await getTranslations("concepts");
  return (
    <Link
      href="/concepts"
      className="fixed bottom-3 end-3 z-50 inline-flex min-h-9 items-center gap-2 rounded-full bg-black/80 px-3.5 text-xs font-medium text-white/80 ring-1 ring-white/15 backdrop-blur hover:text-white"
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-400" />
      {t("prototype", { letter: letter.toUpperCase() })} · {t(`names.${letter}`)}
    </Link>
  );
}
