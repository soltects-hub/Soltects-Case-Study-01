# Production-Readiness & Visual-Quality Audit

**Scope:** this audit (requested before approving Case Study 01 for the Soltects portfolio)
re-reviewed the finished build visually, page by page, rather than relying on the automated test
suite alone. It found and fixed three real, sitewide defects that every prior automated check had
been passing. This document is the record of that pass; see `06-testing-results.md` §0 for the
full technical write-up of each bug, and the chat summary delivered alongside this audit for the
condensed version with an explicit Ready/Not Ready call.

## 1. Visual review of all 13 pages

All 13 pages were captured at mobile (390×844), tablet (834×1194), and desktop (1440×900) — 39
screenshots in `/screenshots/`, inventoried in `case-study.md` §16 — and reviewed as rendered
images, not just DOM/attribute assertions. Findings:

- **Typography and color system read as genuinely premium**, not templated — the Fraunces/Inter
  pairing and the warm slate-green/brick/paper palette are visually distinct from the
  bold-grotesk-sans-on-blue-and-orange look most contractor templates default to.
- **Zero photographic or illustrative richness anywhere was a real gap.** All 13 pages were, until
  this audit, pure typography and flat color fields. Addressed (see §2).
- **Three structural/functional bugs**, invisible to every automated check run so far, found only
  by actually opening the mobile nav and comparing headers across breakpoints (see §3).
- **One Fraunces stylistic ligature** (the decorative "&" glyph) was checked under magnification
  and confirmed to be an intentional, legible font feature, not a rendering bug — left as-is.

## 2. Visual quality improvements made

Since real photography remains blocked (see §4), visual richness was added through original,
non-photographic work:

- The homepage hero's roofline SVG motif is now reused as a quiet background treatment on every
  interior page's banner (`.page-banner::after` in `site/css/base.css`), instead of a flat `--ink`
  color field — extends the one piece of brand illustration the site has, sitewide.
- A new, very subtle (3.5% opacity) paper-grain texture (`site/images/art/grain.svg`) sits over
  the entire site via a fixed, `pointer-events: none` overlay, for tactile quality on large flat
  color sections without any network dependency or performance cost worth measuring.
- Both are genuinely original work (hand-written SVG/CSS), not AI-generated or photographic.

**Measured cost:** the page-banner art is why `services/storm-damage-insurance-claims.html`'s
Lighthouse Performance score moved 100→99 and LCP moved 0.5s→0.8s — both still comfortably within
Google's "good" range, reported exactly as measured rather than hidden.

## 3. Bugs found and fixed (the headline finding of this audit)

| # | Bug | Found by | Root cause | Fix |
|---|---|---|---|---|
| 1 | Mobile nav drawer opened to ~70px tall on every page, showing only the first link | Opening the drawer and screenshotting it, not just checking `data-open` | `backdrop-filter` on `.site-header` created a CSS containing block that trapped its `position: fixed` descendant (the drawer) inside the header's own short box instead of the viewport | Removed `backdrop-filter`; kept a near-opaque background for the same visual effect |
| 2 | Hamburger icon was an empty, blank button on every phone-width screen | Zoomed crop of the header screenshot | No `flex-shrink: 0` on `.nav-toggle`; the header row overflowed at 390px once JS forced `flex-wrap: nowrap`, and flexbox crushed the button (and its SVG) toward 0 width | Added `flex-shrink: 0`; removed the actual overflow by hiding the redundant header phone/CTA below 640px (the sticky call bar already covers that) |
| 3 | Desktop header showed two "request a quote"-style buttons side by side | Side-by-side comparison of desktop header screenshots before/after | The mobile drawer's own CTA button rendered inline in the desktop header too, since `.primary-nav` isn't `position: fixed` on wide screens | Scoped that button to a `.primary-nav__cta` class, hidden by default, shown only ≤900px |

All three are re-verified post-fix with concrete, not just visual, evidence: `getBoundingClientRect()`
checks confirming the drawer is exactly viewport-height and the toggle button/icon are back to
their intended 44px/22px, and side-by-side screenshots showing the single remaining desktop CTA.

