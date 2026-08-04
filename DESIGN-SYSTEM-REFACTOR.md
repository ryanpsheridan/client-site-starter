# Design System Refactor — Update Prompt

Paste the section below into a fresh Claude Code session on this repo. It assumes
the audit findings recorded at the bottom of this file.

**Decisions locked before writing this prompt:**

- Scope: tokens + component layer + full page refactors
- Typeface: DM Sans stays (both heading and body)
- Dark mode: structure the tokens for it, ship light-only
- Nav: add a horizontal desktop nav, keep the overlay on mobile
- Motion: micro-interactions only, no scroll-reveal *(assumed — not explicitly confirmed)*
- Monochrome rule preserved: `--color-ink` for buttons, accent for links only *(assumed — not explicitly confirmed)*

---

## The prompt

Refactor this Astro template's design system to read like a top-tier, design-first
product site (Stripe, Uber, Linear): intentional whitespace, strict typographic
hierarchy, subtle layering, functional minimalism. Work in three ordered phases —
do not start a phase until the previous one builds clean.

Hard constraints, none negotiable:

- DM Sans stays the only typeface, for headings and body alike. Refinement comes
  from tracking, weight, size, and line-height — not a new face.
- Stay monochromatic: `--color-ink` for primary buttons and high-emphasis
  controls, `--color-accent` for inline links only. Semantic accents stay
  reserved for real state.
- The system must survive a client swapping `--color-accent` and `--color-bg` for
  their own brand colors — that is this template's whole purpose. Nothing may
  hardcode a hue that assumes blue.
- Ship light-only, but name and layer the tokens so a `prefers-color-scheme: dark`
  block is a later drop-in with no renaming.
- Every accessibility rule in `CLAUDE.md` holds: visible focus on all interactive
  elements, skip link intact, real `<label for>`, descriptive alt text, color
  never the sole state signal, WCAG AA contrast (4.5:1 body), `prefers-reduced-motion`
  respected by every new transition.

### Phase 1 — rewrite `src/styles/tokens.css`

**Spacing.** Replace the current uneven ramp (`0.5 / 0.75 / 1 / 1.75 / 3 / 5 / 7.5rem`)
with a 4px-based scale that has a proper mid-range and more headroom at the top:

```
--space-2xs: 0.25rem;  --space-xs: 0.5rem;   --space-sm: 0.75rem;
--space-md:  1rem;     --space-lg: 1.5rem;   --space-xl: 2rem;
--space-2xl: 3rem;     --space-3xl: 4rem;    --space-4xl: 6rem;
--space-5xl: 8rem;
```

Note this shifts the meaning of the existing names — `--space-lg` goes 1.75rem →
1.5rem, `--space-2xl` goes 5rem → 3rem. Every usage site must be re-picked
deliberately, not find-and-replaced. Broad intent: card padding moves up to
`--space-xl`, standard section padding to `--space-4xl`, hero padding to
`--space-5xl`. Whitespace should grow at the section level and tighten inside
components.

**Typography.** Keep the fluid `clamp()` scale and the three-weight ceiling. Add
what's missing:

- Tracking tokens: `--tracking-tight` (-0.02em), `--tracking-snug` (-0.01em),
  `--tracking-normal` (0), `--tracking-caps` (0.06em). Apply negative tracking to
  display/h1/h2, `--tracking-caps` to the eyebrow/overline style.
- Line-height tokens: `--leading-display` (1.05), `--leading-tight` (1.15),
  `--leading-snug` (1.3), `--leading-body` (1.6). Stop applying a flat 1.2 to
  h1–h5 — display and h1 take `--leading-display`/`--leading-tight`, h4/h5 take
  `--leading-snug`.
- An eyebrow/overline treatment: small, uppercase, `--tracking-caps`,
  `--weight-medium`, secondary color. This is the piece doing the most work in
  the reference aesthetic and the system currently has no equivalent.
- Tighten `--text-display`'s lower clamp bound so it doesn't collapse toward h1 on
  mid-size screens.

**Color.** Split into a raw palette layer and a semantic layer that references it —
this indirection is what makes dark mode a later drop-in. Semantic layer needs:

- Surfaces: `--surface-page`, `--surface-raised`, `--surface-sunken` (replacing
  the single `--color-bg-subtle`).
- Borders: `--border-hairline`, `--border-default`, `--border-strong` (replacing
  the single `--color-border`).
- Keep `--color-text` / `--color-text-secondary` and add `--color-text-tertiary`
  for captions and metadata.
- Semantic accents carry over unchanged.

Keep the old token names as aliases pointing at the new semantic ones only if that
avoids a large mechanical diff; otherwise migrate cleanly and delete them.

