import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CredentialStrip } from "@/components/CredentialStrip";
import { Hero } from "@/components/Hero";
import { HomeAbout } from "@/components/HomeAbout";
import { OpenToWork } from "@/components/OpenToWork";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import type { Locale } from "@/i18n/routing";
import { localizedUrl, pageMetadata } from "@/lib/metadata";
import { ui } from "@/lib/ui";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
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
