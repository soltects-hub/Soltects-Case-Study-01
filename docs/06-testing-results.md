# Testing Results

**Everything below is measured, not estimated.** Each number was produced by actually running the
named tool against this project's own files, locally, via `node site/api/server.js` on
`http://localhost:4173`. Raw tool output is kept in `tests/lighthouse/*.report.json` and
`screenshots/`. Where a number can't be measured without a live deployment (e.g. real-user Core
Web Vitals, uptime), it's listed under Limitations instead of being guessed at.

Testing environment: Lighthouse 13.6.0 via Chrome headless (the Playwright Chromium already
installed in this environment), Node v22.23.4, run on 2026-11-05, with a second verification pass
(production-readiness audit, see §0) on the same date. Lighthouse's default run simulates a
mid-tier mobile device on a throttled connection; the `--preset=desktop` runs simulate a
laptop/desktop on an unthrottled connection. Both are shown below because they tell different
stories for a mobile-heavy contractor audience.

## 0. Production-readiness audit — bugs caught by visual review, missed by automated tests

Before sign-off, every page was reviewed as rendered screenshots (not just against automated
pass/fail checks), per the explicit request that functional tests alone aren't sufficient
evidence of quality. That pass caught three real, sitewide defects that every automated check
in this document — Lighthouse, the link checker, the keyboard-interaction script — had been
passing cleanly, because none of them inspect actual visual layout:

1. **The mobile nav drawer never actually opened full-height, on any page, at any point before
   this audit.** `.site-header` had `backdrop-filter: saturate(140%) blur(8px)` for a frosted-glass
   effect. Per the CSS spec, `filter`/`backdrop-filter` on an element creates a new *containing
   block* for any `position: fixed` descendant. `.primary-nav` (the mobile drawer) is nested
   inside `.site-header` and uses `position: fixed` once JS is active — so instead of anchoring to
   the viewport, it anchored to the header bar's own ~70px-tall box. The drawer rendered as a short
   70px-tall sliver showing only the first nav link, with the rest of the page visible (and dimmed
   by the scrim) beneath it. The automated keyboard test in §6 below only ever checked that
   `data-open` flipped from `"false"` to `"true"` on click — which it did — so it reported a pass
   throughout. **Fixed** by removing `backdrop-filter` from `.site-header` (kept a near-opaque
   `rgba(..., 0.97)` background for the same visual separation without the containing-block side
   effect). Re-measured: drawer now reports `height: 844` against an 844px viewport — full height,
   confirmed via `getBoundingClientRect()`, not just visually.
2. **The hamburger menu icon was invisible — an empty bordered button — on every phone-width
   screen.** `.nav-toggle` (and the `<svg>` inside it) had no `flex-shrink: 0`. The header row
   (`.site-header__bar`) is a flex container forced to `flex-wrap: nowrap` on mobile once JS loads
   (so the drawer's `position: fixed` escape works). At 390px wide, the combined width of the logo,
   toggle button, phone number, and "Get a Free Quote" button exceeded the viewport, so flexbox's
   default shrink behavior crushed the toggle button down to 14px wide and its SVG icon down to 0
   width — the button was still clickable (its hit area persisted), just visually blank. **Fixed**
   two ways: `flex-shrink: 0` on `.nav-toggle`/its `svg` so it can never be crushed again, and
   (the actual root cause) hiding `.header-actions` below 640px, since the sticky call bar already
   repeats "Call Now"/"Free Inspection" there — removing the overflow rather than just protecting
   one element from its symptom.
3. **The header showed two CTA buttons with near-identical labels, side by side, on desktop.**
   `.primary-nav` includes a "Request a Free Inspection" button meant only for the bottom of the
   mobile drawer. On desktop, `.primary-nav` renders inline in the header bar (not `position:
   fixed`), so that button rendered right next to the separate "Get a Free Quote" button in
   `.header-actions` — two buttons, same destination, competing for attention, directly
   contradicting this project's own stated CRO principle ("one primary + one secondary CTA per
   page," `03-ux-conversion-strategy.md`). **Fixed** by giving that button a `.primary-nav__cta`
   class, hidden by default and shown only below 900px (where it's the mobile drawer's own CTA,
   not a desktop duplicate).

**Why this matters for the "Ready" recommendation below:** these were not edge-case bugs. The nav
drawer bug affected every single page, at every phone width, the entire time the previous
sign-off's automated tests were reporting 100/100 accessibility and passing keyboard tests. It is
the clearest evidence in this project that automated testing and visual review catch different
classes of defects, and that a "tests pass" report is not sufficient grounds for production
sign-off on its own.

## 1. Lighthouse scores

| Page | Mode | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| `/` (home) | Desktop | **100** | **100** | **100** | **100** |
| `/` (home) | Mobile (throttled) | **91** | **100** | **100** | **100** |
| `/services/storm-damage-insurance-claims.html` | Desktop | **99** | **100** | **100** | **100** |
| `/quote.html` | Desktop | **100** | **100** | **100** | **100** |

(Re-measured after the production-readiness audit's visual/structural fixes, §0 above. Home's
mobile performance moved 92→91 — within normal run-to-run lab variance, not a regression. The
storm-claims page's 100→99 and both pages' LCP are a real, small, accepted cost of the new banner
art; see below.)

**Mobile Core Web Vitals (home, throttled, lab data):**

| Metric | Value |
|---|---|
| First Contentful Paint | 1.7 s |
| Largest Contentful Paint | 3.1 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 3.9 s |
| Time to Interactive | 3.1 s |

**Desktop (unthrottled):** home is FCP/LCP/Speed Index/TTI all 0.5 s, TBT 0 ms, CLS 0. Quote and
storm-claims are FCP/Speed Index/TTI 0.5 s, but **LCP 0.8 s** (score 0.97–0.98, still rounding to
a 100 category score) — the measured cost of the page-banner background art added during the
production-readiness audit (§0 above; see `02-brand-strategy.md`) to every interior page. 0.8 s is
still well inside Google's "good" LCP threshold (under 2.5 s), and this number is reported exactly
as measured rather than left at its pre-audit 0.5 s. These numbers are expected to be this strong
overall: the site is static HTML/CSS with one small JS file and no render-blocking framework — see
`04-technical-architecture.md` for why that stack was chosen.

The mobile LCP/Speed Index numbers (3.1 s / 3.9 s under simulated throttling) are the honest
weak point: Lighthouse's default mobile throttling profile is deliberately pessimistic (a slowed
CPU and a "Slow 4G"-equivalent connection), and Google Fonts (Fraunces + Inter) loading from a
third-party origin is the main contributor. A production deployment would self-host the two font
files to remove that round trip — noted here rather than fixed, since it's a legitimate follow-up,
not a defect being hidden.

