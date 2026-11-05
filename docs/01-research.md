# Research & Industry Selection

**Soltects — Case Study 01**
**Prepared by:** Soltects Research & Strategy
**Status:** Internal portfolio research (self-initiated, not a commissioned engagement)

## 1. Purpose

Before designing or building anything, we compared several US small-business service
categories on the dimensions that actually determine whether a website redesign moves
the needle: website quality gaps, customer-acquisition difficulty, mobile experience,
conversion opportunity, competitive intensity, and the complexity of what a compliant,
trustworthy site in that category has to do. The goal was to find a category where a
premium, conversion-focused rebuild would visibly outperform what's typical in the
market — not to pick whichever niche is easiest to mock up.

## 2. Industries compared

| Industry | Website quality gap | Acquisition difficulty | Mobile UX issues | Conversion opportunity | Competitive intensity | Notes |
|---|---|---|---|---|---|---|
| HVAC | Moderate — category is mature, many national franchises (One Hour, Aire Serv) have decent sites | High — dominated by franchise SEO budgets | Moderate | Good (avg. ~2–3% site conversion, optimized sites 5–10%) | Very high — already the most "redesigned" contractor vertical | Hard to look distinctive; most agencies already showcase HVAC work |
| Plumbing | Moderate | High, similar franchise dynamics | Moderate | Good, mostly emergency-driven | Very high | Same saturation problem as HVAC |
| Landscaping | Low-moderate | Medium | Moderate | Fair — lower average ticket size | Medium | Less urgency in the customer journey, weaker storytelling angle |
| Residential Roofing | **High** — much of the market still runs on templated builder sites | Medium-high, but **very** local and storm-event driven | **High** — mobile click-to-call and fast load are make-or-break | **High** — high ticket size ($9k–$25k+ per job) means small lift in lead quality is worth real money | Medium — fewer polished, portfolio-grade examples than HVAC/plumbing | Strong visual storytelling (before/after), strong trust-building requirement (insurance claims), clear urgency triggers (storm damage) |

## 3. Decision: Residential Roofing

We selected **residential roofing** as the industry for this case study.

### Why

