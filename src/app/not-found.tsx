import Link from "next/link";

// Fallback for requests that never matched a locale (rare: the middleware
// redirects everything else to /en, /he or /ar).
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body style={{ background: "#07101b", color: "#e6eef7", fontFamily: "system-ui, sans-serif", padding: "3rem" }}>
        <h1>Page not found</h1>
        <p>
          <Link href="/en" style={{ color: "#42d5f6" }}>
            Go to the home page
          </Link>
        </p>
      </body>
    </html>
  );
}
