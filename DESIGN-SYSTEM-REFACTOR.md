# Design System Refactor — Update Prompt

Paste the section below into a fresh Claude Code session on this repo. It is
self-contained: the grounding context, the locked decisions, and the audit
findings it responds to are all included, so it does not depend on the rest of
this file.

**Decisions locked before writing this prompt:**

- Scope: tokens + component layer + full page refactors
- Typeface: DM Sans stays (both heading and body)
- Dark mode: structure the tokens for it, ship light-only
- Nav: add a horizontal desktop nav, keep the overlay on mobile
- Motion: micro-interactions only, no scroll-reveal
- Monochrome rule preserved: `--color-ink` for buttons, accent for links only
- Spacing: numeric token names, old t-shirt tokens deleted (not aliased)

---

## The prompt

Refactor this Astro template's design system to read like a top-tier, design-first
product site (Stripe, Uber, Linear): intentional whitespace, strict typographic
hierarchy, subtle layering, functional minimalism. Work in three ordered phases —
do not start a phase until the previous one builds clean.

### Grounding & architecture

**Stack:** Astro 7, vanilla CSS, no Tailwind, no CSS-in-JS. `tokens.css` (94 lines)
→ `global.css` (155 lines) → imported once by `BaseHead.astro`. All other styling
lives in Astro-scoped `<style>` blocks across 7 pages and 4 components (~2,700
lines total). This is a reusable starter template for small-business client sites,
re-themed per client by swapping accent and background tokens.

**Locked decisions — do not relitigate:** full-scope refactor (tokens + component
layer + page refactors); DM Sans stays for all text; dark mode structured but not
shipped; add a horizontal desktop nav alongside the existing full-screen mobile
overlay; micro-interactions only, no scroll-reveal; monochrome with blue links only.

**Resolutions on previously open questions:**

- *Spacing:* migrate to a numerically-named scale and **delete the old t-shirt
  tokens entirely**. Do not alias them. A missed call site must fail loudly (an
  undefined custom property invalidates the declaration and collapses the spacing
  visibly) rather than silently shifting.
- *Global paragraph color:* remove it. Body copy defaults to `--color-text`;
  secondary tone becomes opt-in.
- *Mobile menu:* keep the full-screen overlay as-is. Only add the desktop nav.

### Hard constraints, none negotiable

- DM Sans stays the only typeface, headings and body alike. Refinement comes from
  tracking, weight, size, and line-height — not a new face.
- Stay monochromatic: `--color-ink` for primary buttons and high-emphasis
  controls, `--color-accent` for inline links only. Semantic accents stay reserved
  for real state.
- The system must survive a client swapping `--color-accent` and `--color-bg` for
  their own brand colors — that is this template's whole purpose. Nothing may
  hardcode a hue that assumes blue.
- Ship light-only, but name and layer the tokens so a `prefers-color-scheme: dark`
  block is a later drop-in with no renaming.
- Every accessibility rule in `CLAUDE.md` holds: visible focus on all interactive
  elements, skip link intact, real `<label for>`, descriptive alt text, color never
  the sole state signal, WCAG AA contrast (4.5:1 body), `prefers-reduced-motion`
  respected by every new transition.

### Phase 1 — rewrite `src/styles/tokens.css`

**Spacing.** The current ramp (`0.5 / 0.75 / 1 / 1.75 / 3 / 5 / 7.5rem`) has
inconsistent ratios and no step between 1rem and 1.75rem, which forces
`--space-lg` to serve as both card padding and grid gap. Replace it with a 4px
grid under numeric names, and delete the old tokens:

```
--space-1: 0.25rem;   /*   4px */
--space-2: 0.5rem;    /*   8px */
--space-3: 0.75rem;   /*  12px */
--space-4: 1rem;      /*  16px */
--space-5: 1.5rem;    /*  24px */
--space-6: 2rem;      /*  32px */
--space-7: 3rem;      /*  48px */
--space-8: 4rem;      /*  64px */
--space-9: 6rem;      /*  96px */
--space-10: 8rem;     /* 128px */
```

Migration reference — apply as a starting point, but re-pick each call site
deliberately rather than running a find-and-replace:

| Old | Literal | New | Notes |
|---|---|---|---|
| `--space-xs` | 0.5rem | `--space-2` | direct |
| `--space-sm` | 0.75rem | `--space-3` | direct |
| `--space-md` | 1rem | `--space-4` | direct |
| `--space-lg` | 1.75rem | `--space-5` *or* `--space-6` | 5 for gaps and stacks, 6 for card padding — this split is the point of the new scale |
| `--space-xl` | 3rem | `--space-7` | direct |
| `--space-2xl` | 5rem | `--space-9` | section padding grows 80px → 96px |
| `--space-3xl` | 7.5rem | `--space-10` | hero padding grows 120px → 128px |

Net intent: whitespace grows at the section level, tightens inside components.

