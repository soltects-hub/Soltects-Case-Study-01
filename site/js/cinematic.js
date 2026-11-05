// Fieldstone Roofing & Exteriors — cinematic redesign interaction controller
// Soltects Case Study 01. See docs/11-cinematic-redesign-plan.md §2.4.
//
// Depends on GSAP + ScrollTrigger (site/js/vendor/gsap/), loaded before this
// file. Everything here is gated behind a single prefers-reduced-motion
// check and behind html.js-cinema (set synchronously at the top of <body>,
// same no-JS-safe pattern as the legacy site/js/main.js) so a visitor with
// JS disabled, or before this script runs, always sees full, readable
// content immediately — never a page stuck mid-animation or hidden.
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

  /* ---------------- Header: transparent-over-hero -> solid on scroll ---------------- */
  function initHeader() {
    var header = document.querySelector(".header-cinema");
    if (!header) return;
    var threshold = 64;
    function update() {
      header.setAttribute("data-solid", window.scrollY > threshold ? "true" : "false");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------------- Full-screen nav overlay ---------------- */
  function initNavOverlay() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var overlay = document.querySelector(".nav-overlay");
    var closeBtn = document.querySelector("[data-menu-close]");
    if (!toggle || !overlay) return;

    var lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      overlay.setAttribute("data-open", "true");
      toggle.setAttribute("data-menu-open", "true");
      toggle.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
      var firstLink = overlay.querySelector(".nav-overlay__list a");
      if (firstLink) firstLink.focus();
      if (hasGsap && !reduced) {
        window.gsap.fromTo(
          overlay.querySelectorAll(".nav-overlay__list a"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out", delay: 0.05 }
        );
      }
    }
    function close() {
      overlay.setAttribute("data-open", "false");
      toggle.setAttribute("data-menu-open", "false");
      toggle.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    toggle.addEventListener("click", function () {
      var isOpen = overlay.getAttribute("data-open") === "true";
      isOpen ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.getAttribute("data-open") === "true") close();
    });
    overlay.querySelectorAll(".nav-overlay__list a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  /* ---------------- Scroll reveals ---------------- */
  function initReveals() {
    var items = document.querySelectorAll("[data-reveal-cinema]");
    if (!items.length) return;

    if (!hasGsap || reduced) {
      // No GSAP, or user prefers reduced motion: CSS already shows content
      // by default unless html.js-cinema is set — and since we got this
      // far, JS did run, so make sure html.js-cinema is NOT relied upon to
      // hide anything further. (Class is added in initAll only when we
      // intend to animate; see bottom of file.)
      return;
    }

    items.forEach(function (el) {
      var mode = el.getAttribute("data-reveal-cinema");
      var vars = { opacity: 1, duration: 0.9, ease: "power3.out" };
      var from = { opacity: 0 };
      if (mode === "rise") {
        from.y = 48;
        vars.y = 0;
      } else if (mode === "mask") {
        from.clipPath = "inset(0 0 100% 0)";
        vars.clipPath = "inset(0 0 0% 0)";
        vars.duration = 1.1;
        vars.ease = "power4.inOut";
      }
      window.gsap.fromTo(el, from, Object.assign(vars, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      }));
    });
  }

  /* ---------------- Parallax ---------------- */
  function initParallax() {
    if (!hasGsap || reduced) return;
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.9;
      window.gsap.to(el, {
        yPercent: (1 - speed) * 100,
        ease: "none",
        scrollTrigger: { trigger: el.closest("[data-parallax-root]") || el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }

  /* ---------------- Animated counters (facts only — see plan §2.4) ---------------- */
  function initCounters() {
    document.querySelectorAll("[data-counter]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-counter"));
      var suffix = el.getAttribute("data-counter-suffix") || "";
      if (!hasGsap || reduced) {
        el.textContent = target + suffix;
        return;
      }
      var obj = { val: 0 };
      window.gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        onUpdate: function () {
          el.textContent = Math.round(obj.val) + suffix;
        },
      });
    });
  }

  /* ---------------- Pinned process sequence ---------------- */
  function initProcessPin() {
    var stage = document.querySelector(".process-pin__stage");
    var track = document.querySelector(".process-pin__track");
    var bar = document.querySelector(".process-pin__progress-bar");
    if (!stage || !track || !hasGsap || reduced) return;

    function build() {
      var trackWidth = track.scrollWidth;
      var viewport = stage.clientWidth;
      var distance = Math.max(trackWidth - viewport + 80, 0);
      if (distance < 40) return null;
      return window.gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=" + (distance + viewport * 0.4),
          scrub: true,
          pin: true,
          onUpdate: function (self) {
            if (bar) bar.style.width = (self.progress * 100).toFixed(1) + "%";
          },
        },
      });
    }
    var tween = build();
    window.addEventListener("resize", function () {
      if (tween && tween.scrollTrigger) tween.scrollTrigger.kill();
      tween = build();
    });
  }

  /* ---------------- Floating CTA ---------------- */
  function initFloatingCta() {
    var cta = document.querySelector(".floating-cta");
    var hero = document.querySelector(".hero-cinema");
    if (!cta) return;
    var threshold = hero ? hero.offsetHeight * 0.8 : 400;
    function update() {
      cta.setAttribute("data-visible", window.scrollY > threshold ? "true" : "false");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------------- Cookie consent ---------------- */
  function initCookieConsent() {
    var banner = document.querySelector(".cookie-consent");
    if (!banner) return;
    var KEY = "fieldstone-demo-cookie-choice";
    var existing;
    try { existing = window.localStorage.getItem(KEY); } catch (e) { existing = null; }
    if (existing) return;

    // Shown on first scroll, not a flat timer: a fixed-position banner
    // appearing immediately on load can sit directly over the hero's own
    // CTA buttons at the bottom of a short viewport (confirmed via
    // bounding-box overlap testing). Once the user has scrolled at all,
    // that content has moved out of the viewport-bottom danger zone, so
    // showing it there is always geometrically safe. A timeout fallback
    // still covers a visitor who never scrolls (e.g. the whole hero fits
    // without scrolling) — by then they've had time to act on the hero
    // CTA first if that's what they came to do.
    var shown = false;
    function reveal() {
      if (shown) return;
      shown = true;
      banner.setAttribute("data-visible", "true");
      window.removeEventListener("scroll", onScroll);
    }
    function onScroll() {
      if (window.scrollY > 40) reveal();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.setTimeout(reveal, 6000);

    function choose(value) {
      banner.setAttribute("data-visible", "false");
      try { window.localStorage.setItem(KEY, value); } catch (e) { /* ignore: private browsing etc. */ }
    }
    var acceptBtn = banner.querySelector("[data-cookie-accept]");
    var declineBtn = banner.querySelector("[data-cookie-decline]");
    if (acceptBtn) acceptBtn.addEventListener("click", function () { choose("accepted"); });
    if (declineBtn) declineBtn.addEventListener("click", function () { choose("declined"); });
  }

  /* ---------------- Solutions explorer tabs ---------------- */
  function initExplorer() {
    var explorer = document.querySelector(".explorer-cinema");
    if (!explorer) return;
    var tabs = explorer.querySelectorAll(".explorer-cinema__tab");
    var panels = explorer.querySelectorAll(".explorer-cinema__panel");
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
        panels.forEach(function (p) { p.setAttribute("data-active", "false"); });
        tab.setAttribute("aria-selected", "true");
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) panel.setAttribute("data-active", "true");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Note: html.js-cinema itself is set by an inline <script> at the very
    // top of <body> (same synchronous, before-paint pattern as the legacy
    // html.js class in site/js/main.js) — not here. Setting it from this
    // deferred script would run after initial paint and cause a visible
    // flash (content shown, then suddenly hidden, then animated back in).
    // The prefers-reduced-motion CSS override uses !important specifically
    // so it's safe for the inline script to set html.js-cinema
    // unconditionally; this file just has to honor `reduced` itself, which
    // every init function below already does.
    initHeader();
    initNavOverlay();
    initReveals();
    initParallax();
    initCounters();
    initProcessPin();
    initFloatingCta();
    initCookieConsent();
    initExplorer();
  });
})();
