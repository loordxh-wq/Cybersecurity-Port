import { credentials, person, socials } from "@/content/facts";
import { siteUrl } from "@/lib/site";

/** schema.org Person built only from verified facts. */
export function PersonJsonLd({ url }: { url: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.nameLatin,
    alternateName: ["אילי סעד", "إيلي سعد"],
    jobTitle: "Aspiring SOC Analyst",
    url,
    image: `${siteUrl}${person.portrait.src}`,
    sameAs: socials.map((s) => s.href),
    address: { "@type": "PostalAddress", addressRegion: "Northern District", addressCountry: "IL" },
    knowsLanguage: ["ar", "he", "en"],
    hasCredential: credentials.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.title,
      credentialCategory: c.kind === "certification" ? "Certification" : "Course completion",
      dateCreated: c.date,
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
