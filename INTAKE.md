# New Client Intake Checklist

Fill this out with the client before starting a build. Answers here drive the first Claude Code prompt and which third-party services (if any) get added — see `CLAUDE.md`'s decision trees for forms, scheduling, payments, and gallery.

## Business basics
- Business name:
- One-line description of what they do:
- Target customer / audience:
- Existing branding? (logo, colors, fonts) Y/N — attach if yes:
- Reference sites they like (design direction), if any:

## Pages needed
- [ ] Home
- [ ] About
- [ ] Services
- [ ] Contact
- [ ] Gallery
- [ ] Other: ___________

## Contact form
- Needed? Y/N
- Expected volume: low / medium / high
- → Low/medium: Formspree (default). High: revisit at build time.

## Scheduling
- Needed? Y/N
- Calendly or Cal.com preference, if any:

## Payments
- Needed? Y/N
- One-time payments or recurring/subscriptions?
- Stripe or PayPal preference, if any:

## Gallery / photos
- Needed? Y/N
- How often will photos be added/updated? rarely / occasionally / frequently
- Who will be adding them — the client directly, or always routed through the developer?
- → Rare/occasional + routed through developer: manual GitHub upload (default, no new account).
- → Frequent + client self-serves: consider a dedicated image host (adds one account).

## Content ownership going forward
- Will the client ever want to edit content himself, or is this developer-maintained indefinitely?
- If self-editing is wanted: will the client use Claude Code directly, or always route requests through the developer?

## Domain
- Does the client already own a domain? Y/N
- If not, who's registering it — the client or the developer (should always end up owned by the client)?

## Notes
-
