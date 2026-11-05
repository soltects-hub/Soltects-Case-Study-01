# Fieldstone Roofing & Exteriors
### A Soltects Case Study — Website Development & Conversion Optimization

*Soltects Case Study 01. This is a self-initiated portfolio project. Fieldstone Roofing &
Exteriors is a fictional business created to demonstrate Soltects' research, strategy, design,
and development process — it is not a real client, and no real-world business results are
claimed anywhere in this document.*

---

## 1. Project overview

Soltects set out to produce a portfolio-grade demonstration of full-service website work — market
research through to a tested, deployable site — aimed at US small-business owners in a specific,
underserved category. Rather than design a generic template and dress it up with stock photography,
we ran the project the way we'd run a real engagement: pick an industry based on evidence, build an
original brand, design and build a real working site, test it, and document what we actually found.

**What this document covers:** the research behind the industry choice, the brand and UX decisions
and why we made them, the technical build, the SEO and accessibility implementation, and the actual
(not estimated) results of testing the finished site.

## 2. Industry background

Residential roofing is a high-consideration, high-ticket home-services category ($9,000–$25,000+
for a full replacement) with two customer paths: planned replacement/repair, and storm-damage work
that often runs through a homeowner's insurance claim. Full background and sourcing is in
`01-research.md`; in short, the category combines three things that make it a strong case-study
subject: a well-documented website-quality gap relative to spend, a genuine (not invented) UX
problem around insurance-claim trust, and strong, honest visual storytelling potential.

## 3. Research findings

See `docs/01-research.md` for the full comparison table, sourcing, and caveats. Headline findings
that shaped this build:

- Roofing-specific website content is widely reported as underperforming — agency research puts
  the share of roofing site content earning zero organic traffic as high as 98% (unverified
  primary source, but a consistent directional signal across multiple agency writeups).
- Mobile click-to-call and a persistent mobile CTA are the most consistently cited, highest-leverage
  pattern for contractor sites.
- The insurance-claim journey is where trust is won or lost — pages that explain the real,
  step-by-step process outperform pages that lead with "we work with insurance."
- WCAG 2.1 AA is the practical industry-recommended accessibility target for a small business site,
  even though it isn't a blanket legal mandate for private businesses today.

## 4. The business problem

A homeowner searching for a roofing contractor — especially right after a storm — is choosing
between a dozen look-alike sites with thin service pages, aggressive popups, and vague claims about
insurance help, while trying to make a high-stakes decision under time pressure. The opportunity is
a site that is simultaneously **faster to act on** (clear CTA, click-to-call, short forms) and
**more honest** (plain-language process explanation, no fabricated trust signals) than the category
norm — without sacrificing design quality, which is the thing that makes a visitor believe the
"honest and fast" part in the first place.

## 5. Project objectives

1. Build a premium, credible brand for a fictional but realistic regional roofing contractor.
2. Design and build a fully functional, responsive, accessible multi-page site — not a mockup.
3. Make the conversion path (free inspection request, click-to-call) the obvious, singular next
   step on every page.
4. Give the storm/insurance-claim customer a genuinely useful, trust-building explanation of the
   real process, instead of marketing copy.
5. Implement real technical SEO fundamentals (metadata, structured data, sitemap, URL structure).
6. Test the finished build and report actual, measured results — not projections dressed up as
   outcomes.

## 6. Strategy

We treated this as two separate audiences sharing one site (see `03-ux-conversion-strategy.md`):
the planned-project researcher and the post-storm, higher-urgency homeowner. Content, CTA
language, and the quote form's branching logic (an explicit "is this storm/insurance related?"
question) are built around that split rather than a single generic funnel.

## 7. Creative direction

Full rationale in `02-brand-strategy.md`. In short: we deliberately avoided the two default
contractor palettes (safety-orange/navy, or red-white-blue) and the bold-grotesk "tech startup"
look most contractor templates default to, in favor of a warm, editorial palette (deep slate-green
ink, brick-red accent, warm paper background) and a serif/sans pairing (Fraunces + Inter) meant to
read as an established regional business rather than a lead-gen landing page.

## 8. UX/UI decisions

Full rationale in `03-ux-conversion-strategy.md`. Key decisions: one primary + one secondary CTA
per page, a sticky mobile call bar, native mobile input types on every form field, inline
field-level validation, and a transparent "here's what happens after you submit" sequence on the
quote form instead of a generic confirmation message.

## 9. Development process

Built as a static, dependency-free HTML/CSS/JS multi-page site (no framework, no build step) —
see `04-technical-architecture.md` for the full reasoning. Design tokens (`css/tokens.css`) drive
every color/spacing/type decision in `css/base.css`, so the whole site shares one consistent
system rather than per-page one-off styling. A single `js/main.js` file progressively enhances
navigation, the FAQ accordion, scroll-reveal, and form validation/submission — the site remains
usable with JavaScript disabled.

