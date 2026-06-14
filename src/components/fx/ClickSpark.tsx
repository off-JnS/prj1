import { useCallback, useEffect, useRef, useState, type ReactNode, type MutableRefObject } from "react";

type Spark = { x: number; y: number; angle: number; startTime: number };

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-in-out" | "ease-out";
  extraScale?: number;
  children?: ReactNode;
}

export default function ClickSpark({
  sparkColor = "#ffffff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const dprRef = useRef(1);
  const [enabled, setEnabled] = useState(false);

  // Sparks are pointer feedback — only meaningful on hover-capable, fine-pointer
  // devices. Touch screens skip the canvas and listeners entirely, matching
  // CustomCursor so the whole cursor layer is desktop-only.
  useEffect(() => {
    if (typeof window === "undefined") return;
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [enabled]);

  const ease = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing],
  );

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const draw = (now: number) => {
      raf = 0; // allow rescheduling
      const dpr = dprRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.startTime;
        if (elapsed >= duration) return false;
        const t = elapsed / duration;
        const eased = ease(t);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      // Only keep the loop alive while sparks are visible.
      if (sparksRef.current.length > 0) {
        raf = requestAnimationFrame(draw);
      }
    };

    // Kick off a draw pass when new sparks are added.
    const scheduleIfNeeded = () => {
      if (!raf && sparksRef.current.length > 0) {
        raf = requestAnimationFrame(draw);
      }
    };

    // Expose the scheduler so the pointerdown handler can trigger it.
    (canvasRef as MutableRefObject<HTMLCanvasElement & { _scheduleIfNeeded?: () => void }>).current._scheduleIfNeeded = scheduleIfNeeded;

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, sparkColor, sparkSize, sparkRadius, duration, ease, extraScale]);

  // Listen on window so clicks on any element register, even ones with their
  // own onClick handlers (we read the event in the capture phase).
  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      const fresh: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));
      sparksRef.current.push(...fresh);
      // Wake the draw loop if it went idle between clicks.
      const canvas = canvasRef.current as HTMLCanvasElement & { _scheduleIfNeeded?: () => void };
      canvas?._scheduleIfNeeded?.();
    };
    window.addEventListener("pointerdown", onClick);
    return () => window.removeEventListener("pointerdown", onClick);
  }, [enabled, sparkCount]);

  return (
    <>
      {enabled && (
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{
            display: "block",
            userSelect: "none",
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 100,
            mixBlendMode: "difference",
          }}
        />
      )}
      {children}
    </>
  );
}
