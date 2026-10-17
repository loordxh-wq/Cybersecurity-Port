import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Review label so reviewers always know which prototype they are looking at.
 * Exists only on /concepts routes (noindex) and is never rendered by production pages.
 * `inline` places it in normal flow at the end of the page, so it can never cover content.
 */
export async function PrototypeBadge({ letter, inline = false }: { letter: "a" | "b" | "c" | "v4"; inline?: boolean }) {
  const t = await getTranslations("concepts");
  const label = (
    <>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-400" />
      {t("prototype", { letter: letter.toUpperCase() })} · {t(`names.${letter}`)}
    </>
  );
  if (inline) {
    return (
      <p className="cc-proto">
        <Link href="/concepts" className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-white/70 hover:text-white">
          {label}
        </Link>
      </p>
    );
  }
  return (
    <Link
      href="/concepts"
      className="fixed bottom-3 end-3 z-50 inline-flex min-h-9 items-center gap-2 rounded-full bg-black/80 px-3.5 text-xs font-medium text-white/80 ring-1 ring-white/15 backdrop-blur hover:text-white"
    >
      {label}
    </Link>
  );
}