## 2. Accessibility — issues found and fixed

The first Lighthouse pass on the homepage scored **91/100** accessibility and surfaced three real,
confirmed defects, not false positives. All three were fixed in `site/css/base.css`, and the score
reached **100/100** on every page tested afterward:

1. **Color contrast, `--brick` (#C1552E) as body/link text on `--paper`:** measured at 4.15:1,
   below the 4.5:1 AA minimum for normal-size text. Affected `.link`, `.eyebrow`, `.btn-ghost`,
   the active nav-link state, and breadcrumb hover — all switched to `--brick-dark` (#A1431F,
   5.73:1). The sticky mobile call bar's "Call Now" button (`--paper` text on `--brick`, 4.15:1)
   and the footer's inline "Soltects" credit link (`--brick-dark` text on the dark footer
   background, 2.33:1) needed their own fixes (white text on the call bar; `--gold`, 5.72:1, on
   the footer) since a single swap didn't cover both a light-background and a dark-background
   case. Every pairing below was recomputed with the actual WCAG relative-luminance formula, not
   eyeballed:

   | Pairing | Ratio | AA (4.5:1) |
   |---|---|---|
   | `--brick` on `--paper` (original) | 4.15 | Fail |
   | `--brick-dark` on `--paper` (fixed) | 5.73 | Pass |
   | white on `--brick` (buttons, call bar) | 4.56 | Pass |
   | `--brick-dark` on `--brick-tint` cards | 4.94 | Pass |
   | `--gold` on `--ink` (footer credit link) | 5.72 | Pass |
   | `--ink` on `--paper` (body text) | 13.39 | Pass |

   A related, non-contrast bug surfaced during this check: a white `.card` nested inside a dark
   `.section--ink` block was inheriting the section's light heading color instead of resetting to
   dark text, producing pale-grey-on-white heading text in the "What we check in a storm
   inspection" card. Fixed with an explicit `.section--ink .card h2, .section--ink .card h3`
   override.

