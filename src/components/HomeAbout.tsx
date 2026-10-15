import { getTranslations } from "next-intl/server";
import { credentials } from "@/content/facts";
import { Link } from "@/i18n/navigation";
import { ui } from "@/lib/ui";
import { ArrowIcon, HeadsetIcon, ShieldIcon, TerminalIcon } from "./icons";
import { SectionHeading } from "./SectionHeading";

const tools = ["Splunk", "QRadar", "Wireshark", "FortiGate", "Active Directory", "Microsoft 365", "PowerShell", "Python"];

export async function HomeAbout() {
  const t = await getTranslations("homeAbout");
  const tl = await getTranslations("timeline");
  const csa = credentials.find((c) => c.id === "csa")!;

  // The "support desk to SOC" path, built only from real timeline entries and the real credential.
  const path = [
    { icon: HeadsetIcon, org: tl("cellcom.org"), role: tl("cellcom.role") },
    { icon: TerminalIcon, org: tl("cyberGain.org"), role: tl("cyberGain.role") },
    { icon: ShieldIcon, org: csa.issuer, role: csa.title, highlight: true },
  ];

  return (
    <section id="about" data-section aria-labelledby="home-about-title" className={`${ui.container} reveal scroll-mt-24 pb-16 pt-10 sm:pb-24 sm:pt-14`}>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading index="01" id="home-about-title" className="max-w-md">
            {t("title")}
          </SectionHeading>

          <div className="relative mt-10 ps-1">
            <span
              aria-hidden="true"
              className="absolute bottom-6 start-[1.4rem] top-6 w-px bg-gradient-to-b from-line-strong via-ice/40 to-ice"
            />
            <ol className="space-y-5">
            {path.map(({ icon: Icon, org, role, highlight }) => (
              <li key={org} className="relative flex items-center gap-4">
                <span
                  className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-xl border ${
                    highlight
                      ? "border-ice/60 bg-ice/15 text-ice shadow-[0_0_24px_-6px_rgb(66_213_246/0.9)]"
                      : "border-line-strong bg-deep text-fg-muted"
                  }`}
                >
                  <Icon width={20} height={20} />
                </span>
                <span className="min-w-0">
                  <span className={`block font-semibold ${highlight ? "text-fg" : "text-fg/90"}`}>
                    <bdi>{role}</bdi>
                  </span>
                  <span className="block text-sm text-fg-muted">
                    <bdi>{org}</bdi>
                  </span>
                </span>
              </li>
            ))}
            </ol>
          </div>
        </div>

        <div className="panel edge rounded-3xl p-6 sm:p-9">
          <p className="measure text-lg leading-relaxed text-fg/90 sm:text-xl sm:leading-relaxed">{t("body")}</p>
          <ul className="mt-7 flex flex-wrap gap-2" lang="en">
            {tools.map((tool) => (
              <li key={tool} className={ui.chip}>
                {tool}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-line pt-6">
            <Link href="/about" className={ui.textLink}>
              {t("link")}
              <ArrowIcon className="flip-rtl transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" width={18} height={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