**Typography.** Keep the fluid `clamp()` scale and the three-weight ceiling (no
700 — semibold is the heaviest weight in the system). Add what's missing:

- Tracking tokens: `--tracking-tight` (-0.02em), `--tracking-snug` (-0.01em),
  `--tracking-normal` (0), `--tracking-caps` (0.06em). Apply negative tracking to
  display/h1/h2 — the system currently has exactly one orphan `-0.01em` on the
  site logo and nothing else.
- Line-height tokens: `--leading-display` (1.05), `--leading-tight` (1.15),
  `--leading-snug` (1.3), `--leading-body` (1.6). Stop applying a flat 1.2 across
  h1–h5; display and h1 take display/tight, h4 and h5 take snug.
- An eyebrow/overline treatment: small, uppercase, `--tracking-caps`,
  `--weight-medium`, secondary color. This does more work than anything else in
  the reference aesthetic and the system has no equivalent today.
- Tighten `--text-display`'s lower clamp bound so it doesn't collapse toward h1 at
  mid-size viewports.

**Color.** Split into a raw palette layer and a semantic layer that references it.
This indirection is what makes dark mode a later drop-in rather than a second
rewrite. The semantic layer needs:

- Surfaces: `--surface-page`, `--surface-raised`, `--surface-sunken`, replacing
  the single `--color-bg-subtle`.
- Borders: `--border-hairline`, `--border-default`, `--border-strong`, replacing
  the single `--color-border`.
- Text: keep `--color-text` and `--color-text-secondary`, add
  `--color-text-tertiary` for captions and metadata.
- Semantic accents (positive/caution/critical/info) carry over unchanged.

**Shadows.** Replace the two single-blur shadows with multi-layer stacks — layering
in this aesthetic comes from stacked low-opacity shadows plus hairline rings, not
one soft blur. Provide `--shadow-xs` through `--shadow-lg` plus a `--ring` inset
hairline, all derived from a neutral, hue-agnostic base.

**Motion.** The system has none today — durations are hardcoded per component
(`0.1s`, `0.15s`, `0.2s`, `0.25s`) with the browser-default `ease`. Add:

