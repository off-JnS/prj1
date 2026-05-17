import React, { useEffect, useState } from "react";

/**
 * Wraps ldrs' <l-infinity/> custom element. ldrs registers a web component
 * we render directly so we don't ship the heavy React build.
 */
export default function InfinityLoader({
  size = 64,
  stroke = 4,
  color = "currentColor",
}: {
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("ldrs").then((mod) => {
      if (cancelled) return;
      // `infinity` is the ldrs Infinity loader; register exposes <l-infinity>.
      // The named export varies between versions; cast to any to avoid
      // tight coupling.
      const lib = mod as unknown as { infinity?: { register: () => void } };
      lib.infinity?.register?.();
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div
        aria-label="Lädt"
        style={{ width: size, height: size }}
        className="animate-pulse rounded-full border-2 border-current/30"
      />
    );
  }

  // ldrs registers <l-infinity> as a custom element. We render it as a plain
  // tag and attach attributes via React.createElement so TS doesn't complain.
  return React.createElement("l-infinity", {
    size: String(size),
    stroke: String(stroke),
    "stroke-length": "0.15",
    "bg-opacity": "0.1",
    speed: "1.3",
    color,
  });
}
