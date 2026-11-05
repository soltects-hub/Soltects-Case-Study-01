#!/usr/bin/env node
/**
 * Captures responsive screenshots of key pages at three breakpoints using
 * the Playwright Chromium already installed in this environment.
 *
 * Usage: node tests/screenshots.js http://localhost:4173
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const base = process.argv[2] || "http://localhost:4173";
const outDir = path.join(__dirname, "..", "screenshots");
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { path: "/", name: "home" },
  { path: "/about.html", name: "about" },
  { path: "/services/index.html", name: "services" },
  { path: "/services/roof-replacement.html", name: "roof-replacement" },
  { path: "/services/roof-repair.html", name: "roof-repair" },
  { path: "/services/storm-damage-insurance-claims.html", name: "storm-claims" },
  { path: "/services/gutter-replacement.html", name: "gutter-replacement" },
  { path: "/quote.html", name: "quote" },
  { path: "/contact.html", name: "contact" },
  { path: "/faq.html", name: "faq" },
  { path: "/privacy-policy.html", name: "privacy-policy" },
  { path: "/terms.html", name: "terms" },
  { path: "/404-not-found-check.html", name: "404" },
];

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1194 },
  { name: "desktop", width: 1440, height: 900 },
];

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const p of pages) {
      await page.goto(base + p.path, { waitUntil: "networkidle" });

      // Full-page screenshots of a page with a `position: sticky` header
      // can "ghost" that header into the stitched image at tile
      // boundaries — a Playwright/Chromium capture artifact, not something
      // a real visitor sees (the header behaves correctly during real
      // scrolling). Neutralize sticky/fixed positioning for this capture
      // only so the screenshot reflects the real layout cleanly.
      await page.addStyleTag({
        content:
          ".site-header{position:static !important;} .call-bar{display:none !important;} " +
          ".primary-nav{display:none !important;} .nav-scrim{display:none !important;}",
      });

      // Scroll through the page like a real visitor would, so the
      // IntersectionObserver-driven scroll-reveal content (see
      // css/base.css [data-reveal]) has actually triggered before the
      // full-page screenshot is captured — a straight fullPage capture
      // with no scroll can catch below-the-fold content still at opacity:0.
      const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < scrollHeight; y += 400) {
        await page.evaluate((pos) => window.scrollTo(0, pos), y);
        await page.waitForTimeout(60);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);

      const file = path.join(outDir, `${p.name}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log("Saved", file);
    }
  }

  await browser.close();
})();
