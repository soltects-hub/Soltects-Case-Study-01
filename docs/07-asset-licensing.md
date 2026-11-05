# Asset Licensing & Source Documentation

## Typography

| Asset | Source | License | Commercial use |
|---|---|---|---|
| Fraunces (headings) | [Google Fonts](https://fonts.google.com/specimen/Fraunces) | SIL Open Font License 1.1 | Yes, free, no attribution required |
| Inter (body/UI) | [Google Fonts](https://fonts.google.com/specimen/Inter) | SIL Open Font License 1.1 | Yes, free, no attribution required |

Both are served from Google Fonts' CDN (`fonts.googleapis.com` / `fonts.gstatic.com`) via `<link>` tags in every page `<head>`.

## Iconography & illustration

All icons, the logo mark (`site/images/logo-mark.svg`, reused as `favicon.svg`), and the hero
roofline illustration (`site/images/art/hero-roofline.svg`) are **original SVG artwork drawn for
this project** — simple geometric shapes (roofline silhouettes, line icons) built directly in SVG
markup. Nothing here is copied from an icon library, stock illustration set, or AI image generator.

## Photography — status: blocked, not faked

**Re-verified during the production-readiness audit** (second check, same result): the blocked
hosts and the exact per-placement spec, sizes, art direction, and candidate photos now live in
`docs/08-photography-requirements.md` — that document supersedes the summary below for anyone
picking this up. The summary here is kept for the original build narrative.


The brief calls for genuine, properly licensed stock photography (e.g. Unsplash License —
free for commercial use) in place of generic AI-generated images. We attempted to source it from
Unsplash, Pexels, and Pixabay and identified specific candidate photos during research (see below),
but **this environment's outbound network policy denies `unsplash.com`, `images.unsplash.com`,
`pexels.com`, and `pixabay.com`** — `curl` to each returns `CONNECT tunnel failed, response 403`
from the environment's proxy, meaning the sandbox itself refuses the connection before any image
request is attempted.

This is a real, verified environment limitation, not a judgment call to skip photography. Per the
project brief's own instruction ("if a task requires external credentials, paid services or
permission, identify the dependency instead of pretending it is complete"), we are flagging it
rather than substituting AI-generated or unlicensed images to fill the gap.

**Candidate photos identified during research** (license and photographer confirmed via search
result metadata; direct download still blocked — verify on each photo's own page before use):

| Use | Unsplash photo | Photographer | License |
|---|---|---|---|
| Hero / roofer at work | [a-man-on-a-roof-working-on-a-roof-G2J41LRaKkE](https://unsplash.com/photos/a-man-on-a-roof-working-on-a-roof-G2J41LRaKkE) | Christer Lässman | Unsplash License |
| Storm sky | [a-view-of-a-sky-with-clouds-and-mountains-in-the-background-r1odR_Of9oQ](https://unsplash.com/photos/a-view-of-a-sky-with-clouds-and-mountains-in-the-background-r1odR_Of9oQ) | Jane Grauwick | Unsplash License |
| Ladder / fieldwork | [man-in-yellow-jacket-standing-on-red-metal-ladder-ANQK_YaidUc](https://unsplash.com/photos/man-in-yellow-jacket-standing-on-red-metal-ladder-ANQK_YaidUc) | — (listed as free download) | Unsplash License |
| Residential roofline | [charming-houses-with-tiled-roofs-in-a-grassy-yard-TOOsgPsBt-U](https://unsplash.com/photos/charming-houses-with-tiled-roofs-in-a-grassy-yard-TOOsgPsBt-U) | — | Unsplash License, "free to use" |

**What we built instead, for now:** every place a photograph would normally go uses the brand's
own SVG/CSS art direction (roofline illustrations, color-field texture, iconography) rather than a
placeholder photo box or an AI-generated "photo-style" image. This keeps the design intentional and
avoids the one thing the brief explicitly rules out — AI-generated, stock-looking photography.

**To finish this properly:** either (a) allow the above domains in this environment's network
settings (Settings → this environment → Network access → Allowed domains) and re-run the image
sourcing step, or (b) download the four photos above manually from their Unsplash pages (no
account needed — Unsplash License permits free commercial use, attribution appreciated but not
required) and drop them into `site/images/hero/`, `site/images/services/`, and
`site/images/trust/` at the filenames referenced in `docs/04-technical-architecture.md`.

## Map data

`contact.html` links out to a Google Maps search URL rather than embedding a Maps iframe — an
embedded, interactive Google Map requires a billed Google Maps Platform API key, which this
project does not have. That's named here rather than silently worked around.
