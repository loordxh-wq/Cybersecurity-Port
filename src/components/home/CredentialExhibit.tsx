import { getLocale, getTranslations } from "next-intl/server";
import { ChapterRule } from "@/components/cc/ChapterRule";
import { EvidencePlate } from "@/components/cc/EvidencePlate";
import { credentials } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";

/**
 * Chapter 04: the credentials as an exhibition. The certification is the featured
 * plate; course completions hang beside it, labelled as such.
 */
export async function CredentialExhibit({ index }: { index: string }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("homeCredentials");
  const c = await getTranslations("certifications");
  const ordered = [...credentials].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "certification" ? -1 : 1));

  return (
    <section id="credentials" data-section aria-labelledby="credentials-title" className="home-chapter home-exhibit">
      <div className="site-wrap">
        <ChapterRule index={index} as="h2" id="credentials-title">
          {t("title")}
        </ChapterRule>
        <div className="home-exhibit-head cc-rise">
          <p className="cc-lead">{t("body")}</p>
          <Link href="/certifications" className="cc-textlink shrink-0">
            {t("link")}
            <span aria-hidden="true" className="cc-arrow">
              →
            </span>
          </Link>
        </div>
        <ul className="home-exhibit-grid">
          {ordered.map((cr, i) => {
            const date = formatDate(locale, cr.date);
            const featured = cr.kind === "certification";
            return (
              <li key={cr.id} className={featured ? "home-exhibit-featured" : "home-exhibit-side"}>
                <EvidencePlate
                  href={`/certifications#${cr.id}`}
                  image={cr.image}
                  alt={c("imageAlt", { title: cr.title, issuer: cr.issuer })}
                  index={String(i + 1).padStart(2, "0")}
                  kind={cr.kind}
                  kindLabel={c(`kind.${cr.kind}`)}
                  title={cr.title}
                  meta={`${cr.issuer} · ${featured ? c("issued", { date }) : c("completed", { date })}`}
                  actionLabel={c("view")}
                  featured={featured}
                  sizes={featured ? "(min-width: 1024px) 55vw, 92vw" : "(min-width: 1024px) 30vw, 92vw"}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
