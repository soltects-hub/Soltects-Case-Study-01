# Soltects — Case Study 01: Fieldstone Roofing & Exteriors

A self-initiated Soltects portfolio project: full research, strategy, brand, design, and build of
a conversion-focused website for a fictional Kansas City–area residential roofing contractor,
created to demonstrate Soltects' website-development and conversion-optimization work.

**Fieldstone Roofing & Exteriors is not a real business.** See `docs/case-study.md` for the full
write-up, or `site/about.html#concept` for the in-site disclosure.

## Repository layout

```
docs/                 Research, strategy, architecture, testing, and the full case study
  01-research.md          Industry comparison & selection rationale
  02-brand-strategy.md    Brand identity & design system
  03-ux-conversion-strategy.md   CRO/UX decisions and why
  04-technical-architecture.md   Stack, file structure, demo backend, deployment
  05-seo-implementation.md       Per-page SEO/meta/structured-data summary
  06-testing-results.md          Actual Lighthouse/a11y/link/responsive test output
  07-asset-licensing.md          Font, icon, and photography licensing + a flagged dependency
  08-photography-requirements.md Exact spec + sourcing for the still-blocked photography dependency
  09-production-readiness-audit.md  Pre-approval visual/functional audit: 3 bugs found & fixed
  case-study.md                  The full, portfolio-ready case study (also exported as PDF)
site/                 The actual website (static HTML/CSS/JS, zero build step)
  api/server.js            Demo static server + /api/quote and /api/contact intake endpoints
screenshots/          Responsive screenshots captured during testing
tests/                Link checker and Playwright screenshot scripts
```

## Running the site locally

```bash
cd site/api
node server.js
# → http://localhost:4173
```

No build step, no npm install, no external services required to run the full site and both demo
forms.

## Running the tests

```bash
# with the server above running in another terminal:
node tests/linkcheck.js http://localhost:4173
node tests/screenshots.js http://localhost:4173
```

Lighthouse results are documented (not just linked) in `docs/06-testing-results.md`.