1. **Documented quality gap.** Agency research on roofing-specific sites repeatedly
   flags weak content and conversion design: one estimate puts the share of roofing
   website content that earns zero organic traffic at 98%, and another finds that many
   roofing sites still fail basic mobile-usability expectations such as a prominent,
   tappable phone number ([Hook Agency](https://hookagency.com/blog/cheap-roofing-website-builders-problems/), [CyberOptik](https://www.cyberoptik.net/blog/roofing-website-design/)). These figures come from vendor blogs rather than
   peer-reviewed research, so we treat them as directional, not as hard data — but they
   point at a real, well-documented pattern: templated roofing sites with thin content
   and poor mobile ergonomics are common.
2. **High transaction value.** A full roof replacement typically runs several thousand
   to tens of thousands of dollars. That changes the ROI math on UX work — a contractor
   doesn't need a huge lift in traffic to justify a better site; a handful of additional
   qualified inquiries a month is meaningful revenue.
3. **Strong, legitimate trust-building requirement.** Roofing — especially storm and
   insurance-claim work — is a category where homeowners are making a high-stakes
   decision under time pressure, often while dealing with an insurer. Research on
   roofing insurance-claim pages suggests the sites that convert best are the ones that
   explain the claims process in plain language and are honest about what the contractor
   does and doesn't control, rather than leaning on fear-based urgency copy
   ([industry marketing guidance summarized across contractor-marketing sources](https://contractorsliability.com/blog/5-steps-file-roofing-insurance-claim/)).
   That gives us a genuine UX/content problem to solve, not just a visual refresh.
4. **Visual storytelling fit.** Roofing is one of the few trades where before/after
   photography, material close-ups, and completed-project galleries are natural,
   non-gimmicky content — a good match for a design-led portfolio piece.
5. **Clear mobile-first requirement.** Industry sources consistently point to the
   tap-to-call phone link and a persistent mobile call-to-action as the single highest-
   leverage pattern for contractor sites ([service industry mobile UX guidance](https://www.dbswebsite.com/blog/increase-conversions-mobile-click-to-call/)), and to page speed as a
   direct driver of bounce rate — a frequently cited (but unverified-primary-source)
   figure puts mobile abandonment above a 3-second load threshold at over half of
   visitors. This gives the build a measurable, testable technical target (see
   `06-testing-results.md`).
6. **Less saturated as a portfolio example.** HVAC and plumbing are the categories most
   digital agencies already use for home-services case studies. Roofing — particularly
   roofing framed around storm/insurance-claim trust-building — is comparatively
   under-represented in polished agency portfolios, which gives Soltects a more
   differentiated first case study.

### Market context used for the decision

- Home-services businesses are increasing marketing investment broadly: CallRail's
  2026 data shows 72% of home-services businesses plan to raise marketing budgets in
  2026 ([CallRail](https://callrail.com/blog/home-services-marketing-statistics)).
- Spend is skewed toward paid ads over SEO/content: roughly 75% of home-services firms
  invest in digital advertising versus 37% in SEO ([Scorpion data cited via WebToniq-style industry roundups](https://callrail.com/blog/home-services-marketing-statistics)) — which is consistent with a
  market where organic/on-site conversion design is comparatively neglected relative to
  ad spend, i.e. exactly the gap a strong website closes.
- Local-intent behavior matters disproportionately: a commonly cited (vendor-sourced,
  unverified-primary) figure suggests a majority of local-service searchers contact a
  business straight from the search results without visiting the site at all — which is
  why this project treats Google Business Profile–aligned local SEO, NAP consistency,
  and structured data as part of the deliverable, not an afterthought (see
  `05-seo-implementation.md`).

### Caveat on sourcing

Nearly all quantitative claims available on this topic come from marketing agencies
with a commercial interest in roofing SEO/web-design services, not from independent or
academic research. We've used them only to identify *directional* patterns (mobile
usability matters, trust content matters, content output is often thin) — never as
hard performance claims about this project. Every number that appears later in this
case study's "Results" section is either a tool-measured score (Lighthouse, manual
testing) or is explicitly labeled as an estimate/design objective, per the project's own
quality bar in section 7 of the brief.

## 4. Selected business concept

To build a realistic, non-generic site, we invented an original demonstration
business rather than using a real company:

- **Business:** Fieldstone Roofing & Exteriors
- **Market:** Kansas City metro area (Overland Park, Olathe, Lenexa, Shawnee, Kansas
  City MO/KS, Independence) — a real US metro chosen because the region sits in a
  high-frequency hail corridor, which makes storm-damage/insurance-claim roofing a
  realistic, common service line (not an invented pain point).
- **Services demonstrated:** roof replacement, roof repair, storm & hail damage /
  insurance claim assistance, and gutter replacement.
- **This is a concept demonstration only.** Fieldstone Roofing & Exteriors is not a
  real business, has no real clients, reviews, history, or certifications. The site
  is clearly labeled as a Soltects portfolio concept (see footer and
  `/about` page disclosure).

## 5. Competitor reference points (structure only, not content/branding)

We looked at how established roofing-marketing sites structure their information
architecture and CTAs — without copying their copy, layouts, or visual design:

- Hook Agency's roofing design writeups ([link](https://hookagency.com/blog/cheap-roofing-website-builders-problems/)) — recurring
  structural advice: separate residential/commercial, lead with a quote CTA, keep
  service pages focused on search intent rather than decorative copy.
- CyberOptik's "converting elements" roofing roundup ([link](https://www.cyberoptik.net/blog/roofing-website-design/)) — reinforces
  trust signals, responsive design, and compressed imagery as baseline requirements.
- Contractor insurance-claim guidance pages ([example](https://contractorsliability.com/blog/5-steps-file-roofing-insurance-claim/), [example](https://www.roof-crafters.com/learn/how-do-storm-damage-insurance-claims-work)) —
  used only to understand the real step-by-step claims journey (inspection →
  documentation → insurer negotiation → repair), which we paraphrased in our own words
  for the Storm & Insurance Claims page.

## 6. Accessibility & compliance research

- WCAG 2.1 AA is the level most small-business guidance recommends targeting; it is
  not a blanket legal requirement for private businesses under current DOJ ADA rule
  scope, but is treated across the industry as the practical good-practice bar
  ([NFIB ADA guidance summary](https://www.nfib.com/wp-content/uploads/2025/08/ADA-Website-Accessibility.pdf), [Small Business BC checklist](https://smallbusinessbc.ca/wp-content/uploads/2024/03/WAR-checklist-WCAG.240301-1.pdf)).
  This project targets WCAG 2.1 AA and documents actual findings in
  `06-testing-results.md`, rather than claiming certified compliance.

## Sources

- [Hook Agency — Cheap Roofing Website Builder Problems](https://hookagency.com/blog/cheap-roofing-website-builders-problems/)
- [CyberOptik — Roofing Website Design](https://www.cyberoptik.net/blog/roofing-website-design/)
- [DBS Interactive — Increase Conversions with Mobile Click-to-Call](https://www.dbswebsite.com/blog/increase-conversions-mobile-click-to-call/)
- [CallRail — 31 Home Services Marketing Statistics (2026)](https://callrail.com/blog/home-services-marketing-statistics)
- [Contractors Liability — 5 Steps to File a Roofing Insurance Claim](https://contractorsliability.com/blog/5-steps-file-roofing-insurance-claim/)
- [Roof Crafters — How Do Storm Damage Insurance Claims Work](https://www.roof-crafters.com/learn/how-do-storm-damage-insurance-claims-work)
- [NFIB — ADA Website Accessibility Guidance (PDF)](https://www.nfib.com/wp-content/uploads/2025/08/ADA-Website-Accessibility.pdf)
- [Small Business BC — WCAG 2.1 Accessibility Checklist (PDF)](https://smallbusinessbc.ca/wp-content/uploads/2024/03/WAR-checklist-WCAG.240301-1.pdf)
- [webtonic.io — HVAC SEO & Conversion Statistics](https://www.webtonic.io/blog/hvac-seo-statistics) *(used for cross-category comparison only; HVAC was not selected)*
