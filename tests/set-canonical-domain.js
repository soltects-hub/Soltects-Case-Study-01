#!/usr/bin/env node
/**
 * Retargets every canonical/OG/JSON-LD URL and sitemap/robots entry from
 * the placeholder domain to a real one — e.g. once a Vercel preview URL
 * exists. Written so that step is a single command, not a manual find
 * pass across 13 HTML files + sitemap.xml + robots.txt.
 *
 * Usage:
 *   node tests/set-canonical-domain.js https://soltects-case-study-01-fieldstone.vercel.app
 *
 * The new domain must NOT have a trailing slash. Re-run it again with a
 * different domain at any time — it always replaces whatever the current
 * placeholder/previous domain is, read from site/index.html's own
 * canonical tag, so it's idempotent and safe to run more than once.
 */
const fs = require("fs");
const path = require("path");

const newDomain = process.argv[2];
if (!newDomain || !/^https:\/\/[^/]+$/.test(newDomain)) {
  console.error("Usage: node tests/set-canonical-domain.js https://your-domain.example");
  console.error("(no trailing slash, https:// required)");
  process.exit(1);
}

const siteRoot = path.join(__dirname, "..", "site");

function findCurrentDomain() {
  const indexHtml = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
  const m = indexHtml.match(/rel="canonical" href="(https:\/\/[^/"]+)/);
  if (!m) throw new Error("Could not find a canonical tag in site/index.html to read the current domain from.");
  return m[1];
}

function walk(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.includes(path.extname(entry.name))) out.push(full);
  }
  return out;
}

const oldDomain = findCurrentDomain();
if (oldDomain === newDomain) {
  console.log(`Already set to ${newDomain} — nothing to do.`);
  process.exit(0);
}

const files = walk(siteRoot, [".html", ".xml", ".txt"]);
let totalReplacements = 0;
let filesChanged = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const oldDomainEscaped = oldDomain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const occurrences = (content.match(new RegExp(oldDomainEscaped, "g")) || []).length;
  if (occurrences === 0) continue;
  const updated = content.split(oldDomain).join(newDomain);
  fs.writeFileSync(file, updated);
  totalReplacements += occurrences;
  filesChanged += 1;
  console.log(`  ${path.relative(siteRoot, file)}: ${occurrences} replacement(s)`);
}

console.log(`\nRetargeted ${oldDomain} -> ${newDomain}`);
console.log(`${totalReplacements} replacement(s) across ${filesChanged} file(s).`);
console.log("\nRemember to also update: og:image URLs if they're absolute, and re-run");
console.log("tests/linkcheck.js against the live deployment to confirm nothing broke.");
