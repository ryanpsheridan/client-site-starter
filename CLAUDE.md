# Client Site — Claude Code Instructions

## Project Overview

This is a starter template for small-business client sites, built with Astro and deployed to Vercel. It was created from `ryanpsheridan/client-site-starter` — a reusable base with clean design tokens, accessibility-first defaults, and SEO/AEO baked in from the first commit.

Design tokens live in `src/styles/tokens.css`. Site-wide values (business name, description, contact info, nav links) live in `src/consts.ts` — fill these in first for any new client project before touching anything else.

## Build & Handoff Sequence

**Default path**: build the site solo in your own GitHub/Vercel accounts, and only transfer ownership to the client once they've approved a preview link. Assume the client has little to no technical experience — you'll be assisting with every third-party account setup (by call or written instructions), but every account is still created with the client's own email/info, never yours.

1. **Build solo.** Create the repo under your own GitHub account and import it into your own Vercel project. Wire up any forms/scheduling/payments against a temporary/sandbox account of your own during development, so real functionality can be tested before the client is involved at all.
2. **Share a preview link** with the client for approval. Iterate until approved — no accounts needed on their end yet.
3. **Once approved, transfer ownership:**
   - GitHub: repo → Settings → Transfer ownership → client's account (preserves full history). Re-add yourself as a collaborator afterward.
   - Vercel: transfer the project to the client's account/team.
4. **Swap in the client's real third-party accounts.** Help the client set up Formspree, Calendly, Stripe, etc. (per the decision trees below) under their own email — via call or a well-structured instructions email — then swap the placeholder/sandbox endpoints from step 1 for their real ones.
5. **Domain.** Help the client register or point their domain, then connect it in the now-transferred Vercel project.
6. **Google Search Console.** Help the client set it up under their own Google account, submit the sitemap, request indexing.
7. **Optional — self-editing setup.** Only if intake indicated the client wants to edit the site themselves going forward:
   - Editing via Claude Code directly (open-ended, any part of the site) — help them set up their own Claude account (Pro/Max). No further "connection" step is needed: Claude Code just operates on whatever repo is in front of it, so once they own the repo and have their own Claude account, they can start a session against it themselves.
   - Editing via Decap CMS (structured fields only, no coding knowledge, best for blog-style content) — see "Content Editing / Light CMS" below.
   - A mix of both, or fully developer-handled with no self-editing at all — the default, no extra setup.

**Important nuance, applies to every account creation step above and everywhere else in this doc**: assisting a client on a call or via instructions is not the same as owning the account on their behalf. Every account (GitHub, Vercel, Formspree, Calendly, Stripe, Google) gets created with the client's own email — never yours — and for anything involving sensitive personal/financial info (Stripe bank/tax details especially), have the client type those fields in themselves even during an assisted screen-share, rather than entering them for them. Recovery emails, phone numbers, and 2FA on every account should be the client's, never yours, so they're never locked out of their own accounts later.

**Alternate path — technical client wants to self-serve immediately**: some clients would rather set up their own GitHub/Vercel from day one instead of receiving a transfer later. This is a fine substitute for steps 1 and 3 above (skip straight to building in the client's own accounts, with the developer added as a collaborator) — the rest of the sequence (forms/scheduling/payments/domain/GSC/self-editing) proceeds the same either way. `SETUP.md` documents this alternate path for a client who wants to follow it directly.

## First Steps On A New Client Project

1. Fill in `src/consts.ts` with the real business name, description, phone, email, and nav structure. The favicon (`src/pages/favicon.svg.ts`) auto-derives from `SITE_TITLE`'s first letter, so this alone gives every new project a reasonable default with no manual asset work.
2. Replace placeholder copy in `src/pages/index.astro`, `about.astro`, `services.astro` with the client's real content.
3. Update `astro.config.mjs`'s `site` value to the client's real domain once known.
4. Once the client has real branding/a logo, replace the auto-generated favicon: delete `src/pages/favicon.svg.ts` and add a real static file at `public/favicon.svg` (or `.ico`/`.png`, updating the `<link>` in `BaseHead.astro` accordingly). Also replace `public/images/og-default.png`.
5. Re-theme `src/styles/tokens.css` — swap `--color-accent*` and `--color-bg*` for the client's brand colors. Everything else in the site reads from these tokens, so a full re-skin should only require editing this one file (also update the hardcoded fill in `favicon.svg.ts` to match, until it's replaced per step 4).
6. `src/pages/setup.astro` (`/setup`) is your own reference page — not linked anywhere on the site, not shown to the client. Use it while pitching/building; see "Before Launch" below for when to remove it.

