import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { credentials } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { ui } from "@/lib/ui";

/** Home-page preview of the certificates. The full gallery and viewer live on /certifications. */
export async function CredentialStrip() {
  const t = await getTranslations("homeCredentials");
  const tc = await getTranslations("certifications");
  const locale = (await getLocale()) as Locale;

  return (
    <section id="credentials" data-section aria-labelledby="credentials-title" className={`${ui.container} scroll-mt-24 py-16 sm:py-20`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="credentials-title" className={ui.sectionTitle}>
            {t("title")}
          </h2>
          <p className="measure mt-3 text-fg-muted">{t("body")}</p>
        </div>
        <Link href="/certifications" className={ui.textLink}>
          {t("link")}
        </Link>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {credentials.map((c) => {
          const date = formatDate(locale, c.date);
          const isCert = c.kind === "certification";
          return (
            <li key={c.id}>
              <Link
                href={`/certifications#${c.id}`}
                className="group block h-full rounded-2xl border border-line bg-deep/60 p-3 transition-colors hover:border-ice/40"
              >
                <div className="overflow-hidden rounded-xl border border-line bg-white">
                  <Image
                    src={c.image}
                    alt=""
                    sizes="(min-width: 768px) 33vw, 92vw"
                    placeholder="blur"
                    className="aspect-[16/11] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="px-2 pb-2 pt-4">
                  <p className={`text-sm font-medium ${isCert ? "text-ice" : "text-fg-muted"}`}>{tc(`kind.${c.kind}`)}</p>
                  <p className="mt-1 font-semibold text-fg">
                    <bdi>{c.title}</bdi>
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">
                    <bdi>{c.issuer}</bdi>
                    <span aria-hidden="true"> / </span>
                    <span className="sr-only">, </span>
                    {isCert ? tc("issued", { date }) : tc("completed", { date })}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
