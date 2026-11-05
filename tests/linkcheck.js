#!/usr/bin/env node
/**
 * Minimal internal link + asset checker for the Fieldstone site.
 * Crawls every internal href/src starting from a seed set of pages served
 * by the local demo server, and reports any that don't resolve with a 2xx.
 *
 * Usage: node tests/linkcheck.js http://localhost:4173
 */
const http = require("http");

const base = process.argv[2] || "http://localhost:4173";

const seeds = [
  "/", "/about.html", "/services/index.html",
  "/services/roof-replacement.html", "/services/roof-repair.html",
  "/services/storm-damage-insurance-claims.html", "/services/gutter-replacement.html",
  "/quote.html", "/contact.html", "/faq.html",
  "/privacy-policy.html", "/terms.html", "/404.html",
  "/robots.txt", "/sitemap.xml",
];

function get(pathOrUrl) {
  return new Promise((resolve) => {
    const u = pathOrUrl.startsWith("http") ? pathOrUrl : base + pathOrUrl;
    http
      .get(u, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body, url: u }));
      })
      .on("error", () => resolve({ status: 0, body: "", url: u }));
  });
}

function extractRefs(html) {
  const refs = new Set();
  const attrRegex = /(?:href|src)=["']([^"'#][^"']*)["']/g;
  let m;
  while ((m = attrRegex.exec(html))) {
    const v = m[1];
    if (v.startsWith("http") && !v.startsWith(base)) continue; // external, skip
    if (v.startsWith("mailto:") || v.startsWith("tel:") || v.startsWith("javascript:")) continue;
    refs.add(v.startsWith("http") ? v.replace(base, "") : v);
  }
  return Array.from(refs);
}

(async () => {
  const visited = new Map();
  const queue = [...seeds];
  const brokenTargets = new Set();

  while (queue.length) {
    const p = queue.shift();
    if (visited.has(p)) continue;
    const res = await get(p);
    visited.set(p, res.status);

    if (res.status >= 200 && res.status < 400 && p.endsWith(".html")) {
      extractRefs(res.body).forEach((ref) => {
        if (!visited.has(ref) && !queue.includes(ref)) queue.push(ref);
      });
    }
  }

  let brokenCount = 0;
  console.log(`Checked ${visited.size} internal URLs against ${base}\n`);
  for (const [p, status] of visited) {
    const ok = status >= 200 && status < 400;
    if (!ok) brokenCount++;
    console.log(`${ok ? "OK " : "FAIL"} ${status}  ${p}`);
  }
  console.log(`\n${brokenCount} broken link(s) out of ${visited.size}.`);
  process.exit(brokenCount ? 1 : 0);
})();
