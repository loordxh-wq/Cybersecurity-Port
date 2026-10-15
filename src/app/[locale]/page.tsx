import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CredentialStrip } from "@/components/CredentialStrip";
import { Hero } from "@/components/Hero";
import { HomeAbout } from "@/components/HomeAbout";
import { OpenToWork } from "@/components/OpenToWork";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { localizedUrl, pageMetadata } from "@/lib/metadata";
import { ui } from "@/lib/ui";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata(locale, "home");
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return (
    <>
      <PersonJsonLd url={localizedUrl(locale, "")} />
      <Hero />
      <HomeAbout />
      <CredentialStrip />
      <div className={`${ui.container} py-8`}>
        <OpenToWork />
      </div>
    </>
  );
}
