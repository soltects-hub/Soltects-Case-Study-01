# Deployment — Status, Plan, and Exact Blocker

## Status: blocked on Vercel account permissions, not on this project's readiness

The site, serverless functions, and deployment config are all built and ready. Creating the
Vercel project itself is what's currently failing — see below for the exact error and remedy.

## What's ready to deploy

- **Static site** — `site/`, a dependency-free, zero-build-step HTML/CSS/JS site (see
  `docs/04-technical-architecture.md`).
- **Serverless functions** — `site/api/quote.js` and `site/api/contact.js`, written this session
  specifically for this deployment. The local dev server (`site/api/server.js`) is a persistent
  Node `http.createServer` process, which doesn't run on Vercel's stateless function model, so
  these are a proper port of the same validation/honeypot logic to Vercel's Node serverless
  function convention (`module.exports = (req, res) => {...}`, auto-detected from any `.js` file
  under `/api`). They validate and log to the function's runtime logs; see "Demo forms vs.
  production lead capture" below for why they don't persist anywhere.
- **`site/vercel.json`** — security headers (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, a restrictive `Permissions-Policy`) and long-lived immutable caching for
  `/css`, `/js`, `/images`. No changes needed for this deployment.
- **`tests/set-canonical-domain.js`** — a tested, working script that retargets every
  canonical/OG/JSON-LD URL plus `sitemap.xml` and `robots.txt` from the current placeholder
  domain to a real one, in one command:
  ```bash
  node tests/set-canonical-domain.js https://<the-real-preview-domain>
  ```
  Deliberately not run against a guessed URL — see "Why canonical URLs are still the placeholder
  domain" below.

## The exact blocker

This session's connected Vercel account (`soltects-5111's projects`, team
`team_VUWm7gdyl5q5kHqiro2GbZNO`) can **list** teams and projects (one existing, unrelated project:
`baraka-events`) but **cannot create a new project**:

```
POST /v11/projects → 403 forbidden
"You don't have permission to create the project."
```

A direct deployment call (which would normally auto-provision a new project as a side effect) was
also attempted twice and timed out both times rather than completing — consistent with the same
underlying permission gap rather than a transient network issue. No project or deployment was
created by either attempt (verified via `list_projects` after each try).

**Remedy — one of:**
1. Grant this Vercel integration/token **project-creation** permission on the
   `soltects-5111's projects` team (Vercel dashboard → Team Settings → the integration's
   permissions), then this deployment can proceed in a follow-up turn; or
2. Create the Vercel project yourself (Vercel dashboard → Add New → Project), named something
   clearly separate from Soltects production (e.g. `soltects-case-study-01-fieldstone`), with
   **Root Directory** set to `site`, **Framework Preset** set to "Other", then tell us the
   project name or URL — deploying *to an existing project* may work even if creating one
   doesn't, since it's a different permission scope; or
3. Deploy it yourself via the Vercel CLI from this repository:
   ```bash
   cd site
   vercel --prod=false   # preview deployment, not production
   ```

## Why this is a genuinely separate, non-production deployment

- **New project, not an existing one.** We did not attempt to deploy into `baraka-events` (the
  only existing project in this account) or any Soltects production project — there isn't one in
  this Vercel account, and nothing suggests the real soltects.com is hosted here. Per your
  instruction, we made zero attempts to touch a live Soltects site.
- **`target` omitted** on the planned deployment call, which defaults to `preview` per Vercel's
  own API (only an explicit `target: "production"` promotes a deployment to a production alias).
- **Project name** (`soltects-case-study-01-fieldstone`) is unambiguous in the Vercel dashboard —
  it cannot be confused with a production Soltects property.

## Why canonical URLs are still the placeholder domain

Vercel **preview** deployments (as opposed to production) get a unique, hash-suffixed URL (e.g.
`soltects-case-study-01-fieldstone-abc123-soltects-5111s-projects.vercel.app`), not the clean
`project-name.vercel.app` — which is reserved for the production alias. Writing a *guessed* clean
URL into 14 files' canonical tags, before a deployment exists to confirm the real one, risks
shipping incorrect SEO metadata — worse than the current, honestly-labeled `.example` placeholder
(a reserved, non-resolving TLD per RFC 2606; see `docs/05-seo-implementation.md`). The retargeting
script above makes fixing this a 10-second job the moment a real URL exists.

## Demo forms vs. production lead capture

Both forms are unambiguous, redundantly, at every layer:

| Layer | What it says |
|---|---|
| On-page copy (`quote.html`) | "This is a case-study demo: submissions go to a documented sample backend, not a live roofing company." |
| Success message (`js/main.js`) | "Thanks — this is a demo submission for the Soltects case study..." |
| Response header (`api/quote.js`, `api/contact.js`) | `X-Fieldstone-Demo: true` on every response |
| Response body | `{"ok": true, "demo": true}` |
| Server logs | Logged as `[fieldstone-demo] ... (test data, not a real lead)` |
| Documentation | `docs/04-technical-architecture.md`, "Demo backend limitations" — states plainly that no notification fires and nothing is followed up on |
| README | New "Demo forms vs. production lead capture" section (see README.md) |

No submission — local or on a deployed preview — is ever treated as, stored as, or presented as a
real customer inquiry.

## Verification plan once deployed

1. `mcp__Vercel__web_fetch_vercel_url` (routes through Vercel's own infrastructure, not this
   sandbox's restricted egress) against the homepage, two interior pages, `robots.txt`, and
   `sitemap.xml` — confirms real HTTP status codes and HTML content server-side.
2. `mcp__Vercel__list_deployment_files` / `get_deployment_file_contents` to confirm the deployed
   file set matches the committed repository exactly (file-identity check).
3. POST to `/api/quote` and `/api/contact` to confirm the serverless functions respond correctly
   (this sandbox's raw `curl`/browser cannot reach `*.vercel.app` directly — see
   `09-production-readiness-audit.md` for the same restriction on image CDNs — so this step uses
   the Vercel-routed fetch tool, not a local browser).
4. Note on "desktop and mobile" visual verification: this sandbox cannot launch a browser against
   an external `*.vercel.app` URL (same network restriction). The 39 screenshots already captured
   locally (`/screenshots/`, `docs/09-production-readiness-audit.md`) are pixel-accurate for the
   identical file set once a file-identity check (step 2) confirms the deployment matches — but
   they are not, and won't be presented as, screenshots of the live URL itself. If true live
   screenshots are needed, they'd need to be captured from a machine that can reach `*.vercel.app`.
