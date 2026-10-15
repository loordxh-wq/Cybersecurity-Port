import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { credentials } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { ui } from "@/lib/ui";
import { CredentialBadge } from "./CredentialBadge";
import { ArrowIcon } from "./icons";
import { SectionHeading } from "./SectionHeading";

/** Home-page preview of the certificates. The full gallery and viewer live on /certifications. */
export async function CredentialStrip() {
  const t = await getTranslations("homeCredentials");
  const tc = await getTranslations("certifications");
  const locale = (await getLocale()) as Locale;

  return (
    <section
      id="credentials"
      data-section
      aria-labelledby="credentials-title"
      className={`${ui.container} reveal scroll-mt-24 py-16 sm:py-24`}
    >
      <div aria-hidden="true" className="beam mb-16 opacity-50 sm:mb-24" />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHeading index="02" id="credentials-title">
            {t("title")}
          </SectionHeading>
          <p className="measure mt-4 text-fg-muted">{t("body")}</p>
        </div>
        <Link href="/certifications" className={`${ui.textLink} shrink-0`}>
          {t("link")}
          <ArrowIcon className="flip-rtl" width={18} height={18} />
        </Link>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {credentials.map((c) => {
          const date = formatDate(locale, c.date);
          const isCert = c.kind === "certification";
          return (
            <li key={c.id}>
              <Link
                href={`/certifications#${c.id}`}
                className={`panel group flex h-full flex-col overflow-hidden rounded-2xl p-3 transition-all duration-300 hover:-translate-y-1 hover:border-ice/40 hover:shadow-[0_30px_70px_-30px_rgb(66_213_246/0.45)] ${
                  isCert ? "edge" : ""
                }`}
              >
                <div className="relative overflow-hidden rounded-xl border border-line bg-white">
                  <Image
                    src={c.image}
                    alt=""
                    sizes="(min-width: 768px) 33vw, 92vw"
                    placeholder="blur"
                    className="aspect-[16/11] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(5_11_22/0.35))]"
                  />
                </div>
                <div className="flex flex-1 flex-col items-start px-2 pb-2 pt-5">
                  <CredentialBadge kind={c.kind} label={tc(`kind.${c.kind}`)} />
                  <p className="mt-3 text-lg font-semibold leading-snug text-fg">
                    <bdi>{c.title}</bdi>
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">
                    <bdi>{c.issuer}</bdi>
                    <span aria-hidden="true"> · </span>
                    <span className="sr-only">, </span>
                    {isCert ? tc("issued", { date }) : tc("completed", { date })}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-ice opacity-80 transition-opacity group-hover:opacity-100"
                  >
                    {tc("view")}
                    <ArrowIcon className="flip-rtl" width={16} height={16} />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
