import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OpenToWork } from "@/components/OpenToWork";
import { SocialLinks } from "@/components/SocialLinks";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/metadata";
import { ui } from "@/lib/ui";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), "contact");
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const tFooter = await getTranslations("footer");

  return (
    <div className={`${ui.container} py-12 sm:py-20`}>
      <OpenToWork headingLevel={1} />
      <section aria-labelledby="profiles-title" className="mt-14">
        <h2 id="profiles-title" className="text-lg font-semibold">
          {tFooter("socialTitle")}
        </h2>
        <div className="mt-4">
          <SocialLinks label={tFooter("socialTitle")} withNames />
        </div>
      </section>
    </div>
  );
}
