import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type LocaleParams } from "@/lib/locale";

const letters = ["a", "b", "c"] as const;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "concepts" });
  return { title: `${t("indexTitle")} | Eli Saad` };
}

/** Review index for the three hero prototypes. Not linked from the public site. */
export default async function ConceptsIndex({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const t = await getTranslations("concepts");

  return (
    <main id="main" tabIndex={-1} className="min-h-[100svh] bg-[#07080b] px-5 py-16 text-white outline-none sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{t("indexTitle")}</h1>
        <p className="mt-4 max-w-2xl text-white/60">{t("indexLead")}</p>
        <ol className="mt-12 border-t border-white/10">
          {letters.map((l) => (
            <li key={l} className="border-b border-white/10">
              <Link href={`/concepts/${l}`} className="group flex min-h-24 items-center gap-6 py-5">
                <span aria-hidden="true" className="font-mono text-sm text-white/60">
                  {l.toUpperCase()}
                </span>
                <span className="flex-1">
                  <span className="block text-xl font-semibold group-hover:text-cyan-200">{t(`names.${l}`)}</span>
                  <span className="mt-1 block text-sm text-white/55">{t(`summaries.${l}`)}</span>
                </span>
                <span className="text-sm text-white/60">{t("open")}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
