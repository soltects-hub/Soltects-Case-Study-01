# SEO Implementation

Full rationale is in `04-technical-architecture.md`, "SEO implementation." This is the per-page
reference used for QA (every row below was checked against the live file, not written from memory
— see `06-testing-results.md` for the audit).

## Per-page metadata

| Page | Title | Canonical |
|---|---|---|
| `/index.html` | Roofing Contractor in Overland Park & Kansas City \| Fieldstone Roofing & Exteriors | `/` |
| `/about.html` | About Fieldstone Roofing & Exteriors \| Overland Park, KS | `/about.html` |
| `/services/index.html` | Roofing Services \| Fieldstone Roofing & Exteriors | `/services/index.html` |
| `/services/roof-replacement.html` | Roof Replacement \| Fieldstone Roofing & Exteriors | `/services/roof-replacement.html` |
| `/services/roof-repair.html` | Roof Repair \| Fieldstone Roofing & Exteriors | `/services/roof-repair.html` |
| `/services/storm-damage-insurance-claims.html` | Storm Damage & Insurance Claim Help \| Fieldstone Roofing & Exteriors | `/services/storm-damage-insurance-claims.html` |
| `/services/gutter-replacement.html` | Gutter Replacement \| Fieldstone Roofing & Exteriors | `/services/gutter-replacement.html` |
| `/quote.html` | Request a Free Roof Inspection \| Fieldstone Roofing & Exteriors | `/quote.html` |
| `/contact.html` | Contact Fieldstone Roofing & Exteriors \| Overland Park, KS | `/contact.html` |
| `/faq.html` | FAQ \| Fieldstone Roofing & Exteriors | `/faq.html` |
| `/privacy-policy.html` | Privacy Policy \| Fieldstone Roofing & Exteriors | `/privacy-policy.html` |
| `/terms.html` | Terms & Conditions \| Fieldstone Roofing & Exteriors | `/terms.html` |
| `/404.html` | Page Not Found \| Fieldstone Roofing & Exteriors | none (`noindex`) |

All canonicals use the base `https://www.fieldstoneroofingkc.example` (reserved, non-resolving
`.example` TLD — see `07-asset-licensing.md` for why a placeholder domain was used instead of a
real one).

## Structured data (JSON-LD)

- **Homepage** — `RoofingContractor` (subtype of `LocalBusiness`): name, description, URL,
  telephone, address, `areaServed`, `openingHoursSpecification`.
- **Contact page** — `RoofingContractor` with NAP fields repeated for that page's own context.
- **Storm & insurance claims page** — `Service` with `serviceType`, `provider`, `areaServed`.
- Not used anywhere: `Review`, `AggregateRating`, or `Organization.award` — adding any of these
  without real reviews/awards would be exactly the fabricated trust signal the brief prohibits.

## Indexability

- `robots.txt` allows all crawling except `/api/` (no reason for a crawler to hit the form
  endpoints, and POST-only routes return 405 to GET anyway).
- `sitemap.xml` lists all 12 real content pages (not the 404 page).
- Every real page carries `<meta name="robots" content="index, follow">`; `404.html` carries
  `noindex, follow`.

## URL structure

Flat, descriptive, hyphenated paths under `/services/` for the four service lines — no query
strings, IDs, or date-based paths. This matches the structural advice found repeatedly in
competitor-site research (`01-research.md`): separate, intent-matched service pages rather than
one page trying to rank for every service term at once.
