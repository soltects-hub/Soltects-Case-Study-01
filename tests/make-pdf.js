#!/usr/bin/env node
// Renders docs/case-study.pdf.html to docs/case-study.pdf using the
// Playwright Chromium already installed in this environment.
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const docsDir = path.join(__dirname, "..", "docs");
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("file://" + path.join(docsDir, "case-study.pdf.html"), { waitUntil: "networkidle" });
  await page.pdf({
    path: path.join(docsDir, "case-study.pdf"),
    format: "Letter",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  });
  await browser.close();
  console.log("Wrote", path.join(docsDir, "case-study.pdf"));
})();
