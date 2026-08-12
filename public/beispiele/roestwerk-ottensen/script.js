/* ==========================================================================
   Röstwerk Ottensen — Basic tier demo
   Mobile nav toggle + client-side form validation (simulated submit).
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    var navHeader = document.querySelector(".site-header");
    // Card footer for the full-screen "Tageskarte" menu (hidden on desktop via CSS)
    nav.insertAdjacentHTML(
      "beforeend",
      '<div class="main-nav__meta">' +
        "<strong>Mo–Fr 8–18 · Sa 9–18 · So 10–17</strong><br>" +
        "Bahrenfelder Straße 87 · Ottensen<br>" +
        '<a href="tel:+494055512340">040 555 123 40</a>' +
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

    // Close the menu after a link is tapped (one-pager anchors)
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) closeNav();
    });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("name-error"),
      validate: function (v) {
        if (v.trim().length < 2) return "Bitte geben Sie Ihren Namen an.";
        return "";
      }
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validate: function (v) {
        if (!v.trim()) return "Bitte geben Sie Ihre E-Mail-Adresse an.";
        if (!EMAIL_RE.test(v.trim())) return "Das sieht nicht nach einer gültigen E-Mail-Adresse aus.";
        return "";
      }
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("message-error"),
      validate: function (v) {
        if (v.trim().length < 10) return "Ihre Nachricht sollte mindestens 10 Zeichen lang sein.";
        return "";
      }
    }
  };

  function showError(field, msg) {
    field.error.textContent = msg;
    field.input.closest(".form__field").classList.toggle("has-error", Boolean(msg));
    field.input.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  // Validate on blur — not on every keystroke
  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    field.input.addEventListener("blur", function () {
      showError(field, field.validate(field.input.value));
    });
    field.input.addEventListener("input", function () {
      // Clear the error as soon as the user fixes the value
      if (field.input.closest(".form__field").classList.contains("has-error") &&
          !field.validate(field.input.value)) {
        showError(field, "");
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // demo: no server — remove once a real action is set

    var firstInvalid = null;
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      var msg = field.validate(field.input.value);
      showError(field, msg);
      if (msg && !firstInvalid) firstInvalid = field.input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Simulated success: hide inputs, show the confirmation card
    form.querySelectorAll(".form__field, .form__submit").forEach(function (el) {
      el.style.display = "none";
    });
    var success = document.getElementById("form-success");
    success.hidden = false;
    form.reset();
  });

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
