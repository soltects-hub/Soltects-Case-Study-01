# Technical Architecture

## Stack choice

Plain, dependency-free HTML/CSS/JS, served as static files. No framework, no build step.

**Why:** for a marketing site whose entire job is to load fast and convert on a phone signal at a
job site, a static multi-page site outperforms a JS framework on every metric that matters here —
time to first byte, time to interactive, and resilience to JS failures (forms still basically work,
`tel:` links always work). It also means zero build-tool risk for this deliverable: any static
host — or literally opening the files — runs it.

## File structure

```
site/
  index.html, about.html, contact.html, quote.html, faq.html,
  privacy-policy.html, terms.html, 404.html
  services/
    index.html, roof-replacement.html, roof-repair.html,
    storm-damage-insurance-claims.html, gutter-replacement.html
  css/
    tokens.css     — design tokens: color, type scale, spacing, radii, shadows, motion
    base.css       — reset, typography, layout primitives, every reusable component
  js/
    main.js        — progressive-enhancement behavior: nav, accordion, scroll-reveal, forms
  images/
    logo-mark.svg, favicon.svg
    art/hero-roofline.svg
  api/
    server.js      — demo static file server + form intake API (see below)
    package.json
  robots.txt, sitemap.xml, vercel.json
```

Every page shares the same header/nav/call-bar/footer markup and the same two stylesheet + one
script include — that's the "component architecture" here: components are shared CSS classes and
one shared behavior file, not shared HTML includes, because there's no build step to assemble
includes at request time. The trade-off (header/footer markup duplicated per file) is deliberate
for a zero-build static site; the `06-testing-results.md` link-check step exists specifically to
catch drift between pages.

## CSS architecture

- `tokens.css` defines every color, type-scale step, spacing step (8px baseline), radius, shadow,
  and motion value as a CSS custom property. Nothing in `base.css` or inline styles uses a raw hex
  value or an arbitrary pixel size outside the token set.
- `base.css` is organized in the order a page is actually built: reset → base type → layout
  helpers → buttons → header/nav → sticky mobile call bar → hero → cards → process steps → FAQ
  accordion → forms → footer → page-level content patterns.
- Responsive behavior uses a small number of breakpoints (900px for nav collapse, 860px for
  grid collapse, 640/560px for mobile) rather than a breakpoint per component.

## JavaScript architecture

`js/main.js` is a single IIFE with four independent initializers (`initNav`, `initAccordions`,
`initReveal`, `initForms`), each a no-op if its markup isn't present on the page. Nothing in the
site depends on JavaScript to be usable — `tel:` links, in-page anchors, and page navigation all
work with JS disabled; forms degrade to "nothing happens on submit" rather than breaking, and the
FAQ accordion markup is still readable prose if JS fails to run (panels are visible in the DOM,
just not height-animated).

## Demo backend & production path

`site/api/server.js` is a dependency-free Node HTTP server that does two jobs:

1. Serves the static site (so the whole project runs locally with `node server.js`, no build step).
2. Handles `POST /api/quote` and `POST /api/contact`: validates the payload server-side (not just
   client-side — the client validation in `main.js` is a UX convenience, not the security
   boundary), rejects obvious bot submissions via a hidden honeypot field, and appends accepted
   submissions to `site/api/submissions.json` with a timestamp.

**What it deliberately does not do:** send a real email, SMS, or CRM notification. Wiring that up
for a real deployment needs a transactional email/SMS provider (e.g. SendGrid, Postmark, Twilio) —
an external paid service with its own account and API key, which this project does not have and
should not fabricate. In a real deployment, `appendSubmission()` in `server.js` is the single
place that call would go, and the two HTML forms would not need to change at all.

**Running it:**

```bash
cd site/api
node server.js
# → http://localhost:4173
```

### Demo backend limitations (read before treating any submission as real)

- **No submission through this form is, or has ever been, a real customer lead.** Fieldstone
  Roofing & Exteriors is fictional (see `case-study.md` §1 and `site/about.html#concept`); there
  is no office, no project consultant, and no one reads `submissions.json` to follow up with a
  homeowner. Any count of "submissions" quoted anywhere in this project's documentation (e.g.
  in `06-testing-results.md`) refers only to records produced by this team's own functional
  testing of the form — never to organic/real-user traffic, because this site has never been
  deployed publicly.
- **No notification fires on submission.** No email, text, Slack message, or CRM entry is
  created. A submission's only effect is a line appended to a local JSON file and a `{"ok":true}`
  response to the browser.
- **No authentication, rate-limiting beyond a basic per-IP counter, or spam filtering beyond one
  honeypot field.** Good enough to demonstrate the pattern; not hardened for a public deployment.
- **`submissions.json` is local, untracked, and wiped between sessions** (`.gitignore`'d; see
  `site/api/submissions.json` is never committed) — it is scratch output for demonstrating the
  flow works end-to-end, not a data store anyone should treat as persistent or authoritative.
- **Before this becomes a real intake form:** add a transactional email/SMS integration (see
  above), add real authentication/rate-limiting if exposed publicly, and replace the local JSON
  file with an actual database or CRM webhook.

## Deployment configuration

`site/vercel.json` configures static hosting on Vercel: security headers (`X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, a restrictive `Permissions-Policy`) on every response, and
long-lived immutable caching for `/css`, `/js`, and `/images`. To deploy as-is: set the Vercel
project's root directory to `site/`. The two form endpoints would need to become Vercel serverless
functions (`api/quote.js`, `api/contact.js`) using the same validation logic in `server.js` — that
port is straightforward but not done here, since it requires picking a real notification provider
first (see above). This project was not actually deployed to a live URL as part of this case study;
local testing against `node server.js` is what the Testing section documents.

## SEO implementation

- Unique, descriptive `<title>` and `<meta name="description">` per page.
- `rel="canonical"` on every page, all pointed at a single placeholder domain
  (`https://www.fieldstoneroofingkc.example/` — the reserved `.example` TLD, so it's unmistakably a
  non-resolving placeholder rather than a real or squatted domain).
- Open Graph (`og:type`, `og:title`, `og:description`, `og:url`) and `twitter:card` on key pages.
- `JSON-LD` structured data: `RoofingContractor` (a subtype of `LocalBusiness`) on the homepage and
  contact page with NAP (name/address/phone) and hours; a `Service` block on the storm/insurance
  claims page describing that service specifically.
- `robots.txt` and `sitemap.xml` at the site root, `/api/` disallowed from crawling.
- URL structure is flat and readable: `/services/roof-replacement.html` rather than a numeric or
  query-string slug.

## Accessibility implementation

- Skip link to `#main` on every page.
- One `<h1>` per page; heading levels don't skip.
- Visible focus states (`:focus-visible`) distinct from hover states, 3px outline at AA-safe
  contrast against both light and dark section backgrounds.
- All interactive controls meet a 44–48px minimum touch target (buttons, form inputs, nav links,
  accordion triggers).
- Form fields have explicit `<label>`s (no placeholder-as-label), programmatically associated
  error text, and `aria-describedby`/`data-invalid` wiring so errors are announced, not just
  color-coded.
- Mobile nav is a proper disclosure pattern: `aria-expanded`, `aria-controls`, focus moves into the
  panel on open, `Escape` closes it, and it's reachable/dismissible by keyboard alone.
- `prefers-reduced-motion` disables the scroll-reveal animation and all transitions sitewide.
- Decorative SVGs (`aria-hidden="true"`); meaningful SVGs (the logo) carry a `<title>`.

See `docs/06-testing-results.md` for the actual measured results against this list, not just the
intent.