2. **Heading order (skipped levels):** three real skips — a card grid with no preceding `<h2>`
   on the homepage (`h1` → `h3`), the same pattern on the services hub page, and a "process
   steps" `<h4>` block that skipped from a page's `<h2>` with no `<h3>` in between, repeated as
   the footer's category headings (`<h4>`) following a page's last `<h2>`/`<h3>` on every page.
   Fixed by adding a (visually hidden, where a visible heading wasn't wanted) `<h2>` ahead of
   each orphaned card grid, promoting the process-step headings to `<h3>`, and changing the
   footer's three category headings from `<h4>` to `<h3>` sitewide (13 files).

3. **Link distinguishable by color alone:** the "Soltects" credit link in the footer's copyright
   line sits inside a sentence and is styled only by color once the footer's blanket
   `text-decoration: none` is applied — failing the "don't rely on color alone" check. Fixed with
   `.site-footer p a { text-decoration: underline; }`, scoped to links inside footer prose only
   (the footer's nav-style link lists were correctly exempt — each link is already visually
   distinct by being alone on its own line).

## 3. Responsive testing

Captured with Playwright Chromium at three breakpoints (390×844 mobile, 834×1194 tablet,
1440×900 desktop) for **all 13 pages** — 39 screenshots total, in `/screenshots/` (see the
inventory table in `case-study.md` §16). The initial 15-screenshot pass (5 key pages) caught two
rendering bugs; the full 39-screenshot production-readiness pass across all 13 pages then caught
the three more serious structural bugs documented in §0 above — the nav drawer and duplicate-CTA
issues in particular were only visible by actually opening the mobile nav and comparing desktop
headers side by side, not from a static full-page capture:

- **Scroll-reveal content was invisible without JavaScript.** `[data-reveal]` elements defaulted
  to `opacity: 0` regardless of whether `main.js` ran, so a visitor with JS disabled (or a crawler
  that doesn't fire `IntersectionObserver`) would never see roughly a third of the homepage's
  content. Fixed by gating the hidden-by-default state behind an `html.js` class that an inline
  script sets at the top of `<body>` — content is visible immediately unless JS has actually
  confirmed it can reveal it on scroll. The same inline-script pattern was needed for the
  mobile nav drawer, which had the identical problem: without JS, the "menu" button that opens it
  does nothing, so the nav must default to visible/inline on narrow screens instead of hidden
  off-canvas.
- **The card-inside-dark-section contrast bug** described above was first spotted visually in a
  screenshot (faint, barely legible list text) before being confirmed as a real contrast failure
  by Lighthouse.

## 4. Link checking

`tests/linkcheck.js` crawled every internal `href`/`src` reachable from all 13 pages: **23 unique
internal URLs and assets checked, 0 broken (0 non-2xx responses).**

## 5. Functional testing (forms)

Tested directly against the running demo API (`site/api/server.js`). **Every submission below is
test data produced by this team, not a real inquiry** — see `04-technical-architecture.md`,
"Demo backend limitations," before treating any number here as lead volume:

| Test | Result |
|---|---|
| Valid quote request submission | `200 {"ok":true}`, appended to `submissions.json` |
| Quote request missing all required fields | `422` with a specific error per missing field |
| Honeypot field filled (`company`) | `200 {"ok":true}` returned (so a bot learns nothing), **not** stored |
| Valid contact message | `200 {"ok":true}`, appended to `submissions.json` |
| Contact message under the 10-character minimum | `422`, `"message must be at least 10 characters"` |
| `GET` to a POST-only API route | `404` (falls through to static 404 handling — functionally correct, not strictly idiomatic REST) |
| Request for a nonexistent page | `404`, serves `404.html` with the correct status code |

## 6. Keyboard & interaction testing

Automated via Playwright (`page.keyboard`), confirming the manual behaviors the design doc
claims:

- First `Tab` stop on every page is the skip link ("Skip to content").
- FAQ accordion: clicking a trigger flips `aria-expanded` from `false` to `true` and reveals its
  panel.
- Mobile nav: the toggle button opens the drawer (`data-open="true"`); `Escape` closes it
  (`data-open="false"`) and returns focus to the toggle button.

## 7. Browser console

Loaded all 13 pages in headless Chromium and captured `console.error` and uncaught page errors:
**zero console errors on any page.**

## 8. Browser/device compatibility

Tested in this environment: Chromium (via Playwright), both the default and throttled-mobile
Lighthouse device profiles. **Not tested in this environment:** Safari/WebKit, Firefox, or a real
iOS/Android device — this environment doesn't have those browser engines available. The CSS used
(custom properties, `clamp()`, `:focus-visible`, `IntersectionObserver`) has broad modern-browser
support. `backdrop-filter` was removed from the header during the production-readiness audit (§0
above) — not for a compatibility reason, but because it was actively breaking the mobile nav
drawer in the one browser engine this project *can* test. This gap is listed in `case-study.md`,
"Limitations," rather than silently assumed to be fine.

## 9. What's measured vs. estimated vs. untested

| Claim | Status |
|---|---|
| Lighthouse scores, Core Web Vitals (lab) above | **Measured**, this run, this project |
| 0 broken links, 0 console errors | **Measured**, this run, this project |
| Form validation/honeypot/API behavior | **Measured**, this run, this project |
| Accordion/nav keyboard behavior | **Measured**, this run, this project |
| WCAG 2.1 AA conformance | **Partially verified** — automated (axe-core via Lighthouse) + the specific manual checks above. Not a full manual AA audit and not a third-party certification. |
| Real-user Core Web Vitals, bounce rate, conversion rate | **Not available** — no live deployment, no real traffic. Not estimated; see `case-study.md`, "Limitations." |
| Cross-browser (Safari/Firefox/real mobile) rendering | **Not tested** in this environment — flagged, not assumed. |
| Demo form submissions = real leads | **False, explicitly** — see `04-technical-architecture.md`, "Demo backend limitations." No notification fires, nothing is followed up on, and the business doesn't exist. |
| "All pages visually reviewed, not just automated-tested" | **True as of the production-readiness audit (§0)** — 39 screenshots across all 13 pages × 3 breakpoints, which is how the nav-drawer/toggle-icon/duplicate-CTA bugs were found after passing every automated check. |
