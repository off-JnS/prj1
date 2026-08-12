/* ==========================================================================
   Nordmeridian Logistik — Premium WebGL hero
   Three.js particle globe with animated shipping routes out of Hamburg.

   Performance notes:
   - Loaded as an ES module only on the home page (non-blocking).
   - Pixel ratio capped at 2; ~1,500 points + 8 line arcs + pulses.
   - Rendering pauses when the tab is hidden or the hero leaves the viewport.
   - prefers-reduced-motion renders a single static frame.
   - If WebGL is unavailable, the CSS gradient fallback stays visible.
   ========================================================================== */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const container = document.getElementById("globe-canvas");
if (container) init(container);

function init(container) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Renderer (bail out gracefully without WebGL) ---------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (err) {
    return; // CSS fallback gradient remains
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x05090f, 6, 13);

  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(1.4, 0.4, 6.4);

  /* ---------- Globe group (everything that rotates) ---------- */
  const globe = new THREE.Group();
  globe.position.x = 1.35;    // pushed right so the headline owns the left half
  globe.rotation.z = 0.16;    // slight axial tilt
  scene.add(globe);

  const RADIUS = 2.15;

  /* Dotted sphere surface via Fibonacci distribution */
  const DOT_COUNT = 1500;
  const dotPositions = new Float32Array(DOT_COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < DOT_COUNT; i++) {
    const y = 1 - (i / (DOT_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    dotPositions[i * 3] = Math.cos(theta) * r * RADIUS;
    dotPositions[i * 3 + 1] = y * RADIUS;
    dotPositions[i * 3 + 2] = Math.sin(theta) * r * RADIUS;
  }
  const dotsGeo = new THREE.BufferGeometry();
  dotsGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
  const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({
    color: 0x3d5a70, size: 0.022, sizeAttenuation: true, transparent: true, opacity: 0.85
  }));
  globe.add(dots);

  /* Subtle wireframe shell for depth */
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 0.995, 36, 24),
    new THREE.MeshBasicMaterial({ color: 0x14283a, wireframe: true, transparent: true, opacity: 0.16 })
  );
  globe.add(shell);

  /* ---------- Ports & routes ---------- */
  const latLonToVec3 = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  const HAMBURG = { lat: 53.55, lon: 9.99 };
  const PORTS = [
    { lat: 51.92, lon: 4.48 },     // Rotterdam
    { lat: 40.70, lon: -74.01 },   // New York
    { lat: -23.96, lon: -46.33 },  // Santos
    { lat: -33.91, lon: 18.42 },   // Cape Town
    { lat: 25.27, lon: 55.30 },    // Dubai
    { lat: 1.29, lon: 103.85 },    // Singapore
    { lat: 31.23, lon: 121.47 },   // Shanghai
    { lat: 35.62, lon: 139.78 }    // Tokyo
  ];

  const hamburgPos = latLonToVec3(HAMBURG.lat, HAMBURG.lon, RADIUS);

  /* Hamburg marker: orange dot + pulsing ring */
  const hub = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xff5a36 })
  );
  hub.position.copy(hamburgPos);
  globe.add(hub);

  const hubRing = new THREE.Mesh(
    new THREE.RingGeometry(0.07, 0.085, 32),
    new THREE.MeshBasicMaterial({ color: 0xff5a36, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
  );
  hubRing.position.copy(hamburgPos.clone().multiplyScalar(1.01));
  hubRing.lookAt(hamburgPos.clone().multiplyScalar(2));
  globe.add(hubRing);

  /* Destination markers, arcs and moving pulses */
  const portMat = new THREE.MeshBasicMaterial({ color: 0x45d6c4 });
  const arcMat = new THREE.LineBasicMaterial({ color: 0x45d6c4, transparent: true, opacity: 0.38 });
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffb09e });
  const pulses = []; // { mesh, curve, offset, speed }

  PORTS.forEach((port, i) => {
    const end = latLonToVec3(port.lat, port.lon, RADIUS);

    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), portMat);
    marker.position.copy(end);
    globe.add(marker);

    // Great-circle-ish arc: midpoint pushed outward proportionally to distance
    const mid = hamburgPos.clone().add(end).multiplyScalar(0.5);
    const dist = hamburgPos.distanceTo(end);
    mid.normalize().multiplyScalar(RADIUS + dist * 0.36);
    const curve = new THREE.QuadraticBezierCurve3(hamburgPos, mid, end);

    const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
    globe.add(new THREE.Line(arcGeo, arcMat));

    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), pulseMat);
    globe.add(pulse);
    pulses.push({ mesh: pulse, curve, offset: i / PORTS.length, speed: 0.09 + (i % 3) * 0.025 });
  });

  /* ---------- Background starfield ---------- */
  const STAR_COUNT = 420;
  const starPositions = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(9 + Math.random() * 5);
    starPositions[i * 3] = v.x;
    starPositions[i * 3 + 1] = v.y;
    starPositions[i * 3 + 2] = v.z;
  }
  const starsGeo = new THREE.BufferGeometry();
  starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({
    color: 0x8ca0af, size: 0.02, transparent: true, opacity: 0.5
  }));
  scene.add(stars);

  /* ---------- Interaction: gentle mouse parallax ---------- */
  let targetX = 0, targetY = 0;
  if (!prefersReducedMotion) {
    window.addEventListener("pointermove", (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.35;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.22;
    }, { passive: true });
  }

  /* ---------- Resize ---------- */
  window.addEventListener("resize", () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  /* ---------- Render loop with visibility gating ---------- */
  let heroVisible = true;
  let pageVisible = !document.hidden;
  let rafId = null;
  const clock = new THREE.Clock();

  const render = () => {
    const t = clock.getElapsedTime();

    globe.rotation.y = t * 0.06;                       // slow drift
    hubRing.scale.setScalar(1 + Math.sin(t * 2.4) * 0.25);
    hubRing.material.opacity = 0.5 + Math.sin(t * 2.4) * 0.3;

    pulses.forEach((p) => {
      const u = (t * p.speed + p.offset) % 1;
      p.mesh.position.copy(p.curve.getPoint(u));
    });

    // Parallax easing toward pointer target
    camera.position.x += (1.4 + targetX - camera.position.x) * 0.04;
    camera.position.y += (0.4 - targetY - camera.position.y) * 0.04;
    camera.lookAt(1.0, 0, 0);

    renderer.render(scene, camera);
  };

  const loop = () => {
    render();
    rafId = requestAnimationFrame(loop);
  };

  const updateRunning = () => {
    const shouldRun = heroVisible && pageVisible && !prefersReducedMotion;
    if (shouldRun && rafId === null) {
      clock.start();
      rafId = requestAnimationFrame(loop);
    } else if (!shouldRun && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
    updateRunning();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      updateRunning();
    }, { threshold: 0.05 }).observe(container);
  }

  if (prefersReducedMotion) {
    render(); // single static frame, no animation
  } else {
    updateRunning();
  }
}
