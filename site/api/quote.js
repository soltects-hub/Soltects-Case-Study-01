/**
 * Vercel serverless function: POST /api/quote
 *
 * DEMO ENDPOINT — NOT REAL LEAD CAPTURE. See README.md "Demo forms vs.
 * production lead capture" and docs/04-technical-architecture.md,
 * "Demo backend limitations," before treating any submission here as a
 * real customer inquiry. Fieldstone Roofing & Exteriors is a fictional
 * business (docs/case-study.md §1) — there is no office, no project
 * consultant, and nothing downstream reads what this function logs.
 *
 * What this does: validates the payload server-side (defense in depth —
 * the client-side validation in js/main.js is a UX convenience, not the
 * security boundary), rejects obvious bot submissions via a hidden
 * honeypot field, and logs the accepted submission to this function's
 * Vercel runtime logs so the end-to-end flow is demonstrably real.
 *
 * What this deliberately does NOT do: send an email/SMS/CRM notification,
 * or persist to a database. Vercel serverless functions are stateless and
 * ephemeral — unlike the local dev server (site/api/server.js), which
 * appends to a local submissions.json file, there is no durable storage
 * here to write to without adding a real database, which this project
 * does not have and should not fabricate. A production deployment would
 * add that storage plus a transactional email/SMS provider (SendGrid,
 * Postmark, Twilio) at the point marked below.
 */

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validateQuote(data) {
  const errors = [];
  if (!isNonEmptyString(data.name)) errors.push("name is required");
  if (!isNonEmptyString(data.phone)) errors.push("phone is required");
  if (!isValidEmail(data.email)) errors.push("a valid email is required");
  if (!isNonEmptyString(data.address)) errors.push("address is required");
  if (!/^\d{5}$/.test(String(data.zip || ""))) errors.push("a 5-digit zip is required");
  if (!isNonEmptyString(data.service)) errors.push("service is required");
  if (!["yes", "no", "not_sure"].includes(data.insurance_claim)) errors.push("insurance_claim is required");
  if (data.consent !== "on" && data.consent !== true && data.consent !== "true") errors.push("consent is required");
  return errors;
}

module.exports = (req, res) => {
  res.setHeader("X-Fieldstone-Demo", "true");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "Method not allowed. This is a demo endpoint; see /about.html#concept." });
    return;
  }

  const data = req.body && typeof req.body === "object" ? req.body : {};

  // Honeypot: a real visitor never fills in this hidden field. Respond as
  // if successful so a simple bot learns nothing, but don't log it as a
  // submission.
  if (isNonEmptyString(data.company)) {
    res.status(200).json({ ok: true });
    return;
  }

  const errors = validateQuote(data);
  if (errors.length) {
    res.status(422).json({ ok: false, errors });
    return;
  }

  // Demo-only: logged to Vercel's function runtime logs, not persisted.
  // A production deployment's notification/storage call would go here.
  console.log("[fieldstone-demo] quote request (test data, not a real lead):", {
    receivedAt: new Date().toISOString(),
    zip: data.zip,
    service: data.service,
    insuranceClaim: data.insurance_claim,
  });

  res.status(200).json({ ok: true, demo: true });
};
