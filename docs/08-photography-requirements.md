# Photography Requirements (Blocked Dependency — Exact Spec for Resolution)

**Status as of this audit:** still blocked. Re-tested during this production-readiness audit —
`unsplash.com`, `images.unsplash.com`, `pexels.com`, `images.pexels.com`, `pixabay.com`,
`cdn.pixabay.com`, and (newly tested this round) `commons.wikimedia.org`, `upload.wikimedia.org`,
`images.nasa.gov`, and `www.loc.gov` all return `CONNECT tunnel failed, response 403` from this
environment's network proxy. For comparison, `fonts.googleapis.com` returns a real `200` with
actual font CSS — so this isn't a general network outage, it's specifically that image-hosting
and public-archive domains aren't on this environment's allowed list. This is a sandbox
configuration limit, not a decision we're making on the project's behalf.

This document exists so that resolving it later is a 30-minute mechanical task, not a redesign:
exact placements, dimensions, art direction, and specific candidate source photos with their
licenses already identified.

## How to unblock

Either:
1. In this environment's settings, add the domains above to **Network access → Allowed domains**
   (see `https://code.claude.com/docs/en/cloud-environments#network-access`), then re-run the
   sourcing step — the exact photo IDs below are ready to fetch; **or**
2. Download the candidate photos below manually (no account required; Unsplash License permits
   free commercial use) on any unrestricted machine and drop them into the paths listed.

## Exact placements and specs

| Placement | File path | Recommended size | Aspect | Priority |
|---|---|---|---|---|
| Homepage hero, replacing/behind the SVG roofline art | `site/images/hero/hero-roofer.jpg` | 1600×1000px min | ~16:10 | High |
| Storm & insurance claims page, header or inline | `site/images/services/storm-sky.jpg` | 1200×800px | 3:2 | High |
| Roof replacement page, inline with "What the install day looks like" | `site/images/services/roof-install.jpg` | 1200×800px | 3:2 | Medium |
| Roof repair page, inline with common issues section | `site/images/services/roof-detail.jpg` | 1200×800px | 3:2 | Medium |
| Gutter replacement page, inline with install process | `site/images/services/gutters.jpg` | 1200×800px | 3:2 | Medium |
| About page, alongside "How we operate" | `site/images/services/residential-roofline.jpg` | 1200×900px | 4:3 | Medium |
| Services hub, small thumbnail per service card (optional) | `site/images/services/{service}-thumb.jpg` | 600×400px | 3:2 | Low |

All images: compressed to WebP with a JPEG fallback (`<picture>`), target under 150KB per image
at these dimensions, `loading="lazy"` on every image below the fold, explicit `width`/`height`
attributes to avoid layout shift, and descriptive (not keyword-stuffed) `alt` text.

## Art direction (already established, see `docs/02-brand-strategy.md` §6)

- Overcast/storm-light exterior shots over bright "real-estate listing" sunshine.
- Craft/material detail shots (shingles, tools, ladders, gutters) over posed "team high-five"
  stock photography.
- No photo depicting a specific identifiable real company's branding, trucks, or signage.
- No people whose faces are prominently identifiable without a model release on file (none of the
  candidates below are close-up portraits for exactly this reason).

## Candidate photos (license-verified via search metadata; not yet downloaded)

| Use | Unsplash photo | Photographer | License |
|---|---|---|---|
| Hero / roofer at work | [a-man-on-a-roof-working-on-a-roof-G2J41LRaKkE](https://unsplash.com/photos/a-man-on-a-roof-working-on-a-roof-G2J41LRaKkE) | Christer Lässman | Unsplash License |
| Storm sky | [a-view-of-a-sky-with-clouds-and-mountains-in-the-background-r1odR_Of9oQ](https://unsplash.com/photos/a-view-of-a-sky-with-clouds-and-mountains-in-the-background-r1odR_Of9oQ) | Jane Grauwick | Unsplash License |
| Ladder / fieldwork | [man-in-yellow-jacket-standing-on-red-metal-ladder-ANQK_YaidUc](https://unsplash.com/photos/man-in-yellow-jacket-standing-on-red-metal-ladder-ANQK_YaidUc) | — (listed as free download) | Unsplash License |
| Residential roofline | [charming-houses-with-tiled-roofs-in-a-grassy-yard-TOOsgPsBt-U](https://unsplash.com/photos/charming-houses-with-tiled-roofs-in-a-grassy-yard-TOOsgPsBt-U) | — | Unsplash License |

These four were found during the original build (see Case Study 01 session) via Unsplash's own
search; **none have been downloaded or viewed pixel-by-pixel by us** — the network block applied
before we could open the pages to verify framing/quality or grab the download URL. Whoever
executes this later should: open each page, confirm the photo still exists and still carries the
Unsplash License (not since moved to Unsplash+, which is paid), download the largest available
size, and only then crop to the dimensions above. **Do not treat this table as "sourcing already
done" — it's a documented starting point, not cleared inventory.** Four candidates also isn't
enough to fill all seven placements above; roof-repair, gutters, and the services-hub thumbnails
still need their own search pass.

## Explicitly out of scope for this fix

- **AI-generated photographs or "photo-style" renders** — ruled out by the project brief itself,
  not a cost/time tradeoff.
- **Stock photos depicting a specific real roofing brand's trucks, uniforms, or signage** — would
  misleadingly imply a real company relationship.
- **Paid stock libraries (Getty, Shutterstock, Adobe Stock, Unsplash+)** — would require a budget
  decision and license terms review this case study doesn't have authority to make unilaterally.

## What ships today instead

Every placement above currently uses the site's own SVG/CSS art direction (the roofline motif in
`site/images/art/hero-roofline.svg`, now also used on every interior page banner, plus a subtle
paper-grain texture, see `docs/02-brand-strategy.md`). This was a deliberate choice made during
this audit specifically *because* AI-generated photography was ruled out and real photography
stayed blocked — original illustration was the only honest option left, and it reads as
intentional brand design rather than a missing-image placeholder.
