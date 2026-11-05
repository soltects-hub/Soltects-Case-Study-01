# Cinematic Redesign — Audit & Implementation Plan

**Soltects Case Study 01, Phase 2 of the project.** This document is the required Phase 1 (Audit)
+ Phase 2 (Creative Direction) deliverable, written before any redesign code. Read this before
`docs/12-cinematic-redesign-results.md` (testing/results, written after implementation).

## Phase 1 — Audit

### 1.1 Reference site: genuinely inaccessible from this environment

`era-residence.com` was tested three ways this session — direct `curl`, the `WebFetch` tool, and a
search for any browser-capable tool with independent network access — and **all three failed**
with the same network-policy block already documented for stock-photo hosts
(`docs/07-asset-licensing.md`, `docs/08-photography-requirements.md`) and `vercel.com`
(`docs/10-deployment.md`). This session has no browser tool with its own network path (no Chrome
extension, no computer-use, no desktop app connection) — it's a headless cloud session. This is a
hard, confirmed blocker, not a judgment call: **I did not inspect the live reference site's actual
behavior**, and I want that stated plainly rather than implied by a confident-sounding design
system that quietly wasn't checked against it.

**What this plan is built on instead:**
- Your own specification (sections 3–6 of the brief), which already describes the reference's
  interactions in enough operational detail to implement directly — full-viewport hero, minimal
  nav with animated full-screen menu, scroll-triggered reveals, image masks, parallax, pinned
  editorial sections, horizontal draggable gallery, before/after slider, floating CTA, cookie
  consent. I'm treating your spec as the authoritative interaction list, not a paraphrase of
  something I verified independently.
- General, well-established knowledge of this design genre — cinematic hospitality/real-estate/
  architecture sites built around GSAP ScrollTrigger, full-bleed photography, large editorial
  serif type, and horizontal drag galleries are a recognizable, common Awwwards category with
  well-known construction patterns, independent of this one specific site.

**If precise visual matching to era-residence.com specifically matters** (not just "this genre of
site"), the accurate way to get that is for you to allow `era-residence.com` in this environment's
network settings, or share screenshots/screen recordings of the specific moments that matter most
(hero load, menu open, gallery drag, before/after interaction) — then I can match those precisely
instead of working from genre knowledge. Proceeding without that, per your "then proceed with the
redesign" instruction, but flagging it as the single largest fidelity risk in this plan.

### 1.2 Current site audit

13 pages, static HTML/CSS/JS, zero build step (see `docs/04-technical-architecture.md`). Current
visual language: Fraunces/Inter type pairing, warm slate-green/brick/paper palette, a single
reused SVG roofline motif, a sitewide 3.5%-opacity paper-grain texture, no photography anywhere
(see §1.3). Structurally sound (100/100/100/100 Lighthouse on 3 of 4 tested pages, 0 broken links,
0 console errors as of the last audit, `docs/09-production-readiness-audit.md`) but, in your own
words, reads as "a basic, conventional business website" — flat sections, modest type scale,
conventional card grids, a standard off-canvas mobile nav. That's the honest starting point this
redesign has to move from.

**What's being kept:** the color tokens (ink/brick/paper/sage/gold), the Fraunces+Inter pairing,
all 13 pages' content/copy/SEO metadata/structured data/sitemap/robots.txt, the demo-backend
architecture and its disclosures, the fictional-business disclosure system, and the roofline brand
motif (evolved, not discarded).

**What's changing:** the type *scale* (much larger, more editorial), layout system (asymmetrical,
full-bleed, generous whitespace vs. the current centered-card-grid pattern), navigation (full-
screen animated overlay vs. the current off-canvas drawer), motion (GSAP ScrollTrigger-driven
reveals/parallax/pinning vs. the current single IntersectionObserver fade-in), and the addition of
net-new interactive components (draggable gallery, before/after slider, services explorer, pinned
process sequence, multi-step estimate flow, floating CTA, cookie consent) that don't exist today.

### 1.3 Photography — still blocked, now the central design constraint

Re-confirmed this session (same result as the last two audits): Unsplash, Pexels, Pixabay,
Wikimedia, NASA, LOC, and now `era-residence.com` and `cdnjs.cloudflare.com` are all blocked by
this environment's network policy. This matters far more for *this* request than the last one,
because "cinematic full-screen photography" is close to the core deliverable, not a nice-to-have.