```
--duration-fast: 120ms;
--duration-base: 200ms;
--duration-slow: 320ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

Every transition in the codebase must then reference these — no raw durations and
no bare `ease` left anywhere.

**Layout widths.** `--content-width: 1120px` is currently the only width token,
while `640px` / `720px` / `560px` / `420px` measures are hardcoded across six
files. Add `--measure-narrow` (~560px), `--measure` (~640px), `--measure-wide`
(~720px) and use them at every one of those literals.

### Phase 2 — build a component layer in `src/styles/global.css`

`global.css` currently exposes only `.btn`, `.container`, `.skip-link`, and
`.visually-hidden`. Everything else is duplicated into page-scoped `<style>`
blocks. Add real shared classes:

- `.card` — the border + radius + padding pattern currently redeclared **6 times**.
  Plus `.card-interactive` with a hover state (border, shadow, small translate);
  cards are entirely static today.
- `.section` — currently redeclared in **5 pages**. Plus `.section-tight` and
  `.section-loose`. Uniform section padding is a large part of why the page rhythm
  reads flat.
- `.grid-auto` — replaces **8** hardcoded `repeat(auto-fit, minmax(240px, 1fr))`
  declarations, with the min track exposed as a `--grid-min` custom property.
- `.field` — the input/label/textarea styling duplicated verbatim in
  `ContactForm.astro:33-53` and `style-guide.astro:392-412`. Add a real `:focus`
  border-color change (today only the global focus ring fires), plus hint and
  error slots that pair text with the semantic color rather than relying on color
  alone.
- `.btn` — add a `transition` (it declares none today, so hover snaps), an
  `:active` state, and `.btn-sm` / `.btn-lg` size variants.
- `.eyebrow`, `.lead`, `.measure`, `.divider` utilities.

Also remove `global.css:53-56`'s blanket `p { color: var(--color-text-secondary) }`.
Making every paragraph gray by default flattens the exact hierarchy this refactor
is building. Body copy defaults to `--color-text`; secondary tone becomes opt-in
via `.text-secondary`. This changes the look of every page — re-check each one.

### Phase 3 — refactor pages and components onto the system

Delete the now-duplicated scoped CSS from each file and consume the shared classes:

- `index.astro` — `.service-card`, `.benefit-card`, `.testimonial-card`,
  `.service-grid`, `.benefit-grid`, `.testimonial-grid`, `.section`, `.bg-subtle`
- `services.astro` — the three card patterns and five grid declarations
- `gallery.astro` — `.section`, plus the `rgba(20,20,20,0.9)` and
  `rgba(255,255,255,0.92)` lightbox literals at lines 394 and 412
- `about.astro`, `contact.astro` — `.section` and the hardcoded max-widths
- `style-guide.astro` — `.demo-card`, `.field`, `.card-grid`, and the
  `border-radius: 4px` literal at line 237
- `ContactForm.astro` — drop its local `.field` block entirely
- `setup.astro` — the `border-radius: 4px` literal at line 195

Scoped `<style>` blocks should end up holding only genuinely page-specific layout,
never re-implementations of shared patterns.

**`Header.astro`** needs three changes:

1. Add a horizontal desktop nav above a sensible breakpoint, keeping the
   full-screen overlay for mobile. The hamburger currently shows at every width.
2. Fix `.menu-item:hover` (lines 209-211), which changes `font-weight` and reflows
   the text on hover. Use color or an underline instead.
3. Replace the off-scale hardcoded `font-size: 1.6875rem` at line 201 with a scale
   token, and add a focus trap to the overlay while it's open.

**`style-guide.astro`** is the enforcement surface for all of this — treat it as
the deliverable, not an afterthought. It must document every new token group
(surfaces, borders, tracking, leading, motion, measures, shadow stack) and
demonstrate every new component class including hover, focus, and error states.
If something isn't on this page, it isn't in the system.

### Verification before calling it done

- `npm run build` passes clean.
- No hardcoded hex, `rgba()`, raw `px`/`rem` spacing, transition duration, or
  `repeat(auto-fit, minmax(...))` remains outside `tokens.css` and `global.css`.
  Exception: `favicon.svg.ts`, documented as intentionally hardcoded.
- No reference to a deleted `--space-{xs,sm,md,lg,xl,2xl,3xl}` token survives
  anywhere. Grep for them explicitly; a survivor collapses that spacing to zero.
- Re-verify contrast on every changed text/surface pairing, especially the new
  `--color-text-tertiary` and the Phase 2 body-copy change.
- Every new transition sits behind the existing `prefers-reduced-motion` block.
- Walk all seven pages and confirm nothing regressed from the spacing re-map.

---

## Audit findings this prompt is based on

Current state: Astro 7, vanilla CSS, no Tailwind. `tokens.css` (94 lines) →
`global.css` (155 lines) → imported by `BaseHead.astro`. All other styling lives in
Astro-scoped `<style>` blocks across 7 pages and 4 components.

**Strengths.** Token discipline is strong — nearly every color, space, and radius
reads from a variable. Accessibility defaults are real and working: global
`:focus-visible`, skip link, reduced-motion block, labeled fields throughout. The
three-weight ceiling is a good deliberate constraint.

**Gaps.**

1. **No component layer.** The card pattern is copy-pasted 6×, `.field` 2×,
   `.section` 5×, and `repeat(auto-fit, minmax(240px, 1fr))` 8×. A system that
   can't be retuned from one place isn't a system yet. This is the primary blocker.
2. **Uneven spacing ramp.** `0.5 / 0.75 / 1 / 1.75 / 3 / 5 / 7.5rem` — inconsistent
   ratios and no step between 1rem and 1.75rem, forcing `--space-lg` to serve as
   both card padding and grid gap.
3. **Soft typographic hierarchy.** No tracking tokens (one orphan `-0.01em` on the
   logo). Only two line-heights, with a flat `1.2` across h1–h5. No eyebrow/overline
   treatment. Global `p` color makes all body copy secondary-gray.
4. **No layering vocabulary.** One subtle background, one border color, two
   single-blur shadows.
5. **No motion tokens.** Four different hardcoded durations, all bare `ease`.
   `.btn` declares no transition at all; cards have no hover state.
6. **Ad-hoc layout widths.** Four different hardcoded max-widths across six files.
   Uniform section padding flattens vertical rhythm.
7. **Header issues.** Hamburger at all breakpoints; hover changes font-weight and
   reflows; off-scale hardcoded font size; no focus trap on the overlay.

**Token leaks** (the only ones found): `gallery.astro:394,412` (`rgba()` lightbox
overlays), `style-guide.astro:237` and `setup.astro:195` (`border-radius: 4px`
instead of `--radius-sm`), `Header.astro:201` (`font-size: 1.6875rem`).
`favicon.svg.ts:13` hardcodes `#2952CC` but is documented as intentional.

## Review notes

This prompt went through an external review pass. Two changes were adopted from it:
folding the grounding context into the prompt itself so it's self-contained, and
adding an explicit resolutions block so settled decisions can't be relitigated
mid-refactor.

The review also proposed compressing the prompt substantially, which was not
adopted — the compression removed every concrete value (spacing numbers, tracking,
leading, durations, easing curves) and the per-file deletion list, which would
force the implementing agent to re-derive decisions that were already made
deliberately. Specificity is the point of this document.

The one genuine defect the review surfaced: choosing "distinct spacing token names"
without saying what happens to the old ones. Resolved above in favor of numeric
names with the old tokens deleted rather than aliased, so a missed migration fails
visibly instead of shifting layout by a quarter rem.
