// Fieldstone — interactive before/after comparison slider.
// Pointer Events (unifies mouse + touch), full keyboard support via a
// native ARIA slider role, no GSAP dependency (simple enough not to need it).
(function () {
  "use strict";

  function initOne(root) {
    var afterWrap = root.querySelector(".before-after__after-wrap");
    var handle = root.querySelector(".before-after__handle");
    if (!afterWrap || !handle) return;

    var dragging = false;

    function setPercent(pct) {
      pct = Math.max(0, Math.min(100, pct));
      afterWrap.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      handle.style.left = pct + "%";
      handle.setAttribute("aria-valuenow", Math.round(pct));
    }

    function percentFromClientX(clientX) {
      var rect = root.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    handle.setAttribute("role", "slider");
    handle.setAttribute("tabindex", "0");
    handle.setAttribute("aria-valuemin", "0");
    handle.setAttribute("aria-valuemax", "100");
    handle.setAttribute("aria-valuenow", "50");
    handle.setAttribute("aria-label", "Drag to compare before and after");

    handle.addEventListener("pointerdown", function (e) {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      setPercent(percentFromClientX(e.clientX));
    });
    handle.addEventListener("pointerup", function () { dragging = false; });
    handle.addEventListener("pointercancel", function () { dragging = false; });

    // Clicking/tapping anywhere on the image also moves the handle there.
    root.addEventListener("pointerdown", function (e) {
      if (e.target === handle) return;
      setPercent(percentFromClientX(e.clientX));
    });

    handle.addEventListener("keydown", function (e) {
      var current = parseFloat(handle.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") { setPercent(current - 5); e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { setPercent(current + 5); e.preventDefault(); }
      if (e.key === "Home") { setPercent(0); e.preventDefault(); }
      if (e.key === "End") { setPercent(100); e.preventDefault(); }
    });

    setPercent(50);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".before-after").forEach(initOne);
  });
})();
