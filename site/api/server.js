#!/usr/bin/env node
/**
 * Fieldstone Roofing & Exteriors — demo site server.
 *
 * This is the "clearly documented demo backend" required by the Soltects
 * case-study brief. It does two things:
 *
 *   1. Serves the static site in ../ (so the whole project runs with
 *      `node server.js` and no build step or external dependency).
 *   2. Accepts POST /api/quote and POST /api/contact, validates the
 *      payload server-side, and appends it to submissions.json in this
 *      folder so you can see exactly what a real submission looks like.
 *
 * It does NOT send email, text, or push to a real CRM — wiring that up for
 * a real deployment would need a transactional email provider (e.g.
 * SendGrid/Postmark) or a form backend (e.g. Formspree), which requires an
 * account and API key this project does not have. That's a dependency
 * worth naming explicitly rather than faking: see
 * docs/04-technical-architecture.md, "Demo backend & production path".
 *
 * No external npm packages — deliberately dependency-free so the demo
 * runs anywhere Node runs, with nothing to install.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.join(__dirname, "..");
const SUBMISSIONS_FILE = path.join(__dirname, "submissions.json");
const PORT = process.env.PORT || 4173;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
};

// Minimal in-memory rate limiting per IP (demo-grade; a production
// deployment would use a shared store like Redis behind a real load balancer).
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 10;
  const record = hits.get(ip) || { count: 0, start: now };
  if (now - record.start > windowMs) {
    record.count = 0;
    record.start = now;
  }
  record.count += 1;
  hits.set(ip, record);
  return record.count > max;
}

function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ "Content-Type": "text/plain; charset=utf-8" }, headers || {}));
  res.end(body);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8" });
}

function readBody(req, limitBytes) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function appendSubmission(record) {
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));
    if (!Array.isArray(existing)) existing = [];
  } catch (_) {
    existing = [];
  }
  existing.push(record);
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(existing, null, 2));
}

function validateQuote(data) {
  const errors = [];
  if (!isNonEmptyString(data.name)) errors.push("name is required");
  if (!isNonEmptyString(data.phone)) errors.push("phone is required");
  if (!isValidEmail(data.email)) errors.push("a valid email is required");
  if (!/^\d{5}$/.test(String(data.zip || ""))) errors.push("a 5-digit zip is required");
  if (!isNonEmptyString(data.service)) errors.push("service is required");
  if (data.consent !== "on" && data.consent !== true && data.consent !== "true") errors.push("consent is required");
  // address and insurance_claim are optional: the full quote.html form
  // collects both, but the homepage's shorter multi-step estimate form
  // (docs/11-cinematic-redesign-plan.md §2.5) deliberately asks only the
  // fields the redesign brief specifies — both forms share this one
  // validator, so neither field can be required here.
  if (data.insurance_claim !== undefined && !["yes", "no", "not_sure"].includes(data.insurance_claim)) {
    errors.push("insurance_claim must be yes, no, or not_sure when provided");
  }
  return errors;
}

function validateContact(data) {
  const errors = [];
  if (!isNonEmptyString(data.name)) errors.push("name is required");
  if (!isValidEmail(data.email)) errors.push("a valid email is required");
  if (!isNonEmptyString(data.message) || data.message.trim().length < 10) errors.push("message must be at least 10 characters");
  return errors;
}

async function handleFormSubmission(req, res, kind, validate) {
  const ip = req.socket.remoteAddress || "unknown";
  if (rateLimited(ip)) {
    return sendJson(res, 429, { ok: false, error: "Too many requests — please try again in a minute." });
  }

  let raw;
  try {
    raw = await readBody(req, 20 * 1024); // 20KB is generous for these forms
  } catch (e) {
    return sendJson(res, 413, { ok: false, error: "Payload too large." });
  }

  let data;
  try {
    data = JSON.parse(raw || "{}");
  } catch (e) {
    return sendJson(res, 400, { ok: false, error: "Invalid JSON." });
  }

  // Honeypot: real users never fill in "company" on these forms.
  if (isNonEmptyString(data.company)) {
    // Respond success-shaped so simple bots don't learn anything, but do not store it.
    return sendJson(res, 200, { ok: true });
  }

  const errors = validate(data);
  if (errors.length) {
    return sendJson(res, 422, { ok: false, errors: errors });
  }

  appendSubmission({
    kind: kind,
    receivedAt: new Date().toISOString(),
    data: data,
  });

  console.log(`[demo] ${kind} submission received:`, data.email || "(no email)");

  return sendJson(res, 200, { ok: true });
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(SITE_ROOT, urlPath);

  // Prevent path traversal outside the site root.
  if (!filePath.startsWith(SITE_ROOT)) {
    return send(res, 403, "Forbidden");
  }

  if (urlPath.endsWith("/")) filePath = path.join(filePath, "index.html");

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        const notFoundPath = path.join(SITE_ROOT, "404.html");
        fs.readFile(notFoundPath, (nfErr, nfContent) => {
          if (nfErr) return send(res, 404, "Not found");
          send(res, 404, nfContent, { "Content-Type": "text/html; charset=utf-8" });
        });
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      send(res, 200, content, { "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream" });
    });
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/quote") {
    return handleFormSubmission(req, res, "quote", validateQuote);
  }
  if (req.method === "POST" && req.url === "/api/contact") {
    return handleFormSubmission(req, res, "contact", validateContact);
  }
  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(req, res);
  }
  return send(res, 405, "Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Fieldstone demo site + API running at http://localhost:${PORT}`);
  console.log(`Submissions are appended to ${SUBMISSIONS_FILE}`);
});
