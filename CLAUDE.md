# Client Site — Claude Code Instructions

## Project Overview

This is a starter template for small-business client sites, built with Astro and deployed to Vercel. It was created from `ryanpsheridan/client-site-starter` — a reusable base with clean design tokens, accessibility-first defaults, and SEO/AEO baked in from the first commit.

Design tokens live in `src/styles/tokens.css`. Site-wide values (business name, description, contact info, nav links) live in `src/consts.ts` — fill these in first for any new client project before touching anything else.

## First Steps On A New Client Project

1. Fill in `src/consts.ts` with the real business name, description, phone, email, and nav structure.
2. Replace placeholder copy in `src/pages/index.astro`, `about.astro`, `services.astro` with the client's real content.
3. Update `astro.config.mjs`'s `site` value to the client's real domain once known.
4. Replace `public/favicon.svg` and `public/images/og-default.png` with the client's real branding.
5. Re-theme `src/styles/tokens.css` — swap `--color-accent*` and `--color-bg*` for the client's brand colors. Everything else in the site reads from these tokens, so a full re-skin should only require editing this one file.
6. Delete or repurpose `src/pages/how-this-works.astro` once the client no longer needs the live pitch walkthrough (it's `noindex`, so it's harmless to leave, but it's not meant to be permanent client-facing content).

## Typography

- Font: **DM Sans** for both body and headings (`--font-sans` / `--font-heading` in `tokens.css`), loaded via Google Fonts in `BaseHead.astro`.
- Don't introduce a second typeface without updating both the token and the Google Fonts `<link>` together.

## Accessibility — Non-Negotiable Defaults

- Every interactive element must have a visible focus state — never add `outline: none` without replacing it with an equally visible alternative (`global.css` already handles this globally via `:focus-visible`).
- Every page keeps the skip-to-content link (`BaseLayout.astro`) — don't remove it even if it "isn't needed" for a short page.
- All images require descriptive `alt` text — never `alt=""` unless the image is genuinely decorative (and say so with an empty string deliberately, not by omission).
- Respect `prefers-reduced-motion` for any new animation — `global.css` already disables transitions/animations under that media query; new custom animations must check for it too.
- Form fields always get a real `<label for>` — never a placeholder-only field.
- Color is never the only signal for state (error, success, required) — pair it with text or an icon.
- Maintain WCAG AA contrast (4.5:1 for body text) when re-theming `tokens.css` for a client's brand colors — check new `--color-text` / `--color-bg` combinations before committing.

## SEO / AEO — Baked In From The Start

- Every page passes a unique `title` and `description` to `BaseLayout`/`BaseHead` — no page should reuse another page's description.
- Titles should read naturally for both search engines and AI answer engines — phrase them the way a person would actually search or ask, not keyword-stuffed.
- `@astrojs/sitemap` is already wired in `astro.config.mjs` — no manual sitemap maintenance needed.
- Add JSON-LD structured data per page where it makes sense (the homepage already has a `LocalBusiness` example in `index.astro` — swap the `@type` for whatever fits the client's actual business).
- Internal links between pages (e.g. a service page linking to the contact page) should read naturally in body copy, not just exist in nav.
- Heading hierarchy must be logical: one `<h1>` per page, `<h2>` for major sections, never skipping a level.
- Canonical URLs and Open Graph/Twitter tags are handled automatically by `BaseHead.astro` — don't hand-roll these per page.

## Forms — Decision Tree

Default: **Formspree**. A form's `action` points at `https://formspree.io/f/{FORM_ID}` (see `src/pages/contact.astro`) — submissions land straight in the client's inbox, no backend code, free tier covers low-volume sites.

Only reach for something else if:
- Formspree's free-tier submission limit becomes a real constraint → switch to **Basin** (same pattern, different URL).
- The form needs custom logic a form service can't do (writing to a database, conditional routing) → build a Vercel Serverless Function instead (see SimplySheet's `api/poll.js` for the pattern this repo's sibling project uses).

The Formspree (or equivalent) account belongs to the **client**, not the developer — it's his inbox the submissions land in.

## Scheduling — Decision Tree

Default: **Calendly** embed/link, under the client's own account (it's his calendar). Use **Cal.com** instead only if the client specifically prefers an open-source alternative to Calendly's branding/free-tier limits.

## Payments — Decision Tree

Default: **Stripe Payment Links** — no code, a hosted checkout page the client links or embeds a button to. Use **Stripe Checkout (embedded)** instead only if the client wants the payment flow to feel fully inside the site rather than a redirect. Use **PayPal Buttons** only if the client already uses/strongly prefers PayPal over Stripe.

The payment account is always the client's — it's his money.

## Gallery / Photo Uploads — Decision Tree

Default: manual upload via GitHub's web UI (`public/images/gallery/`, see naming convention below) — zero new accounts, fine for clients who update photos occasionally.

Only reach for a dedicated image host (Cloudinary or similar) if the client updates the gallery frequently/independently and the friction of the GitHub UI becomes a real recurring pain point. That's a deliberate tradeoff (one more account with its own login/password/emails) — don't default to it.

**Naming convention**: `public/images/gallery/{descriptive-slug}.{ext}` — e.g. `public/images/gallery/storefront-exterior.jpg`, not `IMG_4821.jpg`. Always pair a new image with real, descriptive `alt` text in whatever page renders it (see `src/pages/gallery.astro`).

## Design Tokens

Use CSS variables from `src/styles/tokens.css` for all styling — never hardcode a color, spacing value, or font. Key tokens:

- Colors: `--color-text`, `--color-text-secondary`, `--color-bg`, `--color-bg-subtle`, `--color-border`, `--color-accent` (+ `-hover`/`-contrast`)
- Semantic accents (use sparingly, only for actual state — positive/caution/critical/info): `--color-accent-positive`, `--color-accent-caution`, `--color-accent-critical`, `--color-accent-info` (each with a matching `-bg` variant)
- Spacing: `--space-xs` through `--space-3xl`
- Typography: `--text-small`, `--text-body`, `--text-h3`/`--text-h2`/`--text-h1`, `--text-display`
- Weights: `--weight-normal`, `--weight-medium`, `--weight-semibold`, `--weight-bold`
- Radius/shadow: `--radius-sm`/`-md`/`-lg`, `--shadow-sm`/`-md`

## Deployment

- Hosted on **Vercel**, connected directly to the client's GitHub repo — every push to `main` deploys automatically. No manual deploy step.
- Preview deployments are generated for every PR/branch push and commented directly on the GitHub PR.
- No separate staging environment needed for a site this size — PR previews serve that purpose.
