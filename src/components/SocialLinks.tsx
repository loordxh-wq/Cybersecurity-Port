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
    <ul aria-label={label} className="flex flex-wrap items-center gap-2.5">
      {socials.map(({ id, href }) => {
        const Icon = icons[id];
        const network = t(id);
        return (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-line bg-gradient-to-b from-raised/60 to-deep/60 text-fg-muted shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-ice/50 hover:text-ice-soft hover:shadow-[0_8px_24px_-10px_rgb(66_213_246/0.7)] ${
                withNames ? "px-4" : "px-3"
              }`}
            >
              <Icon />
              {withNames ? <span className="text-sm font-medium">{network}</span> : null}
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
