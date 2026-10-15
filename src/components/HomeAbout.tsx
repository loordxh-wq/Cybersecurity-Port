import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ui } from "@/lib/ui";

const tools = ["Splunk", "QRadar", "Wireshark", "FortiGate", "Active Directory", "Microsoft 365", "PowerShell", "Python"];

export async function HomeAbout() {
  const t = await getTranslations("homeAbout");
  return (
    <section id="about" data-section aria-labelledby="home-about-title" className={`${ui.container} scroll-mt-24 py-16 sm:py-20`}>
      <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <h2 id="home-about-title" className={`${ui.sectionTitle} max-w-sm`}>
          {t("title")}
        </h2>
        <div>
          <p className="measure text-lg leading-relaxed text-fg/90">{t("body")}</p>
          <ul className="mt-6 flex flex-wrap gap-2" lang="en">
            {tools.map((tool) => (
              <li key={tool} className="rounded-md border border-line bg-ink/50 px-2.5 py-1 font-mono text-[0.8rem] text-ice-soft">
                {tool}
              </li>
            ))}
          </ul>
          <Link href="/about" className={`${ui.textLink} mt-6`}>
            {t("link")}
          </Link>
        </div>
      </div>
    </section>
  );
}
