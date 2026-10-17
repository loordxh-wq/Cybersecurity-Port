import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import manifest from "@/assets/evidence/manifest.json";
import type { CaseFile } from "@/content/case-files";
import { publishedCases } from "@/content/case-files";
import { locales, ogLocale, type Locale } from "@/i18n/routing";
import { localizedUrl } from "@/lib/metadata";

type ManifestEntry = { file: string; sanitizedOn?: string; approvedOn?: string };
const manifestFiles = (manifest as { files: ManifestEntry[] }).files;

/** Evidence items of a case that are recorded as sanitized and approved. */
export function approvedEvidence(c: CaseFile) {
  return c.evidence.filter((e) => {
    const entry = manifestFiles.find((f) => f.file === e.file);
    return Boolean(entry?.sanitizedOn && entry?.approvedOn);
  });
}

export function sanitizedOn(file: string) {
  return manifestFiles.find((f) => f.file === file)?.sanitizedOn ?? null;
}

/**
 * Metadata for Case Files pages. Indexable only when the page is public (a published
 * case, or the index once at least one case is published); preview-only pages are noindex.
 */
export async function caseMetadata(locale: Locale, path: string, title: string, description: string, indexable: boolean): Promise<Metadata> {
  const meta = await getTranslations({ locale, namespace: "meta" });
  const languages = Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)]));
  return {
    title,
    description,
    ...(indexable ? {} : { robots: { index: false, follow: false } }),
    alternates: { canonical: localizedUrl(locale, path), languages: { ...languages, "x-default": localizedUrl("en", path) } },
    openGraph: {
      type: "article",
      siteName: meta("siteName"),
      title,
      description,
      url: localizedUrl(locale, path),
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: { card: "summary", title, description },
  };
}

export const indexIsPublic = () => publishedCases.length > 0;
