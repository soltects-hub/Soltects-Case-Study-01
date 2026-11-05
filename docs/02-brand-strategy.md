# Brand & Creative Direction

**Project:** Fieldstone Roofing & Exteriors (Soltects portfolio concept)

## 1. Positioning

Fieldstone is positioned as an established, mid-size regional roofing contractor —
not a scrappy startup, not a national franchise. The brand needs to read as
*dependable and regionally rooted*: a company a Kansas City homeowner would
recognize from a truck on their street, not a lead-gen landing page.

**Brand personality:** steady, plain-spoken, competent, warm — the contractor who
shows up on time and explains the insurance paperwork without condescension.

**What we deliberately avoided:** bright "tech startup" gradients, stock
hard-hat-and-thumbs-up photography, generic blue-and-orange contractor-template
styling, and marketing language that oversells ("revolutionary," "#1 rated").

## 2. Naming

**Fieldstone Roofing & Exteriors** — "fieldstone" evokes durability and regional
material culture (common in Midwest construction) without being a literal roofing
term, which keeps it from sounding like a generic SEO domain name
(e.g. "KC-Roof-Pros.com").

Tagline: **"Built to take the next storm."** — speaks directly to the hail-corridor
positioning without fear-based language.

## 3. Color system

Chosen to avoid the two default contractor palettes (safety-orange-and-navy, or
red-white-blue). Instead: a dark slate-green ink, a warm brick accent (echoes
terracotta roofing material and brick Midwest homes), and a warm paper background
instead of pure white.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1C2B2A` | Primary text, header/footer backgrounds, dark sections |
| `--ink-soft` | `#3A4A48` | Secondary text on light backgrounds |
| `--brick` | `#C1552E` | Primary CTA, links, active states |
| `--brick-dark` | `#A1431F` | CTA hover/active |
| `--paper` | `#F7F4EE` | Page background |
| `--paper-raised` | `#FFFFFF` | Cards, forms |
| `--sage` | `#7C8C73` | Secondary accent, tags, icons |
| `--line` | `#DCD6C8` | Borders, dividers |
| `--gold` | `#C99A3E` | Sparingly: badges, star ratings UI chrome (not fake ratings) |

Contrast was checked against WCAG AA (4.5:1 for body text) — see
`06-testing-results.md` for the actual measured pairs.

## 4. Typography

- **Headlines:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (variable
  serif) — gives the brand an editorial, established feel that differentiates it from
  the bold-grotesk-sans look nearly every contractor template defaults to.
- **Body & UI:** [Inter](https://fonts.google.com/specimen/Inter) — high legibility
  at small sizes, excellent for forms and dense service content, wide language/number
  support.
- **Scale:** a modular type scale (1.25 ratio) from 0.875rem to 3.5rem, defined as
  CSS custom properties in `site/css/tokens.css` so hierarchy stays consistent across
  every page.

## 5. Logo concept

A simple geometric wordmark: "Fieldstone" in Fraunces semibold, paired with a
minimal roofline mark (two angled strokes forming a peaked roof over a horizon line)
rendered as inline SVG — not a photographic or AI-generated logo. Scales cleanly from
favicon to header. Source file: `site/images/logo.svg`.

## 6. Imagery direction

Real, properly licensed photography only (Unsplash License — free for commercial
use; see `docs/07-asset-licensing.md` for the per-image photographer/source log).
Art direction rules:

- Overcast/storm-light exterior shots over bright "real-estate listing" sunshine —
  supports the storm-damage narrative honestly.
- Craft/material detail shots (shingles, tools, ladders) over posed "team high-five"
  stock photography.
- No photos depicting a specific identifiable real company's branding, trucks, or
  signage.
- Every image is compressed and served responsively (see `04-technical-architecture.md`).

## 7. Design system principles

1. **Purposeful motion only** — a handful of CSS transitions (hover states, mobile
   nav open/close, scroll-triggered fade-in on section headers via
   `prefers-reduced-motion`-aware `IntersectionObserver`). No decorative animation.
2. **8px spacing baseline** for consistent rhythm across breakpoints.
3. **One CTA hierarchy per page** — a single primary action ("Request a Free
   Inspection") and at most one secondary action (click-to-call), repeated
   consistently rather than competing with multiple equally-weighted buttons.
4. **Components, not one-off pages** — buttons, cards, the sticky mobile call bar,
   the quote form, and the FAQ accordion are built once in shared CSS/JS and reused
   across every page.
