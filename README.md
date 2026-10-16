# Eli Saad — Cybersecurity Portfolio

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · Motion · next-intl.
English (`/en`, LTR), Hebrew (`/he`, RTL) and Arabic (`/ar`, RTL).

## Status

Phase 1: Home, About, Certifications and Open to Work, with the premium visual
redesign (cinematic navy atmosphere, numbered section headings, glass panels,
redesigned hero, portrait frame, certificate showcase, Open to Work panel,
mobile menu and footer). Same pages, routes, content and languages as before.

**Verified, not deployed.** `npm run verify` (i18n check, ESLint, TypeScript,
production build) passes, `npm audit --omit=dev` reports 0 vulnerabilities, and
all pages were tested in a real browser in English, Hebrew and Arabic at desktop,
tablet and mobile widths (layout, RTL, navigation, certificate viewer, reduced
motion, keyboard focus, axe accessibility scan). Nothing has been deployed.

Known dev-only audit finding: `braces` (via `eslint-config-next` → `fast-glob`)
has no patched release yet. It is only used by the linter and never shipped.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /en
npm run check:i18n   # fails if any language is missing a string
npm run lint         # i18n check + ESLint (zero warnings allowed)
npm run typecheck    # tsc --noEmit
npm run check:content # fails if unapproved or untranslated portfolio content could go public
npm run build        # i18n + content checks + production build
npm run verify       # all of the above, in order
npm run test:e2e     # Playwright + axe: every page × EN/HE/AR × 4 viewports, navigation,
                     # certificate viewer, home chapters, motion and reduced motion
```

**Public vs protected preview.** Every build is public unless it is made with
`SITE_STAGE=preview npm run build`; the stage is fixed at build time. Only a preview
build shows drafts and "Evidence pending" placeholders (`npm run test:e2e:preview`
checks that build). Content status lives in `src/content/projects.json`
(`placeholder` → `draft` → `approved`); only `approved` items with sanitized,
recorded evidence (`src/assets/evidence/manifest.json`) can render publicly.
Never deploy a preview build without access protection.

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
