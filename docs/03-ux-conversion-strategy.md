# Conversion & UX Strategy

## Customer journey this site is designed around

Two distinct intents share this site, and the design treats them differently rather than
funneling everyone into one generic "contact us" box:

1. **Planned replacement/repair** — a homeowner noticed an issue or is budgeting ahead. Lower
   urgency, more research behavior (reads service pages, FAQ, pricing/financing info).
2. **Post-storm, possibly insurance-driven** — higher urgency, higher anxiety, often comparing
   multiple contractors quickly, specifically worried about the insurance process.

The homepage, the storm-damage service page, and the quote form all branch for this — the quote
form explicitly asks "Is this related to a storm or insurance claim?" so the business can respond
differently in practice, and the content on the storm page is written to reduce anxiety rather than
add urgency, per the research in `01-research.md` section 3.3.

## Primary and secondary CTA

Every page has exactly one primary action — **Request a Free Inspection** (brick-colored button,
same label sitewide) — and one secondary action — **click-to-call**. No page presents three
equally-weighted buttons; that forces a decision instead of giving the visitor one. This directly
follows the research finding that click-to-call and a single clear next step are the
highest-leverage, best-evidenced levers for contractor sites (see `01-research.md`, mobile UX
section).

## Mobile-first decisions

- **Sticky mobile call bar** (`.call-bar`, visible under 640px): "Call Now" and "Free Inspection"
  stay reachable at the bottom of the screen on every scroll position, so a phone visitor never
  has to scroll back up to convert. This is the single change industry sources most consistently
  point to for contractor sites.
- **The phone number is a real `tel:` link everywhere it appears** — header, hero, call bar,
  footer, every CTA band — not an image or styled text.
- **Forms use native mobile input types** (`type="tel"`, `type="email"`, `inputmode="numeric"` for
  ZIP) so the correct keyboard shows up automatically.
- **No modal interstitials, no scroll-triggered popups.** Several competitor-structure sources
  flagged aggressive popups as a trust-eroding pattern; this site has none.

## Trust-building without fabrication

The brief explicitly forbids fake reviews, awards, certifications, and invented company history.
Rather than leave a trust-signal-shaped hole on the page, the site builds trust through
**process transparency** instead of claimed authority:

- The storm/insurance page states plainly what the contractor does and does not control — this
  mirrors the single clearest finding from claims-process research (section 3.3 of
  `01-research.md`): pages that explain the real process build more trust than pages that lead
  with "we work with insurance."
- The quote form tells the visitor exactly what happens after they submit (three concrete steps,
  with a realistic response-time expectation) instead of a generic "we'll be in touch."
- The FAQ answers the skeptical questions directly (e.g. "is the inspection really free," "do you
  work directly with my insurer") rather than only the easy ones.

## Form design decisions

- **One field per logical unit**, grouped visually (contact info → address → service →
  insurance-claim branch → notes → consent) so the form reads as a short sequence, not a wall.
- **Insurance-claim question is a required radio, not a checkbox**, because "not sure" is a
  legitimate and common answer that a yes/no checkbox can't represent — forcing a false binary
  here would produce bad lead-routing data.
- **Consent checkbox is explicit and required** before submission, stating plainly how the
  business will make contact (phone/text/email) — a GDPR/consumer-protection-minded pattern, not
  just a legal CYA.
- **Honeypot field, not a CAPTCHA**, to filter basic bots without adding friction for real
  homeowners filling this out on a phone in bad lighting on a job site.
- **Validation errors are inline, specific, and attached to the field** (not a single banner at
  the top) so a visitor fixing an error doesn't lose their place.

## What we are not claiming

No conversion-rate lift is claimed anywhere in this document or in the case study. The decisions
above are justified by (a) general, cited UX/CRO research about this category, and (b) internal
design logic (fewer choices, clearer next step, explicit process). None of it has been A/B tested
against a control, because there is no live traffic to test against — this is stated plainly in
`docs/case-study.md`, "Limitations."
