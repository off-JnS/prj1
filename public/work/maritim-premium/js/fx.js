/* ==========================================================================
   Premium motion layer — shared by all three Premium demos (identical file
   in maritim-, windenergie- and aviation-premium; colours come from each
   site's --fx-* tokens in css/main.css).

   Hand-written, no libraries. Every effect is progressive enhancement:
   without JS, or with prefers-reduced-motion, the page is complete and
   static. Pointer effects (magnetic buttons, tilt, cursor, spotlight) only
   run with a real mouse/trackpad, never on touch.

   Modules
     1  page transitions      cross-document View Transitions, fade fallback
     2  scroll progress       hairline at the top of the viewport
     3  split headlines       h1/h2 words rise out of a mask
     4  mask reveals          content images wipe open
     5  hero parallax         hero copy drifts and fades while scrolling out
     6  magnetic buttons      .btn leans toward the pointer
     7  tilt cards            3D tilt + glare on cards
     8  cursor + spotlight    trailing ring, glow following the pointer
     9  velocity marquee      tickers speed up and skew with scroll speed
    10  horizontal showcase   [data-fx-hs] pins and scrolls sideways
    11  scroll story          [data-fx-story] pinned visual, steps drive it
    12  SVG line drawing      [data-fx-draw] strokes draw themselves
    13  timeline progress     [data-fx-timeline] fills as you read
    14  text scramble         mono kickers decode on reveal
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var embedded = window.top !== window;

  root.classList.add("fx");
  if (reduce) root.classList.add("fx-reduce");

  function toArray(list) { return Array.prototype.slice.call(list); }
  function $$(sel, ctx) { return toArray((ctx || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* One observer factory: adds .fx-in once an element enters the view. */
  function onEnter(els, cb, options) {
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(cb); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { cb(entry.target); io.unobserve(entry.target); }
      });
    }, options || { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Shared scroll loop -------------------------------------
     All scroll-linked modules register a task; one rAF per frame runs
     them with the current scroll position. Velocity feeds the marquees. */
  var tasks = [];
  var layouts = [];
  var ticking = false;
  var lastY = window.scrollY;
  var lastT = performance.now();
  var velocity = 0; // px per second, smoothed, signed

  function tick(now) {
    ticking = false;
    var y = window.scrollY;
    var dt = Math.max(16, now - lastT);
    velocity = velocity * 0.7 + ((y - lastY) / dt) * 1000 * 0.3;
    lastY = y;
    lastT = now;
    var vh = window.innerHeight;
    for (var i = 0; i < tasks.length; i++) tasks[i](y, vh);
  }
  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  }
  window.addEventListener("scroll", requestTick, { passive: true });
  var resizeTimer = 0;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      layouts.forEach(function (fn) { fn(); });
      requestTick();
    }, 120);
  });
  window.addEventListener("load", function () {
    layouts.forEach(function (fn) { fn(); });
    requestTick();
  });

  /* ---------- 1 · Page transitions ------------------------------------
     Browsers with cross-document View Transitions animate natively via
     @view-transition in fx.css. Others get a short fade-out before the
     navigation — only at top level; inside the showcase viewer the hub
     handles navigation itself. */
  var nativeVT = "onpagereveal" in window;
  root.classList.toggle("fx-vt", nativeVT);
  if (nativeVT) {
    /* Only animate between pages of this site. Leaving the folder (e.g.
       the showcase viewer jumping to another demo) skips the transition,
       and an aborted one must not surface as an unhandled rejection. */
    var site = location.pathname.replace(/[^/]*$/, "");
    var quiet = function (vt) {
      if (!vt) return;
      vt.ready.catch(function () {});
      vt.finished.catch(function () {});
      vt.updateCallbackDone.catch(function () {});
    };
    window.addEventListener("pageswap", function (e) {
      var vt = e.viewTransition;
      if (!vt) return;
      quiet(vt);
      var to = e.activation && e.activation.entry && e.activation.entry.url;
      if (!to || new URL(to).pathname.indexOf(site) !== 0) vt.skipTransition();
    });
    window.addEventListener("pagereveal", function (e) { quiet(e.viewTransition); });
  }
  if (!nativeVT && !reduce && !embedded) {
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      if (a.origin !== location.origin || !/\.html$/.test(a.pathname) || a.pathname === location.pathname) return;
      e.preventDefault();
      root.classList.add("fx-leaving");
      setTimeout(function () { location.href = a.href; }, 360);
    });
    window.addEventListener("pageshow", function () { root.classList.remove("fx-leaving"); });
  }

  /* ---------- 2 · Scroll progress ------------------------------------- */
  var bar = document.createElement("div");
  bar.className = "fx-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  tasks.push(function (y, vh) {
    var max = root.scrollHeight - vh;
    bar.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0) + ")";
  });

  /* When the home-page loader is skipped (repeat visit in this session)
     or absent, hero headlines start almost immediately. */
  var loaderShown = !!document.querySelector(".page-loader") && !root.classList.contains("fx-skip-loader");

  /* ---------- 3 · Split headlines --------------------------------------
     Each word is wrapped in a clipping span; inline markup (em, span)
     is preserved so accent colours survive. */
  function splitWords(el) {
    var n = 0;
    (function walk(node) {
      toArray(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var outer = document.createElement("span");
            var inner = document.createElement("span");
            outer.className = "fx-w";
            inner.className = "fx-wi";
            inner.style.setProperty("--i", n++);
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR" && !child.classList.contains("visually-hidden")) {
          walk(child);
        }
      });
    })(el);
    el.classList.add("fx-split");
    /* The heading now animates itself; drop the block-level reveal. */
    el.classList.remove("reveal");
  }

  if (!reduce) {
    var heads = $$("main h1, main h2, [data-fx-split]").filter(function (el) {
      return !el.hasAttribute("data-fx-nosplit") && !el.closest("[data-fx-nosplit]");
    });
    heads.forEach(function (el) {
      splitWords(el);
      var delay = parseFloat(el.getAttribute("data-fx-delay") || "0");
      if (delay && !loaderShown) delay = 0.15;
      if (delay) el.style.setProperty("--fx-base", delay + "s");
    });
    onEnter(heads, function (el) { el.classList.add("fx-in"); }, { threshold: 0.1 });
  }

  /* ---------- 4 · Mask reveals ---------------------------------------
     Chrome's IntersectionObserver and native lazy loading both honour the
     image's own clip-path, so a fully masked image never "intersects" and
     never loads. Observe the (unclipped) parent instead: start loading
     well ahead, open the mask once it is actually on screen. */
  if (!reduce) {
    var masked = $$("main img").filter(function (img) {
      return !img.closest("[data-fx-nomask], .fx-hs, .fx-story, .hero");
    });
    masked.forEach(function (img) { img.classList.add("fx-mask"); });
    if ("IntersectionObserver" in window) {
      var watch = function (margin, threshold, cb) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);
            entry.target.__fxImgs.forEach(cb);
          });
        }, { rootMargin: margin, threshold: threshold });
        return io;
      };
      var preload = watch("0px 0px 900px 0px", 0, function (img) { img.loading = "eager"; });
      var reveal = watch("0px 0px -6% 0px", 0.12, function (img) { img.classList.add("fx-in"); });
      masked.forEach(function (img) {
        var box = img.parentElement;
        if (!box.__fxImgs) { box.__fxImgs = []; preload.observe(box); reveal.observe(box); }
        box.__fxImgs.push(img);
      });
    } else {
      masked.forEach(function (img) { img.classList.add("fx-in"); });
    }
  }

  /* ---------- 5 · Hero parallax ---------------------------------------
     [data-fx-hero] drifts down slower than the page and fades out;
     [data-fx-parallax="0.2"] moves by that factor against the scroll. */
  if (!reduce) {
    var heroEls = $$("[data-fx-hero]");
    var parallaxEls = $$("[data-fx-parallax]");
    if (heroEls.length) {
      tasks.push(function (y, vh) {
        if (y > vh * 1.3) return;
        var p = clamp(y / vh, 0, 1);
        heroEls.forEach(function (el) {
          /* Only when the hero copy fits on screen. On phones a tall hero
             (e.g. with the telemetry panel) would fade and drift out of
             its own section before the reader reaches its lower part. */
          if (el.offsetHeight > vh * 0.85) {
            el.style.transform = "";
            el.style.opacity = "";
            return;
          }
          el.style.transform = "translate3d(0," + (y * 0.32).toFixed(1) + "px,0)";
          el.style.opacity = String(clamp(1 - p * 1.35, 0, 1));
        });
      });
    }
    if (parallaxEls.length) {
      tasks.push(function (y, vh) {
        parallaxEls.forEach(function (el) {
          var r = el.parentElement.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          var f = parseFloat(el.getAttribute("data-fx-parallax")) || 0.15;
          var offset = (r.top + r.height / 2 - vh / 2) * -f;
          el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
        });
      });
    }
  }

  /* ---------- 6 · Magnetic buttons ------------------------------------ */
  if (finePointer && !reduce) {
    $$(".btn, [data-fx-magnetic]").forEach(function (el) {
      var rect = null;
      el.classList.add("fx-mag");
      el.addEventListener("pointerenter", function () { rect = el.getBoundingClientRect(); });
      el.addEventListener("pointermove", function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = "translate(" + (x * 0.24).toFixed(1) + "px," + (y * 0.34).toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () { rect = null; el.style.transform = ""; });
    });
  }

  /* ---------- 7 · Tilt cards ------------------------------------------ */
  if (finePointer && !reduce) {
    $$("[data-fx-tilt], .tile, .bento__item, .contact-card, .fx-hs__card, .service-block, .oprow").forEach(function (el) {
      var rect = null;
      var strength = el.classList.contains("oprow") || el.classList.contains("service-block") ? 0.35 : 1;
      var glare = document.createElement("span");
      glare.className = "fx-glare";
      glare.setAttribute("aria-hidden", "true");
      el.appendChild(glare);
      el.classList.add("fx-tilt");
      el.addEventListener("pointerenter", function () { rect = el.getBoundingClientRect(); el.classList.add("is-tilting"); });
      el.addEventListener("pointermove", function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        el.style.transform = "perspective(1000px) rotateX(" + ((0.5 - py) * 8 * strength).toFixed(2) +
          "deg) rotateY(" + ((px - 0.5) * 10 * strength).toFixed(2) + "deg) translateY(-4px)";
        el.style.setProperty("--fx-gx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--fx-gy", (py * 100).toFixed(1) + "%");
      });
      el.addEventListener("pointerleave", function () {
        rect = null;
        el.classList.remove("is-tilting");
        el.style.transform = "";
      });
    });
  }

  /* ---------- 8 · Cursor ring + spotlight ----------------------------- */
  if (finePointer && !reduce) {
    var ring = document.createElement("div");
    ring.className = "fx-cursor";
    ring.setAttribute("aria-hidden", "true");
    ring.innerHTML = '<span class="fx-cursor__label"></span>';
    document.body.appendChild(ring);
    var ringLabel = ring.firstChild;
    var tx = -100, ty = -100, cx = -100, cy = -100, cursorRaf = 0;

    var moveRing = function () {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      ring.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      cursorRaf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.2 ? requestAnimationFrame(moveRing) : 0;
    };
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      tx = e.clientX; ty = e.clientY;
      ring.classList.add("is-on");
      if (!cursorRaf) cursorRaf = requestAnimationFrame(moveRing);
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      var t = e.target.closest && e.target.closest("a, button, [data-fx-cursor], input, select, textarea, label, summary");
      var label = t && t.getAttribute("data-fx-cursor");
      ring.classList.toggle("is-link", !!t);
      ring.classList.toggle("has-label", !!label);
      ringLabel.textContent = label || "";
    });
    root.addEventListener("pointerleave", function () { ring.classList.remove("is-on"); });
    window.addEventListener("pointerdown", function () { ring.classList.add("is-down"); });
    window.addEventListener("pointerup", function () { ring.classList.remove("is-down"); });

    $$(".fx-spot").forEach(function (el) {
      var glow = document.createElement("span");
      glow.className = "fx-spot__glow";
      glow.setAttribute("aria-hidden", "true");
      el.insertBefore(glow, el.firstChild);
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--fx-sx", (e.clientX - r.left) + "px");
        el.style.setProperty("--fx-sy", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- 9 · Velocity marquee ------------------------------------
     Replaces the CSS loop: base speed plus scroll speed, direction follows
     the scroll direction, and the band skews slightly while it rushes. */
  if (!reduce) {
    $$("[data-fx-marquee]").forEach(function (track) {
      var x = 0, half = 0, dir = 1, visible = false, raf = 0, last = 0;
      var base = parseFloat(track.getAttribute("data-fx-marquee")) || 45;
      track.classList.add("fx-marquee");
      var measure = function () { half = track.scrollWidth / 2; };
      measure();
      layouts.push(measure);

      var frame = function (now) {
        var dt = last ? Math.min(64, now - last) / 1000 : 0.016;
        last = now;
        if (Math.abs(velocity) > 30) dir = velocity > 0 ? 1 : -1;
        var speed = base + Math.min(Math.abs(velocity) * 0.35, 900);
        x -= speed * dt * dir;
        if (half) {
          if (x <= -half) x += half;
          if (x > 0) x -= half;
        }
        velocity *= 0.92;
        var skew = clamp(velocity * 0.006, -9, 9);
        track.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0) skewX(" + (-skew).toFixed(2) + "deg)";
        raf = visible ? requestAnimationFrame(frame) : 0;
      };
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          if (visible && !raf) { last = 0; raf = requestAnimationFrame(frame); }
        }).observe(track.parentElement);
      }
    });
  }

  /* ---------- 10 · Horizontal showcase --------------------------------
     The section grows tall; its inner panel sticks to the viewport while
     vertical scrolling slides the card track sideways. Without JS, with
     reduced motion, or on screens too short for a pinned panel (landscape
     phones) the track is a plain swipeable row. Rotating the device
     switches between the two modes. */
  var shortScreen = window.matchMedia("(max-height: 520px)");
  $$("[data-fx-hs]").forEach(function (sec) {
    if (reduce) return;
    var track = sec.querySelector(".fx-hs__track");
    var sticky = sec.querySelector(".fx-hs__sticky");
    var fill = sec.querySelector(".fx-hs__fill");
    var count = sec.querySelector("[data-fx-hs-count]");
    var cards = $$(".fx-hs__card", track);
    var dist = 0;
    var pinned = false;

    var layout = function () {
      pinned = !shortScreen.matches;
      sec.classList.toggle("fx-hs--pinned", pinned);
      if (!pinned) {
        sec.style.height = "";
        track.style.transform = "";
        return;
      }
      dist = Math.max(0, track.scrollWidth - root.clientWidth);
      sec.style.height = (sticky.offsetHeight + dist) + "px";
    };
    layout();
    layouts.push(layout);
    if (shortScreen.addEventListener) shortScreen.addEventListener("change", function () { layout(); requestTick(); });

    tasks.push(function (y, vh) {
      if (!pinned) return;
      var r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = dist ? clamp(-r.top / dist, 0, 1) : 0;
      track.style.transform = "translate3d(" + (-p * dist).toFixed(1) + "px,0,0)";
      if (fill) fill.style.transform = "scaleX(" + p + ")";
      if (count) {
        var n = Math.min(cards.length, Math.round(p * (cards.length - 1)) + 1);
        count.textContent = (n < 10 ? "0" : "") + n + " / " + (cards.length < 10 ? "0" : "") + cards.length;
      }
      sec.style.setProperty("--fx-p", p.toFixed(4));
    });
  });

  /* ---------- 11 · Scroll story ---------------------------------------
     A sticky visual next to (desktop) or above (phone) a list of steps.
     The step crossing the activation line becomes active. Between steps
     the progress interpolates, so [data-fx-story-path] draws and
     [data-fx-story-marker] travels from one station to the next: step k
     stops where the path passes closest to [data-fx-stop] (or the first circle)
     inside [data-on="k"]
     (or evenly spaced when there is none). Visual parts with data-on="3"
     light up from step 3, [data-fx-story-readout="key"] shows the active
     step's data-key, and --fx-p on the section carries the progress. */
  $$("[data-fx-story]").forEach(function (sec) {
    var steps = $$(".fx-story__step", sec);
    var visual = sec.querySelector(".fx-story__visual");
    var path = sec.querySelector("[data-fx-story-path]");
    var marker = sec.querySelector("[data-fx-story-marker]");
    var parts = $$("[data-on]", sec);
    var readouts = $$("[data-fx-story-readout]", sec);
    var len = 0;
    var active = -1;
    var stops = steps.map(function (s, k) { return steps.length > 1 ? k / (steps.length - 1) : 0; });

    if (path && path.getTotalLength) {
      len = path.getTotalLength();
      path.style.strokeDasharray = len + " " + len;
      path.style.strokeDashoffset = String(len);
      steps.forEach(function (s, k) {
        var dot = sec.querySelector('[data-on="' + (k + 1) + '"] [data-fx-stop]') ||
          sec.querySelector('[data-on="' + (k + 1) + '"] circle');
        if (!dot) return;
        var cx = parseFloat(dot.getAttribute("cx")), cy = parseFloat(dot.getAttribute("cy"));
        var best = 0, bestD = Infinity;
        for (var i = 0; i <= 400; i++) {
          var pt = path.getPointAtLength(len * i / 400);
          var d = (pt.x - cx) * (pt.x - cx) + (pt.y - cy) * (pt.y - cy);
          if (d < bestD) { bestD = d; best = i / 400; }
        }
        stops[k] = best;
      });
    }

    var setActive = function (i) {
      if (i === active) return;
      active = i;
      sec.setAttribute("data-active", String(i + 1));
      steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); s.classList.toggle("is-past", k < i); });
      parts.forEach(function (el) { el.classList.toggle("is-on", i + 1 >= parseInt(el.getAttribute("data-on"), 10)); });
      readouts.forEach(function (el) {
        var v = steps[i].getAttribute("data-" + el.getAttribute("data-fx-story-readout"));
        if (v !== null) el.textContent = v;
      });
    };
    setActive(0);

    tasks.push(function (y, vh) {
      var r = sec.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      var vr = visual.getBoundingClientRect();
      /* Phone: the visual sits on top, so steps activate just below it. */
      var stacked = vr.width > r.width * 0.8;
      var line = stacked ? Math.min(vh * 0.8, vr.bottom + vh * 0.12) : vh * 0.55;
      var tops = steps.map(function (s) { return s.getBoundingClientRect().top; });
      var i = 0;
      tops.forEach(function (t, k) { if (t < line) i = k; });
      setActive(i);
      var frac = 0;
      if (i < steps.length - 1 && tops[i] < line) frac = clamp((line - tops[i]) / (tops[i + 1] - tops[i]), 0, 1);
      /* Ease between stations so the marker rests at each port a moment. */
      frac = frac < 0.35 ? 0 : clamp((frac - 0.35) / 0.65, 0, 1);
      frac = frac * frac * (3 - 2 * frac);
      var p = i < steps.length - 1 ? stops[i] + (stops[i + 1] - stops[i]) * frac : stops[i];
      sec.style.setProperty("--fx-p", p.toFixed(4));
      if (len) {
        path.style.strokeDashoffset = (len * (1 - p)).toFixed(1);
        if (marker) {
          var pt = path.getPointAtLength(len * p);
          marker.setAttribute("transform", "translate(" + pt.x.toFixed(1) + " " + pt.y.toFixed(1) + ")");
        }
      }
    });
  });

  /* ---------- 12 · SVG line drawing ----------------------------------- */
  var drawSets = $$("[data-fx-draw]");
  if (!reduce && drawSets.length) {
    drawSets.forEach(function (svg) {
      var els = $$("[data-fx-draw-el]", svg);
      if (!els.length) els = $$("path, line, polyline, circle, rect", svg).filter(function (el) {
        var s = getComputedStyle(el);
        return s.stroke !== "none" && (s.strokeDasharray === "none" || s.strokeDasharray === "");
      });
      els.forEach(function (el, k) {
        if (!el.getTotalLength) return;
        var l = el.getTotalLength();
        el.classList.add("fx-draw");
        el.style.setProperty("--fx-len", l.toFixed(1));
        el.style.setProperty("--i", k);
      });
    });
    onEnter(drawSets, function (svg) { svg.classList.add("fx-in"); }, { threshold: 0.25 });
  }

  /* ---------- 13 · Timeline progress ----------------------------------
     A fill line grows down the list as you read and passed items get
     .is-passed. data-fx-timeline="1.55rem" lays the fill over a list's
     own line at that x offset instead of drawing dots and indents. */
  $$("[data-fx-timeline]").forEach(function (list) {
    var line = document.createElement("span");
    var x = list.getAttribute("data-fx-timeline");
    line.className = "fx-tl";
    line.setAttribute("aria-hidden", "true");
    line.innerHTML = '<span class="fx-tl__fill"></span>';
    list.classList.add("fx-timeline");
    if (x) {
      list.classList.add("fx-timeline--inline");
      list.style.setProperty("--fx-tl-x", x);
    }
    list.insertBefore(line, list.firstChild);
    var fill = line.firstChild;
    var items = $$(":scope > li", list);
    tasks.push(function (y, vh) {
      var r = list.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      var mark = vh * 0.62;
      fill.style.transform = "scaleY(" + clamp((mark - r.top) / r.height, 0, 1).toFixed(4) + ")";
      items.forEach(function (li) { li.classList.toggle("is-passed", li.getBoundingClientRect().top < mark); });
    });
  });

  /* ---------- 14 · Text scramble -------------------------------------- */
  if (!reduce) {
    var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/°·—";
    var scrambles = $$("main .kicker, [data-fx-scramble]").filter(function (el) {
      return !el.children.length && el.textContent.trim().length < 48;
    });
    scrambles.forEach(function (el) { el.setAttribute("aria-label", el.textContent.trim()); });
    onEnter(scrambles, function (el) {
      var text = el.textContent;
      var start = performance.now();
      var dur = 520 + text.length * 14;
      (function frame(now) {
        var p = clamp((now - start) / dur, 0, 1);
        var done = Math.floor(p * text.length);
        var out = text.slice(0, done);
        for (var i = done; i < text.length; i++) {
          out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) requestAnimationFrame(frame); else el.textContent = text;
      })(start);
    }, { threshold: 0.6 });
  }

  requestTick();
})();
