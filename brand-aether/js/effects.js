/**
 * Æther — Visual Effects Engine
 * Pure vanilla JS, zero dependencies.
 * 
 * Effects:
 * 1. Spotlight cursor (mouse-following glow on hero)
 * 2. Number ticker (animated stat counters on scroll)
 * 3. Moving border angle animation
 */

(function () {
  "use strict";

  // ━━━ SPOTLIGHT CURSOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Mouse-following radial glow on hero sections
  function initSpotlight() {
    const spotlights = document.querySelectorAll(".spotlight");
    if (!spotlights.length) return;

    spotlights.forEach((el) => {
      const glow = el.querySelector(".spotlight__glow");
      if (!glow) return;

      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.left = x + "px";
        glow.style.top = y + "px";
      });

      el.addEventListener("mouseenter", () => {
        glow.style.opacity = "0.5";
      });

      el.addEventListener("mouseleave", () => {
        glow.style.opacity = "0";
      });
    });
  }

  // ━━━ NUMBER TICKER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Animate numbers counting up when scrolled into view
  function initNumberTicker() {
    const tickers = document.querySelectorAll("[data-ticker]");
    if (!tickers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px" }
    );

    tickers.forEach((el) => observer.observe(el));
  }

  function animateNumber(el) {
    const target = parseInt(el.getAttribute("data-ticker"), 10);
    const suffix = el.getAttribute("data-ticker-suffix") || "";
    const prefix = el.getAttribute("data-ticker-prefix") || "";
    const duration = parseInt(el.getAttribute("data-ticker-duration"), 10) || 2000;
    const start = performance.now();

    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // ━━━ MOVING BORDER ANGLE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Animate --moving-border-angle CSS custom property
  function initMovingBorders() {
    const borders = document.querySelectorAll(".moving-border");
    if (!borders.length) return;

    borders.forEach((el) => {
      let angle = 0;
      const speed = 0.5; // degrees per frame

      function rotate() {
        angle = (angle + speed) % 360;
        el.style.setProperty("--moving-border-angle", angle + "deg");
        requestAnimationFrame(rotate);
      }

      // Respect reduced motion
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        requestAnimationFrame(rotate);
      }
    });
  }

  // ━━━ INIT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initSpotlight();
      initNumberTicker();
      initMovingBorders();
    });
  } else {
    initSpotlight();
    initNumberTicker();
    initMovingBorders();
  }
})();