import type { MetadataRoute } from "next";
import { publishedCases } from "@/content/case-files";
import { locales } from "@/i18n/routing";
import { localizedUrl, pagePaths } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  // Case files appear only once documented and approved; unfinished cases never do.
  const casePaths = publishedCases.length ? ["/case-files", ...publishedCases.map((c) => `/case-files/${c.slug}`)] : [];
  return [...Object.values(pagePaths), ...casePaths].flatMap((path) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, localizedUrl(l, path)])),
      },
    })),
  );
}