## Before Launch

`src/pages/setup.astro` is `noindex` and unlinked, so it's harmless to leave temporarily, but must not ship to production long-term:

- Delete `src/pages/setup.astro`.
- See that page itself for the full pre-launch checklist (placeholder content, domain, Search Console) while it still exists.
- To hand the client their own setup steps, send `SETUP.md`'s content directly (email/text/shared file) — never point them at `/setup`, which is written for you, not them.

## Google Search Console

Set up once the site is live on its real domain:

- Property is verified under the **client's own Google account** — same ownership principle as every other third-party account in this project.
- Prefer a **Domain property** (DNS TXT verification, covers all subdomains/protocols) over URL-prefix, when the client can access their domain's DNS settings.
- Submit `sitemap-index.xml` (already generated by `@astrojs/sitemap`) under Sitemaps.
- Use URL Inspection → Request Indexing on the homepage and key pages after launch, and again any time a page's content changes substantially.

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

**Setup**: client signs up free at formspree.io using their own email, creates a new form in the dashboard, and copies the resulting `https://formspree.io/f/{form_id}` endpoint. Paste that into the `action` attribute in `src/pages/contact.astro`, replacing the `FORMSPREE_ID` placeholder, then submit a test entry after deploying to confirm delivery before considering the form done.

### Project intake / questionnaire form (portfolio site, not this template)

`INTAKE.md` in this repo is the developer-filled checklist for a live call. There's also a standing, self-serve version at https://www.ryansheridan.studio/project-questionnaire — a single questionnaire on the developer's own portfolio site (not duplicated per client project) that covers the same ground as `INTAKE.md`. Send that link to a prospective client, their answers land in the developer's inbox via Formspree, and those answers are what get pasted into the first Claude Code prompt on a fresh copy of this template to kick off the actual build.

This playbook documents that questionnaire's design so it can be maintained/rebuilt on the portfolio site if needed — it does not describe anything to build inside this template:

