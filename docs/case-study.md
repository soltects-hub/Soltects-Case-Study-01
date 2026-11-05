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
| Homepage — mobile (throttled) | 91 | 100 | 100 | 100 |
| Storm & insurance claims page — desktop | 99 | 100 | 100 | 100 |
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

**A later production-readiness audit raised the bar further** (full account in
`06-testing-results.md` §0): a page-by-page visual review — not just automated pass/fail checks —
found that the mobile nav drawer had never actually opened to full height on any page, because
`backdrop-filter` on the header created an unintended CSS containing block for its `position:
fixed` descendant; that the hamburger icon was invisible on phone-width screens because flexbox
was crushing it to 0 width when the header row overflowed; and that desktop showed two
competing "request a quote"-style buttons side by side. All three passed every automated test in
this document throughout — `data-open` still flipped correctly, Lighthouse still scored 100,
links still resolved — because none of those tools inspect actual rendered layout. All three are
fixed and re-verified (storm-claims' Performance score moved 100→99 and LCP 0.5s→0.8s as the
measured cost of the new page-banner art added in the same pass, not from these fixes).

## 15. Limitations

- **No real photography.** This environment's network policy blocked Unsplash/Pexels/Pixabay
  (re-confirmed on a second check during the production-readiness audit, along with Wikimedia
  Commons and two government photo archives — same result). The site uses original SVG/CSS art
  direction in place of photography, now extended to every interior page banner plus a sitewide
  paper-grain texture for visual richness. Exact placements, sizes, and candidate licensed photos
  are documented in `08-photography-requirements.md`, ready to execute once the dependency clears.
- **No live deployment or real traffic.** All testing is local. There is no analytics data, no
  A/B test, and no real conversion-rate figure — any such claim would be fabricated, so none is
  made.
- **No real email/SMS delivery, and no real leads.** The demo backend validates and stores
  submissions in a local, untracked JSON file — no notification fires, nothing is followed up on,
  and any submission count mentioned in this project's testing records is this team's own
  functional-test data, never real-user traffic. Full limitations in
  `04-technical-architecture.md`, "Demo backend limitations."
- **Fictional business.** Fieldstone Roofing & Exteriors has no real history, reviews,
  certifications, or team — by design, per the brief's own constraints on this exercise.
- **WCAG 2.1 AA is a design target, verified by the specific automated and manual checks listed in
  section 13**, not a certified audit by a third-party accessibility auditor.

## 16. Final project screenshots

Thirty-nine screenshots in `/screenshots/`: **all 13 pages**, each at mobile (390×844), tablet
(834×1194), and desktop (1440×900), following the pattern `{page}-{breakpoint}.png`:

`home`, `about`, `services`, `roof-replacement`, `roof-repair`, `storm-claims`,
`gutter-replacement`, `quote`, `contact`, `faq`, `privacy-policy`, `terms`, `404` — each ×
`-mobile.png` / `-tablet.png` / `-desktop.png` (e.g. `home-desktop.png`, `about-mobile.png`,
`roof-replacement-tablet.png`). All 39 were captured after the production-readiness audit's fixes
(§14), so they reflect the shipped state, not an earlier draft.
