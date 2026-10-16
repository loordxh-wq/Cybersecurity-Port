import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CvRequest } from "@/components/cv/CvRequest";
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
    <>
      <div className={`${ui.container} pt-12 sm:pt-20`}>
        <OpenToWork headingLevel={1} />
      </div>
      <CvRequest />
      <div className={`${ui.container} pb-12 sm:pb-20`}>
        <section aria-labelledby="profiles-title" className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <h2 id="profiles-title" className="font-mono text-xs font-medium text-ice">
            {tFooter("socialTitle")}
          </h2>
          <SocialLinks label={tFooter("socialTitle")} withNames />
        </section>
      </div>
    </>
  );
}
