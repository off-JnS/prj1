/* ==========================================================================
   Elbstein Immobilien — Professional tier demo
   Scroll reveals, header state, animated counters, listing filter,
   mobile nav, contact form validation (simulated submit).
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    var navHeader = document.querySelector(".site-header");
    // Office card at the foot of the mobile Exposé menu (hidden on desktop via CSS)
    nav.insertAdjacentHTML(
      "beforeend",
      '<div class="main-nav__meta">' +
        "Am Sandtorkai 42 · HafenCity<br>" +
        '<a href="tel:+494055567890">040 555 678 90</a> · Mo–Fr 9–18 Uhr' +
      "</div>"
    );

    var closeNav = function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
      document.body.style.overflow = "";
      if (navHeader) navHeader.classList.remove("nav-open");
    };

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      document.body.style.overflow = open ? "hidden" : "";
      if (navHeader) navHeader.classList.toggle("nav-open", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) closeNav();
    });
  }

  /* ---------- Scroll reveals (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      var isDecimal = el.getAttribute("data-decimal") === "true"; // 49 -> "4,9"
      var format = function (value) {
        return isDecimal
          ? (value / 10).toFixed(1).replace(".", ",")
          : String(value);
      };

      if (prefersReducedMotion) {
        el.textContent = format(target) + suffix;
        return;
      }

      var duration = 1400;
      var start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = format(Math.round(target * eased)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Listing filter (immobilien.html) ---------- */
  var filterButtons = document.querySelectorAll(".filter__btn");
  var listingCards = document.querySelectorAll("#listings-grid .prop-card");
  var emptyNote = document.getElementById("listings-empty");

  if (filterButtons.length && listingCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        filterButtons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });

        var visible = 0;
        listingCards.forEach(function (card) {
          var show = filter === "alle" || card.getAttribute("data-type") === filter;
          card.classList.toggle("is-hidden", !show);
          if (show) visible++;
        });
        if (emptyNote) emptyNote.hidden = visible > 0;
      });
    });
  }

  /* ---------- Contact form validation (kontakt.html) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var rules = [
      {
        input: document.getElementById("name"),
        error: document.getElementById("name-error"),
        validate: function (el) {
          return el.value.trim().length >= 2 ? "" : "Bitte geben Sie Ihren Namen an.";
        }
      },
      {
        input: document.getElementById("email"),
        error: document.getElementById("email-error"),
        validate: function (el) {
          if (!el.value.trim()) return "Bitte geben Sie Ihre E-Mail-Adresse an.";
          return EMAIL_RE.test(el.value.trim()) ? "" : "Das sieht nicht nach einer gültigen E-Mail-Adresse aus.";
        }
      },
      {
        input: document.getElementById("topic"),
        error: document.getElementById("topic-error"),
        validate: function (el) {
          return el.value ? "" : "Bitte wählen Sie Ihr Anliegen aus.";
        }
      },
      {
        input: document.getElementById("message"),
        error: document.getElementById("message-error"),
        validate: function (el) {
          return el.value.trim().length >= 10 ? "" : "Ihre Nachricht sollte mindestens 10 Zeichen lang sein.";
        }
      },
      {
        input: document.getElementById("privacy"),
        error: document.getElementById("privacy-error"),
        validate: function (el) {
          return el.checked ? "" : "Bitte stimmen Sie der Datenschutzerklärung zu.";
        }
      }
    ].filter(function (r) { return r.input; });

    var showError = function (rule, msg) {
      if (rule.error) rule.error.textContent = msg;
      rule.input.closest(".form__field").classList.toggle("has-error", Boolean(msg));
      rule.input.setAttribute("aria-invalid", msg ? "true" : "false");
    };

    rules.forEach(function (rule) {
      rule.input.addEventListener("blur", function () {
        showError(rule, rule.validate(rule.input));
      });
      rule.input.addEventListener("input", function () {
        if (rule.input.closest(".form__field").classList.contains("has-error") &&
            !rule.validate(rule.input)) {
          showError(rule, "");
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // demo: no server — remove once a real action is set

      var firstInvalid = null;
      rules.forEach(function (rule) {
        var msg = rule.validate(rule.input);
        showError(rule, msg);
        if (msg && !firstInvalid) firstInvalid = rule.input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      form.querySelectorAll(".form__row, .form__field, .form__submit").forEach(function (el) {
        el.style.display = "none";
      });
      var success = document.getElementById("form-success");
      if (success) success.hidden = false;
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
