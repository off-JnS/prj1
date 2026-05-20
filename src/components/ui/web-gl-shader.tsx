import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Monochrome variant of the original chromatic-distortion shader.
 * Renders silver waves on pure black. xScale / yScale / distortion uniforms
 * preserved so the look can be retuned per page.
 */
export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vertexShader = `
      attribute vec3 position;
      void main() { gl_Position = vec4(position, 1.0); }
    `;

    // Three offset wave samples become R/G/B for chromatic distortion. We
    // then blend back toward luminance with `tint` so the look stays mostly
    // monochrome with just a kiss of color on the edges of the streaks.
    const fragmentShader = `
      precision highp float;
      uniform vec2  resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      uniform float tint;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        float d = length(p) * distortion;

        float r = 0.05 / abs(p.y + sin((p.x * (1.0 + d) + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((p.x                + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((p.x * (1.0 - d) + time) * xScale) * yScale);

        vec3 col = clamp(vec3(r, g, b), 0.0, 1.0);
        // Gentle s-curve so bright streaks feel filmic, not blown out.
        col = smoothstep(vec3(0.0), vec3(1.0), col);

        // Blend toward luminance: tint=0 → grayscale, tint=1 → full chroma.
        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(vec3(lum), col, tint);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color(0x000000));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    const uniforms = {
      resolution: { value: new THREE.Vector2(1, 1) },
      time: { value: 0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.9 },
      distortion: { value: 0.18 },
      tint: { value: 0.55 },
    };

    const positions = new Float32Array([
      -1, -1, 0, 1, -1, 0, -1, 1, 0,
       1, -1, 0, -1, 1, 0,  1, 1, 0,
    ]);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Bind the renderer size to the canvas's actual rendered box rather than
    // `window.innerWidth/Height`. On mobile, the visual viewport shifts as the
    // address bar shows/hides, which would otherwise stretch the shader and
    // shove its bright streak off-center. ResizeObserver keeps the drawing
    // buffer and `gl_FragCoord` space pixel-aligned with what's on screen.
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h, false);
      uniforms.resolution.value.set(w, h);
    };
    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);

    let raf = 0;
    const animate = () => {
      if (!reduceMotion) uniforms.time.value += 0.005;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block h-full w-full"
    />
  );
}
