/**
 * Vercel serverless function: POST /api/contact
 *
 * DEMO ENDPOINT — NOT REAL LEAD CAPTURE. See api/quote.js for the full
 * rationale (same pattern, applied to the shorter contact form) and
 * README.md "Demo forms vs. production lead capture."
 */

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validateContact(data) {
  const errors = [];
  if (!isNonEmptyString(data.name)) errors.push("name is required");
  if (!isValidEmail(data.email)) errors.push("a valid email is required");
  if (!isNonEmptyString(data.message) || data.message.trim().length < 10) errors.push("message must be at least 10 characters");
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

  if (isNonEmptyString(data.company)) {
    res.status(200).json({ ok: true });
    return;
  }

  const errors = validateContact(data);
  if (errors.length) {
    res.status(422).json({ ok: false, errors });
    return;
  }

  console.log("[fieldstone-demo] contact message (test data, not a real lead):", {
    receivedAt: new Date().toISOString(),
    hasPhone: isNonEmptyString(data.phone),
  });

  res.status(200).json({ ok: true, demo: true });
};
