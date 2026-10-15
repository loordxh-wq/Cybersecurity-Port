# Eli Saad — Cybersecurity Portfolio

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · Motion · next-intl.
English (`/en`, LTR), Hebrew (`/he`, RTL) and Arabic (`/ar`, RTL).

## Status

Phase 1: Home, About, Certifications and Open to Work.

**Not yet built or tested.** The source was written in a sandbox with no internet
access, so `npm install`, lint, typecheck and build have **not** been run. Run
`npm run verify` (below) before trusting it. Nothing has been deployed.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /en
npm run check:i18n   # fails if any language is missing a string
npm run lint         # i18n check + ESLint (zero warnings allowed)
npm run typecheck    # tsc --noEmit
npm run build        # i18n check + production build
npm run verify       # all of the above, in order
```

Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) so canonical, hreflang and sitemap
URLs point at the real domain.

## Architecture

```
messages/{en,he,ar}.json      All visible wording, one file per language
src/content/facts.ts          Shared facts: dates, issuers, links, approval flags
src/assets/                   Public images (portrait crop, redacted certificates)
src/i18n/                     Locale routing, navigation helpers, request config
src/middleware.ts             Redirects / to a locale, keeps URLs prefixed
src/app/[locale]/             Pages: home, about, certifications, contact
src/components/               UI (server components unless marked "use client")
scripts/check-messages.mjs    Translation parity check, runs before lint and build
private/                      Gitignored. Original CV and unredacted images only.
```

- **Wording vs facts.** Text lives in `messages/*.json`; facts that are the same
  in every language (dates, URLs, issuers) live in `src/content/facts.ts`.
- **Approval flags.** Anything that needs Eli's sign-off is off by default:
  `cellcomMetrics.approved`, `publicEmail`, `publicCv`. Flip them in `facts.ts`.
- **RTL.** `<html dir>` is set per locale. Layout uses logical utilities
  (`ms-`, `ps-`, `start-`, `border-s`) so it mirrors automatically. Latin terms
  inside Hebrew/Arabic text are wrapped in `<bdi>` where they could reorder.
  Arabic never gets letter-spacing (it breaks letter joining).
- **Fonts.** IBM Plex Sans with its Hebrew and Arabic versions, self-hosted by
  `next/font` with size-adjusted fallbacks, so there is no flash or layout jump.
- **Motion.** One load sequence (portrait frame locks on, text rises in). The
  particle canvas pauses off-screen and in background tabs, and draws a single
  still frame when the visitor prefers reduced motion. No WebGL.
- **Security headers.** CSP, HSTS, frame denial, nosniff, referrer and
  permissions policies in `next.config.ts`.

## Updating content from a phone

1. Edit the wording in `messages/en.json`, `he.json` and `ar.json` (same key in all three).
2. Edit facts (a new certificate date, a link) in `src/content/facts.ts`.
3. Commit. `npm run build` will refuse to build if a language is missing a key.

## Waiting on Eli

- Approve the About and Open to Work wording in all three languages.
- Approve the Cellcom figures (≈50 cases/day, 95% first-contact resolution), then
  set `cellcomMetrics.approved = true`.
- Choose which email (if any) to publish, then set `publicEmail`.
- Approve a redacted public CV, then add it under `public/cv/` and set `publicCv`.
- Confirm the Hebrew and Arabic spelling of your name.
- Send a portrait without the phone covering your face, when you have one.
- Phase 2: SOC lab demo, projects, journal, roadmap, skills matrix, AI web
  showcase, CV center, per-locale OG images, nonce-based CSP.