- **Layout**: single column, narrower than the site's normal max-width (~656px) — forms read better narrow. Group into named `<h2>` sections separated by dividers with equal spacing above and below; use uppercase `<h3>` sub-labels for related sub-topics within a section instead of a new divider every time.
- **Inputs**: stack every radio/checkbox group vertically, never side-by-side. Prefer multiple-choice over free text wherever the answer space is guessable (people often don't know exactly what they want — concrete options to react to beat a blank textarea), and always give an "Other" option a visible follow-up text field. Reserve one open-ended catch-all field for the end (framed as low-pressure, e.g. "want to just rant randomly?") so nothing forces itself into the structured questions.
- **Progressive disclosure**: hide follow-up questions that only make sense after a Yes/No answer, and reveal them via JS when selected — don't just de-emphasize them, actually hide them, so the form stays short at a glance.
- **Accessibility**: same non-negotiables as the rest of the site — real `<label for>` on every field, `<fieldset><legend>` around every option group, visible focus states, helper copy in a muted `<p class="field-note">` under the question (never a placeholder, which disappears on focus).
- **Tone**: reassuring and low-pressure — explicitly tell people it's OK to skip or guess ("Not sure yet? Pick what feels closest").
- **Submission**: same Formspree pattern as `contact.astro`, but via `fetch()` with `Accept: application/json` instead of a native POST, so a successful submit swaps in an inline "Thanks!" confirmation on the same page instead of redirecting to a third-party thank-you page. Include a honeypot field (`name="_gotcha"`, hidden from sighted and AT users) for basic spam protection.
- **Indexing**: mark the page `noindex` (it's a link sent directly to specific people, not meant to be discoverable) but leave `robots.txt` alone — blocking it there would also break link-preview bots (iMessage, Slack) from generating a preview card for the URL.

## Scheduling — Decision Tree

Default: **Calendly** embed/link, under the client's own account (it's his calendar). Use **Cal.com** instead only if the client specifically prefers an open-source alternative to Calendly's branding/free-tier limits.

## Payments — Decision Tree

Default: **Stripe Payment Links** — no code, a hosted checkout page the client links or embeds a button to. Use **Stripe Checkout (embedded)** instead only if the client wants the payment flow to feel fully inside the site rather than a redirect. Use **PayPal Buttons** only if the client already uses/strongly prefers PayPal over Stripe.

The payment account is always the client's — it's his money.

## Gallery / Photo Uploads — Decision Tree

Default: manual upload via GitHub's web UI (`public/images/gallery/`, see naming convention below) — zero new accounts, fine for clients who update photos occasionally.

Only reach for a dedicated image host (Cloudinary or similar) if the client updates the gallery frequently/independently and the friction of the GitHub UI becomes a real recurring pain point. That's a deliberate tradeoff (one more account with its own login/password/emails) — don't default to it.

**Naming convention**: `public/images/gallery/{descriptive-slug}.{ext}` — e.g. `public/images/gallery/storefront-exterior.jpg`, not `IMG_4821.jpg`. Always pair a new image with real, descriptive `alt` text in whatever page renders it (see `src/pages/gallery.astro`).

## Content Editing / Light CMS — Decision Tree

Default: **no CMS**. Most clients don't need one — occasional content changes routed through the developer (or the client describing changes in plain English via Claude Code) covers the large majority of sites. Don't add this by default; it's opt-in per client, same reasoning as Gallery's "don't default to a dedicated image host."

When to reach for it: the client specifically wants to edit content themselves on an ongoing basis without going through the developer or Claude Code each time — most commonly for a blog they'll post to regularly.

Recommended option: **Decap CMS** (free, open-source, git-based — formerly Netlify CMS).

- It's not a separate content database — it's a form-based UI (`/admin`) that writes the exact same markdown/frontmatter files this template's content collections already use. A save from the CMS is a git commit, indistinguishable from one made via Claude Code. Both the client (via the CMS) and the developer (via Claude Code) can post to the same blog without conflict.
- Best fit: blog posts, since Astro content collections (markdown + frontmatter) are exactly the shape Decap CMS expects. Fields can be as detailed as needed — title, slug, author, publish date, featured image, a full markdown rich-text body, tags, SEO meta fields, and repeatable field groups (e.g. FAQ question/answer pairs).
- Important limitation to set expectations on: Decap CMS only edits content that's been deliberately structured into a content file. Hardcoded copy inside a page's component (e.g. the homepage hero text in `index.astro`) isn't editable through the CMS out of the box — it would need to be extracted into a small data file (e.g. `src/content/home.json`) first, which is a one-time refactor per section made editable. Don't imply to a client that installing this gives them Webflow-style "click anywhere and edit" — it's closer to unlocking specific fields.
- Custom Astro/MDX components (this template's equivalent of SimplySheet's ProductPromo/Poll pattern) aren't freely composable through the CMS either — each one made available to the client needs its own explicit field definition (e.g. a dropdown to insert a predefined promo), not open-ended authoring.
- Setup isn't as turnkey as Formspree/Calendly/Stripe: Decap CMS needs an OAuth backend to authenticate the client against GitHub, and since this template deploys to Vercel (not Netlify, where Decap's auth is native), that backend has to be a small serverless function added to the project. Research the current recommended approach for wiring Decap CMS's GitHub OAuth flow on Vercel before implementing this for a real client — the ecosystem around this shifts, so verify rather than assuming the setup is a five-minute account signup like the other decision trees.
- Access to `/admin` should be gated to the client (and the developer) — never left open to the public.

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
