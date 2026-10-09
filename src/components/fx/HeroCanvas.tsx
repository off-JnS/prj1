import { useEffect, useRef, useState } from "react";

/**
 * Monochrome WebGL backdrop: three interfering light threads drifting across
 * black, printed through a 45° halftone screen in paper tone — the same
 * newsprint language as the page texture. Written against raw WebGL (a
 * fullscreen triangle + one fragment shader) so we don't ship a 3D engine
 * for a 2D effect.
 *
 * Power behaviour: pauses off-screen and on hidden tabs; reduced-motion
 * renders a single static frame.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_cell;

float thread(vec2 p, float t, float freq, float amp, float thick) {
  return thick / abs(p.y + sin((p.x + t) * freq) * amp);
}

float light(vec2 frag) {
  vec2 p = (frag * 2.0 - u_res) / min(u_res.x, u_res.y);
  float t = u_time * 0.32;

  float l = 0.0;
  l += thread(p, t,              1.0, 0.50, 0.012);
  l += thread(p, t * 1.45 + 2.3, 1.6, 0.30, 0.006);
  l += thread(p, -t * 0.8 + 5.1, 0.7, 0.62, 0.003);

  float vig = 1.0 - 0.5 * dot(p * 0.6, p * 0.6);
  return clamp(l * vig, 0.0, 1.0);
}

void main() {
  /* Rotate into screen space, find this pixel's cell, sample the light at
     the cell centre and print one dot whose area tracks that value. */
  const float S = 0.70710678;
  mat2 toScreen = mat2(S, S, -S, S);
  mat2 fromScreen = mat2(S, -S, S, S);

  vec2 q = toScreen * gl_FragCoord.xy / u_cell;
  vec2 cell = floor(q) + 0.5;
  /* Small floor keeps the deep blacks paper-free, like unprinted stock. */
  float v = max(light(fromScreen * (cell * u_cell)) - 0.02, 0.0);

  float r = sqrt(v) * 0.68;
  float d = length(q - cell);
  float aa = 0.75 / u_cell;
  float dotMask = 1.0 - smoothstep(r - aa, r + aa, d);

  vec3 paper = vec3(0.955, 0.94, 0.905);
  gl_FragColor = vec4(paper * dotMask, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Bumped when the GPU restores a lost context: remounting the canvas is
  // the simplest way to rebuild every GL resource.
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const program = gl.createProgram()!;
    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    // Flagged for deletion; freed together with the program.
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uCell = gl.getUniformLocation(program, "u_cell");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lost = false;
    let visible = true;
    let pageVisible = !document.hidden;
    const start = performance.now();

    const resize = () => {
      // The shader is fill-rate bound; past ~1.5× the halftone dots gain
      // nothing visible, so don't pay for full retina resolution.
      const cap = window.innerWidth < 768 ? 1.25 : 1.5;
      const dpr = Math.min(window.devicePixelRatio || 1, cap);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w === 0 || h === 0) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
      // Halftone cell in CSS px — coarser on phones so dots stay visible.
      gl.uniform1f(uCell, (window.innerWidth < 768 ? 5 : 6) * dpr);
    };

    const frame = () => {
      raf = 0;
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduceMotion && visible && pageVisible) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && !lost) raf = requestAnimationFrame(frame);
    };

    resize();
    kick();

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) kick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onLost = (e: Event) => {
      e.preventDefault(); // signals we can handle a restore
      lost = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const onRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      if (lost) return;
      // Free resources but keep the context alive: StrictMode/HMR remount
      // on the same canvas, and getContext() would hand back a lost one.
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, [generation]);

  return (
    <canvas
      key={generation}
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
