import { useEffect, useRef, useState } from "react";

/**
 * Monochrome WebGL backdrop: three interfering light threads drifting across
 * black in warm paper tone. Written against raw WebGL (a
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
  float c = light(gl_FragCoord.xy);

  /* Hash dither so the dark falloff doesn't band. */
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  c = clamp(c + (n - 0.5) * 0.016, 0.0, 1.0);

  /* Paper tone instead of pure white: warm like the page texture. */
  vec3 paper = vec3(0.955, 0.94, 0.905);
  gl_FragColor = vec4(paper * c, 1.0);
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

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lost = false;
    let visible = true;
    let pageVisible = !document.hidden;
    const start = performance.now();

    const resize = () => {
      // The shader is fill-rate bound and the threads are soft glows, so
      // full retina resolution buys nothing visible.
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
