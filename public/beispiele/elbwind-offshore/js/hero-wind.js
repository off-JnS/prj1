/* ==========================================================================
   Elbwind Offshore — Premium tier immersive hero
   Canvas 2D wind-field particle simulation: ~600 streak particles follow a
   layered-sine flow field (cheap curl-noise stand-in), drifting left→right
   with gusts. Performance-defensive:
     - devicePixelRatio capped at 2
     - pauses when tab hidden or hero scrolled out of view
     - prefers-reduced-motion renders a single static frame
     - no canvas support → CSS storm gradient fallback simply remains
   ========================================================================== */

(function () {
  "use strict";

  var canvas = document.getElementById("wind-canvas");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var particles = [];
  var PARTICLE_COUNT = 600;
  var running = false;
  var rafId = null;
  var t = 0;

  /* ---------- Flow field: layered sines approximate gusty wind ---------- */
  function flowAngle(x, y, time) {
    var nx = x / W, ny = y / H;
    return (
      Math.sin(ny * 6.3 + time * 0.00045) * 0.55 +
      Math.sin(nx * 4.1 - time * 0.0003 + ny * 3.7) * 0.35 +
      Math.sin((nx + ny) * 9.2 + time * 0.0002) * 0.18
    ) * 0.55; // mostly horizontal, ±~30°
  }

  function makeParticle(randomX) {
    return {
      x: randomX ? Math.random() * W : -10,
      y: Math.random() * H,
      speed: 0.6 + Math.random() * 1.8,
      life: 80 + Math.random() * 160,
      age: Math.random() * 120,
      // most streaks steel-blue/cyan, a few signal-yellow
      hue: Math.random() < 0.06 ? "245, 197, 24" : (Math.random() < 0.5 ? "127, 180, 217" : "111, 209, 189")
    };
  }

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    paintBackdrop(1);
  }

  /* Storm gradient painted onto the canvas itself (also the trail fader) */
  function paintBackdrop(alpha) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "rgba(7, 24, 32, " + alpha + ")");
    g.addColorStop(0.65, "rgba(9, 32, 42, " + alpha + ")");
    g.addColorStop(1, "rgba(6, 20, 28, " + alpha + ")");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function step() {
    t += 16;
    paintBackdrop(0.14); // low alpha → particles leave wind streaks

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var a = flowAngle(p.x, p.y, t);
      var gust = 1 + 0.4 * Math.sin(t * 0.0006 + p.y * 0.01);
      var vx = Math.cos(a) * p.speed * gust + 1.1; // constant west→east drift
      var vy = Math.sin(a) * p.speed * gust * 0.6;

      var nx = p.x + vx;
      var ny = p.y + vy;

      ctx.strokeStyle = "rgba(" + p.hue + ", " + (0.28 * Math.min(1, p.age / 40)) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      p.x = nx;
      p.y = ny;
      p.age++;

      if (p.x > W + 10 || p.y < -10 || p.y > H + 10 || p.age > p.life) {
        particles[i] = makeParticle(false);
      }
    }

    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running || prefersReducedMotion) return;
    running = true;
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* ---------- Static frame for prefers-reduced-motion ---------- */
  function staticFrame() {
    paintBackdrop(1);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var a = flowAngle(p.x, p.y, 0);
      ctx.strokeStyle = "rgba(" + p.hue + ", 0.22)";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + Math.cos(a) * 26 + 14, p.y + Math.sin(a) * 12);
      ctx.stroke();
    }
  }

  /* ---------- Init ---------- */
  resize();
  for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle(true));

  window.addEventListener("resize", function () {
    resize();
  });

  if (prefersReducedMotion) {
    staticFrame();
    return;
  }

  /* Pause when the tab is hidden */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); } else { start(); }
  });

  /* Pause when the hero scrolls out of view */
  var hero = document.querySelector("[data-hero]");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { start(); } else { stop(); }
      });
    }, { threshold: 0.05 }).observe(hero);
  } else {
    start();
  }
})();
