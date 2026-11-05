# Cinematic Redesign — Results & Verification

**Soltects Case Study 01.** This is the Phase 3 (homepage) results document, written after
implementation and testing. Read `docs/11-cinematic-redesign-plan.md` first for the audit,
creative direction, and the interaction map this implementation follows — including the two
deviations found during build (GSAP `Draggable` dropped for the gallery; a pre-existing sitewide
phone-regex bug fixed).

This document exists because "do not claim completion based on code implementation alone" was an
explicit requirement. Everything below was run against the live local server
(`node site/api/server.js`, port 4173), not inferred from reading the source.

## Scope actually completed this session

**Done, built and tested: Phase 1 (Audit), Phase 2 (Creative Direction), Phase 3 (homepage).**
`site/index.html` is a full 12-section cinematic rebuild. The shared design system
(`site/css/cinematic.css`, `site/js/cinematic.js`, `site/js/gallery.js`,
`site/js/before-after.js`, `site/js/estimate-form.js`) is built and is what the other 12 pages
would adopt in Phase 4.

**Not done this session: Phases 4–7.** `about.html`, `services/index.html` and its 4 service
detail pages, `quote.html`, `contact.html`, `faq.html`, `privacy-policy.html`, `terms.html`, and
`404.html` still run on the original `base.css` system — unchanged except for the sitewide
phone-regex fix described below, which applied to `quote.html` and `contact.html` incidentally
because it was a real, pre-existing bug, not a redesign choice. No design-system migration work
was done on those 12 pages. Phase 6 (sitewide QA at this new design's fidelity) and Phase 7
(deployment re-verification) are correspondingly scoped to what Phase 3 needed, not the whole
site.

## Screenshots

Captured from the actual running homepage after all fixes described below, not before them.

- `docs/screenshots/cinematic-redesign/desktop-top.png` — desktop (1440×900, @2x) hero on load
- `docs/screenshots/cinematic-redesign/desktop-footer.png` — desktop, scrolled to the estimate
  CTA + premium footer
- `docs/screenshots/cinematic-redesign/mobile-top.png` — mobile (390×844, @2x, iPhone-class
  viewport) hero on load
- `docs/screenshots/cinematic-redesign/tablet-top.png` — tablet (834×1194, @2x, iPad-class
  viewport)

## Lighthouse (desktop preset, `tests/lighthouse/cinema-home.report.json`)

| Category | Score |
|---|---|
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Accessibility moved 93→100 after fixing three real findings this session (detailed below).
Performance sits at 99, not 100 — the two near-miss weighted audits are First Contentful Paint
(0.99, 0.6s) and Largest Contentful Paint (0.96, 0.9s). Both are within normal lab-measurement
range for a page that newly loads vendored GSAP + a new, unminified `cinematic.css`. The
lower-weight "insight" diagnostics (unminified CSS/JS, unused CSS/JS, ~0.5 each) are the expected
cost of this project's deliberate zero-build-step architecture (no bundler, no minifier — documented
in `docs/04-technical-architecture.md`), not a defect introduced by this redesign. This is
consistent with this project's own prior-session precedent of treating single-point run-to-run
lab variance as noise rather than a regression (`docs/09-production-readiness-audit.md`).

## Bugs found and fixed (via actual testing, not inspection)