**I will not substitute AI-generated or stock-photo-lookalike imagery for this** — ruled out
explicitly by you, and by my own judgment it's the single fastest way to make a "cinematic" site
look fake. Instead, Phase 2 below elevates the existing original-SVG approach to a much higher
production level specifically so it can credibly carry full-bleed hero/section treatments: large-
format duotone architectural/roofline compositions, not icon-sized illustrations. Every such
placement is built to be a **drop-in replacement point** — swap one file, nothing else changes —
for when real photography is available. `docs/08-photography-requirements.md` is updated with the
exact new placements this redesign needs.

## Phase 2 — Creative Direction

### 2.1 Typography

- **Display/hero scale**: new `--display-1` through `--display-3` tokens, up to `clamp(3.5rem,
  3rem + 6vw, 8.5rem)` for hero headlines — roughly 2.5× the current largest size. Fraunces at
  its heaviest weight for these; Inter stays for UI/body/labels.
- **Editorial line-length discipline**: headline containers capped at 14–18 characters per line on
  desktop (matching the reference genre's short, stacked headline convention), not paragraph-width.

### 2.2 Color — preserved, extended

Kept exactly: `--ink`, `--brick`, `--brick-dark`, `--paper`, `--sage`, `--gold`, and the AA-
contrast fixes from the production-readiness audit. **Added**: `--cinema` (a deeper near-black,
`#101917`, for full-bleed photo/art scrims — distinct from `--ink` so text-on-image contrast is
guaranteed independent of future photography's actual tonal range) and scrim-gradient tokens for
legible text over imagery.

### 2.3 Layout system

12-column grid with deliberate asymmetry (image/text splits offset from center, never a
dead-centered card grid), full-bleed (`100vw`) sections that break out of the content container,
and roughly double the vertical whitespace of the current design between major sections.

### 2.4 Motion architecture

- **GSAP 3.12.5 + ScrollTrigger**, vendored locally at `site/js/vendor/gsap/` (not a CDN — this
  environment can't reach cdnjs to verify a CDN path works, and vendoring is more consistent with
  the site's zero-build, self-contained architecture anyway). Free under GreenSock's standard
  no-charge license post-2024 (includes what used to be Club GreenSock-only plugins); documented in
  `docs/07-asset-licensing.md`. **Revised during implementation**: `Draggable` and `Observer` were
  vendored but ultimately not shipped — see the deviation note in §2.5.
- **Reveal pattern**: staggered word/line/element fade-rise on scroll-into-view, via
  `ScrollTrigger`. Default, not negotiable per-element — this is what keeps motion *restrained*
  rather than every element animating independently, per your explicit instruction.
- **Parallax**: subtle only (art layers move at 0.85–0.95× scroll speed, never full-speed
  background tricks), used on the hero and section transitions, not globally.
- **Pinning**: used once, deliberately, for the "Our Process" sequence (a horizontally-advancing,
  vertically-pinned sequence) — not for scroll-hijacking the whole page. The page's own scrollbar
  always stays in normal control; pinning holds a section in place for a bounded scroll distance,
  which is standard, accessible ScrollTrigger behavior, not a custom scroll-jack.
- **`prefers-reduced-motion`**: a single `matchMedia` gate at the top of the new interaction
  script disables every GSAP animation and parallax transform, showing final states immediately —
  tested explicitly in Phase 6, not assumed.
- **Counters**: only for already-true, already-published facts (e.g. "4" core services, "48"-hour
  inspection response window, the number of cities in the service area) — never a fabricated
  business metric. No completed-projects count, no revenue/conversion number, nothing presented as
  real performance.

### 2.5 Interaction map — reference concept → Fieldstone implementation

| Reference-genre interaction (per your spec) | Fieldstone implementation |
|---|---|
| Full-viewport hero with animated intro type | New hero: full-bleed duotone roofline art, staggered headline reveal, elegant scroll indicator |
| Minimal nav, full-screen animated menu | New `.nav-overlay` component: dark full-screen panel, staggered link reveal, Escape/outside-click/X close |
| Scroll-triggered reveals / image masks | `ScrollTrigger`-driven fade-rise + `clip-path` wipe reveals on every major section |
| Horizontal draggable gallery | Custom pointer-events drag-to-scroll (see deviation note below) + prev/next buttons, works identically on mouse and touch |
| Before/after comparison slider | Custom pointer-events slider, ARIA `slider` role, keyboard arrow support, touch-drag |
| Sticky editorial sections | Pinned "Our Process" sequence only (see 2.4) |
| Floating booking CTA | Floating "Request an Estimate" button, appears after hero, intelligent show/hide on scroll direction |
| Cookie consent | Branded bottom banner, Accept/Decline, choice persisted in `localStorage`, functional (not decorative) |
| Multi-step booking flow | Multi-step estimate form (3 steps: contact info → property/service → project details), same fields as the existing quote form, same demo backend, same disclosures |

**Deviation found during implementation — GSAP Draggable dropped for the gallery.** The plan above
called for `Draggable` with `type: "scrollLeft"`. In actual testing this restructured the gallery's
DOM (it wraps the dragged children in its own proxy element), which broke the fixed `flex: 0 0
420px` sizing on every gallery item — items stretched to fill the full track width instead of
staying a fixed card size. Rather than fight the plugin's DOM assumptions, `site/js/gallery.js` was
rewritten to a plain `pointerdown`/`pointermove`/`pointerup` handler that adjusts `track.scrollLeft`
directly — no DOM restructuring, same drag-to-scroll feel, works on mouse and touch alike.
`Draggable.min.js` and `Observer.min.js` were vendored but are unused by the shipped code and have
been removed from the repo rather than kept as dead weight.

### 2.6 File architecture (additive, not destructive)

As actually shipped for the homepage (Phase 3):

```
site/css/tokens.css        extended with --display-*, --cinema, scrim tokens
site/css/base.css          kept as-is (still used by pages not yet migrated in Phase 4)
site/css/cinematic.css     NEW — the redesign's component system
site/js/vendor/gsap/       NEW — gsap.min.js, ScrollTrigger.min.js only (Draggable/Observer vendored
                            then removed — see deviation note above)
site/js/cinematic.js       NEW — nav overlay, header transition, reveals, parallax, counters,
                            pinned process sequence, floating CTA, cookie consent,
                            prefers-reduced-motion gate, services explorer
site/js/gallery.js         NEW — pointer-events drag-to-scroll gallery component
site/js/before-after.js    NEW — before/after slider component (pointer events, ARIA slider, keyboard)
site/js/estimate-form.js   NEW — 3-step estimate form controller (per-step validation, same demo
                            backend as quote.html)
site/js/main.js            kept — still runs the quote/contact forms and legacy-page nav/accordion
```

**Second deviation found during implementation — a pre-existing, sitewide bug, not introduced by
this redesign.** Building the estimate form's step-by-step validation (`checkValidity()` called
explicitly per step) surfaced a real regex syntax error in the phone-number `pattern` attribute —
`^[0-9 ()+-]{7,}$` throws `Invalid character in character class` under the newer Unicode-Sets
("v" flag) regex mode that current Chromium versions use to compile HTML `pattern` attributes. This
bug already existed on `quote.html` and `contact.html` before this redesign; it was never caught by
prior sessions' page-load-only console checks because it only surfaces when `checkValidity()` is
actually invoked. Fixed sitewide (all three occurrences, `quote.html`, `contact.html`, and the new
`index.html`) to `^[0-9\(\)+\-\s]{7,}$`, which is equivalent but valid under the stricter mode.

Pages migrate to the new system one at a time (Phase 3: homepage; Phase 4: the other 12) rather
than a single atomic rewrite — each migrated page is fully functional and tested before the next
starts, so the site is never in a broken intermediate state if this spans multiple sessions.

## Execution plan for the rest of this session

Given the genuine scope here (this is, realistically, a multi-thousand-line redesign touching
every page), this session will complete **Phase 3 (homepage) fully — built, polished, and
tested** — and report honest status on Phases 4–7, rather than spreading effort thin across all 13
pages at low fidelity. "Do not claim completion based on code implementation alone" applies most
to the homepage, since it's the one piece meant to finish this session: it gets real screenshots,
a real Lighthouse run, and a real list of verified interactions before I call it done.
