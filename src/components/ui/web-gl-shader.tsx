import { useEffect, useRef } from "react";

/**
 * Monochrome variant of the original chromatic-distortion shader.
 * Renders silver waves on pure black. xScale / yScale / distortion uniforms
 * preserved so the look can be retuned per page.
 *
 * THREE.js is imported dynamically so it doesn't block the initial JS parse.
 */
export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Dynamic import keeps THREE out of the initial bundle evaluation path.
    import("three").then((THREE) => {
      if (cancelled || !canvas) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      const vertexShader = `
        attribute vec3 position;
        void main() { gl_Position = vec4(position, 1.0); }
      `;

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
          col = smoothstep(vec3(0.0), vec3(1.0), col);

          float lum = dot(col, vec3(0.299, 0.587, 0.114));
          col = mix(vec3(lum), col, tint);

          gl_FragColor = vec4(col, 1.0);
        }
      `;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile });
      // Cap DPR at 1.5 on mobile to reduce fragment shader work.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setClearColor(new THREE.Color(0x000000));

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

      const uniforms = {
        resolution: { value: new THREE.Vector2(1, 1) },
        time: { value: 0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.12 },
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
      // On mobile: render at ~30 fps by skipping every other frame.
      let frameCount = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (isMobile && frameCount++ % 2 !== 0) return;
        if (!reduceMotion) uniforms.time.value += 0.005;
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        scene.remove(mesh);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
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
