// Fieldstone Roofing & Exteriors — shared site behavior
// Soltects Case Study 01. No build step required; progressively enhances plain HTML.
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.getElementById("primary-nav");
    var scrim = document.querySelector("[data-nav-scrim]");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (scrim) scrim.setAttribute("data-open", open ? "true" : "false");
      document.documentElement.style.overflow = open ? "hidden" : "";
      if (open) {
        var firstLink = nav.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.getAttribute("data-open") === "true";
      setOpen(!isOpen);
    });

    if (scrim) scrim.addEventListener("click", function () { setOpen(false); });

    nav.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setOpen(false); toggle.focus(); }
    });

    // Close on navigation (mobile) and on resize to desktop width
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  /* ---------- FAQ accordion (works for one or many on a page) ---------- */
  function initAccordions() {
    var triggers = document.querySelectorAll(".accordion-trigger");
    triggers.forEach(function (trigger) {
      var panelId = trigger.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);
      if (!panel) return;
      var inner = panel.querySelector(".accordion-panel__inner");

      function setExpanded(expanded) {
        trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
        panel.style.maxHeight = expanded ? inner.offsetHeight + 24 + "px" : "0px";
      }

      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        setExpanded(!expanded);
      });

      // Open the first item in each accordion group by default
      if (trigger.hasAttribute("data-open-default")) setExpanded(true);
    });

    window.addEventListener("resize", function () {
      document.querySelectorAll('.accordion-trigger[aria-expanded="true"]').forEach(function (t) {
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        var inner = panel && panel.querySelector(".accordion-panel__inner");
        if (panel && inner) panel.style.maxHeight = inner.offsetHeight + 24 + "px";
      });
    });
  }

  /* ---------- Scroll reveal (decorative only, never hides content) ---------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Form validation + demo submission ---------- */
  function validateField(field) {
    var input = field.querySelector("input, select, textarea");
    if (!input) return true;
    var valid = input.checkValidity();
    field.setAttribute("data-invalid", valid ? "false" : "true");
    return valid;
  }

  function initForms() {
    var forms = document.querySelectorAll("form[data-demo-form]");
    forms.forEach(function (form) {
      var status = form.querySelector(".form-status");
      var fields = form.querySelectorAll(".field");

      fields.forEach(function (field) {
        var input = field.querySelector("input, select, textarea");
        if (!input) return;
        input.addEventListener("blur", function () { validateField(field); });
        input.addEventListener("input", function () {
          if (field.getAttribute("data-invalid") === "true") validateField(field);
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var allValid = true;
        fields.forEach(function (field) { if (!validateField(field)) allValid = false; });

        if (!allValid) {
          if (status) {
            status.setAttribute("data-state", "error");
            status.textContent = "Please check the highlighted fields and try again.";
          }
          var firstInvalid = form.querySelector('[data-invalid="true"] input, [data-invalid="true"] select, [data-invalid="true"] textarea');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        var submitBtn = form.querySelector('button[type="submit"]');
        var endpoint = form.getAttribute("data-demo-form");
        var formData = new FormData(form);
        var payload = {};
        formData.forEach(function (value, key) {
          payload[key] = payload[key] ? [].concat(payload[key], value) : value;
        });

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

        fetch(endpoint, {
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
            fields.forEach(function (field) { field.setAttribute("data-invalid", "false"); });
            if (status) {
              status.setAttribute("data-state", "success");
              status.textContent = "Thanks — this is a demo submission for the Soltects case study. In production this would reach Fieldstone's office within minutes.";
            }
          })
          .catch(function () {
            // No demo backend running (e.g. this HTML opened directly, or on a
            // static host with no /api route) — explain that honestly instead
            // of pretending the message was sent.
            if (status) {
              status.setAttribute("data-state", "error");
              status.textContent = "This form's demo backend isn't running right now, so nothing was sent. See docs/04-technical-architecture.md for how the demo backend works.";
            }
          })
          .finally(function () {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.getAttribute("data-label") || "Submit"; }
          });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initAccordions();
    initReveal();
    initForms();
  });
})();
