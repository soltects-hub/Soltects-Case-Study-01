// Fieldstone — horizontal draggable project gallery.
// Desktop/mouse: a small pointer-events drag-to-scroll handler (deliberately
// not GSAP Draggable's type:"scrollLeft" — in testing it wrapped the
// track's children in an extra DOM node to manage scroll measurement,
// which broke the flex layout the gallery items depend on; a plain
// pointermove -> scrollLeft handler avoids that risk entirely and is
// simple enough not to need a library).
// Touch: native overflow-x + scroll-snap (left alone — simulating "drag"
// over native touch scrolling is worse for touch accessibility, not better).
// Keyboard: prev/next buttons, plus the track itself is natively
// scrollable, so arrow-key/Tab navigation to the images still works.
(function () {
  "use strict";

  function isCoarsePointer() {
    return window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  }

  function initOne(gallery) {
    var track = gallery.querySelector(".gallery-cinema__track");
    if (!track) return;

    // The prev/next buttons live in this gallery's section header (a
    // sibling of .gallery-cinema in the markup, for layout reasons — next
    // to the heading, not next to the track), not inside .gallery-cinema
    // itself, so the search has to be scoped to the enclosing section.
    var scope = gallery.closest(".section-cinema") || document;
    var prevBtn = scope.querySelector("[data-gallery-prev]");
    var nextBtn = scope.querySelector("[data-gallery-next]");

    function step(dir) {
      var item = track.querySelector(".gallery-cinema__item");
      var itemWidth = item ? item.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: dir * itemWidth, behavior: "smooth" });
    }
    if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });

    if (isCoarsePointer()) return; // native touch scrolling only, by design

    var dragging = false;
    var startX = 0;
    var startScroll = 0;
    var moved = false;

    track.addEventListener("pointerdown", function (e) {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add("is-dragging-gsap");
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    function endDrag() {
      dragging = false;
      track.classList.remove("is-dragging-gsap");
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    // Prevent the drag gesture from also registering as a click on an
    // image (which would otherwise fire with no visible effect, but is
    // worth suppressing for correctness).
    track.addEventListener(
      "click",
      function (e) {
        if (moved) { e.preventDefault(); e.stopPropagation(); }
      },
      true
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".gallery-cinema").forEach(initOne);
  });
})();
