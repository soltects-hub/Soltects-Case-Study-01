# Deployment — Build Failure, Root Cause, and Fix

## Summary

A deployment of Vercel project `soltects-case-study-01` (Root Directory: `site`) failed with:

```
[BUILD_FAILED] No entrypoint found in "/vercel/path0/site". Set package.json "main" to a server
file, or add one of: app.js, app.cjs, app.mjs, app.ts, index.js, index.cjs, index.mjs, index.ts,
server.js, server.cjs, server.mjs, server.ts, main.js, main.cjs, main.mjs, main.ts, src/app.js,
src/index.js, etc.
```

**Root cause, confirmed:** the project's Framework Preset was set to Vercel's **"Node"**
framework — a distinct preset for deploying a persistent Node.js server, not a static site —
instead of "Other" (static). That preset's build step requires a server entrypoint file
(`server.js`, `index.js`, etc.) directly at the project's Root Directory (`site/`), which
correctly doesn't exist there, because this is a static site, not a Node server application.

**Why Framework Preset ended up as "Node":** Vercel's own "Node" framework definition detects via
exactly two marker patterns — a `server.js` (or `.cjs`/`.mjs`/`.ts`) file at the project root, or
one under `src/`. This repository has `site/api/server.js` — a real file, but the **local-only
dev convenience server** (see `docs/04-technical-architecture.md`), not a production entrypoint.
It's very likely this file (and the co-located `site/api/package.json`, which declares
`"main": "server.js"` — the exact shape of a server-app manifest) was picked up during project
creation — before or despite Root Directory being set to `site` — and "Node" got selected and
saved as the project's Framework Preset. Framework Preset is a **stored project setting**, not
re-detected on every build, so it stayed "Node" even though `site/` itself (correctly scoped as
Root Directory) contains no such entrypoint — hence the build failure.

## How this was verified (not just inferred)

This sandbox cannot reach the Vercel dashboard or API for this specific project (see
"Account access note" below), so the fix was verified against **Vercel's own open-source
detection logic**, installed and run directly:

```bash
npm install @vercel/fs-detectors @vercel/frameworks
```

1. **Confirmed the trigger file exists and matches Vercel's own detector:**
   `require('@vercel/frameworks').frameworks.find(f => f.slug === 'node')` returns a framework
   whose `detectors.some` list includes `{"path": "server.js"}` — and `site/api/server.js` is a
   real match for that pattern (at the time Root Directory may not yet have scoped detection to
   `site/`, or during initial repo-wide suggestion).
2. **Confirmed `site/` in isolation correctly resolves to no framework (`null`, i.e. "Other")**
   when properly scoped as the root, via `detectFrameworkRecord({ fs, frameworkList })` against
   `site/` — proving the static site itself was never the problem; the stored project setting was.
3. **Confirmed the fix is Vercel's own documented override mechanism**, not a workaround:
   > "Use the `framework` property to override the Framework Preset in Project Settings... To
   > select 'Other' as the Framework Preset, use `null`." — [vercel.com/docs/project-configuration/vercel-json](https://vercel.com/docs/project-configuration/vercel-json)
4. **Found and fixed a second, related latent bug** while testing: `detectBuilders()` against the
   full file set showed Vercel would *also* try to deploy `site/api/server.js` itself as a third
   serverless function (any `.js` file directly under `api/` is auto-detected as a function
   candidate) — but it's a persistent `http.createServer()` process with no request-handler
   export, so it would fail to build or sit broken at `/api/server`. Confirmed this is excluded
   correctly (see below) by re-running `detectBuilders()` against the post-fix file set: exactly
   `api/quote.js` and `api/contact.js` as `@vercel/node` functions, everything else `@vercel/static`,
   zero errors/warnings.
5. **Confirmed local dev is completely unaffected** — `node site/api/server.js` still runs
   identically; `.vercelignore` only affects what's uploaded to Vercel, never the local filesystem
   or git history.

## Files changed

