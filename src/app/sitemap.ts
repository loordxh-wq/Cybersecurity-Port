import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { localizedUrl, pagePaths } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(pagePaths).flatMap((path) =>
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