**Shadows.** Replace the two single-blur shadows with multi-layer stacks — layering
in this aesthetic comes from stacked low-opacity shadows plus hairline rings, not
one soft blur. Provide `--shadow-xs` through `--shadow-lg` and a `--ring` inset
hairline. All must be derived from a neutral, hue-agnostic base.

**Motion.** The system currently has none — durations are hardcoded per component
(`0.1s`, `0.15s`, `0.2s`, `0.25s`) with the browser-default `ease`. Add:

```
--duration-fast: 120ms;  --duration-base: 200ms;  --duration-slow: 320ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

Every transition in the codebase must then reference these — no raw durations or
bare `ease` left anywhere.

**Layout widths.** `--content-width: 1120px` is currently the only width token,
while `640px` / `720px` / `560px` / `420px` measures are hardcoded across six
files. Add `--measure-narrow` (~560px), `--measure` (~640px), `--measure-wide`
(~720px) and use them everywhere those literals appear.

### Phase 2 — build a component layer in `src/styles/global.css`

`global.css` currently exposes only `.btn`, `.container`, `.skip-link`, and
`.visually-hidden`. Everything else is duplicated into page-scoped `<style>`
blocks. Add real shared classes:

- `.card` — the border + radius + padding pattern currently redeclared six times.
  Plus `.card-interactive` with a hover state (border, shadow, and a small
  translate), since cards are entirely static today.
- `.section` — currently redeclared in five pages. Plus `.section-tight` and
  `.section-loose` so vertical rhythm can vary; uniform section padding is a large
  part of why the page rhythm reads flat.
- `.grid-auto` — replaces the eight hardcoded
  `repeat(auto-fit, minmax(240px, 1fr))` declarations, with the min track exposed
  as a `--grid-min` custom property so callers can tune it.
- `.field` — the input/label/textarea styling duplicated verbatim in
  `ContactForm.astro` and `style-guide.astro`. Add a real `:focus` border-color
  change (today only the global focus ring fires), plus hint and error slots that
  pair text with the semantic color rather than relying on color alone.
- `.btn` — add a `transition` (it currently has none, so hover snaps), an
  `:active` state, and `.btn-sm` / `.btn-lg` size variants.
- `.eyebrow`, `.lead`, `.measure`, `.divider` utilities.

Also fix `global.css`'s blanket `p { color: var(--color-text-secondary) }`. Making
every paragraph gray by default flattens the exact hierarchy we're trying to
build. Body copy should default to `--color-text`; secondary tone becomes opt-in
via `.text-secondary`. This changes the look of every page — re-check each one
after.

### Phase 3 — refactor pages and components onto the system

Delete the now-duplicated scoped CSS from each file and consume the shared classes:

- `index.astro` — `.service-card`, `.benefit-card`, `.testimonial-card`,
  `.service-grid`, `.benefit-grid`, `.testimonial-grid`, `.section`, `.bg-subtle`
- `services.astro` — the three card patterns and five grid declarations
- `gallery.astro` — `.section`, plus replace the `rgba(20,20,20,0.9)` and
  `rgba(255,255,255,0.92)` lightbox literals with tokens
- `about.astro`, `contact.astro` — `.section` and the hardcoded max-widths
- `style-guide.astro` — `.demo-card`, `.field`, `.card-grid`, and the
  `border-radius: 4px` literal
- `ContactForm.astro` — drop its local `.field` block entirely
- `setup.astro` — the `border-radius: 4px` literal

Scoped `<style>` blocks should end up holding only genuinely page-specific layout,
not re-implementations of shared patterns.

**`Header.astro`** needs three changes:

1. Add a horizontal desktop nav above a sensible breakpoint, keeping the
   full-screen overlay for mobile. The hamburger currently shows at every width.
2. Fix `.menu-item:hover`, which changes `font-weight` and reflows the text on
   hover. Use color or an underline instead.
3. Replace the off-scale hardcoded `font-size: 1.6875rem` with a scale token, and
   add a focus trap to the overlay while it's open.

**`style-guide.astro`** is the enforcement surface for all of this — treat it as
the deliverable, not an afterthought. It must document every new token group
(surfaces, borders, tracking, leading, motion, measures, shadow stack) and
demonstrate every new component class including its hover, focus, and error
states. If something isn't on this page, it isn't in the system.

### Verification before you call it done

- `npm run build` passes clean.
- No hardcoded hex, `rgba()`, raw `px`/`rem` spacing, transition duration, or
  `repeat(auto-fit, minmax(...))` remains outside `tokens.css` and `global.css`.
  (Exception: `favicon.svg.ts`, which is documented as intentionally hardcoded.)
- Re-verify contrast on any changed text/surface pairing, especially the new
  `--color-text-tertiary` and the body-copy color change from Phase 2.
- Every new transition sits behind the existing `prefers-reduced-motion` block.
- Walk all seven pages and confirm nothing regressed visually from the spacing
  scale re-mapping.

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