**Why these were missed before:** the existing automated suite (Lighthouse, the link checker, a
Playwright script checking `aria-expanded`/`data-open` state changes) all operate on DOM state or
aggregate scores, not rendered layout. Every one of them reported a pass while the drawer was
visibly broken. This is the concrete argument for why a visual pass was worth requiring before
sign-off, not a formality.

## 4. Photography dependency — re-verified, still blocked

Re-tested this session: `unsplash.com`, `images.unsplash.com`, `pexels.com`, `pixabay.com`,
plus (newly tried) `commons.wikimedia.org`, `upload.wikimedia.org`, `images.nasa.gov`, and
`www.loc.gov` all return `CONNECT tunnel failed, response 403` from this environment's network
proxy. `fonts.googleapis.com` returns a real `200` for comparison — this is a specific
image-hosting block, not a general outage. Full exact specs (placements, dimensions, art
direction, four already-identified Unsplash-License candidate photos with photographer credit)
are in `08-photography-requirements.md`, written so resolving this is a mechanical task once the
domains are allowed or someone downloads the candidates manually.

## 5. Functional verification

- **Every page** (13/13): loads with zero browser console errors, zero broken internal links
  (23 checked), correct 404 handling.
- **Mobile nav**: now genuinely verified full-height and functional (see §3), not just
  attribute-tested — opens, closes on scrim click, closes on `Escape` with focus return.
- **Quote form**: valid submission → `200 {"ok":true}`, stored; missing-fields submission → `422`
  with per-field errors; honeypot-filled submission → `200` but silently discarded, not stored.
- **Contact form**: same pattern — valid → stored; under-length message → `422`.
- **Footer, CTAs**: single, consistent primary CTA per page now (previously doubled on desktop,
  see §3 bug 3); footer links, nav-list links, and the inline footer credit link all meet WCAG AA
  contrast (re-verified, `06-testing-results.md` §2).
- **Breakpoints**: 390/834/1440px all checked visually via the 39-screenshot set; no horizontal
  overflow found at any tested width after the §3 fixes (confirmed via `scrollWidth`/`clientWidth`
  checks at 360/390/430/700/834/900px, not just a visual glance).

## 6. Demo backend — verified and limitations strengthened

Re-ran the full functional test suite against `site/api/server.js` (dependency-free Node HTTP
server): validation, honeypot, and error-response behavior all confirmed correct (see
`06-testing-results.md` §5). `docs/04-technical-architecture.md` now carries an explicit "Demo
backend limitations" section stating in plain terms that no submission is a real lead, no
notification fires, and `submissions.json` is local test-only scratch output — added specifically
so this can't be mistaken for or represented as real business activity.

## 7. Case study PDF — fictional-concept disclosure verified

`docs/case-study.pdf` (7 pages, regenerated after this audit) opens with an italicized disclosure
immediately under the title, before section 1 even starts: *"Fieldstone Roofing & Exteriors is a
fictional business created to demonstrate Soltects' research, strategy, design, and development
process — it is not a real client, and no real-world business results are claimed anywhere in this
document."* The same framing repeats in §1, §14 (results), and §15 (limitations), and in-site at
`about.html#concept` and the gold concept banner on every page. Confirmed by direct page-by-page
PDF review during this audit, not assumed.

## 8. Technical claims vs. actual output — reconciliation

Every number in `case-study.md` and `06-testing-results.md` was re-run and reconciled against this
audit's actual tool output (not left at pre-audit values): the homepage mobile Performance score
(91, was 92 — normal lab variance), the storm-claims desktop score (99, was 100 — real, measured
cost of the new banner art) and its LCP (0.8s, was 0.5s), and the screenshot count (39, was 15).
No stale numbers were left in place after the fixes in §2–3 changed what they'd report.

## Remaining open items (not blockers, see final recommendation)

1. **Real photography** — blocked by this environment's network policy; fully specified and ready
   to execute in `08-photography-requirements.md` once unblocked.
2. **No live deployment** — by design, per this audit's own instruction not to deploy to the live
   Soltects website; all testing is local against `node site/api/server.js`.
3. **No third-party browser testing** (Safari/Firefox/real mobile device) — this environment only
   has Chromium available.
4. **No production-grade form backend** (real email/SMS/CRM) — explicitly out of scope and
   documented as a named dependency, not fabricated.
