import { getTranslations } from "next-intl/server";
import { socials } from "@/content/facts";

/** Editorial text links to Eli's profiles (no icon tiles), used in the menu, footer and hero. */
export async function TextSocialLinks({ label, className = "" }: { label: string; className?: string }) {
  const t = await getTranslations("social");
  return (
    <ul aria-label={label} className={`cmd-socials ${className}`}>
      {socials.map((s) => (
        <li key={s.id}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${t("profileOn", { network: t(s.id) })} (${t("newTab")})`}>
            {t(s.id)}
            <span aria-hidden="true" className="cmd-socials-arrow">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