| File | Change | Why |
|---|---|---|
| `site/vercel.json` | Added `"framework": null` | Explicitly, authoritatively pins Framework Preset to "Other" from source control — overriding whatever is stored in the dashboard, permanently, regardless of how it was set. This is the actual fix. |
| `site/.vercelignore` (new) | Excludes `api/server.js` and `api/package.json` from the deployment upload | `server.js` is local-dev-only and isn't a valid function handler (item 4 above); `package.json`'s `"main": "server.js"` is the most likely original detection trigger and isn't needed for the two real functions, which have zero dependencies. Neither file's removal from the *deployment* touches the *repository* — both remain exactly as they were for local dev. |

No `index.js` or dummy entrypoint was added — per your explicit instruction, and because doing so
would have masked the real problem (a stored, incorrect Framework Preset) rather than fixed it;
the site would also still not be a Node server, so a fake entrypoint would be actively misleading.

No page, asset, CSS, JS file, SEO metadata, sitemap, robots.txt, or functionality was touched. The
only content changes in this fix are the two files in the table above.

## Verified locally before considering this fixed

| Check | Result |
|---|---|
| `vercel.json` is valid JSON | ✅ |
| Vercel's own `detectBuilders()` against the post-`.vercelignore` file set | ✅ 0 errors, 0 warnings; `api/quote.js` + `api/contact.js` as functions, rest static |
| Vercel's own `detectFrameworkRecord()` against `site/` | ✅ `null` (Other) |
| Local server (`node site/api/server.js`) homepage | ✅ `200` |
| Local server 404 route | ✅ `404`, serves `404.html` |
| Local server `/robots.txt`, `/sitemap.xml` | ✅ `200` both |
| Local server `POST /api/quote` (valid payload) | ✅ `{"ok":true}` |
| Local server `POST /api/contact` (valid payload) | ✅ `{"ok":true}` |
| Internal link check, all 13 pages | ✅ 0 broken (23 checked) |

**What this does not prove:** that the actual live `soltects-case-study-01` project will build
successfully — this sandbox has no access to that project (see below) to trigger and watch a real
Vercel build. The verification above reproduces Vercel's own detection and build-planning logic
directly against the exact file set that will be uploaded, which is the strongest check available
without that access, but it is not a substitute for watching an actual deployment go green.

## Account access note (unchanged from the prior attempt)

This session's connected Vercel account (`soltects-5111's projects`, team
`team_VUWm7gdyl5q5kHqiro2GbZNO`) does not have a project named `soltects-case-study-01` — only one
unrelated project exists there (`baraka-events`). The project you're deploying was evidently
created in a different Vercel account/team than the one connected to this session. This sandbox
also cannot reach `vercel.com` or `*.vercel.app` directly (same network restriction documented in
`docs/09-production-readiness-audit.md` for image CDNs) — `npx vercel build` was attempted and
failed with `fetch failed` for this reason.

**To actually trigger and confirm a successful build:** push this fix (done — see commit below),
then redeploy `soltects-case-study-01` from the Vercel dashboard (Deployments → Redeploy, or push
a new commit if auto-deploy is on). If it still fails, the error will be different from the one
above (since the root cause here is fixed) — report that back and we'll continue from there.

## Demo forms vs. production lead capture

Unchanged from before — both forms are unambiguous at every layer (on-page copy, success message,
`X-Fieldstone-Demo: true` response header, `{"ok":true,"demo":true}` body, server logs, and
`docs/04-technical-architecture.md` §"Demo backend limitations"). No submission, before or after
this fix, is ever treated as, stored as, or presented as a real customer inquiry.

## Canonical URLs

Still the `.example` placeholder — unchanged, and deliberately not guessed at. See
`tests/set-canonical-domain.js` to retarget every canonical/OG/sitemap/robots URL in one command
once you have the real, confirmed domain for `soltects-case-study-01` (a Vercel **preview**
deployment gets a unique hash-suffixed URL, not the clean `project-name.vercel.app`, which is the
production alias — so the right URL to use depends on whether this ends up deployed to preview or
production).