1. **Horizontal page overflow.** `document.documentElement.scrollWidth` measured 3203px against a
   1440px viewport. Cause: the pinned "Our Process" section's track is deliberately wider than the
   viewport (that's how the horizontal-pin effect works) but wasn't clipped to its own section.
   Fixed: `.process-pin { overflow: hidden; }` plus `html { overflow-x: clip; }` as defense in
   depth. Verified: `scrollWidth` now exactly 1440.

2. **Cookie-consent banner overlapping the hero's CTA buttons.** Confirmed via bounding-box
   overlap math at multiple viewport heights (700/800/900/1024px) — all showed real overlap on a
   flat 900ms reveal timer. Fixed by changing the trigger condition entirely: the banner now
   appears on first scroll past 40px (with a 6s fallback for users who never scroll), which
   removes the hero-CTA collision by construction rather than by resizing the banner to fit a gap.
   Verified: `data-visible="false"` before scroll, `"true"` after.

3. **Gallery items losing their fixed 420px width.** Items were rendering at ~1325px instead of
   their intended fixed card width. Cause: GSAP `Draggable`'s `type: "scrollLeft"` mode
   restructures the track's DOM to manage scroll measurement, which broke the `flex: 0 0 420px`
   sizing the cards depend on. Fixed by dropping `Draggable` for this component entirely and
   writing a plain pointer-events drag-to-scroll handler instead (`site/js/gallery.js`) — see the
   deviation note in `docs/11-cinematic-redesign-plan.md` §2.5. Verified: item width now a
   consistent 420px; drag-to-scroll and the prev/next buttons both confirmed working (below).

4. **Gallery prev/next buttons silently doing nothing.** `track.scrollLeft` never changed on click,
   even via a direct DOM `.click()` call. Cause: the buttons live in the section header, a DOM
   sibling of `.gallery-cinema`, not a descendant of it — the script's original `gallery.
   querySelector(...)` scope never found them. Fixed by scoping the button lookup to
   `gallery.closest(".section-cinema")`. Verified below.

5. **Sitewide phone-number pattern regex, pre-existing (not introduced by this redesign).**
   `pattern="^[0-9 ()+-]{7,}$"` throws `Invalid character in character class` under the Unicode
   Sets ("v" flag) regex mode current Chromium uses to compile HTML `pattern` attributes — meaning
   `checkValidity()` throws instead of returning a boolean. This bug already existed on
   `quote.html` and `contact.html` before this session; it was never caught previously because
   prior testing only checked for console errors on page load, and this only surfaces when
   `checkValidity()` is actually invoked (which the new multi-step estimate form's per-step
   validation does, and which native form submission also does). Fixed sitewide — all three
   occurrences (`quote.html`, `contact.html`, the new `index.html`) — to
   `^[0-9\(\)+\-\s]{7,}$`, equivalent but valid under the stricter mode. Verified: valid phone
   numbers pass, invalid ones are rejected, zero console errors across all 13 pages on recheck.

6. **Lighthouse accessibility regression on the new homepage (93/100, 3 findings), fixed to
   100/100:**
   - `color-contrast`: the footer's "Request an Estimate" button text was `#c9d1cd` on the brick
     background (2.92:1) — `.footer-cinema a`'s color rule was overriding the button's own color
     by specificity. Fixed with explicit `.footer-cinema .btn-cinema--solid/--gold/--outline`
     color overrides.
   - `heading-order`: the footer used `<h4>` directly after the estimate section's `<h2>`,
     skipping a level. Fixed to `<h3>`.
   - `link-in-text-block`: the footer's inline "Soltects" credit link was distinguished from
     surrounding text by color alone (1.16:1, no underline). Fixed by adding
     `text-decoration: underline`.

7. **Two unused vendored dependencies.** `Draggable.min.js` and `Observer.min.js` were vendored
   into `site/js/vendor/gsap/` per the original plan, but the gallery no longer uses `Draggable`
   (see #3) and nothing uses `Observer`. Removed both from the repo rather than ship dead code —
   only `gsap.min.js` and `ScrollTrigger.min.js` are loaded by `index.html`.

## Verified interactions

Each of these was driven with Playwright against the live page and the actual resulting DOM state
was inspected — not just "the code looks right."

| Interaction | Verification | Result |
|---|---|---|
| Full-screen nav overlay | Opened via toggle, confirmed `data-open="true"`, closed via Escape | ✅ |
| Scroll-triggered reveals | `[data-reveal-cinema]` sections observed transitioning from `opacity:0` as scrolled into view | ✅ |
| Gallery — next/prev buttons | `scrollLeft` moved 0 → 444 on a single click | ✅ |
| Gallery — drag, decisive (>half an item width) | Pointer drag of 500px carried scroll through to the next item (0 → 444), matching button-click behavior | ✅ |
| Gallery — drag, short (<half an item width) | A 150px drag correctly snaps back to 0 via the track's `scroll-snap-type: x proximity` — confirmed this is by-design snap behavior, not a stuck drag | ✅ |
| Before/after slider — keyboard | Focused the `role="slider"` element, pressed ArrowRight, `aria-valuenow` advanced 50 → 55 | ✅ |
| Estimate form — multi-step forward/back | Filled step 1 → Next (step index 0→1) → filled step 2 → Next (1→2) → Back (2→1, zip value preserved) → Next (1→2) | ✅ |
| Estimate form — full submission | Completed all 3 steps including required consent checkbox, submitted, received the demo-disclosure success message from the same backend `quote.html` uses | ✅ |
| Cookie consent — appears on scroll | Hidden at load (`data-visible` unset/false), `"true"` after scrolling past 40px | ✅ |
| Cookie consent — accept | Clicked Accept, banner hides, `localStorage["fieldstone-demo-cookie-choice"] = "accepted"` | ✅ |
| Cookie consent — decline, persists across reload | Clicked Decline, banner hides, choice stored, banner stays hidden after a full page reload | ✅ |
| No horizontal overflow | `document.documentElement.scrollWidth === window.innerWidth` (1440 = 1440) | ✅ |
| `prefers-reduced-motion` respected | Verified in an earlier pass this session with a `reducedMotion: 'reduce'` browser context — all GSAP animation/parallax disabled, content shows immediately | ✅ (carried over from earlier in-session testing; not re-run in this final pass) |
| No-JS fallback | Verified in an earlier pass this session with `javaScriptEnabled: false` — all content visible by default, no FOUC/hidden-content state | ✅ (carried over from earlier in-session testing; not re-run in this final pass) |

## Sitewide regression (all 13 pages, run after all fixes above)

- **Broken links**: 0 out of 40 checked (`tests/linkcheck.js`).
- **Console errors / page errors**: 0 across all 13 pages (`/`, `/about.html`,
  `/services/index.html`, 4 service detail pages, `/quote.html`, `/contact.html`, `/faq.html`,
  `/privacy-policy.html`, `/terms.html`, `/404.html`).

## Integrity checklist (re-confirmed on the shipped homepage)

- Concept-disclosure banner present and unchanged on every page's navigation chrome.
- Every gallery/before-after image is captioned "illustrative concept" / "illustrative example" in
  both visible text and `alt` text — no image is presented as a real completed project.
- No fabricated testimonials, reviews, business metrics, revenue figures, or credentials were
  added. The homepage's "stats" counters are limited to already-true facts (4 core services, a
  48-hour inspection response target already stated elsewhere on the site, 6 cities in the stated
  service area, one crew-per-project standard) — none are a results/performance claim.
- Service-area list (6 cities) matches the cities already documented elsewhere on the site; no new
  office addresses or coverage claims were invented.
- The estimate form collects only name, email, phone, ZIP, service, and a free-text description,
  and its submit-success message explicitly states this is a demo submission for the Soltects case
  study, not a real request reaching a sales team — same disclosure pattern as the existing
  `quote.html`/`contact.html` forms.
- `vercel.json` and the serverless function file layout were not touched by this redesign;
  `site/api/quote.js` had only the same validation relaxation applied as `site/api/server.js`
  (making `address` and `insurance_claim` optional, to support the shorter homepage form) —
  both files were kept in sync, consistent with this project's existing (deliberately
  no-shared-module) pattern.

## What Phase 4 (the remaining 12 pages) would involve, if continued

Not started. For an honest sizing: each of the 12 remaining pages would need its `<link>` tags
swapped from `base.css` to `cinematic.css`, its markup restructured into the new section/component
classes (`.section-cinema`, `.btn-cinema`, etc.), and a page-appropriate subset of the motion
system (reveals at minimum; most inner pages wouldn't need the hero/gallery/process-pin machinery
built for the homepage). `quote.html`'s own form is a reasonable candidate to adopt the multi-step
pattern from `estimate-form.js`, though the brief didn't require it. This is real, multi-page
work, not a mechanical find-replace — flagged here rather than attempted at low fidelity in the
time remaining this session.
