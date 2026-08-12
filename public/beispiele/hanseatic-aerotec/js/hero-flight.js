/* ==========================================================================
   Hanseatic Aerotec — Premium tier immersive hero
   Canvas 2D blueprint flight map: fine engineering grid, great-circle-style
   route arcs from Finkenwerder (XFW) to partner sites, plane markers
   travelling along the arcs, dash-animated route lines, compass rose.
   Performance-defensive:
     - devicePixelRatio capped at 2
     - pauses when tab hidden or hero scrolled out of view
     - prefers-reduced-motion renders a single static frame
     - no canvas support → CSS blueprint-grid fallback simply remains
   ========================================================================== */

(function () {
  "use strict";

  var canvas = document.getElementById("flight-canvas");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var running = false;
  var rafId = null;
  var t = 0;

  var BLUE = "27, 79, 138";     // blueprint blue
  var ORANGE = "232, 97, 28";   // safety orange
  var INK = "14, 42, 71";       // aviation navy

  /* Routes: hub + destinations in relative coordinates (0..1), label at dest */
  var HUB = { x: 0.62, y: 0.42, label: "XFW" };
  var routes = [
    { x: 0.30, y: 0.78, label: "TLS", speed: 0.00010, offset: 0.00 },
    { x: 0.10, y: 0.30, label: "YMX", speed: 0.00007, offset: 0.35 },
    { x: 0.90, y: 0.72, label: "TSN", speed: 0.00008, offset: 0.60 },
    { x: 0.88, y: 0.16, label: "HEL", speed: 0.00012, offset: 0.20 },
    { x: 0.38, y: 0.10, label: "BFS", speed: 0.00009, offset: 0.80 }
  ];

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  /* Quadratic-curve control point: perpendicular offset → arc looks great-circle-ish */
  function controlPoint(x1, y1, x2, y2) {
    var mx = (x1 + x2) / 2;
    var my = (y1 + y2) / 2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: mx - dy / len * len * 0.22, y: my + dx / len * len * 0.22 };
  }

  function pointOnQuad(p0, cp, p1, u) {
    var v = 1 - u;
    return {
      x: v * v * p0.x + 2 * v * u * cp.x + u * u * p1.x,
      y: v * v * p0.y + 2 * v * u * cp.y + u * u * p1.y
    };
  }

  function drawGrid() {
    // fine grid
    ctx.strokeStyle = "rgba(" + BLUE + ", 0.07)";
    ctx.lineWidth = 1;
    var step = 40;
    for (var x = 0; x <= W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y <= H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    // heavier grid every 5 cells
    ctx.strokeStyle = "rgba(" + BLUE + ", 0.12)";
    for (x = 0; x <= W; x += step * 5) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (y = 0; y <= H; y += step * 5) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function drawCompass() {
    var cx = W * 0.88, cy = H * 0.82, r = Math.min(W, H) * 0.07;
    ctx.strokeStyle = "rgba(" + BLUE + ", 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2); ctx.stroke();
    var a = t * 0.0002;
    ctx.strokeStyle = "rgba(" + ORANGE + ", 0.7)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9);
    ctx.stroke();
  }

  function drawPlane(p, angle) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    ctx.fillStyle = "rgba(" + ORANGE + ", 0.95)";
    ctx.beginPath();
    ctx.moveTo(7, 0);
    ctx.lineTo(-5, 4.5);
    ctx.lineTo(-2.5, 0);
    ctx.lineTo(-5, -4.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawCompass();

    var hub = { x: HUB.x * W, y: HUB.y * H };

    ctx.font = "11px 'Space Mono', monospace";

    routes.forEach(function (r) {
      var dest = { x: r.x * W, y: r.y * H };
      var cp = controlPoint(hub.x, hub.y, dest.x, dest.y);

      // dash-animated route line
      ctx.strokeStyle = "rgba(" + BLUE + ", 0.5)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 7]);
      ctx.lineDashOffset = -t * 0.02;
      ctx.beginPath();
      ctx.moveTo(hub.x, hub.y);
      ctx.quadraticCurveTo(cp.x, cp.y, dest.x, dest.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // destination node + label
      ctx.fillStyle = "rgba(" + BLUE + ", 0.85)";
      ctx.beginPath(); ctx.arc(dest.x, dest.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillText(r.label, dest.x + 9, dest.y + 4);

      // plane travelling along the arc (ping-pong)
      var u = (t * r.speed + r.offset) % 2;
      if (u > 1) u = 2 - u;
      var p = pointOnQuad(hub, cp, dest, u);
      var ahead = pointOnQuad(hub, cp, dest, Math.min(1, u + 0.02));
      var angle = Math.atan2(ahead.y - p.y, ahead.x - p.x);
      if (u >= 1) angle += Math.PI; // flying home
      drawPlane(p, angle);
    });

    // hub: pulsing ring + label
    var pulse = 8 + Math.sin(t * 0.003) * 3;
    ctx.strokeStyle = "rgba(" + ORANGE + ", 0.55)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(hub.x, hub.y, pulse + 6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(" + ORANGE + ", 0.95)";
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(" + INK + ", 0.9)";
    ctx.font = "bold 12px 'Space Mono', monospace";
    ctx.fillText(HUB.label + " · FINKENWERDER", hub.x + 12, hub.y - 8);
  }

  function step() {
    t += 16;
    drawFrame();
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

  /* ---------- Init ---------- */
  resize();
  window.addEventListener("resize", function () {
    resize();
    if (!running) drawFrame();
  });

  if (prefersReducedMotion) {
    drawFrame(); // single static frame
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