## 10. Technical architecture

See `04-technical-architecture.md` for the full breakdown: file structure, CSS/JS architecture,
the demo backend (`site/api/server.js`) and what a production deployment would still need to add
(a real email/SMS provider — explicitly flagged as a dependency, not faked), and the Vercel
deployment configuration (`site/vercel.json`).

## 11. SEO implementation

See `docs/05-seo-implementation.md` for the full per-page metadata table and structured-data
inventory. Summary: unique titles/descriptions and canonicals on every page, Open Graph tags on
key pages, `RoofingContractor`/`Service` JSON-LD, a complete `sitemap.xml`, and a `robots.txt`
that disallows only the non-content `/api/` routes.

## 12. Conversion strategy

See `docs/03-ux-conversion-strategy.md`. No conversion-rate improvement is claimed — there is no
live traffic to measure against. The strategy is justified by cited category research and internal
design logic (fewer competing CTAs, mobile-first call-to-action placement, process transparency in
place of fabricated trust signals), and is explicitly testable in a way a future real deployment
could A/B test.

## 13. Testing methodology

Tested locally against the project's own demo server (`node site/api/server.js`), using:

- **Google Lighthouse** (via Chrome headless, the Playwright Chromium already present in this
  environment) for Performance, Accessibility, Best Practices, and SEO scores on representative
  pages (home, a service page, the quote form).
- **Playwright-driven screenshots** at mobile (390×844), tablet (834×1194), and desktop
  (1440×900) viewports for the homepage, services hub, storm/insurance page, quote form, and FAQ.
- **A custom internal link checker** (`tests/linkcheck.js`) that crawls every internal link and
  asset reference from all 13 pages and reports any non-2xx response.
- **Manual functional testing** of both forms (valid submission, each validation error state, the
  honeypot field) against the demo API.
- **Manual keyboard-only navigation pass** (tab order, focus visibility, Escape-to-close on the
  mobile nav, accordion operation).

See `docs/06-testing-results.md` for the actual output of every one of these — numbers, not
descriptions of numbers.

## 14. Actual results

Full methodology and raw output in `docs/06-testing-results.md`. Headline numbers, all measured
locally against the project's own demo server (`node site/api/server.js`), not estimated:

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Homepage — desktop | 100 | 100 | 100 | 100 |
| Homepage — mobile (throttled) | 92 | 100 | 100 | 100 |
| Storm & insurance claims page — desktop | 100 | 100 | 100 | 100 |
| Quote form page — desktop | 100 | 100 | 100 | 100 |

The accessibility column reads 100 across the board, but it didn't start that way: the first
Lighthouse pass scored 91/100 on the homepage and caught three real defects — insufficient color
contrast on several text/button combinations, three skipped heading levels, and a footer link
distinguishable by color alone. All three are detailed and fixed in `06-testing-results.md`, along
with two layout bugs the responsive-screenshot pass caught (scroll-reveal content that was
invisible without JavaScript, and a pale-on-white heading contrast bug inside one card). Zero
broken internal links (23 checked), zero browser console errors across
all 13 pages, and the quote/contact forms were functionally tested end-to-end against the demo
API including validation errors and the honeypot spam trap.

## 15. Limitations

- **No real photography.** This environment's network policy blocked Unsplash/Pexels/Pixabay
  during the build (see `07-asset-licensing.md`); the site currently uses original SVG/CSS art
  direction in place of photography. This is flagged, not hidden.
- **No live deployment or real traffic.** All testing is local. There is no analytics data, no
  A/B test, and no real conversion-rate figure — any such claim would be fabricated, so none is
  made.
- **No real email/SMS delivery** on form submission — the demo backend validates and stores
  submissions locally; a production deployment needs a transactional email/SMS provider, named
  explicitly as a dependency in `04-technical-architecture.md`.
- **Fictional business.** Fieldstone Roofing & Exteriors has no real history, reviews,
  certifications, or team — by design, per the brief's own constraints on this exercise.
- **WCAG 2.1 AA is a design target, verified by the specific automated and manual checks listed in
  section 13**, not a certified audit by a third-party accessibility auditor.

## 16. Final project screenshots

Fifteen screenshots in `/screenshots/`: the homepage, services hub, storm & insurance claims
page, quote form, and FAQ, each at mobile (390×844), tablet (834×1194), and desktop (1440×900) —
`home-desktop.png`, `home-tablet.png`, `home-mobile.png`, `services-desktop.png`, and so on,
following the pattern `{page}-{breakpoint}.png`.
