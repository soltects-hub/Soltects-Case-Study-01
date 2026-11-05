// Fieldstone — homepage multi-step estimate request.
// 3 steps: Contact -> Property & service -> Project details. Submits to
// the same demo backend as quote.html (site/api/quote.js / server.js) —
// same honeypot, same server-side validation, same "this is a demo, not a
// real lead" disclosures. See docs/11-cinematic-redesign-plan.md §2.5.
(function () {
  "use strict";

  function initOne(form) {
    var steps = Array.prototype.slice.call(form.querySelectorAll(".estimate-cinema__panel"));
    var labels = Array.prototype.slice.call(form.querySelectorAll(".estimate-cinema__step-label"));
    var status = form.querySelector(".form-status");
    var current = 0;

    function showStep(index) {
      steps.forEach(function (s, i) { s.setAttribute("data-active", i === index ? "true" : "false"); });
      labels.forEach(function (l, i) {
        l.setAttribute("data-current", i === index ? "true" : "false");
        l.setAttribute("data-done", i < index ? "true" : "false");
      });
      current = index;
      var firstField = steps[index].querySelector("input, select, textarea");
      if (firstField) firstField.focus({ preventScroll: true });
    }

    function validateStep(index) {
      var fields = steps[index].querySelectorAll(".field");
      var allValid = true;
      fields.forEach(function (field) {
        var input = field.querySelector("input, select, textarea");
        if (!input) return;
        var valid = input.checkValidity();
        field.setAttribute("data-invalid", valid ? "false" : "true");
        if (!valid) allValid = false;
      });
      return allValid;
    }

    form.querySelectorAll("[data-step-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!validateStep(current)) return;
        if (current < steps.length - 1) showStep(current + 1);
      });
    });
    form.querySelectorAll("[data-step-back]").forEach(function (btn) {
      btn.addEventListener("click", function () { if (current > 0) showStep(current - 1); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateStep(current)) return;

      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) { payload[key] = value; });

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      fetch(form.getAttribute("data-demo-form"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          return res.json();
        })
        .then(function () {
          form.reset();
          if (status) {
            status.setAttribute("data-state", "success");
            status.textContent = "Thanks — this is a demo submission for the Soltects case study. In production this would reach Fieldstone's office within minutes.";
          }
          showStep(0);
        })
        .catch(function () {
          if (status) {
            status.setAttribute("data-state", "error");
            status.textContent = "This form's demo backend isn't running right now, so nothing was sent.";
          }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Request My Estimate"; }
        });
    });

    showStep(0);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".estimate-cinema").forEach(initOne);
  });
})();
