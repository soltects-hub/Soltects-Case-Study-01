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

## 16. Phase 2 — Cinematic redesign

After the Phase 1 build above shipped and tested clean, the project took on a second, much larger
phase: a full visual and interaction redesign using an Awwwards-tier cinematic site (era-residence.com)
as the creative benchmark, rebuilding every one of the 13 pages rather than refreshing the
homepage alone. Full creative-direction reasoning is in `docs/11-cinematic-redesign-plan.md`; the
short version:

- **The reference site was unreachable from this environment** (network policy blocks it, same as
  the stock-photo hosts in §15) — confirmed, not assumed, via curl, a fetch tool, and a search for
  any browser tool with independent network access. The redesign was built from the brief's own
  detailed interaction spec plus established conventions for this design genre, not from direct
  inspection of the reference site's live behavior. That's a real fidelity limitation, stated
  plainly rather than implied by a confident-sounding result.
- **New visual system**: full-viewport/large-format hero treatment, an editorial display type
  scale (Fraunces at up to ~8.5rem), asymmetrical split layouts in place of the original's centered
  card grids, a deeper near-black `--cinema` tone for full-bleed sections, and GSAP + ScrollTrigger
  (vendored locally, standard no-charge license) driving scroll-triggered reveals, subtle parallax,
  and one deliberate pinned sequence (the "Our Process" section) — never scroll-hijacking the page.
- **Photography remained blocked** (§15, re-confirmed again this phase) and the brief explicitly
  ruled out AI-generated or stock-lookalike substitutes. In its place: original parametric SVG
  line-elevation illustrations (house/roofline outlines, generated with seeded variation, not
  photographs) for every hero, service page, and gallery placement — each one labeled "illustrative
  concept" in both visible caption text and `alt` text, never presented as a real completed project.

## 17. New interactive features

Built on the new design system (`site/css/cinematic.css`, `site/js/cinematic.js` and four
component scripts): a full-screen animated navigation overlay (replacing the old off-canvas
drawer) with Escape/outside-click/focus-return handling; a horizontally draggable project gallery
(pointer-events drag-to-scroll plus prev/next buttons, scroll-snap, touch-native on mobile); a
before/after comparison slider (pointer events, `role="slider"`, keyboard arrow support); a
tabbed services explorer; the pinned "Our Process" sequence; a multi-step estimate form (3 steps
on the homepage, 4 on the dedicated quote page to additionally collect the address field); a
floating "Request an Estimate" CTA; and a functional cookie-consent banner (Accept/Decline,
persisted in `localStorage`, no real tracking behind it). Every one of these is covered in the
verified-interactions table in §18, not just implemented.

## 18. Full-site testing & results (Phase 2)

Tested the same way as Phase 1 — against the project's own local demo server, not estimated —
but across all 13 redesigned pages this time, not a representative sample:

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Homepage — desktop | 99 | 100 | 100 | 100 |
| About — desktop | 100 | 100 | 100 | 100 |
| Services hub — desktop | 100 | 100 | 100 | 100 |
| Roof replacement — desktop | 99 | 100 | 100 | 100 |
| Quote (4-step form) — desktop | 100 | 100 | 100 | 100 |
| Contact — desktop | 99 | 100 | 100 | 100 |
| FAQ — desktop | 98 | 100 | 100 | 100 |
| 404 — desktop | 100 | 100 | 100 | 66¹ |

¹ The 404 page's only SEO finding is `is-crawlable` — it carries `<meta name="robots"
content="noindex, follow">` deliberately, so search engines don't index a not-found page. That's
correct practice, not a defect.

Sitewide regression, all 13 pages: **0 broken links** (40 internal URLs crawled, `tests/linkcheck.js`),
**0 browser console/page errors** across 13 pages × 5 viewport widths (375/390/768/1440/1920px),
**0 horizontal-overflow issues** at any of those widths, `prefers-reduced-motion` respected (every
GSAP animation disabled, content shown immediately — checked on 3 representative pages, not just
the homepage), and full content visible with JavaScript disabled on every page type checked.

**Real bugs found and fixed this phase** (via actual Playwright-driven testing, not inspection):
a horizontal-overflow bug in the pinned process section; a gallery item sizing bug caused by GSAP
Draggable restructuring the DOM mid-drag (replaced with a plain pointer-events handler); a gallery
button scoping bug; three accessibility regressions on the new homepage (contrast, heading order,
a color-only link) caught by Lighthouse and fixed to 100/100; a pre-existing, sitewide phone-number
regex syntax error on `quote.html`/`contact.html` that predates this redesign entirely and was
only surfaced once a multi-step form's validation logic actually invoked `checkValidity()`; two
heading-order gaps on the newly-built `contact.html` and `404.html` pages; and — the most
significant one — a genuine, previously-hidden color-contrast bug in the shared `.estimate-cinema`
component (white card nested in a dark section, inheriting the dark section's light text color for
its field labels, ~1.1:1 contrast) that escaped detection on the homepage only because that form
sits below a scroll-triggered reveal Lighthouse's static capture never saw revealed — fixed at the
component level, not patched per-page. A follow-on round of manual bounding-box collision testing
(not part of a standard Lighthouse/axe pass) also found that a cookie-consent banner which stayed
pinned to one screen corner indefinitely would, on certain pages at certain scroll positions,
visually sit over a real clickable CTA; fixed by making the banner's visibility responsive to
scroll position (hidden near the very top and very bottom of a page) rather than "shown once,
stays forever," the same principle the pre-existing floating CTA already used.

Full detail, the complete bug list with root causes, and the manually-driven interaction-by-
interaction verification table are in `docs/12-cinematic-redesign-results.md`.

## 19. What Phase 2 deliberately did not do

- **No live deployment check.** This environment has no authenticated access to the project's
  Vercel account this session, so a live URL could not be verified. `site/vercel.json` and
  `site/.vercelignore` were reviewed and need no changes for the new assets (the existing wildcard
  cache-control rules for `/css/`, `/js/`, and `/images/` already cover every new file); seeing it
  live still requires an actual `vercel --prod` run (or the Vercel dashboard's Git integration)
  from an authenticated account, documented step-by-step in `docs/10-deployment.md`.
- **No new photography**, for the same network-policy reason as Phase 1 (§15) — the illustration
  system was deepened instead, not abandoned.
- **No fabricated results.** The redesign's stat counters, service-area list, and process steps are
  all facts already established in Phase 1 content (4 services, a 48-hour response window, 6 cities)
  — nothing new was invented to make the new design feel more impressive.

## 20. Final project screenshots

Organized under `docs/screenshots/`:

- **`pages/`** — all 13 redesigned pages, full-page desktop (1440×900, @2x) capture:
  `home`, `about`, `services`, `roof-replacement`, `roof-repair`, `storm-damage`,
  `gutter-replacement`, `quote`, `contact`, `faq`, `privacy-policy`, `terms`, `404` (each
  `-desktop.png`), plus `home-mobile.png` (390×844) and `home-tablet.png` (834×1194).
- **`interactions/`** — specific interactive states: the full-screen nav overlay open, the
  draggable gallery, the before/after slider, the services explorer with a non-default tab
  selected, the estimate form on its second step, the FAQ accordion with an item expanded, and the
  cookie-consent banner.
- **`cinematic-redesign/`** — the homepage-only screenshot set captured partway through this
  project (desktop hero, desktop footer, mobile hero, tablet), kept from Phase 2's homepage-first
  milestone for a before/after record of how the full-site pass extended that initial work.

All screenshots in `pages/` and `interactions/` were captured after every fix in §18, so they
reflect the final shipped state, not an earlier draft.
