import { getTranslations } from "next-intl/server";
import { socials, type SocialId } from "@/content/facts";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./icons";

const icons: Record<SocialId, typeof LinkedInIcon> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
};

export async function SocialLinks({ label, withNames = false }: { label: string; withNames?: boolean }) {
  const t = await getTranslations("social");
  return (
    <ul aria-label={label} className="flex flex-wrap items-center gap-2">
      {socials.map(({ id, href }) => {
        const Icon = icons[id];
        const network = t(id);
        return (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-line px-3 text-fg-muted transition-colors hover:border-ice/50 hover:text-fg"
            >
              <Icon />
              {withNames ? <span className="text-sm">{network}</span> : null}
              <span className="sr-only">
                {withNames ? "" : t("profileOn", { network })} ({t("newTab")})
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
